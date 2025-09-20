'use client';

import React, { useState } from 'react';
import { Edit3, Camera, Mail, Phone, MapPin, Calendar, Settings, LogOut, Heart, Ticket, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    dateOfBirth: '1995-08-15',
    bio: 'Party enthusiast and music lover. Always looking for the next great event!',
    avatar: '/placeholder-user.jpg'
  });

  const stats = {
    eventsAttended: 24,
    favoriteClubs: 8,
    totalBookings: 32,
    reviewsGiven: 15
  };

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      title: 'Freaky Friday',
      venue: 'DABO Club',
      date: 'Apr 4, 2024',
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'review',
      title: 'Underground Beats',
      venue: 'Skybar Lounge',
      date: 'Mar 28, 2024',
      rating: 5
    },
    {
      id: 3,
      type: 'favorite',
      title: 'Purple Haze Club',
      date: 'Mar 25, 2024'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data logic
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const handleLogout = () => {
    // Logout logic
    window.location.href = '/auth/login';
  };

  return (
    <MobileLayout>
      <PageHeader
        title="Profile"
        rightElement={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-text-secondary hover:text-purple-400 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <div className="px-6 pb-6">
        {/* Profile Header */}
        <GlassCard className="mb-6">
          <div className="text-center">
            {/* Profile Picture */}
            <div className="relative inline-block mb-4">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/30"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white text-center text-xl font-bold"
                />
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white text-center"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{profileData.name}</h1>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">{profileData.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.eventsAttended}</p>
                <p className="text-text-tertiary text-xs">Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-400">{stats.favoriteClubs}</p>
                <p className="text-text-tertiary text-xs">Clubs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.totalBookings}</p>
                <p className="text-text-tertiary text-xs">Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.reviewsGiven}</p>
                <p className="text-text-tertiary text-xs">Reviews</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Contact Information */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-400" />
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white flex-1"
                />
              ) : (
                <div>
                  <p className="text-text-tertiary text-sm">Email</p>
                  <p className="text-white">{profileData.email}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-400" />
              {isEditing ? (
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white flex-1"
                />
              ) : (
                <div>
                  <p className="text-text-tertiary text-sm">Phone</p>
                  <p className="text-white">{profileData.phone}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white flex-1"
                />
              ) : (
                <div>
                  <p className="text-text-tertiary text-sm">Location</p>
                  <p className="text-white">{profileData.location}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              {isEditing ? (
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white flex-1"
                />
              ) : (
                <div>
                  <p className="text-text-tertiary text-sm">Date of Birth</p>
                  <p className="text-white">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Edit Actions */}
        {isEditing && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-dark-500 text-text-secondary hover:bg-dark-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-primary hover:opacity-90"
            >
              Save Changes
            </Button>
          </div>
        )}

        {/* Recent Activity */}
        {!isEditing && (
          <GlassCard className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-dark-600/50 rounded-lg">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    activity.type === 'booking' && "bg-purple-500/20",
                    activity.type === 'review' && "bg-yellow-500/20",
                    activity.type === 'favorite' && "bg-red-500/20"
                  )}>
                    {activity.type === 'booking' && <Ticket className="w-5 h-5 text-purple-400" />}
                    {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-400" />}
                    {activity.type === 'favorite' && <Heart className="w-5 h-5 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      {activity.venue && <span>{activity.venue}</span>}
                      {activity.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{activity.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-text-tertiary text-xs">{activity.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Quick Actions */}
        {!isEditing && (
          <div className="space-y-3">
            <GlassCard>
              <button
                onClick={() => window.location.href = '/favorites'}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors rounded-lg"
              >
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium flex-1 text-left">My Favorites</span>
                <span className="text-text-tertiary text-sm">{stats.favoriteClubs + 12} items</span>
              </button>
            </GlassCard>

            <GlassCard>
              <button
                onClick={() => window.location.href = '/bookings'}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors rounded-lg"
              >
                <Ticket className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium flex-1 text-left">My Bookings</span>
                <span className="text-text-tertiary text-sm">{stats.totalBookings} bookings</span>
              </button>
            </GlassCard>

            <GlassCard>
              <button
                onClick={() => window.location.href = '/settings'}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors rounded-lg"
              >
                <Settings className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium flex-1 text-left">Settings</span>
              </button>
            </GlassCard>

            <GlassCard>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors rounded-lg"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium flex-1 text-left">Logout</span>
              </button>
            </GlassCard>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}