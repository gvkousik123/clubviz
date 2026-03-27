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

    // Handle back navigation to home instead of previous page
    const handleBackToHome = () => {
        router.push('/home');
    };

    // Get data from sessionStorage
    const [bookingData, setBookingData] = useState<any>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const eventId = bookingData?.eventId || '';
    const tickets = bookingData?.tickets || {};
    const ticketBreakdown = bookingData?.ticketBreakdown || [];
    const totalTickets = bookingData?.totalTickets || 0;
    const totalAmount = bookingData?.totalAmount || 0;
    const userName = bookingData?.userName || '';
    const userPhone = bookingData?.userPhone || '';
    const userEmail = bookingData?.userEmail || '';
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
                console.log('Booking data loaded:', data);
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
            console.log('No booking data in sessionStorage');
            toast({
                title: 'Error',
                description: 'No booking data found',
                variant: 'destructive',
            });
            router.push('/events');
        }

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, [router, toast]);

    const calculateTotalAmount = () => {
        // Total amount is already calculated in the booking data
        return totalAmount;
    };

    const handlePayment = async () => {
        try {
            setErrorMessage(null);
            console.clear(); // Clear previous logs for clarity

            // Get user data from localStorage
            const userStr = typeof window !== 'undefined' ? localStorage.getItem('clubviz-user') : null;
            let userId = 'ANONYMOUS';
            let userNameFromStorage = '';

            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.id || user.userId || 'ANONYMOUS';
                    userNameFromStorage = user.username || user.userName || user.name || '';
                    console.log('✅ User data from localStorage:', { userId, userNameFromStorage, user });
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }

            // Store contact details in localStorage for persistence across redirects
            if (typeof window !== 'undefined') {
                const contactDetails = {
                    email: userEmail,
                    phone: userPhone,
                    userName: userName,
                    userId,
                    tickets: ticketBreakdown
                };
                localStorage.setItem('bookingContactDetails', JSON.stringify(contactDetails));
                console.log('💾 Stored contact details in localStorage:', contactDetails);
            }

            // Extract club data from event's club object or fallback to user data
            let clubData = { clubId: '', clubName: '' };

            // First try to get from event's club object
            if (eventData?.club) {
                clubData = {
                    clubId: eventData.club.id || eventData.club.clubId || '',
                    clubName: eventData.club.name || eventData.club.clubName || ''
                };
            }

            // If still empty, try event data direct properties
            if (!clubData.clubId) {
                clubData = {
                    clubId: eventData?.clubId || 'CLUB001',
                    clubName: eventData?.clubName || eventData?.venue || 'Event Venue'
                };
            }

            // Get booking date and time from event data
            const bookingDate = eventData?.startDateTime ? new Date(eventData.startDateTime).toISOString().split('T')[0] :
                eventData?.date ? new Date(eventData.date).toISOString().split('T')[0] :
                    new Date().toISOString().split('T')[0];

            const arrivalTime = eventData?.startDateTime ? new Date(eventData.startDateTime).toISOString().split('T')[1].substring(0, 8) :
                eventData?.time || '18:00:00';

            // Store booking data for after payment
            const ticketBookingData = {
                eventId,
                clubId: clubData.clubId,
                clubName: clubData.clubName,
                userId: userId,
                ticketBreakdown: ticketBreakdown,
                totalTickets: totalTickets,
                totalAmount: totalAmount,
                userName: userNameFromStorage || userName || 'Guest',
                userPhone: userPhone,
                userEmail: userEmail,
                bookingDate,
                arrivalTime,
                guestCount: totalTickets,
                ticketDescription: 'Event ticket booking',
                currency: 'INR',
                occasion: 'Event',
                floorPreference: 'Main Floor',
                eventData
            };

            console.log('========== EVENT BOOKING DATA SUMMARY ==========');
            console.log('📋 Event ID:', eventId);
            console.log('💰 Total Amount:', totalAmount);
            console.log('🎟️  Total Tickets:', totalTickets);
            console.log('📊 Ticket Breakdown:', ticketBreakdown);
            console.log('👤 User Info:', { userId, userName: userNameFromStorage || userName, userEmail, userPhone });
            console.log('📅 Booking Details:', { bookingDate, arrivalTime });
            console.log('🏢 Club Info:', clubData);
            console.log('🔵 FULL Ticket Booking Data:', JSON.stringify(ticketBookingData, null, 2));
            console.log('================================================');

            sessionStorage.setItem('pendingEventBooking', JSON.stringify(ticketBookingData));

            // Format mobile number - remove country code and special characters
            const mobile = userPhone.replace(/[^0-9]/g, '').slice(-10); // Get last 10 digits

            console.log('💳 Initiating payment with:');
            console.log('  Amount:', totalAmount);
            console.log('  Username:', userName || 'Guest');
            console.log('  Email:', userEmail);
            console.log('  Mobile:', mobile);

            // Initiate payment with contact info
            const paymentSuccess = await quickPay(totalAmount, {
                username: userName || 'Guest',
                email: userEmail,
                mobile: mobile || '' // Will use fallback in usePayment hook if empty
            });

            if (!paymentSuccess) {
                setErrorMessage('Failed to initiate payment. Please try again.');
                console.error('❌ Payment initiation failed');
            }
        } catch (error: any) {
            console.error('❌ Payment error:', error);
            const errorMsg = error?.message || 'An error occurred. Please try again.';
            setErrorMessage(errorMsg);
            
            // Also show as toast for more visibility
            if (errorMsg.includes('already have an active ticket')) {
                toast({
                    title: '⚠️  Booking Conflict',
                    description: errorMsg,
                    variant: 'destructive'
                });
            }
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    // Provide fallback event data if not loaded
    const displayEventData = eventData || {
        title: 'Event',
        venue: 'Venue',
        date: 'Date',
        time: 'Time'
    };

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            <PageHeader title="REVIEW EVENT BOOKING" onBack={handleBackToHome} />

            {/* Error Message Alert - Enhanced */}
            {errorMessage && (
                <div className="fixed top-[12vh] left-0 right-0 z-50 px-4">
                    <div className="bg-gradient-to-r from-red-900 to-red-800 border-2 border-red-400 text-red-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm flex items-start gap-4">
                        <div className="flex-shrink-0 text-2xl">⚠️</div>
                        <div className="flex-1">
                            <p className="font-['Manrope'] font-bold text-base">Booking Failed</p>
                            <p className="text-red-100 font-['Manrope'] text-sm mt-2 leading-relaxed">{errorMessage}</p>
                        </div>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="flex-shrink-0 text-red-200 hover:text-red-100 text-2xl font-bold transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

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
                            <p className="text-white font-['Manrope'] font-medium">{displayEventData?.title || 'Event'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{displayEventData?.venue || 'Venue'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{displayEventData?.date || 'Date'} | {displayEventData?.time || 'Time'}</p>
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
                            <p className="text-white font-['Manrope'] font-medium">{userEmail || 'Not provided'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">{userPhone || 'Not provided'}</p>
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
                        {ticketBreakdown && ticketBreakdown.length > 0 ? (
                            <>
                                {ticketBreakdown.map((ticket, idx) => (
                                    <div key={idx} className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                            <div>
                                                <p className="text-white font-['Manrope'] font-medium">{ticket.name}</p>
                                                <p className="text-[#14FFEC] text-xs font-['Manrope']">₹ {ticket.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className="text-white font-['Manrope'] font-bold">×{ticket.quantity}</span>
                                    </div>
                                ))}

                                {/* Dotted line */}
                                <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                                {/* Total Tickets */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                        <p className="text-white font-['Manrope'] font-medium">Total Tickets</p>
                                    </div>
                                    <span className="text-white font-['Manrope'] font-bold">{totalTickets}</span>
                                </div>

                                {/* Dotted line */}
                                <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                                {/* Total Amount */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                        <p className="text-white font-['Manrope'] font-medium">Total Amount</p>
                                    </div>
                                    <span className="text-[#14FFEC] font-['Manrope'] font-bold text-lg">₹ {totalAmount.toLocaleString()}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400">No tickets selected</p>
                        )}
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
            <div className="min-h-screen w-full bg-[#021313] relative">
                <PageHeader title="REVIEW EVENT BOOKING" />

                {/* Skeleton Loading */}
                <div className="pt-[20vh] pb-24 px-4">
                    <div className="animate-pulse space-y-6">
                        {/* Event Details Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
                            <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                                <div className="h-6 bg-gray-700/30 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
                            </div>
                        </div>

                        {/* Contact Details Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
                            <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-3">
                                <div className="h-4 bg-gray-700/30 rounded w-full"></div>
                                <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
                            </div>
                        </div>

                        {/* Tickets Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
                            <div className="space-y-3">
                                <div className="h-16 bg-[#0D1F1F] rounded-xl"></div>
                                <div className="h-16 bg-[#0D1F1F] rounded-xl"></div>
                            </div>
                        </div>

                        {/* Payment Section Skeleton */}
                        <div className="fixed bottom-0 left-0 right-0 bg-[#021313] border-t border-[#14FFEC]/30 p-4">
                            <div className="h-16 bg-gray-700/30 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ReviewBookingPageContent />
        </Suspense>
    );
}
