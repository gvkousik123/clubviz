'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';

export default function ConfirmationPage() {
    const router = useRouter();


    return (
        <div className="min-h-screen w-full bg-[#021313] overflow-hidden">
            <PageHeader title="REVIEW EVENT BOOKING" />

            {/* Main Ticket Container */}
            <div className="px-4 pt-[20vh] pb-24">
                {/* Combined Ticket Card - Single component with sections */}
                <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] border border-[#14FFEC] mb-4 relative ">
                    {/* QR Code Section */}
                    <div className="w-full py-5 flex flex-col items-center">
                        {/* QR Code */}
                        <div>
                            <Image
                                src="/booking/main-qr.png"
                                alt="QR Code"
                                width={160}
                                height={160}
                                className="w-[160px] h-[160px]"
                            />
                        </div>

                        {/* Scan instructions */}
                        <p className="text-[#B6B6B6] text-base font-['Manrope'] font-medium mb-1">
                            Scan this QR code at the entrance
                        </p>

                        {/* Reservation ID */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#B6B6B6] text-sm font-['Manrope'] font-medium">Reservation ID:</span>
                            <span className="text-[#14FFEC] text-sm font-['Manrope'] font-bold">BO-290</span>
                        </div>
                    </div>

                    {/* Dotted separator line with ticket cuts */}
                    <div className="relative w-full flex items-center justify-center py-[1px]">
                        {/* Dashed line */}
                        <div className="w-full border-t-2 border-dashed border-[#14FFEC]"></div>

                        {/* Left cut - larger circles positioned to match the image */}
                        <div className="absolute top-[-15px] -left-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>

                        {/* Right cut - larger circles positioned to match the image */}
                        <div className="absolute top-[-15px] -right-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                    </div>

                    {/* Ticket Details Section */}
                    <div className="w-full">
                        {/* Guest Details - Two Column Grid */}
                        <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-4">
                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Name</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">David Simon</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Booking date</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">04 Apr | 4:00 pm</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Contact Number</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">+91 9XXXX9XXXX</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Number of Guest(s)</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">2 Guests</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Table Number</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">TG-03</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Notes</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">Birthday</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Floor Number</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">Ground Floor</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium leading-4">Duration</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">---</p>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="px-6 py-5 pt-2">
                            <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium mb-1">Benefits</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">Flat 30% OFF</p>
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium mt-1">Pay your bill between 7:00 PM to 11 PM</p>
                        </div>
                    </div>
                </div>                {/* What to do next section */}
                <div className="w-full bg-[#0D1F1F] rounded-[1.25rem] overflow-hidden p-2">
                    <div className="px-6 py-2">
                        <h3 className="text-white text-lg font-['Manrope'] font-bold mb-3">
                            So, What do we do next
                        </h3>

                        {/* Line separator between heading and content */}
                        <div className="w-full h-[1px] bg-[#FFFFFF10] mb-4"></div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <Image
                                    src="/booking/review-event-booking/ArrowBendUpRight.svg"
                                    alt="Direction"
                                    width={24}
                                    height={24}
                                    className="text-[#14FFEC]"
                                />
                            </div>
                            <p className="text-[#B6B6B6] text-sm font-['Manrope'] font-medium leading-6">
                                Ensure your presence at the venue on the allotted date & time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
