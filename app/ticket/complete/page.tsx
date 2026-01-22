'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Share, Eye, Download } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { TicketService } from '@/lib/services/ticket.service';
import { useToast } from '@/hooks/use-toast';

function BookingCompleteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId');
    const [showContent, setShowContent] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Small delay to show loading animation first
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleShareTicket = async () => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'No ticket ID found',
                variant: 'destructive',
            });
            return;
        }

        setIsSharing(true);

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Event Ticket',
                    text: 'Check out my ticket for this amazing event!',
                    url: `${window.location.origin}/ticket/view?ticketId=${ticketId}`,
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback to sharing via API
            try {
                await TicketService.shareTicket(ticketId, {
                    platform: 'email',
                    message: 'Check out my ticket for this amazing event!',
                });

                // Also copy link to clipboard
                await navigator.clipboard.writeText(`${window.location.origin}/ticket/view?ticketId=${ticketId}`);

                toast({
                    title: 'Success',
                    description: 'Link copied to clipboard!',
                    variant: 'default',
                });
            } catch (err: any) {
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to share ticket',
                    variant: 'destructive',
                });
            }
        }

        setIsSharing(false);
    };

    const handleDownloadTicket = async () => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'No ticket ID found',
                variant: 'destructive',
            });
            return;
        }

        setIsDownloading(true);

        try {
            await TicketService.downloadAndSaveTicketPDF(ticketId);
            toast({
                title: 'Success',
                description: 'Ticket downloaded successfully',
                variant: 'default',
            });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to download ticket',
                variant: 'destructive',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleViewTicket = () => {
        if (ticketId) {
            router.push(`/ticket/view?ticketId=${ticketId}`);
        } else {
            router.push('/ticket/view');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-start p-6 pt-12">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[60vh]">
                {/* Loading/Success Icon */}
                <div className="relative mb-16">
                    {/* Outer glow effect */}
                    <div className="absolute inset-0 w-24 h-24 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>

                    {/* Main circle */}
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
                        {!showContent ? (
                            // Loading spinner - more accurate to design
                            <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
                        ) : (
                            // Success checkmark - simpler circle design
                            <div className="w-16 h-16 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-400/30">
                                <div className="w-12 h-12 border-4 border-teal-400 rounded-full flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal-400">
                                        <path
                                            d="M20 6L9 17l-5-5"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Text */}
                <div className="text-center mb-20">
                    <h1 className="text-3xl font-bold mb-4 text-white">
                        {showContent ? 'Booking Complete' : 'Processing...'}
                    </h1>
                    {showContent && (
                        <p className="text-lg text-teal-400 font-medium">
                            See you at the Venue
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Action Buttons */}
            {showContent && (
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 space-y-4">
                    <button
                        onClick={handleDownloadTicket}
                        disabled={isDownloading}
                        className="w-full header-gradient text-white font-semibold py-4 px-6 rounded-2xl 
                     shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                     transform hover:scale-[1.02] transition-all duration-300 
                     border border-teal-400/20 backdrop-blur-sm
                     flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={20} className={isDownloading ? 'animate-bounce' : ''} />
                        {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD TICKET'}
                    </button>

                    <button
                        onClick={handleShareTicket}
                        disabled={isSharing}
                        className="w-full bg-transparent text-teal-400 font-semibold py-4 px-6 rounded-2xl 
                     border-2 border-teal-400/50 hover:border-teal-400 hover:bg-teal-400/10
                     transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Share size={20} />
                        {isSharing ? 'SHARING...' : 'SHARE TICKET'}
                    </button>

                    <button
                        onClick={handleViewTicket}
                        className="w-full bg-transparent text-white font-semibold py-4 px-6 rounded-2xl 
                     border border-white/30 hover:border-white/50 hover:bg-white/5
                     transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-3"
                    >
                        <Eye size={20} />
                        VIEW TICKET
                    </button>
                </div>
            )}
        </div>
    );
}

export default function BookingCompletePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading...</p>
                </div>
            </div>
        }>
            <BookingCompleteContent />
        </Suspense>
    );
}