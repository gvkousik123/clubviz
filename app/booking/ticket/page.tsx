'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Share2, ChevronLeft, X, Loader2 } from 'lucide-react';
import { TicketService } from '@/lib/services/ticket.service';
import { useToast } from '@/hooks/use-toast';

// Add custom CSS for animation
const slideUpAnimation = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  .animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }
`;

function BookingTicketPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const ticketId = searchParams.get('ticketId');

    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Debug: Log when ticketData changes
    useEffect(() => {
        console.log('🎫 TicketData State Updated:', ticketData);
    }, [ticketData]);

    // Add animation styles and load ticket data
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = slideUpAnimation;
        document.head.appendChild(style);

        // Always fetch ticket data from API
        if (ticketId) {
            fetchTicketData();
        }

        return () => {
            document.head.removeChild(style);
        };
    }, [ticketId]);

    const fetchTicketData = async () => {
        try {
            setLoading(true);
            const response = await TicketService.getTicketDetails(ticketId!);

            let data: any = null;
            // Handle different response structures
            if (response && typeof response === 'object') {
                // Check for nested data property
                if ((response as any).data) {
                    data = (response as any).data;
                }
                // Check if response itself is the data (check for ticketId field)
                else if ((response as any).ticketId || (response as any).clubName) {
                    data = response;
                }
            }


            if (data) {
                setTicketData(data);

                // Show success toast
                toast({
                    title: 'Success',
                    description: 'Ticket loaded successfully',
                });
            } else {
                throw new Error('No ticket data in response');
            }
        } catch (error) {
            console.error('❌ Failed to fetch ticket:', error);
            toast({
                title: 'Error',
                description: 'Failed to load ticket',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/home');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Booking Ticket',
                text: `Check out my ticket for ${ticketData?.clubName || 'the club'}!`,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            toast({
                title: 'Info',
                description: 'Share functionality not available',
            });
        }
    };

    const handleDownload = async () => {
        try {
            if (ticketId) {
                await TicketService.downloadAndSaveTicketPDF(ticketId);
                toast({
                    title: 'Success',
                    description: 'Ticket downloaded successfully',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to download ticket',
                variant: 'destructive',
            });
        }
    };

    const handleCancel = () => {
        setShowCancelPopup(true);
    };

    const handleCloseCancelPopup = () => {
        setShowCancelPopup(false);
        setCancelReason('');
        setAdditionalNotes('');
    };

    const handleConfirmCancel = async () => {
        if (!cancelReason.trim()) {
            toast({
                title: 'Required',
                description: 'Please provide a reason for cancellation',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsCancelling(true);
            const response = await TicketService.cancelClubTicket(ticketId!, {
                reason: cancelReason,
                additionalNotes: additionalNotes || undefined,
            });

            if (response.success || response.data) {
                // Close popup
                setShowCancelPopup(false);
                setCancelReason('');
                setAdditionalNotes('');

                // Show success toast
                toast({
                    title: 'Success',
                    description: 'Ticket cancelled successfully',
                });

                // Refresh ticket data to show updated status
                await fetchTicketData();
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to cancel ticket',
                variant: 'destructive',
            });
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            {/* Header */}
            <div className="w-full h-[12vh] bg-[#074344] rounded-b-[25px] flex items-center justify-between px-6 relative">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>

                <h1 className="text-white text-xl font-['Manrope'] font-bold absolute left-1/2 transform -translate-x-1/2">
                    MY TICKET
                </h1>

                <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
                >
                    <Share2 size={20} className="text-white" />
                </button>
            </div>

            {/* Main Ticket Content */}
            <div className="px-4 pt-6 pb-4">
                {/* Status Badge */}
                {ticketData?.status && (
                    <div className="mb-4 flex justify-center">
                        <div className={`px-4 py-2 rounded-full ${ticketData.status === 'CANCELLED'
                            ? 'bg-red-500/20 border border-red-500'
                            : 'bg-[#14FFEC]/20 border border-[#14FFEC]'
                            }`}>
                            <p className={`text-sm font-['Manrope'] font-bold ${ticketData.status === 'CANCELLED'
                                ? 'text-red-500'
                                : 'text-[#14FFEC]'
                                }`}>
                                {ticketData.status}
                            </p>
                        </div>
                    </div>
                )}

                {/* Ticket Card */}
                <div className="w-full bg-[#0D1F1F] rounded-[20px] border border-[#14FFEC] overflow-visible relative">
                    {/* Ticket Details */}
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-y-4">
                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Club</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.clubName || 'Club'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Time</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.arrivalTime || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Name</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.userName || 'Guest'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Phone</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.userPhone || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Occasion</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.occasion || 'Casual'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Date</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.bookingDate || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Guests</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData?.guestCount || 'N/A'}</p>
                            </div>

                            {ticketData?.totalAmount !== null && ticketData?.totalAmount !== undefined && (
                                <div>
                                    <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Amount</p>
                                    <p className="text-white text-sm font-['Manrope'] font-bold mt-1">₹{ticketData.totalAmount}</p>
                                </div>
                            )}
                        </div>

                        {/* Floor Preference */}
                        {ticketData?.floorPreference && (
                            <div className="mt-4">
                                <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium">Floor Preference</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">{ticketData.floorPreference}</p>
                            </div>
                        )}
                    </div>

                    {/* Dashed separator line with ticket cuts */}
                    <div className="relative w-full flex items-center justify-center py-[1px]">
                        <div className="w-full border-t-2 border-dashed border-[#14FFEC]"></div>
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#021313] rounded-full z-10"></div>
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#021313] rounded-full z-10"></div>
                    </div>

                    {/* QR Code Section */}
                    <div className="p-5 flex flex-col items-center">
                        <p className="text-white text-sm font-['Manrope'] font-medium mb-3 text-center">
                            Scan this QR code at the entry
                        </p>
                        {ticketData?.qrCode && (
                            <div className="mb-3">
                                <img
                                    src={`data:image/png;base64,${ticketData.qrCode}`}
                                    alt="QR Code"
                                    className="w-[140px] h-[140px]"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-['Manrope'] font-medium">Ticket -</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">{ticketData?.ticketNumber || ticketData?.ticketId}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 mt-8 mb-10 space-y-3">
                <button
                    onClick={handleDownload}
                    className="w-full h-[50px] rounded-full bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        Download ticket
                    </span>
                </button>

                {ticketData?.status !== 'CANCELLED' && (
                    <button
                        onClick={handleCancel}
                        className="w-full h-[50px] rounded-full bg-transparent border border-[#FFFFFF33] flex justify-center items-center"
                    >
                        <span className="text-white text-lg font-['Manrope'] font-medium">
                            Cancel ticket
                        </span>
                    </button>
                )}

                {ticketData?.status === 'CANCELLED' && ticketData?.cancellationReason && (
                    <div className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-red-500 text-sm font-['Manrope'] font-medium mb-1">
                            Cancellation Reason:
                        </p>
                        <p className="text-white text-sm font-['Manrope']">
                            {ticketData.cancellationReason}
                        </p>
                        {ticketData.cancelledAt && (
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] mt-2">
                                Cancelled at: {new Date(ticketData.cancelledAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Cancel Ticket Popup Overlay */}
            {showCancelPopup && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={handleCloseCancelPopup}
                    ></div>

                    {/* Popup Content */}
                    <div className="relative w-full bg-[#021313] rounded-t-3xl p-6 z-10 animate-slide-up max-h-[80vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                            onClick={handleCloseCancelPopup}
                        >
                            <X size={16} className="text-black" />
                        </button>

                        <div className="flex flex-col">
                            <h2 className="text-white text-xl font-['Manrope'] font-bold mb-6 text-center">CANCEL TICKET</h2>

                            {/* Ticket Icon */}
                            <div className="w-12 h-12 mb-6 mx-auto">
                                <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="26" cy="25.5" r="25.5" fill="#074344" />
                                    <path d="M36 15H15.375C14.8777 15 14.4008 15.1975 14.0492 15.5492C13.6975 15.9008 13.5 16.3777 13.5 16.875V34.6875C13.5001 34.8473 13.541 35.0044 13.6189 35.1439C13.6968 35.2834 13.809 35.4008 13.945 35.4847C14.0809 35.5686 14.2361 35.6164 14.3957 35.6236C14.5553 35.6307 14.7141 35.5969 14.857 35.5254L18.1875 33.8602L21.518 35.5254C21.6482 35.5906 21.7919 35.6245 21.9375 35.6245C22.0831 35.6245 22.2268 35.5906 22.357 35.5254L25.6875 33.8602L29.018 35.5254C29.1482 35.5906 29.2919 35.6245 29.4375 35.6245C29.5831 35.6245 29.7268 35.5906 29.857 35.5254L33.1875 33.8602L36.518 35.5254C36.6609 35.5969 36.8197 35.6307 36.9793 35.6236C37.1389 35.6164 37.2941 35.5686 37.43 35.4847C37.566 35.4008 37.6782 35.2834 37.7561 35.1439C37.834 35.0044 37.8749 34.8473 37.875 34.6875V16.875C37.875 16.3777 37.6775 15.9008 37.3258 15.5492C36.9742 15.1975 36.4973 15 36 15ZM29.1633 26.5242C29.2504 26.6113 29.3195 26.7147 29.3666 26.8285C29.4138 26.9423 29.438 27.0643 29.438 27.1875C29.438 27.3107 29.4138 27.4327 29.3666 27.5465C29.3195 27.6603 29.2504 27.7637 29.1633 27.8508C29.0762 27.9379 28.9728 28.007 28.859 28.0541C28.7452 28.1013 28.6232 28.1255 28.5 28.1255C28.3768 28.1255 28.2548 28.1013 28.141 28.0541C28.0272 28.007 27.9238 27.9379 27.8367 27.8508L25.6875 25.7004L23.5383 27.8508C23.4512 27.9379 23.3478 28.007 23.234 28.0541C23.1202 28.1013 22.9982 28.1255 22.875 28.1255C22.7518 28.1255 22.6298 28.1013 22.516 28.0541C22.4022 28.007 22.2988 27.9379 22.2117 27.8508C22.1246 27.7637 22.0555 27.6603 22.0084 27.5465C21.9612 27.4327 21.937 27.3107 21.937 27.1875C21.937 27.0643 21.9612 26.9423 22.0084 26.8285C22.0555 26.7147 22.1246 26.6113 22.2117 26.5242L24.3621 24.375L22.2117 22.2258C22.0358 22.0499 21.937 21.8113 21.937 21.5625C21.937 21.3137 22.0358 21.0751 22.2117 20.8992C22.3876 20.7233 22.6262 20.6245 22.875 20.6245C23.1238 20.6245 23.3624 20.7233 23.5383 20.8992L25.6875 23.0496L27.8367 20.8992C27.9238 20.8121 28.0272 20.743 28.141 20.6959C28.2548 20.6487 28.3768 20.6245 28.5 20.6245C28.6232 20.6245 28.7452 20.6487 28.859 20.6959C28.9728 20.743 29.0762 20.8121 29.1633 20.8992C29.2504 20.9863 29.3195 21.0897 29.3666 21.2035C29.4138 21.3173 29.438 21.4393 29.438 21.5625C29.438 21.6857 29.4138 21.8077 29.3666 21.9215C29.3195 22.0353 29.2504 22.1387 29.1633 22.2258L27.0129 24.375L29.1633 26.5242Z" fill="#14FFEC" />
                                </svg>
                            </div>

                            {/* Cancellation Reason Input */}
                            <div className="mb-4">
                                <label className="text-white text-sm font-['Manrope'] font-medium mb-2 block">
                                    Reason for Cancellation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="e.g., Change of plans, Emergency..."
                                    className="w-full h-12 px-4 bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-lg text-white font-['Manrope'] placeholder:text-[#B6B6B6] focus:outline-none focus:border-[#14FFEC]"
                                />
                            </div>

                            {/* Additional Notes Input */}
                            <div className="mb-6">
                                <label className="text-white text-sm font-['Manrope'] font-medium mb-2 block">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    placeholder="Any additional information..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-lg text-white font-['Manrope'] placeholder:text-[#B6B6B6] focus:outline-none focus:border-[#14FFEC] resize-none"
                                />
                            </div>

                            {/* Cancel Button */}
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isCancelling}
                                className="w-full h-[50px] rounded-full border border-white/30 flex justify-center items-center disabled:opacity-50"
                            >
                                {isCancelling ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <span className="text-white text-lg font-['Manrope'] font-medium">
                                        Confirm Cancellation
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default function BookingTicketPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin mx-auto mb-4" />
                    <p className="text-white text-sm">Loading ticket...</p>
                </div>
            </div>
        }>
            <BookingTicketPageContent />
        </Suspense>
    );
}
