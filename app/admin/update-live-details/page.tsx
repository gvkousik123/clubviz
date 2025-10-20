'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import '../new-event/styles.css';

export default function UpdateLiveDetailsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        musicGenreTags: '',
        clubOffers: [{ offer: '' }, { offer: '' }],
        tickets: {
            maleStagEntry: {
                pricing: '',
                description: ''
            },
            femaleStagEntry: {
                pricing: '',
                description: ''
            },
            coupleEntry: {
                pricing: '',
                description: ''
            }
        }
    });

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleTicketChange = (category: string, field: string, value: string) => {
        setFormData({
            ...formData,
            tickets: {
                ...formData.tickets,
                [category]: {
                    ...formData.tickets[category as keyof typeof formData.tickets],
                    [field]: value
                }
            }
        });
    };

    const handleOfferChange = (index: number, value: string) => {
        const updatedOffers = [...formData.clubOffers];
        updatedOffers[index] = { offer: value };
        setFormData({ ...formData, clubOffers: updatedOffers });
    };

    const addNewOffer = () => {
        setFormData({
            ...formData,
            clubOffers: [...formData.clubOffers, { offer: '' }]
        });
    };

    const handleSave = () => {
        console.log('Saving live details:', formData);
        router.back();
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
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Update Live Details</h1>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Fixed header section that stays in place */}
                    <div className="w-full bg-[#021313] rounded-t-[40px]">
                        {/* Heading container */}
                        <div className="w-full pb-2">
                            <div className="flex items-center justify-center pt-8 pb-4">
                                <h2 className="text-[28px] font-bold text-white text-center tracking-wider font-['Anton']">
                                    DABO CLUB & KITCHEN
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Scrollable content area */}
                    <div className="px-6 pb-36 overflow-y-auto h-[calc(100vh-220px)] scrollbar-hide">
                        <div className="space-y-6">
                            {/* Live Music Info Section */}
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-white text-lg font-semibold">Live music info</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="px-1">
                                        <label className="text-[#14FFEC] font-semibold text-base">Music Genre tags</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="text"
                                            value={formData.musicGenreTags}
                                            onChange={(e) => handleInputChange('musicGenreTags', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="Enter Music Genre tags Here"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#14FFEC]/20 my-6"></div>

                            {/* Club Offers Section */}
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-white text-lg font-semibold">Club Offers if any</h3>
                                </div>

                                {formData.clubOffers.map((offer, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Club Offer No. {index + 1}</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={offer.offer}
                                                onChange={(e) => handleOfferChange(index, e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Enter Club Name Here"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add Another Offer Button */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#14FFEC] font-semibold">Add Another offer</span>
                                    <button
                                        onClick={addNewOffer}
                                        className="w-8 h-8 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus className="w-5 h-5 text-black" />
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#14FFEC]/20 my-6"></div>

                            {/* Live Ticket Pricing Section */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-white text-lg font-semibold">Live Ticket Pricing</h3>
                                </div>

                                {/* Male Stag Entry */}
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-white text-base font-semibold">Male Stag Entry</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Pricing details *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.maleStagEntry.pricing}
                                                onChange={(e) => handleTicketChange('maleStagEntry', 'pricing', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Enter Price here"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Description</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.maleStagEntry.description}
                                                onChange={(e) => handleTicketChange('maleStagEntry', 'description', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Write your Ticket Description here"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Female Stag Entry */}
                                <div className="space-y-3 mt-5">
                                    <div>
                                        <h4 className="text-white text-base font-semibold">Female Stag Entry</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Pricing details *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.femaleStagEntry.pricing}
                                                onChange={(e) => handleTicketChange('femaleStagEntry', 'pricing', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Enter Price here"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Description</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.femaleStagEntry.description}
                                                onChange={(e) => handleTicketChange('femaleStagEntry', 'description', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Write your Ticket Description here"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Couple Entry */}
                                <div className="space-y-3 mt-5">
                                    <div>
                                        <h4 className="text-white text-base font-semibold">Couple Entry</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Pricing details *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.coupleEntry.pricing}
                                                onChange={(e) => handleTicketChange('coupleEntry', 'pricing', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Enter Price here"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="px-1">
                                            <label className="text-[#14FFEC] font-semibold text-base">Ticket Description</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.tickets.coupleEntry.description}
                                                onChange={(e) => handleTicketChange('coupleEntry', 'description', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Write your Ticket Description here"
                                            />
                                        </div>
                                    </div>
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
                                        onClick={handleSave}
                                        className="w-full h-full flex justify-center items-center cursor-pointer"
                                    >
                                        <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                            Save
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
