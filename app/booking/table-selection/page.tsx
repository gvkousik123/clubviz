'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import PageHeader from '@/components/common/page-header';
import { MapPin, Calendar } from 'lucide-react';
import TableComponent from '@/components/booking/TableComponent';

export default function TableSelectionPage() {
    const router = useRouter();
    const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
    const [selectedTable, setSelectedTable] = useState('TG-04');

    const handleGoBack = () => {
        router.push('/home');
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
        router.push('/booking/review-booking');
    };

    // Floor options
    const floors = ['Ground Floor', '1st Floor', '2nd Floor'];

    // Table status mapping
    const getTableStatus = (tableId: string) => {
        const tableIdNormalized = tableId.replace(/\s+/g, '').replace(/-/g, ''); // Remove spaces and hyphens for consistent comparison

        // Normalized table IDs
        const reservedTableIds = ['TG06', 'TG07', 'TG08'];
        const availableTableIds = ['TG01', 'TG02', 'TG03', 'TG05', 'TG04'];

        const selectedTableNormalized = selectedTable.replace(/\s+/g, '').replace(/-/g, '');

        if (tableIdNormalized === selectedTableNormalized) return 'selected';
        if (reservedTableIds.includes(tableIdNormalized)) return 'reserved';
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
        <div className="w-full min-h-screen relative bg-gradient-to-b from-transparent to-black pl-5 pr-5">
            <PageHeader title="DABO CLUB & KITCHEN" />

            <div className="absolute top-[20vh]">
                <div className="flex items-center gap-[0.5rem] z-10">
                    <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                        <MapPin className="w-[0.774rem] h-[0.984rem] absolute left-[0.176rem] top-[0.07rem] text-[#14FFEC]" />
                    </div>
                    <div className="text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">
                        Dabo club & kitchen, Nagpur
                    </div>
                </div>

                {/* Date and time info - Outside the main box */}
                <div className="flex items-center gap-[0.5rem] z-10">
                    <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                        <Calendar className="w-[0.844rem] h-[0.914rem] absolute left-[0.141rem] top-[0.07rem] text-[#14FFEC]" />
                    </div>
                    <div className="text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">
                        24 Dec | 7:00 pm
                    </div>
                </div>
            </div>


            {/* Main Content Container */}
            <div className="absolute top-[27vh] left-0 w-full min-h-[75vh] bg-gradient-to-b from-[rgba(17.52,124.23,115.6,0.82)] to-[rgba(0,0,0,0.82)] overflow-y-auto overflow-x-hidden scrollbar-hide rounded-t-[3.75rem]">

                {/* Floor Selection Tabs */}
                <div className="absolute top-[1rem] left-[1rem] right-[1rem] h-[3.125rem] flex">
                    {floors.map((floor, index) => (
                        <div key={floor} className="flex-1 relative overflow-hidden">
                            <div
                                className={`absolute w-full rounded-t-[0.5rem] ${floor === selectedFloor ? 'bg-[#14FFEC] h-[0.4375rem] bottom-0' : 'bg-[#D9D9D9] h-[0.0625rem] bottom-0'
                                    }`}
                            ></div>
                            <button
                                onClick={() => handleFloorSelect(floor)}
                                className="absolute inset-0 flex items-center justify-center text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]"
                            >
                                {floor}
                            </button>
                        </div>
                    ))}
                </div>                {/* Legend */}
                <div className="absolute top-[4.75rem] left-[1rem] right-[1rem] flex items-center justify-between px-2 mb-4">
                    <div className="flex items-center gap-[0.5rem]">
                        <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                            <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-[#FF4B4B] rounded-full"></div>
                        </div>
                        <div className="text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Reserved</div>
                    </div>

                    <div className="flex items-center gap-[0.5rem]">
                        <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                            <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-white rounded-full"></div>
                        </div>
                        <div className="text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Available</div>
                    </div>

                    <div className="flex items-center gap-[0.5rem]">
                        <div className="w-[1.125rem] h-[1.125rem] relative overflow-hidden">
                            <div className="w-[0.91438rem] h-[0.91438rem] absolute left-[0.10563rem] top-[0.10563rem] bg-[#14FFEC] rounded-full"></div>
                        </div>
                        <div className="text-white text-base font-['Manrope'] font-bold leading-[1.3125rem]">Selected</div>
                    </div>
                </div>

                {/* Table Layout Container */}
                <div className="absolute top-[7.5rem] left-0 w-full min-h-[48rem] bg-[rgba(255,255,255,0.09)] overflow-y-auto overflow-x-hidden scrollbar-hide rounded-t-[3.75rem] px-2 pb-32">
                    <div className="relative w-full min-h-[45rem] pt-[3rem]">
                        {/* Top tables row */}
                        <div className="w-full flex justify-between px-4 mb-4">
                            <div className="relative" style={{ width: '6.6875rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG - 03"
                                    status={getTableStatus('TG-03')}
                                    onClick={() => handleTableSelect('TG-03')}
                                    width="w-[6.6875rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'bottom']}
                                />
                            </div>

                            <div className="relative" style={{ width: '6.6875rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG - 04"
                                    status={getTableStatus('TG-04')}
                                    onClick={() => handleTableSelect('TG-04')}
                                    width="w-[6.6875rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'bottom']}
                                />
                            </div>
                        </div>

                        {/* Middle section with side tables and main table */}
                        <div className="w-full flex justify-between px-4 mb-6 mt-12">
                            {/* Left side table */}
                            <div className="relative mt-2" style={{ width: '3.125rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG 06"
                                    status={getTableStatus('TG-06')}
                                    onClick={() => handleTableSelect('TG-06')}
                                    width="w-[3.125rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'right', 'bottom']}
                                    chairCount={{ top: 1, right: 1, bottom: 1 }}
                                />
                            </div>

                            {/* Center main table */}
                            <div className="relative mx-auto" style={{ width: '8rem', height: '10rem' }}>
                                <TableComponent
                                    tableId="TG - 01"
                                    status={getTableStatus('TG-01')}
                                    onClick={() => handleTableSelect('TG-01')}
                                    width="w-[8rem]"
                                    height="h-[10rem]"
                                    chairPositions={['top', 'left', 'right', 'bottom']}
                                    chairCount={{ top: 2, left: 3, right: 3, bottom: 2 }}
                                />
                            </div>

                            {/* Right side table */}
                            <div className="relative mt-2" style={{ width: '3.125rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG 05"
                                    status={getTableStatus('TG-05')}
                                    onClick={() => handleTableSelect('TG-05')}
                                    width="w-[3.125rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'left', 'bottom']}
                                    chairCount={{ top: 1, left: 1, bottom: 1 }}
                                />
                            </div>
                        </div>

                        {/* Bottom section with side tables */}
                        <div className="w-full flex justify-between px-4 mb-10 mt-12">
                            {/* Left bottom table */}
                            <div className="relative" style={{ width: '3.125rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG 07"
                                    status={getTableStatus('TG-07')}
                                    onClick={() => handleTableSelect('TG-07')}
                                    width="w-[3.125rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'right', 'bottom']}
                                    chairCount={{ top: 1, right: 1, bottom: 1 }}
                                />
                            </div>

                            {/* Right bottom table */}
                            <div className="relative" style={{ width: '3.125rem', height: '3.125rem' }}>
                                <TableComponent
                                    tableId="TG 08"
                                    status={getTableStatus('TG-08')}
                                    onClick={() => handleTableSelect('TG-08')}
                                    width="w-[3.125rem]"
                                    height="h-[3.125rem]"
                                    chairPositions={['top', 'left', 'bottom']}
                                    chairCount={{ top: 1, left: 1, bottom: 1 }}
                                />
                            </div>
                        </div>

                        {/* Bottom main table */}
                        <div className="w-full flex justify-center px-4 mb-20">
                            <div className="relative mx-auto" style={{ width: '8rem', height: '9rem' }}>
                                <TableComponent
                                    tableId="TG - 02"
                                    status={getTableStatus('TG-02')}
                                    onClick={() => handleTableSelect('TG-02')}
                                    width="w-[8rem]"
                                    height="h-[9rem]"
                                    chairPositions={['left', 'right', 'bottom']}
                                    chairCount={{ left: 3, right: 3, bottom: 2 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomContinueButton
                    text="Reserve Table"
                    onClick={handleContinue}
                    disabled={!selectedTable || getTableStatus(selectedTable) === 'reserved'}
                />
            </div>
        </div>
    );
}