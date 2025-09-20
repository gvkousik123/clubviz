'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';

export default function FilterPage() {
    const [selectedFilters, setSelectedFilters] = useState({
        location: '',
        category: '',
        price: '',
        rating: '',
        timing: ''
    });

    const locations = ['Dharampeth', 'Sitabuldi', 'Sadar', 'Civil Lines', 'Wardha Road'];
    const categories = ['Night Club', 'Restro Bar', 'Lounge', 'Cafe', 'Pub'];
    const priceRanges = ['₹500-1000', '₹1000-2000', '₹2000-3000', '₹3000+'];
    const ratings = ['4.5+', '4.0+', '3.5+', '3.0+'];
    const timings = ['Open Now', 'Open Late', 'Open 24/7'];

    const handleFilterChange = (type: string, value: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [type]: prev[type as keyof typeof prev] === value ? '' : value
        }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            location: '',
            category: '',
            price: '',
            rating: '',
            timing: ''
        });
    };

    const applyFilters = () => {
        // Logic to apply filters and navigate back
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/clubs">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">Filters</h1>
                <button onClick={clearAllFilters} className="text-blue-400 text-sm font-medium">
                    Clear All
                </button>
            </div>

            <div className="px-6 space-y-8">
                {/* Location Filter */}
                <div>
                    <h3 className="text-white text-base font-semibold mb-4">Location</h3>
                    <div className="flex flex-wrap gap-3">
                        {locations.map((location) => (
                            <button
                                key={location}
                                onClick={() => handleFilterChange('location', location)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.location === location
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {location}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <h3 className="text-white text-base font-semibold mb-4">Category</h3>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleFilterChange('category', category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.category === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div>
                    <h3 className="text-white text-base font-semibold mb-4">Price Range</h3>
                    <div className="flex flex-wrap gap-3">
                        {priceRanges.map((price) => (
                            <button
                                key={price}
                                onClick={() => handleFilterChange('price', price)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.price === price
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {price}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <h3 className="text-white text-base font-semibold mb-4">Rating</h3>
                    <div className="flex flex-wrap gap-3">
                        {ratings.map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleFilterChange('rating', rating)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.rating === rating
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                ⭐ {rating}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timing Filter */}
                <div>
                    <h3 className="text-white text-base font-semibold mb-4">Timing</h3>
                    <div className="flex flex-wrap gap-3">
                        {timings.map((timing) => (
                            <button
                                key={timing}
                                onClick={() => handleFilterChange('timing', timing)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.timing === timing
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {timing}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Apply Filters Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
                <button
                    onClick={applyFilters}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}