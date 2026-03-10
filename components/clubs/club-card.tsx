import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export interface Club {
    id: string;
    name: string;
    openTime: string;
    rating: number;
    image: string;
    address?: string;
    category?: string;
}

export interface ClubCardProps {
    club: Club;
    href: string;
    fallbackImage?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (clubId: string) => void;
    className?: string;
    isHorizontalScroll?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({
    club,
    href,
    fallbackImage,
    isFavorite = false,
    onToggleFavorite,
    className = '',
    isHorizontalScroll = false
}) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(club.id);
        }
    };

    const imageUrl = club.image || '/placeholder/image.png';
    const cardWidth = isHorizontalScroll ? 'w-[336px]' : 'w-full';

    return (
        <div className={`block ${className} cursor-pointer ${cardWidth}`} onClick={() => window.location.href = `/club/${club.id}`}>
            <div className={`${cardWidth} h-[214px] relative flex-shrink-0`}>
                {/* Main image container with rounded top */}
                <div className="w-full h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={club.name}
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/placeholder/image.png') {
                                target.src = '/placeholder/image.png';
                            }
                        }}
                    />
                    {/* White overlay effect */}
                    <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                    <div className="w-full h-[169px] px-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onToggleFavorite) {
                                    onToggleFavorite(club.id);
                                }
                            }}
                            className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden hover:bg-neutral-300/20 transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#FF3B3B] text-[#FF3B3B]' : 'text-[#14FFEC]'}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Glassmorphism bottom section */}
                <div className="h-[85px] inset-x-2 top-[125px] absolute rounded-[15px] border border-white/25 bg-[rgba(9,32,39,0.78)] backdrop-blur-[30px] backdrop-saturate-150 z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.24),0_12px_26px_rgba(0,0,0,0.42)]"></div>
                <div className="h-[85px] inset-x-2 top-[125px] absolute rounded-[15px] bg-gradient-to-b from-white/[0.16] via-white/[0.06] to-black/25 z-[11] pointer-events-none"></div>

                {/* Rating badge */}
                <div className="w-[40px] h-[40px] right-[50px] top-[104px] absolute z-20 rounded-full bg-white/[0.02] backdrop-blur-[1px] p-[4px]">
                    <div className="w-full h-full flex items-center justify-center bg-[#008378] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                        <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                            {club.rating}
                        </div>
                    </div>
                </div>

                {/* Text content */}
                <div className="left-[32px] right-[86px] top-[142px] absolute z-20">
                    <div className="w-full flex-col justify-center items-start gap-1 inline-flex">
                        <div className={`self-stretch text-[#14FFEC] ${isHorizontalScroll ? 'text-base' : 'text-[18px]'} font-black font-['Manrope'] leading-[26px] tracking-[0.02em] truncate overflow-hidden whitespace-nowrap`}>
                            {club.name}
                        </div>
                        <div className="self-stretch h-3.5 text-white text-xs font-semibold font-['Manrope'] leading-3.5 tracking-[0.01em] truncate overflow-hidden whitespace-nowrap">
                            {club.openTime}
                        </div>
                        {club.address && (
                            <div className="self-stretch text-[#C3C3C3] text-[10px] font-medium font-['Manrope'] leading-3 tracking-[0.1px] truncate overflow-hidden whitespace-nowrap">
                                {club.address}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubCard;