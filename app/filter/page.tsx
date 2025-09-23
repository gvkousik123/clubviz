'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Wine,
    Coffee,
    Utensils,
    Salad,
    UtensilsCrossed,
    Soup,
    Pizza
} from 'lucide-react';

export default function FilterPage() {
    const router = useRouter();
    const [selectedSort, setSelectedSort] = useState('Popularity');
    const [selectedBarFilters, setSelectedBarFilters] = useState<string[]>([]);
    const [selectedFoodFilters, setSelectedFoodFilters] = useState<string[]>([]);

    const handleGoBack = () => {
        router.back();
    };

    const handleSortSelect = (option: string) => {
        setSelectedSort(option);
    };

    const toggleBarFilter = (filter: string) => {
        setSelectedBarFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const toggleFoodFilter = (filter: string) => {
        setSelectedFoodFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const sortOptions = ['Popularity', 'Rating', 'Distance', 'Cost', 'vibe'];

    const barFilters = [
        { name: 'Spirits', icon: Wine },
        { name: 'Wine', icon: Wine },
        { name: 'Draught', icon: Coffee },
        { name: 'Cocktail', icon: Wine },
        { name: 'Non Alcoholic', icon: Coffee },
        { name: 'Mocktail', icon: Wine },
        { name: 'Coffee', icon: Coffee }
    ];

    const foodFilters = [
        { name: 'Gluten free options', icon: Salad },
        { name: 'Asian', icon: UtensilsCrossed },
        { name: 'Italian', icon: Pizza },
        { name: 'Burgers & Sandwich', icon: Utensils },
        { name: 'North Indian', icon: Soup },
        { name: 'Bar Snacks', icon: Utensils },
        { name: 'Continental', icon: UtensilsCrossed },
        { name: 'Steak', icon: Utensils },
        { name: 'Kebabs', icon: Utensils },
        { name: 'Desserts', icon: Utensils }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a2f32] to-[#0a1518] text-white">
            {/* Header */}
            <div className="px-6 py-6">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 mb-6"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-8">
                {/* Sort By Section */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <h2 className="text-white font-medium text-lg">Sort by</h2>
                        <div className="flex-1 ml-4 h-px bg-teal-400"></div>
                    </div>

                    <div className="space-y-3">
                        {sortOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSortSelect(option)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <span className="text-white text-base font-light">{option}</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSort === option
                                        ? 'border-teal-400 bg-teal-400'
                                        : 'border-white/40'
                                    }`}>
                                    {selectedSort === option && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bar Section */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <h2 className="text-white font-medium text-lg">Bar</h2>
                        <div className="flex-1 ml-4 h-px bg-teal-400"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {barFilters.map((filter) => (
                            <button
                                key={filter.name}
                                onClick={() => toggleBarFilter(filter.name)}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${selectedBarFilters.includes(filter.name)
                                        ? 'bg-teal-600/20 border-teal-400 text-teal-400'
                                        : 'bg-[#1a2f32] border-white/20 text-white hover:border-teal-400/50'
                                    }`}
                            >
                                <filter.icon size={20} />
                                <span className="text-sm font-medium">{filter.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Food Section */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <h2 className="text-white font-medium text-lg">Food</h2>
                        <div className="flex-1 ml-4 h-px bg-teal-400"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {foodFilters.map((filter) => (
                            <button
                                key={filter.name}
                                onClick={() => toggleFoodFilter(filter.name)}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${selectedFoodFilters.includes(filter.name)
                                        ? 'bg-teal-600/20 border-teal-400 text-teal-400'
                                        : 'bg-[#1a2f32] border-white/20 text-white hover:border-teal-400/50'
                                    }`}
                            >
                                <filter.icon size={20} />
                                <span className="text-sm font-medium">{filter.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                <div className="pt-8 pb-8">
                    <button
                        onClick={handleGoBack}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-full transition-all duration-300"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}