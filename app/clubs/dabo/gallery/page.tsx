'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DaboGallery() {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Food', 'Drinks', 'Ambience'];

    const photos = [
        { id: 1, category: 'Food', src: '/upscale-bar-interior-with-bottles.jpg', alt: 'Delicious food plate' },
        { id: 2, category: 'Ambience', src: '/purple-neon-club-interior.jpg', alt: 'Dance floor with neon lights' },
        { id: 3, category: 'Ambience', src: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg', alt: 'Crowded dance floor' },
        { id: 4, category: 'Food', src: '/placeholder.jpg', alt: 'Healthy salad bowl' },
        { id: 5, category: 'Ambience', src: '/red-neon-lounge-interior.jpg', alt: 'VIP lounge area' },
        { id: 6, category: 'Drinks', src: '/upscale-club-interior-with-blue-lighting.jpg', alt: 'Cocktail bar' },
        { id: 7, category: 'Food', src: '/placeholder.jpg', alt: 'Pancake stack' },
        { id: 8, category: 'Food', src: '/placeholder.jpg', alt: 'Gourmet salad' },
        { id: 9, category: 'Food', src: '/placeholder.jpg', alt: 'Pizza slice' },
        { id: 10, category: 'Ambience', src: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg', alt: 'Purple lighting ambience' }
    ];

    const filteredPhotos = activeFilter === 'All'
        ? photos
        : photos.filter(photo => photo.category === activeFilter);

    const handleBack = () => {
        window.location.href = '/home';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900/95 via-teal-900/95 to-gray-900/95 backdrop-blur-sm">
                <div className="flex items-center p-4">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 text-center">
                        <h1 className="text-xl font-bold text-white">DABO CLUB & KITCHEN</h1>
                    </div>
                </div>

                {/* Photos Tab */}
                <div className="px-4 pb-4">
                    <div className="bg-teal-500 rounded-2xl py-3">
                        <h2 className="text-center text-white font-semibold">Photos</h2>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-4 pb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-colors ${activeFilter === filter
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {filteredPhotos.map((photo) => (
                        <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Load More */}
            <div className="p-4 pb-8">
                <button className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-semibold transition-colors">
                    Load More Photos
                </button>
            </div>
        </div>
    );
}