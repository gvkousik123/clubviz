'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import PageHeader from '@/components/common/page-header';
import { MapPin, Calendar } from 'lucide-react';

export default function TableSelectionPage() {
    const router = useRouter();
    const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
    const [selectedTable, setSelectedTable] = useState('TG-04');

    const handleGoBack = () => {
        router.back();
    };

    const handleFloorSelect = (floor: string) => {
        setSelectedFloor(floor);
    };

    const handleTableSelect = (table: string) => {
        const status = getTableStatus(table);
        if (status !== 'reserved') {
            setSelectedTable(table);
        }
    };

    const handleContinue = () => {
        router.push('/booking/review');
    };

    // Floor options
    const floors = ['Ground Floor', '1st Floor', '2nd Floor'];

    // Table status mapping
    const getTableStatus = (tableId: string) => {
        const reservedTables = ['TG-06', 'TG-07', 'TG-05'];
        const availableTables = ['TG-01', 'TG-02', 'TG-03'];

        if (tableId === selectedTable) return 'selected';
        if (reservedTables.includes(tableId)) return 'reserved';
        return 'available';
    };

    const getTableBorderColor = (tableId: string) => {
        const status = getTableStatus(tableId);
        if (status === 'selected') return 'border-[#14FFEC]';
        if (status === 'reserved') return 'border-[#FF4B4B]';
        return 'border-white';
    };

    const getTableBgColor = (tableId: string) => {
        const status = getTableStatus(tableId);
        if (status === 'selected') return 'bg-[rgba(0,255,234,0.18)]';
        if (status === 'reserved') return 'bg-[rgba(21.78,205.96,191.07,0.18)]';
        return 'bg-[rgba(21.78,205.96,191.07,0.18)]';
    };

    const getTableTextColor = (tableId: string) => {
        const status = getTableStatus(tableId);
        if (status === 'selected') return 'text-[#14FFEC]';
        if (status === 'reserved') return 'text-[#FF4B4B]';
        return 'text-white';
    };

    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-transparent to-black overflow-hidden">
            <PageHeader title="DABO CLUB & KITCHEN" />


            {/* Club location info */}
            <div className="absolute top-[1.56rem] left-[2.44rem] flex items-center gap-[0.75rem] pl-[2rem]">
                <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                    <MapPin className="w-[0.774rem] h-[0.984rem] absolute left-[0.176rem] top-[0.07rem] text-[#14FFEC]" />
                </div>
                <div className="text-white text-base font-['Manrope'] font-medium leading-5 tracking-[0.01rem]">
                    Dabo club & kitchen, Nagpur
                </div>
            </div>

            {/* Date and time info */}
            <div className="absolute top-[3.5rem] left-[2.44rem] flex items-center gap-[0.81rem] pl-[2rem]">
                <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                    <Calendar className="w-[0.844rem] h-[0.914rem] absolute left-[0.141rem] top-[0.07rem] text-[#14FFEC]" />
                </div>
                <div className="text-white text-sm font-['Manrope'] font-bold leading-5 tracking-[0.009rem]">
                    24 Dec | 7:00 pm
                </div>
            </div>

            {/* Main Content Container */}
            <div className="absolute top-[6.31rem] left-0 w-full h-[43.875rem] bg-gradient-to-b from-[rgba(17.52,124.23,115.6,0.82)] to-[rgba(0,0,0,0.82)] overflow-hidden rounded-t-[3.75rem]">

                {/* Floor Selection Tabs */}
                <div className="absolute top-[0.9375rem] left-[1rem] w-[24.875rem] h-[3.125rem] overflow-hidden">
                    {floors.map((floor, index) => (
                        <div key={floor} className="absolute overflow-hidden" style={{
                            width: '8.29rem',
                            height: '3.125rem',
                            left: `${index * 8.29}rem`,
                            top: 0
                        }}>
                            <div
                                className={`absolute w-full rounded-t-[0.5rem] ${floor === selectedFloor ? 'bg-[#14FFEC] h-[0.4375rem] top-[2.6875rem]' : 'bg-[#D9D9D9] h-[0.0625rem] top-[3.0625rem]'
                                    }`}
                            ></div>
                            <button
                                onClick={() => handleFloorSelect(floor)}
                                className="absolute top-[0.9375rem] left-1/2 transform -translate-x-1/2 text-center text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]"
                            >
                                {floor}
                            </button>
                        </div>
                    ))}
                </div>                {/* Legend */}
                <div className="absolute top-[5.25rem] left-[1.6875rem] flex items-center gap-[0.5rem]">
                    <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                        <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-[#FF4B4B]"></div>
                    </div>
                    <div className="text-center text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Reserved</div>
                </div>

                <div className="absolute top-[5.25rem] left-[10.1875rem] flex items-center gap-[0.5rem]">
                    <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                        <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-white"></div>
                    </div>
                    <div className="text-center text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Available</div>
                </div>

                <div className="absolute top-[5.25rem] left-[18.6875rem] flex items-center gap-[0.5rem]">
                    <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                        <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-[#14FFEC]"></div>
                    </div>
                    <div className="text-center text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Selected</div>
                </div>

                {/* Table Layout Container */}
                <div className="absolute top-[7.75rem] left-0 w-full h-[32.5rem] bg-[rgba(255,255,255,0.09)] overflow-hidden rounded-t-[3.75rem]">

                    {/* Main center table TG-01 */}
                    <button
                        onClick={() => handleTableSelect('TG-01')}
                        className={`absolute top-[9.6875rem] left-[9.5rem] w-[7.9375rem] h-[10rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')} transition-all duration-300 cursor-pointer`}
                    >
                        <div className={`absolute top-[3.5rem] left-[3.75rem] text-center ${getTableTextColor('TG-01')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1.3125rem]`}>TG - 01</div>
                    </button>

                    {/* Bottom center table TG-02 */}
                    <button
                        onClick={() => handleTableSelect('TG-02')}
                        className={`absolute top-[25.0625rem] left-[9.5rem] w-[7.9375rem] h-[11rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')} transition-all duration-300 cursor-pointer`}
                    >
                        <div className={`absolute top-[4.8125rem] left-[3.6875rem] text-center ${getTableTextColor('TG-02')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1.3125rem]`}>TG - 02</div>
                    </button>

                    {/* Top left table TG-03 */}
                    <button
                        onClick={() => handleTableSelect('TG-03')}
                        className={`absolute top-[2.4375rem] left-[5.375rem] w-[6.6875rem] h-[3.125rem] ${getTableBgColor('TG-03')} rounded-[0.9375rem] border ${getTableBorderColor('TG-03')} transition-all duration-300 cursor-pointer`}
                    >
                        <div className={`absolute top-[1rem] left-[2.125rem] text-center ${getTableTextColor('TG-03')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1.3125rem]`}>TG - 03</div>
                    </button>

                    {/* Top right table TG-04 */}
                    <button
                        onClick={() => handleTableSelect('TG-04')}
                        className={`absolute top-[2.4375rem] left-[14.9375rem] w-[6.6875rem] h-[3.125rem] ${getTableBgColor('TG-04')} rounded-[0.9375rem] border ${getTableBorderColor('TG-04')} transition-all duration-300 cursor-pointer`}
                    >
                        <div className={`absolute top-[1rem] left-[2.125rem] text-center ${getTableTextColor('TG-04')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1.3125rem]`}>TG - 04</div>
                    </button>

                    {/* Right side tables */}
                    <button
                        onClick={() => handleTableSelect('TG-05')}
                        disabled={getTableStatus('TG-05') === 'reserved'}
                        className={`absolute top-[8.4375rem] left-[21.625rem] w-[3.125rem] h-[3.125rem] ${getTableBgColor('TG-05')} rounded-[0.9375rem] border ${getTableBorderColor('TG-05')} transition-all duration-300 ${getTableStatus('TG-05') === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className={`absolute top-[0.75rem] left-[0.5rem] text-center ${getTableTextColor('TG-05')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1rem]`}>TG<br />05</div>
                    </button>

                    {/* Left side tables */}
                    <button
                        onClick={() => handleTableSelect('TG-06')}
                        disabled={getTableStatus('TG-06') === 'reserved'}
                        className={`absolute top-[8.4375rem] left-[2.25rem] w-[3.125rem] h-[3.125rem] ${getTableBgColor('TG-06')} rounded-[0.9375rem] border ${getTableBorderColor('TG-06')} transition-all duration-300 ${getTableStatus('TG-06') === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className={`absolute top-[0.75rem] left-[0.375rem] text-center ${getTableTextColor('TG-06')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1rem]`}>TG<br />06</div>
                    </button>

                    <button
                        onClick={() => handleTableSelect('TG-07')}
                        disabled={getTableStatus('TG-07') === 'reserved'}
                        className={`absolute top-[19.5rem] left-[2.25rem] w-[3.125rem] h-[3.125rem] ${getTableBgColor('TG-07')} rounded-[0.9375rem] border ${getTableBorderColor('TG-07')} transition-all duration-300 ${getTableStatus('TG-07') === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className={`absolute top-[0.75rem] left-[0.375rem] text-center ${getTableTextColor('TG-07')} text-[0.8125rem] font-['Manrope'] font-bold leading-[1rem]`}>TG<br />07</div>
                    </button>

                    {/* Small chair elements around tables */}
                    <div className="absolute top-[1.1875rem] left-[6.5rem] flex gap-[1.0625rem]">
                        <div className={`w-[1.6875rem] h-[0.75rem] ${getTableBgColor('TG-03')} rounded-[0.9375rem] border ${getTableBorderColor('TG-03')}`}></div>
                        <div className={`w-[1.6875rem] h-[0.75rem] ${getTableBgColor('TG-03')} rounded-[0.9375rem] border ${getTableBorderColor('TG-03')}`}></div>
                    </div>

                    <div className="absolute top-[1.1875rem] left-[16.0625rem] flex gap-[1.0625rem]">
                        <div className={`w-[1.6875rem] h-[0.75rem] ${getTableBgColor('TG-04')} rounded-[0.9375rem] border ${getTableBorderColor('TG-04')}`}></div>
                        <div className={`w-[1.6875rem] h-[0.75rem] ${getTableBgColor('TG-04')} rounded-[0.9375rem] border ${getTableBorderColor('TG-04')}`}></div>
                    </div>

                    {/* Side chair elements */}
                    <div className="absolute top-[11.25rem] left-[8.25rem] flex flex-col gap-[0.875rem]">
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                    </div>

                    <div className="absolute top-[11.25rem] left-[17.9375rem] flex flex-col gap-[0.875rem]">
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-01')} rounded-[0.9375rem] border ${getTableBorderColor('TG-01')}`}></div>
                    </div>

                    {/* More chair elements around bottom table */}
                    <div className="absolute top-[26.5625rem] left-[8.1875rem] flex flex-col gap-[0.875rem]">
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                    </div>

                    <div className="absolute top-[26.5625rem] left-[17.9375rem] flex flex-col gap-[0.875rem]">
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                        <div className={`w-[0.75rem] h-[0.75rem] ${getTableBgColor('TG-02')} rounded-[0.9375rem] border ${getTableBorderColor('TG-02')}`}></div>
                    </div>
                </div>

            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 w-full h-[4.8125rem] bg-gradient-to-t from-black to-transparent overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[3.5rem] overflow-hidden rounded-t-[2.8125rem]"
                    style={{
                        background: 'radial-gradient(ellipse 70.81% 149.79% at 50.00% 100.00%, #01655C 0%, #008076 100%)'
                    }}>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedTable || getTableStatus(selectedTable) === 'reserved'}
                        className="absolute top-[0.75rem] left-1/2 transform -translate-x-1/2 w-[11.5625rem] h-[2rem] text-center text-white text-[1.5rem] font-['Manrope'] font-bold leading-[1.3125rem] disabled:opacity-50"
                    >
                        Reserve Table
                    </button>
                </div>
            </div>
        </div>
    );
}