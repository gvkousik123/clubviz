'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2 } from 'lucide-react';

export default function BookingConfirmPage() {
    const router = useRouter();

    const handleViewTicket = () => {
        router.push('/event/ticket');
    };

    const handleShareTicket = () => {
        // Implement share functionality
        // Could use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My Event Ticket',
                text: 'Check out my ticket for the event!',
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Share functionality not available');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            {/* Back button in top left */}
            <button
                onClick={handleBack}
                className="absolute top-10 left-4 z-10 w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
            >
                <ChevronLeft size={24} className="text-white" />
            </button>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center  h-screen px-4">
                {/* Loading Circle Animation */}
                <div className="w-20 h-20 relative mb-10">
                    <div className="w-20 h-20 rounded-full border-4 border-[#0D1F1F]"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-r-transparent animate-spin border-[#14FFEC]"></div>
                </div>

                {/* Success Message */}
                <h1 className="text-white text-2xl font-['Manrope'] font-semibold mb-2 text-center flex items-center justify-center gap-2">
                    <span>Booking Complete</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L20 7" stroke="#14FFEC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </h1>

                {/* Subtitle */}
                <p className="text-[#14FFEC] text-lg font-['Manrope'] font-normal mb-16 text-center">
                    See you at the Venue
                </p>
            </div>

            {/* Bottom Fixed Buttons */}
            <div className="fixed bottom-8 left-0 right-0">
                <div className="w-full flex flex-col items-center space-y-4 px-8">
                    {/* Share Ticket Button */}
                    <button
                        onClick={handleShareTicket}
                        className="w-full max-w-md h-[55px] rounded-[30px] border border-[#14FFEC]  bg-[#0F6861] flex justify-center items-center"
                    >
                        <span className="text-white text-xl font-['Manrope'] font-medium">
                            Share ticket
                        </span>
                    </button>

                    {/* View Ticket Button */}
                    <button
                        onClick={handleViewTicket}
                        className="w-full max-w-md h-[55px] rounded-[30px] bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                    >
                        <span className="text-white text-xl font-['Manrope'] font-medium">
                            View ticket
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
