'use client';

import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // Redirect to intro screen for first-time users
    window.location.href = '/auth/intro';
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">CW</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">CLUBVIZ</h1>
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}