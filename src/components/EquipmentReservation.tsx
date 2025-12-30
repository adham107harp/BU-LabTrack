import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Loader2, X } from 'lucide-react';
import { User } from '../App';
import { api, Equipment as BackendEquipment, Reservation as BackendReservation, CreateReservationRequest } from '../services/api';

interface Equipment {
  id: number;
  name: string;
  category: string;
  lab: string;
  labId: number;
  available: number;
  total: number;
  status: string;
}

interface Reservation {
  id: number;
  equipmentId: number;
  equipmentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface EquipmentReservationProps {
  user: User;
}

export function EquipmentReservation({ user }: EquipmentReservationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch equipment from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendEquipment: BackendEquipment[] = await api.get('/equipment');
        
        // Map backend equipment to frontend format
        // Group by lab and count availability
        const equipmentMap = new Map<string, Equipment>();
        
        backendEquipment.forEach((eq) => {
          const key = eq.equipmentName;
          if (!equipmentMap.has(key)) {
            equipmentMap.set(key, {
              id: equipmentMap.size + 1,
              name: eq.equipmentName,
              category: eq.lab?.labName || 'Unknown',
              lab: eq.lab?.labName || 'Unknown',
              labId: eq.lab?.labId || 0,
              available: eq.status === 'Available' ? 1 : 0,
              total: 1, // Backend doesn't track quantity, defaulting to 1
              status: eq.status,
            });
          } else {
            const existing = equipmentMap.get(key)!;
            if (eq.status === 'Available') {
              existing.available += 1;
            }
            existing.total += 1;
          }
        });

        setEquipment(Array.from(equipmentMap.values()));
      } catch (err: any) {
        setError(err.message || 'Failed to load equipment');
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Fetch user's reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const backendReservations: BackendReservation[] = await api.get(`/reservations/student/${user.id}`);
        
        // Map backend reservations to frontend format
        const mappedReservations: Reservation[] = backendReservations.map((res) => {
          const timeStr = res.time || '00:00';
          const duration = res.duration || 60; // Default 60 minutes
          const [hours, minutes] = timeStr.split(':').map(Number);
          const endTimeDate = new Date();
          endTimeDate.setHours(hours, minutes + duration, 0);
          const endTimeStr = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;

          return {
            id: res.reservationId,
            equipmentId: res.equipment?.equipmentName ? 1 : 0, // Simplified
            equipmentName: res.equipment?.equipmentName || 'Unknown',
            date: res.date || '',
            startTime: timeStr,
            endTime: endTimeStr,
            status: res.status?.toLowerCase() as 'pending' | 'approved' | 'rejected' || 'pending',
          };
        });

        setMyReservations(mappedReservations);
      } catch (err: any) {
        console.error('Error fetching reservations:', err);
      }
    };

    if (user.id) {
      fetchReservations();
    }
  }, [user.id]);

  // Check if equipment was selected from LabRooms
  useEffect(() => {
    const selectedFromLab = localStorage.getItem('selectedEquipment');
    if (selectedFromLab) {
      try {
        const equipmentData = JSON.parse(selectedFromLab);
        const matchingEquipment = equipment.find(e => e.name === equipmentData.name);
        if (matchingEquipment) {
          setSelectedEquipment(matchingEquipment);
          setShowReservationForm(true);
        }
      } catch (err) {
        console.error('Error parsing selected equipment:', err);
      }
      localStorage.removeItem('selectedEquipment');
    }
  }, [equipment]);

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReserve = (item: Equipment) => {
    setSelectedEquipment(item);
    setShowReservationForm(true);
    setFormError(null);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    setFormError(null);
    setSubmitting(true);

    try {
      // Check availability first
      const isAvailable = await api.get(
        `/reservations/check-availability?equipmentName=${encodeURIComponent(selectedEquipment.name)}&date=${reservationDate}&startTime=${startTime}&endTime=${endTime}`
      );

      if (!isAvailable) {
        setFormError('Equipment is not available at the requested time. Please choose a different time.');
        setSubmitting(false);
        return;
      }

      // Calculate duration in minutes
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;
      const duration = endTotal - startTotal;

      if (duration <= 0) {
        setFormError('End time must be after start time.');
        setSubmitting(false);
        return;
      }

      // Validate school hours (8:00 AM - 6:00 PM)
      const schoolStart = 8 * 60; // 8:00 AM in minutes
      const schoolEnd = 18 * 60; // 6:00 PM in minutes
      
      if (startTotal < schoolStart || startTotal > schoolEnd) {
        setFormError('Reservations can only be made during school hours (8:00 AM - 6:00 PM).');
        setSubmitting(false);
        return;
      }
      
      if (endTotal < schoolStart || endTotal > schoolEnd) {
        setFormError('Reservation end time must be within school hours (8:00 AM - 6:00 PM).');
        setSubmitting(false);
        return;
      }

      // Create reservation request
      // Date should already be in YYYY-MM-DD format from input type="date"
      // Time should already be in HH:mm format from input type="time"
      const reservationRequest: CreateReservationRequest = {
        equipmentName: selectedEquipment.name,
        studentId: parseInt(user.id),
        date: reservationDate, // Already in YYYY-MM-DD format
        time: startTime, // Already in HH:mm format (24-hour)
        duration,
        purpose: purpose || 'General use',
        reservationType: 'EQUIPMENT',
        teamSize,
      };

      await api.post('/reservations', reservationRequest);

      // Reset form
      setShowReservationForm(false);
      setReservationDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      setTeamSize(1);
      setSelectedEquipment(null);

      // Refresh reservations
      const backendReservations: BackendReservation[] = await api.get(`/reservations/student/${user.id}`);
      const mappedReservations: Reservation[] = backendReservations.map((res) => {
        const timeStr = res.time || '00:00';
        const duration = res.duration || 60;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const endTimeDate = new Date();
        endTimeDate.setHours(hours, minutes + duration, 0);
        const endTimeStr = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;

        return {
          id: res.reservationId,
          equipmentId: 1,
          equipmentName: res.equipment?.equipmentName || 'Unknown',
          date: res.date || '',
          startTime: timeStr,
          endTime: endTimeStr,
          status: res.status?.toLowerCase() as 'pending' | 'approved' | 'rejected' || 'pending',
        };
      });
      setMyReservations(mappedReservations);

      alert('Reservation submitted successfully! It is pending approval.');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit reservation. Please try again.');
      console.error('Error submitting reservation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-[#5B9BD5] dark:text-[#8BB4D9] font-bold">Equipment Reservation</h1>
        <p className="text-[#6B8A9F] dark:text-[#B0B0B0] mt-1">Reserve laboratory equipment for your experiments and projects</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* My Reservations */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow border-2 border-[#CBD5E0] dark:border-[#3A4150]">
        <div className="p-6 border-b-2 border-[#CBD5E0] dark:border-[#3A4150]">
          <h2 className="text-[#5B9BD5] dark:text-[#8BB4D9] font-semibold">My Reservations</h2>
        </div>
        <div className="p-6">
          {myReservations.length === 0 ? (
            <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-center py-8">No reservations yet</p>
          ) : (
            <div className="space-y-3">
              {myReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 bg-[#F5F9FC] dark:bg-[#2F3541] rounded-lg border-2 border-[#CBD5E0] dark:border-[#3A4150]">
                  <div>
                    <p className="text-[#2D3748] dark:text-white font-medium">{reservation.equipmentName}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#6B8A9F] dark:text-[#B0B0B0]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {reservation.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow p-4 border-2 border-[#CBD5E0] dark:border-[#3A4150]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B8A9F] dark:text-[#B0B0B0] w-5 h-5" />
          <input
            type="text"
            placeholder="Search equipment by name, category, or lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#5B9BD5] dark:text-[#8BB4D9] animate-spin" />
          <span className="ml-3 text-[#6B8A9F] dark:text-[#B0B0B0]">Loading equipment...</span>
        </div>
      )}

      {/* Equipment Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#6B8A9F] dark:text-[#B0B0B0]">
              {searchTerm ? 'No equipment found matching your search.' : 'No equipment available.'}
            </div>
          ) : (
            filteredEquipment.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#252932] rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-[#CBD5E0] dark:border-[#3A4150] animate-scaleIn"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <div className="p-6">
                  <h3 className="mb-1 text-[#5B9BD5] dark:text-[#8BB4D9] font-semibold">{item.name}</h3>
                  <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm mb-4">{item.category}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#6B8A9F] dark:text-[#B0B0B0]">Lab:</span>
                      <span className="text-[#2D3748] dark:text-white font-medium">{item.lab}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B8A9F] dark:text-[#B0B0B0]">Available:</span>
                      <span className={item.available === 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400 font-semibold'}>
                        {item.available} / {item.total}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReserve(item)}
                    disabled={item.available === 0}
                    className={`w-full px-4 py-2 rounded-lg transition-all ${
                      item.available === 0
                        ? 'bg-gray-200 dark:bg-[#2F3541] text-gray-500 dark:text-[#6B6B6B] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FF9F66] to-[#5B9BD5] text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {item.available === 0 ? 'Not Available' : 'Reserve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reservation Form Modal */}
      {showReservationForm && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#252932] rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-[#FF9F66] animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#5B9BD5] dark:text-[#8BB4D9]">Reserve {selectedEquipment.name}</h2>
              <button
                onClick={() => {
                  setShowReservationForm(false);
                  setFormError(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmitReservation} className="space-y-4">
              <div>
                <label className="block text-[#2D3748] dark:text-[#B0B0B0] mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2D3748] dark:text-[#B0B0B0] mb-2 font-medium">Start Time (8:00 AM - 6:00 PM)</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min="08:00"
                    max="18:00"
                    required
                    className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                  />
                  <p className="text-xs text-[#6B8A9F] dark:text-[#6B6B6B] mt-1">School hours: 8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <label className="block text-[#2D3748] dark:text-[#B0B0B0] mb-2 font-medium">End Time (8:00 AM - 6:00 PM)</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min="08:00"
                    max="18:00"
                    required
                    className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                  />
                  <p className="text-xs text-[#6B8A9F] dark:text-[#6B6B6B] mt-1">Must be after start time</p>
                </div>
              </div>

              <div>
                <label className="block text-[#2D3748] dark:text-[#B0B0B0] mb-2 font-medium">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the purpose of this reservation..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                />
              </div>

              <div>
                <label className="block text-[#2D3748] dark:text-[#B0B0B0] mb-2 font-medium">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                  required
                  className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReservationForm(false);
                    setFormError(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#E3EDF5] dark:bg-[#2F3541] text-[#2D3748] dark:text-[#B0B0B0] rounded-lg hover:bg-[#CBD5E0] dark:hover:bg-[#3A4150] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF9F66] to-[#5B9BD5] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Reservation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
