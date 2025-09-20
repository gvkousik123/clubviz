'use client';

import React, { useState } from 'react';
import { Heart, Star, MapPin, Clock, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('clubs');

    const favoriteClubs = [
        {
            id: 'dabo',
            name: 'DABO',
            location: 'Raj nagar, Shantigram',
            image: '/red-neon-lounge-interior.jpg',
            rating: 4.2,
            reviews: 1250,
            isOpen: true,
            openUntil: '1:30 AM',
            distance: '2.1 km',
            price: '₹1500',
            type: 'Premium Nightclub'
        },
        {
            id: 'lord-of-the-vibes',
            name: 'LORD OF THE VIBES',
            location: 'Ghorpade Peth, Pune',
            image: '/upscale-bar-interior-with-bottles.jpg',
            rating: 4.5,
            reviews: 890,
            isOpen: true,
            openUntil: '2:00 AM',
            distance: '3.5 km',
            price: '₹2000',
            type: 'Restaurant | Bar'
        },
        {
            id: 'neon-nights',
            name: 'NEON NIGHTS',
            location: 'Central Avenue, Mumbai',
            image: '/purple-neon-club-interior.jpg',
            rating: 4.6,
            reviews: 2100,
            isOpen: false,
            openUntil: 'Closed',
            distance: '5.2 km',
            price: '₹1800',
            type: 'Dance Club'
        }
    ];

    const favoriteEvents = [
        {
            id: 'dj-martin-night',
            name: 'DJ MARTIN LIVE',
            venue: 'Club Phoenix',
            location: 'Downtown District',
            image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
            date: 'Tonight',
            time: '9:00 PM',
            price: '₹1200',
            category: 'Electronic Music',
            isLive: true
        },
        {
            id: 'retro-night',
            name: 'RETRO DISCO NIGHT',
            venue: 'The Underground',
            location: 'Metro Plaza',
            image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
            date: 'Dec 15',
            time: '8:30 PM',
            price: '₹800',
            category: 'Retro Music',
            isLive: false
        },
        {
            id: 'rooftop-party',
            name: 'ROOFTOP SUNSET PARTY',
            venue: 'Sky Lounge',
            location: 'Business District',
            image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
            date: 'Dec 20',
            time: '6:00 PM',
            price: '₹1500',
            category: 'House Music',
            isLive: false
        }
    ];

    const handleBack = () => {
        router.back();
    };

    const handleClubClick = (clubId: string) => {
        router.push(`/clubs/${clubId}`);
    };

    const handleEventClick = (eventId: string) => {
        router.push(`/events/${eventId}`);
    };

    const removeFromFavorites = (id: string, type: string) => {
        // Handle remove from favorites
        console.log(`Removing ${type} ${id} from favorites`);
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

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Favorites</h1>
                    <p className="text-white/60 text-sm">Your saved places</p>
                </div>

                <div className="w-12"></div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('clubs')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-center transition-all duration-300 ${activeTab === 'clubs'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20'
                            }`}
                    >
                        Clubs ({favoriteClubs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-center transition-all duration-300 ${activeTab === 'events'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20'
                            }`}
                    >
                        Events ({favoriteEvents.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-24">
                {activeTab === 'clubs' && (
                    <div className="space-y-4">
                        {favoriteClubs.length > 0 ? (
                            favoriteClubs.map((club) => (
                                <div
                                    key={club.id}
                                    className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
                                >
                                    {/* Club Image */}
                                    <div className="relative h-48">
                                        <img
                                            src={club.image}
                                            alt={club.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                        {/* Status Badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${club.isOpen
                                                ? 'bg-green-500/80 text-white'
                                                : 'bg-red-500/80 text-white'
                                            }`}>
                                            {club.isOpen ? 'Open' : 'Closed'}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromFavorites(club.id, 'club')}
                                            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                                        >
                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                        </button>

                                        {/* Distance */}
                                        <div className="absolute top-4 right-16 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-white text-sm font-medium">{club.distance}</span>
                                        </div>
                                    </div>

                                    {/* Club Info */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{club.name}</h3>
                                                <p className="text-purple-300 text-sm font-medium mb-2">{club.type}</p>
                                                <div className="flex items-center gap-1 text-white/70 text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{club.location}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-purple-300 text-sm">Entry</p>
                                                <p className="text-white font-bold text-lg">{club.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-white font-medium">{club.rating}</span>
                                                    <span className="text-white/60 text-sm">({club.reviews})</span>
                                                </div>

                                                {club.isOpen && (
                                                    <div className="text-white/70 text-sm">
                                                        Open until {club.openUntil}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleClubClick(club.id)}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
                                            >
                                                Visit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-12 h-12 text-white/30" />
                                </div>
                                <h3 className="text-white text-xl font-semibold mb-2">No Favorite Clubs</h3>
                                <p className="text-white/60 mb-6">Start exploring and save your favorite clubs</p>
                                <button
                                    onClick={() => router.push('/clubs')}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-2xl text-white font-medium"
                                >
                                    Explore Clubs
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="space-y-4">
                        {favoriteEvents.length > 0 ? (
                            favoriteEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
                                >
                                    {/* Event Image */}
                                    <div className="relative h-48">
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                        {/* Live Badge */}
                                        {event.isLive && (
                                            <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                                LIVE
                                            </div>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromFavorites(event.id, 'event')}
                                            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                                        >
                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                        </button>

                                        {/* Category */}
                                        <div className="absolute top-4 right-16 bg-purple-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-white text-sm font-medium">{event.category}</span>
                                        </div>
                                    </div>

                                    {/* Event Info */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                                                <p className="text-purple-300 text-sm font-medium mb-2">{event.venue}</p>
                                                <div className="flex items-center gap-1 text-white/70 text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-purple-300 text-sm">From</p>
                                                <p className="text-white font-bold text-lg">{event.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-purple-400" />
                                                    <span className="text-white font-medium">{event.date}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-purple-400" />
                                                    <span className="text-white font-medium">{event.time}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleEventClick(event.id)}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
                                            >
                                                {event.isLive ? 'Join Now' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-12 h-12 text-white/30" />
                                </div>
                                <h3 className="text-white text-xl font-semibold mb-2">No Favorite Events</h3>
                                <p className="text-white/60 mb-6">Start exploring and save your favorite events</p>
                                <button
                                    onClick={() => router.push('/events')}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-2xl text-white font-medium"
                                >
                                    Explore Events
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}