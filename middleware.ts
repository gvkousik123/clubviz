import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on every request and protects routes based on roles
export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Get user data from cookies/headers if available (from auth tokens)
    const accessToken = request.cookies.get('accessToken')?.value;
    const userDataCookie = request.cookies.get('user')?.value;

    // Parse user data to check roles
    let userRoles: string[] = [];
    if (userDataCookie) {
        try {
            const userData = JSON.parse(decodeURIComponent(userDataCookie));
            userRoles = userData.roles || [];
        } catch (error) {
            console.error('Error parsing user data from cookie:', error);
        }
    }

    // Define protected routes and their required roles
    const protectedRoutes: Record<string, string[]> = {
        '/superadmin': ['ROLE_SUPERADMIN'],
        '/admin': ['ROLE_ADMIN', 'ROLE_SUPERADMIN'],
    };

    // Check if current path matches any protected route
    for (const [protectedPath, requiredRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(protectedPath)) {
            // Check if user is authenticated
            if (!accessToken) {
                // Redirect to login
                return NextResponse.redirect(new URL('/auth/intro', request.url));
            }

            // Check if user has required role
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRequiredRole) {
                // User doesn't have required role - redirect to appropriate dashboard
                let redirectPath = '/home'; // default for regular users

                if (userRoles.includes('ROLE_SUPERADMIN')) {
                    redirectPath = '/superadmin';
                } else if (userRoles.includes('ROLE_ADMIN')) {
                    redirectPath = '/admin';
                }

                return NextResponse.redirect(new URL(redirectPath, request.url));
            }
        }
    }

    return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
    matcher: [
        '/admin/:path*',
        '/superadmin/:path*',
    ],
};
