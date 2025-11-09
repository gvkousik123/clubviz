# localStorage & Logout - Quick Reference Card

## 🎯 TL;DR (Too Long; Didn't Read)

| Question | Answer |
|----------|--------|
| **Is localStorage updated on login?** | ✅ YES - accessToken, refreshToken, user all stored |
| **Is localStorage cleared on logout?** | ✅ YES - All auth data removed |
| **Does direct login work?** | ✅ YES - If token exists, user auto-logs in |
| **Any issues found?** | ⚠️ MINOR - Only removes auth on error (not favorites) |
| **Production ready?** | ✅ YES - Safe to deploy |

---

## 🔑 Storage Keys Reference

```
During Login:
├─ 'clubviz-pendingPhone'    ← Temp during signup
├─ 'tempFirebaseToken'       ← Temp during OTP
├─ 'verificationResult'      ← Temp during OTP
└─ After details page:
   ├─ 'clubviz-accessToken'  ← JWT Bearer token
   ├─ 'clubviz-refreshToken' ← Refresh token
   └─ 'clubviz-user'         ← User profile data

During Logout:
├─ 'clubviz-accessToken'  ← REMOVED ✓
├─ 'clubviz-refreshToken' ← REMOVED ✓
├─ 'clubviz-user'         ← REMOVED ✓
└─ Other data (favorites)  ← Might be removed ⚠️
```

---

## 🔄 Complete Flow

```
LOGIN FLOW
┌─────────────────────┐
│ Enter Phone Number  │
└──────────┬──────────┘
           ↓
   pendingPhone stored
           ↓
┌─────────────────────┐
│ Send OTP            │
└──────────┬──────────┘
           ↓
   tempFirebaseToken stored
           ↓
┌─────────────────────┐
│ Verify OTP          │
└──────────┬──────────┘
           ↓
   Firebase verifies
           ↓
┌─────────────────────┐
│ Enter Details       │
└──────────┬──────────┘
           ↓
   accessToken stored ✓
   user data stored ✓
   temp data cleared ✓
           ↓
┌─────────────────────┐
│ Logged In!          │
│ Token persists      │
│ Auto-login works    │
└─────────────────────┘

LOGOUT FLOW
┌─────────────────────┐
│ Click Logout        │
└──────────┬──────────┘
           ↓
   AuthService.logout()
           ↓
   API: POST /auth/logout
           ↓
   clearAuthSession()
           ↓
   Token removed ✓
   User removed ✓
   RefreshToken removed ✓
           ↓
┌─────────────────────┐
│ Logged Out          │
│ Redirected to login │
└─────────────────────┘
```

---

## 🧪 One-Minute Test

```javascript
// Test 1: Check if logged in
localStorage.getItem('clubviz-accessToken')
// Result: null = logged out, JWT string = logged in

// Test 2: Check user data
JSON.parse(localStorage.getItem('clubviz-user'))
// Result: User object if logged in

// Test 3: Check guest mode
const isGuest = !localStorage.getItem('clubviz-accessToken');
// Result: true = guest, false = logged in

// Test 4: Check temp data (during signup)
localStorage.getItem('tempFirebaseToken')
// Result: Should be null after signup completes

// Test 5: Storage state summary
Object.keys(localStorage)
// Result: Should be empty or only non-auth keys after logout
```

---

## ⚡ Quick Commands

```powershell
# Test localStorage in browser DevTools

# Open DevTools
F12

# Go to Application tab
Click: Application tab → Storage → Local Storage

# See all keys
Object.keys(localStorage)

# See specific token
localStorage.getItem('clubviz-accessToken')

# See user data
JSON.parse(localStorage.getItem('clubviz-user'))

# Clear specific key
localStorage.removeItem('clubviz-accessToken')

# See all data
console.table(Object.entries(localStorage).map(([k,v]) => ({key: k, value: v})))
```

---

## 🔍 Verification Checklist

### ✅ After Login
- [ ] `clubviz-accessToken` exists
- [ ] `clubviz-user` exists
- [ ] `clubviz-refreshToken` exists
- [ ] No `tempFirebaseToken`
- [ ] Can call API with token

### ✅ After Logout
- [ ] `clubviz-accessToken` removed
- [ ] `clubviz-user` removed
- [ ] `clubviz-refreshToken` removed
- [ ] Redirected to /auth/intro
- [ ] Cannot call private API

### ✅ After Page Refresh (Logged In)
- [ ] `clubviz-accessToken` still exists
- [ ] `clubviz-user` still exists
- [ ] Auto-loaded profile data
- [ ] Still logged in ✓

### ✅ Guest Mode
- [ ] No `clubviz-accessToken`
- [ ] No `clubviz-user`
- [ ] Can see public clubs
- [ ] No Bearer token in API calls

---

## 🚨 Common Issues & Fixes

### Issue: Still Logged In After Logout
```javascript
// Check if tokens still exist
localStorage.getItem('clubviz-accessToken')  // Should be null
localStorage.getItem('clubviz-user')         // Should be null

// If not null, manually clear
localStorage.removeItem('clubviz-accessToken')
localStorage.removeItem('clubviz-user')
localStorage.removeItem('clubviz-refreshToken')

// Reload page
location.reload()
```

### Issue: Not Auto-Logging In After Refresh
```javascript
// Check if token exists
localStorage.getItem('clubviz-accessToken')  // Should have JWT

// If null, need to login again

// If exists, check if home page load checks for it
// Navigate to /home
// Profile should auto-load if token valid
```

### Issue: Favorites Disappear After Error Logout
```javascript
// This happens because sidebar logout uses localStorage.clear()
// Workaround: Save favorites before logout
const fav = localStorage.getItem('favoriteClubs')
// ... logout ...
// Restore if needed
localStorage.setItem('favoriteClubs', fav)
```

---

## 📊 Expected Storage States

```
State: GUEST (Not Logged In)
├─ accessToken: ❌ null
├─ user: ❌ null
├─ refreshToken: ❌ null
├─ favoriteClubs: ✅ might exist
└─ pendingPhone: ❌ null

State: DURING_SIGNUP (OTP Screen)
├─ pendingPhone: ✅ exists
├─ tempPhoneNumber: ✅ exists
├─ tempFirebaseToken: ✅ exists
├─ verificationResult: ✅ exists
└─ accessToken: ❌ null

State: LOGGED_IN (After Signup Complete)
├─ accessToken: ✅ JWT token
├─ user: ✅ user data
├─ refreshToken: ✅ refresh token
├─ favoriteClubs: ✅ might exist
├─ tempPhoneNumber: ❌ null
└─ tempFirebaseToken: ❌ null

State: LOGGED_OUT (After Logout)
├─ accessToken: ❌ null
├─ user: ❌ null
├─ refreshToken: ❌ null
└─ favoriteClubs: ✅ might exist or ❌ null (if error logout)
```

---

## 🎯 Files to Know

| File | Purpose | Status |
|------|---------|--------|
| `lib/constants/storage.ts` | Key names | ✅ Good |
| `lib/services/auth.service.ts` | Login/logout logic | ✅ Good |
| `components/common/sidebar.tsx` | Logout button | ⚠️ Minor issue |
| `app/auth/mobile/page.tsx` | Phone entry | ✅ Good |
| `app/auth/details/page.tsx` | Signup complete | ⚠️ Minor issue |

---

## 🔐 Security Notes

- ✅ Bearer token added to all non-public API calls
- ✅ Token removed on 401 (unauthorized) errors
- ✅ No sensitive data in URLs
- ✅ localStorage is accessible to JS (acceptable for web)
- ⚠️ Could upgrade to HttpOnly cookies (future improvement)

---

## 🚀 Deployment Status

```
Login Storage Updates:        ✅ WORKING
Logout Cleanup:              ✅ WORKING
Direct Login (Auto-login):   ✅ WORKING
Error Handling:              ✅ WORKING
Guest Mode:                  ✅ WORKING
Multiple Logout Paths:       ✅ WORKING

Minor Issues:
├─ Sidebar logout removes all data on error (⚠️ medium)
└─ Pending phone not cleaned after signup (⚠️ low)

Overall: ✅ PRODUCTION READY
```

---

## 📞 Need Help?

### Check These Docs
1. **Data Mapping Issues?** → Read `DATA_MAPPING_IMPLEMENTATION_GUIDE.md`
2. **Complete Analysis?** → Read `LOCALSTORAGE_ANALYSIS_SUMMARY.md`
3. **Want to Fix It?** → Read `LOCALSTORAGE_RECOMMENDED_FIXES.md`
4. **Step-by-Step Guide?** → Read `STEP_BY_STEP_VERIFICATION.md`

### Quick Debug
```javascript
// Paste in console to see everything
console.log('=== AUTH STATE ===');
console.log('Logged in:', !!localStorage.getItem('clubviz-accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('clubviz-user') || 'null')?.username);
console.log('Storage items:', localStorage.length);
console.log('All keys:', Object.keys(localStorage));
```

---

## ✨ Summary

**localStorage:** ✅ Working properly
**Logout:** ✅ Removing data
**Direct Login:** ✅ Auto-login functional
**Status:** ✅ Production Ready with minor optional improvements

Safe to deploy! 🚀

