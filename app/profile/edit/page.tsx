'use client';

import React, { useState } from 'react';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        dateOfBirth: '1995-08-15',
        bio: 'Party enthusiast and music lover. Always looking for the next great event!'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        // Save profile data
        console.log('Saving profile:', formData);
        router.back();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
                <button
                    onClick={handleBack}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>

                <button
                    onClick={handleSave}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                    <Save className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Profile Photo Section */}
            <div className="px-6 py-8">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                            {formData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute bottom-0 right-0 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Camera className="w-6 h-6 text-white" />
                        </button>
                    </div>
                    <p className="text-white/70">Tap to change profile photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </div>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Location
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Enter your location"
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date of Birth
                            </div>
                        </label>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 resize-none"
                        />
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-semibold text-lg mb-4">Preferences</h3>

                        <div className="space-y-4">
                            {/* Music Genre */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Favorite Music Genre
                                </label>
                                <select className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300">
                                    <option value="">Select genre</option>
                                    <option value="electronic">Electronic</option>
                                    <option value="hip-hop">Hip Hop</option>
                                    <option value="house">House</option>
                                    <option value="techno">Techno</option>
                                    <option value="bollywood">Bollywood</option>
                                    <option value="rock">Rock</option>
                                    <option value="pop">Pop</option>
                                </select>
                            </div>

                            {/* Club Type */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Preferred Club Type
                                </label>
                                <select className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300">
                                    <option value="">Select type</option>
                                    <option value="nightclub">Nightclub</option>
                                    <option value="lounge">Lounge</option>
                                    <option value="sports-bar">Sports Bar</option>
                                    <option value="rooftop">Rooftop</option>
                                    <option value="live-music">Live Music Venue</option>
                                    <option value="dance-club">Dance Club</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-semibold text-lg mb-4">Privacy Settings</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Profile Visibility</p>
                                    <p className="text-white/60 text-sm">Allow others to see your profile</p>
                                </div>
                                <button className="relative w-12 h-6 bg-purple-500 rounded-full transition-colors">
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Activity Status</p>
                                    <p className="text-white/60 text-sm">Show when you're active</p>
                                </div>
                                <button className="relative w-12 h-6 bg-white/20 rounded-full transition-colors">
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Event Notifications</p>
                                    <p className="text-white/60 text-sm">Get notified about new events</p>
                                </div>
                                <button className="relative w-12 h-6 bg-purple-500 rounded-full transition-colors">
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 mb-8">
                    <button
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}