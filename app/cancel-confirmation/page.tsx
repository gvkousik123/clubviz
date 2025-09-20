'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, X, CheckCircle } from 'lucide-react';

export default function CancelConfirmationPage() {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const ticketDetails = {
        eventName: "Timeless Tuesdays Ft. DJ Xpensive",
        venue: "Dabo club & Kitchen, Nagpur",
        date: "24 Dec 17:00 pm",
        tickets: [
            { type: "Early bird male pass", quantity: 1, price: 3500 },
            { type: "Early bird Couple pass", quantity: 1, price: 3500 }
        ],
        totalAmount: 7000,
        refundAmount: 6300, // 10% cancellation fee
        bookingId: "CV2024001234"
    };

    const handleCancel = () => {
        setIsCancelled(true);
        setShowConfirmModal(false);
    };

    if (isCancelled) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pt-12">
                    <Link href="/tickets">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <h1 className="text-white text-lg font-semibold">Ticket Cancelled</h1>
                    <div className="w-6" />
                </div>

                {/* Success Message */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-sm">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>

                        <h2 className="text-white text-2xl font-bold mb-4">Ticket Cancelled Successfully</h2>
                        <p className="text-white/60 mb-8 leading-relaxed">
                            Your ticket has been cancelled and the refund amount will be credited to your account within 3-5 business days.
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Booking ID</span>
                                    <span className="text-white">{ticketDetails.bookingId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Original Amount</span>
                                    <span className="text-white">₹{ticketDetails.totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Cancellation Fee</span>
                                    <span className="text-red-400">₹{ticketDetails.totalAmount - ticketDetails.refundAmount}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-white font-semibold">Refund Amount</span>
                                        <span className="text-green-400 font-semibold">₹{ticketDetails.refundAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/clubs">
                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                                Continue Exploring
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/tickets">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">Cancel Ticket</h1>
                <div className="w-6" />
            </div>

            {/* Warning Message */}
            <div className="px-6 mb-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-red-400 font-semibold mb-2">Cancellation Policy</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Tickets can be cancelled up to 24 hours before the event. A cancellation fee of 10% will be deducted from your refund amount.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Details */}
            <div className="px-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                        <h3 className="text-white text-xl font-bold mb-2">{ticketDetails.eventName}</h3>
                        <p className="text-white/90">{ticketDetails.venue}</p>
                        <p className="text-white/90">{ticketDetails.date}</p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4 mb-6">
                            <h4 className="text-white font-semibold">Ticket Details</h4>
                            {ticketDetails.tickets.map((ticket, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-white/80">{ticket.type}</span>
                                    <span className="text-white">₹{ticket.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-white/60">Total Amount</span>
                                <span className="text-white">₹{ticketDetails.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Cancellation Fee (10%)</span>
                                <span className="text-red-400">- ₹{ticketDetails.totalAmount - ticketDetails.refundAmount}</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-3">
                                <span className="text-white font-semibold">Refund Amount</span>
                                <span className="text-green-400 font-semibold">₹{ticketDetails.refundAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Information */}
            <div className="px-6 mb-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <h4 className="text-blue-400 font-semibold mb-3">Refund Information</h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                        <li>• Refund will be processed within 3-5 business days</li>
                        <li>• Amount will be credited to your original payment method</li>
                        <li>• You will receive an email confirmation once processed</li>
                        <li>• Partial cancellations are not allowed</li>
                    </ul>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-8 space-y-4">
                <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                >
                    Cancel Ticket
                </button>

                <Link href="/tickets">
                    <button className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                        Keep Ticket
                    </button>
                </Link>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-slate-800 rounded-2xl border border-white/20 p-6 w-full max-w-sm">
                        <div className="text-center mb-6">
                            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">Confirm Cancellation</h3>
                            <p className="text-white/60">
                                Are you sure you want to cancel this ticket? This action cannot be undone.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCancel}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                Yes, Cancel Ticket
                            </button>

                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                            >
                                No, Keep Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}