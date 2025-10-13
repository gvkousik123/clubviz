'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function EventBookingPage() {
    const router = useRouter();
    const [selectedEntry, setSelectedEntry] = useState('entry');
    const [entryTickets, setEntryTickets] = useState(1);
    const [vipTickets, setVipTickets] = useState(0);

    const handleGoBack = () => {
        router.back();
    };

    const handleEntryTypeSelect = (type: string) => {
        setSelectedEntry(type);
    };

    const handleTicketChange = (type: 'entry' | 'vip', increment: boolean) => {
        if (type === 'entry') {
            if (increment) {
                setEntryTickets(entryTickets + 1);
            } else if (entryTickets > 0) {
                setEntryTickets(entryTickets - 1);
            }
        } else {
            if (increment) {
                setVipTickets(vipTickets + 1);
            } else if (vipTickets > 0) {
                setVipTickets(vipTickets - 1);
            }
        }
    };

    const handleContinue = () => {
        router.push('/booking/review');
    };

    const entryPrice = 1200;
    const vipPrice = 2500;
    const totalAmount = (entryTickets * entryPrice) + (vipTickets * vipPrice);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        EVENT BOOKING
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-8">
                {/* Event Info */}
                <div className="text-center space-y-2">
                    <h2 className="text-white text-xl font-bold">BOILER ROOM</h2>
                    <p className="text-white/70 text-sm">Tonight • 9:00 PM onwards</p>
                    <p className="text-white/70 text-sm">DABO Club & Kitchen</p>
                </div>

                {/* Entry Type Selection */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">Select Entry Type</h3>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleEntryTypeSelect('entry')}
                            className={`flex-1 p-4 rounded-2xl transition-all duration-300 ${selectedEntry === 'entry'
                                ? 'bg-teal-600 text-white'
                                : 'bg-[#222831] text-white hover:bg-[#2a2a38]'
                                }`}
                        >
                            <div className="text-center">
                                <div className="font-bold text-lg">Entry</div>
                                <div className="text-teal-400 text-sm">₹1,200</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleEntryTypeSelect('vip')}
                            className={`flex-1 p-4 rounded-2xl transition-all duration-300 ${selectedEntry === 'vip'
                                ? 'bg-teal-600 text-white'
                                : 'bg-[#222831] text-white hover:bg-[#2a2a38]'
                                }`}
                        >
                            <div className="text-center">
                                <div className="font-bold text-lg">VIP</div>
                                <div className="text-teal-400 text-sm">₹2,500</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-6">
                    <h3 className="text-white font-medium text-lg">Select Tickets</h3>

                    {/* Entry Tickets */}
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-white font-medium">Entry Ticket</h4>
                                <p className="text-white/70 text-sm">Regular entry with access to main floor</p>
                                <p className="text-teal-400 font-bold">₹{entryPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-8">
                            <button
                                onClick={() => handleTicketChange('entry', false)}
                                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <Minus size={16} className="text-white" />
                            </button>
                            <span className="text-white text-2xl font-bold">{entryTickets}</span>
                            <button
                                onClick={() => handleTicketChange('entry', true)}
                                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <Plus size={16} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* VIP Tickets */}
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-white font-medium">VIP Ticket</h4>
                                <p className="text-white/70 text-sm">VIP access with exclusive lounge area</p>
                                <p className="text-teal-400 font-bold">₹{vipPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-8">
                            <button
                                onClick={() => handleTicketChange('vip', false)}
                                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <Minus size={16} className="text-white" />
                            </button>
                            <span className="text-white text-2xl font-bold">{vipTickets}</span>
                            <button
                                onClick={() => handleTicketChange('vip', true)}
                                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <Plus size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-[#1a1a24] rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total Amount</span>
                        <span className="text-teal-400 text-xl font-bold">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-white/70 text-sm mt-2">
                        {entryTickets > 0 && `${entryTickets} Entry ticket${entryTickets > 1 ? 's' : ''}`}
                        {entryTickets > 0 && vipTickets > 0 && ' + '}
                        {vipTickets > 0 && `${vipTickets} VIP ticket${vipTickets > 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* Special Offers */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-400/30">
                    <h4 className="text-white font-medium mb-2">Special Offer</h4>
                    <p className="text-white/70 text-sm">Book 3 or more tickets and get 15% off on food & beverages!</p>
                </div>

                {/* Continue Button */}
                <div className="pt-4">
                    <button
                        onClick={handleContinue}
                        disabled={entryTickets === 0 && vipTickets === 0}
                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        {entryTickets === 0 && vipTickets === 0 ? 'Select Tickets' : 'Continue to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
}