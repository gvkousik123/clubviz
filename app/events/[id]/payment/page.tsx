'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, CreditCard, Smartphone, Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

type PaymentStep = 'method' | 'processing' | 'success' | 'failed';

export default function PaymentScreen() {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('method');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processingTime, setProcessingTime] = useState(3);

  const orderData = {
    eventName: 'Freaky Friday',
    venue: 'DABO Club',
    date: 'Friday, April 4th, 2024',
    tickets: 3,
    total: 2597
  };

  useEffect(() => {
    if (paymentStep === 'processing') {
      const timer = setInterval(() => {
        setProcessingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Simulate payment success (90% success rate)
            setPaymentStep(Math.random() > 0.1 ? 'success' : 'failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStep]);

  const handleBack = () => {
    if (paymentStep === 'method') {
      window.history.back();
    } else {
      setPaymentStep('method');
    }
  };

  const handlePayment = () => {
    setPaymentStep('processing');
    setProcessingTime(3);
  };

  const handleRetry = () => {
    setPaymentStep('processing');
    setProcessingTime(3);
  };

  const handleViewTicket = () => {
    window.location.href = '/tickets/freaky-friday-ticket';
  };

  const renderPaymentMethod = () => (
    <div className="px-6 pb-6">
      {/* Order Summary */}
      <GlassCard className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Event</span>
            <span className="text-white font-medium">{orderData.eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Venue</span>
            <span className="text-white">{orderData.venue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date</span>
            <span className="text-white">{orderData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Tickets</span>
            <span className="text-white">{orderData.tickets} tickets</span>
          </div>
          <hr className="border-white/10" />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-white">Total Amount</span>
            <span className="text-purple-400">₹{orderData.total}</span>
          </div>
        </div>
      </GlassCard>

      {/* Payment Methods */}
      <GlassCard className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>

        <div className="space-y-3">
          {/* Credit/Debit Card */}
          <div
            onClick={() => setPaymentMethod('card')}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === 'card'
                ? "border-purple-500 bg-purple-500/10"
                : "border-dark-500 hover:border-dark-400"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                paymentMethod === 'card' ? "bg-purple-500" : "bg-dark-600"
              )}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Credit/Debit Card</p>
                <p className="text-text-secondary text-sm">Visa, Mastercard, RuPay</p>
              </div>
              <div className="ml-auto">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === 'card'
                    ? "border-purple-500 bg-purple-500"
                    : "border-dark-500"
                )}>
                  {paymentMethod === 'card' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* UPI */}
          <div
            onClick={() => setPaymentMethod('upi')}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === 'upi'
                ? "border-purple-500 bg-purple-500/10"
                : "border-dark-500 hover:border-dark-400"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                paymentMethod === 'upi' ? "bg-purple-500" : "bg-dark-600"
              )}>
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">UPI</p>
                <p className="text-text-secondary text-sm">PhonePe, Google Pay, Paytm</p>
              </div>
              <div className="ml-auto">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === 'upi'
                    ? "border-purple-500 bg-purple-500"
                    : "border-dark-500"
                )}>
                  {paymentMethod === 'upi' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Digital Wallet */}
          <div
            onClick={() => setPaymentMethod('wallet')}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === 'wallet'
                ? "border-purple-500 bg-purple-500/10"
                : "border-dark-500 hover:border-dark-400"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                paymentMethod === 'wallet' ? "bg-purple-500" : "bg-dark-600"
              )}>
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Digital Wallet</p>
                <p className="text-text-secondary text-sm">Paytm, Amazon Pay, Mobikwik</p>
              </div>
              <div className="ml-auto">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === 'wallet'
                    ? "border-purple-500 bg-purple-500"
                    : "border-dark-500"
                )}>
                  {paymentMethod === 'wallet' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Payment Details */}
      {paymentMethod === 'card' && (
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Card number"
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="MM/YY"
                className="bg-dark-600 border-dark-500 text-white"
              />
              <Input
                type="text"
                placeholder="CVV"
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Cardholder name"
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {paymentMethod === 'upi' && (
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">UPI Payment</h3>
          <div>
            <Input
              type="text"
              placeholder="Enter UPI ID (e.g., yourname@paytm)"
              className="bg-dark-600 border-dark-500 text-white"
            />
          </div>
        </GlassCard>
      )}

      {/* Security Info */}
      <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-400 font-medium text-sm">100% Secure Payment</p>
            <p className="text-text-secondary text-xs">Your payment is protected by 256-bit SSL encryption</p>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
      >
        <Lock className="w-5 h-5 mr-2" />
        Pay ₹{orderData.total}
      </Button>
    </div>
  );

  const renderProcessing = () => (
    <div className="px-6 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
        <p className="text-text-secondary mb-4">Please don't close this window</p>
        <div className="text-purple-400 font-semibold text-lg">
          {processingTime > 0 ? `${processingTime}s` : 'Almost done...'}
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="px-6 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-text-secondary mb-6">Your tickets have been booked successfully</p>

        <GlassCard className="mb-6 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Booking ID</span>
              <span className="text-white font-mono">#FF2024040123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Event</span>
              <span className="text-white">{orderData.eventName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Tickets</span>
              <span className="text-white">{orderData.tickets} tickets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount Paid</span>
              <span className="text-green-400 font-semibold">₹{orderData.total}</span>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3 w-full">
          <Button
            onClick={handleViewTicket}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
          >
            View Tickets
          </Button>
          <Button
            onClick={() => window.location.href = '/home'}
            variant="outline"
            className="w-full h-12 border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFailed = () => (
    <div className="px-6 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
        <p className="text-text-secondary mb-6">Something went wrong with your payment</p>

        <GlassCard className="mb-6 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Error Code</span>
              <span className="text-red-400 font-mono">#PAY_TIMEOUT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Reason</span>
              <span className="text-white">Payment gateway timeout</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount</span>
              <span className="text-white">₹{orderData.total}</span>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3 w-full">
          <Button
            onClick={handleRetry}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
          >
            Retry Payment
          </Button>
          <Button
            onClick={() => window.location.href = '/home'}
            variant="outline"
            className="w-full h-12 border-red-500 text-red-400 hover:bg-red-500/10"
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <MobileLayout showNavigation={false}>
      <PageHeader
        title={
          paymentStep === 'method' ? 'Payment' :
            paymentStep === 'processing' ? 'Processing' :
              paymentStep === 'success' ? 'Success' : 'Payment Failed'
        }
        showBack={paymentStep === 'method'}
        onBack={handleBack}
      />

      {paymentStep === 'method' && renderPaymentMethod()}
      {paymentStep === 'processing' && renderProcessing()}
      {paymentStep === 'success' && renderSuccess()}
      {paymentStep === 'failed' && renderFailed()}
    </MobileLayout>
  );
}