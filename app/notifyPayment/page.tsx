'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentGatewayService } from '@/lib/services/payment-gateway.service';
import { TicketService } from '@/lib/services/ticket.service';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

function NotifyPaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
    const [message, setMessage] = useState('Generating your ticket...');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);

    useEffect(() => {
        const generateTicket = async () => {
            try {
                // FIRST: Try to get from sessionStorage (where we store it before payment)
                let orderIdParam = sessionStorage.getItem('paymentOrderId') ||
                    localStorage.getItem('paymentOrderId') ||
                    localStorage.getItem('latestOrderId');

                // Fallback: Try URL param if not in storage
                if (!orderIdParam) {
                    orderIdParam = searchParams.get('order_id');
                }

                if (!orderIdParam) {
                    setStatus('failed');
                    setMessage('No order ID found. Please try booking again.');
                    return;
                }

                setOrderId(orderIdParam);
                setMessage('Generating your ticket...');

                console.log('🎫 Calling generate ticket API with orderId:', orderIdParam);

                // Call generate ticket API - it handles payment verification internally
                const generateResponse = await PaymentGatewayService.generateTicket({
                    orderId: orderIdParam
                });

                console.log('✅ Generate ticket response:', generateResponse);

                if (generateResponse.success && generateResponse.data) {
                    setStatus('success');

                    // Extract ticket ID from response
                    const generatedTicketId = generateResponse.data.ticketId ||
                        generateResponse.data.id ||
                        generateResponse.data.ticket?.ticketId;

                    if (generatedTicketId) {
                        setTicketId(generatedTicketId);
                        setMessage('Ticket generated successfully!');
                    } else {
                        setMessage('Payment successful! Ticket created.');
                    }

                } else if (generateResponse.message?.includes('failed') ||
                    generateResponse.message?.includes('FAILED')) {
                    // Payment failed - STAY on this page
                    setStatus('failed');
                    setMessage(generateResponse.message || 'Payment verification failed. Please try again.');
                } else {
                    setStatus('success');
                    setMessage('Payment successful! Check your tickets in your account.');
                }

            } catch (error: any) {
                console.error('❌ Ticket generation error:', error);
                // STAY on this page even if API fails
                setStatus('failed');
                setMessage(error.response?.data?.message || error.message || 'Failed to generate ticket. Please contact support with order ID: ' + orderId);
            }
        };

        generateTicket();
    }, [searchParams]);

    const handleViewTickets = () => {
        // Navigate to bookings page
        if (ticketId) {
            router.push(`/account/bookings?highlight=${ticketId}`);
        } else {
            router.push('/account/bookings');
        }
    };

    const handleBackToBooking = () => {
        // Go back to booking/events page
        router.push('/events');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-3xl p-8 text-center">
                {status === 'checking' ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <Loader2 className="w-16 h-16 text-[#14FFEC] animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Verifying Payment</h1>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <div className="text-sm text-gray-500">
                            Please wait while we confirm your payment...
                        </div>
                    </>
                ) : status === 'success' ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <CheckCircle2 className="w-20 h-20 text-[#14FFEC]" />
                                <div className="absolute inset-0 bg-[#14FFEC]/20 rounded-full blur-xl"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                        <p className="text-gray-400 mb-6">{message}</p>

                        {orderId && (
                            <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Order ID</span>
                                    <span className="text-white text-sm font-mono">{orderId}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleViewTickets}
                                className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-full hover:bg-[#14FFEC]/80 transition-all shadow-lg shadow-[#14FFEC]/20"
                            >
                                View Your Tickets
                            </button>

                            <button
                                onClick={handleBackToBooking}
                                className="w-full bg-transparent border-2 border-[#14FFEC]/30 text-[#14FFEC] font-bold py-4 rounded-full hover:border-[#14FFEC] transition-all"
                            >
                                Back to Events
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            A confirmation email has been sent to your registered email address
                        </p>
                    </>
                ) : status === 'failed' ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <XCircle className="w-20 h-20 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
                        <p className="text-gray-400 mb-6">{message}</p>

                        {orderId && (
                            <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Order ID</span>
                                    <span className="text-white text-sm font-mono">{orderId}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleBackToBooking}
                                className="w-full bg-red-500 text-white font-bold py-4 rounded-full hover:bg-red-600 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <Clock className="w-20 h-20 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Payment Pending</h1>
                        <p className="text-gray-400 mb-6">{message}</p>

                        <div className="space-y-3">
                            <button
                                onClick={handleViewTickets}
                                className="w-full bg-yellow-500 text-black font-bold py-4 rounded-full hover:bg-yellow-600 transition-all"
                            >
                                Check Booking History
                            </button>

                            <button
                                onClick={handleBackToBooking}
                                className="w-full bg-transparent border-2 border-yellow-500/30 text-yellow-500 font-bold py-4 rounded-full hover:border-yellow-500 transition-all"
                            >
                                Back to Events
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function NotifyPaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-3xl p-8">
                    {/* Skeleton Loading */}
                    <div className="flex justify-center mb-6">
                        <Loader2 className="w-16 h-16 text-[#14FFEC] animate-spin" />
                    </div>
                    <div className="space-y-4 animate-pulse">
                        <div className="h-8 bg-gray-700/30 rounded-lg w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-700/30 rounded-lg w-full"></div>
                        <div className="h-4 bg-gray-700/30 rounded-lg w-5/6 mx-auto"></div>
                        <div className="h-20 bg-gray-700/30 rounded-lg w-full mt-6"></div>
                    </div>
                </div>
            </div>
        }>
            <NotifyPaymentContent />
        </Suspense>
    );
}
