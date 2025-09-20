'use client';

import React from 'react';
import { ChevronRight, CreditCard, Smartphone, Building, Banknote } from 'lucide-react';

export default function PaymentOptions() {
    const handlePaymentSelect = (method: string) => {
        console.log(`Selected payment method: ${method}`);
        // Handle payment method selection
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white p-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Choose your Payment Option</h1>
                </div>

                {/* Cards Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Cards</h2>
                        <div className="h-px bg-teal-400 flex-1 ml-4"></div>
                    </div>

                    <button
                        onClick={() => handlePaymentSelect('credit-card')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CreditCard className="w-6 h-6 text-teal-400 mr-3" />
                                <span className="text-white font-medium">Add credit or debit cards</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-teal-400 font-semibold mr-2">ADD</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* UPI Apps Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Pay by UPI apps</h2>
                        <div className="h-px bg-teal-400 flex-1 ml-4"></div>
                    </div>

                    <button
                        onClick={() => handlePaymentSelect('google-pay')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-white rounded-sm mr-3 flex items-center justify-center">
                                    <span className="text-xs font-bold text-red-500">G</span>
                                </div>
                                <span className="text-white font-medium">Choose payment options</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/60" />
                        </div>
                    </button>

                    <button
                        onClick={() => handlePaymentSelect('phonepe')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-purple-600 rounded-sm mr-3 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">℗</span>
                                </div>
                                <span className="text-white font-medium">Choose payment options</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/60" />
                        </div>
                    </button>

                    <button
                        onClick={() => handlePaymentSelect('upi-id')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Smartphone className="w-6 h-6 text-teal-400 mr-3" />
                                <span className="text-white font-medium">Add new UPI ID</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-teal-400 font-semibold mr-2">ADD</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Internet Banking Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Internet Banking</h2>
                        <div className="h-px bg-teal-400 flex-1 ml-4"></div>
                    </div>

                    <button
                        onClick={() => handlePaymentSelect('netbanking')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Building className="w-6 h-6 text-teal-400 mr-3" />
                                <span className="text-white font-medium">Netbanking</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-teal-400 font-semibold mr-2">ADD</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Pay at Venue Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">pay at the venue</h2>
                        <div className="h-px bg-teal-400 flex-1 ml-4"></div>
                    </div>

                    <button
                        onClick={() => handlePaymentSelect('pay-at-venue')}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Banknote className="w-6 h-6 text-teal-400 mr-3" />
                                <span className="text-white font-medium">pay at the club Entry</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/60" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}