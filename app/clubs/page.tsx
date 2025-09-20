'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Bookmark, ChevronLeft, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VenueListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Open Now', 'Nearby', 'Popular', 'New'];

  const venues = [
    {
      id: 'dabo',
      name: 'DABO',
      location: 'Raj nagar, Shantigram',
      description: 'Premium Nightclub & Lounge',
      image: '/red-neon-lounge-interior.jpg',
      rating: 4.2,
      reviews: 1250,
      isOpen: true,
      openUntil: '1:30 AM',
      distance: '2.1 km',
      price: '₹1500',
      coverImage: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg'
    },
    {
      id: 'lord-of-the-vibes',
      name: 'LORD OF THE VIBES',
      location: 'Ghorpade Peth, Pune',
      description: 'Restaurant | Bar | Live Music',
      image: '/upscale-bar-interior-with-bottles.jpg',
      rating: 4.5,
      reviews: 890,
      isOpen: true,
      openUntil: '2:00 AM',
      distance: '3.5 km',
      price: '₹2000',
      coverImage: '/night-party-event-poster-with-purple-and-pink-neon.jpg'
    },
    {
      id: 'cafe-barrel',
      name: 'CAFE BARREL',
      location: 'Mangalwar Peth, Dharampeth',
      description: 'Cafe | Restaurant | Rooftop Bar',
      image: '/upscale-club-interior-with-blue-lighting.jpg',
      rating: 4.3,
      reviews: 650,
      isOpen: true,
      openUntil: '11:30 PM',
      distance: '1.8 km',
      price: '₹1200',
      coverImage: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg'
    },
    {
      id: 'roasta',
      name: 'ROASTA',
      location: 'Civil Lines, Nagpur',
      description: 'Multi-cuisine Restaurant & Bar',
      image: '/purple-neon-club-interior.jpg',
      rating: 4.1,
      reviews: 420,
      isOpen: false,
      openUntil: 'Closed',
      distance: '4.2 km',
      price: '₹1800',
      coverImage: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg'
    }
  ];

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  const handleVenueClick = (venueId: string) => {
    router.push(`/clubs/${venueId}`);
  };

  const handleFilterClick = () => {
    // Show filter modal
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <button
          onClick={handleBack}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-2xl font-bold text-white">Clubs & Venues</h1>

        <button
          onClick={handleFilterClick}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <SlidersHorizontal className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
          <input
            type="text"
            placeholder="Search clubs, bars, restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-6">
        <div className="flex space-x-3 pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap font-medium transition-all duration-300 ${selectedFilter === filter
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 mb-6">
        <p className="text-white/70">
          {filteredVenues.length} venues found
        </p>
      </div>

      {/* Venue List */}
      <div className="px-6 space-y-6 pb-24">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            onClick={() => handleVenueClick(venue.id)}
            className="relative rounded-3xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10"
          >
            {/* Venue Image */}
            <div className="relative h-48">
              <img
                src={venue.coverImage}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${venue.isOpen
                ? 'bg-green-500/80 text-white'
                : 'bg-red-500/80 text-white'
                }`}>
                {venue.isOpen ? 'Open' : 'Closed'}
              </div>

              {/* Bookmark */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
                <Bookmark className="w-5 h-5 text-white" />
              </button>

              {/* Distance */}
              <div className="absolute top-4 right-16 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">{venue.distance}</span>
              </div>
            </div>

            {/* Venue Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{venue.name}</h3>
                  <p className="text-purple-300 text-sm font-medium mb-2">{venue.description}</p>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-300 text-sm">Entry</p>
                  <p className="text-white font-bold text-lg">{venue.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{venue.rating}</span>
                    <span className="text-white/60 text-sm">({venue.reviews})</span>
                  </div>

                  {venue.isOpen && (
                    <div className="text-white/70 text-sm">
                      Open until {venue.openUntil}
                    </div>
                  )}
                </div>

                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center justify-around py-4">
          <button
            onClick={() => router.push('/home')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60 rounded-sm"></div>
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-purple-400 text-xs font-medium">Clubs</span>
          </button>

          <button
            onClick={() => router.push('/events')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60"></div>
            </div>
            <span className="text-white/60 text-xs">Events</span>
          </button>

          <button
            onClick={() => router.push('/tickets')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Tickets</span>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60 rounded-full"></div>
            </div>
            <span className="text-white/60 text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}