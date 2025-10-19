'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Mail, Phone, Plus, Minus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/common/page-header';

// Add custom CSS for hiding scrollbar while keeping functionality
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

export default function PaymentPage() {
    const router = useRouter();
    const [showCouponPopup, setShowCouponPopup] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

    // Available coupons data
    const availableCoupons = [
        { id: 1, code: 'FLAT150', discount: '₹150', description: 'Save upto ₹150 with this code' },
        { id: 2, code: 'FLAT150', discount: '₹150', description: 'Save upto ₹150 with this code' }
    ];

    // Payment options data
    const paymentOptions = [
        { id: 'cards', title: 'Cards', icon: '/pay/CreditCard.svg', actions: [{ label: 'Add credit or debit cards', actionType: 'add' }] },
        { id: 'upi', title: 'Pay by UPI apps', icon: '/pay/upi.png', actions: [{ label: 'Choose payment options', actionType: 'select' }, { label: 'Add new UPI ID', actionType: 'add' }] },
        { id: 'netbanking', title: 'Internet Banking', icon: '/pay/Bank.svg', actions: [{ label: 'Netbanking', actionType: 'add' }] },
        { id: 'venue', title: 'Pay at the venue', icon: '/pay/Money.svg', actions: [{ label: 'pay at the club Entry', actionType: 'select' }] }
    ];

    // Apply the scrollbar-hide style
    useEffect(() => {
        // Create style element and append to head
        const style = document.createElement('style');
        style.innerHTML = scrollbarHideStyle;
        document.head.appendChild(style);

        // Cleanup on unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleCloseCouponPopup = () => {
        setShowCouponPopup(false);
    };

    const handleSelectCoupon = (id: number) => {
        setSelectedCoupon(id === selectedCoupon ? null : id);
    };

    const handleApplyCoupon = () => {
        if (selectedCoupon) {
            const coupon = availableCoupons.find(c => c.id === selectedCoupon);
            if (coupon) {
                setAppliedCoupon(coupon.code);
                setShowPaymentOptions(true);
            }
        } else if (couponCode) {
            setAppliedCoupon(couponCode);
            setShowPaymentOptions(true);
        }
    };

    const handleSelectPaymentMethod = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
    };

    const handleBackToPaymentOptions = () => {
        setSelectedPaymentMethod(null);
    };

    const handleBackToCoupons = () => {
        setShowPaymentOptions(false);
    };

    const handlePayment = () => {
        // Show payment popup if not already showing
        if (!showCouponPopup) {
            setShowCouponPopup(true);
            setShowPaymentOptions(false);
        } else if (selectedPaymentMethod) {
            // Navigate to payment confirmation if payment method is selected
            router.push('/event/tickets');
        } else {
            // Show payment options if coupon is already applied
            if (appliedCoupon) {
                setShowPaymentOptions(true);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            <PageHeader title="PAYMENT" />

            {/* Main Content - Scrollable */}
            <div className="pt-[20vh] pb-24 h-screen overflow-y-auto scrollbar-hide">
                {/* Payment Summary Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Payment Summary</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-xl p-5">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[#B6B6B6] font-['Manrope'] text-sm">Ticket Price (2)</span>
                                <span className="text-white font-['Manrope'] font-medium">₹3,500</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-[#B6B6B6] font-['Manrope'] text-sm">Convenience Fee</span>
                                <span className="text-white font-['Manrope'] font-medium">₹150</span>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between text-[#14FFEC]">
                                    <span className="font-['Manrope'] text-sm">Coupon Discount</span>
                                    <span className="font-['Manrope'] font-medium">- ₹150</span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-[#14FFEC]/20 flex justify-between">
                                <span className="text-white font-['Manrope'] font-medium">Total Amount</span>
                                <span className="text-white font-['Manrope'] font-bold text-lg">
                                    ₹{appliedCoupon ? '3,500' : '3,650'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Event Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="/common/MaskHappy.svg" alt="Event" width="24" height="24" />
                            <p className="text-white font-['Manrope'] font-medium">Timeless Tuesdays Ft. DJ Xpensive</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">Dabo club & kitchen, Nagpur</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">24 Dec | 7:00 pm</p>
                        </div>
                    </div>
                </div>

                {/* Selected Ticket Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Selected Ticket</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        {/* Early bird male pass */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">Early bird male pass</p>
                            </div>
                            <div className="flex items-center">
                                <button className="w-7 h-7 rounded-full bg-[#14FFEC] flex items-center justify-center">
                                    <Plus size={16} className="text-black" />
                                </button>
                                <span className="mx-3 text-white font-['Manrope'] font-medium">1</span>
                                <button className="w-7 h-7 rounded-full bg-[#14FFEC] flex items-center justify-center">
                                    <Minus size={16} className="text-black" />
                                </button>
                            </div>
                        </div>

                        {/* Early bird Couple pass */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">Early bird Couple pass</p>
                            </div>
                            <div className="flex items-center">
                                <button className="w-7 h-7 rounded-full bg-[#14FFEC] flex items-center justify-center">
                                    <Plus size={16} className="text-black" />
                                </button>
                                <span className="mx-3 text-white font-['Manrope'] font-medium">1</span>
                                <button className="w-7 h-7 rounded-full bg-[#14FFEC] flex items-center justify-center">
                                    <Minus size={16} className="text-black" />
                                </button>
                            </div>
                        </div>

                        {/* Dotted line */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                        {/* Total Tickets */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">Total Tickets</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">2</span>
                        </div>

                        {/* Dotted line */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                        {/* No. of people attending */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/common/Ticket.svg" alt="Ticket" width="24" height="24" />
                                <p className="text-white font-['Manrope'] font-medium">No. of people attending</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">3</span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-4 mb-28">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-white font-['Manrope'] font-semibold text-lg whitespace-nowrap">Details</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        <p className="text-white font-['Manrope'] text-sm opacity-80">
                            Check-in before 8:00 PM is recommended for guaranteed entry and the best experience. After 8:00 PM, entry will be subject to venue capacity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Payment Button */}
            <div className="fixed bottom-0 left-0 right-0 z-40">
                <div className="w-full h-[100px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-between items-center px-8 h-full">
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-['Manrope'] opacity-80">PAY:</span>
                            <span className="text-white text-2xl font-['Manrope'] font-bold">
                                ₹ {appliedCoupon ? '3350' : '3500'}
                            </span>
                            {appliedCoupon && (
                                <span className="text-[#14FFEC] text-xs font-['Manrope']">Coupon applied</span>
                            )}
                        </div>
                        <div className="w-[160px] h-[55px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                            <button
                                onClick={handlePayment}
                                className="w-full h-full flex justify-center items-center"
                            >
                                <span className="text-center text-white text-[18px] font-['Manrope'] font-bold tracking-[0.05px]">
                                    {selectedPaymentMethod ? 'Pay Now' : 'Choose Payment'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Popup Overlay */}
            {showCouponPopup && (
                <div className="fixed inset-0 z-50 flex items-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={handleCloseCouponPopup}
                    ></div>

                    {/* Popup Content */}
                    <div className="relative w-full bg-[#021313] rounded-t-3xl p-6 z-10 animate-slide-up">
                        {/* Close Button */}
                        <button
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#021313] border border-[#0C898B] flex items-center justify-center"
                            onClick={handleCloseCouponPopup}
                        >
                            <X size={16} className="text-white" />
                        </button>

                        {!showPaymentOptions ? (
                            <>
                                {/* Coupon Input */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 relative rounded-xl overflow-hidden">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <img src="/common/Tag.svg" alt="Coupon" width="20" height="20" className="text-[#14FFEC]" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="w-full h-12 bg-[#021313] border border-[#0C898B] rounded-xl text-[#14FFEC] pl-12 pr-4 focus:outline-none focus:border-[#14FFEC] placeholder-[#14FFEC]"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="h-12 px-6 rounded-xl bg-[#021313] border border-[#0C898B] text-white font-['Manrope'] font-medium"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {/* Available Coupons */}
                                <p className="text-[#14FFEC] font-['Manrope'] mb-4">{availableCoupons.length} Coupons Available</p>

                                {/* Coupon List */}
                                <div className="space-y-4">
                                    {availableCoupons.map((coupon) => (
                                        <div
                                            key={coupon.id}
                                            className="flex items-center justify-between border border-[#0C898B] rounded-xl py-3 px-5 bg-[#021313]"
                                        >
                                            <div>
                                                <p className="text-[#14FFEC] font-['Manrope'] font-medium">Flat ₹150 OFF</p>
                                                <p className="text-[#14FFEC] text-sm">Save upto ₹150 with this code</p>
                                            </div>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCoupon === coupon.id ? 'border-[#14FFEC]' : 'border-[#0C898B]'}`}
                                                onClick={() => handleSelectCoupon(coupon.id)}
                                            >
                                                {selectedCoupon === coupon.id && (
                                                    <div className="w-3 h-3 rounded-full bg-[#14FFEC]"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="payment-options">
                                <div className="flex items-center gap-4 mb-5">
                                    <h2 className="text-white font-['Manrope'] font-semibold text-xl text-center w-full">Choose your Payment Option</h2>
                                </div>

                                {paymentOptions.map((option) => (
                                    <div key={option.id} className="mb-5">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-[#14FFEC] font-['Manrope'] whitespace-nowrap">{option.title}</h3>
                                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                        </div>                                        {option.actions.map((action, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between border border-[#0C898B] rounded-xl py-3 px-5 bg-[#021313] mb-3 cursor-pointer"
                                                onClick={() => router.push('/event/confirm-booking')}
                                            >
                                                <div className="flex items-center">
                                                    <img src={option.icon} alt={option.title} width="24" height="24" className="mr-4" />
                                                    <p className="text-[#B6B6B6] font-['Manrope']">{action.label}</p>
                                                </div>
                                                {action.actionType === 'select' ? (
                                                    <div className="text-[#14FFEC]">
                                                        <ChevronRight size={20} />
                                                    </div>
                                                ) : (
                                                    <div className="text-[#14FFEC] font-['Manrope'] font-medium">ADD</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
