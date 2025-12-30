import { useState, useEffect } from 'react';
import { Wrench, Clock, Calendar, Plus, CheckCircle, AlertCircle, Package, Loader2 } from 'lucide-react';
import { User } from '../App';
import { api } from '../services/api';

interface TechnicianMaintenanceProps {
  user: User;
}

interface Equipment {
  equipmentName: string;
  status: string;
  lab?: {
    labId: number;
    labName: string;
  };
}

interface MaintenanceRequest {
  maintenanceId: number;
  technician: {
    technicianId: number;
    name: string;
  };
  equipment: Equipment;
  requestDate: string;
  status: string;
  description: string;
  nextMaintenanceDate?: string;
  maintenanceFrequencyDays?: number;
  estimatedDurationHours?: number;
}

export function TechnicianMaintenance({ user }: TechnicianMaintenanceProps) {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    equipmentName: '',
    description: '',
    maintenanceFrequencyDays: 30,
    estimatedDurationHours: 2,
  });

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const technicianId = parseInt(user.id);

      const [requests, equipment] = await Promise.all([
        api.get(`/maintenance/technician/${technicianId}`).catch(() => []),
        api.get('/equipment').catch(() => []),
      ]);

      setMaintenanceRequests(requests);
      setAllEquipment(equipment);
    } catch (err: any) {
      setError(err.message || 'Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenanceRequest = async () => {
    if (!newRequest.equipmentName || !newRequest.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const equipment = allEquipment.find(e => e.equipmentName === newRequest.equipmentName);
      if (!equipment) {
        setError('Equipment not found');
        return;
      }

      await api.post('/maintenance', {
        technician: { technicianId: parseInt(user.id) },
        equipment: { equipmentName: newRequest.equipmentName },
        description: newRequest.description,
        maintenanceFrequencyDays: newRequest.maintenanceFrequencyDays,
        estimatedDurationHours: newRequest.estimatedDurationHours,
        status: 'PENDING',
      });

      setShowAddForm(false);
      setNewRequest({
        equipmentName: '',
        description: '',
        maintenanceFrequencyDays: 30,
        estimatedDurationHours: 2,
      });
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create maintenance request');
    }
  };

  const handleCompleteMaintenance = async (maintenanceId: number) => {
    try {
      await api.post(`/maintenance/${maintenanceId}/complete`, {});
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to complete maintenance');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#51829B] dark:text-[#9BB0C1] animate-spin" />
      </div>
    );
  }

  const pendingRequests = maintenanceRequests.filter(r => r.status === 'PENDING');
  const completedRequests = maintenanceRequests.filter(r => r.status === 'COMPLETED');
  const upcomingMaintenance = maintenanceRequests.filter(r => 
    r.nextMaintenanceDate && new Date(r.nextMaintenanceDate) >= new Date()
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6BA3C4] to-[#A8C5D9] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Maintenance Management</h1>
            <p className="text-white/90 dark:text-[#9BB0C1]">Track and manage equipment maintenance schedules</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F6995C] hover:bg-[#f58a42] rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Maintenance Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]">
          <h3 className="mb-4 text-[#51829B] dark:text-[#9BB0C1]">Create Maintenance Request</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Equipment</label>
              <select
                value={newRequest.equipmentName}
                onChange={(e) => setNewRequest({ ...newRequest, equipmentName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
              >
                <option value="">Select equipment</option>
                {allEquipment.map(eq => (
                  <option key={eq.equipmentName} value={eq.equipmentName}>
                    {eq.equipmentName} {eq.lab ? `(${eq.lab.labName})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Description</label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                rows={3}
                placeholder="Describe the maintenance needed..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Frequency (days)</label>
                <input
                  type="number"
                  value={newRequest.maintenanceFrequencyDays}
                  onChange={(e) => setNewRequest({ ...newRequest, maintenanceFrequencyDays: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                  min="1"
                />
                <p className="text-xs text-[#6B8A9F] dark:text-[#6B6B6B] mt-1">How often maintenance is needed</p>
              </div>
              <div>
                <label className="block text-[#4A6B7F] dark:text-[#B0B0B0] mb-2 font-medium">Duration (hours)</label>
                <input
                  type="number"
                  value={newRequest.estimatedDurationHours}
                  onChange={(e) => setNewRequest({ ...newRequest, estimatedDurationHours: parseInt(e.target.value) || 2 })}
                  className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                  min="1"
                />
                <p className="text-xs text-[#6B8A9F] dark:text-[#6B6B6B] mt-1">Estimated time required</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMaintenanceRequest}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F6995C] to-[#51829B] text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Request
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewRequest({
                    equipmentName: '',
                    description: '',
                    maintenanceFrequencyDays: 30,
                    estimatedDurationHours: 2,
                  });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-[#3A4150] text-gray-700 dark:text-[#B0B0B0] rounded-lg hover:bg-gray-300 dark:hover:bg-[#4A5568] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm font-medium">Pending</p>
              <p className="text-3xl mt-2 text-[#51829B] dark:text-[#9BB0C1] font-bold">{pendingRequests.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm font-medium">Upcoming</p>
              <p className="text-3xl mt-2 text-[#51829B] dark:text-[#9BB0C1] font-bold">{upcomingMaintenance.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm font-medium">Completed</p>
              <p className="text-3xl mt-2 text-[#51829B] dark:text-[#9BB0C1] font-bold">{completedRequests.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Pending Maintenance */}
      <div>
        <h2 className="mb-4 text-[#51829B] dark:text-[#9BB0C1] font-semibold">Pending Maintenance</h2>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#252932] rounded-lg border-2 border-[#D4E3F0] dark:border-[#3A4150]">
            <Wrench className="w-12 h-12 text-[#A8C5D9] dark:text-gray-400 mx-auto mb-4" />
            <p className="text-[#6B8A9F] dark:text-[#B0B0B0]">No pending maintenance requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.maintenanceId}
                className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#D4E3F0] dark:border-[#3A4150]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-[#51829B] dark:text-[#9BB0C1]" />
                      <h3 className="text-[#51829B] dark:text-[#9BB0C1] font-semibold">
                        {request.equipment.equipmentName}
                      </h3>
                    </div>
                    <p className="text-[#6B8A9F] dark:text-[#B0B0B0] text-sm mb-2">{request.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#6B8A9F] dark:text-[#B0B0B0]">
                      {request.estimatedDurationHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{request.estimatedDurationHours} hours</span>
                        </div>
                      )}
                      {request.maintenanceFrequencyDays && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Every {request.maintenanceFrequencyDays} days</span>
                        </div>
                      )}
                      {request.nextMaintenanceDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Next: {new Date(request.nextMaintenanceDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded text-sm">
                    {request.status}
                  </span>
                </div>
                <button
                  onClick={() => handleCompleteMaintenance(request.maintenanceId)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Maintenance */}
      {upcomingMaintenance.length > 0 && (
        <div>
          <h2 className="mb-4 text-[#51829B] dark:text-[#9BB0C1]">Upcoming Maintenance</h2>
          <div className="space-y-4">
            {upcomingMaintenance.map((request) => (
              <div
                key={request.maintenanceId}
                className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-4 border-2 border-[#D4E3F0] dark:border-[#3A4150]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[#51829B] dark:text-[#9BB0C1] font-semibold">{request.equipment.equipmentName}</h4>
                    {request.nextMaintenanceDate && (
                      <p className="text-sm text-[#6B8A9F] dark:text-[#B0B0B0]">
                        Scheduled: {new Date(request.nextMaintenanceDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-sm">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

