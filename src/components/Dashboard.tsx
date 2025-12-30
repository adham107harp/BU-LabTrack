import { useState, useEffect } from 'react';
import { Users, Beaker, AlertCircle, CheckCircle, Package, Share2, FlaskConical, Info, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../App';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (tab: string) => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    {
      label: 'Total Lab Rooms',
      value: '0',
      icon: Beaker,
      color: 'bg-gradient-to-br from-[#5B9BD5] to-[#8BB4D9] text-white',
    },
    {
      label: user.role === 'student' ? 'My Reservations' : 'Active Sessions',
      value: '0',
      icon: Users,
      color: 'bg-gradient-to-br from-[#FF9F66] to-[#5B9BD5] text-white',
    },
    {
      label: 'Available Labs',
      value: '0',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    },
    {
      label: user.role === 'student' ? 'Shared Items' : 'Maintenance',
      value: '0',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all stats in parallel
        const [allLabs, availableLabs, myReservations, mySharedTools] = await Promise.all([
          api.get('/labs').catch(() => []),
          api.get('/labs/available').catch(() => []),
          user.role === 'student' 
            ? api.get(`/reservations/student/${user.id}`).catch(() => [])
            : Promise.resolve([]),
          user.role === 'student'
            ? api.get(`/shared-tools/owner/${user.id}`).catch(() => [])
            : Promise.resolve([]),
        ]);

        setStats([
          {
            label: 'Total Lab Rooms',
            value: allLabs.length.toString(),
            icon: Beaker,
            color: 'bg-gradient-to-br from-[#5B9BD5] to-[#8BB4D9] text-white',
          },
          {
            label: user.role === 'student' ? 'My Reservations' : 'Active Sessions',
            value: user.role === 'student' 
              ? myReservations.filter((r: any) => r.status === 'APPROVED' || r.status === 'PENDING').length.toString()
              : '0', // TODO: Add active sessions for doctors
            icon: Users,
            color: 'bg-gradient-to-br from-[#FF9F66] to-[#5B9BD5] text-white',
          },
          {
            label: 'Available Labs',
            value: availableLabs.length.toString(),
            icon: CheckCircle,
            color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
          },
          {
            label: user.role === 'student' ? 'Shared Items' : 'Maintenance',
            value: user.role === 'student' 
              ? mySharedTools.length.toString()
              : '0', // TODO: Add maintenance requests count
            icon: AlertCircle,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
          },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to load statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id, user.role]);

  const navigationCards = [
    {
      icon: Beaker,
      title: 'Lab Rooms',
      description: 'Browse and access laboratory facilities',
      color: 'from-[#5B9BD5] to-[#8BB4D9]',
      tab: 'labs',
    },
    {
      icon: Package,
      title: 'Equipment Reservation',
      description: 'Reserve equipment for your experiments',
      color: 'from-[#8BB4D9] to-[#CBD5E0]',
      tab: 'reservation',
    },
    {
      icon: Share2,
      title: 'Equipment Sharing',
      description: 'Share resources with fellow students',
      color: 'from-[#FF9F66] to-[#5B9BD5]',
      tab: 'sharing',
    },
    ...(user.role === 'doctor' ? [{
      icon: FlaskConical,
      title: 'Research Lab',
      description: 'Access advanced research facilities',
      color: 'from-[#5B9BD5] to-[#FF9F66]',
      tab: 'research',
    }] : []),
    {
      icon: Info,
      title: 'About',
      description: 'Learn more about the system',
      color: 'from-[#8BB4D9] to-[#5B9BD5]',
      tab: 'about',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg shadow-lg p-6 animate-slideInLeft border-2 border-[#FF9F66]">
        <h1 className="text-white mb-2">Welcome back, {user.name}!</h1>
        <p className="text-[#CBD5E0] dark:text-[#8BB4D9]">Here's what's happening in your labs today</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scaleIn border-2 border-[#CBD5E0] dark:border-[#3A4150]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-[#B0B0B0] text-sm">{stat.label}</p>
                {loading ? (
                  <div className="flex items-center mt-2">
                    <Loader2 className="w-6 h-6 text-[#5B9BD5] dark:text-[#8BB4D9] animate-spin" />
                  </div>
                ) : (
                  <p className="text-3xl mt-2 text-[#5B9BD5] dark:text-[#8BB4D9]">{stat.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg shadow-md ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="mb-4 text-[#5B9BD5] dark:text-[#8BB4D9]">Navigate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, index) => (
            <div
              key={index}
              onClick={() => onNavigate(card.tab)}
              className="group cursor-pointer bg-white dark:bg-[#252932] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden animate-scaleIn border-2 border-[#CBD5E0] dark:border-[#3A4150]"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg mb-4 shadow-md`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-[#5B9BD5] dark:text-[#8BB4D9]">{card.title}</h3>
                <p className="text-gray-600 dark:text-[#B0B0B0] text-sm mb-4">
                  {card.description}
                </p>
                <div className="flex items-center text-[#FF9F66] text-sm group-hover:gap-2 transition-all">
                  <span>Open</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
