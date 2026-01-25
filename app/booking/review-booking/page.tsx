'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, ArrowUpRight, ChevronRight, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { usePayment } from '@/hooks/use-payment';
import { useProfile } from '@/hooks/use-profile';
import { api } from '@/lib/api-client';
import { TicketService } from '@/lib/services/ticket.service';

interface ClubData {
    id: string;
    name: string;
    description: string;
    location: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    logo?: string;
    logoUrl?: string;
    locationText?: {
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        fullAddress?: string;
    };
}

interface Offer {
    id: string;
    clubId: string;
    title: string;
    description: string;
    offerType: string;
    discountPercentage?: number;
    discountAmount?: number;
    promoCode?: string;
    minimumAmount?: number;
    usageLimit: number;
    usageCount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export default function ReviewEventBookingPage() {
    const router = useRouter();
    const { initiatePayment, loading } = usePayment();
    const { profile } = useProfile();
    const [bookingData, setBookingData] = useState<any>(null);
    const [clubData, setClubData] = useState<ClubData | null>(null);
    const [clubLoading, setClubLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    useEffect(() => {
        // Load booking data from sessionStorage
        const data = sessionStorage.getItem('bookingData');
        if (data) {
            const parsedData = JSON.parse(data);
            setBookingData(parsedData);

            // Get club data from booking data (passed from slot page)
            if (parsedData.clubData) {
                setClubData(parsedData.clubData);
            }
        }

        // Load user info from localStorage
        const storedUser = localStorage.getItem('clubviz-user');
        if (storedUser) {
            try {
                setUserInfo(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user info:', error);
            }
        }
    }, []);

    // Filter valid offers
    const getValidOffers = () => {
        if (!bookingData?.selectedOffer) return null;

        const offer = bookingData.selectedOffer as Offer;
        const now = new Date();
        const endDate = new Date(offer.endDate);
        const startDate = new Date(offer.startDate);

        // Check if offer is still valid
        if (endDate < now || startDate > now || !offer.isActive) {
            return null;
        }

        return offer;
    };

    const validOffer = getValidOffers();

    // Format date and time
    const formatDateTime = (dateStr: string, timeStr?: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return timeStr ? `${formattedDate} | ${timeStr}` : formattedDate;
    };

    const handleContinue = async () => {
        try {
            if (!bookingData) {
                console.error('Missing booking data');
                return;
            }

            setIsCreatingTicket(true);

            // Get user data from profile or localStorage
            const currentUser = profile || userInfo;
            if (!currentUser) {
                console.error('No user data available');
                setIsCreatingTicket(false);
                return;
            }

            // Format arrival time as HH:mm:ss (not an object!)
            const arrivalTimeStr = bookingData.arrivalTime || '18:00';
            const [hours, minutes] = arrivalTimeStr.split(':');
            const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

            // Validate required fields (userId, userEmail, userName are required)
            const userId = currentUser.id || currentUser.userId;
            const userEmail = currentUser.email;
            const userName = currentUser.fullName || currentUser.name || currentUser.username;

            // Check for phone in multiple possible locations
            const userPhone = currentUser.phoneNumber ||
                currentUser.mobileNumber ||
                currentUser.mobile ||
                currentUser.validatedPhone ||  // ← Check validatedPhone from localStorage
                '7337066524';  // Fallback

            console.log('User data check:', {
                currentUser,
                userId,
                userEmail,
                userName,
                userPhone,
                phoneNumber: currentUser.phoneNumber,
                mobileNumber: currentUser.mobileNumber,
                mobile: currentUser.mobile,
                validatedPhone: currentUser.validatedPhone
            });

            if (!userId || !userEmail || !userName) {
                console.error('Missing required user fields:', {
                    userId,
                    userEmail,
                    userName
                });
                setIsCreatingTicket(false);
                return;
            }

            // Create no-event ticket - ensure all values are strings
            const ticketData = {
                clubId: String(bookingData.clubId),
                clubName: String(clubData?.name || bookingData.clubName || 'Club'),
                userId: String(userId),
                userEmail: String(userEmail),
                userName: String(userName),
                userPhone: String(userPhone),  // Convert number to string if needed
                bookingDate: String(bookingData.bookingDate),
                arrivalTime: formattedTime,
                guestCount: Number(bookingData.guestCount || 2),
                eventId: null,
                offerId: bookingData.offerId || null,
                occasion: String(bookingData.occasion || ''),
                floorPreference: String(bookingData.floorPreference || ''),
                currency: 'INR'
            };

            console.log('📤 Sending ticket creation request:', ticketData);

            const response = await TicketService.createNoEventClubTicket(ticketData);

            console.log('✅ Ticket created successfully:', response);

            if (response.data?.ticketId) {
                // Navigate to pre-booking page with ticket ID
                router.push(`/booking/review-pre-booking?ticketId=${response.data.ticketId}`);
            } else {
                console.error('❌ No ticket ID in response:', response);
                setIsCreatingTicket(false);
            }
        } catch (error: any) {
            console.error('❌ Ticket creation error:', {
                error,
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setIsCreatingTicket(false);
        }
    };

    // Get directions to club
    const handleGetDirections = () => {
        if (clubData?.latitude && clubData?.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${clubData.latitude},${clubData.longitude}`;
            window.open(url, '_blank');
        } else if (clubData?.location) {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clubData.location)}`;
            window.open(url, '_blank');
        }
    };

    if (!bookingData) {
        return (
            <div className="w-full min-h-screen relative bg-[#021313]">
                <PageHeader title="REVIEW BOOKING" />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                </div>
            </div>
        );
    }

    // Show skeleton loading when creating ticket
    if (isCreatingTicket) {
        return (
            <div className="w-full min-h-screen relative bg-[#021313]">
                <PageHeader title="REVIEW EVENT BOOKING" />
                <div className="absolute top-[10rem] left-0 right-0 bottom-0 bg-[#021313] overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-4 px-4 pb-8">
                        {/* Info message skeleton */}
                        <div className="mx-auto w-full px-3 py-2.5 bg-[#003935] rounded-[1.25rem] animate-pulse">
                            <div className="h-4 bg-[#00534C] rounded w-3/4 mx-auto"></div>
                        </div>

                        {/* Venue details card skeleton */}
                        <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-full border border-[#14FFEC] bg-[#00534C] animate-pulse"></div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="h-5 bg-[#00534C] rounded w-2/3 animate-pulse"></div>
                                    <div className="h-4 bg-[#00534C] rounded w-1/2 animate-pulse"></div>
                                    <div className="h-4 bg-[#00534C] rounded w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Booking details card skeleton */}
                        <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                            <div className="flex flex-col gap-4">
                                <div className="h-4 bg-[#00534C] rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-[#00534C] rounded w-1/3 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Person details card skeleton */}
                        <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                            <div className="flex flex-col gap-4">
                                <div className="h-4 bg-[#00534C] rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-[#00534C] rounded w-1/3 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="w-full h-[4.5rem] bg-[#0D1F1F] flex items-center justify-center">
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 text-[#14FFEC] animate-spin" />
                            <span className="text-[#14FFEC] text-sm font-medium">Creating your booking...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Main Content Container */}
            <div className="absolute top-[10rem] left-0 right-0 bottom-0 bg-[#021313] overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-4 px-4 pb-8">
                    {/* Info message */}
                    <div className="mx-auto w-full px-3 py-2.5 bg-[#003935] rounded-[1.25rem]">
                        <p className="text-center text-white text-[0.8125rem] font-['Manrope'] font-medium leading-4 tracking-[0.13px]">
                            Please arrive at the venue at least 10 minutes prior to your scheduled booking to ensure a smooth and hassle free experience
                        </p>
                    </div>

                    {/* Venue details card */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                        <div className="flex gap-4">
                            {/* Club Image */}
                            <div className="w-20 h-20 rounded-full border border-[#14FFEC] overflow-hidden flex-shrink-0 bg-black">
                                <Image
                                    src={clubData?.logo || clubData?.logoUrl || clubData?.images?.[0] || "/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png"}
                                    alt={clubData?.name || "Club"}
                                    width={80}
                                    height={80}
                                    className="object-contain w-full h-full"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/80x80";
                                    }}
                                />
                            </div>

                            {/* Club Details */}
                            <div className="flex-1 flex flex-col gap-3">
                                <h2 className="text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.16px]">
                                    {clubData?.name || bookingData?.clubName || 'Club'}
                                </h2>

                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 relative overflow-hidden">
                                        <Image
                                            src="/booking/review-event-booking/Clock.svg"
                                            alt="Clock"
                                            width={16}
                                            height={16}
                                            className="text-[#14FFEC]"
                                        />
                                    </div>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px]">
                                        {formatDateTime(bookingData.bookingDate, bookingData.arrivalTime)}
                                    </p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-4 h-4 relative overflow-hidden flex-shrink-0 mt-0.5">
                                        <Image
                                            src="/booking/review-event-booking/MapPin.svg"
                                            alt="Location"
                                            width={16}
                                            height={16}
                                            className="text-[#14FFEC]"
                                        />
                                    </div>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px]">
                                        {(() => {
                                            // Try to get full address from locationText
                                            if (clubData?.locationText?.fullAddress) {
                                                return clubData.locationText.fullAddress;
                                            }
                                            // Build address from parts
                                            const parts = [
                                                clubData?.locationText?.address1,
                                                clubData?.locationText?.address2,
                                                clubData?.locationText?.city,
                                                clubData?.locationText?.state
                                            ].filter(Boolean);
                                            if (parts.length > 0) {
                                                return parts.join(', ');
                                            }
                                            // Fallback to basic location fields
                                            return clubData?.location || clubData?.city || 'Location not available';
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Booking details card */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                        <div className="flex flex-col">
                            <div className="pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Booking date</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                    {formatDateTime(bookingData.bookingDate, bookingData.arrivalTime)}
                                </p>
                            </div>

                            <div className="pt-3 pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Number of Guest(s)</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                    {bookingData.guestCount} {bookingData.guestCount === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>

                            {/* Only show benefits if valid offer exists */}
                            {validOffer && (
                                <div className="pt-3">
                                    <p className="text-[#14FFEC] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Benefits</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                        {validOffer.offerType === 'PERCENTAGE_DISCOUNT' && validOffer.discountPercentage
                                            ? `Flat ${validOffer.discountPercentage}% OFF`
                                            : validOffer.offerType === 'FIXED_DISCOUNT' && validOffer.discountAmount
                                                ? `Flat ₹${validOffer.discountAmount} OFF`
                                                : validOffer.title}
                                    </p>
                                    {validOffer.description && (
                                        <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px] mt-1">
                                            {validOffer.description}
                                        </p>
                                    )}
                                    {validOffer.promoCode && (
                                        <p className="text-[#14FFEC] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px] mt-1">
                                            Promo Code: {validOffer.promoCode}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Person details card */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Name</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                    {profile?.fullName || userInfo?.fullName || userInfo?.name || userInfo?.username || 'Guest'}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Contact Number</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                    {profile?.phoneNumber || profile?.mobileNumber || userInfo?.phoneNumber || userInfo?.mobileNumber || userInfo?.mobile || 'Not provided'}
                                </p>
                            </div>

                            {(profile?.email || userInfo?.email) && (
                                <div className="pt-3 border-t border-[#FFFFFF30]">
                                    <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Email</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">
                                        {profile?.email || userInfo?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terms & Conditions card - expanded */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem]">
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-white text-[1rem] font-['Manrope'] font-medium leading-5 tracking-[0.16px]">Terms & Condition</p>

                            </div>

                            <div className="text-white text-[0.75rem] font-['Manrope'] leading-5 space-y-3">
                                <p>1. Table bookings are held for 15 minutes from the scheduled reservation time.</p>
                                <p>2. Cancellations must be made at least 4 hours before your reservation time.</p>
                                <p>3. The club reserves the right to refuse entry to improperly dressed or intoxicated guests.</p>
                                <p>4. Benefits and discounts are applicable as per club policy and may vary.</p>
                                <p>5. By confirming this booking, you agree to comply with all club rules and regulations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom confirm button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomContinueButton
                    text={isCreatingTicket ? "Creating Booking..." : "Confirm Booking"}
                    onClick={handleContinue}
                    disabled={isCreatingTicket}
                />
            </div>
        </div>
    );
}
