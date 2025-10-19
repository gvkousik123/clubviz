'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Share2, ChevronLeft } from 'lucide-react';

export default function TicketPage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Event Ticket',
                text: 'Check out my ticket for this event!',
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            alert('Share functionality not available');
        }
    };

    const handleDownload = () => {
        // Implement ticket download functionality
        alert('Downloading ticket...');
    };

    const handleCancel = () => {
        router.push('/event/ticket/cancel-confirmation');
    };

    return (
        <div className="min-h-screen w-full bg-[#021313] relative">
            {/* Header */}
            <div className="w-full h-[12vh] bg-[#074344] rounded-b-[25px] flex items-center justify-between px-6 relative">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>

                <h1 className="text-white text-xl font-['Manrope'] font-bold absolute left-1/2 transform -translate-x-1/2">
                    MY TICKET
                </h1>

                <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-[#FFFFFF33] rounded-full flex items-center justify-center"
                >
                    <Share2 size={20} className="text-white" />
                </button>
            </div>

            {/* Main Ticket Content */}
            <div className="px-4 pt-6 pb-4">
                {/* Ticket Card with Event Image */}
                <div className="w-full bg-[#0D1F1F] rounded-[20px] border border-[#14FFEC] overflow-hidden">
                    {/* Event Image Section */}
                    <div className="relative w-full h-[200px] overflow-hidden border-b border-[#14FFEC]">
                        <Image
                            src="/event list/Rectangle 1.jpg"
                            alt="Event"
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                        />
                        {/* Event Title Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <h2 className="text-white text-2xl font-['Manrope'] font-bold text-center px-4">
                                TIMELESS TUESDAYS FT. DJ XPENSIVE
                            </h2>
                        </div>
                    </div>

                    {/* Dotted separator line with ticket cuts */}
                    <div className="relative w-full flex items-center justify-center py-[1px]">
                        <div className="w-full border-t-2 border-dashed border-[#14FFEC]"></div>
                        <div className="absolute top-[-15px] -left-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                        <div className="absolute top-[-15px] -right-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                    </div>

                    {/* Ticket Details */}
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-y-4">
                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Location</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">Dabo club & kitchen, Nagpur</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Time</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">07:00 PM</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Name</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">David Simon</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Dress code</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">Funky Pop</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">Date</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">24th December 2024</p>
                            </div>

                            <div>
                                <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium">No. of people</p>
                                <p className="text-white text-sm font-['Manrope'] font-bold mt-1">3 Entries</p>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="mt-4">
                            <p className="text-[#14FFEC] text-xs font-['Manrope'] font-medium">Benefits</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold mt-1">Flat 10% OFF on IFML</p>
                            <p className="text-[#B6B6B6] text-xs font-['Manrope'] font-medium mt-1">Redeem your offer before 11:00 PM</p>
                        </div>
                    </div>

                    {/* Dotted separator line with ticket cuts */}
                    <div className="relative w-full flex items-center justify-center py-[1px]">
                        <div className="w-full border-t-2 border-dashed border-[#14FFEC]"></div>
                        <div className="absolute top-[-15px] -left-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                        <div className="absolute top-[-15px] -right-[15px] w-12 h-12 bg-[#021313] rounded-full"></div>
                    </div>

                    {/* QR Code Section */}
                    <div className="p-5 flex flex-col items-center">
                        <p className="text-white text-sm font-['Manrope'] font-medium mb-3 text-center">
                            Scan this QR code at the entry
                        </p>
                        <div className="mb-3">
                            <Image
                                src="/booking/main-qr.png"
                                alt="QR Code"
                                width={140}
                                height={140}
                                className="w-[140px] h-[140px]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-['Manrope'] font-medium">Ticket ID -</p>
                            <p className="text-white text-sm font-['Manrope'] font-bold">19584265</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 mt-8 mb-10 space-y-3">
                <button
                    onClick={handleDownload}
                    className="w-full h-[50px] rounded-full bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        Download ticket
                    </span>
                </button>

                <button
                    onClick={handleCancel}
                    className="w-full h-[50px] rounded-full bg-transparent border border-[#FFFFFF33] flex justify-center items-center"
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        Cancel ticket
                    </span>
                </button>
            </div>
        </div>
    );
}
