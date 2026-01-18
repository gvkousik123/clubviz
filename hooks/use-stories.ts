import { useState, useCallback } from 'react';
import { StoryService, StoryStats, CreateStoryRequest, UpdateStoryRequest, StoryListResponse } from '@/lib/services/story.service';
import { Story } from '@/lib/api-types';
import { useToast } from './use-toast';

export function useStories() {
    const { toast } = useToast();
    const [stories, setStories] = useState<Story[]>([]);
    const [myStories, setMyStories] = useState<Story[]>([]);
    const [stats, setStats] = useState<StoryStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 0,
        hasNext: false,
        totalPages: 0
    });

    const fetchStories = useCallback(async (page = 0, size = 20, append = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await StoryService.getStories(page, size);
            console.log('📖 fetchStories - Full response:', response);
            console.log('📖 fetchStories - response.success:', response.success);
            console.log('📖 fetchStories - response.data:', response.data);
            
            if (response.success && response.data) {
                // response.data is already the StoryListResponse object because handleApiResponse returns it
                const apiResponse = response.data as any;
                console.log('📖 fetchStories - apiResponse structure:', apiResponse);
                
                // The API returns: { content: [...], currentPage: 0, totalPages: 1, totalElements: 2, hasNext: false }
                const content = apiResponse.content || [];
                console.log('📖 fetchStories - Extracted content array:', content);
                console.log('📖 fetchStories - Content length:', content.length);

                if (append) {
                    setStories(prev => [...prev, ...content]);
                } else {
                    setStories(content);
                }

                // Update pagination info
                setPagination({
                    page: apiResponse.currentPage || page,
                    hasNext: apiResponse.hasNext || false,
                    totalPages: apiResponse.totalPages || 0
                });
                
                console.log('📖 fetchStories - Stories set to state. Total:', content.length);
            } else {
                setError(response.message || 'Failed to fetch stories');
                console.warn('📖 fetchStories - Response not successful:', response);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching stories');
            console.error('📖 fetchStories - Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyStories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await StoryService.getMyStories();
            if (response.success && response.data) {
                setMyStories(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await StoryService.getStoryStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const uploadStory = useCallback(async (data: CreateStoryRequest) => {
        setLoading(true);
        try {
            const response = await StoryService.uploadStory(data);
            if (response.success) {
                // Don't show toast here - let the component handle it
                // Refresh my stories
                fetchMyStories();
                return response.data;
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to upload story',
                    variant: 'destructive',
                });
                return null;
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'An error occurred',
                variant: 'destructive',
            });
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchMyStories, toast]);

    const removeStory = useCallback(async (storyId: string) => {
        try {
            const response = await StoryService.deleteStory(storyId);
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Story deleted',
                });
                setMyStories(prev => prev.filter(s => s.id !== storyId));
                setStories(prev => prev.filter(s => s.id !== storyId));
            } else {
                toast({
                    title: 'Error',
                    description: response.message,
                    variant: 'destructive'
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [toast]);

    const viewStory = useCallback(async (storyId: string) => {
        // Optimistic update locally if needed, but usually we just fire and forget
        try {
            await StoryService.viewStory(storyId);
        } catch (err) {
            console.error('Failed to mark story as viewed', err);
        }
    }, []);

    return {
        stories,
        myStories,
        stats,
        loading,
        error,
        pagination,
        fetchStories,
        fetchMyStories,
        fetchStats,
        uploadStory,
        removeStory,
        viewStory
    };
}
