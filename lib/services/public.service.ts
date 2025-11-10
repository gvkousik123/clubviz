import { publicApi, api, isGuestMode } from '../api-client-public';
import { ClubService } from './club.service';
import { SearchService } from './search.service';
import { LookupService } from './lookup.service';
import { EventService } from './event.service';

// ============================================================================
// GUEST-FRIENDLY SERVICE WRAPPERS
// ============================================================================

/**
 * Public Club Service - Works without authentication
 * All methods use public endpoints that don't require tokens
 */
export class PublicClubService {
  /**
   * Search public clubs
   */
  static async searchClubs(query: string) {
    const response = await publicApi.get(`/clubs/search?query=${encodeURIComponent(query)}`);
    return {
      success: response.status === 200,
      data: response.data,
      message: 'Search completed successfully'
    };
  }

  /**
   * Get all public clubs
   */
  static async getPublicClubs() {
    const response = await publicApi.get('/clubs/public');
    return {
      success: response.status === 200,
      data: response.data,
      message: 'Clubs loaded successfully'
    };
  }

  /**
   * Get public club by ID
   */
  static async getPublicClubById(id: string) {
    const response = await publicApi.get(`/clubs/public/${id}`);
    return {
      success: response.status === 200,
      data: response.data,
      message: 'Club loaded successfully'
    };
  }

  /**
   * Get paginated public clubs list
   */
  static async getPublicClubsList(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await publicApi.get(`/clubs/public/list?${queryParams}`);
    // Return in the same format as the regular ClubService
    return {
      success: response.status === 200,
      data: response.data,
      message: 'Clubs loaded successfully'
    };
  }

  /**
   * Get clubs by location
   */
  static async getClubsByLocation() {
    const response = await publicApi.get('/clubs/public/locations');
    return response.data;
  }

  /**
   * Get clubs by category
   */
  static async getClubsByCategory(category: string) {
    const response = await publicApi.get(`/clubs/public/category/${category}`);
    return response.data;
  }

  /**
   * Get all club categories
   */
  static async getClubCategories() {
    const response = await publicApi.get('/clubs/public/categories');
    return response.data;
  }
}

/**
 * Public Search Service - Works without authentication
 */
export class PublicSearchService {
  /**
   * Global search
   */
  static async globalSearch(query: string) {
    const response = await publicApi.get(`/search/global?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  /**
   * Balanced search
   */
  static async balancedSearch(query: string) {
    const response = await publicApi.get(`/search/balanced?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  /**
   * Get search suggestions
   */
  static async getSearchSuggestions(query: string) {
    const response = await publicApi.get(`/search/suggestions?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  /**
   * Search events
   */
  static async searchEvents(query: string) {
    const response = await publicApi.get(`/search/events?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  /**
   * Get search categories
   */
  static async getSearchCategories() {
    const response = await publicApi.get('/search/categories');
    return {
      success: response.status === 200,
      data: response.data,
      message: 'Categories loaded successfully'
    };
  }

  /**
   * Search clubs
   */
  static async searchClubs(query: string) {
    const response = await publicApi.get(`/search/clubs?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  /**
   * Find nearby events
   */
  static async findNearbyEvents(params: { lat: number; lng: number; radius?: number }) {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await publicApi.get(`/search/nearby/events?${queryParams}`);
    return response.data;
  }

  /**
   * Find nearby clubs
   */
  static async findNearbyClubs(params: { lat: number; lng: number; radius?: number }) {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await publicApi.get(`/search/nearby/clubs?${queryParams}`);
    return response.data;
  }

  /**
   * Smart search
   */
  static async smartSearch(query: string) {
    const response = await publicApi.get(`/search/smart?query=${encodeURIComponent(query)}`);
    return response.data;
  }
}

/**
 * Public Event Service - For public events only
 */
export class PublicEventService {
  /**
   * Get public events list
   */
  static async getPublicEvents(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await publicApi.get(`/events/list?${queryParams}`);
    return response.data;
  }

  /**
   * Get public event details
   */
  static async getPublicEventById(eventId: string) {
    const response = await publicApi.get(`/events/${eventId}`);
    return response.data;
  }

  /**
   * Get events by club (public events only)
   */
  static async getEventsByClub(clubId: string) {
    const response = await publicApi.get(`/events/club/${clubId}`);
    return response.data;
  }
}

/**
 * Public Lookup Service - Reference data
 */
export class PublicLookupService {
  /**
   * Get lookup data by category
   */
  static async getLookupByCategory(category: string) {
    const response = await publicApi.get(`/lookup/club/${category}`);
    return response.data;
  }

  /**
   * Get all lookup data
   */
  static async getAllLookupData() {
    const response = await publicApi.get('/lookup/club/all');
    return response.data;
  }
}

// ============================================================================
// SMART SERVICE ROUTER
// ============================================================================

/**
 * Smart service that automatically routes to public or authenticated services
 * based on user's authentication status
 */
export class SmartServiceRouter {
  /**
   * Get appropriate club service based on auth status
   */
  static get clubs() {
    if (isGuestMode()) {
      return PublicClubService;
    }
    return ClubService; // Full authenticated service
  }

  /**
   * Get appropriate search service based on auth status
   */
  static get search() {
    if (isGuestMode()) {
      return PublicSearchService;
    }
    return SearchService; // Full authenticated service
  }

  /**
   * Get appropriate event service based on auth status
   */
  static get events() {
    if (isGuestMode()) {
      return PublicEventService;
    }
    return EventService; // Full authenticated service
  }

  /**
   * Get lookup service (always public)
   */
  static get lookup() {
    return PublicLookupService;
  }
}

// ============================================================================
// UTILITY FUNCTIONS FOR GUEST ACCESS
// ============================================================================

/**
 * Check if a specific action requires authentication
 */
export const requiresAuth = (action: string): boolean => {
  const protectedActions = [
    'join_club',
    'rsvp_event',
    'make_booking',
    'upload_content',
    'create_club',
    'create_event',
    'admin_operations'
  ];

  return protectedActions.includes(action);
};

/**
 * Get user-friendly message for actions that require authentication
 */
export const getAuthRequiredMessage = (action: string): string => {
  const messages: Record<string, string> = {
    'join_club': 'Please login to join clubs',
    'rsvp_event': 'Please login to RSVP to events',
    'make_booking': 'Please login to make bookings',
    'upload_content': 'Please login to upload content',
    'create_club': 'Please login to create clubs',
    'create_event': 'Please login to create events',
    'admin_operations': 'Admin access required'
  };

  return messages[action] || 'Please login to continue';
};

/**
 * Redirect to login with return URL
 */
export const redirectToLogin = (returnUrl?: string) => {
  if (typeof window !== 'undefined') {
    const currentUrl = returnUrl || window.location.pathname;
    window.location.href = `/auth/mobile?returnUrl=${encodeURIComponent(currentUrl)}`;
  }
};