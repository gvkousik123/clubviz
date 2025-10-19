'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Calendar, Mail, Phone, Plus, Minus } from 'lucide-react';

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

export default function ReviewBookingPage() {
    const router = useRouter();

    // Apply the scrollbar-hide style
    React.useEffect(() => {
        // Create style element and append to head
        const style = document.createElement('style');
        style.innerHTML = scrollbarHideStyle;
        document.head.appendChild(style);

        // Cleanup on unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handlePayment = () => {
        // Navigate to payment page
        router.push('/payment/options');
    };

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            {/* Fixed Header with Back Button */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-[#005E5D] to-transparent pt-6 pb-14">
                <div className="flex items-center justify-center relative px-4 pt-2">
                    <button
                        onClick={handleBack}
                        className="absolute left-4 p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                    <h1 className="text-white text-xl font-['Anton'] tracking-wider">
                        REVIEW EVENT BOOKING
                    </h1>
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="pt-24 pb-24 h-screen overflow-y-auto scrollbar-hide">
                {/* Club Details Section */}
                <div className="px-4 mb-6">
                    <h2 className="text-white font-['Manrope'] font-semibold text-lg mb-4">
                        Club Details
                    </h2>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent opacity-60 mb-4"></div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="text-[#14FFEC]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
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

                        <div className="flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.5 19.5L4.5 18.5M4.5 18.5L14.5 8.5L15.5 9.5L5.5 19.5M4.5 18.5L3 20L4.5 21.5L6 20L4.5 18.5ZM14 6L18 10L21 7L17 3L14 6Z" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-white font-['Manrope'] font-medium">Dress Code - Funky Pop</p>
                        </div>
                    </div>
                </div>

                {/* Send Details To Section */}
                <div className="px-4 mb-6">
                    <h2 className="text-white font-['Manrope'] font-semibold text-lg mb-4">
                        Send Details to
                    </h2>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent opacity-60 mb-4"></div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">test@gmail.com</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={20} className="text-[#14FFEC]" />
                            <p className="text-white font-['Manrope'] font-medium">+91 9XXXX9XXXXX</p>
                        </div>
                    </div>
                </div>

                {/* Selected Ticket Section */}
                <div className="px-4 mb-6">
                    <h2 className="text-white font-['Manrope'] font-semibold text-lg mb-4">
                        Selected Ticket
                    </h2>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent opacity-60 mb-4"></div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        {/* Early bird male pass */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10V14C2 14 5.5 16 12 16C18.5 16 22 14 22 14V10M2 10C2 10 5.5 8 12 8C18.5 8 22 10 22 10M2 10V6C2 6 5.5 4 12 4C18.5 4 22 6 22 6V10M22 14V18C22 18 18.5 20 12 20C5.5 20 2 18 2 18V14" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10V14C2 14 5.5 16 12 16C18.5 16 22 14 22 14V10M2 10C2 10 5.5 8 12 8C18.5 8 22 10 22 10M2 10V6C2 6 5.5 4 12 4C18.5 4 22 6 22 6V10M22 14V18C22 18 18.5 20 12 20C5.5 20 2 18 2 18V14" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10V14C2 14 5.5 16 12 16C18.5 16 22 14 22 14V10M2 10C2 10 5.5 8 12 8C18.5 8 22 10 22 10M2 10V6C2 6 5.5 4 12 4C18.5 4 22 6 22 6V10M22 14V18C22 18 18.5 20 12 20C5.5 20 2 18 2 18V14" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-white font-['Manrope'] font-medium">Total Tickets</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">2</span>
                        </div>

                        {/* Dotted line */}
                        <div className="border-t border-dashed border-[#14FFEC]/40 my-4"></div>

                        {/* No. of people attending */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10V14C2 14 5.5 16 12 16C18.5 16 22 14 22 14V10M2 10C2 10 5.5 8 12 8C18.5 8 22 10 22 10M2 10V6C2 6 5.5 4 12 4C18.5 4 22 6 22 6V10M22 14V18C22 18 18.5 20 12 20C5.5 20 2 18 2 18V14" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-white font-['Manrope'] font-medium">No. of people attending</p>
                            </div>
                            <span className="text-white font-['Manrope'] font-bold">3</span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-4 mb-28">
                    <h2 className="text-white font-['Manrope'] font-semibold text-lg mb-4">
                        Details
                    </h2>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent opacity-60 mb-4"></div>

                    <div className="bg-[#0D1F1F] rounded-xl p-5">
                        <p className="text-white font-['Manrope'] text-sm opacity-80">
                            Check-in before 8:00 PM is recommended for guaranteed entry and the best experience. After 8:00 PM, entry will be subject to venue capacity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Payment Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[100px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-between items-center px-8 h-full">
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-['Manrope'] opacity-80">PAY:</span>
                            <span className="text-white text-2xl font-['Manrope'] font-bold">₹ 3350</span>
                        </div>
                        <div className="w-[160px] h-[55px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                            <button
                                onClick={handlePayment}
                                className="w-full h-full flex justify-center items-center"
                            >
                                <span className="text-center text-white text-[18px] font-['Manrope'] font-bold tracking-[0.05px]">
                                    Click to pay
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
