'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStories } from '@/hooks/use-stories';
import { Story } from '@/lib/api-types';

export default function StoriesFeedPage() {
    const router = useRouter();
    const { stories, loading, fetchStories, viewStory } = useStories();

    useEffect(() => {
        // Fetch all active stories
        fetchStories(0, 100);
    }, [fetchStories]);

    const handleGoBack = () => {
        router.back();
    };

    const handleViewStory = async (storyId: string, index: number) => {
        // Mark story as viewed
        await viewStory(storyId);
        // Navigate to story viewer
        router.push(`/story?index=${index}`);
    };

    const formatTimestamp = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        }
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }
        return 'Expires soon';
    };

    const formatTimeRemaining = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        const expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        const remaining = expiresAt.getTime() - now.getTime();

        if (remaining <= 0) return 'Expired';

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m left`;
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Stories</h1>
                    <p className="text-sm text-white/80 mt-1">Discover what's happening</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pt-[160px] pb-24">
                {/* Stories Grid */}
                {loading && stories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-[#14FFEC] border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading stories...</p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12 bg-[#0D1F1F] border border-[#0C898B] rounded-[15px]">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m10 2V2M5.5 9h13M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                            <circle cx="12" cy="14" r="2" fill="currentColor" />
                        </svg>
                        <p className="text-gray-400 text-lg mb-2">No Stories Available</p>
                        <p className="text-gray-500 text-sm">Check back later for new stories</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {stories.map((story, index) => (
                            <div
                                key={story.id}
                                onClick={() => handleViewStory(story.id, index)}
                                className="relative aspect-[3/4] rounded-[15px] overflow-hidden cursor-pointer group"
                            >
                                {/* Story Image/Video */}
                                <div className="absolute inset-0">
                                    {story.mediaType === 'VIDEO' ? (
                                        <video
                                            src={story.mediaUrl}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={story.mediaUrl || '/story/story1.png'}
                                            alt={story.caption || 'Story'}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 group-hover:from-black/90 transition-all"></div>

                                {/* Story Info */}
                                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                                    {/* Top: Time Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-[#14FFEC]" />
                                                <span className="text-[10px] text-white font-medium">
                                                    {formatTimeRemaining(story.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        {story.mediaType === 'VIDEO' && (
                                            <div className="w-6 h-6 bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom: Caption & Views */}
                                    <div>
                                        {story.caption && (
                                            <p className="text-white text-sm font-semibold mb-1 line-clamp-2">
                                                {story.caption}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-300">{formatTimestamp(story.createdAt)}</span>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Eye className="w-3 h-3" />
                                                <span>{story.viewCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Border Glow on Hover */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#14FFEC] rounded-[15px] transition-all"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {stories.length > 0 && !loading && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => fetchStories(0, 100, true)}
                            className="px-6 py-3 bg-[#0D1F1F] border border-[#14FFEC]/40 text-white rounded-lg hover:bg-[#14FFEC]/10 transition-all"
                        >
                            Load More Stories
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
