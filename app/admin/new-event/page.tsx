'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Calendar, Clock, Music, User, Building2, Instagram, Music2, ImageIcon, VideoIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import './styles.css';

export default function NewEventPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const reelInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState({
        eventName: '',
        artistName: '',
        aboutArtist: '',
        instagramHandle: '',
        spotifyHandle: '',
        eventDate: '',
        eventTime: '',
        musicGenre: '',
        description: '',
        organizer: '',
        organizerLogo: null as File | null,
        poster: null as File | null,
        reel: null as File | null
    });

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, organizerLogo: file });
        }
    };

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, poster: file });
        }
    };

    const handleReelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, reel: file });
        }
    };

    const handleSaveEvent = () => {
        // Handle event creation logic here
        console.log('Creating event:', formData);
        // For now, just go back or navigate to success page
        router.push('/admin');
    };

    const tabs = [
        { id: 'details', label: 'Event Details' },
        { id: 'creatives', label: 'Event Creatives' },
        { id: 'tickets', label: 'Event Tickets' }
    ];

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Create new event</h1>
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

                        {/* Tab Navigation - horizontal tabs starting from left */}
                        <div className="pl-6 pr-4 py-2 overflow-x-scroll scrollbar-hide bg-[#021313]">
                            <div className="flex items-center gap-4 min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-[8px] rounded-[25px] text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[#004342] text-white hover:bg-[#005352]'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Scrollable content area */}
                    <div className="px-6 pb-36 overflow-y-auto h-[calc(100vh-280px)]  scrollbar-hide">
                        {activeTab === 'details' && (
                            <div className="space-y-5">
                                {/* Event Name */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Name *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="text"
                                            value={formData.eventName}
                                            onChange={(e) => handleInputChange('eventName', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* Artist Name */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Artist Name *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="text"
                                            value={formData.artistName}
                                            onChange={(e) => handleInputChange('artistName', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* About Artist */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">About Event Artist *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-5">
                                        <textarea
                                            value={formData.aboutArtist}
                                            onChange={(e) => handleInputChange('aboutArtist', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none resize-none h-[80px] text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* Social Handles - in one row */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Artist Social Handle</label>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <div className="flex items-center gap-3">
                                                <Instagram size={20} className="text-[#14FFEC]" />
                                                <input
                                                    type="text"
                                                    value={formData.instagramHandle}
                                                    onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                                                    className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                    placeholder="Instagram Handle"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <div className="flex items-center gap-3">
                                                <Music2 size={20} className="text-[#14FFEC]" />
                                                <input
                                                    type="text"
                                                    value={formData.spotifyHandle}
                                                    onChange={(e) => handleInputChange('spotifyHandle', e.target.value)}
                                                    className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                    placeholder="Spotify Handle"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Date and Time - in one row */}
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="px-5">
                                            <label className="text-[#14FFEC] font-semibold text-base">Event Date *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} className="text-[#14FFEC]" />
                                                <input
                                                    type="text"
                                                    value={formData.eventDate}
                                                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                                    className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                    placeholder="DD/MM/YYYY"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="px-5">
                                            <label className="text-[#14FFEC] font-semibold text-base">Event Starting Time *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <div className="flex items-center gap-3">
                                                <Clock size={20} className="text-[#14FFEC]" />
                                                <input
                                                    type="text"
                                                    value={formData.eventTime}
                                                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                                                    className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                    placeholder="00:00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Music Genre */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Music Genre *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <div className="flex items-center gap-3">
                                            <Music size={20} className="text-[#14FFEC]" />
                                            <input
                                                type="text"
                                                value={formData.musicGenre}
                                                onChange={(e) => handleInputChange('musicGenre', e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Type Music genre..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Event Description */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Description</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none resize-none h-[80px] text-base font-semibold"
                                            placeholder="Write a description of the the event here..."
                                        />
                                    </div>
                                </div>

                                {/* Event Organizer */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Organizer</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <div className="flex items-center gap-3">
                                            <Building2 size={20} className="text-[#14FFEC]" />
                                            <input
                                                type="text"
                                                value={formData.organizer}
                                                onChange={(e) => handleInputChange('organizer', e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Event Organized by"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Event Organizer Logo */}
                                <div className="space-y-3 flex flex-col items-center">
                                    <div className="self-stretch px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Organizer logo</label>
                                    </div>
                                    <div
                                        onClick={() => handleFileUpload(fileInputRef)}
                                        className="w-[120px] h-[120px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-2 cursor-pointer"
                                    >
                                        <Upload size={36} className="text-[#14FFEC] mb-2" />
                                        <p className="text-white text-center text-base font-semibold">Upload logo here</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'creatives' && (
                            <div className="space-y-6 flex flex-col items-center">
                                {/* Event Poster */}
                                <div className="space-y-3 w-full">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Poster *</label>
                                    </div>
                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => handleFileUpload(posterInputRef)}
                                            className="w-[200px] h-[280px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-4 cursor-pointer"
                                        >
                                            <ImageIcon size={40} className="text-[#14FFEC] mb-4" />
                                            <p className="text-white text-center font-semibold">Upload poster here</p>
                                            {formData.poster && (
                                                <p className="text-[#14FFEC] text-sm mt-2 text-center">
                                                    {formData.poster.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={posterInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePosterChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Event Reel */}
                                <div className="space-y-3 w-full">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Reel</label>
                                    </div>
                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => handleFileUpload(reelInputRef)}
                                            className="w-[200px] h-[200px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-4 cursor-pointer"
                                        >
                                            <VideoIcon size={40} className="text-[#14FFEC] mb-4" />
                                            <p className="text-white text-center font-semibold">Upload reel here</p>
                                            {formData.reel && (
                                                <p className="text-[#14FFEC] text-sm mt-2 text-center">
                                                    {formData.reel.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={reelInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleReelChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}                        {activeTab === 'tickets' && (
                            <div className="space-y-6">
                                {/* Ticket Types */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Ticket Types *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <div className="flex flex-col gap-4">
                                            {/* Entry Ticket Option */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-full border border-[#14FFEC] flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-[#14FFEC] rounded-full"></div>
                                                    </div>
                                                    <span className="text-white font-semibold">Entry</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#14FFEC] font-semibold">₹ 499</span>
                                                    <button className="px-4 py-1 bg-[#0C898B] rounded-full text-white text-sm font-semibold">Edit</button>
                                                </div>
                                            </div>

                                            {/* Add New Ticket Type Button */}
                                            <button className="flex items-center justify-center gap-2 py-2 border border-dashed border-[#14FFEC] rounded-[15px] text-[#14FFEC] font-semibold">
                                                <span>+</span> Add New Ticket Type
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Availability */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Ticket Availability</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-semibold">Limited Tickets</span>
                                            <div className="relative">
                                                <div className="w-12 h-6 bg-[#0C898B]/30 rounded-full"></div>
                                                <div className="absolute left-0 top-0 w-6 h-6 bg-[#14FFEC] rounded-full shadow"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Number of Tickets */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Number of Tickets</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Save Button */}
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="w-full h-[80px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                        <div className="flex justify-center items-center px-8 h-full">
                            <div className="w-[160px] h-[45px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                                <button
                                    onClick={handleSaveEvent}
                                    className="w-full h-full flex justify-center items-center"
                                >
                                    <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                        Save & Create Event
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
