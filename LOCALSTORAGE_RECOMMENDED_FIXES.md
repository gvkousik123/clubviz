# Recommended localStorage & Logout Fixes

## Overview

This document outlines specific improvements to localStorage handling and logout procedures to ensure robust session management.

---

## 🔧 FIX #1: Improve Sidebar Logout Error Handling

### Issue
When logout API fails, `localStorage.clear()` removes ALL data including non-auth items like favorites.

### Location
**File:** `components/common/sidebar.tsx` (lines ~59-88)

### Current Code (❌ Problematic)
```typescript
const handleLogout = async () => {
    try {
        await AuthService.logout();
        toast({
            title: "Logged out successfully",
            description: "You have been logged out of your account",
        });
        onClose();
        router.push('/auth/intro');
    } catch (error: any) {
        console.error('Logout error:', error);

        // ❌ PROBLEM: Removes ALL data including favorites
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }

        toast({
            title: "Logged out",
            description: "Session cleared successfully",
        });

        onClose();
        router.push('/auth/intro');
    }
};
```

### Fixed Code (✅ Selective Removal)
```typescript
const handleLogout = async () => {
    try {
        await AuthService.logout();
        toast({
            title: "Logged out successfully",
            description: "You have been logged out of your account",
        });
        onClose();
        router.push('/auth/intro');
    } catch (error: any) {
        console.error('Logout error:', error);

        // ✅ IMPROVED: Only remove auth data
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.accessToken);
            localStorage.removeItem(STORAGE_KEYS.refreshToken);
            localStorage.removeItem(STORAGE_KEYS.user);
            localStorage.removeItem(STORAGE_KEYS.pendingPhone);
            // Preserves: favorites, theme, preferences, etc.
        }

        toast({
            title: "Logged out",
            description: "Session cleared successfully",
        });

        onClose();
        router.push('/auth/intro');
    }
};
```

### Implementation Steps

1. Open `components/common/sidebar.tsx`
2. Find `handleLogout` function (around line 59)
3. Replace the `catch` block with the fixed code above
4. Test logout by:
   - Adding an item to favorites
   - Logging out (keep app offline to trigger error)
   - Check favorites still exist in localStorage

---

## 🔧 FIX #2: Clean Up Temporary Phone During New User Registration

### Issue
`pendingPhone` remains in localStorage after new user registration completes.

### Location
**File:** `app/auth/details/page.tsx` (lines ~149-165)

### Current Code (❌ Incomplete)
```typescript
if (userData) {
    console.log("📝 Storing user data:", userData);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
}

// Clean up temporary data
localStorage.removeItem('tempFirebaseToken');
localStorage.removeItem('tempPhoneNumber');
localStorage.removeItem('verificationResult');
// ❌ MISSING: pendingPhone cleanup
```

### Fixed Code (✅ Complete Cleanup)
```typescript
if (userData) {
    console.log("📝 Storing user data:", userData);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
}

// ✅ IMPROVED: Clean up ALL temporary data
localStorage.removeItem('tempFirebaseToken');
localStorage.removeItem('tempPhoneNumber');
localStorage.removeItem('verificationResult');
localStorage.removeItem(STORAGE_KEYS.pendingPhone);  // Added
console.log("✅ Temp data cleaned up");
```

### Implementation Steps

1. Open `app/auth/details/page.tsx`
2. Find the section where temp data is cleaned (around line 160)
3. Add: `localStorage.removeItem(STORAGE_KEYS.pendingPhone);`
4. Test by:
   - Complete registration as new user
   - Open DevTools → localStorage
   - Verify no `clubviz-pendingPhone` exists

---

## 🔧 FIX #3: Create Centralized Cleanup Service

### Issue
Cleanup logic is scattered across multiple files. Centralizing improves maintainability.

### Solution
Create a dedicated cleanup service.

### New File: `lib/services/cleanup.service.ts`

```typescript
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Cleanup Service
 * Centralized storage cleanup operations
 */
export class CleanupService {
  /**
   * Clear all authentication data from localStorage
   * Called on logout, session expiry, or account deletion
   */
  static clearAuthData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.pendingPhone);
    
    console.log('✅ Auth data cleared from localStorage');
  }

  /**
   * Clear temporary authentication data from localStorage
   * Called during signup/login process
   */
  static clearTempAuthData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('tempFirebaseToken');
    localStorage.removeItem('tempPhoneNumber');
    localStorage.removeItem('verificationResult');
    
    console.log('✅ Temp auth data cleared from localStorage');
  }

  /**
   * Clear all user-related preferences
   * Called during full logout or account deletion
   */
  static clearUserPreferences(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('favoriteClubs');
    localStorage.removeItem('favoriteEvents');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('lastLocation');
    
    console.log('✅ User preferences cleared from localStorage');
  }

  /**
   * Clear everything from localStorage
   * Use with caution - removes all stored data
   */
  static clearEverything(): void {
    if (typeof window === 'undefined') return;

    localStorage.clear();
    console.log('✅ All localStorage data cleared');
  }

  /**
   * Print current localStorage state (for debugging)
   */
  static printState(): void {
    if (typeof window === 'undefined') return;

    console.log('📊 Current localStorage state:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value?.substring(0, 50)}...`);
    }
  }

  /**
   * Verify required auth data exists
   */
  static isAuthDataPresent(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    const user = localStorage.getItem(STORAGE_KEYS.user);
    
    return !!token && !!user;
  }

  /**
   * Get storage info
   */
  static getStorageInfo(): { itemCount: number; authPresent: boolean } {
    if (typeof window === 'undefined') {
      return { itemCount: 0, authPresent: false };
    }

    return {
      itemCount: localStorage.length,
      authPresent: this.isAuthDataPresent()
    };
  }
}
```

### Implementation Steps

1. Create new file: `lib/services/cleanup.service.ts`
2. Copy the code above
3. Export from `lib/services/index.ts`:
   ```typescript
   export { CleanupService } from './cleanup.service';
   ```

---

## 🔧 FIX #4: Update AuthService to Use CleanupService

### Location
**File:** `lib/services/auth.service.ts` (lines ~12-29)

### Current Code
```typescript
const storeAuthSession = (data: any) => {
  if (typeof window === 'undefined') return;

  if (data) {
    if (data.accessToken) {
      localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    }
    
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data));
  }
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.user);
};
```

### Updated Code (✅ Using CleanupService)
```typescript
import { CleanupService } from './cleanup.service';

const storeAuthSession = (data: any) => {
  if (typeof window === 'undefined') return;

  if (data) {
    if (data.accessToken) {
      localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    }
    
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data));
  }
};

const clearAuthSession = () => {
  // ✅ Use centralized cleanup
  CleanupService.clearAuthData();
};
```

### Implementation Steps

1. Open `lib/services/auth.service.ts`
2. Add import at top:
   ```typescript
   import { CleanupService } from './cleanup.service';
   ```
3. Replace `clearAuthSession()` body with:
   ```typescript
   CleanupService.clearAuthData();
   ```

---

## 🔧 FIX #5: Update Sidebar to Use CleanupService

### Location
**File:** `components/common/sidebar.tsx` (lines ~59-88)

### Updated Code
```typescript
import { CleanupService } from '@/lib/services/cleanup.service';

const handleLogout = async () => {
    try {
        await AuthService.logout();
        toast({
            title: "Logged out successfully",
            description: "You have been logged out of your account",
        });
        onClose();
        router.push('/auth/intro');
    } catch (error: any) {
        console.error('Logout error:', error);

        // ✅ Use centralized cleanup
        CleanupService.clearAuthData();

        toast({
            title: "Logged out",
            description: "Session cleared successfully",
        });

        onClose();
        router.push('/auth/intro');
    }
};
```

### Implementation Steps

1. Open `components/common/sidebar.tsx`
2. Add import:
   ```typescript
   import { CleanupService } from '@/lib/services/cleanup.service';
   ```
3. Replace localStorage.clear() with:
   ```typescript
   CleanupService.clearAuthData();
   ```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Create CleanupService (5 min)
- [ ] Create `lib/services/cleanup.service.ts`
- [ ] Add export to `lib/services/index.ts`
- [ ] Verify file has no syntax errors

### Phase 2: Update AuthService (5 min)
- [ ] Import CleanupService in auth.service.ts
- [ ] Update clearAuthSession() to use CleanupService
- [ ] Test logout still works

### Phase 3: Update Sidebar (5 min)
- [ ] Import CleanupService in sidebar.tsx
- [ ] Replace localStorage.clear() with CleanupService.clearAuthData()
- [ ] Test error logout scenario

### Phase 4: Update Details Page (3 min)
- [ ] Add pendingPhone removal in details page
- [ ] Test new user registration
- [ ] Verify no pendingPhone remains

### Phase 5: Testing (10 min)
- [ ] [ ] Test normal login flow
- [ ] [ ] Test successful logout
- [ ] [ ] Test logout with API failure
- [ ] [ ] Test direct login (page refresh)
- [ ] [ ] Test guest mode
- [ ] [ ] Verify favorites persist after logout error

### Phase 6: Documentation (5 min)
- [ ] Update auth documentation
- [ ] Add cleanup service to API reference

---

## 🧪 TEST SCRIPT

After implementing all fixes, run this test:

```javascript
// Test 1: Login flow
console.log('🔍 Test 1: Login flow');
console.log('Before login:', localStorage.length, 'items');
// → Should be 0 (or only favorites/preferences)

// Complete login flow...

console.log('After login:', localStorage.length, 'items');
console.log('Auth token:', localStorage.getItem('clubviz-accessToken') ? 'EXISTS' : 'MISSING');
console.log('User data:', localStorage.getItem('clubviz-user') ? 'EXISTS' : 'MISSING');
// → Should have accessToken and user

// Test 2: Successful logout
console.log('\n🔍 Test 2: Successful logout');
// Click logout...
console.log('After logout:', localStorage.length, 'items');
console.log('Auth token:', localStorage.getItem('clubviz-accessToken') ? 'EXISTS' : 'MISSING');
console.log('User data:', localStorage.getItem('clubviz-user') ? 'EXISTS' : 'MISSING');
// → Auth data should be cleared

// Test 3: Direct login (page refresh)
console.log('\n🔍 Test 3: Direct login');
console.log('Refresh page...');
console.log('Auth token still present:', localStorage.getItem('clubviz-accessToken') ? '✅ YES' : '❌ NO');
console.log('User still logged in: AUTO-LOAD PROFILE should trigger');
// → Should still be logged in

// Test 4: Logout error scenario
console.log('\n🔍 Test 4: Logout error');
// Manually disconnect network in DevTools
// Click logout...
console.log('After logout error:', localStorage.length, 'items');
console.log('Auth token cleared:', !localStorage.getItem('clubviz-accessToken') ? '✅ YES' : '❌ NO');
console.log('Favorites preserved:', localStorage.getItem('favoriteClubs') ? '✅ YES' : '❌ NO');
// → Auth cleared but favorites remain
```

---

## ✅ SUCCESS CRITERIA

After implementing all fixes:

- ✅ localStorage properly updates during login
- ✅ localStorage completely cleared on logout
- ✅ Temp data cleaned after signup
- ✅ Direct login works (auto-load if token exists)
- ✅ Non-auth data preserved when logout fails
- ✅ Cleanup logic centralized and maintainable
- ✅ No duplicate cleanup code across files

---

## 📝 COMMIT MESSAGE TEMPLATE

```
feat: Improve localStorage & logout handling

- Create centralized CleanupService for storage management
- Fix sidebar logout to preserve non-auth data on error
- Clean up temporary phone data after new user registration
- Update AuthService to use CleanupService
- Add localStorage info debugging utilities

Fixes: localStorage not cleaned properly on error
Improves: Session management robustness
```

---

## 🚀 NEXT STEPS

1. **Immediate:** Implement all 5 fixes (30 minutes)
2. **Test:** Run test script to verify functionality
3. **Deploy:** Push to main branch
4. **Monitor:** Watch logs for any cleanup issues
5. **Document:** Update API documentation with cleanup procedures

---

## ⚠️ ROLLBACK PROCEDURE

If issues occur:

1. Revert CleanupService changes
2. Restore original `clearAuthSession()` in AuthService
3. Restore original logout error handling in Sidebar
4. Verify logout still works with localStorage.removeItem()

---

## 📞 SUMMARY

These fixes make localStorage and logout handling more robust by:
1. Preventing data loss during logout errors
2. Centralizing cleanup logic for maintainability
3. Ensuring complete cleanup after signup
4. Preserving user preferences across sessions
5. Providing debugging utilities for monitoring

**Total Implementation Time: ~30 minutes**
**Risk Level: LOW** (all changes are backward compatible)
**Testing Complexity: LOW** (clear test cases provided)

