'use client';

import { useEffect, useState } from 'react';
import { ProfileService } from '@/lib/services/profile.service';

export default function RootPage() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const redirectUser = () => {
      // Check if user is logged in
      if (!ProfileService.isLoggedIn()) {
        // Not logged in, go to intro screen
        window.location.href = '/auth/intro';
        return;
      }

      // User is logged in, redirect based on role
      if (ProfileService.isSuperAdmin()) {
        window.location.href = '/superadmin';
      } else if (ProfileService.isAdmin()) {
        window.location.href = '/admin';
      } else {
        // Default to home for regular users
        window.location.href = '/home';
      }
    };

    redirectUser();
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
