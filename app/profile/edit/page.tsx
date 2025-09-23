'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, User, Mail, Calendar, Music, Building } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white">
            {/* Header with Gradient Background - Exact match to design */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                <div className="flex items-center justify-between p-6 pt-12">
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

                {/* Progress Section - Exact positioning and styling */}
                <div className="px-6 mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                            <div className="bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-teal-300 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="text-white text-sm font-medium ml-4">
                            {progress}% Complete
                        </span>
                    </div>

                    {/* Profile Photo Section - Exact circular design with bear emoji */}
                    <div className="flex justify-center mt-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center border-4 border-white/20">
                                <span className="text-3xl">🐻</span>
                            </div>
                            {/* Camera Icon Overlay - Exact positioning */}
                            <button
                                onClick={handleProfilePhotoClick}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-black/90 transition-all"
                            >
                                <Camera size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Exact spacing and layout */}
            <div className="px-6 py-8 space-y-8 pb-32">
                {/* Personal Info Section - Exact header styling */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">Personal Info</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Name Field - Exact styling with teal accents */}
                        <div className="relative">
                            <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                <User size={20} className="text-teal-400 mr-4" />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                    placeholder="Name"
                                />
                            </div>
                        </div>

                        {/* Email Field - Exact styling */}
                        <div className="relative">
                            <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                <Mail size={20} className="text-teal-400 mr-4" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                    placeholder="Email"
                                />
                            </div>
                        </div>

                        {/* Gender and City Row - Exact 2-column layout */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                    <span className="text-teal-400 mr-3 text-lg">⚬</span>
                                    <input
                                        type="text"
                                        value={profileData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                        placeholder="Gender"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                    <Building size={20} className="text-teal-400 mr-3" />
                                    <input
                                        type="text"
                                        value={profileData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth Field - Exact calendar styling */}
                        <div className="relative">
                            <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                <Calendar size={20} className="text-teal-400 mr-4" />
                                <input
                                    type="date"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Preferences Section - Exact styling to match design */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-lg">My Preferences</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-teal-400 to-transparent"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Music Genre Field - Exact styling with music icon */}
                        <div className="relative">
                            <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                <Music size={20} className="text-teal-400 mr-4" />
                                <input
                                    type="text"
                                    value={profileData.musicGenre}
                                    onChange={(e) => handleInputChange('musicGenre', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                    placeholder="Music Genre"
                                />
                            </div>
                        </div>

                        {/* Club Type Field - Exact styling with building icon */}
                        <div className="relative">
                            <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                                <Building size={20} className="text-teal-400 mr-4" />
                                <input
                                    type="text"
                                    value={profileData.clubType}
                                    onChange={(e) => handleInputChange('clubType', e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                    placeholder="Club Type"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button - Exact gradient styling and positioning */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                <button
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl 
                   shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                   transform hover:scale-[1.02] transition-all duration-300"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}
