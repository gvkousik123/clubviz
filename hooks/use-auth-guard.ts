import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
  showToast?: boolean;
}

interface AuthGuardResult {
  isAuthenticated: boolean;
  userRoles: string[];
  hasRole: (role: string) => boolean;
  isLoading: boolean;
  accessDenied: boolean;
  denialReason: 'not-authenticated' | 'no-role' | null;
}

export const useAuthGuard = ({
  requiredRoles = [],
  redirectTo = '/auth/login',
  requireAuth = true,
  showToast = true
}: AuthGuardOptions): AuthGuardResult => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [denialReason, setDenialReason] = useState<'not-authenticated' | 'no-role' | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // Check if authentication is required
      if (requireAuth && !AuthService.isAuthenticated()) {
        if (showToast) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page.",
            variant: "destructive",
          });
        }
        setAccessDenied(true);
        setDenialReason('not-authenticated');
        setIsLoading(false);
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0) {
        const userRoles = AuthService.getUserRolesFromStorage();
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          if (showToast) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this page.",
              variant: "destructive",
            });
          }
          setAccessDenied(true);
          setDenialReason('no-role');
          setIsLoading(false);
          return;
        }
      }

      setAccessDenied(false);
      setDenialReason(null);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRoles, redirectTo, requireAuth, router, toast, showToast]);

  return {
    isAuthenticated: AuthService.isAuthenticated(),
    userRoles: AuthService.getUserRolesFromStorage(),
    hasRole: (role: string) => AuthService.hasRole(role),
    isLoading,
    accessDenied,
    denialReason
  };
};

// Specific hooks for different route types
export const useUserAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_USER'], 
  requireAuth: true,
  showToast: false
});

export const useAdminAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPERADMIN'], 
  requireAuth: true,
  showToast: false
});

export const useSuperAdminAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_SUPERADMIN'], 
  requireAuth: true,
  showToast: false
});