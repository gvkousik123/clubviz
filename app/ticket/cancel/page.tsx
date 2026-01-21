'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTicket } from '@/hooks/use-ticket';

export default function TicketCancelPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId');

    const { ticket, cancelTicket, loading } = useTicket(ticketId);
    const [reason, setReason] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

    const cancellationReasons = [
        'Change of plans',
        'Unable to attend',
        'Found a better alternative',
        'Event rescheduled',
        'Personal emergency',
        'Other'
    ];

    const handleGoBack = () => {
        router.back();
    };

    const handleConfirmCancel = async () => {
        if (!selectedReason && !reason) {
            alert('Please select or enter a reason for cancellation');
            return;
        }

        const finalReason = selectedReason === 'Other' ? reason : selectedReason;

        const result = await cancelTicket({
            reason: finalReason,
            additionalNotes: additionalNotes || undefined,
        });

        if (result) {
            // Navigate to success page
            router.push('/ticket/cancelled');
        }
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
                    CANCEL TICKET
                </h1>
            </div>

            <div className="px-6 py-8 space-y-6">
                {/* Warning Card */}
                <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="text-red-400 font-semibold mb-2">
                            Are you sure you want to cancel?
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Once cancelled, this ticket cannot be reactivated.
                            Refunds will be processed according to our cancellation policy.
                        </p>
                    </div>
                </div>

                {/* Ticket Info */}
                {ticket && (
                    <div className="bg-dark-800/50 border border-primary-400/20 rounded-2xl p-6">
                        <h3 className="text-white font-semibold mb-4">Ticket Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Event:</span>
                                <span className="text-white">{ticket.eventTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Ticket Type:</span>
                                <span className="text-white">{ticket.ticketType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Ticket Number:</span>
                                <span className="text-white font-mono">{ticket.ticketNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Price:</span>
                                <span className="text-white">₹{ticket.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancellation Reason */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold">Reason for Cancellation *</h3>

                    <div className="space-y-2">
                        {cancellationReasons.map((reasonOption) => (
                            <button
                                key={reasonOption}
                                onClick={() => setSelectedReason(reasonOption)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${selectedReason === reasonOption
                                        ? 'bg-primary-600/20 border-primary-400 text-white'
                                        : 'bg-dark-800/50 border-gray-700 text-gray-300 hover:border-primary-400/50'
                                    }`}
                            >
                                {reasonOption}
                            </button>
                        ))}
                    </div>

                    {selectedReason === 'Other' && (
                        <input
                            type="text"
                            placeholder="Please specify your reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-primary-400 focus:outline-none transition-colors"
                        />
                    )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold">Additional Notes (Optional)</h3>
                    <textarea
                        placeholder="Any additional information..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                    />
                </div>

                {/* Refund Policy */}
                <div className="bg-dark-800/50 border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-3">Refund Policy</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Cancellations made 7+ days before event: 100% refund</li>
                        <li>• Cancellations made 3-7 days before event: 50% refund</li>
                        <li>• Cancellations made less than 3 days before event: No refund</li>
                        <li>• Refunds will be processed within 5-7 business days</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="flex-1 bg-dark-800 border border-gray-700 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-dark-700 transition-all duration-300"
                    >
                        Keep Ticket
                    </button>
                    <button
                        onClick={handleConfirmCancel}
                        disabled={loading || (!selectedReason && !reason)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
    );
}
