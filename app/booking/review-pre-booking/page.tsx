'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, ArrowUpRight, ChevronRight, X } from 'lucide-react';
import PageHeader from '@/components/common/page-header';

export default function ReviewEventBookingPage() {
    const router = useRouter();

    const handleViewTicket = () => {
        router.push('/ticket/view');
    };

    const handleCancelBooking = () => {
        router.push('/booking/cancel');
    };
    return (
        <div className="w-full min-h-screen relative bg-[#021313]">
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Main Content Container */}
            <div className="absolute top-[10rem] left-0 right-0 bottom-0 bg-[#021313] overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-4 px-4 pb-8">
                    {/* Success State */}
                    <div className="flex flex-col items-center justify-center py-8">
                        {/* Loading Circle with Angular Gradient */}
                        <div className="w-20 h-20 relative mb-6">
                            <div className="w-20 h-20 rounded-full border-4 border-[#0D1F1F]"></div>
                            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-r-transparent animate-spin border-[#14FFEC]"></div>
                        </div>

                        {/* Success Message */}
                        <h2 className="text-white text-[1.5rem] font-['Manrope'] font-bold leading-8 text-center mb-2">
                            Successfully Booked your Table
                        </h2>

                        {/* Reservation ID */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#B6B6B6] text-[0.875rem] font-['Manrope'] font-medium">Reservation ID:</span>
                            <span className="text-[#14FFEC] text-[0.875rem] font-['Manrope'] font-bold">BO-290</span>
                        </div>

                        {/* Instruction */}
                        <p className="text-[#B6B6B6] text-[0.875rem] font-['Manrope'] font-medium text-center mb-8">
                            Reach the venue before 15 mins of your booking
                        </p>
                    </div>


                    {/* Booking details card */}
                    <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] relative">
                        <div className="p-6 flex flex-col gap-4">
                            {/* Two column layout for main details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Booking date</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">04 Apr | 4:00 pm</p>
                                </div>
                                <div>
                                    <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Number of Guest(s)</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">2 Guests</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Table Number</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">TG-03</p>
                                </div>
                                <div>
                                    <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Notes</p>
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">Birthday</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="border-t border-[#FFFFFF30] pt-4">
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Location</p>
                                <div className="flex items-start gap-2 mt-1">
                                    <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px]">
                                        6, New Manish Nagar, Somalwada, Nagpur
                                    </p>
                                    <button className="w-5 h-5 flex-shrink-0 mt-0.5">
                                        <Image
                                            src="/booking/review-event-booking/ArrowBendUpRight.svg"
                                            alt="Direction"
                                            width={20}
                                            height={20}
                                            className="text-[#14FFEC]"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="border-t border-[#FFFFFF30] pt-4">
                                <p className="text-[#14FFEC] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px]">Benefits</p>
                                <p className="text-white text-[0.875rem] font-['Manrope'] font-bold leading-5 tracking-[0.14px] mt-1">Flat 30% OFF</p>
                                <p className="text-[#B6B6B6] text-[0.75rem] font-['Manrope'] font-medium leading-4 tracking-[0.12px] mt-1">Pay your bill between 7:00 PM to 11 PM</p>
                            </div>

                            {/* Cancel Booking Button */}
                            <div className="border-t border-[#FFFFFF30] pt-4 flex justify-center">
                                <button
                                    onClick={handleCancelBooking}
                                    className="flex items-center gap-2 text-white text-[0.875rem] font-['Manrope'] font-medium"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel Booking
                                </button>
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

            {/* Bottom View Ticket Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[100px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-center w-full">
                        <div className="w-[90%] max-w-[396px] h-[55px] mt-[20px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                            <button
                                onClick={handleViewTicket}
                                className="w-full h-full flex justify-center items-center"
                            >
                                <span className="text-center text-white text-[20px] font-['Manrope'] font-bold tracking-[0.05px]">
                                    View Ticket
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
