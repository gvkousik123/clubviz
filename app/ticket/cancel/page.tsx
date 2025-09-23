'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function TicketCancelPage() {
    const router = useRouter();

    const handleProceedToHome = () => {
        router.push('/home');
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-600 via-teal-700 to-dark-900 text-white relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-semibold tracking-wide text-center flex-1 mr-10">
                    CANCEL TICKET
                </h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
                {/* Success Icon */}
                <div className="relative mb-12">
                    {/* Outer glow circle */}
                    <div className="absolute inset-0 w-32 h-32 bg-teal-400/20 rounded-full blur-xl"></div>

                    {/* Main circle with ticket icon */}
                    <div className="relative w-28 h-28 bg-teal-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-400/30">
                        {/* Ticket with checkmark icon */}
                        <div className="relative">
                            {/* Ticket outline - more detailed and accurate */}
                            <svg width="52" height="40" viewBox="0 0 52 40" fill="none" className="text-teal-300">
                                {/* Main ticket body */}
                                <path
                                    d="M6 6h40c1.1 0 2 .9 2 2v6c-2.21 0-4 1.79-4 4s1.79 4 4 4v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6c2.21 0 4-1.79 4-4s-1.79-4-4-4V8c0-1.1.9-2 2-2z"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    fill="rgba(45, 212, 191, 0.1)"
                                />
                                {/* Ticket details lines */}
                                <line x1="12" y1="12" x2="34" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                                <line x1="12" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                                <line x1="12" y1="24" x2="34" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                                <line x1="12" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                            </svg>

                            {/* Checkmark overlay */}
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-400 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle size={18} className="text-white" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message Card */}
                <div className="w-full max-w-sm">
                    <div className="bg-teal-600/20 backdrop-blur-md rounded-2xl p-6 border border-teal-400/20 mb-8 shadow-xl">
                        <h2 className="text-xl font-semibold text-center mb-4 text-white">
                            Your ticket cancellation was successful
                        </h2>

                        <p className="text-sm text-gray-200 text-center leading-relaxed">
                            Ticket cancellation was successful! Your cancellation request has been processed. If you have further questions or need additional assistance, feel free to contact our support team. Thank you for using our service!
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                <button
                    onClick={handleProceedToHome}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-4 px-6 rounded-2xl 
                   shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                   transform hover:scale-[1.02] transition-all duration-300 
                   border border-teal-400/20 backdrop-blur-sm"
                >
                    PROCEED TO HOMEPAGE
                </button>
            </div>
        </div>
    );
}