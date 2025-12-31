import { useState, useEffect } from 'react';
import { Beaker, FlaskConical, Loader2 } from 'lucide-react';
import { User } from '../App';
import { api, Lab } from '../services/api';

interface DoctorDashboardProps {
  user: User;
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [researchLabs, setResearchLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResearchLabs();
  }, []);

  const fetchResearchLabs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Research labs are labs with ID 255 and 256
      const allLabs: Lab[] = await api.get('/labs');
      const research = allLabs.filter(lab => lab.labId === 255 || lab.labId === 256);
      setResearchLabs(research);
    } catch (err: any) {
      setError(err.message || 'Failed to load research labs');
    } finally {
      setLoading(false);
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
        <p className="text-white/90 dark:text-[#2C5282]">Access to Research Laboratories</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Research Labs</p>
              <p className="text-3xl font-bold text-[#1E3A5F] dark:text-[#2C5282] mt-2">{researchLabs.length}</p>
            </div>
            <Beaker className="w-12 h-12 text-[#1E3A5F] dark:text-[#2C5282] opacity-20" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg p-6 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm font-medium">Access Level</p>
              <p className="text-3xl font-bold text-[#E53E3E] dark:text-[#E53E3E] mt-2">Full</p>
            </div>
            <FlaskConical className="w-12 h-12 text-[#E53E3E] opacity-20" />
          </div>
        </div>
      </div>

      {/* Research Labs Info */}
      <div className="bg-[#FFFFFF] dark:bg-[#252932] rounded-lg shadow-lg border-2 border-[#E2E8F0] dark:border-[#3A4150] p-6">
        <h2 className="text-xl font-semibold text-[#1A202C] dark:text-[#E8E8E8] mb-4">Available Research Laboratories</h2>
        <p className="text-[#2D3748] dark:text-[#B0B0B0] mb-4">
          As a doctor, you have exclusive access to research laboratories. Navigate to the Research Lab tab to view and manage your research projects.
        </p>
        {researchLabs.length > 0 && (
          <div className="space-y-2">
            {researchLabs.map((lab) => (
              <div key={lab.labId} className="p-4 bg-[#FFFFFF] dark:bg-[#2F3541] rounded-lg border border-[#E2E8F0] dark:border-[#3A4150]">
                <h3 className="font-semibold text-[#1A202C] dark:text-[#E8E8E8]">{lab.labName}</h3>
                <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0]">{lab.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
