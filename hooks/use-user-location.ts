import { useState, useEffect } from 'react';
import { UserLocationService, UserLocation, LocationDistanceResponse } from '@/lib/services/user-location.service';
import { useToast } from './use-toast';

/**
 * Custom hook for user location management
 * Handles fetching, updating, and distance calculation for user location
 */
export function useUserLocation() {
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    /**
     * Fetch user's saved location from API
     */
    const fetchUserLocation = async (showToast = false) => {
        setLoading(true);
        setError(null);

        try {
            const response = await UserLocationService.getUserLocation();

            if (response.success) {
                setUserLocation(response.data);
                setHasLocation(response.data !== null);

                if (showToast && response.data) {
                    toast({
                        title: 'Location loaded',
                        description: response.data.city || 'Your saved location has been loaded',
                    });
                }
            } else {
                setUserLocation(null);
                setHasLocation(false);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch user location';
            setError(errorMessage);
            setUserLocation(null);
            setHasLocation(false);

            if (showToast) {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user's location
     */
    const updateUserLocation = async (
        latitude: number,
        longitude: number,
        address?: string,
        city?: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await UserLocationService.updateUserLocation({
                latitude,
                longitude,
                address,
                city,
            });

            if (response.success && response.data) {
                setUserLocation(response.data);
                setHasLocation(true);

                toast({
                    title: 'Location updated',
                    description: city || address || 'Your location has been saved',
                });

                return response.data;
            } else {
                throw new Error(response.message || 'Failed to update location');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update location';
            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate distance from user's saved location to target coordinates
     */
    const calculateDistance = async (
        targetLatitude: number,
        targetLongitude: number
    ): Promise<LocationDistanceResponse | null> => {
        if (!hasLocation || !userLocation) {
            toast({
                title: 'No saved location',
                description: 'Please save your location first to calculate distance',
                variant: 'destructive',
            });
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await UserLocationService.calculateDistance(
                targetLatitude,
                targetLongitude
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to calculate distance');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to calculate distance';
            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clear user's saved location
     */
    const clearUserLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            await UserLocationService.clearUserLocation();
            setUserLocation(null);
            setHasLocation(false);

            toast({
                title: 'Location cleared',
                description: 'Your saved location has been removed',
            });
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to clear location';
            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch location on mount
    useEffect(() => {
        fetchUserLocation(false);
    }, []);

    return {
        userLocation,
        hasLocation,
        loading,
        error,
        fetchUserLocation,
        updateUserLocation,
        calculateDistance,
        clearUserLocation,
    };
}
