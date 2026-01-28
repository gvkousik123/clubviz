'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    MapPin,
    Calendar,
    ChevronLeft,
    Minus,
    Plus,
    Loader2
} from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
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
    const [tickets, setTickets] = useState({
        maleStag: 0,
        femaleStag: 0,
        couple: 0,
    });
    const [eventData, setEventData] = useState<any>(null);
    const [ticketTypes, setTicketTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to get pricing for a specific ticket type
    const getTicketPrice = (type: 'maleStag' | 'femaleStag' | 'couple', category: 'early' | 'general') => {
        if (!ticketTypes || ticketTypes.length === 0) {
            // Fallback to default prices if no ticket types are available
            if (category === 'early') {
                return type === 'maleStag' ? { price: 1500, cover: 1000 } :
                    type === 'femaleStag' ? { price: 0, cover: 0, isFree: true } :
                        { price: 0, cover: 0, isFree: true };
            } else {
                return type === 'maleStag' ? { price: 2000, cover: 1000 } :
                    type === 'femaleStag' ? { price: 2000, cover: 1000 } :
                        { price: 2000, cover: 1000 };
            }
        }

        // Map type and category to ticket name
        const ticketNameMap: Record<string, string> = {
            'maleStag-early': 'Early Bird Male Stag',
            'femaleStag-early': 'Early Bird Female Stag',
            'couple-early': 'Early Bird Couple',
            'maleStag-general': 'General Male Stag',
            'femaleStag-general': 'General Female Stag',
            'couple-general': 'General Couple',
        };

        const ticketName = ticketNameMap[`${type}-${category}`];
        const ticketType = ticketTypes.find(t =>
            t.name && t.name.toLowerCase().includes(type.toLowerCase()) &&
            t.name.toLowerCase().includes(category)
        ) || ticketTypes.find(t => t.name === ticketName);

        if (ticketType) {
            return {
                price: ticketType.price || 0,
                cover: ticketType.coverCharge || 0,
                isFree: ticketType.price === 0 || ticketType.price === null
            };
        }

        // Fallback prices
        return category === 'early'
            ? (type === 'maleStag' ? { price: 1500, cover: 1000 } : { price: 0, cover: 0, isFree: true })
            : { price: 2000, cover: 1000 };
    };

    // Format price text
    const formatPriceText = (pricing: { price: number; cover?: number; isFree?: boolean }) => {
        if (pricing.isFree) return 'Free Entry';
        if (pricing.cover && pricing.cover > 0) {
            return `Rs ${pricing.price} (Cover - ${pricing.cover})`;
        }
        return `Rs ${pricing.price}`;
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
            }

            setLoading(false);
        }
    }, [cachedEventData]);

    useEffect(() => {
        if (!eventId) {
            toast({
                title: 'Error',
                description: 'Event ID is missing',
                variant: 'destructive',
            });
            router.back();
        }
    }, [eventId]);

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
        // Calculate total tickets
        const totalTickets = tickets.maleStag + tickets.femaleStag + tickets.couple;

        if (totalTickets === 0) {
            toast({
                title: 'No tickets selected',
                description: 'Please select at least one ticket',
                variant: 'destructive',
            });
            return;
        }

        // Store event data in sessionStorage to avoid API call
        sessionStorage.setItem('currentEventData', JSON.stringify(eventData));

        // Pass event data and ticket selections to contact info page
        const params = new URLSearchParams({
            eventId: eventId,
            ticketType: activeTab,
            maleStag: tickets.maleStag.toString(),
            femaleStag: tickets.femaleStag.toString(),
            couple: tickets.couple.toString(),
        });

        router.push(`/event/contact-info?${params.toString()}`);
    };

    if (loading) {
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('maleStag', 'early'))}</p>
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('femaleStag', 'early'))}</p>
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('couple', 'early'))}</p>
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('maleStag', 'general'))}</p>
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('femaleStag', 'general'))}</p>
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
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('couple', 'general'))}</p>
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
