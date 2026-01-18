'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Trash2, Edit, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStories } from '@/hooks/use-stories';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/lib/api-types';
import { AuthService } from '@/lib/services/auth.service';

export default function MyStoriesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { myStories, stats, fetchMyStories, fetchStats, deleteStory, loading } = useStories();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const isAdmin = AuthService.hasRole('ADMIN') || AuthService.hasRole('SUPER_ADMIN');

    useEffect(() => {
        if (isAdmin) {
            fetchMyStories();
            fetchStats();
        }
    }, [isAdmin, fetchMyStories, fetchStats]);

    const handleGoBack = () => {
        router.back();
    };

    const handleDeleteStory = async (storyId: string) => {
        if (!confirm('Are you sure you want to delete this story?')) return;

        try {
            setDeletingId(storyId);
            const success = await deleteStory(storyId);
            if (success) {
                toast({
                    title: 'Success',
                    description: 'Story deleted successfully',
                });
                fetchMyStories();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting story:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleViewStory = (storyId: string) => {
        router.push(`/story/${storyId}`);
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

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-gray-400 mb-6">Only admins can upload and manage stories</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-[#14FFEC] text-black rounded-lg font-semibold hover:bg-[#14FFEC]/80 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-xl font-bold text-white">My Stories</h1>
                    <p className="text-sm text-white/80 mt-1">Manage your shared moments</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pt-[160px] pb-24">
                {/* Stats Section */}
                {stats && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4">
                            <div className="text-[#14FFEC] text-2xl font-bold">{stats.activeStories}</div>
                            <div className="text-gray-400 text-sm mt-1">Active Stories</div>
                        </div>
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4">
                            <div className="text-[#14FFEC] text-2xl font-bold">{stats.totalViews}</div>
                            <div className="text-gray-400 text-sm mt-1">Total Views</div>
                        </div>
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4">
                            <div className="text-[#14FFEC] text-2xl font-bold">{stats.totalStories}</div>
                            <div className="text-gray-400 text-sm mt-1">Total Stories</div>
                        </div>
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4">
                            <div className="text-[#14FFEC] text-2xl font-bold">{stats.averageViews.toFixed(1)}</div>
                            <div className="text-gray-400 text-sm mt-1">Avg Views</div>
                        </div>
                    </div>
                )}

                {/* Stories List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-3">Your Stories</h2>

                    {loading && myStories.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-12 h-12 border-4 border-[#14FFEC] border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading stories...</p>
                        </div>
                    ) : myStories.length === 0 ? (
                        <div className="text-center py-12 bg-[#0D1F1F] border border-[#0C898B] rounded-[15px]">
                            <p className="text-gray-400 mb-4">No stories yet</p>
                            <button
                                onClick={() => router.push('/admin/upload-story')}
                                className="px-6 py-3 bg-[#14FFEC] text-black rounded-lg font-semibold hover:bg-[#14FFEC]/80 transition-all"
                            >
                                Upload Your First Story
                            </button>
                        </div>
                    ) : (
                        myStories.map((story) => (
                            <div
                                key={story.id}
                                className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4 hover:border-[#14FFEC]/50 transition-all"
                            >
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div
                                        className="relative w-20 h-20 rounded-[10px] overflow-hidden cursor-pointer flex-shrink-0"
                                        onClick={() => handleViewStory(story.id)}
                                    >
                                        {story.mediaUrl && (
                                            story.mediaType === 'VIDEO' ? (
                                                <video
                                                    src={story.mediaUrl}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={story.mediaUrl}
                                                    alt="Story"
                                                    className="w-full h-full object-cover"
                                                />
                                            )
                                        )}
                                        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all"></div>
                                    </div>

                                    {/* Story Info */}
                                    <div className="flex-1 min-w-0">
                                        {story.caption && (
                                            <p className="text-white font-medium mb-1 truncate">{story.caption}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{story.viewCount} views</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatTimeRemaining(story.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {story.mediaType} • {new Date(story.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleViewStory(story.id)}
                                            className="p-2 bg-[#14FFEC]/20 text-[#14FFEC] rounded-lg hover:bg-[#14FFEC]/30 transition-all"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStory(story.id)}
                                            disabled={deletingId === story.id}
                                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Upload New Story Button */}
                <button
                    onClick={() => router.push('/admin/upload-story')}
                    className="w-full mt-6 py-4 bg-[#14FFEC] text-black rounded-[15px] font-semibold hover:bg-[#14FFEC]/80 transition-all"
                >
                    Upload New Story
                </button>
            </div>
        </div>
    );
}
