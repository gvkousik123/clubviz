'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import NumberCounter from '@/components/common/number-counter';
import { BookingService } from '@/lib/services/booking.service';
import type { Table } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

const dateOptions = [
    { day: 'SUN', date: '01' },
    { day: 'MON', date: '02' },
    { day: 'TUE', date: '03' },
    { day: 'TODAY', date: '04' },
    { day: 'THUR', date: '05' },
    { day: 'FRI', date: '06' },
];

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

export default function BookingPageContent() {
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

    useEffect(() => {
        const fetchAvailableTables = async () => {
            if (!clubId) {
                setAvailableTables([]);
                return;
            }

            setLoading(true);
            try {
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
                    title: 'Error',
                    description: 'Failed to fetch available tables. Please try again.',
                    variant: 'destructive',
                });
                setAvailableTables([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableTables();
    }, [clubId, guests, selectedDate, selectedTime]);

    const handleGoBack = () => {
        router.back();
    };

    const handleGuestChange = (guests: number) => {
        setGuests(guests);
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
                title: 'Error',
                description: 'Club ID is missing. Please go back and select a club.',
                variant: 'destructive',
            });
            return;
        }

        const bookingParams = new URLSearchParams({
            clubId,
            date: `2024-01-${selectedDate}`,
            time: selectedTime,
            guests: guests.toString(),
        });

        if (eventId) {
            bookingParams.set('eventId', eventId);
        }

        router.push(`/booking/table-selection?${bookingParams.toString()}`);
    };

    const availableTablesCountLabel = useMemo(() => {
        if (!clubId) {
            return 'Select a club to check availability';
        }
        return `${availableTables.length} tables available`;
    }, [availableTables.length, clubId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="mb-6 flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="rounded-full p-2 transition-all duration-300 hover:bg-white/10"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="mr-10 flex-1 text-center text-lg font-bold tracking-wide">
                        DABO CLUB &amp; KITCHEN
                    </h1>
                </div>
            </div>

            <div className="space-y-8 px-6 py-6">
                <div className="space-y-4">
                    <NumberCounter 
                        value={guests}
                        onChange={handleGuestChange}
                        min={1}
                        max={12}
                        label="Guest"
                        width="w-20"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-white">Select Date</h2>
                    <div ref={dateScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ cursor: 'grab' }}>
                        {dateOptions.map((option) => (
                            <button
                                key={option.date}
                                onClick={() => handleDateSelect(option.date)}
                                className={`flex h-20 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full transition-all duration-300 ${selectedDate === option.date
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

                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-white">Select Time</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.time}
                                onClick={() => handleTimeSelect(slot.time)}
                                className={`rounded-2xl p-4 transition-all duration-300 ${selectedTime === slot.time
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-[#222831] text-white hover:bg-[#2a2a38]'
                                    }`}
                            >
                                <div className="text-sm font-bold">{slot.time}</div>
                                <div className="text-xs font-medium text-teal-400">{slot.offers}</div>
                            </button>
                        ))}
                    </div>
                    <div className="pt-2 text-center">
                        <button className="mx-auto flex items-center gap-1 text-sm font-medium text-white">
                            View all slots
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {selectedTime === '18:30 PM' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-white">Booking offers for {selectedTime}</h2>
                        <div className="rounded-2xl border border-teal-400/30 bg-[#222831] p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full border-2 border-teal-400" />
                                <div>
                                    <p className="font-medium text-white">20% off on the total bill 19:00 PM</p>
                                    <p className="text-sm text-white/70">20% off on the total bill 19:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {clubId && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-white">Table Availability</h2>
                        <div className="rounded-2xl bg-[#222831] p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-teal-400" />
                                    <span className="ml-2 text-sm text-white/70">Checking availability...</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-medium text-white">{availableTablesCountLabel}</p>
                                    <p className="text-sm text-white/70">for {guests} guests on selected date &amp; time</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    {selectedTime === '18:30 PM' ? (
                        <button
                            onClick={handleSelectTable}
                            disabled={loading || (!!clubId && availableTables.length === 0)}
                            className="w-full rounded-2xl bg-teal-600 py-4 font-bold text-white transition-all duration-300 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                        >
                            {loading
                                ? 'Checking...'
                                : availableTables.length === 0 && clubId
                                    ? 'No Tables Available'
                                    : 'Select Table'}
                        </button>
                    ) : (
                        <button
                            onClick={handleContinue}
                            disabled={loading || (!!clubId && availableTables.length === 0)}
                            className="w-full rounded-2xl bg-teal-600 py-4 font-bold text-white transition-all duration-300 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                        >
                            {loading
                                ? 'Checking...'
                                : availableTables.length === 0 && clubId
                                    ? 'No Tables Available'
                                    : 'Continue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
