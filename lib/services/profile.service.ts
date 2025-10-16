import { api, handleApiResponse, handleApiError } from '../api-client';
import { STORAGE_KEYS } from '../constants/storage';
import { ApiResponse } from '../api-types';

// Profile Types
export interface UserProfile {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  displayName?: string;
  email: string;
  emailId?: string;
  phoneNumber?: string;
  phoneNum?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  locationText?: string;
  locationMap?: {
    lat: number;
    lng: number;
  };
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  favoriteClubs?: string[];
  favoriteEvents?: string[];
  musicGenres?: string[];
  drinkPreferences?: string[];
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    eventReminders?: boolean;
    promotions?: boolean;
  };
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNum?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  locationText?: string;
  locationMap?: {
    lat: number;
    lng: number;
  };
}

export interface ProfileStats {
  totalEvents?: number;
  eventsAttended?: number;
  eventsOrganized?: number;
  favoriteClubs?: number;
  reviewsWritten?: number;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface ProfileListItem {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  isActive?: boolean;
  createdAt: string;
}

/**
 * Profile Service
 * Handles all profile-related API operations
 */
export class ProfileService {
  /**
   * Get current user profile
   * GET /profile
   */
  static async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>('/profile');
      const result = handleApiResponse(response);
      
      // Update user in localStorage if successful
      if (result.success && result.data) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   * PUT /profile
   */
  static async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.put<ApiResponse<UserProfile>>('/profile', profileData);
      const result = handleApiResponse(response);
      
      // Update user in localStorage if successful
      if (result.success && result.data) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user profile statistics
   * GET /profile/stats
   */
  static async getProfileStats(): Promise<ApiResponse<ProfileStats>> {
    try {
      const response = await api.get<ApiResponse<ProfileStats>>('/profile/stats');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all user profiles (Admin only)
   * GET /profile/all
   */
  static async getAllProfiles(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<ProfileListItem[]>> {
    try {
      const response = await api.get<ApiResponse<ProfileListItem[]>>('/profile/all', {
        params
      });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user profile by ID (Admin only)
   * GET /profile/admin/{userId}
   */
  static async getProfileByAdmin(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(`/profile/admin/${userId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update profile picture
   */
  static async updateProfilePicture(file: File): Promise<ApiResponse<{ profilePicture: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ApiResponse<{ profilePicture: string }>>(
        '/profile/picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const result = handleApiResponse(response);
      
      // Update profile picture in localStorage
      if (result.success && result.data?.profilePicture) {
        const storedUser = localStorage.getItem(STORAGE_KEYS.user);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.profilePicture = result.data.profilePicture;
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        }
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stored user profile from localStorage
   */
  static getStoredProfile(): UserProfile | null {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user profile:', error);
      return null;
    }
  }

  /**
   * Clear stored profile from localStorage
   */
  static clearStoredProfile(): void {
    localStorage.removeItem(STORAGE_KEYS.user);
  }
}
