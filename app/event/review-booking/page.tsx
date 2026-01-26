'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Mail, Phone, Plus, Minus, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { TicketService } from '@/lib/services/ticket.service';
import { EventService } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';

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
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Get all params from URL
    const eventId = searchParams.get('eventId') || '';
    const ticketType = searchParams.get('ticketType') || 'early';
    const maleStag = parseInt(searchParams.get('maleStag') || '0');
    const femaleStag = parseInt(searchParams.get('femaleStag') || '0');
    const couple = parseInt(searchParams.get('couple') || '0');
    const maleName = searchParams.get('maleName') || '';
    const femaleName = searchParams.get('femaleName') || '';
    const stagName = searchParams.get('stagName') || '';
    const phone = searchParams.get('phone') || '';
    const email = searchParams.get('email') || '';

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    // Apply the scrollbar-hide style
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = scrollbarHideStyle;
        document.head.appendChild(style);

        if (eventId) {
            loadEventData();
        }

        return () => {
            document.head.removeChild(style);
        };
    }, [eventId]);

    const loadEventData = async () => {
        try {
            setLoading(true);
            const response = await EventService.getEventById(eventId);
            if (response.success && response.data) {
                setEventData(response.data);
            }
        } catch (error) {
            console.error('Failed to load event:', error);
            toast({
                title: 'Error',
                description: 'Failed to load event details',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

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
        setIsCreatingTicket(true);
        try {
            // Prepare ticket data with eventId
            const selectedTickets = [];
            if (maleStag > 0) {
                selectedTickets.push({
                    ticketTypeId: `${ticketType}-male-stag`,
                    ticketTypeName: `${ticketType === 'early' ? 'Early Bird' : 'General'} Male Stag Entry`,
                    quantity: maleStag,
                    price: ticketType === 'early' ? 1500 : 2000
                });
            }
            if (femaleStag > 0) {
                selectedTickets.push({
                    ticketTypeId: `${ticketType}-female-stag`,
                    ticketTypeName: `${ticketType === 'early' ? 'Early Bird' : 'General'} Female Stag Entry`,
                    quantity: femaleStag,
                    price: ticketType === 'early' ? 0 : 2000
                });
            }
            const ticketData = {
                eventId: eventId, // CRITICAL: Pass eventId for event tickets
                clubId: eventData?.club?.id || eventData?.clubId || '',
                clubName: eventData?.club?.name || eventData?.venue || '',
                userId: 'current-user-id', // TODO: Get from auth context
                userEmail: email,
                userName: maleName || stagName || 'Guest',
                userPhone: phone,
                bookingDate: eventData?.date || new Date().toISOString().split('T')[0],
                arrivalTime: eventData?.time || '19:00:00', // 24-hour format HH:mm:ss
                maleCount: maleStag,
                femaleCount: femaleStag,
                coupleCount: couple,
                offerId: offerId || null,
                occasion: eventData?.title || 'Event',
                floorPreference: 'General'
            };

            console.log('🎟️ Creating EVENT ticket with eventId:', eventId);
            console.log('📤 Ticket data:', ticketData);

            const response = await TicketService.createEventTicket(ticketData);

            if (response.success && response.data) {
                console.log('✅ Event ticket created:', response.data);
                toast({
                    title: 'Success!',
                    description: 'Ticket created successfully',
                });

                // Store full ticket response in sessionStorage
                sessionStorage.setItem('ticketResponse', JSON.stringify(response.data));
                // Navigate to confirmation page
                router.push(`/event/confirm-booking?ticketId=${response.data.ticketId}`);
            }
        } catch (error: any) {
            console.error('❌ Failed to create event ticket:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create ticket',
                variant: 'destructive',
            });
        } finally {
            setIsCreatingTicket(false);
        }
    };

    if (loading) {
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
                {/* Club Details Section */}
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
                                disabled={isCreatingTicket}
                                className="w-full h-full flex justify-center items-center disabled:opacity-50"
                            >
                                {isCreatingTicket ? (
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
