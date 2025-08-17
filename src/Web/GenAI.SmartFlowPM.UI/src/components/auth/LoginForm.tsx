'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { LoginRequest } from '../../types/api.types';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({
    userNameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const { success, error: showError, warning, info } = useToast();
  const router = useRouter();

  // Security: Clear any URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('userNameOrEmail') || 
          url.searchParams.has('password') || 
          url.search.length > 0) {
        // Clear all URL parameters immediately
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure no credentials leak into URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('userNameOrEmail') || url.searchParams.has('password')) {
        // Clear URL parameters immediately if they exist
        window.history.replaceState({}, '', url.pathname);
      }
    }

    if (!formData.userNameOrEmail || !formData.password) {
      setError('Please fill in all fields');
      showError('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (formData.userNameOrEmail.length < 3) {
      warning('Invalid Input', 'Username or email must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);
    info('Signing in...', 'Please wait while we authenticate you');

    try {
      await login(formData, rememberMe);
      success('Login Successful!', 'Welcome to SmartFlowPM System');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      showError('Authentication Failed', errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="animate-fade-in">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-full max-w-xs mx-auto mb-6 flex items-center justify-center px-6 py-3">
                <img 
                  src="/images/flow-logo-transparent.png" 
                  alt="SmartFlowPM Logo" 
                  className="w-full h-full object-fill"
                />
              </div>
            </div>

            {/* Login Form Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Login To Your Account
              </h2>
            </div>

            {/* Form */}
            <form 
              onSubmit={handleSubmit} 
              method="POST" 
              autoComplete="off"
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label htmlFor="userNameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    id="userNameOrEmail"
                    name="userNameOrEmail"
                    type="text"
                    required
                    autoComplete="off"
                    value={formData.userNameOrEmail}
                    onChange={handleChange}
                    className="block w-full pr-10 py-3 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                    placeholder=""
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pr-10 py-3 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                    placeholder=""
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>
                <div>
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-500"
                    onClick={() => router.push('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-fade-in bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t Have An Account?{' '}
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="relative z-10 text-center px-8">
          {/* Illustration Placeholder */}
          <div className="mb-8">
            <div className="w-80 h-60 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-white/60 text-lg font-medium">
                Project Management with GenAI
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-white rounded-lg mr-3 flex items-center justify-center shadow-sm">
                <img 
                  src="/images/flow-logo-transparent.png" 
                  alt="SmartFlowPM Logo" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Smart Project Management Made Simple.
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Streamline your project workflows, track progress, and collaborate with your team efficiently.
              Experience the power of intelligent project management.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/4 right-8 w-12 h-12 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}