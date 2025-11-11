'use client';

import { useCallback } from 'react';
import { ProfileService } from '@/lib/services/profile.service';

interface UseRoleRoutingReturn {
    getRedirectPath: () => string;
    isSuperAdmin: () => boolean;
    isAdmin: () => boolean;
    isUser: () => boolean;
    getUserRoles: () => string[];
}

/**
 * Hook to handle role-based routing logic
 * Returns the appropriate redirect path based on user role
 * 
 * Usage:
 * const { getRedirectPath, isSuperAdmin, isAdmin } = useRoleRouting();
 * const path = getRedirectPath(); // Returns /superadmin, /admin, or /home
 */
export const useRoleRouting = (): UseRoleRoutingReturn => {

    const getUserRoles = useCallback((): string[] => {
        const authData = ProfileService.getStoredAuthData();
        return authData?.roles || [];
    }, []);

    const isSuperAdmin = useCallback((): boolean => {
        return ProfileService.isSuperAdmin();
    }, []);

    const isAdmin = useCallback((): boolean => {
        return ProfileService.isAdmin();
    }, []);

    const isUser = useCallback((): boolean => {
        const roles = getUserRoles();
        return roles.includes('ROLE_USER') || roles.length === 0;
    }, [getUserRoles]);

    const getRedirectPath = useCallback((): string => {
        if (isSuperAdmin()) {
            return '/superadmin';
        }
        if (isAdmin()) {
            return '/admin';
        }
        return '/home'; // Default for regular users
    }, [isSuperAdmin, isAdmin]);

    return {
        getRedirectPath,
        isSuperAdmin,
        isAdmin,
        isUser,
        getUserRoles,
    };
};

export default useRoleRouting;
