export type SavedLocation = {
  latitude: number;
  longitude: number;
  radius?: number;
  city?: string;
  label?: string;
  updatedAt?: string;
};

const STORAGE_KEY = 'clubviz.userLocation';

export const DEFAULT_LOCATION: SavedLocation = {
  latitude: 21.1458,
  longitude: 79.0882,
  radius: 15,
  city: 'Nagpur',
  label: 'Nagpur, India',
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
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored location:', error);
    return null;
  }
};

export const setStoredLocation = (location: SavedLocation) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload: SavedLocation = {
      ...location,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to persist location:', error);
  }
};

export const resolveLocation = (fallbackRadius: number = DEFAULT_LOCATION.radius ?? 10): SavedLocation => {
  const stored = getStoredLocation();

  if (stored) {
    return {
      ...stored,
      radius: stored.radius ?? fallbackRadius,
    };
  }

  return {
    ...DEFAULT_LOCATION,
    radius: DEFAULT_LOCATION.radius ?? fallbackRadius,
  };
};
