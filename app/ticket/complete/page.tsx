'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BookingCompletePage() {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Small delay to show loading animation first
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleShareTicket = () => {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: 'My Event Ticket',
                text: 'Check out my ticket for this amazing event!',
                url: window.location.href,
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            // Could show a toast here
        }
    };

    const handleViewTicket = () => {
        router.push('/ticket/view');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-start p-6 pt-12">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[60vh]">
                {/* Loading/Success Icon */}
                <div className="relative mb-16">
                    {/* Outer glow effect */}
                    <div className="absolute inset-0 w-24 h-24 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>

                    {/* Main circle */}
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
                        {!showContent ? (
                            // Loading spinner - more accurate to design
                            <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
                        ) : (
                            // Success checkmark - simpler circle design
                            <div className="w-16 h-16 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-400/30">
                                <div className="w-12 h-12 border-4 border-teal-400 rounded-full flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal-400">
                                        <path
                                            d="M20 6L9 17l-5-5"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Text */}
                <div className="text-center mb-20">
                    <h1 className="text-3xl font-bold mb-4 text-white">
                        {showContent ? 'Booking Complete' : 'Processing...'}
                    </h1>
                    {showContent && (
                        <p className="text-lg text-teal-400 font-medium">
                            See you at the Venue
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Action Buttons */}
            {showContent && (
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 space-y-4">
                    <button
                        onClick={handleShareTicket}
                        className="w-full header-gradient text-white font-semibold py-4 px-6 rounded-2xl 
                     shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                     transform hover:scale-[1.02] transition-all duration-300 
                     border border-teal-400/20 backdrop-blur-sm
                     flex items-center justify-center gap-3"
                    >
                        <Share size={20} />
                        SHARE TICKET
                    </button>

                    <button
                        onClick={handleViewTicket}
                        className="w-full bg-transparent text-teal-400 font-semibold py-4 px-6 rounded-2xl 
                     border-2 border-teal-400/50 hover:border-teal-400 hover:bg-teal-400/10
                     transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-3"
                    >
                        <Eye size={20} />
                        VIEW TICKET
                    </button>
                </div>
            )}
        </div>
    );
}