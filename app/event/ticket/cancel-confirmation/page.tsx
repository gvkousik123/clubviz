'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/page-header';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function CancelTicketConfirmationPage() {
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState<number | null>(null);

    const handleReturn = () => {
        // Only proceed if a reason is selected
        if (selectedReason !== null) {
            // Navigate to a success cancellation page or back to home
            router.push('/event/ticket/cancelled');
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#021313]">
            <PageHeader title="CANCEL TICKET" />

            {/* Main Content */}
            <div className="pt-[20vh] pb-24 px-4 flex flex-col items-center">
                {/* Info Notice */}
                <div className="w-full bg-[#074344] rounded-lg p-4 mb-8 flex items-center">
                    <div className="w-6 h-6 mr-3 flex-shrink-0">
                        <Image
                            src="/common/Wallet.svg"
                            alt="Info"
                            width={24}
                            height={24}
                            className="text-[#14FFEC]"
                        />
                    </div>
                    <p className="text-white font-['Manrope'] text-sm font-medium">
                        Funds will reflect in your account in 3-4 working days
                    </p>
                </div>

                {/* Section Title */}
                <h2 className="text-white font-['Manrope'] text-xl font-semibold self-start mb-6">
                    Select the reason for cancellation
                </h2>

                {/* Cancellation Reasons */}
                <div className="w-full space-y-4 mb-10 bg-[#0D1F1F99] rounded-lg p-4 backdrop-opacity-50">
                    {[
                        'I want to book another event',
                        'Colliding with other event',
                        'Accidentally booked this event',
                        'Another reason',
                        'There is no vibe in this Event/Venue',
                        'I just want to cancel'
                    ].map((reason, index) => (
                        <div
                            key={index}
                            className="flex items-center w-full cursor-pointer"
                            onClick={() => setSelectedReason(index)}
                        >
                            <div
                                className={`w-6 h-6 rounded-full border border-[#14FFEC] flex items-center justify-center mr-3`}
                            >
                                {selectedReason === index && (
                                    <div className="w-3 h-3 rounded-full bg-[#14FFEC]"></div>
                                )}
                            </div>
                            <span className="text-white font-['Manrope'] text-base">
                                {reason}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Spacer to push content up */}
                <div className="flex-grow"></div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-8 left-0 right-0 px-4">
                <button
                    onClick={handleReturn}
                    className={`w-full max-w-md h-[50px] mx-auto rounded-full ${selectedReason !== null ? 'bg-[#074344]' : 'bg-[#0D1F1F]'} border border-[#14FFEC] flex justify-center items-center`}
                    disabled={selectedReason === null}
                >
                    <span className="text-white text-lg font-['Manrope'] font-medium">
                        Cancel ticket
                    </span>
                </button>
            </div>
        </div>
    );
}
