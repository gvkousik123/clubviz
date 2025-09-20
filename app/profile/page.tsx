'use client';

import React, { useState } from 'react';
import { Edit3, Camera, Mail, Phone, MapPin, Calendar, Settings, LogOut, Heart, Ticket, Star, ArrowLeft, ChevronRight, User, Bell, Shield, HelpCircle, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileScreen() {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        joinDate: 'Member since March 2024',
        avatar: '/placeholder-user.jpg'
    });

    const stats = [
        { label: 'Events Attended', value: '24', icon: Calendar },
        { label: 'Favorite Clubs', value: '8', icon: Heart },
        { label: 'Total Bookings', value: '32', icon: Ticket },
        { label: 'Reviews Given', value: '15', icon: Star }
    ];

    const menuItems = [
        { 
            id: 'edit-profile',
            label: 'Edit Profile',
            icon: Edit3,
            action: () => router.push('/profile/edit')
        },
        { 
            id: 'my-bookings',
            label: 'My Bookings',
            icon: Ticket,
            action: () => router.push('/tickets'),
            badge: '3'
        },
        { 
            id: 'favorites',
            label: 'Favorites',
            icon: Heart,
            action: () => router.push('/favorites'),
            badge: '8'
        },
        { 
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            action: () => console.log('Notifications')
        },
        { 
            id: 'privacy',
            label: 'Privacy & Security',
            icon: Shield,
            action: () => console.log('Privacy')
        },
        { 
            id: 'help',
            label: 'Help & Support',
            icon: HelpCircle,
            action: () => router.push('/contact')
        },
        { 
            id: 'share',
            label: 'Share App',
            icon: Share2,
            action: () => handleShare()
        },
        { 
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            action: () => console.log('Settings')
        }
    ];

    const handleBack = () => {
        router.back();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'ClubViz - Ultimate Party Scene',
                text: 'Discover the hottest clubs and events in your city!',
                url: 'https://clubviz.app',
            });
        }
    };

    const handleLogout = () => {
        // Handle logout logic
        router.push('/auth/intro');
    };

    const handleEditProfile = () => {
        router.push('/profile/edit');
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

                <h1 className="text-2xl font-bold text-white">Profile</h1>

                <button
                    onClick={handleEditProfile}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <Edit3 className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Profile Section */}
            <div className="px-6 py-8">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                            {profileData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">{profileData.name}</h2>
                    <p className="text-white/70 text-lg mb-1">{profileData.email}</p>
                    <p className="text-white/60">{profileData.joinDate}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <stat.icon className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-white/60 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Profile Info */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                    <h3 className="text-white font-semibold text-lg mb-4">Contact Information</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Email</p>
                                <p className="text-white font-medium">{profileData.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Phone</p>
                                <p className="text-white font-medium">{profileData.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Location</p>
                                <p className="text-white font-medium">{profileData.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2 mb-8">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.action}
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-white font-medium">{item.label}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {item.badge}
                                    </div>
                                )}
                                <ChevronRight className="w-5 h-5 text-white/60" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">Sign Out</span>
                </button>
            </div>

            {/* App Version */}
            <div className="text-center pb-8">
                <p className="text-white/40 text-sm">ClubViz v1.0.0</p>
            </div>
        </div>
    );
}