import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentGatewayService, CreatePaymentOrderRequest } from '@/lib/services/payment-gateway.service';
import { useToast } from './use-toast';
import { STORAGE_KEYS } from '@/lib/constants/storage';

// Cashfree mode is already set in environment variables

export function usePayment() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Initiate payment flow - directly call create order API and use Cashfree SDK
     */
    const initiatePayment = useCallback(
        async (paymentData: CreatePaymentOrderRequest) => {
            setLoading(true);
            setError(null);

            try {
                // Validate data
                if (!paymentData.amount || paymentData.amount <= 0) {
                    throw new Error('Invalid payment amount');
                }

                if (!paymentData.customer_email || !paymentData.customer_mobile) {
                    throw new Error('Customer details are required');
                }

                console.log('Creating payment order with:', paymentData);

                // Call create order API
                const orderResponse = await PaymentGatewayService.createOrder(paymentData);

                console.log('Create Order Response:', orderResponse);

                // Extract payment_session_id from response - handle various response structures
                let payment_session_id = null;
                let order_id = null;

                if (orderResponse?.data?.payment_session_id) {
                    payment_session_id = orderResponse.data.payment_session_id;
                    order_id = orderResponse.data.order_id;
                } else if (orderResponse?.payment_session_id) {
                    payment_session_id = orderResponse.payment_session_id;
                    order_id = orderResponse.order_id;
                }

                if (!payment_session_id) {
                    console.error('Full response:', JSON.stringify(orderResponse, null, 2));
                    throw new Error('Payment session ID not received from gateway');
                }

                console.log('✅ Payment session ID:', payment_session_id);
                console.log('✅ Order ID:', order_id);

                // Store order details in localStorage for reference
                if (order_id) {
                    localStorage.setItem('current_payment_order', JSON.stringify({
                        order_id,
                        payment_session_id,
                        amount: paymentData.amount,
                        timestamp: new Date().toISOString()
                    }));
                    sessionStorage.setItem('paymentOrderId', order_id);
                }

                // Use Cashfree SDK checkout method (same as test2.html)
                console.log('🔗 Opening Cashfree checkout with session:', payment_session_id);

                if (typeof window !== 'undefined' && (window as any).Cashfree) {
                    const cashfree = (window as any).Cashfree({
                        mode: "sandbox"
                    });

                    cashfree.checkout({
                        paymentSessionId: payment_session_id
                    });
                } else {
                    throw new Error('Cashfree SDK not loaded');
                }

                return true;
            } catch (err: any) {
                console.error('❌ Payment initiation error:', err);
                setError(err.message);
                setLoading(false);

                toast({
                    title: 'Payment Error',
                    description: err.message || 'Failed to initiate payment',
                    variant: 'destructive'
                });

                return false;
            }
        },
        [router, toast]
    );

    /**
     * Check payment status
     */
    const checkPaymentStatus = useCallback(
        async (orderId: string) => {
            setLoading(true);
            setError(null);

            try {
                const response = await PaymentGatewayService.getPaymentStatus(orderId);

                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Failed to get payment status');
                }

                return response.data;
            } catch (err: any) {
                console.error('Payment status check error:', err);
                setError(err.message);

                toast({
                    title: 'Error',
                    description: err.message || 'Failed to check payment status',
                    variant: 'destructive'
                });

                return null;
            } finally {
                setLoading(false);
            }
        },
        [toast]
    );

    /**
     * Quick payment - for ticket booking
     */
    const quickPay = useCallback(
        async (amount: number, userDetails?: { username?: string; email?: string; mobile?: string }) => {
            try {
                // Get user from localStorage with fallback
                let username = userDetails?.username || '';
                let email = userDetails?.email || '';
                let mobile = userDetails?.mobile || '';

                if (!email || !mobile) {
                    const userStr = localStorage.getItem(STORAGE_KEYS.user);
                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            username = username || user.username || user.email?.split('@')[0] || 'Guest';
                            email = email || user.email || '';
                            // Extract mobile - remove all non-numeric characters and get last 10 digits
                            mobile = mobile || (user.mobile ? user.mobile.replace(/[^0-9]/g, '').slice(-10) : '');
                        } catch (e) {
                            console.error('Error parsing user data from localStorage:', e);
                        }
                    }
                }

                // Use fallbacks if still empty
                if (!username) username = 'Guest';
                if (!email) email = 'guest@test.com';
                if (!mobile) mobile = '9876543210';

                console.log('Payment details:', { username, email, mobile, amount });

                return initiatePayment({
                    amount,
                    currency: 'INR',
                    customer_username: username,
                    customer_email: email,
                    customer_mobile: mobile
                });
            } catch (error) {
                console.error('Quick pay error:', error);
                throw error;
            }
        },
        [initiatePayment]
    );

    return {
        loading,
        error,
        initiatePayment,
        checkPaymentStatus,
        quickPay
    };
}
