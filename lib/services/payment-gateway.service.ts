import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

/**
 * Payment Gateway Integration Service
 * Handles Cashfree payment integration
 */

export interface CreatePaymentOrderRequest {
    amount: number;
    currency: string;
    customer_username: string;
    customer_email: string;
    customer_mobile: string;
}

export interface CreatePaymentOrderResponse {
    order_id: string;
    payment_session_id: string;
    cf_order_id: string;
}

export interface PaymentNotification {
    order_id: string;
    payment_status: 'SUCCESS' | 'FAILED' | 'PENDING';
    payment_amount: number;
    payment_currency: string;
    payment_time?: string;
    payment_message?: string;
    cf_order_id?: string;
    payment_group?: string;
}

export interface PaymentStatusResponse {
    order_id: string;
    cf_order_id: string;
    order_status: 'ACTIVE' | 'PAID' | 'EXPIRED';
    payment_session_id: string;
    order_amount: number;
    order_currency: string;
    customer_details: {
        customer_id: string;
        customer_email: string;
        customer_phone: string;
    };
    payments?: Array<{
        payment_status: string;
        payment_amount: number;
        payment_time: string;
        payment_method: string;
    }>;
}

export const PaymentGatewayService = {
    /**
     * Create a payment order
     * POST /gateway/create-order
     */
    createOrder: async (data: CreatePaymentOrderRequest): Promise<ApiResponse<CreatePaymentOrderResponse>> => {
        try {
            const response = await api.post('payment/gateway/create-order', data);
            console.log('📝 Create Order Response:', response.data);
            return handleApiResponse(response);
        } catch (error) {
            console.error('❌ Create Order Error:', error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get payment status by order ID
     * GET /gateway/payment-status/{orderId}
     */
    getPaymentStatus: async (orderId: string): Promise<ApiResponse<PaymentStatusResponse>> => {
        try {
            const response = await api.get(`/gateway/payment-status/${orderId}`);
            console.log('📊 Payment Status Response:', response.data);
            return handleApiResponse(response);
        } catch (error) {
            console.error('❌ Payment Status Error:', error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Webhook handler for Cashfree notifications
     * This should be called from the /notifyPayment endpoint
     */
    handleWebhookNotification: async (notification: PaymentNotification): Promise<void> => {
        try {
            console.log('🔔 Payment Notification Received:', notification);

            // Store notification in local storage for the payment page to read
            if (typeof window !== 'undefined') {
                const key = `payment_notification_${notification.order_id}`;
                localStorage.setItem(key, JSON.stringify(notification));

                // Also store in a general notifications array
                const allNotifications = localStorage.getItem('payment_notifications');
                const notifications = allNotifications ? JSON.parse(allNotifications) : [];
                notifications.push({
                    ...notification,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('payment_notifications', JSON.stringify(notifications));
            }

            console.log('✅ Payment notification processed');
        } catch (error) {
            console.error('❌ Error handling webhook notification:', error);
            throw error;
        }
    },

    /**
     * Get stored payment notification from localStorage
     */
    getStoredNotification: (orderId: string): PaymentNotification | null => {
        if (typeof window === 'undefined') return null;

        const key = `payment_notification_${orderId}`;
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('❌ Error parsing stored notification:', error);
                return null;
            }
        }

        return null;
    },

    /**
     * Clear payment notification from localStorage
     */
    clearNotification: (orderId: string): void => {
        if (typeof window === 'undefined') return;

        const key = `payment_notification_${orderId}`;
        localStorage.removeItem(key);
    },

    /**
     * Poll for payment status (used while waiting for payment)
     */
    pollPaymentStatus: async (
        orderId: string,
        maxAttempts: number = 60,
        intervalMs: number = 3000
    ): Promise<PaymentStatusResponse> => {
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const poll = async () => {
                attempts++;

                try {
                    // First check localStorage for notification
                    const notification = PaymentGatewayService.getStoredNotification(orderId);

                    if (notification) {
                        console.log('📬 Found payment notification in localStorage');

                        // If we have a notification, fetch the full status
                        const statusResponse = await PaymentGatewayService.getPaymentStatus(orderId);

                        if (statusResponse.success && statusResponse.data) {
                            clearInterval(pollInterval);
                            resolve(statusResponse.data);
                            return;
                        }
                    }

                    // If no notification, fetch status from API
                    const statusResponse = await PaymentGatewayService.getPaymentStatus(orderId);

                    if (statusResponse.success && statusResponse.data) {
                        const status = statusResponse.data.order_status;

                        // Check if payment is completed (either PAID or EXPIRED)
                        if (status === 'PAID' || status === 'EXPIRED') {
                            clearInterval(pollInterval);
                            resolve(statusResponse.data);
                            return;
                        }
                    }

                    // Max attempts reached
                    if (attempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        reject(new Error('Payment status polling timeout'));
                    }
                } catch (error) {
                    console.error('❌ Error polling payment status:', error);

                    if (attempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        reject(error);
                    }
                }
            };

            // Start polling
            const pollInterval = setInterval(poll, intervalMs);

            // Initial poll
            poll();
        });
    }
};
