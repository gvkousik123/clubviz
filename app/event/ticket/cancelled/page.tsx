'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';

export default function CancelledTicketPage() {
    const router = useRouter();

    const handleProceedToHomepage = () => {
        router.push('/home');
    };

    return (
        <div className="min-h-screen w-full bg-[#021313]">
            <PageHeader title="CANCEL TICKET" />

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center pt-[15vh] px-6 min-h-[80vh]">
                {/* Ticket Icon */}
                <div className="w-32 h-32 bg-[#074344] rounded-full flex items-center justify-center mb-10">
                    <Image
                        src="/common/ticket-cancel.svg"
                        alt="Ticket Cancelled"
                        width={80}
                        height={80}
                    />
                </div>

                {/* Success Message Card */}
                <div className="w-full bg-[#074344] rounded-lg py-5 px-4 mb-8 flex justify-center shadow-lg">
                    <h2 className="text-white font-['Manrope'] text-xl font-semibold text-center">
                        Your ticket cancellation was successful
                    </h2>
                </div>

                {/* Confirmation Details */}
                <p className="text-white font-['Manrope'] text-base text-center mb-16 max-w-md">
                    Ticket cancellation was successful!
                    Your cancellation request has been processed. If you have further
                    questions or need additional assistance, feel free to contact our
                    support team. Thank you for using our service!
                </p>

                {/* Proceed to Homepage Button */}
                <div className="fixed bottom-8 left-0 right-0 px-6 flex justify-center">
                    <button
                        onClick={handleProceedToHomepage}
                        className="w-full max-w-md h-[50px] rounded-full bg-[#074344] border border-[#14FFEC] flex justify-center items-center"
                    >
                        <span className="text-white text-lg font-['Manrope'] font-medium">
                            Proceed to homepage
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
