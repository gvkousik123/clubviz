'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Users, Download, Share2, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

interface TicketProps {
  id: string;
  type: string;
  quantity: number;
  status: 'active' | 'used' | 'cancelled';
}

function TicketCard({ id, type, quantity, status }: TicketProps) {
  const statusColors = {
    active: 'bg-green-500/20 border-green-500/30 text-green-400',
    used: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
    cancelled: 'bg-red-500/20 border-red-500/30 text-red-400'
  };

  const statusLabels = {
    active: 'Active',
    used: 'Used',
    cancelled: 'Cancelled'
  };

  return (
    <div className="relative">
      {/* Ticket Design */}
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full" />
        </div>

        {/* Ticket Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">{type}</h3>
              <p className="text-purple-200 text-sm">Ticket ID: {id}</p>
            </div>
            <div className={cn("px-3 py-1 rounded-full border text-xs font-medium", statusColors[status])}>
              {statusLabels[status]}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-purple-200 text-sm mb-1">Quantity</div>
            <div className="text-white font-semibold text-2xl">{quantity}</div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-800" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-purple-200 text-xs">Scan at venue entrance</p>
          </div>
        </div>

        {/* Perforated Edge Effect */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-dark-900 rounded-r-full" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-dark-900 rounded-l-full" />
      </div>
    </div>
  );
}

export default function EventTicketScreen() {
  const [activeTab, setActiveTab] = useState('details');

  const eventData = {
    id: 'freaky-friday',
    title: 'Freaky Friday',
    subtitle: 'The Ultimate Weekend Party',
    artist: 'DJ Alexxx',
    venue: 'DABO Club',
    address: 'Airport Road, Nagpur',
    date: 'Friday, April 4th, 2024',
    time: '9:00 PM - 3:00 AM',
    image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
    bookingId: '#FF2024040123',
    bookedDate: 'March 28, 2024'
  };

  const tickets = [
    { id: 'FF240401A', type: 'Early Bird', quantity: 2, status: 'active' as const },
    { id: 'FF240401B', type: 'General Admission', quantity: 1, status: 'active' as const }
  ];

  const handleBack = () => {
    window.location.href = '/home';
  };

  const handleDownload = () => {
    // Simulate ticket download
    alert('Tickets downloaded to your device');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${eventData.title} Tickets`,
        text: `Check out my tickets for ${eventData.title} at ${eventData.venue}!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard');
    }
  };

  return (
    <MobileLayout showNavigation={false}>
      <PageHeader
        title="Event Tickets"
        showBack
        onBack={handleBack}
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-text-secondary hover:text-purple-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-text-secondary hover:text-purple-400 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-6 pb-6">
        {/* Success Banner */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">Booking Confirmed!</p>
              <p className="text-text-secondary text-sm">Your tickets are ready for the event</p>
            </div>
          </div>
        </div>

        {/* Event Header */}
        <GlassCard className="mb-6">
          <div className="flex gap-4">
            <img
              src={eventData.image}
              alt={eventData.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">{eventData.title}</h1>
              <p className="text-text-secondary text-sm mb-2">{eventData.subtitle}</p>
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{eventData.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{eventData.time}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex bg-dark-600 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === 'details'
                ? "bg-purple-500 text-white"
                : "text-text-secondary hover:text-white"
            )}
          >
            Event Details
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === 'tickets'
                ? "bg-purple-500 text-white"
                : "text-text-secondary hover:text-white"
            )}
          >
            My Tickets
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Event Information */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Event Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-tertiary text-sm">Artist</p>
                    <p className="text-white font-medium">{eventData.artist}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-sm">Venue</p>
                    <p className="text-white font-medium">{eventData.venue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-text-tertiary text-xs">Location</p>
                    <p className="text-white text-sm font-medium">{eventData.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-text-tertiary text-xs">Date</p>
                      <p className="text-white text-sm font-medium">{eventData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-text-tertiary text-xs">Time</p>
                      <p className="text-white text-sm font-medium">{eventData.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Booking Details */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Booking ID</span>
                  <span className="text-white font-mono">{eventData.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Booked On</span>
                  <span className="text-white">{eventData.bookedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Tickets</span>
                  <span className="text-white">{tickets.reduce((sum, t) => sum + t.quantity, 0)} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Status</span>
                  <span className="text-green-400 font-medium">Confirmed</span>
                </div>
              </div>
            </GlassCard>

            {/* Important Information */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Important Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium">Entry Requirements</p>
                    <p className="text-text-secondary">Valid ID proof required. Age 21+ only.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">Dress Code</p>
                    <p className="text-text-secondary">Smart casual attire required.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-purple-400 font-medium">Parking</p>
                    <p className="text-text-secondary">Complimentary valet parking available.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Your Tickets</h3>
              <p className="text-text-secondary text-sm">Present these QR codes at the venue entrance</p>
            </div>

            {/* Tickets */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} {...ticket} />
              ))}
            </div>

            {/* Instructions */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <p className="text-white font-medium">Arrive Early</p>
                    <p className="text-text-secondary">Gates open at 8:00 PM. Arrive early to avoid queues.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <p className="text-white font-medium">Show QR Code</p>
                    <p className="text-text-secondary">Present your QR code at the entrance for scanning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <p className="text-white font-medium">Carry Valid ID</p>
                    <p className="text-text-secondary">Government-issued photo ID is mandatory for entry.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Download & Share */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}