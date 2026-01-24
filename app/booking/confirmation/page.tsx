'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';
import { TicketService } from '@/lib/services/ticket.service';
import { Loader2 } from 'lucide-react';

export default function ConfirmationPage() {
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
            // Fallback: use mock data if no ticketId
            setLoading(false);
        }
    }, [searchParams]);

    const fetchTicketDetails = async (ticketId: string) => {
        try {
            setLoading(true);
            const response = await TicketService.getTicketDetails(ticketId);

            if (response.success && response.data) {
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
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#14FFEC] animate-spin mx-auto mb-4" />
                        <p className="text-white">Loading your ticket...</p>
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
                                    {ticket?.reservationId || ticket?.bookingId || 'BO-290'}
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
                                        {ticket?.customerDetails?.name || 'David Simon'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Booking date</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.bookingDetails?.bookingDate || '04 Apr | 4:00 pm'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Contact Number</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.customerDetails?.mobile || '+91 9XXXX9XXXX'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Number of Guest(s)</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                        {ticket?.bookingDetails?.guestCount || 2} Guests
                                    </p>
                                </div>

                                {ticket?.bookingDetails?.tableNumber && (
                                    <div>
                                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Table Number</p>
                                        <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                            {ticket.bookingDetails.tableNumber}
                                        </p>
                                    </div>
                                )}

                                {ticket?.bookingDetails?.notes && (
                                    <div>
                                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Notes</p>
                                        <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                            {ticket.bookingDetails.notes}
                                        </p>
                                    </div>
                                )}

                                {ticket?.bookingDetails?.floorNumber && (
                                    <div>
                                        <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Floor Number</p>
                                        <p className="text-white text-sm font-['Manrope'] font-bold mt-1">
                                            {ticket.bookingDetails.floorNumber}
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
                        <div className="px-6 py-5 pt-2">
                            <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium mb-1">Benefits</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">Flat 30% OFF</p>
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium mt-1">Pay your bill between 7:00 PM to 11 PM</p>
                        </div>
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
        </div>
    );
}
