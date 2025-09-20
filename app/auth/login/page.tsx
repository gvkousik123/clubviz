'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Mail } from 'lucide-react';

export default function LoginScreen() {
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    window.location.href = showEmailLogin ? '/home' : '/auth/verify';
  };

  const handleBack = () => {
    if (showEmailLogin) {
      setShowEmailLogin(false);
    } else {
      window.location.href = '/auth/intro';
    }
  };

  const handleGuestLogin = () => {
    window.location.href = '/home';
  };

  const handleSkip = () => {
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10"></div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white transition-all duration-300"
        >
          Skip
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="w-3 h-3 bg-white rounded-full ml-1 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-4 tracking-wider">
            CLUBVIZ
          </h1>
        </div>

        {!showEmailLogin ? (
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div className="text-center mb-8">
              <p className="text-white/80 text-sm">
                By login you are agreeing to{' '}
                <span className="text-teal-400 underline">Terms & Condition</span>{' '}
                and <span className="text-teal-400 underline">Privacy Policy</span>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/auth/verify'}
                className="w-full py-4 px-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-white flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Login with Mobile</span>
              </button>

              <button
                onClick={() => setShowEmailLogin(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Login with Email</span>
              </button>

              <button
                className="w-full py-4 px-6 rounded-2xl bg-red-500 text-white flex items-center justify-center gap-3 hover:bg-red-600 transition-all duration-300"
              >
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xs">G</span>
                </div>
                <span className="font-medium">Login with Google</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 mx-auto w-full max-w-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Login</h2>
              <p className="text-teal-500 text-sm">Good to see you back</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <span className="text-teal-500 font-semibold cursor-pointer hover:underline">
                    Register
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
