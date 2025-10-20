'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ThumbsUp, ThumbsDown, Share, Bookmark } from 'lucide-react';
import PageHeader from '@/components/common/page-header';

export default function ReviewPage() {
    const router = useRouter();

    const handleWriteReview = () => {
        router.push('/review/write');
    };

    const reviews = [
        {
            id: 1,
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
            name: 'Nikhil Jadhav',
            avatar: '/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png',
            rating: 4.0,
            date: '17/06/2024',
            review: 'Excellent atmosphere and wonderful drinks selection. The DJ set was perfect for the evening.',
            daysAgo: '14 Days ago',
            verified: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Page Header Component */}
            <PageHeader title="Review" />

            {/* Main Content */}
            <div className="px-6 pt-[16vh] pb-6 space-y-6">
                {/* Club Info */}
                <div className="text-center space-y-2">
                    <h2 className="text-white text-3xl font-extrabold">DABO CLUB & KITCHEN</h2>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold mb-2">4.2</div>
                        <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                    key={index}
                                    size={24}
                                    className={`${index < 4 ? 'text-teal-400 fill-teal-400' : index === 4 ? 'text-teal-400' : 'text-gray-400'}`}
                                />
                            ))}
                        </div>
                        <span className="text-white/70 text-sm">30 Reviews</span>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-[rgba(40,60,61,0.30)] p-4 rounded-2xl space-y-3">
                    {['Excellent', 'Good', 'Average', 'Below Average', 'Rate'].map((label, index) => (
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
                        <div key={review.id} className="bg-[#222831]/70 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
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
                                <span className="text-white/50 text-xs">{review.daysAgo}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}