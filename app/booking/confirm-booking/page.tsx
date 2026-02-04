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

    const [loading, setLoading] = useState(true);
    const [ticketData, setTicketData] = useState<any>(null);

    useEffect(() => {
        if (ticketId) {
            // First try to get from sessionStorage (fresh response)
            const storedResponse = sessionStorage.getItem('ticketResponse');
            if (storedResponse) {
                setTicketData(JSON.parse(storedResponse));
                setLoading(false);
                // Keep it for view-ticket page
            } else {
                // Fallback: fetch from API
                fetchTicketDetails();
            }
        }
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            const response = await TicketService.getTicketDetails(ticketId!);
            if (response.success && response.data) {
                setTicketData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch ticket:', error);
            toast({
                title: 'Error',
                description: 'Failed to load ticket details',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewTicket = () => {
        // Pass ticket data to ticket page via sessionStorage
        sessionStorage.setItem('ticketData', JSON.stringify(ticketData));
        router.push(`/booking/ticket?ticketId=${ticketId}`);
    };

    const handleShareTicket = () => {
        // Implement share functionality
        // Could use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My Booking Ticket',
                text: `Check out my ticket for ${ticketData?.clubName || 'the club'}!`,
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

    const handleBack = () => {
        router.push('/home');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        // Convert 24-hour to 12-hour format
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'pm' : 'am';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    };

    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            {/* Header */}
            <div className="w-full h-[20vh] bg-gradient-to-b from-[#0F6861] to-[#074344] rounded-b-[25px] flex items-center justify-center relative">
                <button
                    onClick={handleBack}
                    className="absolute top-10 left-4 w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-white text-xl font-['Manrope'] font-bold">REVIEW EVENT BOOKING</h1>
            </div>

            {/* Main Content - Scrollable */}
            <div className="pt-6 pb-32 px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 20vh)' }}>
                {/* Loading Circle with Success Message */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 relative mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-[#0D1F1F]"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-r-transparent animate-spin border-[#14FFEC]"></div>
                    </div>

                    <h2 className="text-white text-xl font-['Manrope'] font-semibold mb-2">
                        Successfully Booked your Table
                    </h2>
                    <p className="text-[#14FFEC] text-sm font-['Manrope'] mb-1">
                        Reservation ID: <span className="font-bold">{ticketData?.ticketNumber || 'N/A'}</span>
                    </p>
                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] text-center">
                        Reach the venue before 15 mins of your booking
                    </p>
                </div>

                {/* Booking Details Card */}
                <div className="bg-[#0D1F1F] rounded-xl p-5 mb-6">
                    {/* Booking Date and Guests */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] mb-1">Booking date</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">
                                {ticketData?.bookingDate && ticketData?.arrivalTime
                                    ? `${formatDate(ticketData.bookingDate)} | ${formatTime(ticketData.arrivalTime)}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] mb-1">Number of Guest(s)</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">{ticketData?.guestCount || 0} Guests</p>
                        </div>
                    </div>

                    {/* Notes/Occasion */}
                    {ticketData?.occasion && (
                        <div className="mb-4">
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] mb-1">Notes</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">{ticketData.occasion}</p>
                        </div>
                    )}

                    {/* Location */}
                    <div className="mb-4">
                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] mb-1">Location</p>
                        <p className="text-white text-sm font-['Manrope'] font-bold">{ticketData?.clubName || 'N/A'}</p>
                    </div>

                    {/* Floor Preference */}
                    {ticketData?.floorPreference && (
                        <div>
                            <p className="text-[#14FFEC] text-xs font-['Manrope'] mb-1">Floor Preference</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">{ticketData.floorPreference}</p>
                        </div>
                    )}
                </div>

                {/* Name */}
                <div className="mb-4">
                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] mb-1">Name</p>
                    <p className="text-white text-base font-['Manrope'] font-medium">{ticketData?.userName || 'Guest'}</p>
                </div>
            </div>

            {/* Bottom Fixed Button */}
            <div className="fixed bottom-8 left-0 right-0 px-4">
                <button
                    onClick={handleViewTicket}
                    className="w-full h-[55px] rounded-[30px] bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                >
                    <span className="text-white text-xl font-['Manrope'] font-medium">
                        View Ticket
                    </span>
                </button>
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
