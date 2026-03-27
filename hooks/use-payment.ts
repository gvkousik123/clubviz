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
                    // CRITICAL: Store orderId in both sessionStorage and localStorage
                    // localStorage persists after page redirect from payment gateway
                    sessionStorage.setItem('paymentOrderId', order_id);
                    localStorage.setItem('paymentOrderId', order_id);
                    localStorage.setItem('latestOrderId', order_id); // Additional backup
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
                            console.log('📦 Event booking data from sessionStorage:', eventBooking);

                            // Handle BOTH old and new ticket structure
                            let maleCount = 0;
                            let femaleCount = 0;
                            let coupleCount = 0;
                            let totalAmount = eventBooking.totalAmount || 0;

                            // NEW format: ticketBreakdown array
                            if (eventBooking.ticketBreakdown && Array.isArray(eventBooking.ticketBreakdown)) {
                                console.log('📊 Processing NEW ticketBreakdown format');
                                eventBooking.ticketBreakdown.forEach((ticket: any) => {
                                    if (ticket.name.includes('Male') && !ticket.name.includes('Female')) {
                                        maleCount += ticket.quantity || 0;
                                    } else if (ticket.name.includes('Female')) {
                                        femaleCount += ticket.quantity || 0;
                                    } else if (ticket.name.includes('Couple')) {
                                        coupleCount += ticket.quantity || 0;
                                    }
                                });
                            } else {
                                // OLD format: individual count fields
                                console.log('📊 Processing OLD format with individual counts');
                                maleCount = eventBooking.maleCount || eventBooking.maleStag || 0;
                                femaleCount = eventBooking.femaleCount || eventBooking.femaleStag || 0;
                                coupleCount = eventBooking.coupleCount || eventBooking.couple || 0;
                            }

                            const guestCount = maleCount + femaleCount + (coupleCount * 2);

                            // Build payload with ALL required fields per API spec
                            const ticketPayload = {
                                userId: eventBooking.userId,
                                eventId: eventBooking.eventId,
                                bookingDate: eventBooking.bookingDate,
                                arrivalTime: eventBooking.arrivalTime,
                                guestCount: guestCount,
                                maleCount: maleCount,
                                femaleCount: femaleCount,
                                coupleCount: coupleCount,
                                totalAmount: totalAmount,
                                currency: eventBooking.currency || 'INR',
                                orderId: order_id
                            };
                            
                            console.log('========== EVENT TICKET PAYLOAD DEBUG ==========');
                            console.log('📋 EventId:', ticketPayload.eventId);
                            console.log('💰 TotalAmount:', ticketPayload.totalAmount);
                            console.log('🎟️  Counts - Male:', maleCount, 'Female:', femaleCount, 'Couple:', coupleCount);
                            console.log('👥 GuestCount:', guestCount);
                            console.log('💳 OrderId:', order_id);
                            console.log('🔐 Token will be auto-added via request interceptor');
                            console.log('📤 FULL Payload:', JSON.stringify(ticketPayload, null, 2));
                            console.log('================================================');

                            const ticketResponse = await TicketService.createEventTicketWithOrder(ticketPayload);

                            console.log('📋 Ticket response:', ticketResponse);
                            console.log('✅ Success flag:', ticketResponse.success);
                            console.log('📦 Ticket data:', ticketResponse.data);

                            // API returns success if either:
                            // 1. response.success === true (from our handler)
                            // 2. ticketResponse.data?.ticketId exists (ticket was created)
                            const ticketCreatedSuccessfully = ticketResponse.success || !!ticketResponse.data?.ticketId;

                            if (!ticketCreatedSuccessfully) {
                                console.error('❌ Ticket creation failed - no ticketId in response');
                                console.error('Full response:', ticketResponse);
                                
                                // Extract meaningful error message from API response with hardcoded fallbacks
                                let errorMessage = '';
                                
                                // Try to get message from multiple sources
                                if (ticketResponse?.data?.message) {
                                    errorMessage = ticketResponse.data.message;
                                } else if (ticketResponse?.message) {
                                    errorMessage = ticketResponse.message;
                                } else if (ticketResponse?.data?.error) {
                                    errorMessage = ticketResponse.data.error;
                                } else {
                                    // Hardcoded fallback message if no response from API
                                    errorMessage = '⚠️ Unable to create ticket due to a server issue. Please ensure:\n' +
                                                 '• You do not already have a ticket for this date\n' +
                                                 '• Your booking details are correct\n' +
                                                 '• Try again in a few moments\n\n' +
                                                 'Contact support if the issue persists.';
                                }
                                
                                console.error('📋 Final error message:', errorMessage);
                                throw new Error(errorMessage);
                            }

                            console.log('✅ Event ticket created successfully with ID:', ticketResponse.data?.ticketId);
                        } else if (clubBookingStr) {
                            // Create club ticket with orderId
                            const clubBooking = JSON.parse(clubBookingStr);
                            console.log('📦 Club booking data from sessionStorage:', clubBooking);

                            // Build payload with ONLY required fields per API spec
                            const ticketPayload = {
                                clubId: clubBooking.clubId,
                                userId: clubBooking.userId,
                                bookingDate: clubBooking.bookingDate || clubBooking.selectedDate,
                                arrivalTime: clubBooking.arrivalTime || clubBooking.selectedTime || '20:00:00',
                                guestCount: clubBooking.guestCount || 2,
                                currency: clubBooking.currency || 'INR',
                                orderId: order_id
                            };
                            console.log('📤 Club Ticket payload (REQUIRED fields only):', JSON.stringify(ticketPayload, null, 2));

                            const ticketResponse = await TicketService.createClubTicketWithOrder(ticketPayload);

                            console.log('📋 Club Ticket response:', ticketResponse);
                            
                            // API returns success if either:
                            // 1. response.success === true (from our handler)
                            // 2. ticketResponse.data?.ticketId exists (ticket was created)
                            const ticketCreatedSuccessfully = ticketResponse.success || !!ticketResponse.data?.ticketId;

                            if (!ticketCreatedSuccessfully) {
                                console.error('❌ Club ticket creation failed - no ticketId in response');
                                
                                // Extract meaningful error message from API response with hardcoded fallbacks
                                let errorMessage = '';
                                
                                // Try to get message from multiple sources
                                if (ticketResponse?.data?.message) {
                                    errorMessage = ticketResponse.data.message;
                                } else if (ticketResponse?.message) {
                                    errorMessage = ticketResponse.message;
                                } else if (ticketResponse?.data?.error) {
                                    errorMessage = ticketResponse.data.error;
                                } else {
                                    // Hardcoded fallback message if no response from API
                                    errorMessage = '⚠️ Unable to create booking due to a server issue. Please ensure:\n' +
                                                 '• You do not already have a booking for this date\n' +
                                                 '• Your booking details are correct\n' +
                                                 '• Try again in a few moments\n\n' +
                                                 'Contact support if the issue persists.';
                                }
                                
                                console.error('📋 Final error message:', errorMessage);
                                throw new Error(errorMessage);
                            }

                            console.log('✅ Club ticket created successfully with ID:', ticketResponse.data?.ticketId);
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

                    const checkoutOptions = {
                        paymentSessionId: payment_session_id,
                        returnUrl: `${window.location.origin}/notifyPayment?order_id=${order_id}`,
                        redirectTarget: "_self" // Redirect in same window
                    };

                    console.log('💳 Cashfree checkout options:', checkoutOptions);

                    cashfree.checkout(checkoutOptions);
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
