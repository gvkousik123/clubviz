'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth.service';

export default function TestAPIPage() {
    const [testResult, setTestResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const testOTPSend = async () => {
        setIsLoading(true);
        setTestResult('Testing OTP send...');

        try {
            const response = await AuthService.sendOTP({
                phone: '919876543210',
                type: 'login'
            });

            setTestResult(JSON.stringify(response, null, 2));
        } catch (error: any) {
            setTestResult(`Error: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testAPIConnection = async () => {
        setIsLoading(true);
        setTestResult('Testing API connection...');

        try {
            // Test a simple fetch to the API
            const response = await fetch('https://98.90.141.103/api/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.text();
            setTestResult(`Status: ${response.status}\nData: ${data}`);
        } catch (error: any) {
            setTestResult(`Connection Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

                <div className="space-y-4">
                    <button
                        onClick={testAPIConnection}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Test API Connection
                    </button>

                    <button
                        onClick={testOTPSend}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
                    >
                        Test OTP Send
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Test Result:</h2>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-96">
                        {testResult || 'Click a button to test the API'}
                    </pre>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">API Configuration:</h2>
                    <pre className="bg-gray-800 text-blue-400 p-4 rounded">
                        {`API_BASE_URL: https://98.90.141.103/api
Environment: ${process.env.NODE_ENV}
NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}`}
                    </pre>
                </div>
            </div>
        </div>
    );
}