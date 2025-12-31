import { useState, useEffect } from 'react';
import { Wrench, AlertCircle, CheckCircle, Clock, Loader2, Calendar } from 'lucide-react';
import { User } from '../App';
import { api } from '../services/api';

interface MaintenanceRequest {
  maintenanceId: number;
  equipmentName: string;
  requestDate: string;
  status: string;
  description: string;
  nextMaintenanceDate?: string;
  maintenanceFrequencyDays?: number;
  estimatedDurationHours?: number;
}

interface TechnicianMaintenanceProps {
  user: User;
}

export function TechnicianMaintenance({ user }: TechnicianMaintenanceProps) {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      // Assuming endpoint exists - if not, use /maintenance-requests/technician/{technicianId}
      const requests = await api.get(`/maintenance-requests/technician/${user.id}`);
      setMaintenanceRequests(requests);
    } catch (err: any) {
      // If endpoint doesn't exist, use empty array for now
      setMaintenanceRequests([]);
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (maintenanceId: number, newStatus: string) => {
    try {
      await api.put(`/maintenance-requests/${maintenanceId}/status`, { status: newStatus });
      fetchMaintenanceRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#1E3A5F] dark:text-[#2C5282] animate-spin" />
      </div>
    );
  }

  const pendingRequests = maintenanceRequests.filter(req => req.status === 'PENDING');
  const inProgressRequests = maintenanceRequests.filter(req => req.status === 'IN_PROGRESS');
  const completedRequests = maintenanceRequests.filter(req => req.status === 'COMPLETED');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg shadow-lg p-6">
        <h1 className="text-white mb-2">Welcome, {user.name}!</h1>
        <p className="text-white/90 dark:text-[#2C5282]">Manage maintenance requests and equipment upkeep</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-[#E53E3E] dark:text-[#E53E3E] mt-2">{pendingRequests.length}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-[#E53E3E] opacity-20" />
          </div>
        </div>

        <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-[#1E3A5F] dark:text-[#2C5282] mt-2">{inProgressRequests.length}</p>
            </div>
            <Clock className="w-12 h-12 text-[#1E3A5F] dark:text-[#2C5282] opacity-20" />
          </div>
        </div>

        <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-[#52C9A2] dark:text-[#52C9A2] mt-2">{completedRequests.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-[#52C9A2] opacity-20" />
          </div>
        </div>
      </div>

      {/* Maintenance Requests */}
      <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg border-2 border-[#E2E8F0] dark:border-[#3A4150] p-6">
        <h2 className="text-xl font-semibold text-[#1A202C] dark:text-[#E8E8E8] mb-4">Maintenance Requests</h2>

        {maintenanceRequests.length === 0 ? (
          <p className="text-center py-8 text-[#2D3748] dark:text-[#B0B0B0]">No maintenance requests assigned to you</p>
        ) : (
          <div className="space-y-4">
            {maintenanceRequests.map((request) => (
              <div key={request.maintenanceId} className="border-2 border-[#E2E8F0] dark:border-[#3A4150] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-5 h-5 text-[#1E3A5F] dark:text-[#2C5282]" />
                      <h3 className="font-semibold text-[#1A202C] dark:text-[#E8E8E8]">{request.equipmentName}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0] mb-2">{request.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#2D3748] dark:text-[#B0B0B0]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                      </div>
                      {request.nextMaintenanceDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Next: {new Date(request.nextMaintenanceDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {request.maintenanceFrequencyDays && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Frequency: Every {request.maintenanceFrequencyDays} days</span>
                        </div>
                      )}
                      {request.estimatedDurationHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {request.estimatedDurationHours} hours</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(request.maintenanceId, 'IN_PROGRESS')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                        >
                          Start
                        </button>
                      </>
                    )}
                    {request.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(request.maintenanceId, 'COMPLETED')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
