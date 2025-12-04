'use client';

import { useEffect, useState } from 'react';
import { JWTService } from '@/lib/services/jwt.service';
import { useJWTToken } from '@/hooks/use-jwt-token';

/**
 * Example Component: JWT Token Usage
 * Demonstrates how to access and use stored JWT token
 */
export function JWTTokenExample() {
  const { token, decodedToken, isAuthenticated, getUserEmail, getTokenExpiration, isLoading } = useJWTToken();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Update time remaining every second
  useEffect(() => {
    const updateTimer = setInterval(() => {
      const remaining = JWTService.getTokenTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(updateTimer);
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-600">Not authenticated. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded border border-blue-200">
      <h3 className="font-bold text-lg mb-2">JWT Token Information</h3>

      {/* User Email */}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">Email:</span>
        <p className="text-gray-600 ml-2">{getUserEmail()}</p>
      </div>

      {/* Token Preview */}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">Token:</span>
        <p className="text-gray-600 ml-2 break-all text-sm font-mono">
          {token?.substring(0, 50)}...
        </p>
      </div>

      {/* Token Expiration */}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">Expires:</span>
        <p className="text-gray-600 ml-2">
          {getTokenExpiration()?.toLocaleString()}
        </p>
      </div>

      {/* Time Remaining */}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">Time Remaining:</span>
        <p className={`ml-2 font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-green-600'}`}>
          {Math.floor(timeRemaining / 60)} minutes {timeRemaining % 60} seconds
        </p>
      </div>

      {/* Decoded Token Data */}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">Token Data:</span>
        <pre className="ml-2 bg-gray-800 text-gray-200 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(decodedToken, null, 2)}
        </pre>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          JWTService.clearSession();
          window.location.href = '/auth/mobile';
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

/**
 * Example: API Request with JWT Token
 */
export async function exampleAPIRequest() {
  try {
    // Get authorization headers
    const headers = JWTService.getAuthHeaders();

    // Make authenticated API request
    const response = await fetch('/api/protected-endpoint', {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      JWTService.clearSession();
      console.log('Token expired, user logged out');
      return;
    }

    const data = await response.json();
    console.log('Protected data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
  }
}

/**
 * Example: Check Authentication Status
 */
export function checkAuthenticationStatus() {
  const isAuth = JWTService.isAuthenticated();
  const isExpired = JWTService.isTokenExpired();
  const timeLeft = JWTService.getTokenTimeRemaining();
  const user = JWTService.getUserIdentifier();

  console.log('=== Authentication Status ===');
  console.log(`Authenticated: ${isAuth}`);
  console.log(`Token Expired: ${isExpired}`);
  console.log(`Time Remaining: ${timeLeft} seconds`);
  console.log(`Current User: ${user}`);

  return {
    isAuthenticated: isAuth && !isExpired,
    isExpired,
    timeRemaining: timeLeft,
    currentUser: user,
  };
}

/**
 * Example: Remember User After Login
 */
export function rememberUserAfterLogin(userData: {
  email: string;
  userId: string;
  name?: string;
  role?: string;
}) {
  JWTService.rememberUser({
    email: userData.email,
    userId: userData.userId,
    name: userData.name,
    role: userData.role,
  });

  console.log('User session remembered:', userData);
}

/**
 * Example: Get Remembered User Data
 */
export function getRememberedUserData() {
  const userData = JWTService.getRememberedUser();
  console.log('Remembered user data:', userData);
  return userData;
}
