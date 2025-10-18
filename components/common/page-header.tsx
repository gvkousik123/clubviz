'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    onBack?: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
    const router = useRouter();

    const handleGoBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <>
            {/* Header */}
            <div className="w-full h-[120px] bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-b-[30px] relative">
                {/* Header Content */}
                <div className="flex items-center justify-between px-6 pt-6">
                    <button
                        onClick={handleGoBack}
                        className="w-[35px] h-[35px] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                    >
                        <span className="text-white text-lg font-bold">&lt;</span>
                    </button>
                </div>
                <div className="text-center px-6 pb-4 pt-2">
                    <div className="text-white text-xl font-['Manrope'] font-bold leading-6 tracking-[0.50px] break-words">{title}</div>
                </div>
            </div>
        </>
    );
}