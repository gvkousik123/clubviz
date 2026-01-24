'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/use-payment';
import { ArrowLeft, CreditCard, User, Mail, Phone, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentExamplePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { initiatePayment, loading } = usePayment();

    const [amount, setAmount] = useState('1000');
    const [username, setUsername] = useState('kaushikbaurasi123-881');
    const [email, setEmail] = useState('kaushikbaurasi123@gmail.com');
    const [mobile, setMobile] = useState('9876543210');

    const handlePayment = async () => {
        // Validate inputs
        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid amount',
                variant: 'destructive'
            });
            return;
        }

        if (!username || !email || !mobile) {
            toast({
                title: 'Missing Details',
                description: 'Please fill all required fields',
                variant: 'destructive'
            });
            return;
        }

        // Initiate payment
        const success = await initiatePayment({
            amount: parseFloat(amount),
            currency: 'INR',
            customer_username: username,
            customer_email: email,
            customer_mobile: mobile
        });

        if (success) {
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021313] to-[#0D1F1F]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D7377] to-[#14FFEC] pt-10 pb-6 px-6 rounded-b-[30px]">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white flex-1 text-center mr-10">
                        Payment Integration Test
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6 pt-8">
                {/* Info Card */}
                <div className="bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-2xl p-6">
                    <h2 className="text-[#14FFEC] font-bold text-lg mb-2">How it works</h2>
                    <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                        <li>Enter payment amount and customer details</li>
                        <li>Click "Proceed to Payment"</li>
                        <li>You'll be redirected to Cashfree payment gateway</li>
                        <li>Complete payment on Cashfree</li>
                        <li>Get redirected back to payment status page</li>
                    </ol>
                </div>

                {/* Payment Form */}
                <div className="bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-2xl p-6 space-y-5">
                    <h2 className="text-white font-bold text-lg mb-4">Payment Details</h2>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm flex items-center gap-2">
                            <IndianRupee size={16} />
                            Amount (INR)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-[#021313] border border-[#14FFEC]/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#14FFEC]"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm flex items-center gap-2">
                            <User size={16} />
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full bg-[#021313] border border-[#14FFEC]/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#14FFEC]"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm flex items-center gap-2">
                            <Mail size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full bg-[#021313] border border-[#14FFEC]/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#14FFEC]"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm flex items-center gap-2">
                            <Phone size={16} />
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter mobile number"
                            maxLength={10}
                            className="w-full bg-[#021313] border border-[#14FFEC]/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#14FFEC]"
                        />
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-full hover:bg-[#14FFEC]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#14FFEC]/20"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard size={20} />
                            Proceed to Payment
                        </>
                    )}
                </button>

                {/* API Endpoint Info */}
                <div className="bg-black/30 border border-[#14FFEC]/20 rounded-xl p-4 text-xs font-mono">
                    <div className="text-[#14FFEC] mb-2">API Endpoint:</div>
                    <div className="text-gray-400">POST /gateway/create-order</div>
                    <div className="mt-3 text-[#14FFEC]">Request Body:</div>
                    <pre className="text-gray-400 mt-1 overflow-x-auto">
                        {`{
  "amount": ${amount},
  "currency": "INR",
  "customer_username": "${username}",
  "customer_email": "${email}",
  "customer_mobile": "${mobile}"
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
