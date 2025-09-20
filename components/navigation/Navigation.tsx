'use client';

import React from 'react';
import { Home, Search, Calendar, User, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'clubs',
    label: 'Clubs',
    icon: Search,
  },
  {
    id: 'events',
    label: 'Events',
    icon: Calendar,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: Heart,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
];

export function BottomNavigation({ activeTab, onTabChange, className }: BottomNavigationProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-dark-800/95 backdrop-blur-xl",
      "border-t border-white/10",
      "px-4 py-2",
      "max-w-md mx-auto",
      className
    )}>
      <div className="flex items-center justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300",
                isActive
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-purple-400 rounded-full absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const menuItems = [
  { label: 'Profile Settings', href: '/profile/edit' },
  { label: 'My Bookings', href: '/profile/bookings' },
  { label: 'Favorite Clubs', href: '/profile/favorites/clubs' },
  { label: 'Favorite Events', href: '/profile/favorites/events' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function HamburgerMenu({ isOpen, onToggle, onClose }: HamburgerMenuProps) {
  return (
    <>
      {/* Menu Button */}
      <button
        onClick={onToggle}
        className="p-2 text-text-primary hover:text-purple-400 transition-colors duration-300 relative z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50",
        "bg-dark-800/95 backdrop-blur-xl border-l border-white/10",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 pt-16">
          {/* Profile Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Guest User</h3>
                <p className="text-sm text-text-tertiary">guest@clubviz.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-all duration-300"
                onClick={onClose}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CW</span>
              </div>
              <span className="text-lg font-bold text-text-primary tracking-wider">CLUBVIZ</span>
            </div>
            <p className="text-xs text-text-tertiary">
              © 2024 ClubViz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}