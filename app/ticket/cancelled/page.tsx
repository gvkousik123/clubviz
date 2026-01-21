'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Home, Calendar } from 'lucide-react';

export default function TicketCancelledPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/home');
    };

    const handleViewEvents = () => {
        router.push('/events');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-dark-950 text-white flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/40">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white">
                        Ticket Cancelled
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Your ticket has been successfully cancelled
                    </p>
                </div>

                {/* Refund Information */}
                <div className="bg-primary-600/10 border border-primary-400/30 rounded-2xl p-6 text-left">
                    <h3 className="text-white font-semibold mb-3">What happens next?</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>✓ Your refund is being processed</li>
                        <li>✓ Refund will be credited to your original payment method</li>
                        <li>✓ Processing time: 5-7 business days</li>
                        <li>✓ You will receive a confirmation email shortly</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Back to Home
                    </button>

                    <button
                        onClick={handleViewEvents}
                        className="w-full bg-dark-800 border border-gray-700 hover:bg-dark-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Calendar size={20} />
                        Browse Events
                    </button>
                </div>
            </div>
        </div>
    );
}
