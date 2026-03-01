import React from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

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
}

export const ClubCard: React.FC<ClubCardProps> = ({
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
        <Link href={href} className={`block ${className} cursor-pointer`}>
            <div className="w-[calc(100vw-32px)] max-w-[398px] min-w-[320px] h-[201px] relative flex-shrink-0 mr-1">
                {/* Main image container with rounded top */}
                <div className="absolute left-0 top-0 w-full h-[169px] flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
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
                    {/* White overlay effect */}
                    <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex justify-end items-start p-4 bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                        <button
                            onClick={handleFavoriteClick}
                            className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden hover:bg-neutral-300/20 transition-colors"
                        >
                            <Bookmark
                                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-[#14FFEC] fill-[#14FFEC]' : 'text-[#14FFEC]'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Glassmorphism bottom section - the translucent gray area */}
                <div className="w-[calc(100%-16px)] h-[85px] left-2 top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border backdrop-blur-[17.50px]"></div>

                {/* Rating badge */}
                <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] right-[56px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                    <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                        {club.rating}
                    </div>
                </div>

                {/* Text content */}
                <div className="absolute left-6 right-16 top-[146.5px] flex items-start gap-1">
                    <div className="w-full flex-col justify-center items-start gap-1 inline-flex">
                        <div className="self-stretch text-[#14FFEC] text-xl font-extrabold font-['Manrope'] leading-6 tracking-[0.02em] line-clamp-2 break-words">
                            {club.name}
                        </div>
                        <div className="self-stretch h-3.5 text-white text-xs font-semibold font-['Manrope'] leading-3.5 tracking-[0.01em] truncate">
                            {club.openTime}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ClubCard;