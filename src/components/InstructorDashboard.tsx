import { useState, useEffect } from 'react';
import { Beaker, Package, CheckCircle, XCircle, Plus, Edit, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { User as UserType } from '../App';
import { api } from '../services/api';

interface InstructorDashboardProps {
  user: UserType;
}

interface Lab {
  labId: number;
  labName: string;
  location: string;
  capacity: number;
  requiredLevel: number;
  instructor?: {
    instructorId: number;
    instructorName: string;
    instructorEmail: string;
  };
  equipmentList?: Equipment[];
}

interface Equipment {
  equipmentName: string;
  status: string;
  lab?: Lab;
}

interface Reservation {
  reservationId: number;
  equipment: Equipment;
  student: {
    studentId: number;
    name: string;
    email: string;
  };
  supervisor?: {
    instructorId: number;
    instructorName: string;
  };
  date: string;
  time: string;
  duration: number;
  purpose: string;
  reservationType: string;
  teamSize: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function InstructorDashboard({ user }: InstructorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'labs' | 'equipment' | 'reservations'>('labs');
  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState({ equipmentName: '', status: 'Available' });

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const instructorId = parseInt(user.id);
      
      const [labsData, reservationsData] = await Promise.all([
        api.get(`/labs/instructor/${instructorId}`).catch(() => []),
        api.get('/reservations/pending').catch(() => []),
      ]);

      setLabs(labsData);
      
      // Filter reservations for equipment in instructor's labs
      const labIds = labsData.map((l: Lab) => l.labId);
      const allEquipment = await Promise.all(
        labIds.map((id: number) => api.get(`/equipment/lab/${id}`).catch(() => []))
      );
      const flatEquipment = allEquipment.flat();
      setEquipment(flatEquipment);
      
      // Filter reservations for equipment in instructor's labs
      const equipmentNames = flatEquipment.map((e: Equipment) => e.equipmentName);
      const filteredReservations = reservationsData.filter((r: Reservation) => 
        equipmentNames.includes(r.equipment.equipmentName)
      );
      setReservations(filteredReservations);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReservation = async (reservationId: number) => {
    try {
      await api.post(`/reservations/${reservationId}/approve`, {});
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to approve reservation');
    }
  };

  const handleRejectReservation = async (reservationId: number) => {
    try {
      await api.post(`/reservations/${reservationId}/reject`, {});
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to reject reservation');
    }
  };

  const handleAddEquipment = async () => {
    if (!selectedLab || !newEquipment.equipmentName) return;
    
    try {
      await api.post('/equipment', {
        equipmentName: newEquipment.equipmentName,
        status: newEquipment.status,
        lab: { labId: selectedLab.labId }
      });
      setShowAddEquipment(false);
      setNewEquipment({ equipmentName: '', status: 'Available' });
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to add equipment');
    }
  };

  const handleUpdateEquipmentStatus = async (equipmentName: string, status: string) => {
    try {
      // Using PATCH endpoint
      const response = await fetch(`http://localhost:8080/api/equipment/${encodeURIComponent(equipmentName)}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update equipment status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#51829B] dark:text-[#9BB0C1] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6BA3C4] to-[#A8C5D9] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg shadow-lg p-6">
        <h1 className="text-white mb-2 font-bold">Instructor Dashboard</h1>
        <p className="text-white/90 dark:text-[#9BB0C1]">Manage your labs, equipment, and reservations</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-[#D4E3F0] dark:border-[#3A4150]">
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'labs'
              ? 'border-[#F6995C] text-[#51829B] dark:text-[#9BB0C1] font-semibold'
              : 'border-transparent text-[#6B8A9F] dark:text-[#B0B0B0] hover:text-[#51829B] dark:hover:text-[#9BB0C1]'
          }`}
        >
          <Beaker className="w-4 h-4 inline mr-2" />
          My Labs ({labs.length})
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'equipment'
              ? 'border-[#F6995C] text-[#51829B] dark:text-[#9BB0C1] font-semibold'
              : 'border-transparent text-[#6B8A9F] dark:text-[#B0B0B0] hover:text-[#51829B] dark:hover:text-[#9BB0C1]'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Equipment ({equipment.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'reservations'
              ? 'border-[#F6995C] text-[#51829B] dark:text-[#9BB0C1] font-semibold'
              : 'border-transparent text-[#6B8A9F] dark:text-[#B0B0B0] hover:text-[#51829B] dark:hover:text-[#9BB0C1]'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Pending Reservations ({reservations.length})
        </button>
      </div>

      {/* Labs Tab */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          {labs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#252932] rounded-lg border-2 border-[#D4E3F0] dark:border-[#3A4150]">
              <Beaker className="w-12 h-12 text-[#A8C5D9] dark:text-gray-400 mx-auto mb-4" />
              <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">No labs assigned to you</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab) => (
                <div
                  key={lab.labId}
                  className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150] hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[#51829B] dark:text-[#9BB0C1] text-lg font-semibold">{lab.labName}</h3>
                      <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm">{lab.location}</p>
                    </div>
                    <Beaker className="w-6 h-6 text-[#51829B] dark:text-[#9BB0C1]" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">
                      <span className="font-semibold text-[#4A6B7F] dark:text-white">Capacity:</span> {lab.capacity}
                    </p>
                    <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">
                      <span className="font-semibold text-[#4A6B7F] dark:text-white">Required Level:</span> {lab.requiredLevel}
                    </p>
                    <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">
                      <span className="font-semibold text-[#4A6B7F] dark:text-white">Equipment:</span> {lab.equipmentList?.length || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[#51829B] dark:text-[#9BB0C1]">Equipment Management</h2>
            <button
              onClick={() => setShowAddEquipment(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F6995C] to-[#51829B] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
          </div>

          {showAddEquipment && (
            <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]">
              <h3 className="mb-4 text-[#51829B] dark:text-[#9BB0C1] font-semibold">Add New Equipment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Select Lab</label>
                  <select
                    value={selectedLab?.labId || ''}
                    onChange={(e) => {
                      const lab = labs.find(l => l.labId === parseInt(e.target.value));
                      setSelectedLab(lab || null);
                    }}
                    className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                  >
                    <option value="">Select a lab</option>
                    {labs.map(lab => (
                      <option key={lab.labId} value={lab.labId}>{lab.labName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Equipment Name</label>
                  <input
                    type="text"
                    value={newEquipment.equipmentName}
                    onChange={(e) => setNewEquipment({ ...newEquipment, equipmentName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                    placeholder="Enter equipment name"
                  />
                </div>
                <div>
                  <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Status</label>
                  <select
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddEquipment}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F6995C] to-[#6BA3C4] text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Equipment
                  </button>
                  <button
                    onClick={() => {
                      setShowAddEquipment(false);
                      setNewEquipment({ equipmentName: '', status: 'Available' });
                      setSelectedLab(null);
                    }}
                    className="px-4 py-2 bg-[#E8F0F5] dark:bg-[#3A4150] text-[#4A6B7F] dark:text-[#B0B0B0] rounded-lg hover:bg-[#D4E3F0] dark:hover:bg-[#4A5568] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq.equipmentName}
                className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-4 border-2 border-[#D4E3F0] dark:border-[#3A4150]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-[#51829B] dark:text-[#9BB0C1] font-semibold">{eq.equipmentName}</h4>
                    <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm">{eq.lab?.labName}</p>
                  </div>
                  <Package className="w-5 h-5 text-[#51829B] dark:text-[#9BB0C1]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    eq.status === 'Available' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : eq.status === 'Unavailable'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                  }`}>
                    {eq.status}
                  </span>
                  <select
                    value={eq.status}
                    onChange={(e) => handleUpdateEquipmentStatus(eq.equipmentName, e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#252932] rounded-lg border-2 border-[#D4E3F0] dark:border-[#3A4150]">
              <Calendar className="w-12 h-12 text-[#A8C5D9] dark:text-gray-400 mx-auto mb-4" />
              <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">No pending reservations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.reservationId}
                  className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-[#51829B] dark:text-[#9BB0C1]" />
                        <h3 className="text-[#51829B] dark:text-[#9BB0C1] font-semibold">
                          {reservation.equipment.equipmentName}
                        </h3>
                      </div>
                      <div className="space-y-1 text-sm text-[#6B8A9F] dark:text-[#B0B0B0]">
                        <p><User className="w-4 h-4 inline mr-2" />{reservation.student.name} ({reservation.student.email})</p>
                        <p><Calendar className="w-4 h-4 inline mr-2" />{reservation.date}</p>
                        <p><Clock className="w-4 h-4 inline mr-2" />{reservation.time} ({reservation.duration} hours)</p>
                        <p><span className="font-semibold text-[#4A6B7F] dark:text-white">Purpose:</span> {reservation.purpose}</p>
                        <p><span className="font-semibold text-[#4A6B7F] dark:text-white">Team Size:</span> {reservation.teamSize}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      reservation.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : reservation.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  {reservation.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveReservation(reservation.reservationId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReservation(reservation.reservationId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

