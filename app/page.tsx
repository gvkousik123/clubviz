"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import Link from "next/link";
import { Search, MapPin, Heart, User, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <ClubVizLogo size="sm" variant="icon" />
          </div>
          <h1 className="text-xl font-bold text-white">ClubWiz</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to ClubWiz! 🎉</h2>
          <p className="text-white/70">Discover the best clubs and events in your area</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="#"
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <MapPin className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <h3 className="text-white font-medium">Find Clubs</h3>
            <p className="text-white/60 text-sm">Near you</p>
          </Link>

          <Link
            href="#"
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <Calendar className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <h3 className="text-white font-medium">Events</h3>
            <p className="text-white/60 text-sm">This weekend</p>
          </Link>
        </div>

        {/* Featured Clubs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Featured Clubs</h3>
          <div className="space-y-4">
            {[
              { name: "Pulse Nightclub", location: "Downtown", rating: "4.8" },
              { name: "Neon Lounge", location: "City Center", rating: "4.6" },
              { name: "Electric Beat", location: "Marina", rating: "4.7" }
            ].map((club, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{club.name}</h4>
                    <p className="text-white/60 text-sm">{club.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">⭐ {club.rating}</span>
                    <button className="text-white/60 hover:text-red-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Message */}
        <div className="bg-teal-500/20 backdrop-blur-sm rounded-2xl p-6 text-center">
          <h3 className="text-white font-medium mb-2">🎊 Welcome to ClubWiz!</h3>
          <p className="text-white/80 text-sm">
            You've successfully logged in! This is a demo home page.
            The full app features club listings, event bookings, and much more.
          </p>
          <Link
            href="/auth/intro"
            className="inline-block mt-4 px-6 py-2 bg-white/10 rounded-full text-white text-sm hover:bg-white/20 transition-all"
          >
            Back to Auth Flow
          </Link>
        </div>
      </div>
    </div>
  );
}
