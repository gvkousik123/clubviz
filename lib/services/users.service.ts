import axios, { AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '../constants/storage';

// ============================================================================
// USERS SERVICE - Base URL: https://clubwiz.in/users/
// Authentication APIs for user registration, login, sessions, and role management
// ============================================================================

const USERS_API_BASE_URL = 'https://clubwiz.in/users';

// Create dedicated axios instance for users service
const usersApiClient: AxiosInstance = axios.create({
    baseURL: USERS_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for adding auth token
usersApiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 Users API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
            data: config.data,
            hasToken: !!token,
        });
        return config;
    },
    (error) => {
        console.error('❌ Users API Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
usersApiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Users API Response: ${response.status} ${response.config.url}`, {
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error(`❌ Users API Error: ${error.response?.status} ${error.config?.url}`, {
            data: error.response?.data,
            message: error.message,
        });
        return Promise.reject(error);
    }
);

// ============================================================================
// TYPES
// ============================================================================

export interface SignUpRequest {
    fullName: string;
    email: string;
    password: string;
    mobileNumber: string;
}

export interface SignInRequest {
    usernameOrEmail: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    type?: string;
    expiresIn?: number;
    // User data comes directly in response, not nested
    id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    roles?: string[];
    profilePicture?: string;
    // Some responses may have nested user object
    user?: {
        id: string;
        username?: string;
        email: string;
        fullName: string;
        phoneNumber?: string;
        mobileNumber?: string;
        roles: string[];
        profilePicture?: string;
    };
}

export interface UserRolesResponse {
    roles: string[];
}

export interface SessionInfo {
    id: string;
    deviceInfo?: string;
    createdAt: string;
    lastUsed?: string;
    ipAddress?: string;
}

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const handleUsersApiResponse = <T>(response: any): T => {
    return response.data;
};

const handleUsersApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

const storeAuthSession = (data: AuthResponse) => {
    if (typeof window === 'undefined') return;

    // Store access token
    if (data.accessToken) {
        localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    }

    // Store refresh token
    if (data.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    }

    // Build user object from response
    // API returns user data directly in response (id, username, email, roles, etc.)
    // Not nested under a "user" property
    const userData = {
        id: data.id || data.user?.id,
        username: data.username || data.user?.username,
        email: data.email || data.user?.email,
        fullName: data.fullName || data.user?.fullName,
        phoneNumber: data.phoneNumber || data.mobileNumber || data.user?.phoneNumber || data.user?.mobileNumber,
        roles: data.roles || data.user?.roles || [],
        profilePicture: data.profilePicture || data.user?.profilePicture,
        // Also store tokens in user object for easy access
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    console.log('✅ Auth session stored:', { hasToken: !!data.accessToken, user: userData });
};

const clearAuthSession = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
};

// ============================================================================
// USERS SERVICE CLASS
// ============================================================================

/**
 * Users Service
 * Handles all authentication-related API operations
 * Base URL: https://clubwiz.in/users/
 */
export class UsersService {

    // ==========================================================================
    // 1. USER REGISTRATION
    // POST /auth/signup - Register a new user account
    // Request body: { fullName, email, password, mobileNumber }
    // ==========================================================================
    static async signUp(data: SignUpRequest): Promise<ApiResult<AuthResponse>> {
        try {
            console.log('📝 Signing up user:', data.email);

            const response = await usersApiClient.post('/auth/signup', {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                mobileNumber: data.mobileNumber,
            });

            const result = handleUsersApiResponse<AuthResponse>(response);

            // Store auth session if registration successful
            if (result.accessToken) {
                storeAuthSession(result);
            }

            return {
                success: true,
                data: result,
                message: 'User registered successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Sign up error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 2. USER LOGIN
    // POST /auth/signin - Authenticate user and return JWT tokens
    // Request body: { usernameOrEmail, password }
    // Response: { accessToken, refreshToken, type, id, username, email, roles }
    // ==========================================================================
    static async signIn(data: SignInRequest): Promise<ApiResult<AuthResponse>> {
        try {
            console.log('🔐 Signing in user:', data.usernameOrEmail);

            const response = await usersApiClient.post('/auth/signin', {
                usernameOrEmail: data.usernameOrEmail,
                password: data.password,
            });

            const result = handleUsersApiResponse<AuthResponse>(response);

            // Store auth session if login successful
            if (result.accessToken) {
                storeAuthSession(result);
            }

            // Build user object for the response (API returns user data directly, not nested)
            const userFromResponse = result.id ? {
                id: result.id,
                username: result.username,
                email: result.email || '',
                fullName: result.fullName || '',
                phoneNumber: result.phoneNumber || result.mobileNumber,
                roles: result.roles || [],
                profilePicture: result.profilePicture,
            } : undefined;

            return {
                success: true,
                data: {
                    ...result,
                    user: userFromResponse,
                },
                message: 'Login successful!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Sign in error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 3. REFRESH ACCESS TOKEN
    // POST /auth/refresh - Generate new access token using refresh token
    // Request body: { refreshToken }
    // ==========================================================================
    static async refreshToken(refreshToken: string): Promise<ApiResult<AuthResponse>> {
        try {
            console.log('🔄 Refreshing access token...');

            const response = await usersApiClient.post('/auth/refresh', {
                refreshToken,
            });

            const result = handleUsersApiResponse<AuthResponse>(response);

            // Update stored tokens
            if (result.accessToken) {
                storeAuthSession(result);
            }

            return {
                success: true,
                data: result,
                message: 'Token refreshed successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Token refresh error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 4. USER LOGOUT
    // POST /auth/logout - Logout user and revoke all refresh tokens
    // No request body required (uses Authorization header)
    // ==========================================================================
    static async logout(): Promise<ApiResult<void>> {
        try {
            console.log('🚪 Logging out user...');

            await usersApiClient.post('/auth/logout');

            // Clear local auth session
            clearAuthSession();

            return {
                success: true,
                message: 'User logged out successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Logout error:', errorMessage);
            // Clear session even on error
            clearAuthSession();
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 5. GET USER ROLES
    // GET /auth/users/{username}/roles - Retrieve all roles assigned to a user
    // Users can view their own roles, admins can view any user's roles
    // ==========================================================================
    static async getUserRoles(username: string): Promise<ApiResult<string[]>> {
        try {
            console.log('👤 Getting roles for user:', username);

            const response = await usersApiClient.get(`/auth/users/${username}/roles`);
            const result = handleUsersApiResponse<UserRolesResponse>(response);

            return {
                success: true,
                data: result.roles || result as any,
                message: 'Roles fetched successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Get roles error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 6. TEST AUTHENTICATION STATUS
    // GET /auth/test-auth - Check if current request is authenticated
    // ==========================================================================
    static async testAuth(): Promise<ApiResult<{ authenticated: boolean }>> {
        try {
            console.log('🔍 Testing authentication status...');

            const response = await usersApiClient.get('/auth/test-auth');
            const result = handleUsersApiResponse<any>(response);

            return {
                success: true,
                data: { authenticated: true, ...result },
                message: 'Authenticated!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Auth test error:', errorMessage);
            return {
                success: false,
                data: { authenticated: false },
                error: errorMessage,
                message: 'Not authenticated',
            };
        }
    }

    // ==========================================================================
    // 7. LIST ACTIVE SESSIONS
    // GET /auth/sessions - Get all active refresh token sessions for user
    // Includes device information
    // ==========================================================================
    static async getActiveSessions(): Promise<ApiResult<SessionInfo[]>> {
        try {
            console.log('📱 Getting active sessions...');

            const response = await usersApiClient.get('/auth/sessions');
            const result = handleUsersApiResponse<SessionInfo[]>(response);

            return {
                success: true,
                data: result,
                message: 'Sessions fetched successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Get sessions error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 8. LOGOUT FROM ALL DEVICES
    // DELETE /auth/sessions - Revoke all refresh token sessions
    // ==========================================================================
    static async logoutFromAllDevices(): Promise<ApiResult<void>> {
        try {
            console.log('🔒 Logging out from all devices...');

            await usersApiClient.delete('/auth/sessions');

            // Clear local auth session
            clearAuthSession();

            return {
                success: true,
                message: 'Logged out from all devices successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Logout all devices error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 9. REVOKE SPECIFIC SESSION
    // DELETE /auth/sessions/{id} - Revoke a specific refresh token session by ID
    // ==========================================================================
    static async revokeSession(sessionId: string): Promise<ApiResult<void>> {
        try {
            console.log('❌ Revoking session:', sessionId);

            await usersApiClient.delete(`/auth/sessions/${sessionId}`);

            return {
                success: true,
                message: 'Session revoked successfully!',
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Revoke session error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 10. ADD ROLE TO USER (ADMIN/SUPERADMIN only)
    // POST /auth/roles/{username}/add/{role} - Add a specific role to user
    // SUPERADMIN role required to assign ADMIN or SUPERADMIN roles
    // ==========================================================================
    static async addRoleToUser(username: string, role: string): Promise<ApiResult<void>> {
        try {
            console.log('➕ Adding role to user:', username, role);

            await usersApiClient.post(`/auth/roles/${username}/add/${role}`);

            return {
                success: true,
                message: `Role ${role} added to user ${username} successfully!`,
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Add role error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // 11. REMOVE ROLE FROM USER (ADMIN/SUPERADMIN only)
    // POST /auth/roles/{username}/remove/{role} - Remove a specific role from user
    // SUPERADMIN role required to remove ADMIN or SUPERADMIN roles
    // ==========================================================================
    static async removeRoleFromUser(username: string, role: string): Promise<ApiResult<void>> {
        try {
            console.log('➖ Removing role from user:', username, role);

            await usersApiClient.post(`/auth/roles/${username}/remove/${role}`);

            return {
                success: true,
                message: `Role ${role} removed from user ${username} successfully!`,
            };
        } catch (error: any) {
            const errorMessage = handleUsersApiError(error);
            console.error('❌ Remove role error:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    }

    // ==========================================================================
    // UTILITY METHODS
    // ==========================================================================

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(STORAGE_KEYS.accessToken);
    }

    /**
     * Get stored access token
     */
    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.accessToken);
    }

    /**
     * Get stored refresh token
     */
    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.refreshToken);
    }

    /**
     * Get stored user data
     */
    static getStoredUser(): AuthResponse['user'] | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(STORAGE_KEYS.user);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    /**
     * Get user roles from stored data
     */
    static getUserRolesFromStorage(): string[] {
        const user = this.getStoredUser();
        return user?.roles || [];
    }

    /**
     * Check if user has specific role
     */
    static hasRole(role: string): boolean {
        const roles = this.getUserRolesFromStorage();
        return roles.includes(role);
    }

    /**
     * Clear auth session
     */
    static clearSession(): void {
        clearAuthSession();
    }
}

export default UsersService;
