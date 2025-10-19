'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import PageHeader from '@/components/common/page-header';

export default function ContactUsPage() {

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
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden">
            <PageHeader title="CONTACT US" />

            {/* Description Text */}
            <div className="px-6 py-6 pt-[20vh]">
                <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">
                    You can get in touch with us through below platform. Our team will reach out to you as soon as it would be possible.
                </div>
            </div>

            {/* Customer Support Section */}
            <div className="px-6 py-4">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px] whitespace-nowrap">Customer Support</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                </div>

                {/* Contact Items */}
                <div className="space-y-4">
                    {/* Phone */}
                    <button
                        onClick={() => handleContactClick('phone', '+919XXXXXXXXX')}
                        className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                    >
                        <div className="w-[30px] h-[30px] relative overflow-hidden">
                            <Phone size={24} className="absolute left-[3.75px] top-[2.81px] text-[#14FFEC]" />
                        </div>
                        <div className="flex-col justify-center items-start gap-1 inline-flex">
                            <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Contact Number</div>
                            <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">+919XXXXXXXXX</div>
                        </div>
                    </button>

                    {/* Email */}
                    <button
                        onClick={() => handleContactClick('email', 'help@Clubwiz.com')}
                        className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                    >
                        <div className="w-[30px] h-[30px] relative overflow-hidden">
                            <Mail size={24} className="absolute left-[2.81px] top-[5.62px] text-[#14FFEC]" />
                        </div>
                        <div className="flex-col justify-center items-start gap-1 inline-flex">
                            <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Email Address</div>
                            <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">help@Clubwiz.com</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* My Preferences Section */}
            <div className="px-6 py-4">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px] whitespace-nowrap">My Preferences</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                </div>

                {/* Social Media Items */}
                <div className="space-y-4">

                    {/* Instagram */}
                    <button
                        onClick={() => handleContactClick('instagram', '@Clubwiz_ngp')}
                        className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                    >
                        <div className="w-[30px] h-[30px] relative overflow-hidden">
                            <Instagram size={24} className="absolute left-[2.81px] top-[2.81px] text-[#14FFEC]" />
                        </div>
                        <div className="flex-col justify-center items-start gap-1 inline-flex">
                            <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Instagram</div>
                            <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                        </div>
                    </button>

                    {/* WhatsApp */}
                    <button
                        onClick={() => handleContactClick('whatsapp', '@Clubwiz_ngp')}
                        className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                    >
                        <div className="w-[30px] h-[30px] relative overflow-hidden">
                            <MessageCircle size={24} className="absolute left-[2.81px] top-[2.82px] text-[#14FFEC]" />
                        </div>
                        <div className="flex-col justify-center items-start gap-1 inline-flex">
                            <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Whatsapp</div>
                            <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                        </div>
                    </button>

                    {/* X.com */}
                    <button
                        onClick={() => handleContactClick('twitter', '@Clubwiz_ngp')}
                        className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                    >
                        <div className="w-[30px] h-[30px] relative overflow-hidden flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#14FFEC]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </div>
                        <div className="flex-col justify-center items-start gap-1 inline-flex">
                            <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">X.com</div>
                            <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}