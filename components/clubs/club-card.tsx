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

    const imageUrl = club.image || '/placeholder/image.png';

    return (
        <Link href={`/club/${club.id}`} className={`block ${className} cursor-pointer`}>
            <div className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
                {/* Main image container with rounded top */}
                <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
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
                    <div className="w-[336px] h-[169px] pl-[281px] pr-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                        <button
                            onClick={handleFavoriteClick}
                            className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden hover:bg-neutral-300/20 transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#FF3B3B] text-[#FF3B3B]' : 'text-[#14FFEC]'}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Glassmorphism bottom section - the translucent gray area */}
                <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border backdrop-blur-[17.50px]"></div>

                {/* Rating badge */}
                <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] left-[250px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                    <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                        {club.rating}
                    </div>
                </div>

                {/* Text content */}
                <div className="w-32 h-[42px] left-[33px] top-[147px] absolute justify-start items-center gap-[29px] inline-flex">
                    <div className="w-52 flex-col justify-center items-start gap-1 inline-flex">
                        <div className="self-stretch h-4 text-[#14FFEC] text-base font-black font-['Manrope'] leading-4 tracking-[0.02em] truncate">
                            {club.name}
                        </div>
                        {/* <div className="self-stretch h-3.5 text-white text-xs font-semibold font-['Manrope'] leading-3.5 tracking-[0.01em] truncate">
                            {club.openTime}
                        </div> */}
                        {club.address && (
                            <div className="self-stretch text-[#C3C3C3] text-[10px] font-medium font-['Manrope'] leading-3 tracking-[0.1px] truncate">
                                {club.address}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ClubCard;