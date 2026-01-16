import { useState, useCallback } from 'react';
import { PublicClubService, PublicClubListResponse, PublicClubDetails, PublicClubListParams } from '@/lib/services/public.service';

interface UsePublicClubsReturn {
    // State
    clubs: PublicClubListResponse | null;
    clubDetails: PublicClubDetails | null;
    categories: string[];
    locations: string[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchClubsList: (params?: PublicClubListParams) => Promise<void>;
    fetchClubDetails: (id: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchLocations: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

/**
 * Hook for accessing public club data without authentication
 * Provides methods to fetch club lists, details, categories, and locations
 */
export const usePublicClubs = (): UsePublicClubsReturn => {
    const [clubs, setClubs] = useState<PublicClubListResponse | null>(null);
    const [clubDetails, setClubDetails] = useState<PublicClubDetails | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch paginated club list with optional filters
     */
    const fetchClubsList = useCallback(async (params: PublicClubListParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicClubService.getPublicClubsList(params);
            setClubs(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch clubs');
            console.error('Error fetching clubs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch detailed information for a specific club
     */
    const fetchClubDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicClubService.getPublicClubById(id);
            setClubDetails(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch club details');
            console.error('Error fetching club details:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch all available club categories
     */
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicClubService.getClubCategories();
            setCategories(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch all available club locations
     */
    const fetchLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicClubService.getClubLocations();
            setLocations(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch locations');
            console.error('Error fetching locations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset all state
     */
    const reset = useCallback(() => {
        setClubs(null);
        setClubDetails(null);
        setCategories([]);
        setLocations([]);
        setError(null);
    }, []);

    return {
        clubs,
        clubDetails,
        categories,
        locations,
        loading,
        error,
        fetchClubsList,
        fetchClubDetails,
        fetchCategories,
        fetchLocations,
        clearError,
        reset,
    };
};
