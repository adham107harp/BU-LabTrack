import { useState } from 'react';
import { Beaker, Layout, Package, Share2, FlaskConical, Info, LogOut, Moon, Sun } from 'lucide-react';
import { User, useDarkMode } from '../App';
import { Dashboard } from './Dashboard';
import { LabRooms } from './LabRooms';
import { EquipmentReservation } from './EquipmentReservation';
import { EquipmentSharing } from './EquipmentSharing';
import { ResearchLab } from './ResearchLab';
import { About } from './About';
import { InstructorDashboard } from './InstructorDashboard';
import { TechnicianMaintenance } from './TechnicianMaintenance';
import { DoctorDashboard } from './DoctorDashboard';

type Tab = 'dashboard' | 'labs' | 'reservation' | 'sharing' | 'research' | 'about';

interface MainAppProps {
  user: User;
  onLogout: () => void;
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:from-[#1A1D23] dark:via-[#252932] dark:to-[#1A1D23]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2F3541] dark:to-[#252932] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="w-8 h-8" />
              <div>
                <h1 className="text-white">Badya University</h1>
                <p className="text-white/90 dark:text-[#8BB4D9] text-sm">Laboratory Tracking System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-white/80 dark:text-[#8BB4D9] capitalize">{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 bg-[#E53E3E] hover:bg-[#C53030] rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Hidden on Dashboard */}
      {activeTab !== 'dashboard' && (
        <nav className="bg-[#F8F9FA] dark:bg-[#252932] shadow-sm border-b-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <div className="container mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-[#E53E3E] text-[#1E3A5F] dark:text-[#8BB4D9]'
                    : 'border-transparent text-[#2D3748] dark:text-[#B0B0B0] hover:text-[#1E3A5F] dark:hover:text-[#8BB4D9]'
                }`}
              >
                <Layout className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('labs')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'labs'
                    ? 'border-[#E53E3E] text-[#1E3A5F] dark:text-[#8BB4D9]'
                    : 'border-transparent text-[#2D3748] dark:text-[#B0B0B0] hover:text-[#1E3A5F] dark:hover:text-[#8BB4D9]'
                }`}
              >
                <Beaker className="w-4 h-4" />
                Lab Rooms
              </button>
              <button
                onClick={() => setActiveTab('reservation')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'reservation'
                    ? 'border-[#E53E3E] text-[#1E3A5F] dark:text-[#8BB4D9]'
                    : 'border-transparent text-[#2D3748] dark:text-[#B0B0B0] hover:text-[#1E3A5F] dark:hover:text-[#8BB4D9]'
                }`}
              >
                <Package className="w-4 h-4" />
                Equipment Reservation
              </button>
              <button
                onClick={() => setActiveTab('sharing')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'sharing'
                    ? 'border-[#E53E3E] text-[#1E3A5F] dark:text-[#8BB4D9]'
                    : 'border-transparent text-[#2D3748] dark:text-[#B0B0B0] hover:text-[#1E3A5F] dark:hover:text-[#8BB4D9]'
                }`}
              >
                <Share2 className="w-4 h-4" />
                Equipment Sharing
              </button>
              {user.role === 'doctor' && (
                <button
                  onClick={() => setActiveTab('research')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'research'
                      ? 'border-[#F6995C] text-[#51829B] dark:text-[#9BB0C1]'
                      : 'border-transparent text-gray-600 dark:text-[#B0B0B0] hover:text-[#51829B] dark:hover:text-[#9BB0C1]'
                  }`}
                >
                  <FlaskConical className="w-4 h-4" />
                  Research Lab
                </button>
              )}
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'border-[#E53E3E] text-[#1E3A5F] dark:text-[#8BB4D9]'
                    : 'border-transparent text-[#2D3748] dark:text-[#B0B0B0] hover:text-[#1E3A5F] dark:hover:text-[#8BB4D9]'
                }`}
              >
                <Info className="w-4 h-4" />
                About
              </button>
            </div>
          </div>
        </nav>
      )}

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {activeTab === 'dashboard' && (
            user.role === 'instructor' ? (
              <InstructorDashboard user={user} />
            ) : user.role === 'technician' ? (
              <TechnicianMaintenance user={user} />
            ) : user.role === 'doctor' ? (
              <DoctorDashboard user={user} />
            ) : (
              <Dashboard user={user} onNavigate={setActiveTab} />
            )
          )}
        {activeTab === 'labs' && <LabRooms user={user} onNavigateToReservation={() => setActiveTab('reservation')} />}
        {activeTab === 'reservation' && <EquipmentReservation user={user} />}
        {activeTab === 'sharing' && <EquipmentSharing user={user} />}
        {activeTab === 'research' && user.role === 'doctor' && <ResearchLab user={user} />}
        {activeTab === 'about' && <About />}
      </main>
    </div>
  );
}
