'use client';

import React, { useState } from 'react';
import { ArrowLeft, Camera, User, Mail, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        city: '',
        dateOfBirth: '',
        musicGenre: '',
        clubType: ''
    });

    const [progressPercentage] = useState(40);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white">
            {/* Header with Progress */}
            <div className="p-6 pt-12">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div className="text-right">
                        <span className="text-white/60 text-sm">{progressPercentage}% Complete</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-6">EDIT PROFILE</h1>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-1 mb-8">
                    <div
                        className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {/* Profile Photo Section */}
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl overflow-hidden border-2 border-teal-400">
                            <img src="/placeholder-user.jpg" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center border-2 border-slate-900">
                            <Camera className="w-3 h-3 text-slate-900" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Info Section */}
            <div className="px-6">
                <h2 className="text-white text-lg font-medium mb-6">Personal Info</h2>

                <div className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                            <User className="w-5 h-5 text-teal-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Name"
                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                            <Mail className="w-5 h-5 text-teal-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Email"
                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Gender and City Row */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                                <User className="w-5 h-5 text-teal-400" />
                                <input
                                    type="text"
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    placeholder="Gender"
                                    className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                                <MapPin className="w-5 h-5 text-teal-400" />
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="City"
                                    className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="relative">
                        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                            <Calendar className="w-5 h-5 text-teal-400" />
                            <input
                                type="text"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                placeholder="DD/MM/YYYY"
                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* My Preferences Section */}
                <h2 className="text-white text-lg font-medium mt-12 mb-6">My Preferences</h2>

                <div className="space-y-4">
                    {/* Music Genre */}
                    <div className="relative">
                        <div className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                            <div className="flex items-center gap-3">
                                <ChevronRight className="w-5 h-5 text-teal-400" />
                                <span className="text-white">Music Genre</span>
                            </div>
                        </div>
                    </div>

                    {/* Club Type */}
                    <div className="relative">
                        <div className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-400/30">
                            <div className="flex items-center gap-3">
                                <ChevronRight className="w-5 h-5 text-teal-400" />
                                <span className="text-white">Club Type</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}