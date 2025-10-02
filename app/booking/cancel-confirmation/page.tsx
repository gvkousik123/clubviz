'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function CancelConfirmationPage() {
    const router = useRouter();

    const handleGoToHome = () => {
        router.push('/home');
    };

    const handleGoBack = () => {
        router.back();
    };

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
                        CANCELLATION CONFIRMED
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                {/* Success Icon */}
                <div className="relative mb-12">
                    {/* Outer glow circle */}
                    <div className="absolute inset-0 w-32 h-32 bg-teal-400/20 rounded-full blur-xl"></div>

                    {/* Main circle with checkmark icon */}
                    <div className="relative w-28 h-28 bg-teal-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-400/30">
                        <CheckCircle size={48} className="text-teal-300" fill="currentColor" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-6 mb-12">
                    <h2 className="text-2xl font-bold text-white">
                        Ticket Cancelled Successfully
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed max-w-sm">
                        Your ticket for BOILER ROOM has been cancelled. You will receive a refund within 3-5 business days.
                    </p>
                </div>

                {/* Refund Details */}
                <div className="w-full max-w-sm bg-[#222831] rounded-2xl p-6 mb-8">
                    <h3 className="text-white font-medium mb-4 text-center">Refund Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-sm">Original Amount</span>
                            <span className="text-white">₹1,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-sm">Cancellation Fee</span>
                            <span className="text-white">₹0</span>
                        </div>
                        <div className="border-t border-gray-600 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-white font-medium">Refund Amount</span>
                                <span className="text-teal-400 font-bold text-lg">₹1,200</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="w-full max-w-sm bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 mb-8">
                    <h4 className="text-blue-400 font-medium mb-2">📧 Email Confirmation</h4>
                    <p className="text-white/70 text-sm">
                        A confirmation email has been sent to your registered email address with all the details.
                    </p>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 pb-8">
                <button
                    onClick={handleGoToHome}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all duration-300"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}