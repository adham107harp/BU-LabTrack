import { useState, useEffect } from 'react';
import { Beaker, Package, CheckCircle, X, Plus, Edit, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../App';
import { api, Lab, Equipment, Reservation } from '../services/api';

interface InstructorDashboardProps {
  user: User;
}

export function InstructorDashboard({ user }: InstructorDashboardProps) {
  const [myLabs, setMyLabs] = useState<Lab[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [equipmentStatus, setEquipmentStatus] = useState<'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE'>('AVAILABLE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all labs and filter by instructor
      const allLabs: Lab[] = await api.get('/labs');
      const instructorLabs = allLabs.filter(lab => 
        lab.instructor?.instructorId === parseInt(user.id)
      );
      setMyLabs(instructorLabs);

      // Fetch pending reservations
      const allReservations: Reservation[] = await api.get('/reservations');
      const pending = allReservations.filter(res => 
        res.status === 'PENDING' && 
        myLabs.some(lab => lab.labId === res.equipment.lab?.labId)
      );
      setPendingReservations(pending);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReservation = async (reservationId: number) => {
    try {
      await api.put(`/reservations/${reservationId}/approve`, {});
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve reservation');
    }
  };

  const handleRejectReservation = async (reservationId: number) => {
    try {
      await api.put(`/reservations/${reservationId}/reject`, {});
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject reservation');
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab || !newEquipmentName) return;

    try {
      await api.post('/equipment', {
        equipmentName: newEquipmentName,
        labId: selectedLab.labId,
        status: equipmentStatus,
      });
      setShowAddEquipment(false);
      setNewEquipmentName('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to add equipment');
    }
  };

  const handleUpdateEquipmentStatus = async (equipmentName: string, newStatus: string) => {
    try {
      await api.put(`/equipment/${equipmentName}/status`, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update equipment status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#1E3A5F] dark:text-[#2C5282] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg shadow-lg p-6">
        <h1 className="text-white mb-2">Welcome, {user.name}!</h1>
        <p className="text-white/90 dark:text-[#2C5282]">Manage your labs and approve reservations</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">My Labs</p>
              <p className="text-3xl font-bold text-[#1E3A5F] dark:text-[#2C5282] mt-2">{myLabs.length}</p>
            </div>
            <Beaker className="w-12 h-12 text-[#1E3A5F] dark:text-[#2C5282] opacity-20" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Pending Reservations</p>
              <p className="text-3xl font-bold text-[#E53E3E] dark:text-[#E53E3E] mt-2">{pendingReservations.length}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-[#E53E3E] opacity-20" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Total Equipment</p>
              <p className="text-3xl font-bold text-[#52C9A2] dark:text-[#52C9A2] mt-2">
                {myLabs.reduce((sum, lab) => sum + (lab.equipmentList?.length || 0), 0)}
              </p>
            </div>
            <Package className="w-12 h-12 text-[#52C9A2] opacity-20" />
          </div>
        </div>
      </div>

      {/* My Labs */}
      <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg border-2 border-[#E2E8F0] dark:border-[#3A4150] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1A202C] dark:text-[#E8E8E8]">My Labs</h2>
        </div>

        {myLabs.length === 0 ? (
          <p className="text-center py-8 text-[#2D3748] dark:text-[#B0B0B0]">No labs assigned to you</p>
        ) : (
          <div className="space-y-4">
            {myLabs.map((lab) => (
              <div key={lab.labId} className="border-2 border-[#E2E8F0] dark:border-[#3A4150] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1A202C] dark:text-[#E8E8E8]">{lab.labName}</h3>
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0]">{lab.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedLab(lab);
                        setShowAddEquipment(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-[#1E3A5F] dark:bg-[#2C5282] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Equipment
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-[#1A202C] dark:text-[#E8E8E8] mb-2">Equipment:</h4>
                  {lab.equipmentList && lab.equipmentList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {lab.equipmentList.map((eq, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#FFFFFF] dark:bg-[#2F3541] rounded">
                          <span className="text-sm text-[#1A202C] dark:text-[#E8E8E8]">{eq.equipmentName}</span>
                          <select
                            value={eq.status}
                            onChange={(e) => handleUpdateEquipmentStatus(eq.equipmentName, e.target.value)}
                            className="text-xs px-2 py-1 border border-[#E2E8F0] dark:border-[#3A4150] rounded bg-[#FFFFFF] dark:bg-[#252932] text-[#1A202C] dark:text-[#E8E8E8]"
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                            <option value="MAINTENANCE">Maintenance</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0]">No equipment in this lab</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Reservations */}
      <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg border-2 border-[#E2E8F0] dark:border-[#3A4150] p-6">
        <h2 className="text-xl font-semibold text-[#1A202C] dark:text-[#E8E8E8] mb-4">Pending Reservations</h2>

        {pendingReservations.length === 0 ? (
          <p className="text-center py-8 text-[#2D3748] dark:text-[#B0B0B0]">No pending reservations</p>
        ) : (
          <div className="space-y-4">
            {pendingReservations.map((reservation) => (
              <div key={reservation.reservationId} className="border-2 border-[#E2E8F0] dark:border-[#3A4150] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1A202C] dark:text-[#E8E8E8]">{reservation.equipment.equipmentName}</h3>
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0]">
                      Student: {reservation.student.name} ({reservation.student.email})
                    </p>
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0]">
                      Date: {reservation.date} | Time: {reservation.time} | Duration: {reservation.duration} hours
                    </p>
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0] mt-1">Purpose: {reservation.purpose}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReservation(reservation.reservationId)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectReservation(reservation.reservationId)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Equipment Modal */}
      {showAddEquipment && selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
            <h3 className="text-xl font-semibold text-[#1A202C] dark:text-[#E8E8E8] mb-4">Add Equipment to {selectedLab.labName}</h3>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-[#1A202C] dark:text-[#E8E8E8] mb-2">Equipment Name</label>
                <input
                  type="text"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#1A202C] dark:text-[#E8E8E8] mb-2">Status</label>
                <select
                  value={equipmentStatus}
                  onChange={(e) => setEquipmentStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEquipment(false);
                    setNewEquipmentName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-[#2F3541] text-gray-700 dark:text-[#B0B0B0] rounded-lg hover:bg-gray-300 dark:hover:bg-[#3A4150] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E53E3E] to-[#1E3A5F] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
