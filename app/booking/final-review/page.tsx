'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, Shirt, Phone, Mail, Ticket, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function FinalBookingReviewPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState({
        earlyBirdMale: 1,
        earlyBirdCouple: 1
    });

    const ticketPrices = {
        earlyBirdMale: 1750,
        earlyBirdCouple: 3500
    };

    const handleGoBack = () => {
        router.push('/home');
    };

    const handleTicketChange = (type: string, change: number) => {
        setTickets(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type as keyof typeof prev] + change)
        }));
    };

    const calculateTotal = () => {
        return (tickets.earlyBirdMale * ticketPrices.earlyBirdMale) +
            (tickets.earlyBirdCouple * ticketPrices.earlyBirdCouple);
    };

    const totalTickets = tickets.earlyBirdMale + tickets.earlyBirdCouple;

    const handleSlideToPayComplete = () => {
        router.push('/ticket/complete');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-6">
                <div className="flex items-center justify-between p-6 pt-12">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        REVIEW EVENT BOOKING
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6 pb-32">
                {/* Club Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base">Club Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Ticket size={16} className="text-teal-400" />
                            <span className="text-white">Timeless Tuesdays Ft. DJ Xpensive</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
                            <span className="text-white">Dabo club & kitchen, Nagpur</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-teal-400 rounded-sm"></div>
                            <span className="text-white">24 Dec | 7:00 pm</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shirt size={16} className="text-teal-400" />
                            <span className="text-white">Dress Code - Funky Pop</span>
                        </div>
                    </div>
                </div>

                {/* Send Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base">Send Details to</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-teal-400" />
                            <span className="text-white">test@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-teal-400" />
                            <span className="text-white">+91 9XXXX9XXXXX</span>
                        </div>
                    </div>
                </div>

                {/* Selected Ticket Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base">Selected Ticket</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Early Bird Male Pass */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Ticket size={16} className="text-teal-400" />
                                <span className="text-white text-sm">Early bird male pass</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleTicketChange('earlyBirdMale', 1)}
                                    className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
                                >
                                    <Plus size={16} className="text-white" />
                                </button>
                                <span className="text-white font-medium w-8 text-center">
                                    {tickets.earlyBirdMale}
                                </span>
                                <button
                                    onClick={() => handleTicketChange('earlyBirdMale', -1)}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
                                >
                                    <Minus size={16} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Early Bird Couple Pass */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Ticket size={16} className="text-teal-400" />
                                <span className="text-white text-sm">Early bird Couple pass</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleTicketChange('earlyBirdCouple', 1)}
                                    className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
                                >
                                    <Plus size={16} className="text-white" />
                                </button>
                                <span className="text-white font-medium w-8 text-center">
                                    {tickets.earlyBirdCouple}
                                </span>
                                <button
                                    onClick={() => handleTicketChange('earlyBirdCouple', -1)}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
                                >
                                    <Minus size={16} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Dotted separator */}
                        <div className="border-t border-dashed border-gray-600 my-4"></div>

                        {/* Total Tickets */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Ticket size={16} className="text-teal-400" />
                                <span className="text-white font-medium">Total Tickets</span>
                            </div>
                            <span className="text-white font-bold text-lg">{totalTickets}</span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base">Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Ticket size={16} className="text-teal-400" />
                                <span className="text-white text-sm">Ticket Price</span>
                            </div>
                            <span className="text-white font-medium">₹ {calculateTotal()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
                                <span className="text-white text-sm">Total Cover</span>
                            </div>
                            <span className="text-white font-medium">₹ {calculateTotal()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Payment Section */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
                <div className="px-6 py-6">
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-1 shadow-lg shadow-teal-500/25">
                        <div className="flex items-center justify-between bg-black/20 backdrop-blur-sm rounded-3xl p-4">
                            {/* Pay Amount */}
                            <div className="bg-black/40 rounded-2xl px-4 py-2">
                                <span className="text-teal-400 text-sm font-medium">
                                    PAY: ₹ {calculateTotal()}
                                </span>
                            </div>

                            {/* Slide to Pay */}
                            <button
                                onClick={handleSlideToPayComplete}
                                className="flex items-center gap-3 bg-white/90 text-black font-bold py-3 px-6 rounded-2xl 
                         hover:bg-white transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center gap-2">
                                    <ChevronRight size={20} />
                                    <ChevronRight size={20} className="-ml-3" />
                                </div>
                                <span>Slide to Pay</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}