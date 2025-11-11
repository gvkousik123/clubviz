'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { STORAGE_KEYS } from '@/lib/constants/storage';

export default function DebugPage() {
    const router = useRouter();
    const [authState, setAuthState] = useState<any>(null);

    useEffect(() => {
        const checkAuthState = () => {
            try {
                const state = {
                    timestamp: new Date().toISOString(),
                    isAuthenticated: AuthService.isAuthenticated(),
                    storedToken: AuthService.getStoredToken(),
                    userRoles: AuthService.getUserRolesFromStorage(),
                    storedUser: AuthService.getStoredUser(),
                    localStorage: {
                        accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
                        refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
                        user: localStorage.getItem(STORAGE_KEYS.user),
                        userParsed: (() => {
                            try {
                                return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || '{}');
                            } catch {
                                return null;
                            }
                        })(),
                    },
                    allLocalStorageKeys: Object.keys(localStorage).filter(key => key.startsWith('clubviz')),
                };
                setAuthState(state);
                console.log('🐛 Debug Auth State:', state);
            } catch (error: any) {
                setAuthState({ error: error?.message || 'Unknown error' });
            }
        };

        checkAuthState();
        const interval = setInterval(checkAuthState, 1000);
        return () => clearInterval(interval);
    }, []);

    const testRoleRedirect = () => {
        const roles = AuthService.getUserRolesFromStorage();
        let redirectRoute = '/home';

        if (roles.includes('ROLE_SUPERADMIN')) {
            redirectRoute = '/superadmin';
        } else if (roles.includes('ROLE_ADMIN')) {
            redirectRoute = '/admin';
        }

        console.log('🚀 Testing redirect to:', redirectRoute);
        router.replace(redirectRoute);
    };

    const clearAuth = () => {
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
        console.log('🧹 Cleared auth data');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Auth State Debug</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(authState, null, 2)}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>
                        <div className="space-y-4">
                            <button
                                onClick={testRoleRedirect}
                                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                Test Role-based Redirect
                            </button>
                            <button
                                onClick={clearAuth}
                                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Clear Auth Data
                            </button>
                            <button
                                onClick={() => router.push('/auth/mobile')}
                                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                            >
                                Go to Auth Mobile
                            </button>
                            <button
                                onClick={() => router.push('/superadmin')}
                                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                            >
                                Force Go to SuperAdmin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}