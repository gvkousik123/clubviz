'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Phone, Mail, Edit3, X, Check } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';

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

export default function ContactInfoPage() {
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

    // State for form inputs
    const [contactInfo, setContactInfo] = useState({
        maleName: 'David Simon',
        femaleName: 'Sammy Simon',
        stagName: 'Mukul Mehta',
        phone: '+91 9XXXX9XXXXX',
        email: 'DavidSimon@test.com'
    });

    // State for selected tickets
    const [selectedTickets, setSelectedTickets] = useState({
        maleStag: 1,
        couple: 1,
        female: 0
    });

    const handleNext = () => {
        router.push('/event/mobile'); // Adjust this route as needed
    };

    return (
        <div className="min-h-screen w-full relative bg-black">
            {/* Hero Section with Event Image */}
            <div className="relative h-[300px] w-full">
                <img
                    src="/event list/Rectangle 1.jpg"
                    alt="Event Banner"
                    className="w-full h-full object-cover brightness-90"
                />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                </div>

                {/* Share Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-[#000000] rounded-t-[40px] -mt-20 relative z-10 pt-4 pb-16">
                <h1 className="text-center text-white text-2xl font-['Anton'] tracking-[2.4px] leading-8">
                    Timeless Tuesdays Ft. DJ Xpensive
                </h1>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Event Details */}
                <div className="px-9 flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-3">
                        <svg className="text-[#14FFEC]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white font-['Manrope'] font-bold">Dabo club & kitchen, Nagpur</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg className="text-[#14FFEC] shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 8H21" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="bg-[#0D4444] border border-[#14FFEC]/40 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">24 Dec | 7:00 pm</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8"></div>
            </div>

            {/* Contact Info Section */}
            <div className="w-full absolute bottom-0 rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] min-h-[42%] z-20">
                <div className="px-6 pt-10 overflow-y-auto h-[calc(100vh-460px)] pb-24 scrollbar-hide">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-8">
                        # TICKET INFORMATION
                    </h2>

                    {/* Ticket Selection Summary */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-white font-['Manrope'] font-semibold">No. of ticket</div>
                            <div className="flex gap-3">
                                {selectedTickets.maleStag > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-['Manrope']">1 x</div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-3 py-1 flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-[#14FFEC] mr-2"></div>
                                            <span className="text-white text-sm">Male stag Entry</span>
                                            <div className="bg-[#0D1F1F] rounded-full p-1 ml-2">
                                                <X size={14} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mb-4">
                            <div className="flex gap-2">
                                <div className="text-white font-['Manrope']">1 x</div>
                                <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-3 py-1 flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-[#14FFEC] mr-2"></div>
                                    <span className="text-white text-sm">Couple Entry</span>
                                    <div className="bg-[#0D1F1F] rounded-full p-1 ml-2">
                                        <X size={14} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-40 mb-5"></div>
                    </div>

                    {/* Couple Ticket Info */}
                    <div className="mb-6">
                        <div className="text-white font-['Manrope'] font-semibold mb-3">Couple ticket</div>

                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-4 py-3 mb-3 flex items-center">
                            <Edit3 size={20} className="text-[#14FFEC] mr-3" />
                            <div className="flex flex-1">
                                <span className="text-[#14FFEC] font-['Manrope'] mr-2">Male Name :</span>
                                <span className="text-white font-['Manrope']">{contactInfo.maleName}</span>
                            </div>
                        </div>

                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-4 py-3 mb-2 flex items-center">
                            <Edit3 size={20} className="text-[#14FFEC] mr-3" />
                            <div className="flex flex-1">
                                <span className="text-[#14FFEC] font-['Manrope'] mr-2">Female Name :</span>
                                <span className="text-white font-['Manrope']">{contactInfo.femaleName}</span>
                            </div>
                        </div>

                        <p className="text-white text-sm font-['Manrope'] opacity-80 mb-4">
                            Ensure your presence at the venue on the allotted date & time.
                        </p>

                        {/* Divider */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-40 mb-5"></div>
                    </div>

                    {/* Male Stag Entry */}
                    <div className="mb-6">
                        <div className="text-white font-['Manrope'] font-semibold mb-3">Male Stag Entry</div>

                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-4 py-3 mb-2 flex items-center">
                            <Edit3 size={20} className="text-[#14FFEC] mr-3" />
                            <div className="flex flex-1">
                                <span className="text-[#14FFEC] font-['Manrope'] mr-2">Name :</span>
                                <span className="text-white font-['Manrope']">{contactInfo.stagName}</span>
                            </div>
                        </div>

                        <p className="text-white text-sm font-['Manrope'] opacity-80 mb-4">
                            Ensure your presence at the venue on the allotted date & time.
                        </p>

                        {/* Divider */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-40 mb-5"></div>
                    </div>

                    {/* Confirm Details */}
                    <div className="mb-8">
                        <div className="text-white font-['Manrope'] font-semibold mb-3">Confirm Your Details</div>

                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-4 py-3 mb-3 flex items-center">
                            <Phone size={20} className="text-[#14FFEC] mr-3" />
                            <span className="text-[#6D6D6D] font-['Manrope'] flex-1">{contactInfo.phone}</span>
                            <div className="bg-[#0D1F1F] rounded-full p-1">
                                <Check size={20} className="text-[#14FFEC]" />
                            </div>
                        </div>

                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-4 py-3 flex items-center">
                            <Mail size={20} className="text-[#14FFEC] mr-3" />
                            <div className="flex flex-1">
                                <span className="text-[#6D6D6D] font-['Manrope'] mr-2">Email :</span>
                                <span className="text-white font-['Manrope']">{contactInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 z-30">
                    <div className="absolute bottom-0 left-0 right-0">
                        <BottomContinueButton
                            text="Next"
                            onClick={handleNext}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
