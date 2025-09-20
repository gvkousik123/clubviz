'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Users, CreditCard, Shield, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

interface TicketSummaryProps {
  name: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

function TicketSummary({ name, quantity, price, originalPrice }: TicketSummaryProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex-1">
        <p className="text-white font-medium">{name}</p>
        <p className="text-text-secondary text-sm">Qty: {quantity}</p>
      </div>
      <div className="text-right">
        {originalPrice && (
          <span className="text-text-tertiary text-sm line-through block">₹{originalPrice * quantity}</span>
        )}
        <span className="text-purple-400 font-semibold">₹{price * quantity}</span>
      </div>
    </div>
  );
}

export default function EventBookingDetailsScreen() {
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const eventData = {
    title: 'Freaky Friday',
    venue: 'DABO Club',
    date: 'Friday, April 4th, 2024',
    time: '9:00 PM - 3:00 AM',
    address: 'Airport Road, Nagpur'
  };

  const tickets = [
    { name: 'Early Bird', quantity: 2, price: 799, originalPrice: 999 },
    { name: 'General Admission', quantity: 1, price: 999 }
  ];

  const subtotal = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
  const savings = tickets.reduce((sum, ticket) => {
    if (ticket.originalPrice) {
      return sum + ((ticket.originalPrice - ticket.price) * ticket.quantity);
    }
    return sum;
  }, 0);
  const platformFee = 149;
  const taxes = Math.round(subtotal * 0.18);
  const promoDiscount = isPromoApplied ? 200 : 0;
  const total = subtotal + platformFee + taxes - promoDiscount;

  const handleBack = () => {
    window.history.back();
  };

  const handlePayment = () => {
    window.location.href = `/events/freaky-friday/payment`;
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'friday50') {
      setIsPromoApplied(true);
    }
  };

  return (
    <MobileLayout showNavigation={false}>
      <PageHeader title="Booking Details" showBack onBack={handleBack} />

      <div className="px-6 pb-6">
        {/* Event Summary */}
        <GlassCard className="mb-6">
          <div className="flex gap-4">
            <img
              src="/night-party-event-poster-with-purple-and-pink-neon.jpg"
              alt={eventData.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">{eventData.title}</h2>
              <p className="text-text-secondary text-sm mb-2">{eventData.venue}</p>
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{eventData.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{eventData.time}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Ticket Summary */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ticket Summary</h3>
          <div className="space-y-2">
            {tickets.map((ticket, index) => (
              <TicketSummary key={index} {...ticket} />
            ))}
          </div>

          {savings > 0 && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">You saved ₹{savings}!</span>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Contact Information */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">Full Name *</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={contactInfo.fullName}
                onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Email Address *</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Phone Number *</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Emergency Contact</label>
              <Input
                type="tel"
                placeholder="Emergency contact number"
                value={contactInfo.emergencyContact}
                onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
              />
            </div>
          </div>
        </GlassCard>

        {/* Promo Code */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Promo Code</h3>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-dark-600 border-dark-500 text-white flex-1"
              disabled={isPromoApplied}
            />
            <Button
              onClick={applyPromoCode}
              disabled={isPromoApplied || !promoCode}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isPromoApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
          {isPromoApplied && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Promo code applied! ₹200 discount</span>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Payment Method */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>

          {/* Payment Options */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                "p-3 rounded-lg border text-center transition-colors",
                paymentMethod === 'card'
                  ? "border-purple-500 bg-purple-500/10 text-purple-400"
                  : "border-dark-500 text-text-secondary hover:border-dark-400"
              )}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={cn(
                "p-3 rounded-lg border text-center transition-colors",
                paymentMethod === 'upi'
                  ? "border-purple-500 bg-purple-500/10 text-purple-400"
                  : "border-dark-500 text-text-secondary hover:border-dark-400"
              )}
            >
              <div className="w-5 h-5 mx-auto mb-1 bg-current rounded" />
              <span className="text-xs">UPI</span>
            </button>
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={cn(
                "p-3 rounded-lg border text-center transition-colors",
                paymentMethod === 'wallet'
                  ? "border-purple-500 bg-purple-500/10 text-purple-400"
                  : "border-dark-500 text-text-secondary hover:border-dark-400"
              )}
            >
              <div className="w-5 h-5 mx-auto mb-1 bg-current rounded" />
              <span className="text-xs">Wallet</span>
            </button>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">Card Number</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Expiry Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="bg-dark-600 border-dark-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">CVV</label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="bg-dark-600 border-dark-500 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Cardholder Name</label>
                <Input
                  type="text"
                  placeholder="Name on card"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white"
                />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Price Breakdown */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Platform Fee</span>
              <span className="text-white">₹{platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Taxes (18%)</span>
              <span className="text-white">₹{taxes}</span>
            </div>
            {isPromoApplied && (
              <div className="flex justify-between">
                <span className="text-green-400">Promo Discount</span>
                <span className="text-green-400">-₹{promoDiscount}</span>
              </div>
            )}
            <hr className="border-white/10 my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-white">Total</span>
              <span className="text-purple-400">₹{total}</span>
            </div>
          </div>
        </GlassCard>

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium text-sm">Secure Payment</p>
              <p className="text-text-secondary text-xs">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Terms Notice */}
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium text-sm">Cancellation Policy</p>
              <p className="text-text-secondary text-xs">Free cancellation up to 24 hours before the event</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handlePayment}
          className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
        >
          Continue to Payment
        </Button>
      </div>
    </MobileLayout>
  );
}