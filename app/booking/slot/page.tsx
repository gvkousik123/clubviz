'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';

// Generate dates for the calendar
const generateDates = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 21; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        dates.push({
            date: date.getDate(),
            day: dayNames[date.getDay()],
            isToday: i === 0,
            fullDate: date,
        });
    }

    return dates;
};

export default function SlotPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [guestCount, setGuestCount] = useState(2);
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState('');
    const [showAllSlots, setShowAllSlots] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const dates = generateDates();

    // Get event data from URL params
    const eventDataStr = searchParams.get('eventData');
    const eventData = eventDataStr ? JSON.parse(decodeURIComponent(eventDataStr)) : null;
    const isEvent = eventData ? true : false;

    const handleGoBack = () => {
        router.back();
    };

    const incrementGuest = () => {
        if (guestCount < 10) {
            setGuestCount(guestCount + 1);
        }
    };

    const decrementGuest = () => {
        if (guestCount > 1) {
            setGuestCount(guestCount - 1);
        }
    };

    const handleDateSelect = (index: number) => {
        setSelectedDate(index);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleOfferSelect = (offerId: string) => {
        setSelectedOffer(selectedOffer === offerId ? null : offerId);
    };

    const handleContinue = () => {
        // Save booking state to sessionStorage for next steps
        const bookingData = {
            clubId: searchParams.get('clubId'),
            guestCount,
            selectedDate: dates[selectedDate].fullDate.toISOString().split('T')[0],
            selectedTime: isEvent ? eventData?.eventTime : selectedTime,
            selectedOffer,
            isEvent,
            eventDetails: isEvent ? eventData : null,
        };

        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Navigate to next step in booking flow
        router.push('/booking/table-selection');
    };

    // Static time slots for restaurant mode
    const staticTimeSlots = [
        { time: '18:00 PM', available: true, offerCount: 0, offers: [] },
        { time: '18:30 PM', available: true, offerCount: 1, offers: [] },
        { time: '19:00 PM', available: true, offerCount: 1, offers: [] },
        { time: '19:30 PM', available: true, offerCount: 0, offers: [] },
        { time: '20:00 PM', available: true, offerCount: 1, offers: [] },
        { time: '20:30 PM', available: true, offerCount: 1, offers: [] },
        { time: '21:00 PM', available: true, offerCount: 1, offers: [] },
        { time: '21:30 PM', available: true, offerCount: 1, offers: [] },
        { time: '22:00 PM', available: true, offerCount: 1, offers: [] },
        { time: '22:30 PM', available: true, offerCount: 1, offers: [] },
        { time: '23:00 PM', available: true, offerCount: 1, offers: [] },
        { time: '23:30 PM', available: true, offerCount: 1, offers: [] }
    ];

    const displayedTimeSlots = showAllSlots ? staticTimeSlots : staticTimeSlots.slice(0, 8);

    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            <PageHeader title={isEvent ? eventData?.clubName : "DABO CLUB & KITCHEN"} />

            {/* Main Content */}
            <div className="pt-[18vh] px-[2vw] pb-[8vh] flex flex-col items-center gap-6">
                {/* Guest Selection - Only for restaurant mode */}
                {!isEvent && (
                    <div className="w-full max-w-[22.625rem] flex flex-col items-center gap-5">
                        <div className="w-full flex items-center gap-[0.9375rem]">
                            <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                Guest
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={incrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Plus size={18} className="text-white" />
                            </button>
                            <div className="w-[12.75rem] h-[2.9375rem] bg-[#0D1F1F] rounded-[1.375rem] flex items-center justify-center">
                                <span className="text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.01rem]">
                                    {guestCount}
                                </span>
                            </div>
                            <button
                                onClick={decrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Minus size={18} className="text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Date Selection - Only for restaurant mode */}
                {!isEvent && (
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="w-full max-w-[22.625rem] flex items-center gap-[0.9375rem]">
                            <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                Select Date
                            </div>
                        </div>
                        <div className="w-full overflow-x-auto scrollbar-hide">
                            <div className="flex items-center gap-3 px-4 min-w-max">
                                {dates.map((dateItem, index) => {
                                    const isWeekend = dateItem.day === 'SUN' || dateItem.day === 'FRI' || dateItem.day === 'SAT';
                                    const cardBgColor = isWeekend ? '#03867B' : '#0D1F1F';

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateSelect(index)}
                                            className="relative flex-shrink-0"
                                        >
                                            {selectedDate === index ? (
                                                <div className="w-[3.25rem] h-[5.5rem] relative">
                                                    <div className="absolute inset-0 bg-[#14FFEC] rounded-[1.875rem]">
                                                        {dateItem.isToday && (
                                                            <div className="absolute inset-x-0 top-[1.125rem] text-center text-black text-[0.75rem] font-['Manrope'] font-bold leading-5 tracking-[0.0075rem]">
                                                                TODAY
                                                            </div>
                                                        )}
                                                        {!dateItem.isToday && (
                                                            <div className="absolute inset-x-0 top-[1.125rem] text-center text-black text-[0.75rem] font-['Manrope'] font-medium leading-5 tracking-[0.0075rem]">
                                                                {dateItem.day}
                                                            </div>
                                                        )}
                                                        <div className="absolute left-1/2 top-[3rem] transform -translate-x-1/2 w-9 h-9 rounded-full bg-[#021313] flex items-center justify-center">
                                                            <span className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.00875rem]">
                                                                {String(dateItem.date).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-[3.25rem] h-[5.5rem] relative" style={{ backgroundColor: cardBgColor, borderRadius: '1.875rem' }}>
                                                    <div className="absolute left-[0.6875rem] top-[1.125rem] text-white text-[0.75rem] font-['Manrope'] font-medium leading-5 tracking-[0.0075rem]">
                                                        {dateItem.day}
                                                    </div>
                                                    <div className="absolute left-[0.875rem] top-[3.125rem] w-7 h-7 rounded-full bg-[#021313] flex items-center justify-center">
                                                        <span className="text-white text-[0.875rem] font-['Manrope'] font-medium leading-5 tracking-[0.00875rem]">
                                                            {String(dateItem.date).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Event Details - For event mode */}
                {isEvent && (
                    <div className="w-full max-w-[25rem]">
                        <div className="w-full bg-[#0D1F1F] rounded-[1.375rem] p-4 border border-[#14FFEC]">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Event</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {eventData?.eventTitle}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Date & Time</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {eventData?.eventDate} | {eventData?.eventTime}
                                    </p>
                                </div>
                                {eventData?.entryFee > 0 && (
                                    <div>
                                        <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium">Entry Fee</p>
                                        <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                            ₹{eventData?.entryFee} per person
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Guest Count for Events */}
                {isEvent && (
                    <div className="w-full max-w-[22.625rem] flex flex-col items-center gap-5">
                        <div className="w-full flex items-center gap-[0.9375rem]">
                            <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                Guest
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={incrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Plus size={18} className="text-white" />
                            </button>
                            <div className="w-[12.75rem] h-[2.9375rem] bg-[#0D1F1F] rounded-[1.375rem] flex items-center justify-center">
                                <span className="text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.01rem]">
                                    {guestCount}
                                </span>
                            </div>
                            <button
                                onClick={decrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Minus size={18} className="text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Time Selection - Only for restaurant mode */}
                {!isEvent && (
                    <div className="w-full max-w-[25rem] flex flex-col items-center gap-5">
                        <div className="w-full max-w-[22.625rem] flex items-center gap-[0.9375rem]">
                            <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                Select Time
                            </div>
                        </div>
                        <div className="w-full h-[18vh] flex flex-col items-center gap-1.5">
                            <div className="w-full h-[14vh] overflow-hidden px-[2vw]">
                                <div className="grid grid-cols-4 gap-2 justify-items-center">
                                    {displayedTimeSlots.map((slot: any) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => handleTimeSelect(slot.time)}
                                            disabled={!slot.available}
                                            className={`w-[4.75rem] px-2 py-1.5 rounded-[1.375rem] flex flex-col items-center gap-0.5 transition-colors ${selectedTime === slot.time
                                                    ? 'bg-[#03867B] border border-[#14FFEC]'
                                                    : slot.available
                                                        ? 'bg-[#0D1F1F]'
                                                        : 'bg-[#0D1F1F] opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="text-white text-[0.75rem] font-['Manrope'] font-semibold leading-4 tracking-[0.0075rem]">
                                                {slot.time}
                                            </div>
                                            {slot.offerCount > 0 && (
                                                <div className="text-[#14FFEC] text-[0.6875rem] font-['Manrope'] font-semibold leading-4 tracking-[0.006875rem]">
                                                    1 Offer
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAllSlots(!showAllSlots)}
                                className="flex items-center gap-[0.1375rem]"
                            >
                                <div className="text-white text-sm font-['Manrope'] font-medium leading-4 tracking-[0.007rem]">
                                    View all slots
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={`text-white transition-transform ${showAllSlots ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* Booking Offers Section - Only for restaurant mode */}
                {!isEvent && selectedTime && (
                    <div className="w-full max-w-[25rem] mt-6">
                        <div className="w-full py-5 px-4 bg-[#0D1F1F] rounded-[0.9375rem] flex flex-col items-center gap-5">
                            <div className="w-full flex items-center gap-[0.9375rem]">
                                <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                    Booking offers for {selectedTime}
                                </div>
                            </div>
                            <div
                                onClick={() => handleOfferSelect('offer1')}
                                className={
                                    `w-full h-[4.5625rem] px-4 pr-[1.3125rem] relative bg-[rgba(13,31,31,0.2)] rounded-[0.625rem] flex flex-col justify-center items-start overflow-hidden cursor-pointer transition-all duration-200 ` +
                                    (selectedOffer === 'offer1'
                                        ? 'border-1 border-[#14FFEC] shadow-[0_0_12px_3px_rgba(20,255,236,0.18)] bg-[rgba(3,134,123,0.08)]'
                                        : 'shadow-[0px_0px_6px_1px_rgba(255,255,255,0.18)] hover:bg-[rgba(13,31,31,0.4)]')
                                }
                            >
                                <div className="w-full flex items-start gap-[0.625rem] flex-wrap">
                                    <div className="w-[1.3125rem] h-[1.3125rem] rounded-full border-2 border-[#14FFEC] flex items-center justify-center">
                                        {selectedOffer === 'offer1' && (
                                            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-[#14FFEC]"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col relative z-20">
                                        <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                                            20% off on the total bill {selectedTime}
                                        </div>
                                        <div className="text-white text-[0.8125rem] font-['Manrope'] font-medium leading-4 tracking-[0.03125rem] mt-1">
                                            20% off on the total bill {selectedTime}
                                        </div>
                                    </div>
                                </div>
                                {/* Discount Icon */}
                                <div className="absolute -right-2 top-2 w-20 h-20 flex items-center justify-center opacity-35">
                                    <Image
                                        src="/common/discount.png"
                                        alt="Discount"
                                        width={80}
                                        height={100}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Continue Button */}
            <BottomContinueButton
                text="Select Table"
                onClick={handleContinue}
                disabled={!isEvent && !selectedTime}
            />
        </div>
    );
}
