import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { firebasePhoneAuth } from '@/lib/firebase/phone-auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.phoneNumber || 'No user');
      setAuthState({
        user,
        loading: false,
        error: null
      });
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebasePhoneAuth.signOut();
      // Clear local storage
      localStorage.removeItem('firebaseUser');
      localStorage.removeItem('accessToken');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ ...prev, error: error.message }));
    }
  };

  const getCurrentUser = () => {
    return firebasePhoneAuth.getCurrentUser();
  };

  const getIdToken = async () => {
    const user = getCurrentUser();
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    return null;
  };

  return {
    ...authState,
    signOut,
    getCurrentUser,
    getIdToken,
    isAuthenticated: !!authState.user
  };
};

export default useFirebaseAuth;