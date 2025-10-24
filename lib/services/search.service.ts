import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

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
  fullName: string;
  phoneNumber: string;
  mobileNumber?: string;
  isMobileVerified?: boolean;
  profilePicture?: string;
  isActive: boolean;
  roles: string[];
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
   * Returns NearbyEvent[] - same structure as nearby events
   */
  static async searchEvents(query: string): Promise<ApiResponse<NearbyEvent[]>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<NearbyEvent[]>>(
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
   * Returns NearbyClub[] - same structure as nearby clubs
   */
  static async searchClubs(query: string): Promise<ApiResponse<NearbyClub[]>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<NearbyClub[]>>(
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
  static async findNearbyAll(params: NearbySearchParams): Promise<ApiResponse<{
    events?: NearbyEvent[];
    clubs?: NearbyClub[];
  }>> {
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

      const response = await api.get<ApiResponse<{
        events?: NearbyEvent[];
        clubs?: NearbyClub[];
      }>>(`/search/nearby/all?${queryParams.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search for clubs/venues (API: GET /search/smart)
   * Note: Assuming this is the venue/club search endpoint
   */
  static async smartSearch(query: string): Promise<ApiResponse<VenueSearchResult[]>> {
    try {
      const params = new URLSearchParams({ query });
      const response = await api.get<ApiResponse<VenueSearchResult[]>>(
        `/search/smart?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

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
}
