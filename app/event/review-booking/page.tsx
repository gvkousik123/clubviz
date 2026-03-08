'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { MapPin, Mail, Phone, Plus, Minus, Loader2 } from 'lucide-react';
import { TShirt, Ticket, Coins, Receipt, Percent, Tag, CreditCard } from '@phosphor-icons/react';
import PageHeader from '@/components/common/page-header';
import { TicketService } from '@/lib/services/ticket.service';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/use-payment';

// Add custom CSS for hiding scrollbar while keeping functionality
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  @keyframes coupon-slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes coupon-slide-down {
    from { transform: translateY(0);    opacity: 1; }
    to   { transform: translateY(100%); opacity: 0; }
  }
  .coupon-sheet {
    animation: coupon-slide-up 0.32s cubic-bezier(0.32,0.72,0,1) forwards;
  }
  .coupon-sheet-closing {
    animation: coupon-slide-down 0.28s cubic-bezier(0.32,0.72,0,1) forwards;
  }
  .payment-sheet {
    animation: coupon-slide-up 0.32s cubic-bezier(0.32,0.72,0,1) forwards;
  }
  .payment-sheet-closing {
    animation: coupon-slide-down 0.28s cubic-bezier(0.32,0.72,0,1) forwards;
  }
`;

function ReviewBookingPageContent() {
    const router = useRouter();
    const { toast } = useToast();
    const { quickPay, loading: paymentLoading } = usePayment();

    // Get data from sessionStorage
    const [bookingData, setBookingData] = useState<any>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showCouponSheet, setShowCouponSheet] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);
    const [couponInput, setCouponInput] = useState('');
    const [closingCoupon, setClosingCoupon] = useState(false);
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const [closingPayment, setClosingPayment] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const closeCouponSheet = () => {
        setClosingCoupon(true);
        setTimeout(() => {
            setShowCouponSheet(false);
            setClosingCoupon(false);
        }, 280);
    };

    const closePaymentSheet = () => {
        setClosingPayment(true);
        setTimeout(() => {
            setShowPaymentSheet(false);
            setClosingPayment(false);
        }, 280);
    };

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

    const calculateGrandTotal = () => {
        // ticketPrice + discounted platform fee (80) - discount (150)
        return calculateTotalAmount() + 80 - 150;
    };

    const handlePayment = async () => {
        try {
            setErrorMessage(null);
            const totalAmount = calculateGrandTotal();

            // Get user data from localStorage - user object contains id and username
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
                    email,
                    phone,
                    maleName,
                    femaleName,
                    stagName,
                    userId
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

            // Store booking data for after payment with ALL required fields
            const ticketBookingData = {
                eventId,
                clubId: clubData.clubId,
                clubName: clubData.clubName,
                userId: userId,
                ticketType,
                maleStag,
                femaleStag,
                couple,
                maleCount: maleStag,
                femaleCount: femaleStag,
                coupleCount: couple,
                maleName,
                femaleName,
                stagName,
                phone,
                email,
                userName: userNameFromStorage || maleName || stagName || 'Guest',
                bookingDate,
                arrivalTime,
                guestCount: maleStag + femaleStag + (couple * 2),
                ticketDescription: 'Event ticket booking',
                currency: 'INR',
                occasion: 'Event',
                floorPreference: 'Main Floor',
                totalAmount,
                eventData
            };

            console.log('🔵 Storing ticket booking data in sessionStorage:', ticketBookingData);
            sessionStorage.setItem('pendingEventBooking', JSON.stringify(ticketBookingData));

            // Format mobile number - remove country code and special characters
            const mobile = phone.replace(/[^0-9]/g, '').slice(-10); // Get last 10 digits

            // Initiate payment with contact info (usePayment hook will get additional details from localStorage)
            const paymentSuccess = await quickPay(totalAmount, {
                username: maleName || stagName || 'Guest',
                email: email,
                mobile: mobile || '' // Will use fallback in usePayment hook if empty
            });

            if (!paymentSuccess) {
                setErrorMessage('Failed to initiate payment. Please try again.');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || 'An error occurred. Please try again.');
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
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Error Message Alert */}
            {errorMessage && (
                <div className="fixed top-20 left-4 right-4 z-50 bg-red-900/80 border border-red-400 text-red-100 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
                    <div className="flex-1">
                        <p className="font-semibold">Booking Error</p>
                        <p className="text-sm mt-1">{errorMessage}</p>
                    </div>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="text-red-300 hover:text-red-100 font-bold"
                    >
                        ✕
                    </button>
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
                            <svg
                                className="flex-shrink-0"
                                width="18"
                                height="19.5"
                                viewBox="0 0 18 19.5"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ color: '#14ffec' }}
                            >
                                <path d="M14.25 2.25h-1.125V1.125a1.125 1.125 0 1 0-2.25 0V2.25H7.125V1.125a1.125 1.125 0 1 0-2.25 0V2.25H3.75A2.25 2.25 0 0 0 1.5 4.5v12.75A2.25 2.25 0 0 0 3.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25zm0 15.75H3.75a.75.75 0 0 1-.75-.75V7.5h12v9.75a.75.75 0 0 1-.75.75zm.75-13.5v1.5h-12V4.5a.75.75 0 0 1 .75-.75h1.125v1.125a1.125 1.125 0 1 0 2.25 0V3.75h3.75v1.125a1.125 1.125 0 1 0 2.25 0V3.75h1.125a.75.75 0 0 1 .75.75z" />
                            </svg>
                            <div
                                className="flex justify-center items-center bg-[#202b2b] py-[6px] rounded-[30px]"
                                style={{ paddingLeft: '12.5px', paddingRight: '12.5px', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 'fit-content', maxWidth: '100%' }}
                            >
                                <span
                                    className="font-bold text-[15px] leading-[20px] text-white"
                                    style={{
                                        fontFamily: 'Manrope',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        letterSpacing: '0.0625em',
                                        lineHeight: '20px',
                                        color: '#ffffff',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {eventData?.startDateTime
                                        ? (() => {
                                            const dateObj = new Date(eventData.startDateTime);
                                            const day = dateObj.getDate();
                                            const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                            const hours = dateObj.getHours();
                                            const mins = dateObj.getMinutes();
                                            const ampm = hours >= 12 ? 'pm' : 'am';
                                            const hour12 = hours % 12 === 0 ? 12 : hours % 12;
                                            const time = `${hour12}:${mins.toString().padStart(2, '0')} ${ampm}`;
                                            return `${day} ${month} | ${time}`;
                                        })()
                                        : `${displayEventData?.date || 'Date'} | ${displayEventData?.time || 'Time'}`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <TShirt size={20} className="text-[#14FFEC]" weight="bold" />
                            <span className="font-bold text-sm text-white">Dress Code - Funky Pop</span>
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

                {/* Details Section - Pricing Breakdown */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                        {/* Ticket Price */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Ticket size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">Ticket Price</span>
                            </div>
                            <span className="font-['Manrope'] font-bold text-sm text-white">₹ {calculateTotalAmount()}</span>
                        </div>

                        {/* Total Cover */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Coins size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">Total Cover</span>
                            </div>
                            <span className="font-['Manrope'] font-bold text-sm text-white">₹ {bookingData?.coverCharge || Math.round(calculateTotalAmount() * 0.7)}</span>
                        </div>

                        {/* Platform Fee */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Receipt size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">Platform fee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="font-['Manrope'] font-bold text-sm"
                                    style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}
                                >₹ 150</span>
                                <span className="font-['Manrope'] font-bold text-sm text-white">₹ 80</span>
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Percent size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">Discount</span>
                            </div>
                            <span className="font-['Manrope'] font-bold text-sm text-white">₹ 150</span>
                        </div>

                        {/* Dashed separator */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-2"></div>

                        {/* Grand Total */}
                        <div className="flex items-center justify-between pt-1">
                            <span className="font-['Manrope'] font-bold text-base text-white">Grand Total</span>
                            <span className="font-['Manrope'] font-bold text-base text-white">₹ {calculateGrandTotal()}</span>
                        </div>
                    </div>
                </div>

                {/* Coupon Code Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Coupon Code</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>
                    <div className="bg-[#0D1F1F] rounded-xl px-5 py-4">
                        <button className="flex items-center justify-between w-full" onClick={() => setShowCouponSheet(true)}>
                            <div className="flex items-center gap-3">
                                <Tag size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">See available Coupons</span>
                            </div>
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Payment Options Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Payment Options</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>
                    <button
                        onClick={() => setShowPaymentSheet(true)}
                        className="w-full bg-[#0D1F1F] rounded-xl px-5 py-4 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className="text-[#14FFEC]" weight="bold" />
                                <span className="font-['Manrope'] font-medium text-sm text-white">Choose payment options</span>
                            </div>
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Important Entry Info Section */}
                <div className="px-4 mb-28">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Important Entry Info</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>
                    <div className="bg-[#0D1F1F] rounded-xl px-5 py-4 space-y-4">
                        <p className="text-white font-['Manrope'] text-sm leading-[1.6]">
                            Guest list access ends at 9:30 PM – don't be late!{`\n`}
                            Post that, cover charges kick in for couples and stags at the door.
                        </p>
                        {/* T&C checkbox */}
                        <div className="flex items-center gap-3 pt-1">
                            <button
                                onClick={() => setTermsAccepted(prev => !prev)}
                                className="flex-shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors"
                                style={{
                                    borderColor: termsAccepted ? '#14FFEC' : 'rgba(255,255,255,0.35)',
                                    backgroundColor: termsAccepted ? '#14FFEC' : 'transparent',
                                }}
                                aria-label="Accept Terms and Conditions"
                            >
                                {termsAccepted && (
                                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 3.5L4 6.5L10 1" stroke="#021313" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <span className="font-['Manrope'] text-sm text-white">
                                By Proceeding, you agree to the{' '}
                                <span
                                    className="font-['Manrope'] text-sm font-semibold cursor-pointer"
                                    style={{ color: '#14FFEC' }}
                                    onClick={() => router.push('/terms')}
                                >
                                    Terms &amp; Condition
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Bottom Sheet — rendered via portal to escape overflow-hidden */}
            {mounted && showCouponSheet && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(2,19,19,0.75)' }}
                        onClick={closeCouponSheet}
                    />
                    {/* X button + sheet column */}
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* X close button — centered, 14px gap above sheet */}
                        <button
                            onClick={closeCouponSheet}
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 14, border: 'none', cursor: 'pointer', flexShrink: 0,
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        {/* Sheet */}
                        <div
                            className={closingCoupon ? 'coupon-sheet-closing' : 'coupon-sheet'}
                            style={{
                                width: '100%', borderRadius: '30px 30px 0 0',
                                background: '#0D1F1F', maxHeight: '80vh',
                                overflowY: 'auto', padding: '24px 20px 40px',
                            }}
                        >
                            {/* Input row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#162828', borderRadius: 12, padding: '12px 16px', gap: 12, border: '1px solid #1e3535' }}>
                                    <Tag size={18} color="#14FFEC" weight="bold" />
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                        placeholder="Enter Coupon Code"
                                        style={{ flex: 1, background: 'transparent', outline: 'none', border: 'none', color: 'white', fontFamily: 'Manrope', fontSize: 14 }}
                                    />
                                </div>
                                <button
                                    style={{ padding: '12px 20px', borderRadius: 12, background: '#1e3535', border: '1px solid #14FFEC', color: 'white', fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Count */}
                            <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'white', marginBottom: 12 }}>2 Coupons Available</p>

                            {/* Coupon cards */}
                            {[0, 1].map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCoupon(i)}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', borderRadius: 14,
                                        padding: '16px', marginBottom: 12, textAlign: 'left',
                                        background: '#162828', cursor: 'pointer',
                                        border: selectedCoupon === i ? '1.5px solid #14FFEC' : '1.5px solid #1e3535',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: 'white', margin: 0 }}>Flat ₹150 OFF</p>
                                        <p style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 12, color: '#14FFEC', marginTop: 2 }}>Save upto ₹150 with this code</p>
                                    </div>
                                    <div
                                        style={{
                                            width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                                            borderColor: selectedCoupon === i ? '#14FFEC' : 'rgba(255,255,255,0.35)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}
                                    >
                                        {selectedCoupon === i && (
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#14FFEC' }} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>,
                document.body
            )}

            {/* Payment Options Bottom Sheet — rendered via portal to escape overflow-hidden */}
            {mounted && showPaymentSheet && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(2,19,19,0.75)' }}
                        onClick={closePaymentSheet}
                    />
                    {/* X button + sheet column */}
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* X close button — centered, 14px gap above sheet */}
                        <button
                            onClick={closePaymentSheet}
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 14, border: 'none', cursor: 'pointer', flexShrink: 0,
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        {/* Sheet */}
                        <div
                            className={closingPayment ? 'payment-sheet-closing' : 'payment-sheet'}
                            style={{
                                width: '100%', borderRadius: '30px 30px 0 0',
                                background: '#0D1F1F', maxHeight: '82vh',
                                overflowY: 'auto', padding: '24px 20px 40px',
                            }}
                        >
                            {/* Title */}
                            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 24, textAlign: 'center' }}>Choose your Payment Option</h2>

                            {/* Cards Section */}
                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Cards</p>
                                <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#14FFEC" strokeWidth="1.8"/>
                                            <path d="M2 10H22" stroke="#14FFEC" strokeWidth="1.8"/>
                                            <rect x="5" y="14" width="4" height="2" rx="0.5" fill="#14FFEC"/>
                                        </svg>
                                        <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>Add credit or debit cards</span>
                                    </div>
                                    <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#14FFEC' }}>ADD</span>
                                </div>
                            </div>

                            {/* Pay by UPI apps Section */}
                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pay by UPI apps</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {/* Google Pay */}
                                    <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src="/pay/gpay.png" alt="Google Pay" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
                                            <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>Google Pay</span>
                                        </div>
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L7 7L1 13" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {/* PhonePe */}
                                    <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src="/pay/phonepe-icon.svg" alt="PhonePe" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: '50%' }} />
                                            <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>PhonePe</span>
                                        </div>
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L7 7L1 13" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {/* UPI ID */}
                                    <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src="/pay/upi-logo.svg" alt="UPI" style={{ width: 56, height: 26, objectFit: 'contain', borderRadius: 4 }} />
                                            <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>Add new UPI ID</span>
                                        </div>
                                        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#14FFEC' }}>ADD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Internet Banking Section */}
                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Internet Banking</p>
                                <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="#14FFEC" strokeWidth="1.8" strokeLinejoin="round"/>
                                            <path d="M9 22V12h6v10" stroke="#14FFEC" strokeWidth="1.8" strokeLinejoin="round"/>
                                        </svg>
                                        <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>Netbanking</span>
                                    </div>
                                    <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#14FFEC' }}>ADD</span>
                                </div>
                            </div>

                            {/* Pay at the venue Section */}
                            <div>
                                <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pay at the venue</p>
                                <div style={{ background: '#162828', borderRadius: 14, border: '1px solid #1e3535', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6h18v14H3V6z" stroke="#14FFEC" strokeWidth="1.8" strokeLinejoin="round"/>
                                            <path d="M3 6l2-3h14l2 3" stroke="#14FFEC" strokeWidth="1.8" strokeLinejoin="round"/>
                                            <circle cx="12" cy="13" r="2" stroke="#14FFEC" strokeWidth="1.6"/>
                                        </svg>
                                        <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'white' }}>Pay at the club Entry</span>
                                    </div>
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L7 7L1 13" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}

            {/* Bottom Payment Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[100px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-between items-center px-8 h-full">
                        <div className="flex flex-row items-center justify-center gap-2 px-5 py-3 rounded-[30px] border border-[#14FFEC]" style={{ background: 'rgba(2,19,19,0.7)' }}>
                            <span className="font-['Manrope'] font-semibold leading-[9px] text-white" style={{ letterSpacing: '0.0625em' }}>PAY:</span>
                            <span className="text-white text-xl font-['Manrope'] font-bold">₹ {calculateGrandTotal()}</span>
                        </div>
                        <div className="w-[160px] h-[55px] rounded-[30px] flex justify-center items-center transition-opacity"
                            style={{ backgroundColor: termsAccepted ? '#0F6861' : 'rgba(15,104,97,0.4)' }}
                        >
                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading || isCreatingTicket || !termsAccepted}
                                className="w-full h-full flex justify-center items-center disabled:cursor-not-allowed"
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
