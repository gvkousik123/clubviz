import { api, handleApiResponse, handleApiError } from '../api-client';
import {
  ApiResponse,
  Event,
  EventsFilter,
  TicketType,
  Performer,
  PaginationMeta,
} from '../api-types';

export class EventService {
  /**
   * Get all events with optional filtering
   */
  static async getEvents(filters?: EventsFilter): Promise<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.clubId) {
          params.append('clubId', filters.clubId);
        }
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.startDate);
          params.append('endDate', filters.dateRange.endDate);
        }
        if (filters.priceRange) {
          params.append('minPrice', filters.priceRange.min.toString());
          params.append('maxPrice', filters.priceRange.max.toString());
        }
        if (filters.musicGenres?.length) {
          params.append('musicGenres', filters.musicGenres.join(','));
        }
        if (filters.location) {
          params.append('latitude', filters.location.latitude.toString());
          params.append('longitude', filters.location.longitude.toString());
          params.append('radius', filters.location.radius.toString());
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

      const response = await api.get<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>>(
        `/events?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get event by ID
   */
  static async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    try {
      const response = await api.get<ApiResponse<Event>>(`/events/${eventId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get featured events
   */
  static async getFeaturedEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/events/featured?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(limit: number = 20): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/events/upcoming?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events by club
   */
  static async getEventsByClub(clubId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>> {
    try {
      const response = await api.get<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>>(
        `/clubs/${clubId}/events?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search events by name, artist, or club
   */
  static async searchEvents(query: string, filters?: EventsFilter): Promise<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filters) {
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.startDate);
          params.append('endDate', filters.dateRange.endDate);
        }
        if (filters.priceRange) {
          params.append('minPrice', filters.priceRange.min.toString());
          params.append('maxPrice', filters.priceRange.max.toString());
        }
        if (filters.musicGenres?.length) {
          params.append('musicGenres', filters.musicGenres.join(','));
        }
        if (filters.location) {
          params.append('latitude', filters.location.latitude.toString());
          params.append('longitude', filters.location.longitude.toString());
          params.append('radius', filters.location.radius.toString());
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

      const response = await api.get<ApiResponse<{ events: Event[]; pagination: PaginationMeta }>>(
        `/events/search?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get popular events
   */
  static async getPopularEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/events/popular?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events by date range
   */
  static async getEventsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(
        `/events/date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events by music genre
   */
  static async getEventsByGenre(genre: string, limit: number = 20): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/events/genre/${genre}?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get available music genres
   */
  static async getMusicGenres(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/events/genres');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Add event to favorites
   */
  static async addToFavorites(eventId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/events/${eventId}/favorite`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove event from favorites
   */
  static async removeFromFavorites(eventId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        `/events/${eventId}/favorite`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's favorite events
   */
  static async getFavoriteEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>('/user/favorite-events');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if event is in user's favorites
   */
  static async isEventFavorite(eventId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    try {
      const response = await api.get<ApiResponse<{ isFavorite: boolean }>>(
        `/events/${eventId}/favorite/status`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get event ticket types
   */
  static async getEventTicketTypes(eventId: string): Promise<ApiResponse<TicketType[]>> {
    try {
      const response = await api.get<ApiResponse<TicketType[]>>(`/events/${eventId}/tickets`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get event performers
   */
  static async getEventPerformers(eventId: string): Promise<ApiResponse<Performer[]>> {
    try {
      const response = await api.get<ApiResponse<Performer[]>>(`/events/${eventId}/performers`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get nearby events based on location
   */
  static async getNearbyEvents(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(
        `/events/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events happening today
   */
  static async getTodayEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>('/events/today');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events happening this weekend
   */
  static async getWeekendEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>('/events/weekend');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get recommended events for user
   */
  static async getRecommendedEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/events/recommendations?limit=${limit}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get event statistics (for analytics)
   */
  static async getEventStats(eventId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>(`/events/${eventId}/stats`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Report an event
   */
  static async reportEvent(eventId: string, reason: string, description?: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/events/${eventId}/report`,
        { reason, description }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Share event
   */
  static async shareEvent(eventId: string, platform: string): Promise<ApiResponse<{ shareUrl: string }>> {
    try {
      const response = await api.post<ApiResponse<{ shareUrl: string }>>(
        `/events/${eventId}/share`,
        { platform }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check event availability
   */
  static async checkEventAvailability(eventId: string): Promise<ApiResponse<{ isAvailable: boolean; availableTickets: number }>> {
    try {
      const response = await api.get<ApiResponse<{ isAvailable: boolean; availableTickets: number }>>(
        `/events/${eventId}/availability`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get events by performer
   */
  static async getEventsByPerformer(performerId: string): Promise<ApiResponse<Event[]>> {
    try {
      const response = await api.get<ApiResponse<Event[]>>(`/performers/${performerId}/events`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}