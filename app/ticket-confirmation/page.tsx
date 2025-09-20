'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share, Calendar, MapPin, Clock, Ticket, QrCode } from 'lucide-react';

export default function TicketConfirmationPage() {
    const [showQR, setShowQR] = useState(false);

    const ticketDetails = {
        eventName: "Timeless Tuesdays Ft. DJ Xpensive",
        venue: "Dabo club & Kitchen, Nagpur",
        date: "24 Dec 17:00 pm",
        dressCode: "Funky Pop",
        tickets: [
            { type: "Early bird male pass", quantity: 1, price: 3500 },
            { type: "Early bird Couple pass", quantity: 1, price: 3500 }
        ],
        totalAmount: 3350,
        bookingId: "CV2024001234",
        guestEmail: "test@gmail.com",
        guestPhone: "+91 9XXXX9XXXXX"
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/clubs">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">Ticket Confirmation</h1>
                <div className="w-6" />
            </div>

            {/* Success Message */}
            <div className="px-6 mb-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-white/60">Your tickets have been successfully booked</p>
                </div>
            </div>

            {/* Ticket Card */}
            <div className="px-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                        <h3 className="text-white text-xl font-bold mb-2">{ticketDetails.eventName}</h3>
                        <div className="flex items-center space-x-4 text-white/90 text-sm">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{ticketDetails.venue}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <div>
                                <span className="text-white font-medium">{ticketDetails.date}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <span className="text-blue-400">👔</span>
                            </div>
                            <div>
                                <span className="text-white/80">Dress Code - </span>
                                <span className="text-white font-medium">{ticketDetails.dressCode}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="border-t border-white/10 p-6">
                        <h4 className="text-white font-semibold mb-4">Booking Details</h4>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Send Details to</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-blue-400">📧</span>
                                <span className="text-white text-sm">{ticketDetails.guestEmail}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-blue-400">📱</span>
                                <span className="text-white text-sm">{ticketDetails.guestPhone}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <h5 className="text-white font-medium">Selected Tickets</h5>
                            {ticketDetails.tickets.map((ticket, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-blue-400">🎫</span>
                                        <span className="text-white/80 text-sm">{ticket.type}</span>
                                    </div>
                                    <span className="text-white text-sm">{ticket.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60">Ticket Price</span>
                                <span className="text-white">₹ {ticketDetails.tickets.reduce((sum, t) => sum + t.price, 0)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60">Total Cover</span>
                                <span className="text-white">₹ {ticketDetails.totalAmount}</span>
                            </div>
                            <div className="flex justify-between items-center font-semibold">
                                <span className="text-white">Total Tickets</span>
                                <span className="text-white">{ticketDetails.tickets.reduce((sum, t) => sum + t.quantity, 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="border-t border-white/10 p-6">
                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 py-3 rounded-lg transition-colors"
                        >
                            <QrCode className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Show QR Code</span>
                        </button>

                        {showQR && (
                            <div className="mt-4 bg-white p-6 rounded-lg">
                                <div className="w-32 h-32 bg-black mx-auto rounded-lg flex items-center justify-center">
                                    <QrCode className="w-16 h-16 text-white" />
                                </div>
                                <p className="text-center text-gray-600 text-sm mt-2">Booking ID: {ticketDetails.bookingId}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-white/10 border border-white/20 py-4 rounded-2xl text-white font-medium hover:bg-white/20 transition-colors">
                        <Download className="w-5 h-5" />
                        <span>Download</span>
                    </button>

                    <button className="flex items-center justify-center space-x-2 bg-white/10 border border-white/20 py-4 rounded-2xl text-white font-medium hover:bg-white/20 transition-colors">
                        <Share className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                </div>

                <Link href="/clubs">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                        Continue Exploring
                    </button>
                </Link>
            </div>
        </div>
    );
}