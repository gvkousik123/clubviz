'use client';

import React, { useState } from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CancelTicketPage() {
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState('');

    const cancellationReasons = [
        'I want to book another event',
        'Colliding with other event',
        'Accidentally booked this event.',
        'Another reason',
        'There is no vibe in this Event/Venue',
        'I just want to cancel'
    ];

    const handleCancel = () => {
        if (selectedReason) {
            // Process cancellation
            router.push('/tickets/cancelled');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-6">
                <div className="flex items-center mb-4">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">CANCEL TICKET</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                {/* Refund Notice */}
                <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-4 mb-8 flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-teal-400" />
                    <div>
                        <p className="text-white font-medium">Funds will reflect in your account in</p>
                        <p className="text-teal-400 font-bold">3-4 working days</p>
                    </div>
                </div>

                {/* Reason Selection */}
                <div>
                    <h2 className="text-white text-xl font-semibold mb-6">Select the reason for cancellation</h2>

                    <div className="space-y-4">
                        {cancellationReasons.map((reason, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-4 cursor-pointer group"
                            >
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="cancellation-reason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${selectedReason === reason
                                            ? 'border-teal-400 bg-teal-400'
                                            : 'border-white/40 group-hover:border-teal-400/60'
                                        }`}>
                                        {selectedReason === reason && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-lg transition-colors ${selectedReason === reason ? 'text-white' : 'text-white/80'
                                    }`}>
                                    {reason}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cancel Button */}
            <div className="p-4">
                <button
                    onClick={handleCancel}
                    disabled={!selectedReason}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${selectedReason
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    CANCEL TICKET
                </button>
            </div>
        </div>
    );
}