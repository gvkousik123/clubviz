'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Share2,
    Heart,
    Calendar,
    Clock,
    MapPin,
    Music,
    Users,
    ThumbsUp,
    Ticket,
    ChevronLeft,
    ChevronDown
} from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';

export default function TimelessTuesdayPage() {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleBookNow = () => {
        router.push('/event/tickets');
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">

            {/* Hero Section with Event Image */}
            <div className="relative h-[420px] w-full">
                <img
                    src="/event list/Rectangle 1.jpg"
                    alt="Timeless Tuesdays Event"
                    className="w-full h-full object-cover brightness-75"
                />

                {/* Gradient Overlay - darker version */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#021313]" />

                {/* Back Button */}
                <div className="absolute top-4 left-4 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft
                            size={20}
                            className="text-[#14FFEC]"
                        />
                    </button>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="w-full bg-[#021313] rounded-t-[40px] -mt-10 relative z-10">
                <div className="px-4 pt-8 ">
                    {/* Event Title */}
                    <div className="flex justify-center items-center mb-7">
                        <h1 className="text-white text-center text-xl font-['Manrope'] leading-8 tracking-[0.24px]">
                            Timeless Tuesdays Ft. DJ Xpensive
                        </h1>
                    </div>

                    {/* Action Icons */}
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center">
                            <ThumbsUp size={24} className="text-[#14FFEC]" />
                        </div>
                        <div className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center">
                            <Share2 size={24} className="text-[#14FFEC]" />
                        </div>
                        <div className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center">
                            <Ticket size={24} className="text-[#14FFEC]" />
                        </div>
                        <div className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center">
                            <Heart size={24} className="text-[#14FFEC]" />
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <MapPin size={24} className="text-[#14FFEC]" />
                        <p className="text-white font-['Manrope']">Dabo club & kitchen, Nagpur</p>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 px-2">
                        <Calendar size={24} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope']">24 Dec | 7:00 pm</p>
                        </div>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-6">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Music Categories */}
                <div className="flex flex-wrap gap-2 px-6 mb-6">
                    <span className="px-4 py-1 bg-[#0D7377] text-white rounded-full text-sm border border-[#14FFEC]">Electronic</span>
                    <span className="px-4 py-1 bg-[#0D7377] text-white rounded-full text-sm border border-[#14FFEC]">Hip hop</span>
                    <span className="px-4 py-1 bg-[#0D7377] text-white rounded-full text-sm border border-[#14FFEC]">Techno</span>
                </div>

                {/* People Attending */}
                <div className="px-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            <img
                                src="/event page going people/Frame 3896.png"
                                alt="People attending"
                                className="w-32 h-8 rounded-full object-cover"
                            />
                        </div>
                        <span className="text-white text-sm font-['Manrope']">61+ going in this event</span>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Artist */}
                <div className="px-6 mb-6">
                    <h2 className="text-white text-xl font-['Manrope'] mb-3">Artist</h2>
                    <div className="bg-[#0D1F1F] rounded-lg p-4 flex items-center justify-between  ">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center">
                                <img
                                    src="/vibemeter/Screenshot_2025-05-24_094641-removebg-preview.png"
                                    alt="DJ Edward"
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/common/avatar-default.jpg";
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-white font-['Manrope']">DJ Edward</p>
                            </div>
                        </div>
                        <button className="text-[#14FFEC]">
                            <ChevronDown size={20} />
                        </button>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Description */}
                <div className="px-6 mb-8">
                    <h2 className="text-white text-xl font-['Manrope'] mb-3">About this Event</h2>
                    <div className="bg-[#0D1F1F] rounded-lg p-4 mb-2  ">
                        <p className="text-white/80 text-sm leading-relaxed font-['Manrope']">
                            Join us for Timeless Tuesdays featuring DJ Xpensive! Experience the best electronic,
                            hip hop and techno music in town. Free drinks, free parking, and amazing atmosphere
                            guaranteed. Don't miss out on the most exciting Tuesday night party in Nagpur!
                        </p>
                    </div>
                    <button className="text-[#14FFEC] flex items-center justify-center w-full">
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Event Organizers */}
                <div className="px-6 mb-8">
                    <h2 className="text-white text-xl font-['Manrope'] mb-3">Event Organised & Presented by</h2>
                    <div className="w-full p-4 bg-[#0D1F1F]  rounded-[20px]">
                        <div className="flex items-center justify-start gap-8">
                            <div className="flex items-center gap-2">
                                <img className="w-[51px] h-[51px] rounded-full object-cover" src="/vibemeter/Screenshot_2025-05-16_192139-removebg-preview.png" />
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium leading-5">
                                    Team<br /> Events
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <img className="w-[51px] h-[51px] rounded-full object-cover" src="/vibemeter/Screenshot_2025-05-16_193232-removebg-preview.png" />
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium leading-5">
                                    Ark <br />Events
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}