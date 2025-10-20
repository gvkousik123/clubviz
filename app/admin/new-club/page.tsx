'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import '../new-event/styles.css';

export default function NewClubPage() {
    const router = useRouter();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        clubName: '',
        location: '',
        logo: null as File | null
    });

    // References for image upload sections
    const foodDrinksRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const ambienceRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const menuRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleLogoUpload = () => {
        logoInputRef.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
        }
    };

    const handleImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleNavigate = (path: string) => {
        // Navigate to specific sections
        console.log(`Navigating to ${path}`);
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <span className="text-white text-xl font-bold">&lt;</span>
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Enter Club Details</h1>
                </div>
            </div>

            {/* Main Content - Scrollable container */}
            <div className="px-0 pt-[100px] pb-20 relative z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col items-center gap-[20px] p-[20px_14px_30px]">
                    {/* Logo Upload */}
                    <div
                        onClick={handleLogoUpload}
                        className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex flex-col items-center justify-center p-2 cursor-pointer"
                    >
                        <img
                            src="/admin/upload.svg"
                            alt="Upload"
                            width={30}
                            height={30}
                            className="mb-2"
                        />
                        <p className="text-white text-center text-[16px] font-semibold leading-[16px] tracking-[0.5px]">Upload logo here</p>
                    </div>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />

                    {/* Club Name */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Club Name</label>
                        </div>
                        <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                            <input
                                type="text"
                                value={formData.clubName}
                                onChange={(e) => handleInputChange('clubName', e.target.value)}
                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                placeholder="Enter Club Name Here"
                            />
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="w-full">
                        <div className="px-5 mb-2">
                            <h3 className="text-white font-semibold text-base">Photos</h3>
                        </div>

                        {/* Food/Drinks Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px] mb-2">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Food/Drinks</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`food-drink-${index}`}
                                            onClick={() => handleImageUpload(foodDrinksRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={foodDrinksRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ambience Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px] mb-2">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Ambience</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`ambience-${index}`}
                                            onClick={() => handleImageUpload(ambienceRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={ambienceRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Menu Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px]">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Menu</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`menu-${index}`}
                                            onClick={() => handleImageUpload(menuRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={menuRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Location</label>
                        </div>
                        <div
                            onClick={() => handleNavigate('/location')}
                            className="w-full h-[55px] bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5 flex items-center justify-between cursor-pointer"
                        >
                            <span className="text-white text-base font-semibold">Add Location</span>
                            <ChevronRight className="text-[#14FFEC]" size={18} />
                        </div>
                    </div>

                    {/* Club Tags */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Club Tags</label>
                        </div>
                        <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-5 flex flex-col gap-5">
                            {['Facilities', 'Food', 'Music', 'Bar'].map((tag, index) => (
                                <div
                                    key={tag}
                                    onClick={() => handleNavigate(`/tags/${tag.toLowerCase()}`)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <span className="text-white text-base font-semibold">{tag}</span>
                                    <ChevronRight className="text-[#14FFEC]" size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Save Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[80px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-center items-center px-8 h-full">
                        <div className="w-[220px] h-[45px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                            <button
                                className="w-full h-full flex justify-center items-center cursor-pointer"
                            >
                                <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                    Save & Create Club
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
