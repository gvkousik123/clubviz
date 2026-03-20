'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberCounterProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    label?: string;
    width?: string;
}

export default function NumberCounter({
    value,
    onChange,
    min = 0,
    max = 10,
    label,
    width = 'w-[12.75rem]',
}: NumberCounterProps) {
    const [inputValue, setInputValue] = useState(String(value));

    const handleIncrement = () => {
        const newValue = value + 1;
        if (newValue <= max) {
            onChange(newValue);
            setInputValue(String(newValue));
        }
    };

    const handleDecrement = () => {
        const newValue = value - 1;
        if (newValue >= min) {
            onChange(newValue);
            setInputValue(String(newValue));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setInputValue(input);

        // Allow empty string while typing
        if (input === '') {
            return;
        }

        // Parse the input value
        let numValue = parseInt(input, 10);

        // Discard negative values - reset to min if negative
        if (isNaN(numValue) || numValue < min) {
            numValue = min;
        }

        // Cap at max value
        if (numValue > max) {
            numValue = max;
        }

        // Update the parent only with valid values
        if (!isNaN(numValue)) {
            onChange(numValue);
        }
    };

    const handleInputBlur = () => {
        // When focus leaves the input, ensure a valid value
        let numValue = parseInt(inputValue, 10);

        if (isNaN(numValue) || numValue < min) {
            numValue = min;
        } else if (numValue > max) {
            numValue = max;
        }

        setInputValue(String(numValue));
        onChange(numValue);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {label && (
                <div className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.03125rem]">
                    {label}
                </div>
            )}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#048075] transition-colors"
                >
                    <Minus size={18} className="text-white" />
                </button>

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`${width} h-[2.9375rem] bg-[#0D1F1F] rounded-[1.375rem] text-white text-base font-['Manrope'] font-bold leading-5 tracking-[0.01rem] text-center outline-none border border-[#0D1F1F] focus:border-[#14FFEC] focus:bg-[#0D1F1F]/80 transition-colors`}
                    placeholder="0"
                />

                <button
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-[2.9375rem] h-[2.9375rem] bg-[#03867B] rounded-[1.875rem] backdrop-blur-[0.63125rem] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#048075] transition-colors"
                >
                    <Plus size={18} className="text-white" />
                </button>
            </div>
        </div>
    );
}
