import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse, Story, PaginationMeta } from '../api-types';

export interface StoryStats {
    totalStories: number;
    totalViews: number;
    averageViews: number;
    activeStories: number;
}

export interface CreateStoryRequest {
    base64Data: string;
    caption?: string;
    fileName: string;
}

export interface UpdateStoryRequest {
    caption: string;
}

export interface StoryListResponse {
    content: Story[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
}

export const StoryService = {
    // Get all active stories uploaded by the authenticated user
    getMyStories: async (): Promise<ApiResponse<Story[]>> => {
        try {
            const response = await api.get('/story/my-stories');
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update story details (Admin/SuperAdmin only)
    updateStory: async (storyId: string, data: UpdateStoryRequest): Promise<ApiResponse<Story>> => {
        try {
            const response = await api.put(`/story/${storyId}`, data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Delete a story (Admin/SuperAdmin only)
    deleteStory: async (storyId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await api.delete(`/story/${storyId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Mark a story as viewed and increment view count
    viewStory: async (storyId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await api.post(`/story/${storyId}/view`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Upload a story from base64 data (Admin/SuperAdmin only)
    uploadStory: async (data: CreateStoryRequest): Promise<ApiResponse<Story>> => {
        try {
            const response = await api.post('/story/upload', data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Trigger manual cleanup of expired stories
    cleanupStories: async (): Promise<ApiResponse<void>> => {
        try {
            const response = await api.post('/story/cleanup');
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get all active stories (Instagram-like feed)
    getStories: async (page = 0, size = 20): Promise<ApiResponse<StoryListResponse>> => {
        try {
            const response = await api.get('/story', {
                params: { page, size }
            });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get statistics about the authenticated user's stories
    getStoryStats: async (): Promise<ApiResponse<StoryStats>> => {
        try {
            const response = await api.get('/story/stats');
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
