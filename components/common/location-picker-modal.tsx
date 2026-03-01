'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, X, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { POPULAR_LOCATIONS } from '@/lib/location';

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (coords: LocationCoordinates, locationName: string) => void;
}

export function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
}: LocationPickerModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');

  // Filter popular locations based on search
  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (loc.address && loc.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location not supported',
        description: 'Your device does not support location services.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setSelectedLocation(coords);
        setSelectedLocationName('Current Location');
        
        toast({
          title: 'Location detected',
          description: 'Using your current location for search',
        });
        
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        let errorMessage = 'Please enable location access or select manually.';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable it in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable. Please try again.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Please try again.';
        }

        toast({
          title: 'Unable to access location',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    );
  };

  const handleSelectLocation = (location: typeof POPULAR_LOCATIONS[0]) => {
    setSelectedLocation({ lat: location.lat, lng: location.lng });
    setSelectedLocationName(location.name);
  };

  const handleConfirm = () => {
    if (!selectedLocation || !selectedLocationName) {
      toast({
        title: 'No location selected',
        description: 'Please select a location or use your current location.',
        variant: 'destructive',
      });
      return;
    }

    onSelectLocation(selectedLocation, selectedLocationName);
    setSearchQuery('');
    setSelectedLocation(null);
    setSelectedLocationName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[430px] mx-auto bg-[#1e2328] rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Use Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#14FFEC] hover:bg-[#14FFEC]/90 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Detecting location...
            </>
          ) : (
            <>
              <Navigation size={18} />
              Use Current Location
            </>
          )}
        </button>

        {/* Selected Location Display */}
        {selectedLocation && selectedLocationName && (
          <div className="bg-[#14FFEC]/10 border border-[#14FFEC] rounded-xl p-3 flex items-center gap-2">
            <MapPin size={18} className="text-[#14FFEC] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[#14FFEC] text-sm font-semibold truncate">
                {selectedLocationName}
              </p>
              <p className="text-white/60 text-xs">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 text-white text-sm rounded-lg px-4 py-2.5 outline-none border border-white/20 focus:border-[#14FFEC] placeholder-white/50 transition-all"
          />
        </div>

        {/* Popular Locations List */}
        <div className="space-y-2">
          <p className="text-white/70 text-xs font-semibold px-1">
            {searchQuery ? 'Search Results' : 'Popular Locations'}
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${
                    selectedLocation?.lat === location.lat && selectedLocation?.lng === location.lng
                      ? 'bg-[#14FFEC]/20 border-[#14FFEC]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <p className="text-white font-semibold text-sm truncate">
                    {location.name}
                  </p>
                  <p className="text-white/60 text-xs truncate">
                    {location.city || location.address || 'Nearby area'}
                  </p>
                </button>
              ))
            ) : (
              <div className="text-white/60 text-sm py-4 text-center">
                No locations found
              </div>
            )}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="w-full bg-[#11B9AB] hover:bg-[#11B9AB]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all mt-4"
        >
          Search from this Location
        </button>
      </div>
    </div>
  );
}
