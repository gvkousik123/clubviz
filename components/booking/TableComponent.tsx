'use client';

import React from 'react';

interface ChairProps {
    position: 'top' | 'right' | 'bottom' | 'left';
    tableStatus: 'selected' | 'reserved' | 'available';
    borderColor: string;
    bgColor: string;
}

const Chair: React.FC<ChairProps> = ({ position, tableStatus, borderColor, bgColor }) => {
    // Determine chair styles based on position
    const getChairStyles = () => {
        switch (position) {
            case 'top':
            case 'bottom':
                return {
                    width: '1.6875rem',
                    height: '0.75rem',
                    marginBottom: position === 'top' ? '0.5rem' : '0',
                    marginTop: position === 'bottom' ? '0.5rem' : '0',
                };
            case 'left':
            case 'right':
                return {
                    width: '0.75rem',
                    height: '1.6875rem',
                    marginRight: position === 'left' ? '0.5rem' : '0',
                    marginLeft: position === 'right' ? '0.5rem' : '0',
                };
        }
    };

    const styles = getChairStyles();

    return (
        <div
            className={`${bgColor} border ${borderColor} rounded-[0.375rem]`}
            style={styles}
        ></div>
    );
};

interface TableComponentProps {
    tableId: string;
    status: 'selected' | 'reserved' | 'available';
    onClick: () => void;
    width: string;
    height: string;
    chairPositions: Array<'top' | 'right' | 'bottom' | 'left'>;
    chairCount?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

const TableComponent: React.FC<TableComponentProps> = ({
    tableId,
    status,
    onClick,
    width,
    height,
    chairPositions,
    chairCount = { top: 2, right: 3, bottom: 2, left: 3 },
}) => {
    // Get table styles based on status
    const getBorderColor = () => {
        if (status === 'selected') return 'border-[#14FFEC]';
        if (status === 'reserved') return 'border-[#FF4B4B]';
        return 'border-white';
    };

    const getBgColor = () => {
        if (status === 'selected') return 'bg-[rgba(0,255,234,0.18)]';
        if (status === 'reserved') return 'bg-[rgba(21.78,205.96,191.07,0.18)]';
        return 'bg-[rgba(21.78,205.96,191.07,0.18)]';
    };

    const getTextColor = () => {
        if (status === 'selected') return 'text-[#14FFEC]';
        if (status === 'reserved') return 'text-[#FF4B4B]';
        return 'text-white';
    };

    const borderColor = getBorderColor();
    const bgColor = getBgColor();
    const textColor = getTextColor();

    return (
        <div className="relative">
            {/* Table */}
            <button
                onClick={onClick}
                disabled={status === 'reserved'}
                className={`${width} ${height} ${bgColor} rounded-[0.9375rem] border ${borderColor} transition-all duration-300 ${status === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer'
                    } flex items-center justify-center`}
            >
                <div className={`text-center ${textColor} text-[0.8125rem] font-['Manrope'] font-bold leading-[1.3125rem]`}>
                    {tableId}
                </div>
            </button>

            {/* Chairs */}
            {chairPositions.includes('top') && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1.25rem] flex gap-[0.5rem]">
                    {Array(chairCount.top || 2).fill(0).map((_, index) => (
                        <Chair
                            key={`top-${index}`}
                            position="top"
                            tableStatus={status}
                            borderColor={borderColor}
                            bgColor={bgColor}
                        />
                    ))}
                </div>
            )}

            {chairPositions.includes('bottom') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[1.25rem] flex gap-[0.5rem]">
                    {Array(chairCount.bottom || 2).fill(0).map((_, index) => (
                        <Chair
                            key={`bottom-${index}`}
                            position="bottom"
                            tableStatus={status}
                            borderColor={borderColor}
                            bgColor={bgColor}
                        />
                    ))}
                </div>
            )}

            {chairPositions.includes('left') && (
                <div className="absolute left-0 top-1/2 transform -translate-x-[1.25rem] -translate-y-1/2 flex flex-col gap-[0.7rem]">
                    {Array(chairCount.left || 3).fill(0).map((_, index) => (
                        <Chair
                            key={`left-${index}`}
                            position="left"
                            tableStatus={status}
                            borderColor={borderColor}
                            bgColor={bgColor}
                        />
                    ))}
                </div>
            )}

            {chairPositions.includes('right') && (
                <div className="absolute right-0 top-1/2 transform translate-x-[1.25rem] -translate-y-1/2 flex flex-col gap-[0.7rem]">
                    {Array(chairCount.right || 3).fill(0).map((_, index) => (
                        <Chair
                            key={`right-${index}`}
                            position="right"
                            tableStatus={status}
                            borderColor={borderColor}
                            bgColor={bgColor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableComponent;