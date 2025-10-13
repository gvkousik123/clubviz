'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import { ClubVizLogo } from '@/components/auth/logo';

export default function ContactUsPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleContactClick = (type: string, value: string) => {
        switch (type) {
            case 'phone':
                window.open(`tel:${value}`);
                break;
            case 'email':
                window.open(`mailto:${value}`);
                break;
            case 'instagram':
                window.open('https://instagram.com/Clubwiz_ngp', '_blank');
                break;
            case 'whatsapp':
                window.open('https://wa.me/message/XXXXXXXXXXXXX', '_blank');
                break;
            case 'twitter':
                window.open('https://twitter.com/Clubwiz_ngp', '_blank');
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        CONTACT US
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 space-y-8">
                {/* Description */}
                <div className="text-center">
                    <p className="text-white/80 text-sm leading-relaxed">
                        You can get in touch with us through below platform. Our team will reach out to you as soon as it would be possible.
                    </p>
                </div>

                {/* Customer Support Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Customer Support</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    {/* Contact Number */}
                    <button
                        onClick={() => handleContactClick('phone', '+919XXXXXXXXX')}
                        className="w-full bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <Phone size={20} className="text-teal-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/70 text-sm">Contact Number</p>
                                <p className="text-white font-medium">+919XXXXXXXXX</p>
                            </div>
                        </div>
                    </button>

                    {/* Email Address */}
                    <button
                        onClick={() => handleContactClick('email', 'help@Clubwiz.com')}
                        className="w-full bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <Mail size={20} className="text-teal-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/70 text-sm">Email Address</p>
                                <p className="text-white font-medium">help@Clubwiz.com</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* My Preferences Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">My Preferences</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    {/* Instagram */}
                    <button
                        onClick={() => handleContactClick('instagram', '@Clubwiz_ngp')}
                        className="w-full bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Instagram size={20} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/70 text-sm">Instagram</p>
                                <p className="text-white font-medium">@Clubwiz_ngp</p>
                            </div>
                        </div>
                    </button>

                    {/* WhatsApp */}
                    <button
                        onClick={() => handleContactClick('whatsapp', '@Clubwiz_ngp')}
                        className="w-full bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <MessageCircle size={20} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/70 text-sm">Whatsapp</p>
                                <p className="text-white font-medium">@Clubwiz_ngp</p>
                            </div>
                        </div>
                    </button>

                    {/* X.com */}
                    <button
                        onClick={() => handleContactClick('twitter', '@Clubwiz_ngp')}
                        className="w-full bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/20">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/70 text-sm">X.com</p>
                                <p className="text-white font-medium">@Clubwiz_ngp</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}