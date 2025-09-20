'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function VerifyScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+91 84567XXXXX');
  const [enteredNumber, setEnteredNumber] = useState('');

  const handleBack = () => {
    window.location.href = '/auth/login';
  };

  const handleSkip = () => {
    window.location.href = '/home';
  };

  const handleNumberInput = (num: string) => {
    if (enteredNumber.length < 10) {
      setEnteredNumber(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setEnteredNumber(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-clubviz-dark flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10"></div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          className="px-4 py-2 rounded-full border border-clubviz-teal text-clubviz-teal"
        >
          Skip
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-clubviz">
            <div className="flex items-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-clubviz rounded-lg flex items-center justify-center mr-1">
                <span className="text-white font-bold text-sm md:text-base">C</span>
              </div>
              <div className="text-lg md:text-xl"></div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-clubviz-teal mb-4 tracking-wider">
            CLUBVIZ
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-6 mx-auto w-full max-w-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Enter your Mobile Number</h2>

            <div className="mb-4">
              <input
                type="text"
                value={`+91 ${enteredNumber}`}
                readOnly
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-500 bg-gray-50 text-center font-medium outline-none text-gray-900"
                placeholder="+91 84567XXXXX"
              />
            </div>

            <p className="text-sm text-gray-600 mb-6">
              We will send you a confirmation code
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num.toString())}
                className="w-16 h-16 rounded-full border-2 border-teal-500 text-gray-900 text-xl font-semibold hover:bg-teal-50 transition-colors mx-auto"
              >
                {num}
              </button>
            ))}

            <button
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full bg-gray-200 text-gray-700 text-xl font-semibold hover:bg-gray-300 transition-colors mx-auto"
            >
              ×
            </button>

            <button
              onClick={() => handleNumberInput('0')}
              className="w-16 h-16 rounded-full border-2 border-teal-500 text-gray-900 text-xl font-semibold hover:bg-teal-50 transition-colors mx-auto"
            >
              0
            </button>

            <button
              onClick={handleSubmit}
              className="w-16 h-16 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors mx-auto flex items-center justify-center"
            >
              →
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By login you are agreeing to{' '}
              <span className="text-teal-500 underline">Terms & Condition</span>{' '}
              and <span className="text-teal-500 underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
