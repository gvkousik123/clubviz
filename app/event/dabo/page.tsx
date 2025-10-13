'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Heart, MapPin, Star, Phone, Clock, Users, Wifi, Car, Wine, Music, Utensils, Calendar, Camera } from 'lucide-react';
import Link from 'next/link';

export default function DaboEventPage() {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    const handleGoBack = () => {
        router.back();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DABO CLUB & KITCHEN',
                text: 'Check out this amazing club!',
                url: window.location.href,
            });
        }
    };

    const facilities = [
        { icon: Wifi, label: 'Open till midnight' },
        { icon: Car, label: 'Disabled Access' },
        { icon: Users, label: 'Private dining space' },
        { icon: Wine, label: 'Table booking' },
    ];

    const foodOptions = [
        { icon: Utensils, label: 'Gluten free options' },
        { icon: Wine, label: 'Bar Snacks' },
        { icon: Utensils, label: 'Asian' },
        { icon: Utensils, label: 'Italian' },
        { icon: Utensils, label: 'North Indian' },
        { icon: Wine, label: 'Burgers & Sandwich' },
    ];

    const musicOptions = [
        { icon: Music, label: 'Karaoke' },
        { icon: Music, label: 'DJs' },
        { icon: Music, label: 'Live Music' },
    ];

    const barOptions = [
        { icon: Wine, label: 'Spirits' },
        { icon: Wine, label: 'Wine' },
        { icon: Wine, label: 'Draught' },
        { icon: Wine, label: 'Cocktail' },
        { icon: Wine, label: 'Non Alcoholic' },
    ];

    const events = [
        {
            id: 1,
            title: 'Freaky Friday with DJ Alexxx',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Techno & Bollytech',
            image: '/gallery/Frame 1000001128.jpg',
        },
        {
            id: 2,
            title: 'Wow Wednesday with DJ Shade',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Bollywood & Bollytechno',
            image: '/gallery/Frame 1000001129.jpg',
        }
    ];

    const photos = [
        '/dabo ambience main dabo page/Media.jpg',
        '/dabo ambience main dabo page/Media-1.jpg',
        '/dabo ambience main dabo page/Media-2.jpg',
        '/dabo ambience main dabo page/Media-3.jpg'
    ];

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            {/* Hero Section - Clean Image Only */}
            <div className="relative h-80 bg-black rounded-b-[30px] overflow-hidden">
                <img
                    src="/dabo ambience main dabo page/Media.jpg"
                    alt="Dabo Club"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                {/* Header Icons Only */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <button
                        onClick={handleGoBack}
                        className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            <Share size={20} className="text-white" />
                        </button>
                        <button className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Club Info Section - Below Image */}
            <div className="relative bg-[#031313] rounded-t-[30px] -mt-[30px] pt-8">
                <div className="relative p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center border-4 border-white/20">
                            <span className="text-white font-bold text-2xl">D</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-white font-bold text-2xl mb-1">DABO CLUB & KITCHEN</h1>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-medium">4.2</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <Phone className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-[#1DB584] to-[#0891B2] text-white font-bold py-4 px-8 rounded-2xl hover:brightness-110 transition-all text-lg">
                            Reserve your spot
                        </button>
                        <button className="flex-1 bg-[#2a3441] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#3a4551] transition-all text-lg">
                            Book offline
                        </button>
                    </div>
                </div>
            </div>

            {/* Now Playing Section with DJ Button */}
            <div className="px-6 py-6 bg-[#031313]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm">Now Playing</h3>
                </div>
                <div className="glassmorphism p-4 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 header-gradient rounded-2xl flex items-center justify-center animate-pulse">
                                <Music className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#031313] flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-white text-base font-bold mb-1">DJ MARTIN LIVE</div>
                            <div className="text-white/70 text-sm">Spinning the best beats tonight</div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className="header-gradient text-white text-xs px-3 py-1.5 rounded-full font-medium">BollyAfro Mix</span>
                        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs px-3 py-1.5 rounded-full font-medium">Techno Vibes</span>
                        <span className="glassmorphism-light text-white text-xs px-3 py-1.5 rounded-full font-medium">EDM</span>
                    </div>

                    {/* Soundwave Visualization */}
                    <div className="mt-4 flex items-center justify-center gap-1 h-12">
                        {[4, 8, 6, 10, 7, 12, 9, 5, 11, 6, 8, 10, 7, 9, 6, 4].map((height, i) => (
                            <div
                                key={i}
                                className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-soundwave"
                                style={{
                                    height: `${height * 3}px`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Offers */}
            <div className="px-6 py-4">
                <h3 className="text-white font-semibold text-base mb-4">Today's Offers</h3>
                <div className="space-y-3">
                    <div className="bg-gradient-to-r from-[#1DB584] to-[#0891B2] bg-opacity-20 rounded-[20px] p-4 flex items-center justify-between border-2 border-dashed border-[#1DB584]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#1DB584] to-[#0891B2] rounded-lg flex items-center justify-center">
                                <Wine className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Buy 1 get 1 on IMFL Drinks</span>
                        </div>
                        <svg className="w-5 h-5 text-[#1DB584]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <div className="bg-gradient-to-r from-[#1DB584] to-[#0891B2] bg-opacity-20 rounded-[20px] p-4 flex items-center justify-between border-2 border-dashed border-[#1DB584]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#1DB584] to-[#0891B2] rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Free Entry for all before 09:00 PM</span>
                        </div>
                        <svg className="w-5 h-5 text-[#1DB584]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Entry/Booking Section */}
            <div className="px-6 py-4">
                <h3 className="text-white font-semibold text-base mb-4">Entry/Booking</h3>
                <div className="glassmorphism rounded-[20px] p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="flex gap-2 mb-1">
                                <span className="text-white text-sm">Couple & Group Entry</span>
                                <span className="text-white text-sm">Male stag Entry</span>
                                <span className="text-white text-sm">Female stag Entry</span>
                            </div>
                            <div className="text-[#1DB584] font-bold text-lg">Rs 1500 (Cover - 1000)</div>
                            <div className="text-white/70 text-sm">*Redeemable before 12:00 AM</div>
                        </div>
                        <svg className="w-5 h-5 text-[#1DB584]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Events in Dabo */}
            <div className="px-6 py-4">
                <h3 className="text-white font-semibold text-base mb-4">Events in Dabo</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {events.map((event) => (
                        <div key={event.id} className="flex-shrink-0 w-[222px]">
                            <Link href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                <div className="bg-teal-900/20 rounded-[20px] overflow-hidden relative"
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                                    }}>
                                    {/* Image Section */}
                                    <div className="relative">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
                                        />
                                        {/* Date Badge */}
                                        <div className="absolute top-3 right-3 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-lg min-w-[45px]">
                                            <div className="text-center">
                                                <div className="text-[10px] opacity-70">APR</div>
                                                <div className="text-sm font-bold">{event.date.split(' ')[1] || event.date}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-base leading-tight mb-1">{event.title}</h3>
                                                <p className="text-white/70 text-sm">{event.venue}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full-width Teal Highlight Section */}
                                    <div className="header-gradient text-white text-sm font-medium px-3 py-2 w-full">
                                        <div className="text-center">
                                            {event.category}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Photos Section */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-base">Photos</h3>
                    <button className="text-cyan-400 text-sm flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        +7
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {photos.slice(0, 6).map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                            <img
                                src={photo}
                                alt={`Dabo photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {index === 5 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Section */}
            <div className="px-6 py-4">
                <h3 className="text-white font-semibold text-base mb-4">Location</h3>
                <div className="glassmorphism rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm mb-1">House 10/156/1, Yogeshwari CHS, Wardha Road, Nagpur</p>
                        </div>
                    </div>
                </div>
                <div className="glassmorphism rounded-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="px-6 py-4">
                <h3 className="text-white font-semibold text-base mb-4">Facilities</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-6 h-6 header-gradient rounded-full flex items-center justify-center">
                                <facility.icon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white text-sm">{facility.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Food, Music, Bar Sections */}
            <div className="px-6 space-y-6">
                {/* Food */}
                <div>
                    <h3 className="text-white font-semibold text-base mb-3">Food</h3>
                    <div className="flex flex-wrap gap-2">
                        {foodOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 glassmorphism px-3 py-2 rounded-full">
                                <option.icon className="w-4 h-4 text-cyan-400" />
                                <span className="text-white text-sm">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Music */}
                <div>
                    <h3 className="text-white font-semibold text-base mb-3">Music</h3>
                    <div className="flex flex-wrap gap-2">
                        {musicOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 glassmorphism px-3 py-2 rounded-full">
                                <option.icon className="w-4 h-4 text-cyan-400" />
                                <span className="text-white text-sm">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar */}
                <div>
                    <h3 className="text-white font-semibold text-base mb-3">Bar</h3>
                    <div className="flex flex-wrap gap-2">
                        {barOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 glassmorphism px-3 py-2 rounded-full">
                                <option.icon className="w-4 h-4 text-cyan-400" />
                                <span className="text-white text-sm">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-base">Reviews</h3>
                    <button className="text-cyan-400 text-sm">View All</button>
                </div>
                <div className="space-y-4">
                    <div className="glassmorphism rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white font-medium text-sm">Anjali Sharma</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm">
                                    I recently ate at Dabo and had a great time. The lighting was good, the vibes were good. The food was perfect. The service was excellent.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leave Review Button */}
                <div className="flex items-center justify-center mt-6">
                    <button className="header-gradient text-white font-medium py-3 px-6 rounded-full hover:brightness-110 transition-all">
                        Leave a review
                    </button>
                </div>
            </div>

            {/* Bottom padding */}
            <div className="h-20"></div>
        </div>
    );
}