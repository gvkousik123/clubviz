import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentGatewayService, CreatePaymentOrderRequest } from '@/lib/services/payment-gateway.service';
import { TicketService } from '@/lib/services/ticket.service';
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

                // NEW FLOW: Create ticket BEFORE redirecting to Cashfree
                // Check if we have booking data in sessionStorage
                const eventBookingStr = sessionStorage.getItem('pendingEventBooking');
                const clubBookingStr = sessionStorage.getItem('bookingData');

                if (eventBookingStr || clubBookingStr) {
                    console.log('📝 Step 2: Creating ticket with orderId before payment...');

                    try {
                        if (eventBookingStr) {
                            // Create event ticket with orderId
                            const eventBooking = JSON.parse(eventBookingStr);

                            const ticketResponse = await TicketService.createEventTicketWithOrder({
                                eventId: eventBooking.eventId,
                                clubId: eventBooking.clubId,
                                clubName: eventBooking.clubName,
                                userId: eventBooking.userId,
                                userEmail: eventBooking.email || paymentData.customer_email,
                                userName: eventBooking.userName || eventBooking.maleName || eventBooking.stagName || paymentData.customer_username,
                                userPhone: eventBooking.phone || paymentData.customer_mobile,
                                bookingDate: eventBooking.bookingDate,
                                arrivalTime: eventBooking.arrivalTime,
                                guestCount: (eventBooking.maleCount || eventBooking.maleStag || 0) + (eventBooking.femaleCount || eventBooking.femaleStag || 0) + (eventBooking.coupleCount || eventBooking.couple || 0) * 2,
                                maleCount: eventBooking.maleCount || eventBooking.maleStag || 0,
                                femaleCount: eventBooking.femaleCount || eventBooking.femaleStag || 0,
                                coupleCount: eventBooking.coupleCount || eventBooking.couple || 0,
                                ticketDescription: eventBooking.ticketDescription || 'Event ticket booking',
                                currency: eventBooking.currency || 'INR',
                                orderId: order_id, // Link ticket to payment order
                                offerId: eventBooking.offerId || null,
                                occasion: eventBooking.occasion || 'Event',
                                floorPreference: eventBooking.floorPreference || 'Main Floor'
                            });

                            if (!ticketResponse.success) {
                                throw new Error('Failed to create event ticket. Please try again.');
                            }

                            console.log('✅ Event ticket created with orderId:', order_id);
                        } else if (clubBookingStr) {
                            // Create club ticket with orderId
                            const clubBooking = JSON.parse(clubBookingStr);

                            const ticketResponse = await TicketService.createClubTicketWithOrder({
                                clubId: clubBooking.clubId,
                                userId: clubBooking.userId,
                                userEmail: clubBooking.email || paymentData.customer_email,
                                userName: clubBooking.userName || paymentData.customer_username,
                                userPhone: clubBooking.phone || paymentData.customer_mobile,
                                bookingDate: clubBooking.bookingDate || clubBooking.selectedDate,
                                arrivalTime: clubBooking.arrivalTime || clubBooking.selectedTime || '18:00:00',
                                guestCount: clubBooking.guestCount || 2,
                                orderId: order_id, // Link ticket to payment order
                                offerId: clubBooking.offerId || null,
                                occasion: clubBooking.occasion || 'Casual Dining',
                                floorPreference: clubBooking.floorPreference || 'Main Floor'
                            });

                            if (!ticketResponse.success) {
                                throw new Error('Failed to create club ticket. Please try again.');
                            }

                            console.log('✅ Club ticket created with orderId:', order_id);
                        }
                    } catch (ticketError: any) {
                        console.error('❌ Ticket creation failed:', ticketError);
                        setLoading(false);

                        toast({
                            title: 'Booking Failed',
                            description: ticketError.message || 'Failed to create booking. Please try again.',
                            variant: 'destructive'
                        });

                        // STOP - Don't proceed to Cashfree if ticket creation fails
                        return false;
                    }
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
