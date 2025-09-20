'use client';

import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // Redirect to intro screen for first-time users or clubs for authenticated users
    window.location.href = '/clubs';
  }, []);

  return (
    <div className="bg-dark-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse"></div>
        <p className="text-white">Loading ClubViz...</p>
      </div>
    </div>
  );
}
