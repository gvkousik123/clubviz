'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, ArrowUpRight, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';

export default function ReviewEventBookingPage() {
    const router = useRouter();


    const handleContinue = () => {
        router.push('/booking/review-event-booking');
    };
    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Main Content Container */}
            <div className="absolute top-[10rem] left-0 right-0 bottom-0 bg-[#021313] overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-4 px-4 pb-8">
                    {/* Info message */}
                    <div className="mx-auto w-full px-3 py-2.5 bg-[#003935] rounded-[1.25rem]">
                        <p className="text-center text-white text-[0.8125rem] font-['Manrope'] font-medium leading-4 tracking-[0.13px]">
                            Please arrive at the venue at least 10 minutes prior to your scheduled booking to ensure a smooth and hassle free experience
                        </p>
                    </div>

                    {/* Venue details card */}
                    <div className="w-full h-[12.3125rem] bg-[#0D1F1F] rounded-[1.25rem] relative">
                        <div className="">
                            <div className="absolute left-6 top-6 w-20 h-20 rounded-full border border-[#14FFEC] overflow-hidden flex items-center justify-center">
                                <Image
                                    src="/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png"
                                    alt="Dabo Club"
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/80x80";
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute left-[7.3125rem] top-[1.625rem] w-[15.5rem] h-6">
                            <h2 className="text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.16px]">Dabo club & Kitchen</h2>
                        </div>

                        <div className="absolute left-[7.3125rem] top-[3.8125rem] flex items-center gap-2">
                            <div className="w-4 h-4 relative overflow-hidden">
                                <Image
                                    src="/booking/review-event-booking/Clock.svg"
                                    alt="Clock"
                                    width={16}
                                    height={16}
                                    className="text-[#14FFEC]"
                                />
                            </div>
                            <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px]">24 Dec | 7:00 pm</p>
                        </div>

                        <div className="absolute left-[7.3125rem] top-[5.625rem] flex items-start gap-2 w-[15.5rem]">
                            <div className="w-4 h-4 relative overflow-hidden flex-shrink-0">
                                <Image
                                    src="/booking/review-event-booking/MapPin.svg"
                                    alt="Location"
                                    width={16}
                                    height={16}
                                    className="text-[#14FFEC]"
                                />
                            </div>
                            <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px]">
                                6, New Manish Nagar, Somalwada, Nagpur
                            </p>
                        </div>

                        <div className="absolute left-[7.5rem] top-[9rem]">
                            <button className="flex items-center gap-2 bg-[#00534C] text-white rounded-[1.8125rem] py-[0.4375rem] px-3 text-[0.875rem] font-['Manrope'] font-medium leading-5 tracking-[0.14px]">
                                <Image
                                    src="/booking/review-event-booking/ArrowBendUpRight.svg"
                                    alt="Direction"
                                    width={20}
                                    height={20}
                                />
                                Get direction
                            </button>
                        </div>
                    </div>


                    {/* Booking details card */}
                    <div className="w-full h-[26.5rem] bg-[#0D1F1F] rounded-[1.25rem] relative">
                        <div className="absolute left-6 top-6 right-6 flex flex-col">
                            <div className="pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Booking date</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">04 Apr | 4:00 pm</p>
                            </div>

                            <div className="pt-3 pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Number of Guest(s)</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">2 Guests</p>
                            </div>

                            <div className="pt-3 pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Table Number</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">TG-03</p>
                            </div>

                            <div className="pt-3 pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Floor Number</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">Ground Floor</p>
                            </div>

                            <div className="pt-3 pb-3 border-b border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Notes</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">Birthday</p>
                            </div>

                            <div className="pt-3">
                                <p className="text-[#14FFEC] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Benefits</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">Flat 30% OFF</p>
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px] mt-1">Pay your bill between 7:00 PM to 11 PM</p>
                            </div>
                        </div>
                    </div>



                    {/* Person details card */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative p-6">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Name</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">David Simon</p>
                            </div>

                            <div className="pt-3 border-t border-[#FFFFFF30]">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Contact Number</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">+91 9XXXX9XXXX</p>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions card - expanded */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem]">
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-white text-[1rem] font-['Manrope'] font-medium leading-5 tracking-[0.16px]">Terms & Condition</p>

                            </div>

                            <div className="text-white text-[0.75rem] font-['Manrope'] leading-5 space-y-3">
                                <p>1. Table bookings are held for 15 minutes from the scheduled reservation time.</p>
                                <p>2. Cancellations must be made at least 4 hours before your reservation time.</p>
                                <p>3. The club reserves the right to refuse entry to improperly dressed or intoxicated guests.</p>
                                <p>4. Benefits and discounts are applicable as per club policy and may vary.</p>
                                <p>5. By confirming this booking, you agree to comply with all club rules and regulations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom confirm button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomContinueButton
                    text="Confirm Booking"
                    onClick={handleContinue}
                />
            </div>
        </div>
    );
}
