'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        MY ACCOUNT
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 space-y-8">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center">
                    {/* Profile Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-4 border-teal-400/30 flex items-center justify-center mb-4">
                        <span className="text-4xl">🐻</span>
                    </div>

                    {/* Profile Info */}
                    <h2 className="text-white font-bold text-xl mb-2">DAVID SIMON</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-teal-400" />
                        <p className="text-white/80 text-sm">NAGPUR</p>
                    </div>

                    {/* Edit Profile Button */}
                    <Link href="/profile/edit">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-[25px] transition-all duration-300 flex items-center gap-2">
                            <Edit size={16} />
                            Edit Profile
                        </button>
                    </Link>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">Personal Information</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    {/* Phone Number */}
                    <div className="bg-[#222831] border border-teal-400/30 rounded-[25px] p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <Phone size={20} className="text-teal-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/70 text-sm">Phone Number</p>
                                <p className="text-white font-medium">+91 9XXXXXXXXX</p>
                            </div>
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="bg-[#222831] border border-teal-400/30 rounded-[25px] p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <Mail size={20} className="text-teal-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/70 text-sm">Email Address</p>
                                <p className="text-white font-medium">david.simon@email.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-[#222831] border border-teal-400/30 rounded-[25px] p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <MapPin size={20} className="text-teal-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/70 text-sm">Location</p>
                                <p className="text-white font-medium">Nagpur, Maharashtra</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">Account Settings</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full text-left bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300">
                            <p className="text-white font-medium">Privacy Settings</p>
                            <p className="text-white/70 text-sm">Manage your privacy preferences</p>
                        </button>

                        <button className="w-full text-left bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300">
                            <p className="text-white font-medium">Notification Settings</p>
                            <p className="text-white/70 text-sm">Customize your notifications</p>
                        </button>

                        <button className="w-full text-left bg-[#222831] border border-teal-400/30 rounded-[25px] p-4 hover:bg-[#2a2a38] transition-all duration-300">
                            <p className="text-white font-medium">Security</p>
                            <p className="text-white/70 text-sm">Change password and security settings</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}