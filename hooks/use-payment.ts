import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentGatewayService, CreatePaymentOrderRequest } from '@/lib/services/payment-gateway.service';
import { useToast } from './use-toast';

export function usePayment() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Initiate payment flow
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

                // Navigate to payment process page with data as URL params
                const params = new URLSearchParams({
                    amount: paymentData.amount.toString(),
                    username: paymentData.customer_username,
                    email: paymentData.customer_email,
                    mobile: paymentData.customer_mobile
                });

                router.push(`/payment/process?${params.toString()}`);

                return true;
            } catch (err: any) {
                console.error('Payment initiation error:', err);
                setError(err.message);

                toast({
                    title: 'Payment Error',
                    description: err.message || 'Failed to initiate payment',
                    variant: 'destructive'
                });

                return false;
            } finally {
                setLoading(false);
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
        async (amount: number, userDetails: { username: string; email: string; mobile: string }) => {
            return initiatePayment({
                amount,
                currency: 'INR',
                customer_username: userDetails.username,
                customer_email: userDetails.email,
                customer_mobile: userDetails.mobile
            });
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
