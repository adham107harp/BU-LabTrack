import { useState } from 'react';
import { Beaker, UserPlus, Moon, Sun, ArrowLeft } from 'lucide-react';
import { User, UserRole, useDarkMode } from '../App';
import { api } from '../services/api';

interface RegisterInstructorProps {
  onRegister: (user: User) => void;
  onBackToLogin: () => void;
}

export function RegisterInstructor({ onRegister, onBackToLogin }: RegisterInstructorProps) {
  const [formData, setFormData] = useState({
    instructorId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }


    setLoading(true);

    try {
      const response = await api.registerInstructor({
        instructorId: parseInt(formData.instructorId),
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const userId = response.instructorId || 0;
      const user: User = {
        id: userId.toString(),
        name: response.name,
        email: response.email,
        role: response.role as UserRole,
      };

      onRegister(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#FFFFFF] dark:from-[#1A1D23] dark:via-[#252932] dark:to-[#1A1D23] flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-scaleIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#1E3A5F] rounded-full mb-4 shadow-lg">
            <Beaker className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#1E3A5F] dark:text-[#2C5282] mb-2">Badya University</h1>
          <p className="text-gray-600 dark:text-[#B0B0B0]">Instructor Registration</p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#E2E8F0] dark:border-[#3A4150]"
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#E53E3E]" /> : <Moon className="w-5 h-5 text-[#1E3A5F]" />}
          </button>
        </div>

        {/* Register Form */}
        <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-2xl p-8 animate-slideInLeft border-2 border-[#E2E8F0] dark:border-[#3A4150]">
          <h2 className="mb-6 text-center text-[#1E3A5F] dark:text-[#2C5282]">Instructor Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Instructor ID */}
            <div>
              <label htmlFor="instructorId" className="block text-[#1A202C] dark:text-[#B0B0B0] mb-2">
                Instructor ID *
              </label>
              <input
                id="instructorId"
                type="number"
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                placeholder="Enter your instructor ID"
                required
                min="1000"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282] focus:border-transparent transition-all"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[#1A202C] dark:text-[#B0B0B0] mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282] focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#1A202C] dark:text-[#B0B0B0] mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@badyauni.edu.eg"
                required
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282] focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[#1A202C] dark:text-[#B0B0B0] mb-2">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password (min 6 characters)"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282] focus:border-transparent transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[#1A202C] dark:text-[#B0B0B0] mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#FFFFFF] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282] focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#E53E3E] to-[#1E3A5F] text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="flex items-center justify-center gap-2 text-sm text-[#1E3A5F] dark:text-[#2C5282] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-[#B0B0B0] text-sm mt-6">
          Already have an account? Contact IT Support if you need help
        </p>
      </div>
    </div>
  );
}
