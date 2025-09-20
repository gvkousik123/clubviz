'use client';

import React, { useState } from 'react';
import { ChevronLeft, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TableSelectionPage() {
    const router = useRouter();
    const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
    const [selectedTable, setSelectedTable] = useState('TG-04');

    const floors = ['Ground Floor', '1st Floor', '2nd Floor'];

    const tables = {
        'Ground Floor': [
            { id: 'TG-03', status: 'available', size: 'small' },
            { id: 'TG-04', status: 'selected', size: 'small' },
            { id: 'TG-01', status: 'reserved', size: 'large' },
            { id: 'TG-02', status: 'reserved', size: 'large' },
            { id: 'TG-06', status: 'reserved', size: 'corner' },
            { id: 'TG-07', status: 'available', size: 'corner' },
            { id: 'TG-05', status: 'reserved', size: 'corner' }
        ],
        '1st Floor': [
            { id: 'T1-03', status: 'available', size: 'small' },
            { id: 'T1-04', status: 'available', size: 'small' },
            { id: 'T1-01', status: 'available', size: 'large' },
            { id: 'T1-02', status: 'available', size: 'large' },
            { id: 'T1-06', status: 'reserved', size: 'corner' },
            { id: 'T1-07', status: 'reserved', size: 'corner' },
            { id: 'T1-05', status: 'reserved', size: 'corner' }
        ],
        '2nd Floor': [
            { id: 'T2-03', status: 'available', size: 'small' },
            { id: 'T2-04', status: 'available', size: 'small' },
            { id: 'T2-01', status: 'available', size: 'large' },
            { id: 'T2-02', status: 'available', size: 'large' },
            { id: 'T2-06', status: 'available', size: 'corner' },
            { id: 'T2-07', status: 'available', size: 'corner' },
            { id: 'T2-05', status: 'available', size: 'corner' }
        ]
    };

    const getTableStyle = (table: any) => {
        const baseStyle = "relative border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all";

        if (table.status === 'reserved') {
            return `${baseStyle} border-red-500 bg-red-500/20 text-red-400 cursor-not-allowed`;
        } else if (table.status === 'selected') {
            return `${baseStyle} border-teal-400 bg-teal-400/30 text-teal-400 cursor-pointer`;
        } else {
            return `${baseStyle} border-white/30 bg-white/10 text-white cursor-pointer hover:border-teal-400/50`;
        }
    };

    const getTableSize = (size: string) => {
        switch (size) {
            case 'small':
                return 'w-16 h-12';
            case 'large':
                return 'w-24 h-16';
            case 'corner':
                return 'w-12 h-12';
            default:
                return 'w-16 h-12';
        }
    };

    const handleTableSelect = (tableId: string, status: string) => {
        if (status !== 'reserved') {
            setSelectedTable(tableId);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-6">
                <div className="flex items-center mb-4">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">DABO CLUB & KITCHEN</h1>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-white/80" />
                        <span className="text-white/80 text-sm">Dabo club & kitchen, Nagpur</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/80" />
                        <span className="text-white/80 text-sm">24 Dec | 7:00 pm</span>
                    </div>
                </div>
            </div>

            {/* Floor Selection */}
            <div className="px-4 py-4">
                <div className="flex bg-white/10 rounded-xl p-1">
                    {floors.map((floor) => (
                        <button
                            key={floor}
                            onClick={() => setSelectedFloor(floor)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedFloor === floor
                                    ? 'bg-teal-500 text-white'
                                    : 'text-white/70 hover:text-white'
                                }`}
                        >
                            {floor}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="px-4 mb-4">
                <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-white/80">Reserved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-white/40"></div>
                        <span className="text-white/80">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                        <span className="text-white/80">Selected</span>
                    </div>
                </div>
            </div>

            {/* Table Layout */}
            <div className="flex-1 px-4">
                <div className="relative bg-white/5 rounded-2xl p-6 min-h-96">
                    {/* DJ Booth / Stage */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-teal-500/20 border-2 border-teal-400 rounded-lg px-4 py-2">
                            <span className="text-teal-400 font-bold text-sm">
                                {selectedFloor === 'Ground Floor' ? 'TG-01' : selectedFloor === '1st Floor' ? 'T1-01' : 'T2-01'}
                            </span>
                        </div>
                    </div>

                    {/* Tables Layout */}
                    <div className="mt-16 grid grid-cols-8 gap-2 relative">
                        {/* Top row small tables */}
                        <div className="col-start-2 col-span-2 flex justify-center">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-03' : selectedFloor === '1st Floor' ? 'T1-03' : 'T2-03', tables[selectedFloor as keyof typeof tables][0].status)}
                                className={`${getTableStyle(tables[selectedFloor as keyof typeof tables][0])} ${getTableSize('small')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-03' : selectedFloor === '1st Floor' ? 'T1-03' : 'T2-03'}
                            </button>
                        </div>

                        <div className="col-start-5 col-span-2 flex justify-center">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-04' : selectedFloor === '1st Floor' ? 'T1-04' : 'T2-04', selectedFloor === 'Ground Floor' ? 'selected' : 'available')}
                                className={`${getTableStyle({ ...tables[selectedFloor as keyof typeof tables][1], status: selectedFloor === 'Ground Floor' ? 'selected' : 'available' })} ${getTableSize('small')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-04' : selectedFloor === '1st Floor' ? 'T1-04' : 'T2-04'}
                            </button>
                        </div>

                        {/* Side corner tables */}
                        <div className="col-start-1 row-start-3">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-06' : selectedFloor === '1st Floor' ? 'T1-06' : 'T2-06', tables[selectedFloor as keyof typeof tables][4].status)}
                                className={`${getTableStyle(tables[selectedFloor as keyof typeof tables][4])} ${getTableSize('corner')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-06' : selectedFloor === '1st Floor' ? 'T1-06' : 'T2-06'}
                            </button>
                        </div>

                        <div className="col-start-8 row-start-3">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-05' : selectedFloor === '1st Floor' ? 'T1-05' : 'T2-05', tables[selectedFloor as keyof typeof tables][6].status)}
                                className={`${getTableStyle(tables[selectedFloor as keyof typeof tables][6])} ${getTableSize('corner')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-05' : selectedFloor === '1st Floor' ? 'T1-05' : 'T2-05'}
                            </button>
                        </div>

                        {/* Bottom large table */}
                        <div className="col-start-3 col-span-4 row-start-5 flex justify-center">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-02' : selectedFloor === '1st Floor' ? 'T1-02' : 'T2-02', tables[selectedFloor as keyof typeof tables][3].status)}
                                className={`${getTableStyle(tables[selectedFloor as keyof typeof tables][3])} ${getTableSize('large')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-02' : selectedFloor === '1st Floor' ? 'T1-02' : 'T2-02'}
                            </button>
                        </div>

                        {/* Bottom corner tables */}
                        <div className="col-start-1 row-start-6">
                            <button
                                onClick={() => handleTableSelect(selectedFloor === 'Ground Floor' ? 'TG-07' : selectedFloor === '1st Floor' ? 'T1-07' : 'T2-07', tables[selectedFloor as keyof typeof tables][5].status)}
                                className={`${getTableStyle(tables[selectedFloor as keyof typeof tables][5])} ${getTableSize('corner')}`}
                            >
                                {selectedFloor === 'Ground Floor' ? 'TG-07' : selectedFloor === '1st Floor' ? 'T1-07' : 'T2-07'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reserve Button */}
            <div className="p-4">
                <button
                    onClick={() => router.push('/clubs/dabo/booking/confirmation')}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-semibold text-lg transition-colors"
                >
                    Reserve Table
                </button>
            </div>
        </div>
    );
}