'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function IntroScreen() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-blue-500/20 blur-3xl"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className={`mb-8 transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="w-4 h-4 bg-white rounded-full ml-1 flex items-center justify-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`mb-16 transition-all duration-1000 delay-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-4 tracking-wider">
            CLUBVIZ
          </h1>
        </div>

        {/* Tagline */}
        <div className={`space-y-6 transition-all duration-1000 delay-500 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-3xl font-light text-white leading-tight">
            <div className="mb-2">
              <span className="inline-block text-6xl">💃</span>
            </div>
            <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">IGNITE</div>
            <div className="font-semibold text-white">THE</div>
          </div>

          <div className="text-xl font-light text-white/80">
            <div className="mb-4">
              <span className="inline-block text-4xl">🎉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className={`relative z-10 p-6 pb-12 transition-all duration-1000 delay-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <button
          onClick={handleContinue}
          className="w-full max-w-sm mx-auto flex items-center justify-center py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
