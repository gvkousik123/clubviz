import { api, handleApiResponse, handleApiError } from '../api-client';

// --- Types based on provided JSON response ---

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TicketType {
  typeName: string;
  price: number;
  isAvailable: boolean;
}

export interface SearchClubV2 {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  images: string[];
  address: string;
  distanceKm: number;
  coordinates: Coordinates;
  cuisines: string[];
  facilities: string[];
  musicGenres: string[];
  barOptions: string[];
  coupleEntryPrice: number;
  groupEntryPrice: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isNew: boolean;
  openingHours: string;
  isOpenNow: boolean;
  tags: string[];
}

export interface SearchEventV2 {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[];
  eventArtistName: string;
  aboutEventArtist: string;
  musicGenre: string;
  eventOrganizer: string;
  eventOrganizerLogo: string;
  startDateTime: string;
  endDateTime: string;
  isUpcoming: boolean;
  timeUntilEvent: string;
  clubName: string;
  location: string;
  distanceKm: number;
  coordinates: Coordinates;
  ticketTypes: TicketType[];
  minTicketPrice: number;
  maxTicketPrice: number;
  hasAvailableTickets: boolean;
  totalTickets: number;
  instagramHandle: string;
  spotifyHandle: string;
  attendeeCount: number;
  isTrending: boolean;
  tags: string[];
}

export interface FacetItem {
  name: string;
  count: number;
}

export interface SearchFacets {
  cuisines: FacetItem[];
  musicGenres: FacetItem[];
  facilities: FacetItem[];
  priceRanges: FacetItem[];
  areas: FacetItem[];
}

export interface SearchV2Response {
  query: string;
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  clubs: SearchClubV2[];
  events: SearchEventV2[];
  facets: SearchFacets;
  suggestions: string[];
}

// --- Request Params ---

export interface QuickSearchParams {
  query: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  searchType?: 'ALL' | 'CLUBS_ONLY' | 'EVENTS_ONLY';
  page?: number;
  size?: number;
}

export interface NearbySearchParamsV2 {
  lat: number;
  lng: number;
  radiusKm?: number; // Default 10
  cuisines?: string[];
  musicGenres?: string[];
  page?: number;
  size?: number;
}

export interface AdvancedSearchParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  cuisines?: string[];
  facilities?: string[];
  musicGenres?: string[];
  barOptions?: string[];
  eventMusicGenres?: string[];
  eventArtist?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'RELEVANCE' | 'DISTANCE' | 'PRICE' | 'RATING' | 'POPULARITY';
  sortOrder?: 'ASC' | 'DESC';
  searchType?: 'ALL' | 'CLUBS_ONLY' | 'EVENTS_ONLY';
  page?: number;
  size?: number;
}

export interface AutocompleteSuggestion {
  text: string;
  type: 'CLUB' | 'EVENT' | 'CUISINE' | 'ARTIST' | 'LOCATION';
  icon?: string;
  metadata?: string;
  relevanceScore?: number;
}

export interface AutocompleteResponse {
  query: string;
  suggestions: AutocompleteSuggestion[];
}


export const SearchService = {
  /**
   * Advanced search
   * POST /search/v2
   */
  async advancedSearch(params: AdvancedSearchParams): Promise<SearchV2Response> {
    try {
      const response = await api.post('/search/v2', params);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Autocomplete suggestions
   * GET /search/v2/autocomplete
   */
  async autocomplete(query: string): Promise<AutocompleteResponse> {
    try {
      const response = await api.get(`/search/v2/autocomplete?query=${encodeURIComponent(query)}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Quick search with query parameters
   * GET /search/v2/quick
   */
  async quickSearch(params: QuickSearchParams): Promise<SearchV2Response> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', params.query);
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lng) queryParams.append('lng', params.lng.toString());
      if (params.radiusKm) queryParams.append('radiusKm', params.radiusKm.toString());
      if (params.searchType) queryParams.append('searchType', params.searchType);
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());

      const response = await api.get(`/search/v2/quick?${queryParams.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Discover nearby clubs and events
   * GET /search/v2/nearby
   */
  async nearbySearch(params: NearbySearchParamsV2): Promise<SearchV2Response> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lng', params.lng.toString());
      if (params.radiusKm) queryParams.append('radiusKm', params.radiusKm.toString());
      if (params.cuisines?.length) queryParams.append('cuisines', params.cuisines.join(','));
      if (params.musicGenres?.length) queryParams.append('musicGenres', params.musicGenres.join(','));
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());

      const response = await api.get(`/search/v2/nearby?${queryParams.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
