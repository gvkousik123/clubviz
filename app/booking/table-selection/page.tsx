'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

export default function TableSelectionPage() {
    const router = useRouter();
    const [selectedFloor, setSelectedFloor] = useState('1st Floor');
    const [selectedTable, setSelectedTable] = useState('T3');

    const handleGoBack = () => {
        router.back();
    };

    const handleFloorSelect = (floor: string) => {
        setSelectedFloor(floor);
    };

    const handleTableSelect = (table: string) => {
        setSelectedTable(table);
    };

    const handleBookTable = () => {
        router.push('/booking/review');
    };

    // Floor options
    const floors = ['1st Floor', '2nd Floor', '3rd Floor'];

    // Table status
    const getTableStatus = (tableId: string) => {
        const reservedTables = ['T1', 'T4', 'T7', 'T8'];
        const availableTables = ['T2', 'T3', 'T5', 'T6'];

        if (reservedTables.includes(tableId)) return 'reserved';
        if (availableTables.includes(tableId)) return 'available';
        return 'selected';
    };

    const getTableColor = (tableId: string) => {
        const status = getTableStatus(tableId);
        if (tableId === selectedTable) return 'bg-teal-600 border-teal-400';
        if (status === 'reserved') return 'bg-red-500/80 border-red-400';
        return 'bg-[#2a2a38] border-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        SELECT TABLE
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Floor Selection */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {floors.map((floor) => (
                            <button
                                key={floor}
                                onClick={() => handleFloorSelect(floor)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedFloor === floor
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-[#222831] text-white/70 hover:bg-[#2a2a38]'
                                    }`}
                            >
                                {floor}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Layout */}
                <div className="space-y-6">
                    <div className="relative bg-[#1a1a24] rounded-2xl p-6 h-96">
                        {/* Stage */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-4 py-2">
                            <span className="text-white text-sm font-medium">STAGE</span>
                        </div>

                        {/* DJ Booth */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#2a2a38] rounded-lg px-3 py-1">
                            <span className="text-white text-xs">DJ</span>
                        </div>

                        {/* Tables Layout */}
                        <div className="absolute top-28 left-8">
                            <button
                                onClick={() => handleTableSelect('T1')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T1')}`}
                            >
                                T1
                            </button>
                        </div>

                        <div className="absolute top-28 right-8">
                            <button
                                onClick={() => handleTableSelect('T2')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T2')}`}
                            >
                                T2
                            </button>
                        </div>

                        <div className="absolute top-44 left-1/2 transform -translate-x-1/2">
                            <button
                                onClick={() => handleTableSelect('T3')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T3')}`}
                            >
                                {selectedTable === 'T3' && <Check size={16} className="text-white" />}
                                {selectedTable !== 'T3' && 'T3'}
                            </button>
                        </div>

                        <div className="absolute bottom-24 left-8">
                            <button
                                onClick={() => handleTableSelect('T4')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T4')}`}
                            >
                                T4
                            </button>
                        </div>

                        <div className="absolute bottom-24 right-8">
                            <button
                                onClick={() => handleTableSelect('T5')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T5')}`}
                            >
                                T5
                            </button>
                        </div>

                        <div className="absolute bottom-8 left-1/4">
                            <button
                                onClick={() => handleTableSelect('T6')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T6')}`}
                            >
                                T6
                            </button>
                        </div>

                        <div className="absolute bottom-8 right-1/4">
                            <button
                                onClick={() => handleTableSelect('T7')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T7')}`}
                            >
                                T7
                            </button>
                        </div>

                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                            <button
                                onClick={() => handleTableSelect('T8')}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${getTableColor('T8')}`}
                            >
                                T8
                            </button>
                        </div>

                        {/* Dance Floor */}
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/50 text-xs">
                            Dance Floor
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-teal-600 rounded border-2 border-teal-400"></div>
                            <span className="text-white/70">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-[#2a2a38] rounded border-2 border-gray-600"></div>
                            <span className="text-white/70">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500/80 rounded border-2 border-red-400"></div>
                            <span className="text-white/70">Reserved</span>
                        </div>
                    </div>
                </div>

                {/* Selected Table Info */}
                {selectedTable && (
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <h3 className="text-white font-medium mb-2">Table {selectedTable}</h3>
                        <p className="text-white/70 text-sm mb-2">Capacity: 4-6 people</p>
                        <p className="text-white/70 text-sm mb-2">Location: Near stage with great view</p>
                        <p className="text-teal-400 text-sm font-medium">₹2,500 minimum order</p>
                    </div>
                )}

                {/* Book Table Button */}
                <div className="pt-4">
                    <button
                        onClick={handleBookTable}
                        disabled={!selectedTable || getTableStatus(selectedTable) === 'reserved'}
                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        {selectedTable ? `Book Table ${selectedTable}` : 'Select a Table'}
                    </button>
                </div>
            </div>
        </div>
    );
}