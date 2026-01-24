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

            // Calculate pricing
            const entryFee = bookingData.hasEvent
                ? (bookingData.eventDetails?.entryFeePerGuest || 0) * bookingData.guestCount
                : 0;
            const offerDiscount = bookingData.selectedOffer
                ? (bookingData.selectedOffer.type === 'PERCENTAGE'
                    ? (entryFee * bookingData.selectedOffer.discount / 100)
                    : bookingData.selectedOffer.discount)
                : 0;
            const totalAmount = entryFee - offerDiscount;

            // Create ticket
            const ticketResponse = await TicketService.createClubTicket({
                clubId: bookingData.clubId,
                eventId: bookingData.hasEvent ? bookingData.eventDetails?.eventId : null,
                bookingDate: bookingData.selectedDate,
                arrivalTime: bookingData.selectedTime,
                guestCount: bookingData.guestCount,
                tableId: tableData.tableId,
                tableNumber: tableData.tableNumber,
                floorNumber: tableData.floorNumber,
                notes: tableData.notes || customerData.occasion,
                selectedOffer: bookingData.selectedOffer,
                pricing: {
                    entryFee,
                    offerDiscount,
                    totalAmount
                },
                customerDetails: {
                    username: customerData.username || customerData.name || 'Guest',
                    email: customerData.email || '',
                    mobile: customerData.phone || customerData.mobile || '',
                    name: customerData.name || 'Guest'
                },
                paymentDetails: {
                    orderId: orderId,
                    paymentSessionId: paymentData.payment_session_id || '',
                    cfOrderId: paymentData.cf_order_id || '',
                    paymentStatus: 'SUCCESS'
                }
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

                // Try to get notification from localStorage first
                const storedNotification = PaymentGatewayService.getStoredNotification(orderIdParam);

                if (storedNotification) {
                    console.log('Found stored notification:', storedNotification);
                    await handlePaymentNotification(storedNotification);
                    return;
                }

                // If no stored notification, poll for payment status
                setMessage('Waiting for payment confirmation...');

                try {
                    const paymentStatus = await PaymentGatewayService.pollPaymentStatus(orderIdParam, 60, 3000);

                    console.log('Payment status from polling:', paymentStatus);

                    setPaymentDetails(paymentStatus);

                    if (paymentStatus.order_status === 'PAID') {
                        setStatus('success');
                        setMessage('Payment completed successfully!');

                        // Clear localStorage
                        PaymentGatewayService.clearNotification(orderIdParam);
                        localStorage.removeItem('current_payment_order');

                        // Create club ticket after successful payment
                        await createClubTicket(paymentStatus, orderIdParam);

                    } else if (paymentStatus.order_status === 'EXPIRED') {
                        setStatus('failed');
                        setMessage('Payment session expired. Please try again.');
                    } else {
                        setStatus('pending');
                        setMessage('Payment is still being processed...');
                    }

                } catch (pollError) {
                    console.error('Polling error:', pollError);
                    setStatus('pending');
                    setMessage('Unable to verify payment status. Please check your booking history.');
                }

            } catch (error: any) {
                console.error('Payment verification error:', error);
                setStatus('failed');
                setMessage(error.message || 'Failed to verify payment');
            }
        };

        verifyPayment();
    }, [searchParams]);

    const handlePaymentNotification = async (notification: any) => {
        console.log('Processing payment notification:', notification);

        setPaymentDetails(notification);

        if (notification.payment_status === 'SUCCESS') {
            setStatus('success');
            setMessage('Payment completed successfully!');

            // Clear notification
            if (orderId) {
                PaymentGatewayService.clearNotification(orderId);
                localStorage.removeItem('current_payment_order');
            }

            // Create club ticket
            await createClubTicket(notification, orderId || notification.order_id);

        } else if (notification.payment_status === 'FAILED') {
            setStatus('failed');
            setMessage(notification.payment_message || 'Payment failed');

        } else {
            setStatus('pending');
            setMessage('Payment is being processed...');
        }
    };

    const handleContinue = () => {
        if (status === 'success') {
            // Redirect to booking confirmation with ticket ID
            if (ticketId) {
                router.push(`/booking/confirmation?ticketId=${ticketId}`);
            } else {
                router.push('/booking/confirmation');
            }
        } else if (status === 'failed') {
            // Go back to booking or payment page
            router.push('/event/pay');
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
