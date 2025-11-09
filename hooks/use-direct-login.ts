'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { STORAGE_KEYS } from '@/lib/constants/storage';

interface UseDirectLoginResult {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
}

/**
 * Clear auth session from localStorage
 */
const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.userDetails);
  localStorage.removeItem(STORAGE_KEYS.pendingPhone);
};

/**
 * Hook to handle direct login based on localStorage
 * If user has valid token, auto-login and redirect based on role
 */
export const useDirectLogin = (): UseDirectLoginResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const handleDirectLogin = async () => {
      try {
        // Check if user is already authenticated
        const isAuth = AuthService.isAuthenticated();
        
        if (isAuth) {
          setIsAuthenticated(true);
          
          // Get user role for routing
          const roles = AuthService.getUserRolesFromStorage();
          
          // Determine route based on role priority
          let redirectRoute = '/home'; // Default for ROLE_USER
          
          if (roles.includes('ROLE_SUPERADMIN')) {
            redirectRoute = '/superadmin';
            setUserRole('ROLE_SUPERADMIN');
          } else if (roles.includes('ROLE_ADMIN')) {
            redirectRoute = '/admin';
            setUserRole('ROLE_ADMIN');
          } else if (roles.includes('ROLE_USER')) {
            redirectRoute = '/home';
            setUserRole('ROLE_USER');
          }
          
          // Redirect to appropriate page
          router.push(redirectRoute);
        }
      } catch (error) {
        console.error('Direct login error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleDirectLogin();
  }, [router]);

  return {
    isLoading,
    isAuthenticated,
    userRole
  };
};

/**
 * Hook to handle logout and clear session
 */
export const useLogoutHandler = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API
      await AuthService.logout();
      
      // Redirect to login
      router.push('/auth/mobile');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback: clear session manually on API error
      clearAuthSession();
      router.push('/auth/mobile');
    }
  };

  return { handleLogout };
};
