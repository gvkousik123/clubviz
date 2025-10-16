import { api, handleApiResponse, handleApiError } from '../api-client';
import {
  ApiResponse,
  Club,
  ClubsFilter,
  LocationSearchRequest,
  LocationResult,
  PaginationMeta,
} from '../api-types';

export class ClubService {
  /**
   * Get all clubs with optional filtering
   */
  static async getClubs(filters?: ClubsFilter): Promise<ApiResponse<{ clubs: Club[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.location) {
          params.append('latitude', filters.location.latitude.toString());
          params.append('longitude', filters.location.longitude.toString());
          params.append('radius', filters.location.radius.toString());
        }
        if (filters.priceRange?.length) {
          params.append('priceRange', filters.priceRange.join(','));
        }
        if (filters.categories?.length) {
          params.append('categories', filters.categories.join(','));
        }
        if (filters.amenities?.length) {
          params.append('amenities', filters.amenities.join(','));
        }
        if (filters.rating) {
          params.append('rating', filters.rating.toString());
        }
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
          params.append('sortOrder', filters.sortOrder);
        }
        if (filters.page) {
          params.append('page', filters.page.toString());
        }
        if (filters.limit) {
          params.append('limit', filters.limit.toString());
        }
      }

      const response = await api.get<ApiResponse<{ clubs: Club[]; pagination: PaginationMeta }>>(
        `/clubs?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club by ID
   */
  static async getClubById(clubId: string): Promise<ApiResponse<Club>> {
    try {
      const response = await api.get<ApiResponse<Club>>(`/clubs/${clubId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get featured clubs
   */
  static async getFeaturedClubs(limit: number = 10): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>(`/clubs/featured?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get nearby clubs based on location
   */
  static async getNearbyClubs(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>(
        `/clubs/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search clubs by name or location
   */
  static async searchClubs(query: string, filters?: ClubsFilter): Promise<ApiResponse<{ clubs: Club[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filters) {
        if (filters.location) {
          params.append('latitude', filters.location.latitude.toString());
          params.append('longitude', filters.location.longitude.toString());
          params.append('radius', filters.location.radius.toString());
        }
        if (filters.priceRange?.length) {
          params.append('priceRange', filters.priceRange.join(','));
        }
        if (filters.categories?.length) {
          params.append('categories', filters.categories.join(','));
        }
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
          params.append('sortOrder', filters.sortOrder);
        }
        if (filters.page) {
          params.append('page', filters.page.toString());
        }
        if (filters.limit) {
          params.append('limit', filters.limit.toString());
        }
      }

      const response = await api.get<ApiResponse<{ clubs: Club[]; pagination: PaginationMeta }>>(
        `/clubs/search?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club categories
   */
  static async getClubCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/clubs/categories');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club amenities
   */
  static async getClubAmenities(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/clubs/amenities');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Add club to favorites
   */
  static async addToFavorites(clubId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/clubs/${clubId}/favorite`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove club from favorites
   */
  static async removeFromFavorites(clubId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        `/clubs/${clubId}/favorite`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's favorite clubs
   */
  static async getFavoriteClubs(): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>('/user/favorite-clubs');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if club is in user's favorites
   */
  static async isClubFavorite(clubId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    try {
      const response = await api.get<ApiResponse<{ isFavorite: boolean }>>(
        `/clubs/${clubId}/favorite/status`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club's available tables
   */
  static async getClubTables(clubId: string, date?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await api.get<ApiResponse<any[]>>(`/clubs/${clubId}/tables${params}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club's gallery images
   */
  static async getClubGallery(clubId: string): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>(`/clubs/${clubId}/gallery`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club's opening hours
   */
  static async getClubOpeningHours(clubId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/clubs/${clubId}/hours`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if club is open now
   */
  static async isClubOpen(clubId: string): Promise<ApiResponse<{ isOpen: boolean; nextOpenTime?: string }>> {
    try {
      const response = await api.get<ApiResponse<{ isOpen: boolean; nextOpenTime?: string }>>(
        `/clubs/${clubId}/status`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get clubs by city
   */
  static async getClubsByCity(city: string): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>(`/clubs/city/${city}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get popular clubs
   */
  static async getPopularClubs(limit: number = 10): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>(`/clubs/popular?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Location-based search for clubs and events
   */
  static async locationSearch(searchRequest: LocationSearchRequest): Promise<ApiResponse<LocationResult[]>> {
    try {
      const response = await api.post<ApiResponse<LocationResult[]>>('/search/location', searchRequest);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get club statistics (for analytics)
   */
  static async getClubStats(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>(`/clubs/${clubId}/stats`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Report a club
   */
  static async reportClub(clubId: string, reason: string, description?: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/clubs/${clubId}/report`,
        { reason, description }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get recommended clubs for user
   */
  static async getRecommendedClubs(limit: number = 10): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get<ApiResponse<Club[]>>(`/clubs/recommendations?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}