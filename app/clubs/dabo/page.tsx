'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, Play, MoreHorizontal, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DaboClubPage() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const clubImages = [
        '/red-neon-lounge-interior.jpg',
        '/upscale-bar-interior-with-bottles.jpg',
        '/purple-neon-club-interior.jpg',
        '/crowded-nightclub-with-red-lighting-and-people-dan.jpg'
    ];

    const handleBack = () => {
        router.back();
    };

    const handleBookNow = () => {
        router.push('/clubs/dabo/booking');
    };

    const handleGallery = () => {
        router.push('/clubs/dabo/gallery');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DABO - Premium Nightclub',
                text: 'Check out this amazing club!',
                url: window.location.href,
            });
        }
    };

    const handleImageNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % clubImages.length);
    };

    const handleImagePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + clubImages.length) % clubImages.length);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Image Section */}
            <div className="relative h-96">
                <img
                    src={clubImages[currentImageIndex]}
                    alt="DABO Club"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Header Controls */}
                <div className="absolute top-12 left-6 right-6 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/40 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`w-12 h-12 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors ${isBookmarked ? 'bg-purple-500/80' : 'bg-black/20 hover:bg-black/40'
                                }`}
                        >
                            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'text-white fill-white' : 'text-white'}`} />
                        </button>

                        <button
                            onClick={handleShare}
                            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/40 transition-colors"
                        >
                            <Share2 className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Gallery Navigation */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">DABO</h1>
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">4.2</span>
                                    <span className="text-sm">(1,250 reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-5 h-5" />
                                    <span className="text-sm">2.1 km away</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGallery}
                            className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-colors"
                        >
                            <div className="grid grid-cols-2 gap-1">
                                <div className="w-2 h-2 bg-white rounded-sm"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
                            </div>
                            <span className="text-white text-sm font-medium">Gallery</span>
                        </button>
                    </div>

                    {/* Image dots indicator */}
                    <div className="flex items-center justify-center mt-4 gap-2">
                        {clubImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-6">
                {/* Status and Info */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            Open Now
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Closes at 1:30 AM</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-purple-300 text-sm">Entry Fee</p>
                        <p className="text-white font-bold text-xl">₹1500</p>
                    </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="w-5 h-5 text-purple-400" />
                        <span>Raj nagar, Shantigram, Nagpur</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                    <p className="text-white/80 leading-relaxed">
                        DABO is a premium nightclub and lounge experience in the heart of Nagpur.
                        Known for its vibrant atmosphere, world-class DJs, and exceptional service.
                        Experience the ultimate nightlife with cutting-edge sound systems,
                        stunning visual effects, and premium drinks.
                    </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                            <div className="text-purple-400 text-sm font-medium">Music</div>
                            <div className="text-white text-sm">Live DJ Sets</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                            <div className="text-purple-400 text-sm font-medium">Capacity</div>
                            <div className="text-white text-sm">300+ People</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                            <div className="text-purple-400 text-sm font-medium">Parking</div>
                            <div className="text-white text-sm">Available</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                            <div className="text-purple-400 text-sm font-medium">Age Limit</div>
                            <div className="text-white text-sm">21+ Only</div>
                        </div>
                    </div>
                </div>

                {/* Reviews Preview */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Reviews</h3>
                        <button className="text-purple-400 text-sm font-medium">View All</button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AS</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-medium">Anjali Sharma</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-white/60 text-sm">2 days ago</span>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Amazing atmosphere and great music! The DJ was fantastic and the drinks were perfectly crafted.
                            Definitely coming back again. Highly recommended for a night out with friends.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center transition-colors ${isLiked ? 'bg-red-500/20 border-red-500/40' : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>

                    <button
                        onClick={handleBookNow}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}