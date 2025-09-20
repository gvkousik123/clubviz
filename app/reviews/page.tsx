'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ThumbsUp, MoreVertical, X } from 'lucide-react';

export default function ReviewsPage() {
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const reviews = [
        {
            id: 1,
            user: "Priya Sharma",
            avatar: "/placeholder-user.jpg",
            rating: 5,
            date: "2 days ago",
            review: "Amazing experience at DABO! The music was fantastic, drinks were well-made, and the atmosphere was electric. Perfect place for a night out with friends.",
            likes: 12,
            helpful: true
        },
        {
            id: 2,
            user: "Rahul Mehta",
            avatar: "/placeholder-user.jpg",
            rating: 4,
            date: "1 week ago",
            review: "Great club with good music and ambiance. The staff was friendly and service was quick. Only downside was it got too crowded later in the night.",
            likes: 8,
            helpful: false
        },
        {
            id: 3,
            user: "Sneha Patel",
            avatar: "/placeholder-user.jpg",
            rating: 5,
            date: "2 weeks ago",
            review: "Best club in Nagpur! Love the interior design and the DJ plays amazing tracks. The cocktails are reasonably priced too. Will definitely visit again!",
            likes: 15,
            helpful: true
        },
        {
            id: 4,
            user: "Arjun Singh",
            avatar: "/placeholder-user.jpg",
            rating: 3,
            date: "3 weeks ago",
            review: "Decent place but could be better. Music was good but service was slow. The entry fee is reasonable though.",
            likes: 3,
            helpful: false
        }
    ];

    const submitReview = () => {
        if (rating > 0 && reviewText.trim()) {
            // Logic to submit review
            setShowWriteReview(false);
            setRating(0);
            setReviewText('');
        }
    };

    const renderStars = (count: number, interactive = false) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < count
                        ? 'text-yellow-400 fill-current'
                        : 'text-white/30'
                    } ${interactive ? 'cursor-pointer' : ''}`}
                onClick={interactive ? () => setRating(i + 1) : undefined}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/clubs/dabo">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">Reviews</h1>
                <button
                    onClick={() => setShowWriteReview(true)}
                    className="text-blue-400 text-sm font-medium"
                >
                    Write Review
                </button>
            </div>

            {/* Overall Rating */}
            <div className="px-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">4.2</div>
                        <div className="flex justify-center mb-2">
                            {renderStars(4)}
                        </div>
                        <div className="text-white/60 text-sm">Based on {reviews.length} reviews</div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="mt-6 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter(r => r.rating === star).length;
                            const percentage = (count / reviews.length) * 100;

                            return (
                                <div key={star} className="flex items-center space-x-3">
                                    <span className="text-white/60 text-sm w-3">{star}</span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <div className="flex-1 bg-white/20 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-white/60 text-sm w-6">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="px-6 space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex items-start space-x-3">
                            <img
                                src={review.avatar}
                                alt={review.user}
                                className="w-10 h-10 rounded-full"
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="text-white font-medium">{review.user}</h4>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-white/60 text-sm">{review.date}</span>
                                        </div>
                                    </div>
                                    <button>
                                        <MoreVertical className="w-4 h-4 text-white/60" />
                                    </button>
                                </div>

                                <p className="text-white/90 text-sm mb-3">{review.review}</p>

                                <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-1 text-white/60 hover:text-white">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="text-sm">{review.likes}</span>
                                    </button>
                                    {review.helpful && (
                                        <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">
                                            Helpful
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Write Review Modal */}
            {showWriteReview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
                    <div className="w-full bg-slate-800 rounded-t-3xl p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-lg font-semibold">Write a Review</h2>
                            <button
                                onClick={() => setShowWriteReview(false)}
                                className="text-white/60"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Rating Selection */}
                        <div className="mb-6">
                            <label className="text-white/80 text-sm mb-3 block">Rate your experience</label>
                            <div className="flex space-x-1">
                                {renderStars(rating, true)}
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <label className="text-white/80 text-sm mb-3 block">Your review</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/60 resize-none focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        <button
                            onClick={submitReview}
                            disabled={rating === 0 || !reviewText.trim()}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            <div className="h-24" />
        </div>
    );
}