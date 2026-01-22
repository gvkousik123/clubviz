import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

// ============================================================================
// USER LOCATION TYPES
// ============================================================================

/**
 * User location coordinates
 */
export interface UserLocationCoordinates {
    latitude: number;
    longitude: number;
}

/**
 * User location response from API
 */
export interface UserLocation {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    updatedAt?: string;
}

/**
 * Update user location request
 */
export interface UpdateUserLocationRequest {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
}

/**
 * Distance calculation response
 */
export interface LocationDistanceResponse {
    distanceKm: number;
    distanceMiles: number;
    fromLocation: UserLocationCoordinates;
    toLocation: UserLocationCoordinates;
}

// ============================================================================
// USER LOCATION SERVICE
// ============================================================================
// Base URL: https://clubwiz.in/search
// Endpoints: /api/user/location

/**
 * User Location Service
 * Manages user's saved location for location-based search and recommendations
 */
export class UserLocationService {
    private static readonly BASE_PATH = '/search/api/user/location';

    /**
     * Get user's saved location
     * GET /api/user/location
     * 
     * Returns the user's saved location coordinates and address
     * Returns null if no location is saved yet
     * 
     * @returns User location or null if not set
     */
    static async getUserLocation(): Promise<ApiResponse<UserLocation | null>> {
        try {
            const response = await api.get<any>(
                this.BASE_PATH
            );

            // API doesn't return standard ApiResponse, just the location object
            // Check if response has latitude/longitude (valid location data)
            if (response.data && typeof response.data.latitude === 'number' && typeof response.data.longitude === 'number') {
                return {
                    success: true,
                    data: response.data,
                    message: 'Location retrieved successfully'
                };
            }

            // No valid location data
            return {
                success: true,
                data: null,
                message: 'No location saved yet'
            };
        } catch (error: any) {
            // If 404, user has no location saved yet - return null instead of error
            if (error.response?.status === 404) {
                return {
                    success: true,
                    data: null,
                    message: 'No location saved yet'
                };
            }
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Update user's location
     * PUT /api/user/location
     * 
     * Saves or updates the user's location
     * Can include optional address and city information
     * 
     * @param locationData - User location data with coordinates
     * @returns Updated location
     */
    static async updateUserLocation(
        locationData: UpdateUserLocationRequest
    ): Promise<ApiResponse<UserLocation>> {
        try {
            const response = await api.put<any>(
                this.BASE_PATH,
                locationData
            );

            // API doesn't return standard ApiResponse with success flag
            // Instead, it returns the updated location object directly
            // If response has latitude/longitude, it's a success
            if (response.data && typeof response.data.latitude === 'number' && typeof response.data.longitude === 'number') {
                return {
                    success: true,
                    data: response.data,
                    message: 'Location updated successfully'
                };
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Calculate distance between user's saved location and a target location
     * GET /api/user/location/distance
     * 
     * Calculates the distance from user's saved location to a target location
     * Requires user to have a saved location
     * 
     * @param targetLatitude - Target location latitude
     * @param targetLongitude - Target location longitude
     * @returns Distance in km and miles
     */
    static async calculateDistance(
        targetLatitude: number,
        targetLongitude: number
    ): Promise<ApiResponse<LocationDistanceResponse>> {
        try {
            const response = await api.get<any>(
                `${this.BASE_PATH}/distance`,
                {
                    params: {
                        targetLatitude,
                        targetLongitude
                    }
                }
            );

            // API returns distance object directly, not wrapped in ApiResponse
            // Check if response has distanceKm and distanceMiles (valid distance data)
            if (response.data && typeof response.data.distanceKm === 'number' && typeof response.data.distanceMiles === 'number') {
                return {
                    success: true,
                    data: response.data,
                    message: 'Distance calculated successfully'
                };
            }

            throw new Error('Invalid distance response format');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Helper: Check if user has a saved location
     * 
     * @returns true if user has saved location, false otherwise
     */
    static async hasUserLocation(): Promise<boolean> {
        try {
            const result = await this.getUserLocation();
            return result.success && result.data !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Helper: Get location or return default coordinates
     * 
     * @param defaultLat - Default latitude if no location saved
     * @param defaultLng - Default longitude if no location saved
     * @returns User location or default coordinates
     */
    static async getLocationOrDefault(
        defaultLat: number = 0,
        defaultLng: number = 0
    ): Promise<UserLocationCoordinates> {
        try {
            const result = await this.getUserLocation();
            if (result.success && result.data) {
                return {
                    latitude: result.data.latitude,
                    longitude: result.data.longitude
                };
            }
            return { latitude: defaultLat, longitude: defaultLng };
        } catch (error) {
            return { latitude: defaultLat, longitude: defaultLng };
        }
    }

    /**
     * Helper: Delete user location (by updating to null coordinates)
     * This is a workaround if the API doesn't have a DELETE endpoint
     * 
     * @returns Success response
     */
    static async clearUserLocation(): Promise<ApiResponse<void>> {
        try {
            // Update with coordinates 0,0 to effectively "clear" the location
            // Or the backend might support a DELETE method
            const response = await api.delete<ApiResponse<void>>(this.BASE_PATH);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

// Export singleton instance for convenience
export const userLocationService = UserLocationService;
