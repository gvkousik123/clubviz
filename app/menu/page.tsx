'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, User, Heart, MapPin, Settings, HelpCircle, LogOut, Bell, Gift } from 'lucide-react';

interface MenuPageProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function MenuPage({ isOpen = true, onClose }: MenuPageProps) {
    const [notifications, setNotifications] = useState(3);

    const menuItems = [
        {
            icon: User,
            label: 'Profile',
            href: '/profile',
            badge: null
        },
        {
            icon: Heart,
            label: 'Favorites',
            href: '/favorites',
            badge: null
        },
        {
            icon: Bell,
            label: 'Notifications',
            href: '/notifications',
            badge: notifications
        },
        {
            icon: MapPin,
            label: 'Location',
            href: '/location',
            badge: null
        },
        {
            icon: Gift,
            label: 'Offers & Deals',
            href: '/offers',
            badge: 'New'
        },
        {
            icon: Settings,
            label: 'Settings',
            href: '/settings',
            badge: null
        },
        {
            icon: HelpCircle,
            label: 'Help & Support',
            href: '/help',
            badge: null
        }
    ];

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            window.history.back();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Menu Panel */}
            <div className="absolute right-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-xl border-l border-white/10">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white text-xl font-bold">Menu</h2>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">John Doe</h3>
                            <p className="text-white/60 text-sm">john.doe@email.com</p>
                            <p className="text-blue-400 text-sm">Premium Member</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-4">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={handleClose}
                                className="flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center space-x-4">
                                    <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                                    <span className="text-white/90 group-hover:text-white font-medium">
                                        {item.label}
                                    </span>
                                </div>

                                {item.badge && (
                                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                        {item.badge}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <button className="flex items-center space-x-4 w-full px-2 py-3 hover:bg-white/10 rounded-lg transition-colors group">
                        <LogOut className="w-6 h-6 text-red-400 group-hover:text-red-300" />
                        <span className="text-red-400 group-hover:text-red-300 font-medium">Logout</span>
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-white/40 text-xs">ClubViz v1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}