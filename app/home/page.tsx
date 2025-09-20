'use client';

import React, { useState } from 'react';
import { Search, User, MapPin, ChevronDown, Heart, Star, Menu, Bookmark, Phone, MessageCircle, Camera, X, Mail, FileText, Lock } from 'lucide-react';

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);

  const venues = [
    {
      id: 'dabo',
      name: 'DABO',
      hours: 'Open until 1:30 am',
      rating: 4.2,
      image: '/red-neon-lounge-interior.jpg',
      isBookmarked: true
    },
    {
      id: 'cafe',
      name: 'CAFE',
      hours: 'Open until 2:00 am',
      rating: 4.5,
      image: '/upscale-bar-interior-with-bottles.jpg',
      isBookmarked: false
    }
  ];

  const events = [
    {
      id: 'freaky-friday',
      title: 'Freaky Friday with DJ Alexxx',
      venue: 'DABO, Airport Road',
      date: 'APR 04',
      category: 'Techno & Bollytech',
      image: '/night-party-event-poster-with-purple-and-pink-neon.jpg'
    },
    {
      id: 'wow-wednesday',
      title: 'Wow Wednesday with DJ Shade',
      venue: 'DABO, Airport Road',
      date: 'APR 04',
      category: 'Bollywood & Bollytech',
      image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg'
    }
  ];

  const vibeClubs = [
    { id: 'club1', name: 'CLU', image: '/upscale-club-interior-with-blue-lighting.jpg' },
    { id: 'club2', name: 'Dabo', image: '/red-neon-lounge-interior.jpg' },
    { id: 'club3', name: 'Brick House', image: '/upscale-bar-interior-with-bottles.jpg' },
    { id: 'club4', name: 'Destiny', image: '/purple-neon-club-interior.jpg' },
    { id: 'club5', name: 'Hitchki', image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg' }
  ];

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white relative">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900/95 via-teal-900/95 to-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <span className="text-white font-medium">Dharampath</span>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <button
            onClick={() => setShowMenu(true)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Menu className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">{/* pb-20 for bottom navigation space */}
        {/* Featured Event */}
        <div className="p-4">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg"
              alt="Featured Event"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">SPONSORED</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/80 mb-1">MUSIC BY</p>
                  <p className="text-sm font-semibold text-white">DJ MARTIN</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80 mb-1">HOSTED BY</p>
                  <p className="text-sm font-semibold text-white">DJ AMIL</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vibe Meter */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vibe Meter</h3>
          <div className="flex space-x-3 overflow-x-scroll pb-2 scrollbar-hide">
            {vibeClubs.map((club) => (
              <div key={club.id} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-400">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center mt-1 text-white/80">{club.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Venue List */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Venue List</h3>
            <button className="text-teal-400 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {venues.map((venue) => (
              <div key={venue.id} className="relative rounded-2xl overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <Bookmark className={`w-5 h-5 ${venue.isBookmarked ? 'text-teal-400 fill-current' : 'text-white/60'}`} />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-xl font-bold text-white">{venue.name}</h4>
                      <p className="text-sm text-white/80">{venue.hours}</p>
                    </div>
                    <div className="bg-teal-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      {venue.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Event List</h3>
            <button className="text-teal-400 text-sm font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                <div className="flex">
                  <div className="relative flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                      {event.date}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-white/70 mb-2">{event.venue}</p>
                        <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleLike(event.id)}
                        className="ml-2"
                      >
                        <Heart className={`w-5 h-5 ${likedEvents.includes(event.id) ? 'text-red-500 fill-current' : 'text-white/60'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 pb-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                CLUBVIZ
              </h2>
            </div>
            <p className="text-white/80 text-sm">
              Dive into the ultimate party scene discover lit club nights, epic events, and non-stop vibes all in one place!
            </p>
            <div className="flex justify-center space-x-6">
              <button className="text-teal-400 hover:text-teal-300">
                <div className="w-8 h-8 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
              </button>
              <button className="text-teal-400 hover:text-teal-300">
                <div className="w-8 h-8 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
              </button>
              <button className="text-teal-400 hover:text-teal-300">
                <div className="w-8 h-8 flex items-center justify-center"><Camera className="w-5 h-5" /></div>
              </button>
              <button className="text-teal-400 hover:text-teal-300">
                <div className="w-8 h-8 flex items-center justify-center"><X className="w-5 h-5" /></div>
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-white/80">contact@clubviz.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-teal-400">Location Details</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="text-white/80">Terms & Condition</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4" />
                <span className="text-white/80">Privacy Policy</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              Copy rights reserved with clubviz.com
            </p>
          </div>
        </div>
      </div>

      {/* Profile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-80 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 h-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🐻
                </div>
                <h3 className="text-lg font-semibold text-white">DAVID SIMON</h3>
                <p className="text-white/60">NAGPUR</p>
              </div>

              <div className="space-y-4">
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-white font-medium">MY ACCOUNT</span>
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-white font-medium">FAVOURITE EVENTS</span>
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-white font-medium">FAVOURITE CLUBS</span>
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-white font-medium">CONTACT</span>
                </button>
              </div>

              <div className="mt-8">
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors">
                  Log Out
                </button>
              </div>

              <div className="mt-8 flex justify-center space-x-6">
                <button className="text-teal-400 hover:text-teal-300"><Phone className="w-5 h-5" /></button>
                <button className="text-teal-400 hover:text-teal-300"><MessageCircle className="w-5 h-5" /></button>
                <button className="text-teal-400 hover:text-teal-300"><X className="w-5 h-5" /></button>
                <button className="text-teal-400 hover:text-teal-300"><Camera className="w-5 h-5" /></button>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  CLUBVIZ
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
