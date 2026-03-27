'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    MapPin,
    Calendar,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import TicketCounter from '@/components/common/ticket-counter';
import { EventService } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';
import { useEventDetail } from '@/lib/store';

function TicketsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Get eventId from URL params
    const eventId = searchParams.get('eventId') || '';

    // Use cached event data from the store
    const { event: cachedEventData, loading: eventLoading } = useEventDetail(eventId);

    const [activeTab, setActiveTab] = useState('early');
    const [tickets, setTickets] = useState<Record<string, number>>({});
    const [eventData, setEventData] = useState<any>(null);
    const [ticketTypes, setTicketTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    // Format price text
    const formatPriceText = (price: number, currency: string = 'INR') => {
        if (!price) return 'Free Entry';
        return `₹ ${price.toLocaleString()}`;
    };

    // Initialize tickets state with ticket types
    const initializeTickets = (types: any[]) => {
        const initialState: Record<string, number> = {};
        types.forEach((type) => {
            initialState[type.name] = 0;
        });
        setTickets(initialState);
    };

    // Format and set event data when cached data is available
    useEffect(() => {
        if (cachedEventData) {
            console.log('Using cached event data:', cachedEventData);

            // Format the event data for display
            const formattedEventData = {
                id: cachedEventData.id,
                title: cachedEventData.title || 'Event',
                venue: cachedEventData.location || cachedEventData.club?.name || 'Venue',
                clubName: cachedEventData.club?.name || '',
                clubId: cachedEventData.club?.id || '',
                date: cachedEventData.formattedDate || cachedEventData.startDateTime || 'Date',
                time: cachedEventData.formattedTime || cachedEventData.startDateTime || 'Time',
                image: cachedEventData.imageUrl || cachedEventData.images?.[0] || cachedEventData.club?.logo || '/event list/Rectangle 1.jpg',
                description: cachedEventData.description || '',
                startDateTime: cachedEventData.startDateTime,
                endDateTime: cachedEventData.endDateTime,
                club: cachedEventData.club,
                ticketTypes: cachedEventData.ticketTypes || []
            };

            setEventData(formattedEventData);

            // Extract ticket types if available
            if (cachedEventData.ticketTypes && Array.isArray(cachedEventData.ticketTypes)) {
                setTicketTypes(cachedEventData.ticketTypes);
                initializeTickets(cachedEventData.ticketTypes);
            }

            setLoading(false);
        }
    }, [cachedEventData]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!eventId) {
            toast({
                title: 'Error',
                description: 'Event ID is missing',
                variant: 'destructive',
            });
            router.push('/home');
        }
    }, [eventId]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const updateTicketCount = (ticketName: string, value: number) => {
        setTickets(prev => ({
            ...prev,
            [ticketName]: Math.max(0, value)
        }));
    };

    const handleProceedToPay = () => {
        // Calculate total tickets
        const totalTickets = Object.values(tickets).reduce((sum, count) => sum + count, 0);

        if (totalTickets === 0) {
            toast({
                title: 'No tickets selected',
                description: 'Please select at least one ticket',
                variant: 'destructive',
            });
            return;
        }

        // Get user contact info from localStorage
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('clubviz-user') : null;
        let contactInfo = {
            name: 'Guest',
            phone: '',
            email: ''
        };

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                contactInfo = {
                    name: user.username || user.name || user.fullName || 'Guest',
                    phone: user.phoneNumber || user.mobileNumber || user.mobile || '',
                    email: user.email || ''
                };
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        // Create ticket breakdown with actual names from ticketTypes
        const ticketBreakdown = ticketTypes
            .filter(type => tickets[type.name] > 0)
            .map(type => ({
                name: type.name,
                price: type.price,
                quantity: tickets[type.name],
                currency: type.currency
            }));

        // Calculate total amount
        const totalAmount = ticketBreakdown.reduce((sum, ticket) => {
            return sum + (ticket.price * ticket.quantity);
        }, 0);

        // Store booking data with actual ticket breakdown
        const bookingData = {
            eventId: eventId,
            tickets: tickets,
            ticketBreakdown: ticketBreakdown,
            totalTickets: totalTickets,
            totalAmount: totalAmount,
            userName: contactInfo.name,
            userPhone: contactInfo.phone,
            userEmail: contactInfo.email,
            eventData: eventData
        };

        // Store in sessionStorage for review page
        sessionStorage.setItem('eventBookingData', JSON.stringify(bookingData));
        sessionStorage.setItem('currentEventData', JSON.stringify(eventData));

        console.log('Booking data prepared:', bookingData);

        // Go to review booking page
        router.push(`/event/review-booking`);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (!isHydrated) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative">
            {/* Hero Section with Event Image */}
            <div className="relative h-[320px] w-full">
                <img
                    src={eventData?.imageUrl || eventData?.image || "/event list/Rectangle 1.jpg"}
                    alt={eventData?.title || "Event"}
                    className="w-full h-full object-cover brightness-90"
                />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                </div>

            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-[#000000] rounded-t-[40px] -mt-20 relative z-10 pt-4 pb-8">
                <h1 className="text-center text-white text-2xl font-['Anton'] tracking-[2.4px] leading-8">
                    {eventData?.title || "Event"}
                </h1>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Event Details */}
                <div className="px-9 flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-3">
                        <MapPin size={24} className="text-[#14FFEC]" />
                        <p className="text-white font-['Manrope'] font-bold">
                            {eventData?.venue || 'Venue'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar size={24} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">
                                {eventData?.date || 'Date'} | {eventData?.time || 'Time'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6"></div>
            </div>
            {/* Bottom Section with Ticket Selection */}
            <div className="w-full rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] z-20 -mt-8 pb-32">
                <div className="px-6 pt-8">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-3">SELECT YOUR ENTRY TICKETS</h2>

                    {/* Ticket Selection */}
                    <div className="space-y-3">
                        {ticketTypes && ticketTypes.length > 0 ? (
                            ticketTypes.map((ticketType, index) => (
                                <div key={ticketType.name || index}>
                                    {/* Ticket Card */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="text-white font-['Manrope'] font-semibold text-base">
                                                    {ticketType.name}
                                                </p>
                                                <p className="text-[#14FFEC] font-['Manrope'] font-medium text-base">
                                                    {formatPriceText(ticketType.price, ticketType.currency)}
                                                </p>
                                                {ticketType.remark && (
                                                    <p className="text-[#71F8FF] font-['Manrope'] font-medium text-xs mt-1">
                                                        {ticketType.remark}
                                                    </p>
                                                )}
                                                <p className="text-gray-400 text-xs mt-2">
                                                    Available: {ticketType.quantity}
                                                </p>
                                            </div>
                                            <TicketCounter
                                                value={tickets[ticketType.name] || 0}
                                                onChange={(value) => updateTicketCount(ticketType.name, value)}
                                                min={0}
                                                max={ticketType.quantity || 20}
                                            />
                                        </div>
                                    </div>

                                    {/* Separator Line */}
                                    {index < ticketTypes.length - 1 && (
                                        <div className="flex justify-center my-3">
                                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No tickets available</p>
                            </div>
                        )}
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

export default function TicketsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <TicketsPageContent />
        </Suspense>
    );
}
