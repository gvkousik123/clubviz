import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { ProfileService } from '@/lib/services/profile.service';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
  showToast?: boolean;
  autoRedirect?: boolean;
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
  redirectTo = '/auth/mobile',
  requireAuth = true,
  showToast = true,
  autoRedirect = true
}: AuthGuardOptions): AuthGuardResult => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [denialReason, setDenialReason] = useState<'not-authenticated' | 'no-role' | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log("🔍 useAuthGuard: Starting auth check", { requiredRoles, requireAuth });

      // Check if authentication is required
      if (requireAuth && !AuthService.isAuthenticated()) {
        console.log("❌ useAuthGuard: Authentication required but user not authenticated");

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

        if (autoRedirect) {
          setTimeout(() => router.replace('/auth/intro'), 1000);
        }
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0) {
        const userRoles = AuthService.getUserRolesFromStorage();
        console.log("👤 useAuthGuard: User roles:", userRoles, "Required:", requiredRoles);

        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          console.log("❌ useAuthGuard: User doesn't have required role");

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

          if (autoRedirect) {
            // Redirect to appropriate dashboard based on user's actual role
            setTimeout(() => {
              let redirectPath = '/home'; // default

              if (ProfileService.isSuperAdmin()) {
                redirectPath = '/superadmin';
              } else if (ProfileService.isAdmin()) {
                redirectPath = '/admin';
              }

              router.replace(redirectPath);
            }, 1000);
          }
          return;
        }
      }

      console.log("✅ useAuthGuard: Auth check passed");
      setAccessDenied(false);
      setDenialReason(null);
      setIsLoading(false);
    };

    // Add a small delay to allow localStorage to be populated
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [requiredRoles, redirectTo, requireAuth, router, toast, showToast, autoRedirect]);

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
  showToast: false,
  autoRedirect: true
});

export const useAdminAuth = () => useAuthGuard({
  requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPERADMIN'],
  requireAuth: true,
  showToast: false,
  autoRedirect: true
});

export const useSuperAdminAuth = () => useAuthGuard({
  requiredRoles: ['ROLE_SUPERADMIN'],
  requireAuth: true,
  showToast: false,
  autoRedirect: true
});