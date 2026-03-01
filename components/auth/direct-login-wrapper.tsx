'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';

/**
 * Client-side wrapper component that handles direct login
 * and role-based routing on app initialization
 * 
 * IMPORTANT: This component should NOT interfere with auth page redirects.
 * Auth pages (OTP, details, etc.) handle their own redirects after successful login.
 */
export const DirectLoginWrapper = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Always skip redirect logic on auth pages - let them handle their own flow
        // Auth pages have complex logic for new vs existing users
        const isAuthPage = pathname?.startsWith('/auth');

        if (isAuthPage) {
            console.log("🔒 DirectLoginWrapper: On auth page, skipping redirect (auth page handles its own flow):", pathname);
            return;
        }

        const isAdminPage = pathname?.startsWith('/admin');
        const isSuperAdminPage = pathname?.startsWith('/superadmin');

        // List of user pages that should NOT be redirected
        const userPages = [
            '/account',
            '/booking',
            '/club',
            '/clubs',
            '/contact',
            '/event',
            '/events',
            '/example-story-usage',
            '/favourites',
            '/filter',
            '/gallery',
            '/home',
            '/location',
            '/payment',
            '/notifyPayment',
            '/review',
            '/story',
            '/ticket',
            '/terms',
        ];

        // Check if current path is a user-allowed page
        const isUserPage = userPages.some(page => pathname === page || pathname?.startsWith(page + '/'));

        // Skip redirect logic for user pages - they handle their own auth
        if (isUserPage) {
            console.log("✅ DirectLoginWrapper: On user page, skipping redirect:", pathname);
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

                // Use setTimeout to avoid conflicts with other navigation
                setTimeout(() => {
                    router.push(correctRoute);
                }, 200);
            }
        } else {
            // User not authenticated
            // Only redirect to auth if they're on a protected admin page
            // DO NOT redirect from user pages - they might have guest access or handle auth themselves
            if (isAdminPage || isSuperAdminPage) {
                console.log('🔒 DirectLoginWrapper: Not authenticated on admin page, redirecting to intro');
                setTimeout(() => {
                    router.push('/auth/intro');
                }, 200);
            }
        }
    }, [pathname, router]);

    return <>{children}</>;
};
