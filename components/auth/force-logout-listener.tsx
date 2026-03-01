'use client';

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Listens for force-logout events dispatched by the API client
 * when refresh token fails and shows a toast before redirecting.
 */
export function ForceLogoutListener() {
    useEffect(() => {
        const handler = (event: CustomEvent<{ message: string }>) => {
            toast({
                title: 'Session Expired',
                description: event.detail?.message || 'Your session has expired. Please login again.',
                variant: 'destructive',
                duration: 4000,
            });
        };

        window.addEventListener('clubviz-force-logout', handler as EventListener);
        return () => {
            window.removeEventListener('clubviz-force-logout', handler as EventListener);
        };
    }, []);

    return null;
}
