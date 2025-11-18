'use client';

import { useState, useCallback } from 'react';
import { ClubService, MyClubItem, ClubUpdateRequest } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';

export interface UseOwnedClubsState {
    clubs: MyClubItem[];
    isLoading: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
}

export interface UseOwnedClubsActions {
    loadOwnedClubs: (params?: { page?: number; size?: number }) => Promise<void>;
    updateClub: (id: string, clubData: ClubUpdateRequest) => Promise<boolean>;
    deleteClub: (id: string) => Promise<boolean>;
    setClubs: (clubs: MyClubItem[]) => void;
    refreshClubs: () => Promise<void>;
    clearError: () => void;
}

export function useOwnedClubs(): UseOwnedClubsState & UseOwnedClubsActions {
    const [clubs, setClubs] = useState<MyClubItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const showErrorToast = useCallback((title: string, description: string) => {
        toast({
            title,
            description,
            variant: 'destructive',
        });
    }, [toast]);

    const loadOwnedClubs = useCallback(async (params: { page?: number; size?: number } = {}): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('📡 Loading owned clubs...');
            const response = await ClubService.getOwnedClubs({
                page: params.page || 0,
                size: params.size || 50,
            });

            console.log('✅ Raw owned clubs response:', response);
            console.log('✅ Response type:', typeof response, 'Is array:', Array.isArray(response));

            // The backend returns a plain array directly, not wrapped in {success, data}
            // After handleApiResponse, we get the array directly
            let clubsData: any[] = [];

            if (Array.isArray(response)) {
                // Response is already an array
                clubsData = response;
                console.log('✅ Response is direct array, length:', clubsData.length);
            } else if (response && typeof response === 'object' && 'data' in response) {
                // Response is wrapped: {success, data, message}
                clubsData = (response as any).data || [];
                console.log('✅ Extracted data from wrapper, length:', clubsData.length);
            } else {
                console.warn('⚠️ Unexpected response format:', response);
            }

            if (clubsData && Array.isArray(clubsData) && clubsData.length > 0) {
                console.log('✅ Setting owned clubs:', clubsData.length, 'clubs');
                console.log('✅ First club:', clubsData[0]);
                setClubs(clubsData);
            } else {
                console.log('⚠️ No clubs found, setting empty array');
                setClubs([]);
            }
        } catch (error) {
            console.error('❌ Error loading owned clubs:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to load owned clubs';
            setError(errorMessage);
            showErrorToast('Load Failed', errorMessage);
            setClubs([]);
        } finally {
            setIsLoading(false);
        }
    }, [showErrorToast]);

    const updateClub = useCallback(async (id: string, clubData: ClubUpdateRequest): Promise<boolean> => {
        setIsUpdating(true);
        setError(null);

        try {
            console.log('📡 Updating club...', id, clubData);
            const response = await ClubService.updateClub(id, clubData);

            console.log('✅ Raw update response:', response);

            if (response.success && response.data) {
                // Update the club in the local state immediately
                setClubs(prevClubs =>
                    prevClubs.map(club =>
                        club.id === id
                            ? { ...club, ...response.data } as MyClubItem
                            : club
                    )
                );

                console.log('✅ Club updated successfully in UI');
                toast({
                    title: "Club Updated",
                    description: "Club has been updated successfully",
                    variant: "default",
                });
                return true;
            } else {
                throw new Error(response.message || 'Failed to update club');
            }
        } catch (error) {
            console.error('❌ Error updating club:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update club';
            setError(errorMessage);
            showErrorToast('Update Failed', errorMessage);
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [showErrorToast, toast]);

    const deleteClub = useCallback(async (id: string): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            console.log('📡 Deleting club...', id);
            const response = await ClubService.deleteClub(id);

            console.log('✅ Raw delete response:', response);

            if (response.success) {
                // Remove the club from local state immediately
                setClubs(prevClubs => prevClubs.filter(club => club.id !== id));

                console.log('✅ Club deleted successfully from UI');
                toast({
                    title: "Club Deleted",
                    description: "Club has been deleted successfully",
                    variant: "default",
                });
                return true;
            } else {
                throw new Error(response.message || 'Failed to delete club');
            }
        } catch (error) {
            console.error('❌ Error deleting club:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete club';
            setError(errorMessage);
            showErrorToast('Delete Failed', errorMessage);
            return false;
        } finally {
            setIsDeleting(false);
        }
    }, [showErrorToast, toast]);

    const setClubsDirectly = useCallback((newClubs: MyClubItem[]) => {
        setClubs(newClubs);
    }, []);

    const refreshClubs = useCallback(async (): Promise<void> => {
        await loadOwnedClubs();
    }, [loadOwnedClubs]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        clubs,
        isLoading,
        isUpdating,
        isDeleting,
        error,
        loadOwnedClubs,
        updateClub,
        deleteClub,
        setClubs: setClubsDirectly,
        refreshClubs,
        clearError,
    };
}