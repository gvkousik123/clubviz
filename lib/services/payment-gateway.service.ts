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
            const response = await api.post('/payment/gateway/create-order', data);
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
            const response = await api.get(`/payment/gateway/payment-status/${orderId}`);
            console.log('📊 Payment Status Response:', response.data);
            return handleApiResponse(response);
        } catch (error) {
            console.error('❌ Payment Status Error:', error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Generate ticket after payment completion
     * POST /club-tickets/generate
     * 
     * This endpoint is called AFTER payment is completed and verified.
     * It checks the payment status and generates/returns the ticket if payment is successful.
     */
    generateTicket: async (data: { orderId: string }): Promise<ApiResponse<any>> => {
        try {
            console.log('🎫 Generating ticket for orderId:', data.orderId);
            const response = await api.post('/ticket/club-tickets/generate', data);
            console.log('✅ Generate Ticket Response:', response.data);
            return handleApiResponse(response);
        } catch (error) {
            console.error('❌ Generate Ticket Error:', error);
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
    },

    /**
     * INTERNAL METHOD: Verify order status by orderId
     * This is called internally to prevent replay attacks
     * Only generates tickets if the order status is PAID and hasn't been processed before
     * 
     * @param orderId - The order ID to verify
     * @returns Order status and whether it's safe to generate tickets
     */
    verifyOrderStatusInternal: async (orderId: string): Promise<{
        isValid: boolean;
        status: string;
        alreadyProcessed: boolean;
        orderData: PaymentStatusResponse | null;
    }> => {
        try {
            console.log('🔐 [INTERNAL] Verifying order status for:', orderId);

            // Get the order status from backend
            const statusResponse = await PaymentGatewayService.getPaymentStatus(orderId);

            if (!statusResponse.success || !statusResponse.data) {
                console.error('❌ [INTERNAL] Failed to get order status');
                return {
                    isValid: false,
                    status: 'UNKNOWN',
                    alreadyProcessed: false,
                    orderData: null
                };
            }

            const orderData = statusResponse.data;
            const isPaid = orderData.order_status === 'PAID';

            // Check if we've already processed this order (replay attack prevention)
            const processedKey = `order_processed_${orderId}`;
            const alreadyProcessed = localStorage.getItem(processedKey) === 'true';

            console.log('🔐 [INTERNAL] Order verification result:', {
                orderId,
                status: orderData.order_status,
                isPaid,
                alreadyProcessed
            });

            return {
                isValid: isPaid && !alreadyProcessed,
                status: orderData.order_status,
                alreadyProcessed,
                orderData
            };
        } catch (error) {
            console.error('❌ [INTERNAL] Error verifying order status:', error);
            return {
                isValid: false,
                status: 'ERROR',
                alreadyProcessed: false,
                orderData: null
            };
        }
    },

    /**
     * Mark order as processed to prevent duplicate ticket generation
     * 
     * @param orderId - The order ID to mark as processed
     */
    markOrderAsProcessed: (orderId: string): void => {
        const processedKey = `order_processed_${orderId}`;
        localStorage.setItem(processedKey, 'true');
        localStorage.setItem(`${processedKey}_timestamp`, new Date().toISOString());
        console.log('✅ [INTERNAL] Order marked as processed:', orderId);
    }
};
