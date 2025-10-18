'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Calendar, Music, Camera, Building, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

type ProfileFormState = {
    name: string;
    email: string;
    gender: string;
    city: string;
    dateOfBirth: string;
    musicGenre: string;
    clubType: string;
};

const INITIAL_FORM_STATE: ProfileFormState = {
    name: '',
    email: '',
    gender: '',
    city: '',
    dateOfBirth: '',
    musicGenre: '',
    clubType: '',
};

export default function EditProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileFormState>(INITIAL_FORM_STATE);

    const progress = useMemo(() => {
        const values = Object.values(profileData);
        const filled = values.filter((value) => value.trim().length > 0).length;
        if (!values.length) return 0;
        return Math.min(100, Math.round((filled / values.length) * 100));
    }, [profileData]);

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = <K extends keyof ProfileFormState>(field: K, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            <div className="relative mx-auto  min-h-screen ">
                {/* Header Section with Gradient Background */}
                <div className="relative bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-bl-[30px] rounded-br-[30px] px-4 pt-4 pb-8">


                    {/* Back Button and Title */}
                    <div className="flex items-center justify-between px-4 mb-6">
                        <button
                            onClick={handleGoBack}
                            className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                        >
                            <span className="text-white text-lg font-bold">&lt;</span>
                        </button>
                        <h1 className="text-white text-xl font-manrope font-bold tracking-[0.50px] absolute left-1/2 transform -translate-x-1/2">EDIT PROFILE</h1>
                        <div className="w-[35px]"></div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-4 mb-6 mt-4">
                        <div className="relative">
                            <div className="w-full h-1 bg-white/20 rounded-full"></div>
                            <div
                                className="absolute top-0 left-0 h-1 bg-[#14FFEC] rounded-full transition-all duration-300"
                                style={{ width: '40%' }}
                            ></div>
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className="text-white text-[11px] font-manrope font-semibold tracking-[0.11px]">
                                40% Complete
                            </span>
                        </div>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-[97px] h-[97px] rounded-full border-2 border-[#14FFEC]"></div>
                            <img
                                className="absolute top-[6px] left-[6px] w-[85px] h-[85px] bg-[#D9D9D9] rounded-full object-cover"
                                src="/profile/teddy-dp.png"
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-[#021313] rounded-[16px] flex items-center justify-center">
                                <Camera className="w-4 h-4 text-[#14FFEC]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 space-y-6">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-base whitespace-nowrap">Personal Info</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src="/profile-edit/IdentificationCard.svg"
                                        alt="Name"
                                        width={24}
                                        height={24}
                                        className="text-[#14FFEC]"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={profileData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src="/profile-edit/Envelope (1).svg"
                                        alt="Email"
                                        width={24}
                                        height={24}
                                        className="text-[#14FFEC]"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* Gender and City Row */}
                            <div className="flex gap-1">
                                <div className="w-1/2 bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-4 py-3 flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/profile-edit/GenderIntersex.svg"
                                            alt="Gender"
                                            width={20}
                                            height={20}
                                            style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Gender"
                                        value={profileData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none min-w-0"
                                    />
                                </div>
                                <div className="w-1/2 bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-4 py-3 flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/profile-edit/City.svg"
                                            alt="City"
                                            width={20}
                                            height={20}
                                            style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={profileData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src="/profile-edit/CalendarBlank.svg"
                                        alt="Date of Birth"
                                        width={24}
                                        height={24}
                                        className="text-[#14FFEC]"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* My Preferences Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-base whitespace-nowrap">My Preferences</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        <div className="space-y-4">
                            {/* Music Genre Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src="/profile-edit/TagChevron.svg"
                                        alt="Music Genre"
                                        width={24}
                                        height={24}
                                        className="text-[#14FFEC]"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Music Genre"
                                    value={profileData.musicGenre}
                                    onChange={(e) => handleInputChange('musicGenre', e.target.value)}
                                    className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* Club Type Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src="/profile-edit/TagChevron (1).svg"
                                        alt="Club Type"
                                        width={24}
                                        height={24}
                                        className="text-[#14FFEC]"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(95%) saturate(1712%) hue-rotate(141deg) brightness(102%) contrast(101%)' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Club Type"
                                    value={profileData.clubType}
                                    onChange={(e) => handleInputChange('clubType', e.target.value)}
                                    className="flex-1 bg-transparent text-[#9D9C9C] text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
