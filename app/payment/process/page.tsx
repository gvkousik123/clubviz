'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentGatewayService } from '@/lib/services/payment-gateway.service';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

function PaymentProcessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Initializing payment...');
    const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                // Get data from sessionStorage (secure, not from URL params)
                const paymentDataStr = typeof window !== 'undefined' ? sessionStorage.getItem('pendingPaymentData') : null;

                if (!paymentDataStr) {
                    setStatus('failed');
                    setMessage('Missing payment information. Please try again.');
                    return;
                }

                const paymentData = JSON.parse(paymentDataStr);
                const { amount, customer_username, customer_email, customer_mobile, currency } = paymentData;

                // Validate required fields
                if (!amount || !customer_email || !customer_mobile) {
                    setStatus('failed');
                    setMessage('Missing payment information. Please try again.');
                    return;
                }

                setStatus('processing');
                setMessage('Creating payment order...');

                console.log('Creating payment order with:', {
                    amount,
                    currency: currency || 'INR',
                    customer_username,
                    customer_email,
                    customer_mobile
                });

                // Create payment order
                const orderResponse = await PaymentGatewayService.createOrder({
                    amount: amount,
                    currency: currency || 'INR',
                    customer_username: customer_username || 'Guest',
                    customer_email: customer_email,
                    customer_mobile: customer_mobile
                });

                console.log('Order response:', orderResponse);

                if (!orderResponse.success || !orderResponse.data) {
                    throw new Error(orderResponse.message || 'Failed to create payment order');
                }

                const { order_id, payment_session_id, cf_order_id } = orderResponse.data;

                // Store order details
                setOrderId(order_id);
                setPaymentSessionId(payment_session_id);

                // Store in localStorage for reference
                localStorage.setItem('current_payment_order', JSON.stringify({
                    order_id,
                    payment_session_id,
                    cf_order_id,
                    amount,
                    timestamp: new Date().toISOString()
                }));

                // Clear sensitive data from sessionStorage
                sessionStorage.removeItem('pendingPaymentData');

                setMessage('Redirecting to payment gateway...');

                // Initialize Cashfree SDK
                setTimeout(() => {
                    initializeCashfree(payment_session_id);
                }, 1000);

            } catch (error: any) {
                console.error('Payment initialization error:', error);
                setStatus('failed');
                setMessage(error.message || 'Failed to initialize payment');
            }
        };

        initializePayment();
    }, []);

    const initializeCashfree = (sessionId: string) => {
        try {
            // Check if Cashfree SDK is loaded
            if (typeof window === 'undefined' || !(window as any).Cashfree) {
                setStatus('failed');
                setMessage('Payment gateway not loaded. Please refresh the page.');
                return;
            }

            const cashfree = (window as any).Cashfree({
                mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox' // 'sandbox' or 'production'
            });

            const checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: '_self', // Open in same window
                returnUrl: `${window.location.origin}/notifyPayment?order_id=${orderId}` // Callback URL
            };

            console.log('Opening Cashfree checkout with options:', checkoutOptions);

            // Open Cashfree checkout
            cashfree.checkout(checkoutOptions).then((result: any) => {
                console.log('Cashfree checkout result:', result);

                if (result.error) {
                    setStatus('failed');
                    setMessage(result.error.message || 'Payment failed');
                } else if (result.paymentDetails) {
                    // Payment completed, redirect to callback
                    router.push(`/notifyPayment?order_id=${orderId}`);
                }
            }).catch((error: any) => {
                console.error('Cashfree checkout error:', error);
                setStatus('failed');
                setMessage('Payment gateway error. Please try again.');
            });

        } catch (error: any) {
            console.error('Error initializing Cashfree:', error);
            setStatus('failed');
            setMessage('Failed to open payment gateway');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-3xl p-8 text-center">
                {status === 'loading' || status === 'processing' ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <Loader2 className="w-16 h-16 text-[#14FFEC] animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Processing Payment</h1>
                        <p className="text-gray-400 mb-6">{message}</p>

                        {paymentSessionId && (
                            <div className="bg-black/30 rounded-xl p-4 mb-4">
                                <p className="text-xs text-gray-500 mb-1">Payment Session ID</p>
                                <p className="text-sm text-[#14FFEC] font-mono break-all">{paymentSessionId}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>Please wait, do not close this window</span>
                        </div>
                    </>
                ) : status === 'success' ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <button
                            onClick={() => router.push('/booking/confirmation')}
                            className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-full hover:bg-[#14FFEC]/80 transition-all"
                        >
                            View Booking
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Payment Failed</h1>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.back()}
                                className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-4 rounded-full hover:bg-white/20 transition-all"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-[#14FFEC] text-black font-bold py-4 rounded-full hover:bg-[#14FFEC]/80 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentProcessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F] flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <PaymentProcessContent />
        </Suspense>
    );
}
