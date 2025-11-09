'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';

/**
 * Client-side wrapper component that handles direct login
 * and role-based routing on app initialization
 */
export const DirectLoginWrapper = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only check on initial load and don't redirect if already on auth pages
        const isAuthPage = pathname?.startsWith('/auth');
        const isAdminPage = pathname?.startsWith('/admin');
        const isSuperAdminPage = pathname?.startsWith('/superadmin');

        // Skip redirect logic on auth pages
        if (isAuthPage) {
            return;
        }

        // Check if user is authenticated
        const isAuthenticated = AuthService.isAuthenticated();

        if (isAuthenticated) {
            // Get user roles
            const roles = AuthService.getUserRolesFromStorage();

            // Determine correct route based on role
            let correctRoute = '/home';

            if (roles.includes('ROLE_SUPERADMIN')) {
                correctRoute = '/superadmin';
            } else if (roles.includes('ROLE_ADMIN')) {
                correctRoute = '/admin';
            } else if (roles.includes('ROLE_USER')) {
                correctRoute = '/home';
            }

            // Only redirect if not already on the correct page
            if (pathname !== correctRoute) {
                // Allow admin/superadmin to access other admin pages
                if (isAdminPage || isSuperAdminPage) {
                    return; // Stay on admin pages
                }

                router.push(correctRoute);
            }
        }
    }, [pathname, router]);

    return <>{children}</>;
};
