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
    const [message, setMessage] = useState('Verifying payment status...');
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    const createEventTicket = async (paymentData: any, orderId: string) => {
        setIsCreatingTicket(true);
        setMessage('Creating your event ticket...');

        try {
            // Get event booking data from sessionStorage
            const eventBookingStr = sessionStorage.getItem('pendingEventBooking');

            if (!eventBookingStr) {
                console.error('No event booking data found');
                setMessage('Payment successful! Your booking has been confirmed.');
                return;
            }

            const eventBooking = JSON.parse(eventBookingStr);
            console.log('🎫 Creating event ticket with orderId:', orderId);

            // STEP 2: Persist ticket info + orderId with ticketing API
            // This creates the ticket record in the database with the orderId
            // linking the payment to the ticket for tracking and verification
            const ticketResponse = await TicketService.createEventTicket({
                eventId: eventBooking.eventId,
                userId: eventBooking.userId,
                userEmail: eventBooking.email,
                userName: eventBooking.maleName || eventBooking.stagName || 'Guest',
                userPhone: eventBooking.phone,
                ticketType: eventBooking.ticketType,
                maleStag: eventBooking.maleStag,
                femaleStag: eventBooking.femaleStag,
                couple: eventBooking.couple,
                totalAmount: eventBooking.totalAmount,
                orderId: orderId, // Link ticket to payment order
                currency: 'INR'
            });

            if (ticketResponse.success && ticketResponse.data) {
                setTicketId(ticketResponse.data.ticketId || ticketResponse.data.id);
                setMessage('Event ticket created successfully!');

                // Clear booking data from sessionStorage
                sessionStorage.removeItem('pendingEventBooking');
            }
        } catch (error: any) {
            console.error('Failed to create event ticket:', error);
            // Don't fail the whole flow, just log the error
            setMessage('Payment successful! You can view your booking in your account.');
        } finally {
            setIsCreatingTicket(false);
        }
    };

    const createClubTicket = async (paymentData: any, orderId: string) => {
        setIsCreatingTicket(true);
        setMessage('Creating your ticket...');

        try {
            // Get booking data from sessionStorage
            const bookingDataStr = sessionStorage.getItem('bookingData');
            const tableDataStr = sessionStorage.getItem('tableSelection');
            const customerDataStr = sessionStorage.getItem('customerDetails');

            if (!bookingDataStr) {
                console.error('No booking data found');
                return;
            }

            const bookingData = JSON.parse(bookingDataStr);
            const tableData = tableDataStr ? JSON.parse(tableDataStr) : {};
            const customerData = customerDataStr ? JSON.parse(customerDataStr) : {};

            console.log('🎫 Creating club ticket with orderId:', orderId);

            // Parse arrival time to match new API format
            const [timeStr, period] = (bookingData.selectedTime || '18:00 PM').split(' ');
            const [hourStr, minuteStr] = timeStr.split(':');
            let hour = parseInt(hourStr);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            // STEP 2: Persist ticket info + orderId with ticketing API
            // This creates the ticket record in the database with the orderId
            // linking the payment to the ticket for tracking and verification
            const ticketResponse = await TicketService.createClubTicket({
                clubId: bookingData.clubId,
                clubName: bookingData.clubName || 'Club',
                userId: customerData.userId || 'guest',
                userEmail: customerData.email || '',
                userName: customerData.name || customerData.username || 'Guest',
                userPhone: customerData.phone || customerData.mobile || '',
                bookingDate: bookingData.selectedDate,
                arrivalTime: {
                    hour: hour,
                    minute: parseInt(minuteStr || '0'),
                    second: 0,
                    nano: 0
                },
                guestCount: bookingData.guestCount,
                offerId: bookingData.selectedOffer?.offerId,
                occasion: tableData.notes || customerData.occasion,
                floorPreference: tableData.floorNumber,
                orderId: orderId, // Link ticket to payment order
                currency: 'INR'
            });

            if (ticketResponse.success && ticketResponse.data) {
                setTicketId(ticketResponse.data.ticketId);
                setMessage('Ticket created successfully!');

                // Clear booking data from sessionStorage
                sessionStorage.removeItem('bookingData');
                sessionStorage.removeItem('tableSelection');
                // Keep customerDetails for future bookings
            }
        } catch (error: any) {
            console.error('Failed to create ticket:', error);
            // Don't fail the whole flow, just log the error
            setMessage('Payment successful! You can view your booking in your account.');
        } finally {
            setIsCreatingTicket(false);
        }
    };

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get order_id from URL
                const orderIdParam = searchParams.get('order_id');

                if (!orderIdParam) {
                    setStatus('failed');
                    setMessage('No order ID provided');
                    return;
                }

                setOrderId(orderIdParam);
                setMessage('Checking payment status...');

                // STEP 1: Call internal verification method to prevent replay attacks
                console.log('🔐 Step 1: Verifying order status internally...');
                const verification = await PaymentGatewayService.verifyOrderStatusInternal(orderIdParam);

                if (!verification.isValid) {
                    if (verification.alreadyProcessed) {
                        console.log('⚠️ Order already processed, skipping ticket generation');
                        setStatus('success');
                        setMessage('Payment already processed. Check your tickets.');
                        setPaymentDetails(verification.orderData);
                        return;
                    }

                    if (verification.status === 'EXPIRED') {
                        setStatus('failed');
                        setMessage('Payment session expired. Please try again.');
                        return;
                    }

                    if (verification.status === 'ACTIVE') {
                        setStatus('pending');
                        setMessage('Payment is still being processed...');
                        return;
                    }

                    setStatus('failed');
                    setMessage('Payment verification failed.');
                    return;
                }

                // STEP 2: Order is PAID and not processed yet - safe to generate tickets
                console.log('✅ Step 2: Order verified as PAID and not processed yet');
                setPaymentDetails(verification.orderData);
                setStatus('success');
                setMessage('Payment completed successfully!');

                // Clear localStorage
                PaymentGatewayService.clearNotification(orderIdParam);
                localStorage.removeItem('current_payment_order');

                // STEP 3: Call generate ticket API
                // This API checks payment status and generates ticket if payment is successful
                console.log('🎫 Step 3: Calling generate ticket API with orderId:', orderIdParam);
                setIsCreatingTicket(true);
                setMessage('Generating your ticket...');

                try {
                    const generateResponse = await PaymentGatewayService.generateTicket({
                        orderId: orderIdParam
                    });

                    console.log('✅ Generate ticket response:', generateResponse);

                    if (generateResponse.success && generateResponse.data) {
                        // Extract ticket ID from response
                        const generatedTicketId = generateResponse.data.ticketId ||
                            generateResponse.data.id ||
                            generateResponse.data.ticket?.ticketId;

                        if (generatedTicketId) {
                            setTicketId(generatedTicketId);
                            setMessage('Ticket generated successfully!');
                        } else {
                            setMessage('Payment successful! Ticket will be available in your account.');
                        }

                        // Clear session storage
                        sessionStorage.removeItem('pendingEventBooking');
                        sessionStorage.removeItem('bookingData');
                    } else if (generateResponse.message?.includes('failed') ||
                        generateResponse.message?.includes('FAILED')) {
                        // Payment failed
                        setStatus('failed');
                        setMessage('Payment verification failed. Please try again.');
                    } else {
                        setMessage('Payment successful! Check your tickets in your account.');
                    }
                } catch (ticketError: any) {
                    console.error('Generate ticket error:', ticketError);
                    // Don't fail the whole flow if ticket generation fails
                    setMessage('Payment successful! Your ticket will be available shortly.');
                } finally {
                    setIsCreatingTicket(false);
                }

                // STEP 4: Mark order as processed to prevent replay attacks
                PaymentGatewayService.markOrderAsProcessed(orderIdParam);
                console.log('🔒 Step 4: Order marked as processed');

            } catch (error: any) {
                console.error('Payment verification error:', error);
                setStatus('failed');
                setMessage(error.message || 'Failed to verify payment');
            }
        };

        verifyPayment();
    }, [searchParams]);

    // Removed handlePaymentNotification - now using internal verification method

    const handleContinue = () => {
        if (status === 'success') {
            // Redirect to review-pre-booking success page with ticket ID
            if (ticketId) {
                router.push(`/booking/review-pre-booking?ticketId=${ticketId}`);
            } else {
                router.push('/booking/review-pre-booking');
            }
        } else if (status === 'failed') {
            // Go back to review booking page
            router.push('/booking/review-booking');
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
