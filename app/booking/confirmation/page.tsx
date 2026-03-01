'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';
import { api } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

function ConfirmationPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ticketId = searchParams.get('ticketId');
        if (ticketId) {
            fetchTicketDetails(ticketId);
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    const fetchTicketDetails = async (ticketId: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/ticket/club-tickets/${ticketId}`);

            if (response.data) {
                setTicket(response.data);
            } else {
                setError('Failed to load ticket details');
            }
        } catch (error: any) {
            console.error('Error fetching ticket:', error);
            setError(error.message || 'Failed to load ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            {/* Custom Header without back button for confirmation page */}
            <div className="fixed top-0 left-0 w-full h-[16vh] bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-b-[30px] z-40 flex flex-col justify-center">
                <div className="text-center px-6">
                    <div className="text-white text-xl font-['Manrope'] font-bold leading-6 tracking-[0.50px]">BOOKING CONFIRMED</div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="px-4 pt-[20vh] pb-24">
                    {/* Combined Ticket Card Skeleton */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] border border-[#14FFEC] mb-4 relative">
                        {/* QR Code Section Skeleton */}
                        <div className="w-full py-5 flex flex-col items-center">
                            <div className="w-[160px] h-[160px] bg-[#00534C] rounded animate-pulse"></div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent opacity-30"></div>

                        {/* Details Section Skeleton */}
                        <div className="w-full p-6">
                            {/* Club Name Skeleton */}
                            <div className="h-6 bg-[#00534C] rounded w-2/3 animate-pulse mb-4"></div>

                            {/* Date/Time Skeleton */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-4 h-4 bg-[#00534C] rounded animate-pulse"></div>
                                <div className="h-5 bg-[#00534C] rounded w-1/2 animate-pulse"></div>
                            </div>

                            {/* Location Skeleton */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-4 bg-[#00534C] rounded animate-pulse"></div>
                                <div className="h-5 bg-[#00534C] rounded w-3/4 animate-pulse"></div>
                            </div>

                            {/* Guest Count Skeleton */}
                            <div className="h-5 bg-[#00534C] rounded w-1/3 animate-pulse mb-6"></div>

                            {/* Ticket Number Skeleton */}
                            <div className="bg-[#00534C]/30 rounded-lg p-3 mb-4">
                                <div className="h-4 bg-[#00534C] rounded w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex gap-3">
                        <div className="flex-1 h-12 bg-[#0D1F1F] rounded-full animate-pulse"></div>
                        <div className="flex-1 h-12 bg-[#0D1F1F] rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex items-center justify-center h-screen px-4">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/account/bookings')}
                            className="bg-[#14FFEC] text-black px-6 py-2 rounded-full"
                        >
                            View Bookings
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket Display */}
            {!loading && !error && (
                <div className="px-4 pt-[20vh] pb-24">
                    {/* Combined Ticket Card - Single component with sections */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] border border-[#14FFEC] mb-4 relative ">
                        {/* QR Code Section */}
                        <div className="w-full py-5 flex flex-col items-center">
                            {/* QR Code */}
                            <div>
                                {ticket?.qrCode ? (
                                    <Image
                                        src={ticket.qrCode}
                                        alt="QR Code"
                                        width={160}
                                        height={160}
                                        className="w-[160px] h-[160px]"
                                    />
                                ) : (
                                    <Image
                                        src="/booking/main-qr.png"
                                        alt="QR Code"
                                        width={160}
                                        height={160}
                                        className="w-[160px] h-[160px]"
                                    />
                                )}
                            </div>

                            {/* Scan instructions */}
                            <p className="text-[#B6B6B6] text-base font-['Manrope'] font-medium mb-1">
                                Scan this QR code at the entrance
                            </p>

                            {/* Reservation ID */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[#B6B6B6] text-sm font-['Manrope'] font-medium">Reservation ID:</span>
                                <span className="text-[#14FFEC] text-sm font-['Manrope'] font-bold">
                                    {ticket?.ticketNumber || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Dotted separator line with ticket cuts */}
                        <div className="relative w-full flex items-center justify-center py-[1px]">
                            {/* Dashed line */}
                            <div className="w-full border-t-2 border-dashed border-[#14FFEC]"></div>

                            {/* Left cut - larger circles positioned to match the image */}
                            <div className="absolute top-[-15px] -left-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>

                            {/* Right cut - larger circles positioned to match the image */}
                            <div className="absolute top-[-15px] -right-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                        </div>

                        {/* Ticket Details Section */}
                        <div className="w-full">
                            {/* Guest Details - Two Column Grid */}
                            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-4">
                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Name</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.userName || 'Guest'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Booking date</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.bookingDate && ticket?.arrivalTime
                                            ? `${new Date(ticket.bookingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} | ${ticket.arrivalTime.substring(0, 5)}`
                                            : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Contact Number</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.userPhone || 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Number of Guest(s)</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.guestCount || 0} Guests
                                    </p>
                                </div>

                                {ticket?.occasion && (
                                    <div>
                                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Occasion</p>
                                        <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                            {ticket.occasion}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Arrival Time</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.bookingDetails?.arrivalTime || '---'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Event Details (if event exists) */}
                        {ticket?.eventDetails && (
                            <div className="px-6 pb-5 border-t border-[#FFFFFF30]">
                                <div className="pt-4">
                                    <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium mb-2">Event Details</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold">
                                        {ticket.eventDetails.eventTitle}
                                    </p>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium mt-1">
                                        Entry Fee: ₹{ticket.eventDetails.entryFee}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pricing Details */}
                        {ticket?.pricing && (
                            <div className="px-6 py-5 border-t border-[#FFFFFF30]">
                                <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium mb-2">Pricing</p>
                                {ticket.pricing.entryFee > 0 && (
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[#B6B6B6] text-xs">Entry Fee</span>
                                        <span className="text-white text-xs">₹{ticket.pricing.entryFee}</span>
                                    </div>
                                )}
                                {ticket.pricing.offerDiscount > 0 && (
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[#B6B6B6] text-xs">Offer Discount</span>
                                        <span className="text-[#14FFEC] text-xs">-₹{ticket.pricing.offerDiscount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-[#FFFFFF30] mt-2">
                                    <span className="text-white text-sm font-bold">Total Paid</span>
                                    <span className="text-[#14FFEC] text-sm font-bold">₹{ticket.pricing.totalAmount}</span>
                                </div>
                            </div>
                        )}

                        {/* Benefits Section */}
                        {ticket?.offerTitle && (
                            <div className="px-6 pb-5 border-t border-[#FFFFFF30]">
                                <div className="pt-4">
                                    <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium mb-2">Benefits</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold">
                                        {ticket.offerTitle}
                                    </p>
                                    {ticket.offerDescription && (
                                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium mt-1">
                                            {ticket.offerDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] overflow-hidden p-2">
                <div className="px-6 py-2">
                    <h3 className="text-white text-lg font-['Manrope'] font-bold mb-3">
                        So, What do we do next
                    </h3>

                    {/* Line separator between heading and content */}
                    <div className="w-full h-[1px] bg-[#FFFFFF10] mb-4"></div>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Image
                                src="/booking/review-event-booking/ArrowBendUpRight.svg"
                                alt="Direction"
                                width={24}
                                height={24}
                                className="text-[#14FFEC]"
                            />
                        </div>
                        <p className="text-[#B6B6B6] text-sm font-['Manrope'] font-medium leading-6">
                            Ensure your presence at the venue on the allotted date & time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-4 py-6 space-y-3">
                <button
                    onClick={() => router.push('/booking')}
                    className="w-full h-[50px] rounded-full bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        View My Bookings
                    </span>
                </button>
                <button
                    onClick={() => router.push('/home')}
                    className="w-full h-[50px] rounded-full bg-transparent border border-[#FFFFFF33] flex justify-center items-center"
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        Back to Home
                    </span>
                </button>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <ConfirmationPageContent />
        </Suspense>
    );
}
