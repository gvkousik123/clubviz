'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface TicketCounterProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function TicketCounter({
    value,
    onChange,
    min = 0,
    max = 20,
}: TicketCounterProps) {
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
        <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center gap-2">
            <button
                onClick={handleDecrement}
                disabled={value <= min}
                className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0FDADE] transition-colors"
            >
                <Minus size={14} className="text-black" />
            </button>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-7 h-7 bg-[#14FFEC] rounded-lg text-black text-center font-medium outline-none border-none text-sm"
                placeholder="0"
            />
            <button
                onClick={handleIncrement}
                disabled={value >= max}
                className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0FDADE] transition-colors"
            >
                <Plus size={14} className="text-black" />
            </button>
        </div>
    );
}
