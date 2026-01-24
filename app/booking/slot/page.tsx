'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Minus, ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { EventCardRow } from "@/components/events/event-card-row";
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

// Generate dates for the calendar (7 days at a time)
const generateDates = (startDate: Date = new Date()) => {
    const dates = [];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        dates.push({
            date: date.getDate(),
            day: dayNames[date.getDay()],
            isToday: date.toDateString() === new Date().toDateString(),
            fullDate: date,
        });
    }

    return dates;
};

export default function SlotPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [guestCount, setGuestCount] = useState(2);
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState('');
    const [showAllSlots, setShowAllSlots] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [weekStartDate, setWeekStartDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [clubData, setClubData] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [offersLoading, setOffersLoading] = useState(false);

    const dates = generateDates(weekStartDate);
    const clubId = searchParams.get('clubId') || '697499d433c602133f2a28b7';

    // Get event data from URL params
    const eventDataStr = searchParams.get('eventData');
    const eventData = eventDataStr ? JSON.parse(decodeURIComponent(eventDataStr)) : null;
    const isEvent = eventData ? true : false;

    // Fetch time slots for a week
    const fetchTimeSlots = async (startDate: Date) => {
        try {
            setLoading(true);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            const start = startDate.toISOString().split('T')[0];
            const end = endDate.toISOString().split('T')[0];

            const response = await api.get(
                `/ticket/club-tickets/clubs/${clubId}/time-slots?startDate=${start}&endDate=${end}`
            );

            if (response.data?.dateSlots) {
                setTimeSlots(response.data.dateSlots);
            }
        } catch (error: any) {
            console.error('Failed to fetch time slots:', error);
            toast({
                title: 'Error',
                description: 'Failed to load time slots',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch club events
    const fetchClubEvents = async () => {
        try {
            setEventsLoading(true);
            const response = await api.get(
                `/event-management/events/club/${clubId}?page=0&size=20&sortBy=startDateTime&sortOrder=asc`
            );

            if (response.data?.content) {
                setEvents(response.data.content.filter((evt: any) => !evt.pastEvent));
            }
        } catch (error: any) {
            console.error('Failed to fetch events:', error);
        } finally {
            setEventsLoading(false);
        }
    };

    // Fetch offers for selected date
    const fetchOffers = async (selectedDateObj?: any) => {
        try {
            setOffersLoading(true);
            const dateToUse = selectedDateObj || dates[selectedDate];
            const dateStr = dateToUse.fullDate.toISOString().split('T')[0];

            const response = await api.get(
                `/pricing-offers/pricing-offers/clubs/${clubId}/offers?date=${dateStr}`
            );

            if (response.data) {
                setOffers(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch offers:', error);
        } finally {
            setOffersLoading(false);
        }
    };

    // Fetch club details
    const fetchClubDetails = async () => {
        try {
            const response = await api.get(`/club-management/clubs/details/${clubId}`);
            if (response.data) {
                setClubData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch club details:', error);
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (!isEvent) {
            fetchTimeSlots(weekStartDate);
            fetchClubEvents();
            fetchClubDetails();
        }
    }, [clubId, weekStartDate, isEvent]);

    // Fetch offers when date or time changes
    useEffect(() => {
        if (!isEvent && selectedTime) {
            fetchOffers();
        }
    }, [selectedDate, selectedTime]);

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
        setSelectedTime(''); // Reset selected time when date changes
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(weekStartDate);
        nextWeek.setDate(weekStartDate.getDate() + 7);
        setWeekStartDate(nextWeek);
        setSelectedDate(0);
        setSelectedTime('');
    };

    const handlePreviousWeek = () => {
        const prevWeek = new Date(weekStartDate);
        prevWeek.setDate(weekStartDate.getDate() - 7);
        const today = new Date();

        // Don't go before today
        if (prevWeek >= today) {
            setWeekStartDate(prevWeek);
            setSelectedDate(0);
            setSelectedTime('');
        }
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
            clubId,
            guestCount,
            selectedDate: dates[selectedDate].fullDate.toISOString().split('T')[0],
            selectedTime: isEvent ? eventData?.eventTime : selectedTime,
            selectedOffer,
            isEvent,
            eventDetails: isEvent ? eventData : null,
        };

        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Navigate to pre-booking page instead of table selection
        router.push('/booking/form');
    };

    // Get time slots for selected date
    const getTimeSlotsForDate = () => {
        const selectedDateStr = dates[selectedDate]?.fullDate.toISOString().split('T')[0];
        const dateSlot = timeSlots.find((slot: any) => slot.date === selectedDateStr);

        if (!dateSlot?.timeSlots) return [];

        return dateSlot.timeSlots
            .filter((slot: any) => slot.isAvailable)
            .map((slot: any) => {
                // Convert 24-hour time to 12-hour format
                const [hours, minutes] = slot.time.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

                return {
                    time: `${displayHour}:${minutes} ${ampm}`,
                    rawTime: slot.time,
                    available: slot.isAvailable,
                    offerCount: slot.availableOffers || 0,
                };
            });
    };

    const displayedTimeSlots = showAllSlots
        ? getTimeSlotsForDate()
        : getTimeSlotsForDate().slice(0, 8);

    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            <PageHeader title={isEvent ? eventData?.clubName : (clubData?.name || "Club Booking")} />

            {/* Main Content */}
            <div className="pt-[18vh] px-[2vw] pb-[12vh] flex flex-col items-center gap-6">
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
                                onClick={decrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Minus size={18} className="text-white" />
                            </button>
                            <div className="w-[12.75rem] h-[2.9375rem] bg-[#0D1F1F] rounded-[1.375rem] flex items-center justify-center">
                                <span className="text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.01rem]">
                                    {guestCount}
                                </span>
                            </div>
                            <button
                                onClick={incrementGuest}
                                className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center"
                            >
                                <Plus size={18} className="text-white" />
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
                        <div className="w-full overflow-x-auto scrollbar-hide relative">
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

                        {loading ? (
                            <div className="w-full h-[14vh] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                            </div>
                        ) : displayedTimeSlots.length === 0 ? (
                            <div className="w-full h-[14vh] flex items-center justify-center">
                                <p className="text-white/60 text-sm">No slots available for this date</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-[18vh] flex flex-col items-center gap-1.5">
                                <div className="w-full overflow-hidden px-[2vw]">
                                    <div className="grid grid-cols-4 gap-2 justify-items-center">
                                        {displayedTimeSlots.map((slot: any, idx: number) => (
                                            <button
                                                key={slot.time + idx}
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
                                                        {slot.offerCount} Offer{slot.offerCount > 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {getTimeSlotsForDate().length > 8 && (
                                    <button
                                        onClick={() => setShowAllSlots(!showAllSlots)}
                                        className="flex items-center gap-[0.1375rem] mt-2"
                                    >
                                        <div className="text-white text-sm font-['Manrope'] font-medium leading-4 tracking-[0.007rem]">
                                            {showAllSlots ? 'Show less' : 'View all slots'}
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`text-white transition-transform ${showAllSlots ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Events Section - Below time slots */}
                {!isEvent && events.length > 0 && (
                    <div className="w-full max-w-[25rem] mt-6">
                        <div className="w-full flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold">
                                Events
                            </h3>
                            <Link href={`/events?clubId=${clubId}`} className="text-[#14FFEC] text-sm font-medium">
                                View All
                            </Link>
                        </div>

                        {eventsLoading ? (
                            <div className="w-full h-[200px] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto scrollbar-hide">
                                <div className="flex gap-4 pb-2 pl-2">
                                    {events
                                        .filter((event: any) => {
                                            // Filter events by selected date
                                            const eventDate = new Date(event.startDateTime);
                                            const selectedFullDate = dates[selectedDate].fullDate;
                                            return eventDate.toDateString() === selectedFullDate.toDateString();
                                        })
                                        .slice(0, 5)
                                        .map((event: any) => (
                                            <EventCardRow
                                                key={event.id}
                                                event={{
                                                    ...event,
                                                    location: event.location || event.clubName
                                                }}
                                            />
                                        ))}
                                </div>
                                {events.filter((event: any) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const selectedFullDate = dates[selectedDate].fullDate;
                                    return eventDate.toDateString() === selectedFullDate.toDateString();
                                }).length === 0 && (
                                        <div className="w-full h-[100px] flex items-center justify-center">
                                            <p className="text-[#FFFEFF] text-sm font-['Manrope'] font-semibold">
                                                No DJ available
                                            </p>
                                        </div>
                                    )}
                            </div>
                        )}
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

                            {offersLoading ? (
                                <div className="w-full flex items-center justify-center py-4">
                                    <Loader2 className="w-6 h-6 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : offers.length === 0 ? (
                                <div className="w-full text-center py-4">
                                    <p className="text-[#C6C6C6] text-sm font-['Manrope']">No offers available</p>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col gap-3">
                                    {offers.map((offer: any, idx: number) => (
                                        <div
                                            key={offer.id}
                                            onClick={() => handleOfferSelect(offer.id)}
                                            className={
                                                `w-full h-[4.5625rem] px-4 pr-[1.3125rem] relative bg-[rgba(13,31,31,0.2)] rounded-[0.625rem] flex flex-col justify-center items-start overflow-hidden cursor-pointer transition-all duration-200 ` +
                                                (selectedOffer === offer.id
                                                    ? 'border-1 border-[#14FFEC] shadow-[0_0_12px_3px_rgba(20,255,236,0.18)] bg-[rgba(3,134,123,0.08)]'
                                                    : 'shadow-[0px_0px_6px_1px_rgba(255,255,255,0.18)] hover:bg-[rgba(13,31,31,0.4)]')
                                            }
                                        >
                                            <div className="w-full flex items-start gap-[0.625rem] flex-wrap">
                                                <div className="w-[1.3125rem] h-[1.3125rem] rounded-full border-2 border-[#14FFEC] flex items-center justify-center flex-shrink-0">
                                                    {selectedOffer === offer.id && (
                                                        <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-[#14FFEC]"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col relative z-20 min-w-0">
                                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem] truncate">
                                                        {offer.title}
                                                    </div>
                                                    <div className="text-white text-[0.8125rem] font-['Manrope'] font-medium leading-4 tracking-[0.03125rem] mt-1 truncate">
                                                        {offer.offerType === 'PERCENTAGE_DISCOUNT'
                                                            ? `${offer.discountPercentage}% off`
                                                            : `₹${offer.discountAmount} off`} | {offer.description}
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Continue Button */}
            <BottomContinueButton
                text="Continue"
                onClick={handleContinue}
                disabled={!isEvent && !selectedTime}
            />
        </div>
    );
}
