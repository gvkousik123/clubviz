'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, User, Mail, Calendar, Music, Building, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function EditProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        gender: '',
        city: '',
        dateOfBirth: '',
        musicGenre: '',
        clubType: ''
    });

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData({ ...profileData, [field]: value });
    };

    const handleProfilePhotoClick = () => {
        console.log('Upload profile photo');
    };

    const progress = 40; // Static to match design

    return (
        <div className="min-h-screen bg-[#1e2328] text-white">
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
                        EDIT PROFILE
                    </h1>
                </div>

                {/* Progress Section */}
                <div className="flex items-center justify-end mb-6">
                    <span className="text-white text-sm font-medium">
                        {progress}% Complete
                    </span>
                </div>

                <div className="bg-white/20 rounded-full h-1 mb-8">
                    <div
                        className="bg-white h-1 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Profile Photo Section */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-cyan-400">
                            <span className="text-2xl">🐻</span>
                        </div>
                        <button
                            onClick={handleProfilePhotoClick}
                            className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-cyan-400"
                        >
                            <Camera size={12} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 space-y-8">
                {/* Personal Info Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-white font-semibold text-base">Personal Info</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="glassmorphism rounded-3xl p-4">
                            <div className="flex items-center">
                                <User size={18} className="text-cyan-400 mr-3" />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    placeholder="Name"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="glassmorphism rounded-3xl p-4">
                            <div className="flex items-center">
                                <Mail size={18} className="text-cyan-400 mr-3" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    placeholder="Email"
                                />
                            </div>
                        </div>

                        {/* Gender and City Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glassmorphism rounded-3xl p-4">
                                <div className="flex items-center">
                                    <span className="text-cyan-400 mr-3 text-lg">⚬</span>
                                    <input
                                        type="text"
                                        value={profileData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                        placeholder="Gender"
                                    />
                                </div>
                            </div>

                            <div className="glassmorphism rounded-3xl p-4">
                                <div className="flex items-center">
                                    <MapPin size={18} className="text-cyan-400 mr-3" />
                                    <input
                                        type="text"
                                        value={profileData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth Field */}
                        <div className="glassmorphism rounded-3xl p-4">
                            <div className="flex items-center">
                                <Calendar size={18} className="text-cyan-400 mr-3" />
                                <input
                                    type="text"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Preferences Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-white font-semibold text-base">My Preferences</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Music Genre Field */}
                        <div className="glassmorphism rounded-3xl p-4">
                            <div className="flex items-center">
                                <Music size={18} className="text-cyan-400 mr-3" />
                                <input
                                    type="text"
                                    value={profileData.musicGenre}
                                    onChange={(e) => handleInputChange('musicGenre', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    placeholder="Music Genre"
                                />
                            </div>
                        </div>

                        {/* Club Type Field */}
                        <div className="glassmorphism rounded-3xl p-4">
                            <div className="flex items-center">
                                <Building size={18} className="text-cyan-400 mr-3" />
                                <input
                                    type="text"
                                    value={profileData.clubType}
                                    onChange={(e) => handleInputChange('clubType', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    placeholder="Club Type"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
