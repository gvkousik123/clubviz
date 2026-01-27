'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Phone, Mail, Edit3, X, Check, Loader2 } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_KEYS } from '@/lib/constants/storage';

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

function ContactInfoPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Get params from URL
    const eventId = searchParams.get('eventId') || '';
    const ticketType = searchParams.get('ticketType') || 'early';
    const maleStag = parseInt(searchParams.get('maleStag') || '0');
    const femaleStag = parseInt(searchParams.get('femaleStag') || '0');
    const couple = parseInt(searchParams.get('couple') || '0');

    const [eventData, setEventData] = useState<any>(null);

    // Apply the scrollbar-hide style
    useEffect(() => {
        // Create style element and append to head
        const style = document.createElement('style');
        style.innerHTML = scrollbarHideStyle;
        document.head.appendChild(style);

        // Load event data from sessionStorage
        const storedEventData = sessionStorage.getItem('currentEventData');
        if (storedEventData) {
            setEventData(JSON.parse(storedEventData));
        }

        // Cleanup on unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // State for form inputs - get from localStorage with fallback
    const [contactInfo, setContactInfo] = useState(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(STORAGE_KEYS.user);
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    return {
                        maleName: user.username || 'David Simon',
                        femaleName: 'Sammy Simon',
                        stagName: user.username || 'Mukul Mehta',
                        phone: user.mobile || '+91 9876543210',
                        email: user.email || 'DavidSimon@test.com'
                    };
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        }
        return {
            maleName: 'David Simon',
            femaleName: 'Sammy Simon',
            stagName: 'Mukul Mehta',
            phone: '+91 9876543210',
            email: 'DavidSimon@test.com'
        };
    });

    const handleNext = () => {
        // Validate that we have contact info
        if (!contactInfo.phone || !contactInfo.email) {
            toast({
                title: 'Error',
                description: 'Please provide contact information',
                variant: 'destructive',
            });
            return;
        }

        // Store booking data in sessionStorage
        const bookingData = {
            eventId,
            ticketType,
            maleStag,
            femaleStag,
            couple,
            maleName: contactInfo.maleName,
            femaleName: contactInfo.femaleName,
            stagName: contactInfo.stagName,
            phone: contactInfo.phone,
            email: contactInfo.email,
            eventData: eventData // Pass event data along
        };
        sessionStorage.setItem('eventBookingData', JSON.stringify(bookingData));

        router.push(`/event/review-booking`);
    };

    return (
        <div className="min-h-screen w-full relative bg-black">
            {/* Hero Section with Event Image */}
            <div className="relative w-full bg-gray-900 flex justify-center items-center min-h-[200px] max-h-[400px]">
                <img
                    src={eventData?.imageUrl || eventData?.image || "/event list/Rectangle 1.jpg"}
                    alt={eventData?.title || "Event Banner"}
                    className="w-auto h-auto max-w-full max-h-[400px] object-contain"
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
                    {eventData?.title || "Event"}
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
                        <p className="text-white font-['Manrope'] font-bold">{eventData?.venue || 'Venue'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg className="text-[#14FFEC] shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 8H21" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="bg-[#0D4444] border border-[#14FFEC]/40 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">{eventData?.date || 'Date'} | {eventData?.time || 'Time'}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8"></div>
            </div>

            {/* Contact Info Section */}
            <div className="w-full absolute bottom-0 rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] min-h-[42%] max-h-[42%] z-20 flex flex-col">
                <div className="px-6 pt-10 overflow-y-auto flex-1 scrollbar-hide">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-8">
                        # TICKET INFORMATION
                    </h2>

                    {/* Ticket Selection Summary */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-white font-['Manrope'] font-semibold">No. of ticket</div>
                            <div className="flex flex-wrap gap-3 justify-end">
                                {maleStag > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-['Manrope']">{maleStag} x</div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-3 py-1 flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-[#14FFEC] mr-2"></div>
                                            <span className="text-white text-sm">Male stag Entry</span>
                                        </div>
                                    </div>
                                )}
                                {femaleStag > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-['Manrope']">{femaleStag} x</div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-3 py-1 flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-[#14FFEC] mr-2"></div>
                                            <span className="text-white text-sm">Female stag Entry</span>
                                        </div>
                                    </div>
                                )}
                                {couple > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-['Manrope']">{couple} x</div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-full px-3 py-1 flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-[#14FFEC] mr-2"></div>
                                            <span className="text-white text-sm">Couple Entry</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-40 mb-5 mt-4"></div>
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

export default function ContactInfoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <ContactInfoPageContent />
        </Suspense>
    );
}
