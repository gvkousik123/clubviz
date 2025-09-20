'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Bookmark, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout, PageHeader, GlassCard, GridLayout } from '@/components/layout/Layout';
import { BottomNavigation } from '@/components/navigation/Navigation';
import { cn } from '@/lib/utils';

interface ClubCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  openUntil: string;
  isBookmarked: boolean;
  priceRange: string;
  genres: string[];
  isOpen: boolean;
}

function ClubCard({
  id,
  name,
  image,
  rating,
  distance,
  openUntil,
  isBookmarked,
  priceRange,
  genres,
  isOpen
}: ClubCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover"
        />

        {/* Status Badge */}
        <div className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium",
          isOpen
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        )}>
          {isOpen ? 'Open' : 'Closed'}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full backdrop-blur-sm"
        >
          <Bookmark
            className={cn(
              "w-4 h-4",
              bookmarked ? "text-purple-400 fill-current" : "text-white"
            )}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{rating}</span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        {/* Club Name and Distance */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-white">{name}</h3>
          <div className="flex items-center gap-1 text-text-tertiary text-xs">
            <MapPin className="w-3 h-3" />
            <span>{distance}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30"
            >
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className="px-2 py-1 bg-dark-700 text-text-tertiary text-xs rounded-full">
              +{genres.length - 2}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-text-secondary">
            <Clock className="w-4 h-4" />
            <span>{openUntil}</span>
          </div>
          <span className="text-purple-400 font-medium">{priceRange}</span>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4 bg-gradient-primary hover:opacity-90"
          onClick={() => window.location.href = `/clubs/${id}`}
        >
          View Details
        </Button>
      </div>
    </GlassCard>
  );
}

const clubsData = [
  {
    id: 'dabo',
    name: 'DABO',
    image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
    rating: 4.2,
    distance: '2.5 km',
    openUntil: 'Open until 1:30 AM',
    isBookmarked: true,
    priceRange: '₹800-1200',
    genres: ['House', 'Techno', 'EDM'],
    isOpen: true
  },
  {
    id: 'venue-club',
    name: 'VENUE CLUB',
    image: '/upscale-club-interior-with-blue-lighting.jpg',
    rating: 4.5,
    distance: '1.8 km',
    openUntil: 'Open until 2:00 AM',
    isBookmarked: false,
    priceRange: '₹1000-1500',
    genres: ['Hip Hop', 'Pop', 'Commercial'],
    isOpen: true
  },
  {
    id: 'neon-lounge',
    name: 'NEON LOUNGE',
    image: '/red-neon-lounge-interior.jpg',
    rating: 4.0,
    distance: '3.2 km',
    openUntil: 'Opens at 8:00 PM',
    isBookmarked: false,
    priceRange: '₹600-900',
    genres: ['Chill', 'Lounge', 'Jazz'],
    isOpen: false
  },
  {
    id: 'purple-club',
    name: 'PURPLE CLUB',
    image: '/purple-neon-club-interior.jpg',
    rating: 4.3,
    distance: '4.1 km',
    openUntil: 'Open until 3:00 AM',
    isBookmarked: true,
    priceRange: '₹900-1300',
    genres: ['Trance', 'Progressive', 'Psytrance'],
    isOpen: true
  }
];

export default function ClubListScreen() {
  const [activeTab, setActiveTab] = useState('clubs');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const filteredClubs = clubsData.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MobileLayout>
      {/* Header */}
      <PageHeader
        title="Clubs & Venues"
        subtitle="Discover the best nightlife spots"
        rightElement={
          <button className="p-2 text-text-secondary hover:text-purple-400 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-6 pb-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search clubs, genres, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-tertiary border border-dark-600 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 mb-6 overflow-x-scroll pb-2 scrollbar-hide">
          {['All', 'Open Now', 'Nearby', 'Popular', 'New'].map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                filter === 'All'
                  ? "bg-gradient-primary text-white"
                  : "bg-dark-700 text-text-secondary hover:text-text-primary hover:bg-dark-600"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-text-secondary text-sm">
            {filteredClubs.length} clubs found
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="distance">Sort by Distance</option>
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Clubs Grid */}
        <GridLayout columns={1} gap={4}>
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} {...club} />
          ))}
        </GridLayout>

        {/* Load More */}
        {filteredClubs.length > 0 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="bg-dark-700 border-dark-600 text-white hover:bg-dark-600"
            >
              Load More Clubs
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No clubs found</h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="bg-dark-700 border-dark-600 text-white hover:bg-dark-600"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </MobileLayout>
  );
}