export type LocationSource = 'default' | 'list' | 'map' | 'geo' | 'manual';

export type SavedLocation = {
  name: string;
  label?: string;
  lat: number;
  lng: number;
  /**
   * Legacy fields we still populate for existing consumers that expect latitude/longitude.
   */
  latitude?: number;
  longitude?: number;
  radius?: number;
  city?: string;
  address?: string;
  timestamp: string;
  source?: LocationSource;
};

export type LocationOption = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city?: string;
  address?: string;
  radius?: number;
};

const STORAGE_KEY = 'clubviz.userLocation';
export const DEFAULT_RADIUS = 5000; // meters

// Dynamic location options - Fetched from API
export let POPULAR_LOCATIONS: LocationOption[] = [];

// Default location - Used as fallback before API loads
export const DEFAULT_LOCATION: SavedLocation = {
  name: 'Mumbai',
  label: 'Mumbai',
  lat: 19.0760,
  lng: 72.8777,
  latitude: 19.0760,
  longitude: 72.8777,
  city: 'Mumbai',
  address: 'Mumbai, India',
  radius: DEFAULT_RADIUS,
  timestamp: new Date(0).toISOString(),
  source: 'default',
};

const normalizeLocationPayload = (location: Partial<SavedLocation>): SavedLocation | null => {
  const lat = location.lat ?? location.latitude;
  const lng = location.lng ?? location.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  const timestamp = location.timestamp || new Date().toISOString();
  const name = location.name || location.label || 'Saved Location';

  return {
    name,
    label: location.label || name,
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    radius: location.radius ?? DEFAULT_RADIUS,
    city: location.city,
    address: location.address,
    timestamp,
    source: location.source || 'manual',
  };
};

export const getStoredLocation = (): SavedLocation | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as SavedLocation;
    return normalizeLocationPayload(parsed);
  } catch (error) {
    console.warn('Failed to parse stored location:', error);
    return null;
  }
};

const buildLocationFromOption = (
  option: LocationOption,
  source: LocationSource = 'default'
): SavedLocation => ({
  name: option.name,
  label: option.name,
  lat: option.lat,
  lng: option.lng,
  latitude: option.lat,
  longitude: option.lng,
  city: option.city,
  address: option.address,
  radius: option.radius ?? DEFAULT_RADIUS,
  timestamp: new Date().toISOString(),
  source,
});

export const setStoredLocation = (
  location: Omit<SavedLocation, 'timestamp'> & { timestamp?: string }
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const normalized = normalizeLocationPayload({ ...location, timestamp: location.timestamp });
    if (!normalized) {
      throw new Error('Invalid location payload');
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn('Failed to persist location:', error);
  }
};

export const resolveLocation = (): SavedLocation => {
  const stored = getStoredLocation();
  if (stored) {
    return stored;
  }

  // Use first popular location if available, otherwise use default
  const locationOption = POPULAR_LOCATIONS[0];
  const fallback = locationOption
    ? buildLocationFromOption(locationOption)
    : DEFAULT_LOCATION;

  setStoredLocation(fallback);
  return fallback;
};

export const selectLocationFromOption = (
  optionId: string,
  source: LocationSource = 'list'
): SavedLocation => {
  const option = POPULAR_LOCATIONS.find((loc) => loc.id === optionId) || POPULAR_LOCATIONS[0];

  // If option is still undefined, use DEFAULT_LOCATION
  if (!option) {
    setStoredLocation(DEFAULT_LOCATION);
    return DEFAULT_LOCATION;
  }

  const payload = buildLocationFromOption(option, source);
  setStoredLocation(payload);
  return payload;
};

export const persistCustomLocation = (
  location: { name: string; lat: number; lng: number; address?: string; city?: string },
  source: LocationSource = 'manual'
): SavedLocation => {
  const payload: SavedLocation = {
    name: location.name,
    label: location.name,
    lat: location.lat,
    lng: location.lng,
    latitude: location.lat,
    longitude: location.lng,
    city: location.city,
    address: location.address,
    radius: DEFAULT_RADIUS,
    timestamp: new Date().toISOString(),
    source,
  };
  setStoredLocation(payload);
  return payload;
};

/**
 * Update POPULAR_LOCATIONS with clubs from API
 * This should be called once on app initialization
 */
export const updatePopularLocationsFromClubs = (clubs: Array<{
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  city?: string;
  address?: string;
}>) => {
  POPULAR_LOCATIONS = clubs
    .filter(club => club.latitude !== undefined && club.longitude !== undefined)
    .slice(0, 10)
    .map(club => ({
      id: club.id,
      name: club.name,
      lat: club.latitude!,
      lng: club.longitude!,
      city: club.city || club.location,
      address: club.address || club.location,
    }));
};
