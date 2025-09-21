'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star, Clock, Search, Filter } from 'lucide-react';

export default function VenueListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');

    const venues = [
        {
            id: 1,
            name: "Dabo Club & Kitchen",
            location: "Nagpur",
            image: "/purple-neon-club-interior.jpg",
            rating: 4.5,
            reviews: 234,
            openTime: "8:00 PM",
            closeTime: "3:00 AM",
            type: "Nightclub & Bar",
            priceRange: "₹₹₹",
            distance: "2.3 km",
            tags: ["Live DJ", "Dance Floor", "Premium Bar"]
        },
        {
            id: 2,
            name: "Neon Lounge",
            location: "Mumbai",
            image: "/red-neon-lounge-interior.jpg",
            rating: 4.3,
            reviews: 189,
            openTime: "7:30 PM",
            closeTime: "2:30 AM",
            type: "Lounge & Bar",
            priceRange: "₹₹",
            distance: "1.8 km",
            tags: ["Rooftop", "City View", "Cocktails"]
        },
        {
            id: 3,
            name: "Blue Light Club",
            location: "Bangalore",
            image: "/upscale-club-interior-with-blue-lighting.jpg",
            rating: 4.7,
            reviews: 312,
            openTime: "9:00 PM",
            closeTime: "4:00 AM",
            type: "Premium Club",
            priceRange: "₹₹₹₹",
            distance: "3.1 km",
            tags: ["VIP Section", "Celebrity DJs", "Fine Dining"]
        },
        {
            id: 4,
            name: "Red Room",
            location: "Delhi",
            image: "/crowded-nightclub-with-red-lighting-and-people-dan.jpg",
            rating: 4.2,
            reviews: 156,
            openTime: "8:30 PM",
            closeTime: "3:30 AM",
            type: "Dance Club",
            priceRange: "₹₹",
            distance: "4.5 km",
            tags: ["Hip Hop", "Electronic", "Young Crowd"]
        },
        {
            id: 5,
            name: "Upscale Bar",
            location: "Chennai",
            image: "/upscale-bar-interior-with-bottles.jpg",
            rating: 4.6,
            reviews: 278,
            openTime: "6:00 PM",
            closeTime: "1:00 AM",
            type: "Premium Bar",
            priceRange: "₹₹₹",
            distance: "1.2 km",
            tags: ["Craft Cocktails", "Wine Collection", "Business Crowd"]
        }
    ];

    const locations = ["All", "Nagpur", "Mumbai", "Bangalore", "Delhi", "Chennai"];

    const filteredVenues = venues.filter(venue => {
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = selectedLocation === 'All' || venue.location === selectedLocation;
        return matchesSearch && matchesLocation;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/clubs">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">All Venues</h1>
                <div className="w-6" />
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search venues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>
            </div>

            {/* Location Filter */}
            <div className="px-6 mb-6">
                <div className="flex space-x-3 pb-2">
                    {locations.map((location) => (
                        <button
                            key={location}
                            onClick={() => setSelectedLocation(location)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedLocation === location
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                                }`}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="px-6 mb-4">
                <p className="text-white/60 text-sm">
                    {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Venue List */}
            <div className="px-6 pb-20">
                <div className="space-y-4">
                    {filteredVenues.map((venue) => (
                        <Link
                            key={venue.id}
                            href={`/clubs/${venue.name.toLowerCase().replace(/ /g, '-')}`}
                            className="block"
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300">
                                <div className="flex space-x-4">
                                    {/* Venue Image */}
                                    <div className="relative w-24 h-24 rounded-xl flex-shrink-0">
                                        <Image
                                            src={venue.image}
                                            alt={venue.name}
                                            fill
                                            className="object-cover rounded-xl"
                                            sizes="96px"
                                        />
                                    </div>

                                    {/* Venue Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-white font-semibold text-lg truncate">{venue.name}</h3>
                                                <p className="text-white/60 text-sm">{venue.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center space-x-1 mb-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-white text-sm font-medium">{venue.rating}</span>
                                                </div>
                                                <p className="text-white/50 text-xs">({venue.reviews})</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-4 h-4 text-blue-400" />
                                                <span className="text-white/80 text-sm">{venue.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4 text-green-400" />
                                                <span className="text-white/80 text-sm">{venue.openTime} - {venue.closeTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {venue.tags.slice(0, 2).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-white/60 text-sm">{venue.priceRange}</span>
                                                <span className="text-white/40 text-sm">•</span>
                                                <span className="text-white/60 text-sm">{venue.distance}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredVenues.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">No venues found</h3>
                        <p className="text-white/60">Try adjusting your search or location filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}