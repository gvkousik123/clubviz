'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Share2, Loader2 } from 'lucide-react';
import { TicketService } from '@/lib/services/ticket.service';
import { useToast } from '@/hooks/use-toast';

function BookingConfirmPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const ticketId = searchParams.get('ticketId');

    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);

    useEffect(() => {
        // Fetch ticket data here if needed
    }, [ticketId]);

    const handleShareTicket = () => {
        // Implement share functionality
        // Could use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My Event Ticket',
                text: `Check out my ticket for ${ticketData?.eventTitle || 'the event'}!`,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback: copy link
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: 'Link copied',
                description: 'Ticket link copied to clipboard',
            });
        }
    };

    const handleGoHome = () => {
        router.push('/home');
    };

    const handleViewBookings = () => {
        router.push('/booking');
    };

    const handleViewTicket = () => {
        // Navigate to ticket details or download
        if (ticketId) {
            router.push(`/booking/ticket?ticketId=${ticketId}`);
        } else {
            router.push('/booking');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            {/* No back button on confirmation page - prevents going back to payment flow */}

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center  h-screen px-4">
                {/* Success Check Animation */}
                <div className="w-20 h-20 relative mb-10">
                    <div className="w-20 h-20 rounded-full border-4 border-[#14FFEC] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#14FFEC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-white text-2xl font-['Manrope'] font-semibold mb-2 text-center flex items-center justify-center gap-2">
                    <span>Booking Complete</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#14FFEC] text-lg font-['Manrope'] font-normal mb-16 text-center">
                    See you at the Venue
                </p>
            </div>

            {/* Bottom Fixed Buttons */}
            <div className="fixed bottom-8 left-0 right-0">
                <div className="w-full flex flex-col items-center space-y-4 px-8">
                    {/* View Ticket Button */}
                    <button
                        onClick={handleViewTicket}
                        className="w-full max-w-md h-[55px] rounded-[30px] bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                    >
                        <span className="text-white text-xl font-['Manrope'] font-medium">
                            View ticket
                        </span>
                    </button>

                    {/* View My Bookings Button */}
                    <button
                        onClick={handleViewBookings}
                        className="w-full max-w-md h-[55px] rounded-[30px] border border-[#14FFEC] bg-[#0F6861] flex justify-center items-center"
                    >
                        <span className="text-white text-xl font-['Manrope'] font-medium">
                            View My Bookings
                        </span>
                    </button>

                    {/* Back to Home Button */}
                    <button
                        onClick={handleGoHome}
                        className="w-full max-w-md h-[55px] rounded-[30px] border border-[#FFFFFF33] flex justify-center items-center"
                    >
                        <span className="text-white text-xl font-['Manrope'] font-medium">
                            Back to Home
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <BookingConfirmPageContent />
        </Suspense>
    );
}
