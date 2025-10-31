import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = ({
  requiredRoles = [],
  redirectTo = '/auth/login',
  requireAuth = true
}: AuthGuardOptions) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      // Check if authentication is required
      if (requireAuth && !AuthService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        router.push(redirectTo);
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0) {
        const userRoles = AuthService.getUserRolesFromStorage();
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          
          // Redirect to appropriate route based on user's actual roles
          const userRoute = AuthService.getRouteBasedOnRoles();
          router.push(userRoute);
          return;
        }
      }
    };

    checkAuth();
  }, [requiredRoles, redirectTo, requireAuth, router, toast]);

  return {
    isAuthenticated: AuthService.isAuthenticated(),
    userRoles: AuthService.getUserRolesFromStorage(),
    hasRole: (role: string) => AuthService.hasRole(role)
  };
};

// Specific hooks for different route types
export const useUserAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_USER'], 
  requireAuth: true 
});

export const useAdminAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPERADMIN'], 
  requireAuth: true 
});

export const useSuperAdminAuth = () => useAuthGuard({ 
  requiredRoles: ['ROLE_SUPERADMIN'], 
  requireAuth: true 
});