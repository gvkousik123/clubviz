'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    Calendar,
    ChevronLeft,
    Minus,
    Plus
} from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';

export default function TicketsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('early');
    const [tickets, setTickets] = useState({
        maleStag: 0,
        femaleStag: 0,
        couple: 0,
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const updateTicketCount = (type: 'maleStag' | 'femaleStag' | 'couple', action: 'increment' | 'decrement') => {
        setTickets(prev => {
            const currentValue = prev[type];
            if (action === 'decrement' && currentValue > 0) {
                return { ...prev, [type]: currentValue - 1 };
            } else if (action === 'increment') {
                return { ...prev, [type]: currentValue + 1 };
            }
            return prev;
        });
    };

    const handleProceedToPay = () => {
        router.push('/event/contact-info');
    };

    return (
        <div className="min-h-screen w-full relative">
            {/* Hero Section with Event Image */}
            <div className="relative h-[320px] w-full">
                <img
                    src="/event list/Rectangle 1.jpg"
                    alt="Timeless Tuesdays Event"
                    className="w-full h-full object-cover brightness-90"
                />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                </div>

            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-[#000000] rounded-t-[40px] -mt-20 relative z-10 pt-4 pb-8">
                <h1 className="text-center text-white text-2xl font-['Anton'] tracking-[2.4px] leading-8">
                    Timeless Tuesdays Ft. DJ Xpensive
                </h1>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Event Details */}
                <div className="px-9 flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-3">
                        <MapPin size={24} className="text-[#14FFEC]" />
                        <p className="text-white font-['Manrope'] font-bold">Dabo club & kitchen, Nagpur</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar size={24} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">24 Dec | 7:00 pm</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6"></div>
            </div>
            {/* Bottom Section with Ticket Selection */}
            <div className="w-full absolute bottom-0 rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] min-h-[50%] z-20 mt-8">
                <div className="px-6 pt-8">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-3">SELECT YOUR ENTRY TICKETS</h2>

                    {/* Tab Selection */}
                    <div className="flex mb-3">
                        <button
                            onClick={() => handleTabChange('early')}
                            className={`flex-1 py-2 rounded-t-[45px] text-white font-['Manrope'] font-semibold text-center ${activeTab === 'early'
                                ? 'bg-[radial-gradient(ellipse_at_center_bottom,_var(--tw-gradient-stops))] from-[#003D3C] to-[#01807E]'
                                : 'bg-[#37484D]'
                                }`}
                        >
                            Early bird Tickets
                        </button>
                        <button
                            onClick={() => handleTabChange('general')}
                            className={`flex-1 py-2 rounded-t-[30px] text-white font-['Manrope'] font-semibold text-center ${activeTab === 'general'
                                ? 'bg-[radial-gradient(ellipse_at_center_bottom,_var(--tw-gradient-stops))] from-[#003D3C] to-[#01807E]'
                                : 'bg-[#37484D]'
                                }`}
                        >
                            General Tickets
                        </button>
                    </div>

                    {/* Ticket Selection - Early Bird Tab */}
                    <div className={activeTab === 'early' ? 'block' : 'hidden'}>
                        {/* Male Stag Entry */}
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Male Stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">Rs 1500 (Cover - 1000)</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.maleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Female stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">Free Entry</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.femaleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Couple Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">Free Entry</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('couple', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.couple}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('couple', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>
                    </div>

                    {/* Ticket Selection - General Tab */}
                    <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                        {/* Male Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Male Stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">Rs 2000 (Cover - 1000)</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.maleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Female stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">Rs 2000 (Cover - 1000)</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.femaleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Couple Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">Rs 2000 (Cover - 1000)</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('couple', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.couple}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('couple', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="mt-8">
                    <BottomContinueButton
                        text="Next"
                        onClick={handleProceedToPay}
                    />
                </div>
            </div>
        </div>
    );
}
