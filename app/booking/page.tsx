'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/page-header';
import Image from 'next/image';
import { TicketService } from '@/lib/services/ticket.service';
import { STORAGE_KEYS } from '@/lib/constants/storage';
import { Loader2 } from 'lucide-react';
import { EventsListSkeleton } from '@/components/ui/skeleton-loaders';

interface BookingItem {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    dressCode: string;
    price: string;
    image: string;
    status: 'ACTIVE' | 'CANCELLED';
    ticketNumber?: string;
    eventId?: string;
    hasEvent?: boolean;
}

export default function BookingPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [activeEventFilter, setActiveEventFilter] = useState<string | 'all'>('all');
    const [tickets, setTickets] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserTickets();
    }, []);

    const fetchUserTickets = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem(STORAGE_KEYS.user);
            if (!userStr) {
                console.error('No user found in localStorage');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user.userId || user.id;

            if (!userId) {
                console.error('No userId found in user object');
                setLoading(false);
                return;
            }

            console.log('Fetching tickets for userId:', userId);
            const response = await TicketService.getUserTickets(userId);
            console.log('API Response:', response);

            if (Array.isArray(response) && response.length > 0) {
                console.log('Tickets data:', response);
                const mappedTickets = response.map((ticket: any) => {
                    // Parse booking date properly
                    const bookingDateStr = ticket.bookingDate;
                    const bookingDate = new Date(bookingDateStr + 'T00:00:00');

                    // Format date as "31 Dec"
                    const month = bookingDate.toLocaleString('en-US', { month: 'short' });
                    const day = bookingDate.getDate();
                    const formattedDate = `${day}${getDaySuffix(day)} ${month.toUpperCase()}`;

                    // Parse arrival time - handle both "14:00:00" and "14:00" formats
                    let time = 'N/A';
                    if (ticket.arrivalTime) {
                        const timeParts = ticket.arrivalTime.split(':');
                        const hours = parseInt(timeParts[0]);
                        const minutes = timeParts[1] || '00';
                        const period = hours >= 12 ? 'pm' : 'am';
                        const displayHours = hours % 12 || 12;
                        time = `${displayHours}:${minutes} ${period}`;
                    }

                    return {
                        id: ticket.ticketId,
                        title: ticket.eventTitle || ticket.clubName || 'Club Entry',
                        venue: ticket.clubName || 'N/A',
                        date: formattedDate,
                        time: time,
                        dressCode: ticket.occasion || ticket.floorPreference || '----------',
                        price: `₹ ${Math.round(ticket.totalAmount || 0)}`,
                        image: ticket.eventImage || '/dabo ambience main dabo page/Media.jpg',
                        status: ticket.status,
                        ticketNumber: ticket.ticketNumber,
                        eventId: ticket.eventId,
                        hasEvent: ticket.hasEvent || false
                    };
                });

                console.log('Mapped tickets:', mappedTickets);
                setTickets(mappedTickets);
            } else {
                console.log('No data in response or not successful:', response);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get day suffix (st, nd, rd, th)
    const getDaySuffix = (day: number) => {
        if (day >= 11 && day <= 13) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const currentBookings = tickets.filter(ticket => {
        if (activeTab === 'upcoming') {
            // Show ACTIVE tickets only
            return ticket.status === 'ACTIVE';
        } else {
            // Show CANCELLED tickets
            return ticket.status === 'CANCELLED';
        }
    });

    // Get event tickets from current bookings
    const eventTickets = currentBookings.filter(t => t.hasEvent && t.eventId);

    // Get unique event IDs
    const uniqueEvents = Array.from(new Map(
        eventTickets.map(ticket => [ticket.eventId, ticket.title])
    ).entries());

    // Filter tickets based on selected event
    const filteredTickets = activeEventFilter === 'all'
        ? currentBookings
        : currentBookings.filter(t => t.eventId === activeEventFilter);

    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            <PageHeader title="MY BOOKINGS" />

            {/* Tab Navigation */}
            <div className="px-4 py-6 pt-[20vh]">
                <div className="w-full h-14 relative">
                    <div className="w-full h-14 relative bg-[#0D1F1F] rounded-[1.875rem] overflow-hidden">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`absolute left-0 top-0 w-1/2 h-full rounded-[1.875rem] flex items-center justify-center transition-all duration-300 ${activeTab === 'upcoming'
                                ? 'bg-[#0F726A] text-white'
                                : 'bg-transparent text-white/70'
                                }`}
                        >
                            <span className="text-base font-bold font-['Manrope'] tracking-[0.1rem]">Upcoming</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`absolute right-0 top-0 w-1/2 h-full rounded-[1.875rem] flex items-center justify-center transition-all duration-300 ${activeTab === 'past'
                                ? 'bg-[#0F726A] text-white'
                                : 'bg-transparent text-white/70'
                                }`}
                        >
                            <span className="text-base font-bold font-['Manrope'] tracking-[0.1rem]">Past</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Filter Tabs - Only show if there are event tickets */}
            {eventTickets.length > 0 && (
                <div className="px-4 py-4">
                    <div className="space-y-2">
                        <p className="text-white/60 text-xs font-semibold px-2">EVENT TICKETS</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {/* All Events Tab */}
                            <button
                                onClick={() => setActiveEventFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeEventFilter === 'all'
                                    ? 'bg-[#14FFEC] text-black'
                                    : 'bg-[#0D1F1F] text-white/70 border border-[#14FFEC]/30 hover:border-[#14FFEC]'
                                    }`}
                            >
                                All Events ({eventTickets.length})
                            </button>

                            {/* Individual Event Tabs */}
                            {uniqueEvents.map(([eventId, eventTitle]) => {
                                const eventTicketCount = eventTickets.filter(t => t.eventId === eventId).length;
                                return (
                                    <button
                                        key={eventId}
                                        onClick={() => setActiveEventFilter(eventId as string)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeEventFilter === eventId
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[#0D1F1F] text-white/70 border border-[#14FFEC]/30 hover:border-[#14FFEC]'
                                            }`}
                                    >
                                        {eventTitle} ({eventTicketCount})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Bookings List */}
            <div className="px-4">
                {loading ? (
                    <div className="py-6">
                        <EventsListSkeleton count={3} />
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-400 text-sm">No {activeTab} bookings found</p>
                    </div>
                ) : (
                    <div className="flex flex-col justify-start items-end gap-1 max-h-[30.875rem] overflow-y-auto">
                        {filteredTickets.map((booking) => (
                            <div key={booking.id} className="w-full relative mb-4">
                                {/* Main ticket container with cutouts */}
                                <div
                                    className="ticket-container relative w-full bg-gradient-to-br from-[#0A2A2A] to-[#031414] rounded-2xl border border-[#14FFEC] overflow-hidden"
                                >

                                    {/* Card content */}
                                    <div className="relative w-full h-full pl-9 pr-5 py-5 pb-6 pt-4">
                                        {/* QR Code Section - Right Side */}
                                        <div className="absolute right-0 top-0 bottom-0 w-[5.5rem] bg-white rounded-2xl flex items-center justify-center" style={{
                                            borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0
                                        }}>
                                            <Image
                                                src="/booking/qr/Frame 1000001244.png"
                                                alt="QR Code"
                                                width={80}
                                                height={224}
                                                className="w-full h-[90%] object-contain"
                                            />
                                        </div>

                                        {/* Event Header */}
                                        <div className="flex items-center gap-3.5 mb-5">
                                            <div className={`w-11 h-11 rounded-full border-2 overflow-hidden flex-shrink-0 bg-gray-800 ${booking.status === 'CANCELLED' ? 'border-[#FF4444]' : 'border-[#14FFEC]'
                                                }`}>
                                                <Image
                                                    src={booking.image}
                                                    alt={booking.title}
                                                    width={44}
                                                    height={44}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-white text-sm font-bold font-['Manrope'] leading-tight tracking-wide">
                                                {booking.title}
                                            </h3>
                                            {booking.status === 'CANCELLED' && (
                                                <span className="ml-auto px-2 py-1 bg-[#FF4444]/20 text-[#FF4444] text-xs font-bold rounded">
                                                    CANCELLED
                                                </span>
                                            )}
                                        </div>

                                        {/* Event Details */}
                                        <div className="space-y-3">
                                            {/* Venue */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.125rem] h-[1.125rem] flex-shrink-0">
                                                    <Image
                                                        src="/booking/card-icons/MapPin (1).svg"
                                                        alt="Location"
                                                        width={18}
                                                        height={18}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-white text-xs font-semibold font-['Manrope'] leading-4">
                                                    {booking.venue}
                                                </span>
                                            </div>

                                            {/* Date & Time */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.125rem] h-[1.125rem] flex-shrink-0">
                                                    <Image
                                                        src="/booking/card-icons/CalendarBlank (1).svg"
                                                        alt="Date"
                                                        width={18}
                                                        height={18}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-white text-xs font-semibold font-['Manrope'] leading-4">
                                                    {booking.date} | {booking.time}
                                                </span>
                                            </div>

                                            {/* Dress Code */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.125rem] h-[1.125rem] flex-shrink-0">
                                                    <Image
                                                        src="/booking/card-icons/TShirt.svg"
                                                        alt="Dress Code"
                                                        width={18}
                                                        height={18}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-white text-xs font-semibold font-['Manrope'] leading-4">
                                                    Dress Code - {booking.dressCode}
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.125rem] h-[1.125rem] flex-shrink-0">
                                                    <Image
                                                        src="/booking/card-icons/Ticket.svg"
                                                        alt="Ticket"
                                                        width={18}
                                                        height={18}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-white text-xs font-semibold font-['Manrope'] leading-4">
                                                    Ticket Price - {booking.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}