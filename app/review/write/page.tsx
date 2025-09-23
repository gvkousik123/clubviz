'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Camera, X } from 'lucide-react';

export default function WriteReviewPage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);

    const handleGoBack = () => {
        router.back();
    };

    const handleRatingClick = (ratingValue: number) => {
        setRating(ratingValue);
    };

    const handleRatingHover = (ratingValue: number) => {
        setHoverRating(ratingValue);
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmitReview = () => {
        // Here you would typically submit the review
        router.push('/review/success');
    };

    const categories = [
        'Music & DJ',
        'Ambiance',
        'Drinks & Food',
        'Service',
        'Crowd',
        'Value for Money'
    ];

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hoverRating || rating);

            return (
                <button
                    key={index}
                    onClick={() => handleRatingClick(starValue)}
                    onMouseEnter={() => handleRatingHover(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 hover:scale-110"
                >
                    <Star
                        size={32}
                        className={`${isActive
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-400'
                            }`}
                    />
                </button>
            );
        });
    };

    const getRatingText = () => {
        const currentRating = hoverRating || rating;
        switch (currentRating) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return 'Rate your experience';
        }
    };

    const isSubmitEnabled = rating > 0 && review.trim().length > 10;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        WRITE REVIEW
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-8">
                {/* Club Info */}
                <div className="text-center space-y-2">
                    <h2 className="text-white text-xl font-bold">DABO CLUB & KITCHEN</h2>
                    <p className="text-white/70 text-sm">How was your experience?</p>
                </div>

                {/* Rating Section */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        {renderStars()}
                    </div>
                    <p className="text-white font-medium text-lg">
                        {getRatingText()}
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">What did you like? (Optional)</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategories.includes(category)
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-[#222831] text-white/70 hover:bg-[#2a2a38]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">Tell us more about your experience</h3>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about the music, ambiance, service, drinks, or anything else that made your night special..."
                        className="w-full bg-[#222831] text-white p-4 rounded-2xl border border-gray-600 focus:border-teal-400 focus:outline-none resize-none h-32 placeholder:text-white/50"
                        maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">
                            {review.length}/500 characters
                        </span>
                        <span className="text-white/60 text-sm">
                            Minimum 10 characters required
                        </span>
                    </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">Add Photos (Optional)</h3>
                    <div className="flex gap-3">
                        <button className="w-20 h-20 bg-[#222831] hover:bg-[#2a2a38] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 border-dashed border-gray-600">
                            <Camera size={20} className="text-white/60 mb-1" />
                            <span className="text-xs text-white/60">Add Photo</span>
                        </button>
                        {photos.map((photo, index) => (
                            <div key={index} className="relative w-20 h-20">
                                <img
                                    src={photo}
                                    alt={`Review photo ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                                <button
                                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <X size={12} className="text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4">
                    <h4 className="text-blue-400 font-medium mb-2">Review Guidelines</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                        <li>• Be honest and constructive in your feedback</li>
                        <li>• Focus on your personal experience</li>
                        <li>• Avoid offensive language or personal attacks</li>
                        <li>• Photos should be appropriate and relevant</li>
                    </ul>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        onClick={handleSubmitReview}
                        disabled={!isSubmitEnabled}
                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        {isSubmitEnabled ? 'Submit Review' : 'Please rate and write a review'}
                    </button>
                </div>
            </div>
        </div>
    );
}