# Story Upload Implementation Guide

## Overview
The story upload feature allows admins/superadmins to upload images and videos with captions. Stories are Instagram-like features that expire after 24 hours.

---

## Files Required for Story Upload Feature

### 1. **Frontend Pages/Components**

#### [app/admin/upload-story/page.tsx](app/admin/upload-story/page.tsx)
- **Purpose**: Main story upload interface
- **Features**:
  - File selection (images: JPG, JPEG, PNG, GIF, WEBP, BMP up to 10MB)
  - Video support (MP4, MOV, AVI, MKV, WEBM, 3GP up to 50MB)
  - Preview before upload
  - Caption input (max 500 chars)
  - File info display (name, size, type)
  - Upload progress indicator
- **Key Functions**:
  - `handleFileSelect()` - Validates file type and size
  - `handleUpload()` - Converts file to base64 and uploads
  - `fileToBase64()` - Utility to convert file to base64 string

#### [app/admin/add-story/page.tsx](app/admin/add-story/page.tsx)
- **Purpose**: Story creation from gallery/camera
- **Features**:
  - Camera upload option
  - Gallery image selection
  - Full image preview with tagging
  - Category selection
  - Recent images toggle

#### [app/admin/my-stories/page.tsx](app/admin/my-stories/page.tsx)
- **Purpose**: View uploaded stories
- **Features**:
  - List all user's stories
  - Delete stories
  - View story statistics

---

### 2. **Story Components**

#### [components/story/index.ts](components/story/index.ts)
- Exports all story-related components

#### [components/story/story-card.tsx](components/story/story-card.tsx)
- Displays story card in feed
- Shows story thumbnail and metadata

#### [components/story/story-viewer.tsx](components/story/story-viewer.tsx)
- Full-screen story viewer
- Progress bar for viewing duration
- Next/previous navigation
- View tracking

#### [components/story/stories-section.tsx](components/story/stories-section.tsx)
- Story feed section
- Pagination support

---

### 3. **Service Layer**

#### [lib/services/story.service.ts](lib/services/story.service.ts)
- **Purpose**: All API calls for stories
- **Key Methods**:

```typescript
// Upload story from base64 data
uploadStory(data: CreateStoryRequest): Promise<ApiResponse<Story>>
  - Request: { base64Data: string, caption?: string, fileName: string }
  - Endpoint: POST /story/stories/upload

// Get authenticated user's stories
getMyStories(): Promise<ApiResponse<Story[]>>
  - Endpoint: GET /story/stories/my-stories

// Get all active stories (feed)
getStories(page, size): Promise<ApiResponse<StoryListResponse>>
  - Endpoint: GET /story/stories?page={page}&size={size}

// Delete a story
deleteStory(storyId): Promise<ApiResponse<void>>
  - Endpoint: DELETE /story/stories/{storyId}

// Mark story as viewed
viewStory(storyId): Promise<ApiResponse<void>>
  - Endpoint: POST /story/stories/{storyId}/view

// Get story statistics
getStoryStats(): Promise<ApiResponse<StoryStats>>
  - Endpoint: GET /story/stories/stats

// Get single story
getStoryById(storyId): Promise<ApiResponse<Story>>

// Update story
updateStory(storyId, data): Promise<ApiResponse<Story>>
  - Request: { caption: string }

// Get stories for specific club
getClubStories(clubId): Promise<ApiResponse<Story[]>>
```

---

### 4. **Custom Hooks**

#### [hooks/use-stories.ts](hooks/use-stories.ts)
- **Purpose**: Story management hook
- **State**:
  ```typescript
  stories: Story[]              // All stories in feed
  myStories: Story[]            // User's uploaded stories
  stats: StoryStats | null      // User's story statistics
  loading: boolean              // Loading state
  error: string | null          // Error message
  pagination: {                 // Pagination info
    page: number
    hasNext: boolean
    totalPages: number
  }
  ```

- **Functions**:
  ```typescript
  fetchStories(page?, size?, append?)     // Fetch feed stories
  fetchMyStories()                        // Fetch user's stories
  fetchStats()                            // Fetch story statistics
  uploadStory(data)                       // Upload new story
  removeStory(storyId)                    // Delete story
  viewStory(storyId)                      // Mark as viewed
  ```

---

### 5. **Utilities**

#### [lib/image-utils.ts](lib/image-utils.ts)
- **Key Function**:
  ```typescript
  fileToBase64(file: File): Promise<string>
  ```
  - Converts File object to base64 string
  - Removes data URI prefix
  - Returns clean base64 data

#### [lib/api-client.ts](lib/api-client.ts)
- API client instance
- Request/response interceptors
- Error handling

---

### 6. **Type Definitions**

#### [lib/api-types.ts](lib/api-types.ts)
- **Story Interface**:
  ```typescript
  interface Story {
    id: string
    clubId: string
    fileName: string
    caption?: string
    createdAt: string
    expiresAt: string
    viewCount: number
    // ... other fields
  }
  ```

#### [lib/services/story.service.ts](lib/services/story.service.ts)
- **CreateStoryRequest**:
  ```typescript
  {
    base64Data: string      // Base64 encoded file data
    caption?: string        // Optional caption (max 500 chars)
    fileName: string        // Original file name
  }
  ```

- **StoryStats**:
  ```typescript
  {
    totalStories: number
    totalViews: number
    averageViews: number
    activeStories: number
  }
  ```

- **StoryListResponse**:
  ```typescript
  {
    content: Story[]
    currentPage: number
    totalPages: number
    totalElements: number
    hasNext: boolean
  }
  ```

---

### 7. **Other Supporting Files**

#### [lib/api-client.ts](lib/api-client.ts)
- HTTP client (axios-based)
- Request/response interceptors
- Error handling

#### [hooks/use-toast.ts](hooks/use-toast.ts)
- Toast notifications for user feedback

#### [hooks/use-auth-guard.ts](hooks/use-auth-guard.ts)
- Authentication check

---

## Story Upload Flow

### Step-by-Step Process

```
1. User navigates to /admin/upload-story
   ↓
2. Selects file (image/video)
   ├── Validates file type
   ├── Validates file size (10MB for images, 50MB for videos)
   └── Generates preview
   ↓
3. Adds caption (optional, max 500 chars)
   ↓
4. Clicks "Upload Story" button
   ├── Calls fileToBase64(file) → converts to base64
   ├── Creates CreateStoryRequest object
   └── Calls uploadStory() hook
   ↓
5. Hook calls StoryService.uploadStory()
   ├── Makes POST /story/stories/upload API call
   ├── Sends: { base64Data, caption, fileName }
   └── Receives: Story object
   ↓
6. On success:
   ├── Shows success toast
   ├── Refreshes myStories
   ├── Clears form
   └── Navigates to /admin/my-stories
   ↓
7. On error:
   └── Shows error toast
```

---

## API Endpoints Used

### Upload Story
```
POST /story/stories/upload
Headers: Authorization: Bearer <token>
Body: {
  base64Data: string,
  caption?: string,
  fileName: string
}
Response: { success: true, data: Story }
```

### Get My Stories
```
GET /story/stories/my-stories
Headers: Authorization: Bearer <token>
Response: Story[] or { success: true, data: Story[] }
```

### Get Stories Feed
```
GET /story/stories?page=0&size=20
Headers: Authorization: Bearer <token>
Response: {
  content: Story[],
  currentPage: number,
  totalPages: number,
  hasNext: boolean
}
```

### Delete Story
```
DELETE /story/stories/{storyId}
Headers: Authorization: Bearer <token>
Response: { success: true }
```

### View Story (Track View)
```
POST /story/stories/{storyId}/view
Headers: Authorization: Bearer <token>
Response: { success: true }
```

### Get Story Stats
```
GET /story/stories/stats
Headers: Authorization: Bearer <token>
Response: {
  totalStories: number,
  totalViews: number,
  averageViews: number,
  activeStories: number
}
```

---

## File Size & Type Constraints

### Images
- **Supported Formats**: JPG, JPEG, PNG, GIF, WEBP, BMP
- **Max Size**: 10 MB
- **Preview**: Generated before upload

### Videos
- **Supported Formats**: MP4, MOV, AVI, MKV, WEBM, 3GP
- **Max Size**: 50 MB
- **Preview**: Video thumbnail shown

---

## Story Expiration

- **Duration**: 24 hours
- **Automatic Cleanup**: Backend removes expired stories
- **Manual Cleanup**: `StoryService.cleanupStories()` endpoint available

---

## Key Implementation Details

### 1. File to Base64 Conversion
```typescript
// In lib/image-utils.ts
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64String = result.split(',')[1] || result;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(new Error(`Failed to convert file to base64: ${error}`));
    };
    reader.readAsDataURL(file);
  });
}
```

### 2. Upload Flow in Hook
```typescript
// In hooks/use-stories.ts
const uploadStory = useCallback(async (data: CreateStoryRequest) => {
  setLoading(true);
  try {
    const response = await StoryService.uploadStory(data);
    const isSuccess = response?.success || response?.id || response?.fileName;
    
    if (isSuccess) {
      fetchMyStories(); // Refresh stories
      return response.data || response;
    } else {
      throw new Error(response.message || 'Failed to upload story');
    }
  } catch (err: any) {
    toast({ title: 'Error', description: err.message });
    return null;
  } finally {
    setLoading(false);
  }
}, [fetchMyStories, toast]);
```

### 3. Component Integration
```typescript
// In app/admin/upload-story/page.tsx
const { uploadStory, loading } = useStories();

const handleUpload = async () => {
  const base64Data = await fileToBase64(selectedFile);
  
  const result = await uploadStory({
    base64Data,
    caption: caption.trim() || undefined,
    fileName: selectedFile.name
  });
  
  if (result) {
    toast({ title: 'Success', description: 'Story uploaded!' });
    router.replace('/admin/my-stories');
  }
};
```

---

## Integration Checklist

- [ ] Backend API endpoint `/story/stories/upload` is implemented
- [ ] Backend validates file type and size
- [ ] Backend converts base64 to file storage
- [ ] Backend sets 24-hour expiration
- [ ] Backend returns Story object on success
- [ ] Authentication middleware protects endpoints
- [ ] Authorization checks role (Admin/SuperAdmin only)
- [ ] Toast notifications configured
- [ ] Loading states handled properly
- [ ] Error handling and user feedback

---

## Testing Story Upload

### Manual Testing Steps

1. **Navigate** to `/admin/upload-story`
2. **Select** an image file (JPG, PNG, etc.)
3. **View** preview
4. **Add** optional caption
5. **Click** "Upload Story"
6. **Verify** success toast and navigation to `/admin/my-stories`
7. **Check** story appears in list
8. **View** story in feed at `/`

### Edge Cases to Test

- File too large (>10MB for images, >50MB for videos)
- Invalid file type (e.g., .pdf, .txt)
- Network error during upload
- Cancel upload mid-process
- Multiple stories in quick succession
- Story expiration after 24 hours

---

## Troubleshooting

### Story Upload Fails
- Check API endpoint: `POST /story/stories/upload`
- Verify authentication token is valid
- Check file size and type constraints
- Review backend logs for base64 decoding errors

### Stories Not Appearing in Feed
- Check `fetchStories()` pagination
- Verify user's stories appear in `getMyStories()`
- Check story expiration status
- Review API response format (wrapped vs unwrapped)

### Preview Not Showing
- Verify `fileToBase64()` completes successfully
- Check preview state updates
- Review FileReader error handling

---

## Related Features

- **Story Viewer**: [components/story/story-viewer.tsx](components/story/story-viewer.tsx)
- **Story Feed**: [components/story/stories-section.tsx](components/story/stories-section.tsx)
- **My Stories Page**: [app/admin/my-stories/page.tsx](app/admin/my-stories/page.tsx)
- **Add Story from Gallery**: [app/admin/add-story/page.tsx](app/admin/add-story/page.tsx)

---

## API Documentation Reference

See [lib/services/stories-apis.json](lib/services/stories-apis.json) for complete API specifications.
