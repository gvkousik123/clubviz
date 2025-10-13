'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function GalleryPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');

    const handleGoBack = () => {
        router.back();
    };

    const categories = ['All', 'Food', 'Drinks', 'Ambience'];

    // Gallery data using actual Frame images
    const galleryItems = [
        {
            id: 1,
            image: '/gallery/Frame 1000001117.jpg',
            category: 'Ambience',
            alt: 'Club ambience and interior'
        },
        {
            id: 2,
            image: '/gallery/Frame 1000001119.jpg',
            category: 'Ambience',
            alt: 'Club lighting and atmosphere'
        },
        {
            id: 3,
            image: '/gallery/Frame 1000001120.jpg',
            category: 'Food',
            alt: 'Club food and cuisine'
        },
        {
            id: 4,
            image: '/gallery/Frame 1000001121.jpg',
            category: 'Drinks',
            alt: 'Club drinks and beverages'
        },
        {
            id: 5,
            image: '/gallery/Frame 1000001123.jpg',
            category: 'Ambience',
            alt: 'Club interior design'
        },
        {
            id: 6,
            image: '/gallery/Frame 1000001124.jpg',
            category: 'Drinks',
            alt: 'Club bar and beverages'
        },
        {
            id: 7,
            image: '/gallery/Frame 1000001126.jpg',
            category: 'Food',
            alt: 'Club dining and food experience'
        },
        {
            id: 8,
            image: '/gallery/Frame 1000001127.jpg',
            category: 'Ambience',
            alt: 'Club atmosphere and vibes'
        },
        {
            id: 9,
            image: '/gallery/Frame 1000001128.jpg',
            category: 'Drinks',
            alt: 'Bar setup and cocktails'
        },
        {
            id: 10,
            image: '/gallery/Frame 1000001129.jpg',
            category: 'Ambience',
            alt: 'Club dance floor and lighting'
        },
        {
            id: 11,
            image: '/gallery/Frame 1000001131.jpg',
            category: 'Food',
            alt: 'Club cuisine and dining'
        },
        {
            id: 12,
            image: '/gallery/Frame 1000001132.jpg',
            category: 'Ambience',
            alt: 'Club interior and seating'
        },
        {
            id: 13,
            image: '/gallery/Frame 1000001133.jpg',
            category: 'Drinks',
            alt: 'Premium bar experience'
        }
    ];

    const filteredItems = activeCategory === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        DABO CLUB & KITCHEN
                    </h1>
                </div>

                {/* Photos Label */}
                <div className="px-6 mb-6">
                    <h2 className="text-white font-bold text-xl text-center">Photos</h2>
                </div>

                {/* Category Filters */}
                <div className="px-6">
                    <div className="flex gap-3 justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-[20px] font-medium text-sm transition-all duration-300 ${activeCategory === category
                                    ? 'bg-white text-[#0d7377]'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-800"
                        >
                            <img
                                src={item.image}
                                alt={item.alt}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* Load More or No Results */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/70 text-lg">No photos in this category</p>
                        <p className="text-white/50 text-sm mt-2">Try selecting a different category</p>
                    </div>
                )}

                {filteredItems.length > 0 && filteredItems.length >= 8 && (
                    <div className="text-center pt-6">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-[20px] transition-all duration-300">
                            Load More Photos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}