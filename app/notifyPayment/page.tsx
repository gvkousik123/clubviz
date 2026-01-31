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
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    useEffect(() => {
        const generateTicket = async () => {
            try {
                // Get order_id from URL or localStorage
                let orderIdParam = searchParams.get('order_id');

                if (!orderIdParam) {
                    // Try to get from localStorage as backup
                    orderIdParam = localStorage.getItem('paymentOrderId') ||
                        localStorage.getItem('latestOrderId');
                }

                if (!orderIdParam) {
                    setStatus('failed');
                    setMessage('No order ID found. Please try booking again.');
                    return;
                }

                setOrderId(orderIdParam);
                setMessage('Generating your ticket...');
                setIsCreatingTicket(true);

                console.log('🎫 Calling generate ticket API with orderId:', orderIdParam);

                // DIRECTLY call generate ticket API - it will handle payment verification internally
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

                    // Clear session and local storage
                    sessionStorage.removeItem('pendingEventBooking');
                    sessionStorage.removeItem('bookingData');
                    localStorage.removeItem('current_payment_order');

                } else if (generateResponse.message?.includes('failed') ||
                    generateResponse.message?.includes('FAILED')) {
                    // Payment failed
                    setStatus('failed');
                    setMessage('Payment verification failed. Please try again.');
                } else {
                    setStatus('success');
                    setMessage('Payment successful! Check your tickets in your account.');
                }

            } catch (error: any) {
                console.error('Ticket generation error:', error);
                setStatus('failed');
                setMessage(error.message || 'Failed to generate ticket. Please contact support.');
            } finally {
                setIsCreatingTicket(false);
            }
        };

        generateTicket();
    }, [searchParams]);

    // Removed handlePaymentNotification - now using internal verification method

    const handleContinue = () => {
        // User manually clicks to view tickets
        if (status === 'success') {
            // Navigate to tickets/bookings page
            if (ticketId) {
                router.push(`/account/bookings?highlight=${ticketId}`);
            } else {
                router.push('/account/bookings');
            }
        } else if (status === 'failed') {
            // Go back to home
            router.push('/');
        } else {
            // For pending, go to booking history
            router.push('/account/bookings');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-3xl p-8 text-center">
                {status === 'checking' || isCreatingTicket ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <Loader2 className="w-16 h-16 text-[#14FFEC] animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">
                            {isCreatingTicket ? 'Creating Ticket' : 'Verifying Payment'}
                        </h1>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <div className="text-sm text-gray-500">
                            Please wait while we {isCreatingTicket ? 'create your ticket' : 'confirm your payment'}...
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

                        {paymentDetails && (
                            <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Order ID</span>
                                    <span className="text-white text-sm font-mono">{paymentDetails.order_id || orderId}</span>
                                </div>
                                {paymentDetails.order_amount && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400 text-sm">Amount Paid</span>
                                        <span className="text-[#14FFEC] text-sm font-bold">
                                            ₹{paymentDetails.order_amount}
                                        </span>
                                    </div>
                                )}
                                {paymentDetails.cf_order_id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">Transaction ID</span>
                                        <span className="text-white text-sm font-mono">{paymentDetails.cf_order_id}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleContinue}
                            className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-full hover:bg-[#14FFEC]/80 transition-all shadow-lg shadow-[#14FFEC]/20"
                        >
                            View Your Tickets
                        </button>

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

                        {paymentDetails && (
                            <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Order ID</span>
                                    <span className="text-white text-sm font-mono">{paymentDetails.order_id || orderId}</span>
                                </div>
                                {paymentDetails.payment_message && (
                                    <div className="mt-2">
                                        <span className="text-gray-400 text-sm block mb-1">Error Message</span>
                                        <span className="text-red-400 text-sm">{paymentDetails.payment_message}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleContinue}
                            className="w-full bg-red-500 text-white font-bold py-4 rounded-full hover:bg-red-600 transition-all"
                        >
                            Try Again
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <Clock className="w-20 h-20 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Payment Pending</h1>
                        <p className="text-gray-400 mb-6">{message}</p>

                        <button
                            onClick={handleContinue}
                            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-full hover:bg-yellow-600 transition-all"
                        >
                            Check Booking History
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function NotifyPaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <NotifyPaymentContent />
        </Suspense>
    );
}
