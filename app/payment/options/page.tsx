'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Building, DollarSign, ArrowLeft } from 'lucide-react';

export default function PaymentOptionsPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleOptionSelect = (option: string) => {
        console.log('Selected payment option:', option);
        // Handle payment option selection
        if (option === 'venue') {
            // For venue payment, might go directly to booking confirmation
            router.push('/ticket/complete');
        }
    };

    const handleAddCard = () => {
        console.log('Add credit/debit card');
        // Handle add card functionality
    };

    const handleAddUPI = () => {
        console.log('Add UPI ID');
        // Handle add UPI functionality
    };

    const handleNetbanking = () => {
        console.log('Netbanking selected');
        // Handle netbanking
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8 pt-4">

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        Choose your Payment Option
                    </h1>
                </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 space-y-8">
                {/* Cards Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">Cards</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>

                    <button
                        onClick={handleAddCard}
                        className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <CreditCard size={20} className="text-white" />
                            <span className="text-white">Add credit or debit cards</span>
                        </div>
                        <span className="text-white font-bold text-sm">ADD</span>
                    </button>
                </div>

                {/* Pay by UPI apps Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">Pay by UPI apps</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        {/* Google Pay Option */}
                        <button
                            onClick={() => handleOptionSelect('gpay')}
                            className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                {/* Google Pay Icon */}
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">G</span>
                                </div>
                                <span className="text-white">Choose payment options</span>
                            </div>
                            <ChevronRight size={20} className="text-white" />
                        </button>

                        {/* PhonePe Option */}
                        <button
                            onClick={() => handleOptionSelect('phonepe')}
                            className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                {/* PhonePe Icon */}
                                <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">₹</span>
                                </div>
                                <span className="text-white">Choose payment options</span>
                            </div>
                            <ChevronRight size={20} className="text-white" />
                        </button>

                        {/* Add UPI ID Option */}
                        <button
                            onClick={handleAddUPI}
                            className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs">₹</span>
                                </div>
                                <span className="text-white">Add new UPI ID</span>
                            </div>
                            <span className="text-white font-bold text-sm">ADD</span>
                        </button>
                    </div>
                </div>

                {/* Internet Banking Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">Internet Banking</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>

                    <button
                        onClick={handleNetbanking}
                        className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <Building size={20} className="text-white" />
                            <span className="text-white">Netbanking</span>
                        </div>
                        <span className="text-white font-bold text-sm">ADD</span>
                    </button>
                </div>

                {/* Pay at the venue Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">pay at the venue</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>

                    <button
                        onClick={() => handleOptionSelect('venue')}
                        className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <DollarSign size={20} className="text-white" />
                            <span className="text-white">pay at the club Entry</span>
                        </div>
                        <ChevronRight size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}