import { publicApi, api, isGuestMode } from '../api-client-public';
import { STORAGE_KEYS } from '../constants/storage';
import { ClubService } from './club.service';
import { SearchService } from './search.service';
import { LookupService } from './lookup.service';
import { EventService } from './event.service';

// ============================================================================
// TYPE DEFINITIONS FOR PUBLIC CLUB API
// ============================================================================

export interface PublicClubListItem {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  category: string | null;
  location: string | null;
  memberCount: number;
  maxMembers: number | null;
  isJoined: boolean;
  isFull: boolean;
  isActive: boolean;
  ownerName: string;
  createdAt: string;
  shortDescription: string;
  memberStatus: string;
  capacityPercentage: number;
}

export interface PublicClubListResponse {
  content: PublicClubListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  paginationInfo: string;
  resultsInfo: string;
}

export interface PublicClubDetails {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  images: string[];
  category: string | null;
  locationText: {
    address1: string;
    address2: string;
    state: string;
    city: string;
    pincode: string;
  } | null;
  locationMap: {
    lat: number;
    lng: number;
  } | null;
  contactEmail: string;
  contactPhone: string;
  foodCuisines: string[] | null;
  facilities: string[] | null;
  music: string[] | null;
  barOptions: string[] | null;
  entryPricing: any | null;
  memberCount: number;
  maxMembers: number;
  isJoined: boolean;
  canJoin: boolean;
  isFull: boolean;
  isActive: boolean;
  owner: any | null;
  recentMembers: any[];
  admins: any[];
  createdAt: string;
  updatedAt: string;
  memberStatus: string;
  capacityPercentage: number;
  joinButtonText: string;
  canPerformAction: boolean;
}

export interface PublicClubListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  category?: string;
  location?: string;
  query?: string;
  hasSpace?: boolean;
}

// ============================================================================
// TYPE DEFINITIONS FOR PUBLIC EVENT API
// ============================================================================

export interface PublicEventListItem {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string | null;
  location: string;
  startDateTime: string;
  endDateTime: string;
  formattedDate: string;
  formattedTime: string;
  timeUntilEvent: string;
  duration: string;
  attendeeCount: number;
  maxAttendees: number;
  isRegistered: boolean;
  canRegister: boolean;
  isFull: boolean;
  clubId: string | null;
  clubName: string | null;
  clubLogo: string | null;
  organizerName: string | null;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  requiresApproval: boolean;
  capacityPercentage: number;
  attendeeStatus: string;
  eventStatusText: string;
  pastEvent: boolean;
  upcoming: boolean;
  ongoing: boolean;
}

export interface PublicEventListResponse {
  content: PublicEventListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  paginationInfo?: string;
  resultsInfo?: string;
}

export interface PublicEventDetails {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  images: string[] | null;
  location: string;
  startDateTime: string;
  endDateTime: string;
  formattedDate: string;
  formattedTime: string;
  timeUntilEvent: string;
  duration: string;
  attendeeCount: number;
  maxAttendees: number;
  isRegistered: boolean;
  canRegister: boolean;
  isFull: boolean;
  rsvpStatus: string;
  club: any | null;
  organizer: any | null;
  recentAttendees: any[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
  capacityPercentage: number;
  canPerformAction: boolean;
  attendeeStatus: string;
  registerButtonText: string;
}

export interface PublicEventListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

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
  static async getPublicClubById(id: string): Promise<PublicClubDetails> {
    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get(`/clubs/public/${id}`, { headers });
    return response.data;
  }

  /**
   * Get paginated public clubs list with filtering and sorting
   */
  static async getPublicClubsList(params: PublicClubListParams = {}): Promise<PublicClubListResponse> {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append('page', (params.page ?? 0).toString());
    queryParams.append('size', (params.size ?? 10).toString());

    // Add sorting params
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortDirection) {
      queryParams.append('sortDirection', params.sortDirection);
    }

    // Add filter params
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.location) {
      queryParams.append('location', params.location);
    }
    if (params.query) {
      queryParams.append('query', params.query);
    }
    if (params.hasSpace !== undefined) {
      queryParams.append('hasSpace', params.hasSpace.toString());
    }

    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get(`/clubs/public/list?${queryParams.toString()}`, { headers });
    return response.data;
  }

  /**
   * Get all available club locations
   */
  static async getClubLocations(): Promise<string[]> {
    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get('/clubs/public/locations', { headers });

    // Handle response - should be array of strings
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback if wrapped differently
    return response.data?.content || response.data || [];
  }

  /**
   * Get clubs by category
   */
  static async getClubsByCategory(category: string) {
    const response = await publicApi.get(`/clubs/public/category/${category}`);
    return response.data;
  }

  /**
   * Get all available club categories
   */
  static async getClubCategories(): Promise<string[]> {
    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get('/clubs/public/categories', { headers });

    // Handle response - should be array of strings
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback if wrapped differently
    return response.data?.content || response.data || [];
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
   * Get paginated public events list with filtering and sorting
   */
  static async getPublicEvents(params: PublicEventListParams = {}): Promise<PublicEventListResponse> {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append('page', (params.page ?? 0).toString());
    queryParams.append('size', (params.size ?? 20).toString());

    // Add sorting params
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    // Add filter params
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get(`/event-management/events/list?${queryParams.toString()}`, { headers });
    return response.data;
  }

  /**
   * Get user's registered events (requires authentication)
   */
  static async getMyRegistrations(params: PublicEventListParams = {}): Promise<PublicEventListResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append('page', (params.page ?? 0).toString());
    queryParams.append('size', (params.size ?? 20).toString());

    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get(`/event-management/events/my-registrations?${queryParams.toString()}`, { headers });
    return response.data;
  }

  /**
   * Get public event details by ID
   */
  static async getPublicEventById(eventId: string): Promise<PublicEventDetails> {
    // Get authorization token
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await publicApi.get(`/event-management/events/${eventId}/details`, { headers });
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