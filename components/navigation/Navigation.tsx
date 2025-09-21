'use client';

import React from 'react';
import { Home, Search, Calendar, User, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

// Custom SVG icons for better design
const HomeIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10.5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3L2 12H5.5V18.5H18.5V12H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClubsIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 20L12 10L16 20M21 21V19C21 17.8954 20.1046 17 19 17H5C3.89543 17 3 17.8954 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6C13.6569 6 15 4.65685 15 3C15 4.65685 16.3431 6 18 6C16.3431 6 15 7.34315 15 9C15 7.34315 13.6569 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9C7.65685 9 9 7.65685 9 6C9 7.65685 10.3431 9 12 9C10.3431 9 9 10.3431 9 12C9 10.3431 7.65685 9 6 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EventsIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14H10M14 14H16M8 18H10M14 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FavoritesIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 21C11.8252 21 11.6556 20.9414 11.5223 20.8314C11.3889 20.7214 11.3004 20.5701 11.27 20.4L10.18 15.23L5.79001 17.18C5.63626 17.2455 5.46444 17.2565 5.30374 17.2114C5.14304 17.1662 5.00276 17.0678 4.90799 16.9336C4.81323 16.7994 4.77025 16.6376 4.78741 16.4771C4.80458 16.3166 4.88068 16.1674 5.00001 16.06L12 4L13.23 10.45L19.45 7.15C19.6015 7.0755 19.7733 7.05518 19.9366 7.09264C20.0999 7.13011 20.243 7.22282 20.3406 7.35489C20.4381 7.48696 20.4839 7.64882 20.4693 7.81175C20.4548 7.97468 20.3809 8.12604 20.26 8.24L12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 20.25C4.81344 17.552 8.13969 16 12 16C15.8603 16 19.1866 17.552 21 20.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    id: 'clubs',
    label: 'Clubs',
    icon: ClubsIcon,
  },
  {
    id: 'events',
    label: 'Events',
    icon: EventsIcon,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: FavoritesIcon,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: ProfileIcon,
  },
];

export function BottomNavigation({ activeTab, onTabChange, className }: BottomNavigationProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-gray-900/95 backdrop-blur-xl",
      "border-t border-gray-800/50",
      "px-2 py-2",
      "max-w-md mx-auto",
      "safe-bottom",
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
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "text-teal-400 bg-teal-500/10"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium transition-all",
                isActive ? "opacity-100" : "opacity-80"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full absolute -bottom-0.5" />
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
        className="p-2 text-text-primary hover:text-teal-400 transition-colors duration-300 relative z-50"
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
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
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