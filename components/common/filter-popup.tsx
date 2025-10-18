import React, { useState } from 'react';
import Image from 'next/image';

export interface FilterOption {
    id: string;
    label: string;
    icon?: string;
    selected?: boolean;
}

export interface FilterSection {
    id: string;
    title: string;
    type: 'radio' | 'checkbox';
    options: FilterOption[];
}

export interface FilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Record<string, any>) => void;
    sections: FilterSection[];
}

const FilterPopup: React.FC<FilterPopupProps> = ({
    isOpen,
    onClose,
    onApply,
    sections: initialSections
}) => {
    const [sections, setSections] = useState<FilterSection[]>(initialSections);

    const handleOptionToggle = (sectionId: string, optionId: string) => {
        setSections(prevSections =>
            prevSections.map(section => {
                if (section.id !== sectionId) return section;

                if (section.type === 'radio') {
                    // For radio buttons, only one can be selected
                    return {
                        ...section,
                        options: section.options.map(option => ({
                            ...option,
                            selected: option.id === optionId
                        }))
                    };
                } else {
                    // For checkboxes, toggle the selection
                    return {
                        ...section,
                        options: section.options.map(option =>
                            option.id === optionId
                                ? { ...option, selected: !option.selected }
                                : option
                        )
                    };
                }
            })
        );
    };

    const handleApply = () => {
        const filters: Record<string, any> = {};
        sections.forEach(section => {
            if (section.type === 'radio') {
                const selected = section.options.find(opt => opt.selected);
                if (selected) {
                    filters[section.id] = selected.id;
                }
            } else {
                const selected = section.options.filter(opt => opt.selected).map(opt => opt.id);
                if (selected.length > 0) {
                    filters[section.id] = selected;
                }
            }
        });
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setSections(prevSections =>
            prevSections.map(section => ({
                ...section,
                options: section.options.map(option => ({
                    ...option,
                    selected: false
                }))
            }))
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Filter Panel */}
            <div className="relative w-full max-w-[430px] h-[725px] bg-[#021313] rounded-t-[20px] animate-slide-up">
                <div className="w-full h-full px-[23px] py-[28px] overflow-hidden flex flex-col gap-[17px]">

                    {/* Sort By Section */}
                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[17px] px-[21px] py-[12px] flex flex-col gap-[15px]">
                        <h3 className="text-[#F9F9F9] text-base font-semibold font-['Manrope']">Sort by</h3>
                        <div className="w-full h-[1px] border-t border-[#14FFEC]" />

                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-[7px]">
                                {sections.find(s => s.id === 'sort')?.options.map((option) => (
                                    <div key={option.id} className="text-[#F9F9F9] text-base font-medium font-['Manrope']">
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-[12px]">
                                {sections.find(s => s.id === 'sort')?.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionToggle('sort', option.id)}
                                        className={`w-4 h-4 rounded-full border-2 ${option.selected ? 'border-[#14FFEC] bg-[#14FFEC]' : 'border-[#14FFEC]'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bar Section */}
                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[17px] px-[21px] py-[12px] flex flex-col gap-[14px]">
                        <h3 className="text-[#F9F9F9] text-base font-semibold font-['Manrope']">Bar</h3>
                        <div className="flex flex-wrap gap-[12px]">
                            {sections.find(s => s.id === 'bar')?.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionToggle('bar', option.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-[30px] ${option.selected
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[rgba(40,60,61,0.30)] text-white'
                                        } transition-colors`}
                                >
                                    {option.icon && (
                                        <div className="w-5 h-5 relative">
                                            <Image
                                                src={`/filter/${option.icon}`}
                                                alt={option.label}
                                                width={20}
                                                height={20}
                                                className="filter brightness-0 invert"
                                                style={{ filter: option.selected ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                                            />
                                        </div>
                                    )}
                                    <span className="text-base font-normal font-['Manrope'] leading-[21px]">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Food Section */}
                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[17px] px-[21px] py-[12px] flex flex-col gap-[14px] flex-1 overflow-y-auto">
                        <h3 className="text-[#F9F9F9] text-base font-semibold font-['Manrope']">Food</h3>
                        <div className="flex flex-wrap gap-[12px]">
                            {sections.find(s => s.id === 'food')?.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionToggle('food', option.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-[30px] ${option.selected
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[rgba(40,60,61,0.30)] text-white'
                                        } transition-colors`}
                                >
                                    {option.icon && (
                                        <div className="w-5 h-5 relative">
                                            <Image
                                                src={`/filter/${option.icon}`}
                                                alt={option.label}
                                                width={20}
                                                height={20}
                                                className="filter brightness-0 invert"
                                                style={{ filter: option.selected ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                                            />
                                        </div>
                                    )}
                                    <span className="text-base font-normal font-['Manrope'] leading-[21px]">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Music Section */}
                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[17px] px-[21px] py-[12px] flex flex-col gap-[14px]">
                        <h3 className="text-[#F9F9F9] text-base font-semibold font-['Manrope']">Music</h3>
                        <div className="flex flex-wrap gap-[12px]">
                            {sections.find(s => s.id === 'music')?.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionToggle('music', option.id)}
                                    className={`flex items-center gap-2 px-[6px] py-2 rounded-[30px] ${option.selected
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[rgba(40,60,61,0.30)] text-white'
                                        } transition-colors`}
                                >
                                    {option.icon && (
                                        <div className="w-5 h-5 relative">
                                            <Image
                                                src={`/filter/${option.icon}`}
                                                alt={option.label}
                                                width={20}
                                                height={20}
                                                className="filter brightness-0 invert"
                                                style={{ filter: option.selected ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                                            />
                                        </div>
                                    )}
                                    <span className="text-base font-normal font-['Manrope'] leading-[21px]">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 px-4 bg-[rgba(40,60,61,0.30)] text-white rounded-[17px] font-semibold font-['Manrope'] transition-colors hover:bg-[rgba(40,60,61,0.50)]"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3 px-4 bg-[#14FFEC] text-black rounded-[17px] font-semibold font-['Manrope'] transition-colors hover:bg-[#11d4c4]"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;