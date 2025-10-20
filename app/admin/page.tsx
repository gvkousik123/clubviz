'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Plus, DollarSign, BarChart, Edit } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active');

    // Mock data based on the screenshot - updated to match exact values from the screenshot
    const clubData = {
        name: 'DABO',
        stats: {
            totalRevenue: 'Rs 12,500',
            totalTicketSold: '220/250',
            peopleAttending: '512',
            activeEvents: '01'
        },
        events: {
            active: [
                {
                    name: 'Sunday Soiree',
                    date: '2025/02/2025',
                    dj: 'DJ Edward D Weston',
                    tickets: '150/270 tickets sold',
                    time: '07:00 PM',
                    image: '/admin/event-poster.jpg'
                }
            ],
            past: [],
            upcoming: []
        }
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6">
                    <h2 className="text-lg font-medium">Welcome back,</h2>
                    <div className="flex items-center justify-between mt-4">
                        <h1 className="text-4xl font-bold tracking-wide uppercase">DABO</h1>
                        {/* Club Logo */}
                        <div className="w-16 h-16 bg-black rounded-full border-2 border-[#14FFEC] flex items-center justify-center relative overflow-hidden">
                            <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-xs text-center text-[#14FFEC] p-1">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="uppercase font-semibold text-xs">LOGO</span>
                                    <span className="block text-[8px]">+ DRINKS</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                <Plus className="w-4 h-4 text-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Content wrapper with padding */}
                    <div className="px-6 py-4">
                        {/* Create New Event Button */}
                        <button
                            onClick={() => handleNavigation('/admin/new-event')}
                            className="w-full h-12 bg-[#14FFEC] text-black font-bold rounded-[30px] flex items-center justify-center relative mb-6"
                        >
                            Create new event
                            <div className="absolute right-4 transform rotate-12">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Stats Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Total Revenue */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Total Revenue</p>
                                    <p className="text-white text-xl font-bold">{clubData.stats.totalRevenue}</p>
                                </div>

                                {/* Total Ticket Sold */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Total Ticket Sold</p>
                                    <p className="text-white text-xl font-bold">{clubData.stats.totalTicketSold}</p>
                                </div>

                                {/* No. of People Attending */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">No. of People Attending</p>
                                    <p className="text-white text-xl font-bold">{clubData.stats.peopleAttending}</p>
                                </div>

                                {/* Active Events */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Active Events</p>
                                    <p className="text-white text-xl font-bold">{clubData.stats.activeEvents}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {/* Update Dynamic Pricing */}
                                <div
                                    onClick={() => handleNavigation('/admin/update-live-details')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Update Dynamic Pricing</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-black" />
                                    </div>
                                </div>

                                {/* Check Event bookings */}
                                <div
                                    onClick={() => handleNavigation('/admin/event-analytics')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Check Event bookings</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <BarChart className="w-5 h-5 text-black" />
                                    </div>
                                </div>

                                {/* Update Event Details */}
                                <div
                                    onClick={() => handleNavigation('/admin/update-event')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Update Event Details</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <Edit className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Club Info Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Club Info</h3>
                            <div className="space-y-3">
                                {/* Update live Details */}
                                <div
                                    onClick={() => handleNavigation('/admin/update-live-details')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <p className="text-white font-medium">Update live Details</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>

                                {/* Enter/Update Club Details */}
                                <div
                                    onClick={() => handleNavigation('/admin/new-club')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <p className="text-white font-medium">Enter/Update Club Details</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Event Info Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Event Info</h3>

                            {/* Event Tabs */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => handleTabChange('past')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'past'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Past Events
                                </button>
                                <button
                                    onClick={() => handleTabChange('active')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'active'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Active Events
                                </button>
                                <button
                                    onClick={() => handleTabChange('upcoming')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'upcoming'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Upcoming Events
                                </button>
                            </div>                    {/* Event Cards */}
                            <div className="pb-24">
                                {activeTab === 'active' && clubData.events.active.map((event, index) => (
                                    <div
                                        key={`active-${index}`}
                                        onClick={() => handleNavigation('/admin/event-analytics')}
                                        className="flex items-start justify-between mb-4 cursor-pointer"
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-[#14FFEC] mb-1">{event.name}</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                                        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                                                    </svg>
                                                    <span>{event.dj}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{event.tickets}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-28 bg-[#0D1F1F] rounded-md overflow-hidden ml-4 border border-[#14FFEC]/40">
                                            <div className="w-full h-full bg-[#1A2E2E] flex items-center justify-center text-xs text-center p-1">
                                                <span className="text-[#14FFEC]/80 text-[10px]">EVENT POSTER</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {activeTab === 'past' && (
                                    <div className="text-center py-8 text-gray-400">
                                        No past events to display
                                    </div>
                                )}

                                {activeTab === 'upcoming' && (
                                    <div className="text-center py-8 text-gray-400">
                                        No upcoming events to display
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
