'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Mail, Phone, Plus, Minus, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { TicketService } from '@/lib/services/ticket.service';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/use-payment';

// Add custom CSS for hiding scrollbar while keeping functionality
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

function ReviewBookingPageContent() {
    const router = useRouter();
    const { toast } = useToast();
    const { quickPay, loading: paymentLoading } = usePayment();

    // Get data from sessionStorage
    const [bookingData, setBookingData] = useState<any>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    const eventId = bookingData?.eventId || '';
    const ticketType = bookingData?.ticketType || 'early';
    const maleStag = bookingData?.maleStag || 0;
    const femaleStag = bookingData?.femaleStag || 0;
    const couple = bookingData?.couple || 0;
    const maleName = bookingData?.maleName || '';
    const femaleName = bookingData?.femaleName || '';
    const stagName = bookingData?.stagName || '';
    const phone = bookingData?.phone || '';
    const email = bookingData?.email || '';
    const eventData = bookingData?.eventData || null;

    // Load booking data from sessionStorage
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = scrollbarHideStyle;
        document.head.appendChild(style);

        const savedData = sessionStorage.getItem('eventBookingData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                setBookingData(data);
            } catch (error) {
                console.error('Failed to parse booking data:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load booking data',
                    variant: 'destructive',
                });
                router.push('/events');
            }
        } else {
            toast({
                title: 'Error',
                description: 'No booking data found',
                variant: 'destructive',
            });
            router.push('/events');
        }

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const calculateTotalAmount = () => {
        const prices = ticketType === 'early' ? {
            maleStag: 1500,
            femaleStag: 0,
            couple: 0
        } : {
            maleStag: 2000,
            femaleStag: 2000,
            couple: 2000
        };

        return (maleStag * prices.maleStag) + (femaleStag * prices.femaleStag) + (couple * prices.couple);
    };

    const handlePayment = async () => {
        const totalAmount = calculateTotalAmount();

        // Store booking data for after payment
        const ticketBookingData = {
            eventId,
            ticketType,
            maleStag,
            femaleStag,
            couple,
            maleName,
            femaleName,
            stagName,
            phone,
            email,
            totalAmount,
            eventData
        };
        sessionStorage.setItem('pendingEventBooking', JSON.stringify(ticketBookingData));

        // Format mobile number - remove country code and special characters
        const mobile = phone.replace(/[^0-9]/g, '').slice(-10); // Get last 10 digits

        // Initiate payment
        await quickPay(totalAmount, {
            username: maleName || stagName || 'Guest',
            email: email,
            mobile: mobile || '9876543210' // Use fallback if mobile is not available
        });
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Main Content - Scrollable */}
            <div className="pt-[20vh] pb-24 h-screen overflow-y-auto scrollbar-hide">
                {/* Event Details Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Event Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="/common/MaskHappy.svg" alt="Event" width="24" height="24" />
                            <p className="text-white font-['Manrope'] font-medium">{eventData?.title || 'Event'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{eventData?.venue || 'Venue'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{eventData?.date || 'Date'} | {eventData?.time || 'Time'}</p>
                        </div>
                    </div>
                </div>

                {/* Send Details To Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Contact Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{email}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{phone}</p>
                        </div>
                    </div>
                </div>

                {/* Selected Ticket Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Selected Tickets</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        {/* Male Stag */}
                        {maleStag > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                    <p className="text-white font-['Manrope'] font-medium">{ticketType === 'early' ? 'Early Bird' : 'General'} Male Stag</p>
                                </div>
                                <span className="text-white font-['Manrope'] font-bold">×{maleStag}</span>
                            </div>
                        )}

                        {/* Female Stag */}
                        {femaleStag > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                    <p className="text-white font-['Manrope'] font-medium">{ticketType === 'early' ? 'Early Bird' : 'General'} Female Stag</p>
                                </div>
                                <span className="text-white font-['Manrope'] font-bold">×{femaleStag}</span>
                            </div>
                        )}

                        {/* Couple */}
                        {couple > 0 && (
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                    <p className="text-white font-['Manrope'] font-medium">{ticketType === 'early' ? 'Early Bird' : 'General'} Couple</p>
                                </div>
                                <span className="text-white font-['Manrope'] font-bold">×{couple}</span>
                            </div>
                        )}

                        {/* Dotted line */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                        {/* Total Tickets */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">Total Tickets</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">{maleStag + femaleStag + couple}</span>
                        </div>

                        {/* Dotted line */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                        {/* No. of people attending */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">People Attending</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">{maleStag + femaleStag + (couple * 2)}</span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-4 mb-28">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        <p className="text-white font-['Manrope'] text-sm opacity-80">
                            Check-in before 8:00 PM is recommended for guaranteed entry and the best experience. After 8:00 PM, entry will be subject to venue capacity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Payment Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[100px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-between items-center px-8 h-full">
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-['Manrope'] opacity-80">PAY:</span>
                            <span className="text-white text-2xl font-['Manrope'] font-bold">₹ {calculateTotalAmount()}</span>
                        </div>
                        <div className="w-[160px] h-[55px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading || isCreatingTicket}
                                className="w-full h-full flex justify-center items-center disabled:opacity-50"
                            >
                                {(paymentLoading || isCreatingTicket) ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <span className="text-center text-white text-[18px] font-['Manrope'] font-bold tracking-[0.05px]">
                                        Click to pay
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReviewBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <ReviewBookingPageContent />
        </Suspense>
    );
}
