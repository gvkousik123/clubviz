'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntroScreen() {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Logo */}
        <div className={`mb-16 transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-32 h-32 mx-auto mb-8 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
            <div className="text-white text-5xl font-bold tracking-wider">CV</div>
          </div>
        </div>

        {/* Title */}
        <div className={`mb-20 transition-all duration-1000 delay-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-7xl font-bold text-white mb-6 tracking-wider">
            CLUBVIZ
          </h1>
          <p className="text-white/90 text-xl font-light leading-relaxed max-w-sm mx-auto">
            Discover the hottest clubs and events in your city
          </p>
        </div>

        {/* Animated Elements */}
        <div className={`space-y-8 transition-all duration-1000 delay-500 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse delay-200"></div>
            <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className={`relative z-10 p-8 pb-16 transition-all duration-1000 delay-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <button
          onClick={handleContinue}
          className="w-full max-w-sm mx-auto flex items-center justify-center py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl text-white font-semibold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}