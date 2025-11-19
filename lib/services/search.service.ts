import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse, SmartSearchResponse } from '../api-types';

// Search-specific types
export interface SearchQuery {
  query: string;
}

export interface NearbySearchParams {
  lat: number;
  lng: number;
  radius?: number; // Default: 5000
  category?: string;
}

export type NearbyResultType = 'club' | 'event' | 'mixed' | 'unknown' | string;

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationText {
  address1: string;
  address2?: string;
  state: string;
  city: string;
  pincode: string;
  fullAddress: string;
}

export interface ImageObject {
  type: string;
  url: string;
}

export interface EntryPricing {
  coupleEntryPrice?: number;
  groupEntryPrice?: number;
  maleStagEntryPrice?: number;
  femaleStagEntryPrice?: number;
  coverCharge?: number;
  redeemDetails?: string;
  hasTimeRestriction?: boolean;
  timeRestriction?: string;
  inclusions?: string[];
  exclusions?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  phoneNumber: string;
  mobileNumber?: string;
  isMobileVerified?: boolean;
  otpCode?: string;
  otpExpiryTime?: string;
  otpAttempts?: number;
  lastOtpSentTime?: string;
  passwordResetToken?: string;
  passwordResetExpiryTime?: string;
  passwordResetOtp?: string;
  passwordResetOtpExpiryTime?: string;
  passwordResetAttempts?: number;
  profilePicture?: string;
  isActive: boolean;
  provider?: string;
  providerId?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

// Updated Club interface based on actual API response
export interface SearchClub {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  images?: ImageObject[];
  locationText?: LocationText;
  locationMap?: number[];
  foodCuisines?: string[];
  facilities?: string[];
  music?: string[];
  barOptions?: string[];
  entryPricing?: EntryPricing;
  category?: string;
  type?: string; // For backward compatibility
  rating?: number; // For UI display
  location?: string; // For address display
  address?: string; // For address display
  fullAddress?: string; // For address display
  owner?: UserProfile;
  members?: UserProfile[];
  admins?: UserProfile[];
  isActive: boolean;
  maxMembers?: number;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// Updated Event interface based on actual API response
export interface SearchEvent {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  locationText?: string;
  locationMap?: number[];
  imageUrl?: string;
  club: SearchClub;
  organizer?: UserProfile;
  attendees?: UserProfile[];
  maxAttendees?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface NearbyClub {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  images?: ImageObject[];
  locationText?: LocationText;
  locationMap?: number[];
  foodCuisines?: string[];
  facilities?: string[];
  music?: string[];
  barOptions?: string[];
  entryPricing?: EntryPricing;
  category?: string;
  type?: string; // For backward compatibility
  rating?: number; // For UI display
  location?: string; // For address display
  address?: string; // For address display
  fullAddress?: string; // For address display
  owner?: UserProfile;
  members?: UserProfile[];
  admins?: UserProfile[];
  isActive: boolean;
  maxMembers?: number;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NearbyEvent {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  locationText?: string;
  locationMap?: number[];
  imageUrl?: string;
  club: NearbyClub;
  organizer?: UserProfile;
  attendees?: UserProfile[];
  maxAttendees?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface NearbyResultSummary {
  id?: string;
  place_id?: string;
  name: string;
  description?: string;
  address?: string;
  lat: number;
  lng: number;
  distance?: number;
  category?: string;
  type?: NearbyResultType;
  metadata?: Record<string, any>;
}

export interface NearbySearchMeta {
  radius?: number;
  unit?: string;
  total?: number;
  category?: string;
  center?: LocationCoordinates;
  fetchedAt?: string;
}

export interface NearbyDetailsResponse {
  id?: string;
  place_id?: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  opening_hours?: string[];
  coordinates?: LocationCoordinates;
  extra?: Record<string, any>;
}

export interface NearbyAllResponse {
  results?: NearbyResultSummary[];
  events?: NearbyEvent[];
  clubs?: NearbyClub[];
  meta?: NearbySearchMeta;
}

export interface VenueSearchResult {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  images?: string[];
}

export interface EventSearchResult {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  location: string;
  imageUrl?: string;
}

export interface BalancedSearchResponse {
  venues: VenueSearchResult[];
  events: EventSearchResult[];
  foodTags: string[];
}

export interface SearchSuggestionsResponse {
  suggestions: string[];
}

export class SearchService {
  /**
   * Global search across venues and events (API: GET /search/global)
   */
  static async globalSearch(query: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<any>>(`/search/global?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Balanced search returning venues, events, and food tags (API: GET /search/balanced)
   */
  static async balancedSearch(query: string): Promise<ApiResponse<BalancedSearchResponse>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<BalancedSearchResponse>>(
        `/search/balanced?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get search suggestions (API: GET /search/suggestions)
   */
  static async getSearchSuggestions(query: string): Promise<ApiResponse<SearchSuggestionsResponse>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<SearchSuggestionsResponse>>(
        `/search/suggestions?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search for events (API: GET /search/events)
   * Returns SearchEvent[] - full event details with club information
   */
  static async searchEvents(query: string): Promise<ApiResponse<SearchEvent[]>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<SearchEvent[]>>(
        `/search/events?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get search categories (API: GET /search/categories)
   */
  static async getSearchCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/search/categories');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search for clubs/venues (API: GET /search/clubs)
   * Returns SearchClub[] - full club details with complete information
   */
  static async searchClubs(query: string): Promise<ApiResponse<SearchClub[]>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<SearchClub[]>>(
        `/search/clubs?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Find nearby events (API: GET /search/nearby/events)
   */
  static async findNearbyEvents(params: NearbySearchParams): Promise<ApiResponse<NearbyEvent[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lng', params.lng.toString());
      if (params.radius !== undefined) {
        queryParams.append('radius', params.radius.toString());
      }

      const response = await api.get<ApiResponse<NearbyEvent[]>>(
        `/search/nearby/events?${queryParams.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Find nearby clubs/venues (API: GET /search/nearby/clubs)
   */
  static async findNearbyClubs(params: NearbySearchParams): Promise<ApiResponse<NearbyClub[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lng', params.lng.toString());
      if (params.radius !== undefined) {
        queryParams.append('radius', params.radius.toString());
      }
      if (params.category) {
        queryParams.append('category', params.category);
      }

      const response = await api.get<ApiResponse<NearbyClub[]>>(
        `/search/nearby/clubs?${queryParams.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Find all nearby (both events and clubs) (API: GET /search/nearby/all)
   */
  static async findNearbyAll(params: NearbySearchParams): Promise<ApiResponse<NearbyAllResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lng', params.lng.toString());
      queryParams.append('radius', (params.radius ?? 5000).toString());
      if (params.category) {
        queryParams.append('category', params.category);
      }

      const response = await api.get<ApiResponse<NearbyAllResponse>>(`/search/nearby/all?${queryParams.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetch detail for a specific nearby result (API: GET /search/nearby/details)
   */
  static async getNearbyDetails(params: { id?: string; place_id?: string }): Promise<ApiResponse<NearbyDetailsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.id) {
        queryParams.append('id', params.id);
      }
      if (params.place_id) {
        queryParams.append('place_id', params.place_id);
      }

      const response = await api.get<ApiResponse<NearbyDetailsResponse>>(
        `/search/nearby/details?${queryParams.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search for clubs/venues (API: GET /search/smart)
   * Note: Assuming this is the venue/club search endpoint
   */
  // Smart search implementation moved to bottom with enhanced features

  /**
   * Balanced search results (API: GET /search/balanced)
   */
  static async searchBalanced(query: string): Promise<ApiResponse<BalancedSearchResponse>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<BalancedSearchResponse>>(
        `/search/balanced?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // SMART SEARCH
  // ============================================================================

  /**
   * Smart search with AI-powered results
   * GET /search/smart
   */
  static async smartSearch(query: string): Promise<SmartSearchResponse> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<SmartSearchResponse>(`/search/smart?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
