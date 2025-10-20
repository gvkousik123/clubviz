'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '../../admin/new-event/styles.css';
import PageHeader from '@/components/common/page-header';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function AddLocationPage() {
    const router = useRouter();
    const [address, setAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    const handleAddressChange = (field: string, value: string) => {
        setAddress({ ...address, [field]: value });
    };

    const handleUseCurrentLocation = () => {
        // This would normally use the browser's geolocation API
        // For demo purposes, we'll just set a mock location
        setCurrentLocation("House 1915/8/1, Yogesham CHS, Wardha Road, Nagpur");
    };

    const handleAddressSubmit = () => {
        // Here you would save the address and return to the previous page
        // For now, we'll just go back
        router.back();
    };

    const handleShowAddressForm = () => {
        setShowAddressForm(true);
    };

    const handleSaveDetails = () => {
        // Save address details and go back
        router.back();
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* First Page - Map with Search */}
            {!showAddressForm ? (
                <>
                    <PageHeader title="Enter your Location" />

                    {/* Google Map */}
                    <div className="w-full h-[calc(100vh-250px)] pt-[10vh] z-[-1]">
                        <div className="w-full h-full bg-gray-300 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14882.301196323082!2d79.07200731381253!3d21.14599109999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a1a9e94981%3A0xb7c17454491a28cd!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700143121201!5m2!1sen!2sin"
                                className="w-full h-full border-0"
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Bottom Container */}
                    <div className="fixed bottom-0 left-0 right-0 z-40 w-full py-7 px-5 bg-[#021313] overflow-hidden rounded-t-[40px] rounded-b-[20px] border-t-2 border-[#14FFEC] flex flex-col gap-[91px]">
                        <div className="flex flex-col gap-[20px]">
                            {/* Search Box */}
                            <div className="h-[51px] py-[6px]">
                                <div className="h-[50px] py-[8px] px-[15px] bg-[#0D1F1F] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden rounded-[23px] flex justify-between items-center">
                                    <div className="flex items-center gap-[8px]">
                                        <div className="w-[30px] h-[30px] relative overflow-hidden flex items-center justify-center">
                                            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="text-white text-[16px] font-bold leading-[16px] tracking-[0.5px]">Nagpur</div>
                                    </div>
                                    <div className="w-[30px] h-[30px] relative overflow-hidden flex items-center justify-center">
                                        <Image
                                            src="/admin/location/NavigationArrow.svg"
                                            alt="Navigation"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Current Location and Address */}
                            <div className="flex flex-col gap-[10px]">
                                {/* Use Current Location Option */}
                                <div
                                    onClick={handleUseCurrentLocation}
                                    className="flex items-center gap-[12px] cursor-pointer"
                                >
                                    <div className="w-[30px] h-[30px] relative overflow-hidden flex items-center justify-center">
                                        <Image
                                            src="/admin/location/NavigationArrow.svg"
                                            alt="Current Location"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className="text-white text-[16px] font-bold leading-[16px] tracking-[0.5px]">Use your current location</div>
                                </div>

                                {/* Selected Location */}
                                {currentLocation && (
                                    <div className="py-[20px] px-[22px] bg-[#0D1F1F] rounded-[20px] flex items-start gap-[11px]">
                                        <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                            <Image
                                                src="/admin/location/MapPin.svg"
                                                alt="Location Pin"
                                                width={16.5}
                                                height={21}
                                            />
                                        </div>
                                        <div className="w-[270px]">
                                            <p className="text-white text-[14px] font-medium leading-[20px] tracking-[0.14px]">{currentLocation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Address Button */}
                        <div
                            onClick={handleShowAddressForm}
                            className="text-center text-[#14FFEC] text-[20px] font-semibold leading-[21px] tracking-[0.2px] cursor-pointer"
                        >
                            Add Address Information
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <PageHeader title="Add Address Info" />

                    {/* Address Form */}
                    <div className="px-0 pt-[120px] pb-[100px] relative z-20">
                        <div className="w-full bg-[#021313] flex flex-col items-center gap-[20px] p-[0_14px]">
                            <div className="w-full mt-4">
                                <div className="text-center mb-6">
                                    <button
                                        className="text-[#14FFEC] font-medium"
                                        onClick={() => { /* Manual location entry logic */ }}
                                    >
                                        Enter location manually
                                    </button>
                                </div>

                                <div className="bg-[#021313] rounded-t-[30px] p-4">
                                    <h3 className="text-[#14FFEC] font-semibold text-lg mb-4">Address Info</h3>

                                    {/* Address 1 */}
                                    <div className="mb-4">
                                        <label className="block text-[#14FFEC] font-medium mb-2">
                                            Address 1 <span className="text-[#14FFEC]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={address.address1}
                                            onChange={(e) => handleAddressChange('address1', e.target.value)}
                                            placeholder="Enter Club Name Here"
                                            className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white placeholder-[#9D9C9C] outline-none"
                                        />
                                    </div>

                                    {/* Address 2 */}
                                    <div className="mb-4">
                                        <label className="block text-[#14FFEC] font-medium mb-2">
                                            Address 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={address.address2}
                                            onChange={(e) => handleAddressChange('address2', e.target.value)}
                                            placeholder="Enter Club Name Here"
                                            className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white placeholder-[#9D9C9C] outline-none"
                                        />
                                    </div>

                                    {/* City and State in one row */}
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1">
                                            <label className="block text-[#14FFEC] font-medium mb-2">
                                                City <span className="text-[#14FFEC]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={(e) => handleAddressChange('city', e.target.value)}
                                                placeholder="Enter City"
                                                className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white placeholder-[#9D9C9C] outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[#14FFEC] font-medium mb-2">
                                                State <span className="text-[#14FFEC]">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={address.state}
                                                    onChange={(e) => handleAddressChange('state', e.target.value)}
                                                    className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white outline-none appearance-none"
                                                >
                                                    <option value="">Select State</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Delhi">Delhi</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Country and Pincode in one row */}
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[#14FFEC] font-medium mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                value={address.country}
                                                onChange={(e) => handleAddressChange('country', e.target.value)}
                                                placeholder="Enter Country"
                                                className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white placeholder-[#9D9C9C] outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[#14FFEC] font-medium mb-2">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                value={address.pincode}
                                                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                                                placeholder="Enter Pincode"
                                                className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-3 text-white placeholder-[#9D9C9C] outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Details Button */}
                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <div className="w-full h-[80px] bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                            <div className="flex justify-center items-center px-8 h-full">
                                <button
                                    onClick={handleSaveDetails}
                                    className="w-[220px] h-[45px] bg-[#0F6861] rounded-[30px] text-white font-semibold"
                                >
                                    Save Details
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
