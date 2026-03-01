'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, ThumbsUp, ThumbsDown, Share, Bookmark } from 'lucide-react';
import { useClubDetail } from '@/lib/store';

type ReviewItem = {
    id: number;
    clubId?: string;
    clubName?: string;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    review: string;
    daysAgo: string;
    verified: boolean;
};

const REVIEWS_STORAGE_KEY = 'clubviz_reviews';

const normalizeClubName = (value?: string) => (value || '').trim().toLowerCase();

const parseReviewDate = (value: string) => {
    if (!value) return null;

    const ddMmYyyyMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddMmYyyyMatch) {
        const [, day, month, year] = ddMmYyyyMatch;
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDaysAgoLabel = (value: string) => {
    const parsedDate = parseReviewDate(value);
    if (!parsedDate) return 'Recently';

    const reviewDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffMs = todayStart.getTime() - reviewDate.getTime();
    const diffDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 Day ago';
    return `${diffDays} Days ago`;
};

export default function ReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId') || '';
    const clubNameFromQuery = searchParams.get('clubName');
    const { club } = useClubDetail(clubId || null);
    const [localReviews, setLocalReviews] = useState<ReviewItem[]>([]);

    const handleWriteReview = () => {
        const href = `/review/write?clubId=${encodeURIComponent(clubId)}&clubName=${encodeURIComponent(clubName)}`;
        router.push(href);
    };

    const defaultReviews: ReviewItem[] = [
        {
            id: 1,
            clubName: 'DABO CLUB & KITCHEN',
            name: 'Anjali Sharma',
            avatar: '/vibemeter/Screenshot_2025-05-16_192139-removebg-preview.png',
            rating: 4.5,
            date: '25/07/2024',
            review: 'I recently ate at Dabo and had a great time. The food tasted good, and Rakesh\'s suggestions were perfect. The service was excellent. I\'m very happy with my visit. Decor and interiors can be improved a bit.',
            daysAgo: '3 Days ago',
            verified: true
        },
        {
            id: 2,
            clubName: 'DABO CLUB & KITCHEN',
            name: 'Ankit Trivedi',
            avatar: '/vibemeter/Screenshot_2025-05-16_193232-removebg-preview.png',
            rating: 4.5,
            date: '02/07/2024',
            review: 'Generally any pub strikes one of the two cords, ambiance or tasty food. The food here is simply amazing and combine it with the perfect and soothing ambiance you will have a time of your life.',
            daysAgo: '6 Days ago',
            verified: true
        },
        {
            id: 3,
            clubName: 'DABO CLUB & KITCHEN',
            name: 'Nikhil Jadhav',
            avatar: '/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png',
            rating: 4.0,
            date: '17/06/2024',
            review: 'Excellent atmosphere and wonderful drinks selection. The DJ set was perfect for the evening.',
            daysAgo: '14 Days ago',
            verified: false
        }
    ];

    useEffect(() => {
        try {
            const storedRaw = localStorage.getItem(REVIEWS_STORAGE_KEY);
            const parsed = storedRaw ? JSON.parse(storedRaw) : [];
            if (!Array.isArray(parsed)) {
                setLocalReviews([]);
                return;
            }

            const parsedReviews = parsed.filter((item: any) => {
                if (!clubId) return true;
                return item?.clubId === clubId;
            });

            setLocalReviews(parsedReviews);
        } catch (error) {
            console.error('Failed to read local reviews:', error);
            setLocalReviews([]);
        }
    }, [clubId]);

    const clubName = clubNameFromQuery || club?.name || 'DABO CLUB & KITCHEN';

    const reviews = useMemo(() => {
        const selectedClubName = normalizeClubName(clubName);
        const filteredDefaultReviews = defaultReviews.filter((item) => {
            if (clubId && item.clubId === clubId) return true;
            if (!item.clubId && normalizeClubName(item.clubName) === selectedClubName) return true;
            return false;
        });

        return [...localReviews, ...filteredDefaultReviews];
    }, [clubId, clubName, localReviews]);

    const averageRating = useMemo(() => {
        if (!reviews.length) return 0;
        const total = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
        return Number((total / reviews.length).toFixed(1));
    }, [reviews]);

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
                        Reviews
                    </h2>
                </div>
            </div>

                <div className="px-6 pt-4 pb-[7px] text-center">
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
            <div className="px-6 pb-6 space-y-6 pt-0">
                {/* Club Rating Info */}
                <div className="text-center space-y-2 mt-0">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                    key={index}
                                    size={24}
                                    className={`${index < Math.floor(averageRating) ? 'text-teal-400 fill-teal-400' : index === Math.floor(averageRating) && averageRating % 1 !== 0 ? 'text-teal-400' : 'text-gray-400'}`}
                                />
                            ))}
                        </div>
                        <span className="text-white/70 text-sm">{reviews.length} Reviews</span>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-[rgba(40,60,61,0.30)] p-4 rounded-2xl space-y-3">
                    {['Excellent', 'Good', 'Average', 'Below Average', 'Not Good'].map((label, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-28 text-sm">{label}</div>
                            <div className="h-2 bg-[#333] flex-1 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-400"
                                    style={{ width: `${[80, 70, 40, 15, 5][index]}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4 mt-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-[44px] h-[44px] flex-shrink-0">
                                    <img
                                        src={review.avatar || '/placeholder/image.png'}
                                        alt={review.name}
                                        className="w-[44px] h-[44px] rounded-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder/image.png';
                                        }}
                                    />
                                    <div className="absolute -right-[4px] -bottom-[4px] w-5 h-[19px] bg-[#005d5c] rounded-full flex items-center justify-center">
                                        <span className="font-bold text-[10px] leading-[20px] text-white">{Number(review.rating || 0).toFixed(1)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">{review.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-teal-400 font-medium">{review.rating}</span>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const filled = index < Math.floor(review.rating);
                                                const halfFilled = !filled && index < Math.ceil(review.rating);
                                                return (
                                                    <Star
                                                        key={index}
                                                        size={16}
                                                        className={`
                                                            ${filled ? 'text-teal-400 fill-teal-400' :
                                                                halfFilled ? 'text-teal-400' : 'text-gray-400'}`
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto text-right">
                                    <div className="text-white/70 text-sm">{review.date}</div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-white/80 text-sm leading-relaxed my-3">
                                {review.review}
                            </p>

                            {/* Days Ago */}
                            <div className="text-right">
                                <span className="text-white/50 text-xs">{getDaysAgoLabel(review.date)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}