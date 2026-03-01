import React from 'react';

interface GenreTagsProps {
    genres: string[];
    className?: string;
}

/**
 * Reusable genre tag row used on the event details page and elsewhere.
 * All tabs share the same structure and typography as the original implementation
 * under the "About Artist" section.
 */
export const GenreTags: React.FC<GenreTagsProps> = ({ genres, className }) => {
    return (
        <div
            className={"flex flex-wrap gap-2" + (className ? ` ${className}` : "")}
            style={{ paddingLeft: '25px', paddingRight: '25px', paddingTop: '12px', paddingBottom: '28px' }}
        >
            {genres.map((g) => (
                <div
                    key={g}
                    className="flex justify-center items-center gap-1.5 bg-[#0d7377] px-[15px] py-2 rounded-[25px] border border-solid border-[#14ffec]"
                >
                    <span className="font-semibold text-[16px] leading-[16px] text-white tracking-[0.5px]">
                        {g}
                    </span>
                </div>
            ))}
        </div>
    );
};
