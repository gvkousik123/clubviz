'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share, Calendar, MapPin, Clock } from 'lucide-react';

export default function TicketViewPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleDownload = () => {
        // Implement download functionality
        console.log('Download ticket');
    };

    const handleShare = () => {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: 'My Event Ticket',
                text: 'Check out my ticket for this amazing event!',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleCancelTicket = () => {
        router.push('/ticket/cancel');
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
                    {/* QR Code Section */}
                    <div className="text-center mb-6">
                        <div className="w-32 h-32 bg-white/90 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            {/* Simple QR Code placeholder */}
                            <div className="w-24 h-24 bg-dark-900 rounded-lg grid grid-cols-8 gap-[1px] p-1">
                                {Array.from({ length: 64 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-dark-900'} rounded-[1px]`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-300">Scan this QR code at the venue</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Freaky Friday with DJ Alexxx
                            </h2>
                            <p className="text-primary-400 font-medium">Electronic • Techno</p>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                            <MapPin size={18} className="text-primary-400" />
                            <span>DABO, Airport Road, Nagpur</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                            <Calendar size={18} className="text-primary-400" />
                            <span>Friday, April 04, 2025</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                            <Clock size={18} className="text-primary-400" />
                            <span>10:00 PM - 2:00 AM</span>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="border-t border-primary-400/20 pt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Ticket ID:</span>
                            <span className="text-white font-mono">#TKT-2025-0404</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Entry Gate:</span>
                            <span className="text-white">Gate A</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Price:</span>
                            <span className="text-white">₹1,500</span>
                        </div>
                    </div>

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
                        className="bg-primary-600/20 border border-primary-400/40 text-white font-semibold py-3 px-4 rounded-2xl 
                     hover:bg-primary-600/30 transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Download
                    </button>

                    <button
                        onClick={handleShare}
                        className="bg-primary-600/20 border border-primary-400/40 text-white font-semibold py-3 px-4 rounded-2xl 
                     hover:bg-primary-600/30 transition-all duration-300 backdrop-blur-sm
                     flex items-center justify-center gap-2"
                    >
                        <Share size={18} />
                        Share
                    </button>
                </div>

                <button
                    onClick={handleCancelTicket}
                    className="w-full bg-red-600/20 border border-red-400/40 text-red-400 font-semibold py-4 px-6 rounded-2xl 
                   hover:bg-red-600/30 transition-all duration-300 backdrop-blur-sm"
                >
                    Cancel Ticket
                </button>
            </div>
        </div>
    );
}