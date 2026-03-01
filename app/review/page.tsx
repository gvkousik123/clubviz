'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ThumbsUp, ThumbsDown, Share, Bookmark, Filter } from 'lucide-react';

export default function ReviewPage() {
    const router = useRouter();
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
    const [searchTerm, setSearchTerm] = useState('');

    const handleWriteReview = () => {
        router.push('/review/write');
    };

    const reviews = [
        {
            id: 1,
            name: 'Anjali Sharma',
            avatar: '/vibemeter/Screenshot_2025-05-16_192139-removebg-preview.png',
            rating: 4.5,
            date: '25/07/2024',
            review: 'I recently ate at Dabo and had a great time. The food tasted good, and Rakesh\'s suggestions were perfect. The service was excellent. I\'m very happy with my visit. Decor and interiors can be improved a bit.',
            daysAgo: '3 Days ago',
            verified: true
        },
        {
            id: 2,
            name: 'Ankit Trivedi',
            avatar: '/vibemeter/Screenshot_2025-05-16_193232-removebg-preview.png',
            rating: 4.5,
            date: '02/07/2024',
            review: 'Generally any pub strikes one of the two cords, ambiance or tasty food. The food here is simply amazing and combine it with the perfect and soothing ambiance you will have a time of your life.',
            daysAgo: '6 Days ago',
            verified: true
        },
        {
            id: 3,
            name: 'Nikhil Jadhav',
            avatar: '/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png',
            rating: 4.0,
            date: '17/06/2024',
            review: 'Excellent atmosphere and wonderful drinks selection. The DJ set was perfect for the evening.',
            daysAgo: '14 Days ago',
            verified: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Custom Header */}
            <div className="h-[200px] bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] relative">
                {/* Back Arrow */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-12 left-6 p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Review Title */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <h1 className="text-white text-xl font-bold">Review</h1>
                </div>

                {/* Club Name - positioned inside the header */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                    <h2 className="text-white text-2xl font-extrabold">DABO CLUB & KITCHEN</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 space-y-6 pt-4">
                {/* Club Rating Info */}
                <div className="text-center space-y-2 mt-6">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold mb-2">4.2</div>
                        <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                    key={index}
                                    size={24}
                                    className={`${index < 4 ? 'text-teal-400 fill-teal-400' : index === 4 ? 'text-teal-400' : 'text-gray-400'}`}
                                />
                            ))}
                        </div>
                        <span className="text-white/70 text-sm">30 Reviews</span>
                        <span className="text-[#14FFEC] text-xs mt-1">Highest rated club in region</span>
                    </div>
                </div>

                {/* Filter and Search Section */}
                <div className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-4 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0d3838] text-white text-sm px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#14FFEC] placeholder-white/40"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {[null, 5, 4, 3].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    filterRating === rating
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0d3838] text-white hover:bg-[#14567f]'
                                }`}
                            >
                                {rating ? `${rating}★` : 'All'}
                            </button>
                        ))}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
                            className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-[#0d3838] text-white outline-none focus:ring-2 focus:ring-[#14FFEC]"
                        >
                            <option value="recent">Newest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                        </select>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-[rgba(40,60,61,0.30)] p-4 rounded-2xl space-y-3">
                    {['Excellent', 'Good', 'Average', 'Below Average', 'Rate'].map((label, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-28 text-sm">{label}</div>
                            <div className="h-2 bg-[#333] flex-1 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-400"
                                    style={{ width: `${[80, 70, 40, 15, 5][index]}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4 mt-4">
                    {useMemo(() => {
                        let filtered = reviews.filter(review => {
                            const matchesSearch = searchTerm === '' || 
                                review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                review.review.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesRating = filterRating === null || Math.floor(review.rating) >= filterRating;
                            return matchesSearch && matchesRating;
                        });

                        if (sortBy === 'highest') {
                            filtered = filtered.sort((a, b) => b.rating - a.rating);
                        } else if (sortBy === 'lowest') {
                            filtered = filtered.sort((a, b) => a.rating - b.rating);
                        }

                        return filtered.length > 0 ? filtered.map((review) => (
                        <div key={review.id} className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.avatar || '/placeholder/image.png'}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder/image.png';
                                    }}
                                />
                                <div>
                                    <h3 className="text-white font-medium">{review.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-teal-400 font-medium">{review.rating}</span>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const filled = index < Math.floor(review.rating);
                                                const halfFilled = !filled && index < Math.ceil(review.rating);
                                                return (
                                                    <Star
                                                        key={index}
                                                        size={16}
                                                        className={`
                                                            ${filled ? 'text-teal-400 fill-teal-400' :
                                                                halfFilled ? 'text-teal-400' : 'text-gray-400'}`
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto text-right">
                                    <div className="text-white/70 text-sm">{review.date}</div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-white/80 text-sm leading-relaxed my-3">
                                {review.review}
                            </p>

                            {/* Days Ago */}
                            <div className="text-right">
                                <span className="text-white/50 text-xs">{review.daysAgo}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}