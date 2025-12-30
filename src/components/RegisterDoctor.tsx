import { useState } from 'react';
import { Beaker, UserPlus, Moon, Sun, ArrowLeft } from 'lucide-react';
import { User, UserRole, useDarkMode } from '../App';
import { api } from '../services/api';

interface RegisterDoctorProps {
  onRegister: (user: User) => void;
  onBackToLogin: () => void;
}

export function RegisterDoctor({ onRegister, onBackToLogin }: RegisterDoctorProps) {
  const [formData, setFormData] = useState({
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

    if (!formData.email.includes('@badyauni.edu.eg')) {
      setError('Email must be @badyauni.edu.eg');
      return;
    }

    // Check if email contains doctor-related keywords
    const emailLower = formData.email.toLowerCase();
    if (!emailLower.includes('doctor') && !emailLower.includes('dr.') && !emailLower.includes('prof.')) {
      setError('Email must be associated with a doctor account (must contain "doctor", "dr.", or "prof.")');
      return;
    }

    setLoading(true);

    try {
      const response = await api.registerDoctor({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const user: User = {
        id: (response.doctorId || 0).toString(),
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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F5] via-[#EADFB4] to-[#9BB0C1] dark:from-[#1A1D23] dark:via-[#252932] dark:to-[#1A1D23] flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-scaleIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#51829B] to-[#9BB0C1] dark:from-[#9BB0C1] dark:to-[#51829B] rounded-full mb-4 shadow-lg">
            <Beaker className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#51829B] dark:text-[#9BB0C1] mb-2">Badya University</h1>
          <p className="text-gray-600 dark:text-[#B0B0B0]">Doctor Registration</p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-[#252932] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#EADFB4] dark:border-[#3A4150]"
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#F6995C]" /> : <Moon className="w-5 h-5 text-[#51829B]" />}
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow-2xl p-8 animate-slideInLeft border-2 border-[#EADFB4] dark:border-[#3A4150]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#51829B] dark:text-[#9BB0C1]">Doctor Registration</h2>
            <button
              onClick={onBackToLogin}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                placeholder="doctor@badyauni.edu.eg"
              />
              <p className="text-xs text-[#6B8A9F] dark:text-[#6B6B6B] mt-1">
                Must contain "doctor", "dr.", or "prof." in email
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                placeholder="At least 6 characters"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-[#B0B0B0] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border-2 border-[#D4E3F0] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-[#4A6B7F] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BA3C4] dark:focus:ring-[#9BB0C1]"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#51829B] to-[#9BB0C1] dark:from-[#9BB0C1] dark:to-[#51829B] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register as Doctor
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="text-sm text-[#51829B] dark:text-[#9BB0C1] hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

