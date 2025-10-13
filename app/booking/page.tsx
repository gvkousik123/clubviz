'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { BookingService } from '@/lib/services/booking.service';
import { Table } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');
    const eventId = searchParams.get('eventId');

    const [guests, setGuests] = useState(4);
    const [selectedDate, setSelectedDate] = useState('04');
    const [selectedTime, setSelectedTime] = useState('18:30 PM');
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const dateScrollRef = useDragScroll();

    // Fetch available tables when parameters change
    useEffect(() => {
        const fetchAvailableTables = async () => {
            if (!clubId) return;

            setLoading(true);
            try {
                // Format date and time for API (you may need to adjust this based on your API requirements)
                const bookingDate = `2024-01-${selectedDate}`;
                const bookingTime = selectedTime.replace(' PM', '').replace(' AM', '');
                const dateTime = `${bookingDate}T${bookingTime}:00`;

                const response = await BookingService.getAvailableTables(
                    clubId,
                    dateTime,
                    guests
                );

                if (response.success && response.data) {
                    setAvailableTables(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch tables');
                }
            } catch (error) {
                console.error('Error fetching available tables:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch available tables. Please try again.",
                    variant: "destructive",
                });
                setAvailableTables([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableTables();
    }, [clubId, selectedDate, selectedTime, guests]);

    const handleGoBack = () => {
        router.back();
    };

    const handleGuestChange = (increment: boolean) => {
        if (increment) {
            setGuests(guests + 1);
        } else if (guests > 1) {
            setGuests(guests - 1);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleSelectTable = () => {
        router.push('/booking/table-selection');
    };

    const handleContinue = () => {
        if (!clubId) {
            toast({
                title: "Error",
                description: "Club ID is missing. Please go back and select a club.",
                variant: "destructive",
            });
            return;
        }

        // Pass booking details to table selection page
        const bookingParams = new URLSearchParams({
            clubId,
            date: `2024-01-${selectedDate}`,
            time: selectedTime,
            guests: guests.toString(),
            ...(eventId && { eventId })
        });

        router.push(`/booking/table-selection?${bookingParams.toString()}`);
    };

    // Date options
    const dateOptions = [
        { day: 'SUN', date: '01' },
        { day: 'MON', date: '02' },
        { day: 'TUE', date: '03' },
        { day: 'TODAY', date: '04' },
        { day: 'THUR', date: '05' },
        { day: 'FRI', date: '06' },
    ];

    // Time slots with offers
    const timeSlots = [
        { time: '18:00 PM', offers: '1 Offer' },
        { time: '18:30 PM', offers: '1 Offer' },
        { time: '19:00 PM', offers: '1 Offer' },
        { time: '19:30 PM', offers: '1 Offer' },
        { time: '20:00 PM', offers: '1 Offer' },
        { time: '20:30 PM', offers: '1 Offer' },
        { time: '21:00 PM', offers: '1 Offer' },
        { time: '21:30 PM', offers: '1 Offer' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        DABO CLUB & KITCHEN
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-8">
                {/* Guest Selection */}
                <div className="space-y-4">
                    <h2 className="text-white font-medium text-lg">Guest</h2>
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => handleGuestChange(false)}
                            className="w-12 h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                        >
                            <Minus size={20} className="text-white" />
                        </button>
                        <span className="text-white text-3xl font-bold">{guests}</span>
                        <button
                            onClick={() => handleGuestChange(true)}
                            className="w-12 h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                        >
                            <Plus size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                    <h2 className="text-white font-medium text-lg">Select Date</h2>
                    <div ref={dateScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide"
                        style={{ cursor: 'grab' }}>
                        {dateOptions.map((option) => (
                            <button
                                key={option.date}
                                onClick={() => handleDateSelect(option.date)}
                                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-full transition-all duration-300 ${selectedDate === option.date
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-[#222831] text-white/70 hover:bg-[#2a2a38]'
                                    }`}
                            >
                                <span className="text-xs font-medium">{option.day}</span>
                                <span className="text-lg font-bold">{option.date}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                    <h2 className="text-white font-medium text-lg">Select Time</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.time}
                                onClick={() => handleTimeSelect(slot.time)}
                                className={`p-4 rounded-2xl transition-all duration-300 ${selectedTime === slot.time
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-[#222831] text-white hover:bg-[#2a2a38]'
                                    }`}
                            >
                                <div className="font-bold text-sm">{slot.time}</div>
                                <div className="text-teal-400 text-xs font-medium">{slot.offers}</div>
                            </button>
                        ))}
                    </div>

                    {/* View All Slots */}
                    <div className="text-center pt-2">
                        <button className="text-white font-medium text-sm flex items-center gap-1 mx-auto">
                            View all slots
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Booking Offers */}
                {selectedTime === '18:30 PM' && (
                    <div className="space-y-4">
                        <h2 className="text-white font-medium text-lg">Booking offers for {selectedTime}</h2>
                        <div className="bg-[#222831] rounded-2xl p-4 border border-teal-400/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full border-2 border-teal-400"></div>
                                <div>
                                    <p className="text-white font-medium">20% off on the total bill 19:00 PM</p>
                                    <p className="text-white/70 text-sm">20% off on the total bill 19:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Tables Info */}
                {clubId && (
                    <div className="space-y-4">
                        <h2 className="text-white font-medium text-lg">Table Availability</h2>
                        <div className="p-4 bg-[#222831] rounded-2xl">
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
                                    <span className="ml-2 text-white/70">Checking availability...</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-white font-medium">
                                        {availableTables.length} tables available
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        for {guests} guests on selected date & time
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div className="pt-4">
                    {selectedTime === '18:30 PM' ? (
                        <button
                            onClick={handleSelectTable}
                            disabled={loading || (!!clubId && availableTables.length === 0)}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                        >
                            {loading ? 'Checking...' : availableTables.length === 0 && clubId ? 'No Tables Available' : 'Select Table'}
                        </button>
                    ) : (
                        <button
                            onClick={handleContinue}
                            disabled={loading || (!!clubId && availableTables.length === 0)}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                        >
                            {loading ? 'Checking...' : availableTables.length === 0 && clubId ? 'No Tables Available' : 'Continue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}