'use client';

import React, { useState } from 'react';
import { Heart, Star, MapPin, Clock, Calendar, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

type FavoriteType = 'all' | 'clubs' | 'events';

interface FavoriteItem {
  id: string;
  type: 'club' | 'event';
  name: string;
  venue?: string;
  location: string;
  image: string;
  rating: number;
  date?: string;
  time?: string;
  tags: string[];
  addedDate: string;
  isActive?: boolean;
}

function FavoriteCard({ item, onRemove }: { item: FavoriteItem; onRemove: (id: string) => void }) {
  return (
    <GlassCard className="relative">
      <div className="flex gap-4">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          {item.type === 'event' && item.isActive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-dark-900 rounded-full" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white font-semibold">{item.name}</h3>
              {item.venue && (
                <p className="text-text-secondary text-sm">{item.venue}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 text-text-tertiary hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span className="text-text-secondary text-xs">{item.location}</span>
            </div>
          </div>

          {item.type === 'event' && item.date && (
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span className="text-text-secondary text-xs">{item.date}</span>
              {item.time && (
                <>
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-text-secondary text-xs">{item.time}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-text-tertiary text-xs">Added {item.addedDate}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState<FavoriteType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: '1',
      type: 'club',
      name: 'DABO Club',
      location: 'Airport Road, Nagpur',
      image: '/purple-neon-club-interior.jpg',
      rating: 4.8,
      tags: ['Electronic', 'House', 'Techno'],
      addedDate: '2 days ago'
    },
    {
      id: '2',
      type: 'event',
      name: 'Freaky Friday',
      venue: 'DABO Club',
      location: 'Airport Road, Nagpur',
      image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
      rating: 4.9,
      date: 'Apr 4, 2024',
      time: '9:00 PM',
      tags: ['EDM', 'Party'],
      addedDate: '1 week ago',
      isActive: true
    },
    {
      id: '3',
      type: 'club',
      name: 'Skybar Lounge',
      location: 'Marine Drive, Mumbai',
      image: '/upscale-bar-interior-with-bottles.jpg',
      rating: 4.6,
      tags: ['Lounge', 'Jazz', 'Cocktails'],
      addedDate: '2 weeks ago'
    },
    {
      id: '4',
      type: 'event',
      name: 'Underground Beats',
      venue: 'Purple Haze Club',
      location: 'Bandra, Mumbai',
      image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
      rating: 4.7,
      date: 'Mar 28, 2024',
      time: '10:00 PM',
      tags: ['Underground', 'Deep House'],
      addedDate: '3 weeks ago'
    },
    {
      id: '5',
      type: 'club',
      name: 'Neon Nights',
      location: 'Koregaon Park, Pune',
      image: '/red-neon-lounge-interior.jpg',
      rating: 4.5,
      tags: ['Hip Hop', 'R&B'],
      addedDate: '1 month ago'
    }
  ]);

  const filteredFavorites = favorites.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab.slice(0, -1);
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const handleBack = () => {
    window.history.back();
  };

  const stats = {
    clubs: favorites.filter(item => item.type === 'club').length,
    events: favorites.filter(item => item.type === 'event').length,
    total: favorites.length
  };

  return (
    <MobileLayout showNavigation={false}>
      <PageHeader
        title="My Favorites"
        showBack
        onBack={handleBack}
        rightElement={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 transition-colors",
              showFilters ? "text-purple-400" : "text-text-secondary hover:text-purple-400"
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-6 pb-6">
        {/* Stats */}
        <GlassCard className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
              <p className="text-text-tertiary text-sm">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">{stats.clubs}</p>
              <p className="text-text-tertiary text-sm">Clubs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.events}</p>
              <p className="text-text-tertiary text-sm">Events</p>
            </div>
          </div>
        </GlassCard>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <Input
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-600 border-dark-500 text-white pl-10"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <GlassCard className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filter by Type</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === 'all'
                    ? "bg-purple-500 text-white"
                    : "bg-dark-600 text-text-secondary hover:text-white"
                )}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === 'clubs'
                    ? "bg-purple-500 text-white"
                    : "bg-dark-600 text-text-secondary hover:text-white"
                )}
              >
                Clubs ({stats.clubs})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === 'events'
                    ? "bg-purple-500 text-white"
                    : "bg-dark-600 text-text-secondary hover:text-white"
                )}
              >
                Events ({stats.events})
              </button>
            </div>
          </GlassCard>
        )}

        {/* Favorites List */}
        {filteredFavorites.length > 0 ? (
          <div className="space-y-4">
            {filteredFavorites.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                onRemove={handleRemoveFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No matching favorites' : 'No favorites yet'}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Start exploring clubs and events to add them to your favorites'
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={() => window.location.href = '/home'}
                className="bg-gradient-primary hover:opacity-90"
              >
                Explore Now
              </Button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {filteredFavorites.length > 0 && (
          <div className="mt-8 space-y-3">
            <Button
              onClick={() => window.location.href = '/home'}
              variant="outline"
              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Discover More
            </Button>
            <Button
              onClick={() => window.location.href = '/profile'}
              variant="outline"
              className="w-full border-dark-500 text-text-secondary hover:bg-dark-600"
            >
              Back to Profile
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}