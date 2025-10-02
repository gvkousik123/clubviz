'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Share, Bookmark } from 'lucide-react';

export default function ReviewPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleWriteReview = () => {
        router.push('/review/write');
    };

    const reviews = [
        {
            id: 1,
            name: 'Rahul Sharma',
            avatar: '/placeholder-user.jpg',
            rating: 5,
            date: '2 days ago',
            review: 'Amazing night at DABO! The music was incredible and the vibes were perfect. Definitely coming back next weekend!',
            helpful: 12,
            verified: true
        },
        {
            id: 2,
            name: 'Priya Patel',
            avatar: '/placeholder-user.jpg',
            rating: 4,
            date: '1 week ago',
            review: 'Great ambiance and drinks. The crowd was energetic and the DJ played some amazing tracks. Only complaint is it got too crowded by midnight.',
            helpful: 8,
            verified: true
        },
        {
            id: 3,
            name: 'Arjun Singh',
            avatar: '/placeholder-user.jpg',
            rating: 5,
            date: '2 weeks ago',
            review: 'Best club experience in the city! Staff was super friendly and the table service was top-notch. Will definitely recommend to friends.',
            helpful: 15,
            verified: false
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={`${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                    }`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        REVIEWS
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Club Info */}
                <div className="text-center space-y-2">
                    <h2 className="text-white text-xl font-bold">DABO CLUB & KITCHEN</h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                            {renderStars(4)}
                        </div>
                        <span className="text-white/70 text-sm">4.2 • 156 reviews</span>
                    </div>
                </div>

                {/* Write Review Button */}
                <button
                    onClick={handleWriteReview}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all duration-300"
                >
                    Write a Review
                </button>

                {/* Filter Options */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button className="flex-shrink-0 px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium">
                        All Reviews
                    </button>
                    <button className="flex-shrink-0 px-4 py-2 bg-[#222831] text-white/70 hover:bg-[#2a2a38] rounded-full text-sm font-medium transition-all duration-300">
                        Recent
                    </button>
                    <button className="flex-shrink-0 px-4 py-2 bg-[#222831] text-white/70 hover:bg-[#2a2a38] rounded-full text-sm font-medium transition-all duration-300">
                        5 Stars
                    </button>
                    <button className="flex-shrink-0 px-4 py-2 bg-[#222831] text-white/70 hover:bg-[#2a2a38] rounded-full text-sm font-medium transition-all duration-300">
                        Verified
                    </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-[#222831] rounded-2xl p-4">
                            {/* Review Header */}
                            <div className="flex items-start gap-3 mb-3">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-medium">{review.name}</h3>
                                        {review.verified && (
                                            <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-white/50 text-sm">•</span>
                                        <span className="text-white/70 text-sm">{review.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-white/80 text-sm leading-relaxed mb-4">
                                {review.review}
                            </p>

                            {/* Review Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300">
                                        <ThumbsUp size={16} />
                                        <span className="text-sm">Helpful ({review.helpful})</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300">
                                        <ThumbsDown size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                                        <Share size={16} className="text-white/60" />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                                        <Bookmark size={16} className="text-white/60" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <button className="w-full bg-[#222831] hover:bg-[#2a2a38] text-white font-medium py-3 rounded-2xl transition-all duration-300">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
}