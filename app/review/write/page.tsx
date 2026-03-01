'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { useContact } from '@/hooks/use-contact';
import { useProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';
import { useClubDetail } from '@/lib/store';

export default function WriteReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { submitReview, loading } = useContact();
    const { profile } = useProfile();
    const clubId = searchParams.get('clubId');
    const clubNameFromQuery = searchParams.get('clubName');
    const { club } = useClubDetail(clubId);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const maxCharacters = 300;
    const REVIEWS_STORAGE_KEY = 'clubviz_reviews';

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ title: "Rating required", description: "Please select a rating", variant: "destructive" });
            return;
        }

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB');
        const newReviewEntry = {
            id: Date.now(),
            clubId: clubId || '',
            clubName,
            name: profile?.username || 'Anonymous',
            avatar: '/placeholder/image.png',
            rating,
            date: formattedDate,
            review: reviewText,
            daysAgo: 'Today',
            verified: false
        };

        try {
            const existingRaw = localStorage.getItem(REVIEWS_STORAGE_KEY);
            const existingReviews = existingRaw ? JSON.parse(existingRaw) : [];
            const safeReviews = Array.isArray(existingReviews) ? existingReviews : [];
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify([newReviewEntry, ...safeReviews]));
        } catch (error) {
            console.error('Failed to save review locally:', error);
        }

        await submitReview({
            username: profile?.username || 'Anonymous',
            rating,
            review: reviewText,
            feedback: reviewText,
            photoOrVideo: ''
        });

        const reviewPageHref = `/review?clubId=${encodeURIComponent(clubId || '')}&clubName=${encodeURIComponent(clubName)}`;
        router.push(reviewPageHref);
    };

    const usedCharacters = reviewText.length;
    const remainingCharacters = Math.max(maxCharacters - usedCharacters, 0);
    const clubName = clubNameFromQuery || club?.name || 'DABO CLUB & KITCHEN';

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            <div className="w-full max-w-[430px] h-[144px] mx-auto bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] relative flex flex-col justify-between">
                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="w-[35px] h-[35px] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                    >
                        <span className="text-white text-lg font-bold">&lt;</span>
                    </button>
                </div>
                <div className="text-center px-6 flex-1 flex items-center justify-center">
                    <h2
                        className="font-extrabold text-[22px] leading-[20px] text-center text-white"
                        style={{
                            fontFamily: 'Anton, Anton SC, sans-serif',
                            fontWeight: 400,
                            fontSize: '24px',
                            letterSpacing: '0.0625em',
                            lineHeight: '32px',
                            textAlign: 'center',
                            color: '#ffffff'
                        }}
                    >
                        Write a Review
                    </h2>
                </div>
            </div>

                <div className="px-6 py-4 text-center">
                <h2
                    className="font-extrabold text-[22px] leading-[20px] text-center text-white"
                    style={{
                        fontFamily: 'Anton, Anton SC, sans-serif',
                        fontWeight: 400,
                        fontSize: '24px',
                        letterSpacing: '0.0625em',
                        lineHeight: '32px',
                        textAlign: 'center',
                        color: '#ffffff'
                    }}
                >
                    {clubName}
                </h2>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 space-y-6 pt-8">
                {/* Give Rating Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-sm whitespace-nowrap">Give Rating</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <span className="text-white text-lg">Rate -</span>
                            <div className="flex gap-2">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setRating(index + 1)}
                                        className="transition-all duration-200 hover:scale-110"
                                    >
                                        <Star
                                            size={32}
                                            className={`${index < rating
                                                ? 'text-[#14FFEC] fill-[#14FFEC]'
                                                : 'text-[#14FFEC] stroke-2'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Write Your Review Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-sm whitespace-nowrap">Write your Review</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-6">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Would you like to write anything about the Club ?"
                            className="w-full h-40 bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg leading-relaxed"
                            maxLength={maxCharacters}
                        />
                    </div>

                    <div className="text-right pr-[11px]">
                        <span className={`text-sm ${remainingCharacters === 0 ? 'text-red-500' : 'text-white/60'}`}>
                            {remainingCharacters} letters remaining
                        </span>
                    </div>
                </div>

                {/* Bottom padding for fixed button */}
                <div className="pb-24"></div>
            </div>

            {/* Bottom Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#021313]/80 backdrop-blur-sm z-50">
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || loading}
                    className="w-full h-[54px] bg-[#0C898B] rounded-[30px] flex justify-center items-center gap-2 hover:bg-[#0e9ea0] active:scale-95 transition-all text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : 'Submit'}
                </button>
            </div>
        </div>
    );
}
