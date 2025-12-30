import { useState, useEffect } from 'react';
import { User } from '../App';
import { api, Lab as BackendLab, Research as BackendResearch } from '../services/api';
import { Beaker, FlaskConical, Calendar, MapPin, Users, Loader2, AlertCircle, Clock, X, Plus, CheckCircle } from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
}

interface LabReservation {
  labReservationId: number;
  lab: BackendLab;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [researchLabs, setResearchLabs] = useState<BackendLab[]>([]);
  const [myResearch, setMyResearch] = useState<BackendResearch[]>([]);
  const [myReservations, setMyReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedLab, setSelectedLab] = useState<BackendLab | null>(null);
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user.email]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Research Labs (255 and 256)
      const allLabs: BackendLab[] = await api.get('/labs');
      const researchLabsOnly = allLabs.filter(lab => lab.labId === 255 || lab.labId === 256);
      setResearchLabs(researchLabsOnly);

      // Fetch my research projects
      const allResearch: BackendResearch[] = await api.get('/research');
      const myResearchProjects = allResearch.filter(r => r.doctorEmail === user.email);
      setMyResearch(myResearchProjects);

      // Fetch my lab reservations
      const doctorId = parseInt(user.id);
      const reservations: LabReservation[] = await api.get(`/lab-reservations/doctor/${doctorId}`).catch(() => []);
      setMyReservations(reservations);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveLab = (lab: BackendLab) => {
    setSelectedLab(lab);
    setShowReservationForm(true);
    setFormError(null);
    setReservationDate('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab) return;

    setFormError(null);
    setSubmitting(true);

    try {
      // Check availability first
      const isAvailable = await api.get(
        `/lab-reservations/check-availability?labId=${selectedLab.labId}&date=${reservationDate}&startTime=${startTime}&endTime=${endTime}`
      );

      if (!isAvailable) {
        setFormError('Lab is not available at the requested time. Please choose a different time.');
        setSubmitting(false);
        return;
      }

      // Create reservation
      await api.post('/lab-reservations', {
        labId: selectedLab.labId,
        doctorId: parseInt(user.id),
        date: reservationDate,
        startTime: startTime,
        endTime: endTime,
        purpose: purpose || 'Research work',
      });

      // Reset form
      setShowReservationForm(false);
      setSelectedLab(null);
      setReservationDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');

      // Refresh data
      await fetchData();
      alert('Lab reservation submitted successfully! It is pending approval.');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5B9BD5] dark:text-[#8BB4D9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] dark:from-[#2F3541] dark:to-[#252932] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-4">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome, Dr. {user.name}</h2>
            <p className="text-white/90">Research Laboratory Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#252932] rounded-lg p-6 shadow-md border border-[#CBD5E0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718096] dark:text-[#B0B0B0] text-sm font-medium">Research Labs</p>
              <p className="text-3xl font-bold text-[#5B9BD5] dark:text-[#8BB4D9] mt-2">{researchLabs.length}</p>
            </div>
            <Beaker className="w-12 h-12 text-[#5B9BD5] dark:text-[#8BB4D9] opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#252932] rounded-lg p-6 shadow-md border border-[#CBD5E0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718096] dark:text-[#B0B0B0] text-sm font-medium">My Research Projects</p>
              <p className="text-3xl font-bold text-[#FF9F66] dark:text-[#FF9F66] mt-2">{myResearch.length}</p>
            </div>
            <FlaskConical className="w-12 h-12 text-[#FF9F66] opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#252932] rounded-lg p-6 shadow-md border border-[#CBD5E0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718096] dark:text-[#B0B0B0] text-sm font-medium">Available Labs</p>
              <p className="text-3xl font-bold text-[#52C9A2] dark:text-[#52C9A2] mt-2">{researchLabs.length}</p>
            </div>
            <MapPin className="w-12 h-12 text-[#52C9A2] opacity-20" />
          </div>
        </div>
      </div>

      {/* Research Labs Section */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow-md border border-[#CBD5E0] dark:border-[#3A4150] p-6">
        <h3 className="text-xl font-semibold text-[#2D3748] dark:text-[#E8E8E8] mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-[#5B9BD5] dark:text-[#8BB4D9]" />
          Research Laboratories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchLabs.map((lab) => (
            <div
              key={lab.labId}
              className="border-2 border-[#CBD5E0] dark:border-[#3A4150] rounded-lg p-4 hover:border-[#5B9BD5] dark:hover:border-[#8BB4D9] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#2D3748] dark:text-[#E8E8E8]">{lab.labName}</h4>
                  <div className="mt-2 space-y-1 text-sm text-[#718096] dark:text-[#B0B0B0]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{lab.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {lab.capacity}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#E3EDF5] dark:bg-[#3A4150] text-[#5B9BD5] dark:text-[#8BB4D9] rounded-full text-xs font-medium">
                  Lab {lab.labId}
                </span>
              </div>
              <button
                onClick={() => handleReserveLab(lab)}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Reserve Lab
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Research Projects */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow-md border border-[#CBD5E0] dark:border-[#3A4150] p-6">
        <h3 className="text-xl font-semibold text-[#2D3748] dark:text-[#E8E8E8] mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#FF9F66]" />
          My Research Projects
        </h3>
        {myResearch.length === 0 ? (
          <div className="text-center py-8 text-[#718096] dark:text-[#B0B0B0]">
            <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No research projects found for your email.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myResearch.map((research) => (
              <div
                key={research.researchId}
                className="border-2 border-[#CBD5E0] dark:border-[#3A4150] rounded-lg p-4 hover:border-[#5B9BD5] dark:hover:border-[#8BB4D9] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2D3748] dark:text-[#E8E8E8]">
                      {research.title || 'Untitled Research'}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-[#718096] dark:text-[#B0B0B0]">
                      <div className="flex items-center gap-2">
                        <Beaker className="w-4 h-4" />
                        <span>Lab: {research.lab?.labName || 'Unknown'}</span>
                      </div>
                      {research.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(research.startDate).toLocaleDateString()}
                            {research.endDate && ` - ${new Date(research.endDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Lab Reservations */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow-md border border-[#CBD5E0] dark:border-[#3A4150] p-6">
        <h3 className="text-xl font-semibold text-[#2D3748] dark:text-[#E8E8E8] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#5B9BD5] dark:text-[#8BB4D9]" />
          My Lab Reservations
        </h3>
        {myReservations.length === 0 ? (
          <div className="text-center py-8 text-[#718096] dark:text-[#B0B0B0]">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No lab reservations yet. Reserve a lab to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myReservations.map((reservation) => (
              <div
                key={reservation.labReservationId}
                className="border-2 border-[#CBD5E0] dark:border-[#3A4150] rounded-lg p-4 hover:border-[#5B9BD5] dark:hover:border-[#8BB4D9] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[#2D3748] dark:text-[#E8E8E8]">
                        {reservation.lab?.labName || 'Unknown Lab'}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : reservation.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-[#718096] dark:text-[#B0B0B0]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {reservation.startTime} - {reservation.endTime}
                        </span>
                      </div>
                      {reservation.purpose && (
                        <p className="mt-2 text-[#2D3748] dark:text-[#E8E8E8]">{reservation.purpose}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#252932] rounded-lg shadow-xl max-w-md w-full p-6 border border-[#CBD5E0] dark:border-[#3A4150]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#2D3748] dark:text-[#E8E8E8]">
                Reserve {selectedLab.labName}
              </h3>
              <button
                onClick={() => {
                  setShowReservationForm(false);
                  setSelectedLab(null);
                  setFormError(null);
                }}
                className="text-[#718096] dark:text-[#B0B0B0] hover:text-[#2D3748] dark:hover:text-[#E8E8E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitReservation} className="space-y-4">
              <div>
                <label className="block text-[#2D3748] dark:text-[#E8E8E8] mb-2 font-medium">Date</label>
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
                  <label className="block text-[#2D3748] dark:text-[#E8E8E8] mb-2 font-medium">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    min="08:00"
                    max="18:00"
                    className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                  />
                </div>
                <div>
                  <label className="block text-[#2D3748] dark:text-[#E8E8E8] mb-2 font-medium">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    min="08:00"
                    max="18:00"
                    className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D3748] dark:text-[#E8E8E8] mb-2 font-medium">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the purpose of this reservation..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReservationForm(false);
                    setSelectedLab(null);
                    setFormError(null);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-[#CBD5E0] dark:border-[#3A4150] text-[#2D3748] dark:text-[#E8E8E8] rounded-lg hover:bg-[#EBF2F7] dark:hover:bg-[#3A4150] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Reservation
                    </>
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

