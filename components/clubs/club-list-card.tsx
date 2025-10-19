import React from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export interface ClubListCardProps {
    club: {
        id: string;
        name: string;
        openTime: string;
        rating: number;
        image: string;
        address?: string;
    };
    href: string;
    fallbackImage?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (clubId: string) => void;
    className?: string;
}

export const ClubListCard: React.FC<ClubListCardProps> = ({
    club,
    href,
    fallbackImage,
    isFavorite = false,
    onToggleFavorite,
    className = ''
}) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(club.id);
        }
    };

    const imageUrl = club.image || fallbackImage || '/venue/Screenshot 2024-12-10 195651.png';

    return (
        <Link href="/club/dabo" className={`block ${className} cursor-pointer`}>
            <div className="w-[280px] h-[180px] relative flex-shrink-0 mr-3">
                {/* Main image container */}
                <div className="w-[280px] h-[148px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[12px] border-[#14FFEC] overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={club.name}
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== (fallbackImage || '/venue/Screenshot 2024-12-10 195651.png')) {
                                target.src = fallbackImage || '/venue/Screenshot 2024-12-10 195651.png';
                            }
                        }}
                    />
                    {/* Overlay effect */}
                    <div className="w-full h-full absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                    <div className="w-[280px] h-[148px] pl-[225px] pr-3 pt-3 pb-[95px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/40 to-black/0 rounded-[8px] overflow-hidden">
                        <button
                            onClick={handleFavoriteClick}
                            className="w-[35px] h-[35px] bg-neutral-300/10 rounded-[20px] backdrop-blur-[30px] justify-center items-center inline-flex overflow-hidden hover:bg-neutral-300/20 transition-colors"
                        >
                            <Bookmark
                                className={`w-4 h-4 transition-colors ${isFavorite ? 'text-[#14FFEC] fill-[#14FFEC]' : 'text-[#14FFEC]'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Glassmorphism bottom section */}
                <div className="w-[264px] h-[70px] left-[8px] top-[108px] absolute bg-[rgba(212.01,212.01,212.01,0.08)] rounded-[12px] border backdrop-blur-[15px]"></div>

                {/* Rating badge */}
                <div className="w-[26px] h-[26px] pl-1 pr-[4px] py-[4px] left-[210px] top-[95px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[15px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                    <div className="text-white text-[11px] font-extrabold font-['Manrope'] leading-4 tracking-[0.01em]">
                        {club.rating}
                    </div>
                </div>

                {/* Text content */}
                <div className="w-28 h-[38px] left-[28px] top-[128px] absolute justify-start items-center gap-6 inline-flex">
                    <div className="w-48 flex-col justify-center items-start gap-0.5 inline-flex">
                        <div className="self-stretch h-3.5 text-[#14FFEC] text-sm font-black font-['Manrope'] leading-3.5 tracking-[0.015em] truncate">
                            {club.name}
                        </div>
                        <div className="self-stretch h-3 text-white text-[10px] font-semibold font-['Manrope'] leading-3 tracking-[0.01em] truncate">
                            {club.openTime}
                        </div>
                        {club.address && (
                            <div className="self-stretch text-[#C3C3C3] text-[9px] font-medium font-['Manrope'] leading-2.5 tracking-[0.09px] truncate">
                                {club.address}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ClubListCard;