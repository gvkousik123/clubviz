'use client';

import { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';

interface PaymentOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    eventTitle: string;
}

export default function PaymentOverlay({ isOpen, onClose, amount, eventTitle }: PaymentOverlayProps) {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const paymentMethods = [
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: CreditCard,
            description: 'Visa, Mastercard, Rupay'
        },
        {
            id: 'upi',
            name: 'UPI',
            icon: Smartphone,
            description: 'PhonePe, GPay, Paytm'
        },
        {
            id: 'wallet',
            name: 'Digital Wallet',
            icon: Wallet,
            description: 'Paytm, Mobikwik, Freecharge'
        }
    ];

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        setIsProcessing(false);
        setIsComplete(true);

        // Close overlay after success
        setTimeout(() => {
            setIsComplete(false);
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Payment Panel */}
            <div className="relative w-full bg-slate-800/95 backdrop-blur-xl rounded-t-3xl animate-slide-up">
                {isComplete ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
                        <p className="text-white/60">Your ticket has been booked successfully</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-white text-xl font-semibold">Payment</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Event Details */}
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-white font-semibold mb-2">{eventTitle}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60">Total Amount</span>
                                <span className="text-white text-xl font-bold">₹{amount}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="p-6">
                            <h4 className="text-white font-semibold mb-4">Select Payment Method</h4>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`w-full p-4 rounded-xl border transition-all ${selectedMethod === method.id
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <Icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-blue-400' : 'text-white/60'
                                                    }`} />
                                                <div className="text-left">
                                                    <div className={`font-medium ${selectedMethod === method.id ? 'text-white' : 'text-white/80'
                                                        }`}>
                                                        {method.name}
                                                    </div>
                                                    <div className="text-white/60 text-sm">{method.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Card Details (if card selected) */}
                        {selectedMethod === 'card' && (
                            <div className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-white/80 text-sm mb-2 block">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white/80 text-sm mb-2 block">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pay Button */}
                        <div className="p-6 pt-0">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    `Pay ₹${amount}`
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}