'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ==================== BASE SKELETON ====================

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
    return (
        <div
            className={cn(
                'bg-gradient-to-r from-[#1a2a2a] via-[#2a3a3a] to-[#1a2a2a] rounded',
                animate && 'animate-pulse',
                className
            )}
        />
    );
}

// ==================== CLUB CARD SKELETON ====================

export function ClubCardSkeleton() {
    return (
        <div className="min-w-[160px] max-w-[160px] flex-shrink-0">
            <div className="relative rounded-[20px] overflow-hidden bg-[#1a2a2a]">
                {/* Image placeholder */}
                <Skeleton className="w-full h-[120px]" />

                {/* Content */}
                <div className="p-3 space-y-2">
                    {/* Title */}
                    <Skeleton className="h-4 w-3/4" />
                    {/* Subtitle */}
                    <Skeleton className="h-3 w-1/2" />
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== EVENT CARD SKELETON ====================

export function EventCardSkeleton() {
    return (
        <div className="min-w-[280px] max-w-[280px] flex-shrink-0">
            <div className="relative rounded-[20px] overflow-hidden bg-[#1a2a2a]">
                {/* Image placeholder */}
                <Skeleton className="w-full h-[160px]" />

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <Skeleton className="h-5 w-full" />
                    {/* Location */}
                    <Skeleton className="h-3 w-3/4" />
                    {/* Date/Time */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    {/* Tags */}
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== STORY SKELETON ====================

export function StorySkeleton() {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[70px]">
            {/* Avatar ring */}
            <div className="relative">
                <div className="w-[60px] h-[60px] rounded-full p-[2px] bg-gradient-to-tr from-[#2a3a3a] to-[#1a2a2a]">
                    <Skeleton className="w-full h-full rounded-full" />
                </div>
            </div>
            {/* Name */}
            <Skeleton className="h-3 w-12" />
        </div>
    );
}

// ==================== VENUE CARD SKELETON ====================

export function VenueCardSkeleton() {
    return (
        <div className="min-w-[200px] flex-shrink-0">
            <div className="relative rounded-[25px] overflow-hidden bg-[#1a2a2a]">
                {/* Image */}
                <Skeleton className="w-full h-[180px]" />

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3">
                    <Skeleton className="h-6 w-10 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// ==================== HERO SLIDE SKELETON ====================

export function HeroSlideSkeleton() {
    return (
        <div className="relative w-full h-[400px] rounded-[30px] overflow-hidden bg-[#1a2a2a]">
            <Skeleton className="w-full h-full" />

            {/* Content overlay */}
            <div className="absolute bottom-8 left-6 right-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-40 rounded-full" />
            </div>
        </div>
    );
}

// ==================== SECTION SKELETONS ====================

interface SectionSkeletonProps {
    count?: number;
}

export function ClubsSectionSkeleton({ count = 4 }: SectionSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Section header */}
            <div className="flex justify-between items-center px-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Cards row */}
            <div className="flex gap-4 px-4 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <ClubCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function EventsSectionSkeleton({ count = 3 }: SectionSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Section header */}
            <div className="flex justify-between items-center px-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Cards row */}
            <div className="flex gap-4 px-4 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function StoriesSectionSkeleton({ count = 6 }: SectionSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Section header */}
            <div className="px-4">
                <Skeleton className="h-5 w-24" />
            </div>

            {/* Stories row */}
            <div className="flex gap-4 px-4 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <StorySkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function VenuesSectionSkeleton({ count = 3 }: SectionSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Section header */}
            <div className="flex justify-between items-center px-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Cards row */}
            <div className="flex gap-4 px-4 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <VenueCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// ==================== PAGE SKELETONS ====================

export function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-[#021313] space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Search bar */}
            <div className="px-4">
                <Skeleton className="h-12 w-full rounded-full" />
            </div>

            {/* Hero */}
            <div className="px-4">
                <HeroSlideSkeleton />
            </div>

            {/* Stories */}
            <StoriesSectionSkeleton />

            {/* Venues */}
            <VenuesSectionSkeleton />

            {/* Events */}
            <EventsSectionSkeleton />

            {/* All Clubs */}
            <ClubsSectionSkeleton />
        </div>
    );
}

export function ClubDetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#021313]">
            {/* Hero Image */}
            <Skeleton className="w-full h-[40vh]" />

            {/* Content */}
            <div className="px-4 py-6 space-y-6 -mt-10 relative z-10">
                {/* Profile image */}
                <div className="flex justify-center -mt-16">
                    <Skeleton className="w-20 h-20 rounded-full border-4 border-[#021313]" />
                </div>

                {/* Title */}
                <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                    <Skeleton className="h-12 w-32 rounded-full" />
                    <Skeleton className="h-12 w-32 rounded-full" />
                </div>

                {/* Info sections */}
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-[20px]" />
                    <Skeleton className="h-32 w-full rounded-[20px]" />
                    <Skeleton className="h-20 w-full rounded-[20px]" />
                </div>
            </div>
        </div>
    );
}

export function EventDetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#021313]">
            {/* Hero Image */}
            <Skeleton className="w-full h-[50vh]" />

            {/* Content */}
            <div className="px-4 py-6 space-y-6 -mt-10 relative z-10 bg-[#021313] rounded-t-[30px]">
                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Date/Time */}
                <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-[15px]" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                {/* Location */}
                <Skeleton className="h-20 w-full rounded-[20px]" />

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Book button */}
                <Skeleton className="h-14 w-full rounded-full" />
            </div>
        </div>
    );
}

// ==================== LIST SKELETONS ====================

export function ClubsListSkeleton({ count = 6 }: SectionSkeletonProps) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-[20px] overflow-hidden bg-[#1a2a2a]">
                    <Skeleton className="w-full h-[120px]" />
                    <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function EventsListSkeleton({ count = 4 }: SectionSkeletonProps) {
    return (
        <div className="space-y-4 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-[20px] overflow-hidden bg-[#1a2a2a] p-3">
                    <Skeleton className="w-24 h-24 rounded-[15px] flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
