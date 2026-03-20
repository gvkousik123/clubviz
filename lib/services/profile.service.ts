import { api, handleApiResponse, handleApiError } from '../api-client';
import { STORAGE_KEYS } from '../constants/storage';
import { ApiResponse } from '../api-types';

// Profile Types based on API response structure
export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isProfileVerified?: boolean;
  otpExpiryTime?: string;
  otpAttempts?: number;
  passportReceivedToken?: string;
  passportReceivedExpiryTime?: string;
  passportReceivedMaxExpiryTime?: string;
  passportReceivedAttempts?: number;
  isActive?: boolean;
  providerId?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileStats {
  clubsJoined?: number;
  eventsAttended?: number;
  eventsOrganized?: number;
  totalClubOwned?: number;
  memberSince?: string;
  lastActivity?: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ProfileListItem {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  isActive?: boolean;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Profile Service
 * Handles all profile-related API operations
 * Based on API endpoints: /profile, /profile/stats, /profile/all, /profile/admin/{userId}
 */
export class ProfileService {
  private static profileCache: UserProfile | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // ============================================================================
  // USER PROFILE OPERATIONS
  // ============================================================================

  /**
   * Get current user profile
   * GET /users/auth/profile
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      // Check if we have valid cached data
      if (this.profileCache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
        console.log('Using cached profile data');
        return this.profileCache;
      }

      const response = await api.get<UserProfile>('/users/auth/profile');
      // Cache profile data
      if (response.data) {
        this.profileCache = response.data;
        this.cacheTimestamp = Date.now();
        this.updateStoredProfileData(response.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user profile
   * PUT /users/auth/profile
   */
  static async updateProfile(profileData: ProfileUpdateRequest): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>('/users/auth/profile', profileData);

      // Update stored auth data with new profile info
      this.updateStoredProfileData(response.data);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user profile statistics
   * GET /profile/stats
   */
  static async getProfileStats(): Promise<ProfileStats> {
    try {
      const response = await api.get<ProfileStats>('/profile/stats');
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // ADMIN PROFILE OPERATIONS
  // ============================================================================

  /**
   * Get all user profiles (Admin only)
   * GET /profile/all
   */
  static async getAllProfiles(): Promise<ProfileListItem[]> {
    try {
      const response = await api.get<ProfileListItem[]>('/profile/all');
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user profile by ID (Admin only)
   * GET /profile/admin/{userId}
   */
  static async getProfileByAdmin(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(`/profile/admin/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get stored auth data from localStorage
   */
  static getStoredAuthData(): any {
    try {
      if (typeof window === 'undefined') return null;
      const storedData = localStorage.getItem(STORAGE_KEYS.user);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      return null;
    }
  }

  /**
   * Update stored auth data with new profile information
   */
  static updateStoredProfileData(profileData: Partial<UserProfile>): void {
    try {
      if (typeof window === 'undefined') return;

      const storedData = this.getStoredAuthData();
      if (storedData) {
        // Merge profile data while preserving auth tokens
        const updatedData = {
          ...storedData,
          ...profileData,
          // Preserve original auth fields
          accessToken: storedData.accessToken,
          refreshToken: storedData.refreshToken,
          type: storedData.type,
        };

        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Error updating stored profile data:', error);
    }
  }

  /**
   * Get current user info from stored data (no API calls)
   */
  static async getCurrentUserFromAPI(): Promise<Partial<UserProfile> | null> {
    // Use localStorage data only - no API calls to /auth/profile
    return this.getCurrentUserFromStorage();
  }

  /**
   * Get current user info from stored auth data (fallback only)
   */
  static getCurrentUserFromStorage(): Partial<UserProfile> | null {
    const authData = this.getStoredAuthData();
    if (!authData) return null;

    return {
      id: authData.id,
      username: authData.username,
      email: authData.email,
      fullName: authData.fullName,
      phoneNumber: authData.phoneNumber,
      mobileNumber: authData.mobileNumber,
      profilePicture: authData.profilePicture,
      address: authData.address,
      city: authData.city,
      state: authData.state,
      country: authData.country,
      pincode: authData.pincode,
      latitude: authData.latitude,
      longitude: authData.longitude,
      roles: authData.roles,
    };
  }

  /**
   * Get current user info from stored auth data (legacy method)
   */
  static getCurrentUser(): Partial<UserProfile> | null {
    return this.getCurrentUserFromStorage();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const authData = this.getStoredAuthData();
    return authData?.roles?.includes(role) || false;
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN') || this.hasRole('ADMIN');
  }

  /**
   * Check if user is super admin
   */
  static isSuperAdmin(): boolean {
    return this.hasRole('ROLE_SUPERADMIN') || this.hasRole('SUPERADMIN');
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }

  /**
   * Get current user ID
   */
  static getCurrentUserId(): string | null {
    const authData = this.getStoredAuthData();
    return authData?.id || null;
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUserId();
  }

  /**
   * Clear all stored data (logout)
   */
  static clearStoredData(): void {
    if (typeof window === 'undefined') return;
    // Clear cache
    this.profileCache = null;
    this.cacheTimestamp = 0;
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  /**
   * Clear profile cache (called on token expiration or 403 error)
   */
  static clearProfileCache(): void {
    this.profileCache = null;
    this.cacheTimestamp = 0;
  }
}
