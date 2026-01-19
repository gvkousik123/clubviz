# Google Maps Setup Checklist

## ✅ What's Done:
- `.env.local` has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDW9KJ9rak_A4DNRAFT203Z_40bmVMi4IM`
- Component reads from `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 🔴 What You Need To Do:

### Step 1: STOP the dev server
```bash
Ctrl + C  (in terminal)
```

### Step 2: RESTART the dev server
```bash
npm run dev
# or
pnpm dev
```

### Step 3: Verify in Browser Console
Open DevTools (F12) → Console tab and look for:
```
🔍 Google Maps API Key check: { hasKey: true, keyPreview: 'AIzaSyDW...' }
```

### Step 4: If Still Failing - Check API Key Restrictions

1. Go to: https://console.cloud.google.com/google/maps-apis/credentials
2. Find the key: `AIzaSyDW9KJ9rak_A4DNRAFT203Z_40bmVMi4IM`
3. Click on it to edit
4. Look for "Application restrictions" - should be set to "None" or add:
   - `http://localhost:3000/*`
   - `http://localhost/*`
5. Ensure "Maps JavaScript API" is enabled

### Step 5: Clear Browser Cache
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or clear cookies for localhost

## Common Issues:
- ❌ Dev server not restarted → env var not loaded
- ❌ API key restricted to certain referrers → add localhost
- ❌ Maps API not enabled → enable in Cloud Console
- ❌ Browser cache → hard refresh
