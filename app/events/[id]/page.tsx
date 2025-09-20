'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Users, Heart, Share2, Ticket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

interface TicketTypeProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  availability: number;
  maxPerPerson: number;
  benefits: string[];
}

function TicketType({
  id,
  name,
  price,
  originalPrice,
  description,
  availability,
  maxPerPerson,
  benefits
}: TicketTypeProps) {
  const [quantity, setQuantity] = useState(0);

  return (
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{name}</h3>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-text-tertiary text-sm line-through">₹{originalPrice}</span>
            )}
            <span className="text-purple-400 font-bold text-lg">₹{price}</span>
          </div>
          <p className="text-text-tertiary text-xs">{availability} left</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <ul className="space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">Max {maxPerPerson} per person</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center text-lg font-medium transition-colors",
              quantity === 0
                ? "border-dark-600 text-text-tertiary cursor-not-allowed"
                : "border-purple-500 text-purple-400 hover:bg-purple-500/10"
            )}
          >
            −
          </button>
          <span className="w-8 text-center text-white font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxPerPerson, quantity + 1))}
            disabled={quantity >= maxPerPerson || availability === 0}
            className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center text-lg font-medium transition-colors",
              quantity >= maxPerPerson || availability === 0
                ? "border-dark-600 text-text-tertiary cursor-not-allowed"
                : "border-purple-500 text-purple-400 hover:bg-purple-500/10"
            )}
          >
            +
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export default function EventBookingScreen() {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});

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
    rating: 4.8,
    attendees: 1250,
    genre: 'Electronic Dance Music',
    ageLimit: '21+',
    dressCode: 'Smart Casual',
    description: 'Get ready for the most electrifying night of the week! DJ Alexxx brings his signature beats to DABO Club for an unforgettable Freaky Friday experience. Featuring state-of-the-art sound systems, spectacular light shows, and non-stop dancing until dawn.'
  };

  const ticketTypes = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 799,
      originalPrice: 999,
      description: 'Limited time offer',
      availability: 15,
      maxPerPerson: 4,
      benefits: ['Entry before 10 PM', 'Welcome drink', 'Priority queue']
    },
    {
      id: 'general',
      name: 'General Admission',
      price: 999,
      description: 'Standard entry ticket',
      availability: 85,
      maxPerPerson: 6,
      benefits: ['Full night access', 'Dance floor access', 'Bar access']
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 1999,
      description: 'Premium club experience',
      availability: 25,
      maxPerPerson: 4,
      benefits: ['VIP lounge access', '2 complimentary drinks', 'Reserved seating', 'Meet & greet with DJ']
    }
  ];

  const handleBack = () => {
    window.location.href = '/home';
  };

  const handleBookNow = () => {
    window.location.href = `/events/${eventData.id}/booking`;
  };

  return (
    <MobileLayout showNavigation={false}>
      {/* Header */}
      <PageHeader
        showBack
        onBack={handleBack}
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 text-text-secondary hover:text-purple-400 transition-colors"
            >
              <Heart className={cn("w-5 h-5", isLiked && "text-red-500 fill-current")} />
            </button>
            <button className="p-2 text-text-secondary hover:text-purple-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-6 pb-6">
        {/* Event Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img
            src={eventData.image}
            alt={eventData.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Event Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                {eventData.genre}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                {eventData.ageLimit}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{eventData.title}</h1>
            <p className="text-text-secondary text-sm">{eventData.subtitle}</p>
          </div>
        </div>

        {/* Event Details */}
        <GlassCard className="mb-6">
          <div className="space-y-4">
            {/* Artist & Venue */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Event Details</h2>
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
            </div>

            {/* Date & Time */}
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

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-text-tertiary text-xs">Location</p>
                <p className="text-white text-sm font-medium">{eventData.address}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{eventData.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">{eventData.attendees} attending</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
          <p className="text-text-secondary leading-relaxed text-sm">{eventData.description}</p>
        </GlassCard>

        {/* Ticket Types */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Tickets</h3>
          <div className="space-y-4">
            {ticketTypes.map((ticket) => (
              <TicketType key={ticket.id} {...ticket} />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Important Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Dress Code:</span>
              <span className="text-white">{eventData.dressCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Age Limit:</span>
              <span className="text-white">{eventData.ageLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Cancellation:</span>
              <span className="text-white">24 hours before event</span>
            </div>
          </div>
        </GlassCard>

        {/* Book Now Button */}
        <div className="sticky bottom-6 bg-dark-900/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-text-tertiary text-sm">Total Cost</p>
              <p className="text-2xl font-bold text-white">₹2,797</p>
            </div>
            <div className="text-right">
              <p className="text-text-tertiary text-sm">3 tickets selected</p>
              <p className="text-purple-400 text-sm font-medium">Saved ₹200</p>
            </div>
          </div>
          <Button
            onClick={handleBookNow}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}