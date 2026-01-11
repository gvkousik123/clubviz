'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { useContact } from '@/hooks/use-contact';
import { useProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';

export default function WriteReviewPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { submitReview, loading } = useContact();
    const { profile } = useProfile();

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const maxWords = 300;

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ title: "Rating required", description: "Please select a rating", variant: "destructive" });
            return;
        }

        let photoOrVideo = '';
        if (selectedFiles.length > 0) {
            try {
                // Taking the first file for now as API expects single string
                photoOrVideo = await convertFileToBase64(selectedFiles[0]);
            } catch (e) {
                console.error("Error converting file", e);
            }
        }

        const success = await submitReview({
            username: profile?.username || 'Anonymous',
            rating,
            review: reviewText,
            feedback: reviewText,
            photoOrVideo
        });

        if (success) {
            router.back();
        }
    };

    const wordCount = reviewText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const remainingWords = maxWords - wordCount;

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Custom Header - Same as Review Page */}
            <div className="h-[200px] bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] relative">
                {/* Back Arrow */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-12 left-6 p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Page Title */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <h1 className="text-white text-xl font-bold">Write a Review</h1>
                </div>

                {/* Club Name - positioned inside the header */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                    <h2 className="text-white text-2xl font-extrabold">DABO CLUB & KITCHEN</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 space-y-6 pt-8">
                {/* Add Photo or Video Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-sm whitespace-nowrap">Add Photo or Video</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-8 text-center">
                        <input
                            type="file"
                            id="fileUpload"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29.0543 14.5922C28.841 9.08672 24.266 4.6875 18.757 4.6875C16.8407 4.6878 14.9622 5.22148 13.3319 6.22879C11.7016 7.2361 10.3839 8.67729 9.52617 10.391C8.81332 11.8118 8.44061 13.3788 8.4375 14.9684C8.44117 15.2099 8.35353 15.4439 8.19209 15.6236C8.03066 15.8033 7.80734 15.9154 7.5668 15.9375C7.43818 15.9467 7.30905 15.9292 7.18749 15.8863C7.06592 15.8433 6.95452 15.7757 6.86027 15.6877C6.76601 15.5997 6.69092 15.4932 6.63968 15.3749C6.58845 15.2566 6.56217 15.1289 6.5625 15C6.56151 13.6887 6.77284 12.3859 7.18828 11.1422C7.21565 11.0624 7.22101 10.9768 7.20378 10.8942C7.18656 10.8117 7.14739 10.7353 7.09041 10.6732C7.03342 10.6111 6.96073 10.5654 6.87999 10.5411C6.79925 10.5168 6.71346 10.5148 6.63164 10.5352C5.00721 10.94 3.56463 11.876 2.53298 13.1945C1.50134 14.513 0.939785 16.1384 0.9375 17.8125C0.9375 21.9363 4.42383 25.3125 8.55469 25.3125H18.75C20.1382 25.311 21.5117 25.0296 22.7886 24.485C24.0655 23.9404 25.2194 23.1439 26.1814 22.1431C27.1433 21.1423 27.8936 19.9578 28.3872 18.6604C28.8808 17.363 29.1077 15.9793 29.0543 14.5922ZM23.1633 15.6633C23.0762 15.7504 22.9728 15.8196 22.859 15.8668C22.7452 15.914 22.6232 15.9382 22.5 15.9382C22.3768 15.9382 22.2548 15.914 22.141 15.8668C22.0272 15.8196 21.9238 15.7504 21.8367 15.6633L19.6875 13.5129V20.625C19.6875 20.8736 19.5887 21.1121 19.4129 21.2879C19.2371 21.4637 18.9986 21.5625 18.75 21.5625C18.5014 21.5625 18.2629 21.4637 18.0871 21.2879C17.9113 21.1121 17.8125 20.8736 17.8125 20.625V13.5129L15.6633 15.6633C15.4874 15.8392 15.2488 15.938 15 15.938C14.7512 15.938 14.5126 15.8392 14.3367 15.6633C14.1608 15.4874 14.062 15.2488 14.062 15C14.062 14.7512 14.1608 14.5126 14.3367 14.3367L18.0867 10.5867C18.1738 10.4996 18.2772 10.4304 18.391 10.3832C18.5048 10.336 18.6268 10.3118 18.75 10.3118C18.8732 10.3118 18.9952 10.336 19.109 10.3832C19.2228 10.4304 19.3262 10.4996 19.4133 10.5867L23.1633 14.3367C23.2504 14.4238 23.3196 14.5272 23.3668 14.641C23.414 14.7548 23.4382 14.8768 23.4382 15C23.4382 15.1232 23.414 15.2452 23.3668 15.359C23.3196 15.4728 23.2504 15.5762 23.1633 15.6633Z" fill="white" />
                                </svg>
                            </div>
                            <p className="text-white text-lg">Click here to upload</p>
                        </label>

                        {selectedFiles.length > 0 && (
                            <div className="mt-4 text-sm text-[#14FFEC]">
                                {selectedFiles.length} file(s) selected
                            </div>
                        )}
                    </div>
                </div>

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

                    <div className="bg-[rgba(40,60,61,0.30)] rounded-2xl p-6 space-y-4">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Would you like to write anything about the Club ?"
                            className="w-full h-40 bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg leading-relaxed"
                            maxLength={maxWords * 6} // Rough character limit based on average word length
                        />

                        <div className="flex justify-end">
                            <span className="text-white/60 text-sm">
                                {remainingWords} words remaining
                            </span>
                        </div>
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
