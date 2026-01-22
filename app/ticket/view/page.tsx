'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Share, Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { useTicket } from '@/hooks/use-ticket';
import { useState, Suspense } from 'react';

function TicketViewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId');

    const { ticket, loading, downloadTicket, shareTicket } = useTicket(ticketId);
    const [isSharing, setIsSharing] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const handleDownload = async () => {
        await downloadTicket();
    };

    const handleShare = async () => {
        if (!ticketId) return;

        setIsSharing(true);

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: ticket?.eventTitle || 'My Event Ticket',
                    text: `Check out my ticket for ${ticket?.eventTitle || 'this amazing event'}!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback to copying link
            try {
                await navigator.clipboard.writeText(window.location.href);
                // Also share via email as fallback
                await shareTicket({
                    platform: 'email',
                    message: `Check out my ticket for ${ticket?.eventTitle || 'this event'}!`,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        }

        setIsSharing(false);
    };

    const handleCancelTicket = () => {
        if (ticketId) {
            router.push(`/ticket/cancel?ticketId=${ticketId}`);
        }
    };

    // Loading state
    if (loading && !ticket) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-dark-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto mb-4" />
                    <p className="text-gray-300">Loading ticket details...</p>
                </div>
            </div>
        );
    }

    // No ticket found
    if (!ticket && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-dark-950 text-white flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-xl text-gray-300 mb-6">Ticket not found</p>
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-dark-950 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-semibold tracking-wide text-center flex-1 mr-10">
                    MY TICKET
                </h1>
            </div>

            {/* Ticket Container */}
            <div className="px-6 py-8">
                <div className="bg-gradient-to-br from-primary-600/20 to-cyan-600/20 backdrop-blur-md rounded-3xl p-6 border border-primary-400/20 relative overflow-hidden">
                    {/* Status Badge */}
                    {ticket && (
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                                ticket.status === 'USED' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' :
                                    ticket.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border border-red-400/30' :
                                        'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                                }`}>
                                {ticket.status}
                            </span>
                        </div>
                    )}

                    {/* QR Code Section */}
                    <div className="text-center mb-6">
                        <div className="w-32 h-32 bg-white/90 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                            {ticket?.qrCode ? (
                                <img
                                    src={ticket.qrCode}
                                    alt="QR Code"
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-dark-900 rounded-lg grid grid-cols-8 gap-[1px] p-1">
                                    {Array.from({ length: 64 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-dark-900'} rounded-[1px]`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-300">Scan this QR code at the venue</p>
                    </div>

                    {/* Event Details */}
                    {ticket && (
                        <div className="space-y-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {ticket.eventTitle}
                                </h2>
                                <p className="text-primary-400 font-medium">{ticket.ticketType}</p>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <MapPin size={18} className="text-primary-400" />
                                <span>{ticket.venue.name}, {ticket.venue.address}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <Calendar size={18} className="text-primary-400" />
                                <span>{formatDate(ticket.eventDate)}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <Clock size={18} className="text-primary-400" />
                                <span>{formatTime(ticket.eventDate)}</span>
                            </div>
                        </div>
                    )}

                    {/* Ticket Details */}
                    {ticket && (
                        <div className="border-t border-primary-400/20 pt-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Ticket ID:</span>
                                <span className="text-white font-mono">{ticket.ticketNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Booking ID:</span>
                                <span className="text-white font-mono">{ticket.bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Price:</span>
                                <span className="text-white">₹{ticket.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Purchased:</span>
                                <span className="text-white">{formatDate(ticket.purchaseDate)}</span>
                            </div>
                        </div>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full -ml-12 -mb-12"></div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleDownload}
                        disabled={loading || ticket?.status !== 'ACTIVE'}
                        className="bg-primary-600/20 border border-primary-400/40 text-white font-semibold py-3 px-4 rounded-2xl 
                     hover:bg-primary-600/30 transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={18} />}
                        Download
                    </button>

                    <button
                        onClick={handleShare}
                        disabled={isSharing || loading || ticket?.status !== 'ACTIVE'}
                        className="bg-primary-600/20 border border-primary-400/40 text-white font-semibold py-3 px-4 rounded-2xl 
                     hover:bg-primary-600/30 transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share size={18} />}
                        Share
                    </button>
                </div>

                <button
                    onClick={handleCancelTicket}
                    disabled={ticket?.status !== 'ACTIVE'}
                    className="w-full bg-red-600/20 border border-red-400/40 text-red-400 font-semibold py-4 px-6 rounded-2xl 
                   hover:bg-red-600/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel Ticket
                </button>
            </div>
        </div>
    );
}

export default function TicketViewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-dark-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto mb-4" />
                    <p className="text-gray-300">Loading ticket details...</p>
                </div>
            </div>
        }>
            <TicketViewContent />
        </Suspense>
    );
}