'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';

export default function CancelTicketPage() {
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    const handleGoBack = () => {
        router.back();
    };

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        if (reason !== 'other') {
            setCustomReason('');
        }
    };

    const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomReason(e.target.value);
    };

    const handleConfirmCancel = () => {
        router.push('/booking/cancel-confirmation');
    };

    const cancellationReasons = [
        'I want to book another event',
        'Colliding with other event',
        'Accidentally booked this event.',
        'There is no vibe in this Event/Venue',
        'I just want to cancel',
        'other'
    ];

    const isReasonSelected = selectedReason && (selectedReason !== 'other' || customReason.trim().length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        CANCEL TICKET
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-8">
                {/* Notification Banner */}
                <div className="bg-teal-600/20 border border-teal-400/30 rounded-2xl p-4 flex items-center gap-3">
                    <CreditCard size={20} className="text-teal-400" />
                    <p className="text-white text-sm font-medium">
                        Funds will reflect in your account in 3-4 working days
                    </p>
                </div>

                {/* Ticket Info */}
                <div className="bg-[#222831] rounded-2xl p-4">
                    <div className="space-y-2">
                        <h2 className="text-white font-bold text-lg">BOILER ROOM</h2>
                        <p className="text-white/70 text-sm">Tonight • 9:00 PM onwards</p>
                        <p className="text-white/70 text-sm">DABO Club & Kitchen</p>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-white/70 text-sm">Entry Ticket x 1</span>
                            <span className="text-teal-400 font-bold">₹1,200</span>
                        </div>
                    </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-4">
                    <h3 className="text-orange-400 font-medium mb-2">Cancellation Policy</h3>
                    <ul className="text-white/70 text-sm space-y-1">
                        <li>• Free cancellation up to 2 hours before event</li>
                        <li>• 50% refund if cancelled within 2 hours</li>
                        <li>• No refund after event starts</li>
                    </ul>
                </div>

                {/* Reason Selection */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">Why are you cancelling?</h3>
                    <div className="space-y-3">
                        {cancellationReasons.map((reason) => (
                            <button
                                key={reason}
                                onClick={() => handleReasonSelect(reason)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${selectedReason === reason
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-[#222831] text-white hover:bg-[#2a2a38]'
                                    }`}
                            >
                                <span className="font-medium">
                                    {reason === 'other' ? 'Other reason' : reason}
                                </span>
                                {selectedReason === reason && (
                                    <Check size={20} className="text-white" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Custom Reason Input */}
                    {selectedReason === 'other' && (
                        <div className="space-y-2">
                            <label className="text-white font-medium text-sm">Please specify your reason</label>
                            <textarea
                                value={customReason}
                                onChange={handleCustomReasonChange}
                                placeholder="Enter your reason for cancellation..."
                                className="w-full bg-[#222831] text-white p-4 rounded-2xl border border-gray-600 focus:border-teal-400 focus:outline-none resize-none h-24 placeholder:text-white/50"
                            />
                        </div>
                    )}
                </div>

                {/* Refund Information */}
                <div className="bg-[#1a1a24] rounded-2xl p-4">
                    <h3 className="text-white font-medium mb-3">Refund Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-sm">Original Amount</span>
                            <span className="text-white">₹1,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-sm">Cancellation Fee</span>
                            <span className="text-white">₹0</span>
                        </div>
                        <div className="border-t border-gray-600 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-white font-medium">Refund Amount</span>
                                <span className="text-teal-400 font-bold text-lg">₹1,200</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-white/70 text-xs mt-3">
                        Refund will be processed within 3-5 business days to your original payment method.
                    </p>
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
                    <h3 className="text-red-400 font-medium mb-2">⚠️ Important</h3>
                    <p className="text-white/70 text-sm">
                        Once you confirm cancellation, this action cannot be undone. You will lose access to the event.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 pb-8">
                    <button
                        onClick={handleConfirmCancel}
                        disabled={!isReasonSelected}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        Confirm Cancellation
                    </button>
                    <button
                        onClick={handleGoBack}
                        className="w-full bg-[#222831] hover:bg-[#2a2a38] text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        Keep My Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}