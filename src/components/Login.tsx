import { useState } from 'react';
import { Beaker, LogIn, Moon, Sun, UserPlus } from 'lucide-react';
import { User, UserRole, useDarkMode } from '../App';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
  onShowRegister: () => void;
}

export function Login({ onLogin, onShowRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({
        email,
        password,
      });

      const user: User = {
        id: (response.studentId || response.instructorId || response.technicianId || response.doctorId || 0).toString(),
        name: response.name,
        email: response.email,
        role: response.role as UserRole,
      };

      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#EBF2F7] to-[#E3EDF5] dark:from-[#1A1D23] dark:via-[#252932] dark:to-[#1A1D23] flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-scaleIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5B9BD5] to-[#8BB4D9] dark:from-[#8BB4D9] dark:to-[#5B9BD5] rounded-full mb-4 shadow-lg">
            <Beaker className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#5B9BD5] dark:text-[#8BB4D9] mb-2">Badya University</h1>
          <p className="text-gray-600 dark:text-[#B0B0B0]">Laboratory Tracking System</p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-[#252932] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#CBD5E0] dark:border-[#3A4150]"
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#FF9F66]" /> : <Moon className="w-5 h-5 text-[#5B9BD5]" />}
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-2xl p-8 animate-slideInLeft border-2 border-[#CBD5E0] dark:border-[#3A4150]">
          <h2 className="mb-6 text-center text-[#5B9BD5] dark:text-[#8BB4D9]">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@badya.edu"
                required
                className="w-full px-4 py-3 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9] focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border-2 border-[#CBD5E0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#2D3748] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#8BB4D9] focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF9F66] to-[#5B9BD5] text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <button
              onClick={onShowRegister}
              className="flex items-center justify-center gap-2 w-full text-sm text-[#5B9BD5] dark:text-[#8BB4D9] hover:underline"
            >
              <UserPlus className="w-4 h-4" />
              Student Registration
            </button>
            <div className="text-center text-xs text-gray-500 dark:text-[#6B6B6B]">or</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => (onShowRegister as any)('instructor')}
                className="text-xs px-3 py-2 bg-[#5B9BD5]/10 dark:bg-[#8BB4D9]/10 text-[#5B9BD5] dark:text-[#8BB4D9] rounded-lg hover:bg-[#5B9BD5]/20 dark:hover:bg-[#8BB4D9]/20 transition-all"
              >
                Instructor
              </button>
              <button
                onClick={() => (onShowRegister as any)('technician')}
                className="text-xs px-3 py-2 bg-[#5B9BD5]/10 dark:bg-[#8BB4D9]/10 text-[#5B9BD5] dark:text-[#8BB4D9] rounded-lg hover:bg-[#5B9BD5]/20 dark:hover:bg-[#8BB4D9]/20 transition-all"
              >
                Technician
              </button>
              <button
                onClick={() => (onShowRegister as any)('doctor')}
                className="text-xs px-3 py-2 bg-[#5B9BD5]/10 dark:bg-[#8BB4D9]/10 text-[#5B9BD5] dark:text-[#8BB4D9] rounded-lg hover:bg-[#5B9BD5]/20 dark:hover:bg-[#8BB4D9]/20 transition-all"
              >
                Doctor
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-[#B0B0B0] text-sm mt-6">
          Need help? Contact IT Support
        </p>
      </div>
    </div>
  );
}
