'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/common/page-header';
import Image from 'next/image';

interface BookingItem {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    dressCode: string;
    price: string;
    image: string;
}

const mockUpcomingBookings: BookingItem[] = [
    {
        id: '1',
        title: 'New Year Bash',
        venue: 'Raasta club & fine dine',
        date: '31st Dec',
        time: '7:00 pm',
        dressCode: 'Funky Pop',
        price: '₹ 3500',
        image: '/dabo ambience main dabo page/Media.jpg'
    },
    {
        id: '2',
        title: 'The Red Room',
        venue: 'Hitchki, Nagpur',
        date: '24 Dec',
        time: '7:00 pm',
        dressCode: '----------',
        price: '₹ 3500',
        image: '/dabo ambience main dabo page/Media-1.jpg'
    }
];

const mockPastBookings: BookingItem[] = [
    {
        id: '3',
        title: 'Sunday Soiree',
        venue: 'Dabo club & kitchen, Nagpur',
        date: '04th Jan',
        time: '7:00 pm',
        dressCode: 'Black',
        price: '₹ 3500',
        image: '/dabo ambience main dabo page/Media-2.jpg'
    },
    {
        id: '4',
        title: 'Sunday Serenade',
        venue: 'Cafe Barrel, Nagpur',
        date: '21st Dec',
        time: '7:00 pm',
        dressCode: '-----------',
        price: '₹ 3500',
        image: '/dabo ambience main dabo page/Media-3.jpg'
    }
];

export default function BookingPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const currentBookings = activeTab === 'upcoming' ? mockUpcomingBookings : mockPastBookings;

    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            <PageHeader title="MY BOOKINGS" />

            {/* Tab Navigation */}
            <div className="px-4 py-6">
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

            {/* Bookings List */}
            <div className="px-4">
                <div className="flex flex-col justify-start items-end gap-1 max-h-[30.875rem] overflow-y-auto">
                    {currentBookings.map((booking) => (
                        <div key={booking.id} className="w-full relative mb-4">
                            {/* Ticket Card with proper cuts */}
                            <div className="relative w-full rounded-2xl overflow-visible">
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
                                            <div className="w-11 h-11 rounded-full border-2 border-[#14FFEC] overflow-hidden flex-shrink-0 bg-gray-800">
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}