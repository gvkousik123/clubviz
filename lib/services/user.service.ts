import { api, handleApiResponse, handleApiError } from '../api-client';
import {
  ApiResponse,
  User,
  UserPreferences,
  Review,
  ReviewRequest,
  ReviewsFilter,
  PaginationMeta,
} from '../api-types';

export class UserService {
  /**
   * Get user profile
   */
  static async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/user/profile');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>('/user/profile', profileData);
      const result = handleApiResponse(response);
      
      // Update user in localStorage
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user avatar
   */
  static async updateUserAvatar(avatarFile: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.post<ApiResponse<{ avatarUrl: string }>>(
        '/user/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await api.put<ApiResponse<UserPreferences>>('/user/preferences', preferences);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user preferences
   */
  static async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await api.get<ApiResponse<UserPreferences>>('/user/preferences');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(settings: any): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.put<ApiResponse<{ message: string }>>(
        '/user/notifications/settings',
        settings
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's activity history
   */
  static async getUserActivity(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ activities: any[]; pagination: PaginationMeta }>> {
    try {
      const response = await api.get<ApiResponse<{ activities: any[]; pagination: PaginationMeta }>>(
        `/user/activity?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user account
   */
  static async deleteUserAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        '/user/account',
        { data: { password } }
      );
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<ApiResponse<{
    totalBookings: number;
    totalReviews: number;
    favoriteClubs: number;
    favoriteEvents: number;
    totalSpent: number;
    memberSince: string;
  }>> {
    try {
      const response = await api.get<ApiResponse<{
        totalBookings: number;
        totalReviews: number;
        favoriteClubs: number;
        favoriteEvents: number;
        totalSpent: number;
        memberSince: string;
      }>>('/user/stats');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export class ReviewService {
  /**
   * Create a new review
   */
  static async createReview(reviewData: ReviewRequest): Promise<ApiResponse<Review>> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (reviewData.clubId) formData.append('clubId', reviewData.clubId);
      if (reviewData.eventId) formData.append('eventId', reviewData.eventId);
      formData.append('rating', reviewData.rating.toString());
      formData.append('title', reviewData.title);
      formData.append('content', reviewData.content);
      
      // Add images if any
      if (reviewData.images?.length) {
        reviewData.images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      }
      
      const response = await api.post<ApiResponse<Review>>(
        '/reviews',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get reviews with filtering
   */
  static async getReviews(filters?: ReviewsFilter): Promise<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.clubId) {
          params.append('clubId', filters.clubId);
        }
        if (filters.eventId) {
          params.append('eventId', filters.eventId);
        }
        if (filters.rating) {
          params.append('rating', filters.rating.toString());
        }
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters.page) {
          params.append('page', filters.page.toString());
        }
        if (filters.limit) {
          params.append('limit', filters.limit.toString());
        }
      }

      const response = await api.get<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>>(
        `/reviews?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get review by ID
   */
  static async getReviewById(reviewId: string): Promise<ApiResponse<Review>> {
    try {
      const response = await api.get<ApiResponse<Review>>(`/reviews/${reviewId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get reviews for a club
   */
  static async getClubReviews(
    clubId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'newest'
  ): Promise<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta; averageRating: number }>> {
    try {
      const response = await api.get<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta; averageRating: number }>>(
        `/clubs/${clubId}/reviews?page=${page}&limit=${limit}&sortBy=${sortBy}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get reviews for an event
   */
  static async getEventReviews(
    eventId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'newest'
  ): Promise<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta; averageRating: number }>> {
    try {
      const response = await api.get<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta; averageRating: number }>>(
        `/events/${eventId}/reviews?page=${page}&limit=${limit}&sortBy=${sortBy}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>> {
    try {
      const response = await api.get<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>>(
        `/user/reviews?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update review
   */
  static async updateReview(reviewId: string, reviewData: Partial<ReviewRequest>): Promise<ApiResponse<Review>> {
    try {
      const response = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, reviewData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete review
   */
  static async deleteReview(reviewId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/reviews/${reviewId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark review as helpful
   */
  static async markReviewHelpful(reviewId: string): Promise<ApiResponse<{ message: string; helpfulCount: number }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string; helpfulCount: number }>>(
        `/reviews/${reviewId}/helpful`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove helpful mark from review
   */
  static async removeReviewHelpful(reviewId: string): Promise<ApiResponse<{ message: string; helpfulCount: number }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string; helpfulCount: number }>>(
        `/reviews/${reviewId}/helpful`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Report review
   */
  static async reportReview(
    reviewId: string,
    reason: string,
    description?: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/reviews/${reviewId}/report`,
        { reason, description }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get review statistics for a club
   */
  static async getClubReviewStats(clubId: string): Promise<ApiResponse<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  }>> {
    try {
      const response = await api.get<ApiResponse<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: { rating: number; count: number }[];
      }>>(`/clubs/${clubId}/reviews/stats`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get review statistics for an event
   */
  static async getEventReviewStats(eventId: string): Promise<ApiResponse<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  }>> {
    try {
      const response = await api.get<ApiResponse<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: { rating: number; count: number }[];
      }>>(`/events/${eventId}/reviews/stats`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if user can review a club/event
   */
  static async canUserReview(clubId?: string, eventId?: string): Promise<ApiResponse<{
    canReview: boolean;
    reason?: string;
    existingReviewId?: string;
  }>> {
    try {
      const params = new URLSearchParams();
      if (clubId) params.append('clubId', clubId);
      if (eventId) params.append('eventId', eventId);
      
      const response = await api.get<ApiResponse<{
        canReview: boolean;
        reason?: string;
        existingReviewId?: string;
      }>>(`/reviews/can-review?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get featured reviews
   */
  static async getFeaturedReviews(limit: number = 10): Promise<ApiResponse<Review[]>> {
    try {
      const response = await api.get<ApiResponse<Review[]>>(`/reviews/featured?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get recent reviews
   */
  static async getRecentReviews(limit: number = 10): Promise<ApiResponse<Review[]>> {
    try {
      const response = await api.get<ApiResponse<Review[]>>(`/reviews/recent?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}