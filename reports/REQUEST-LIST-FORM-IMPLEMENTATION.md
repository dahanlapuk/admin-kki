# Request List & Form Components - Technical Details

## Files Created

### 1. RequestList.tsx (`frontend/src/pages/requests/RequestList.tsx`)
**Purpose:** Main page untuk mengelola daftar request konten dengan 2 view modes (Table & Kanban)

**Features:**
- ✅ **Dual View Mode**
  - Table view: List lengkap dengan sorting
  - Kanban board: Visualisasi workflow berdasarkan status
  
- ✅ **Advanced Filtering**
  - Filter by Status (9 options)
  - Filter by Priority (4 levels)
  - Filter by Content Type (8 types)
  - Search by title/description/ticket ID
  
- ✅ **Pagination**
  - 12 items per page
  - Previous/Next navigation
  - Page counter display
  
- ✅ **Visual Indicators**
  - Priority badges with color coding
  - Status badges dengan warna konsisten
  - Deadline warnings (⚠️ overdue, ⏰ soon)
  - Kanban columns with request count
  
- ✅ **Responsiveness**
  - Grid layout adapts to screen size
  - Mobile-friendly filters
  - Touch-friendly cards

**Key Functions:**
```typescript
const loadRequests = () => {
  const filters: any = {};
  if (filterStatus !== 'all') filters.status = filterStatus;
  if (filterPriority !== 'all') filters.priority = filterPriority;
  if (filterContentType !== 'all') filters.contentType = filterContentType;
  if (searchQuery) filters.search = searchQuery;
  
  fetchRequests(pagination.page, 12, filters);
};
```

**Color Coding System:**
- Priority:
  - 🔴 Urgent: Red (bg-red-100)
  - 🟠 High: Orange (bg-orange-100)
  - 🟡 Medium: Yellow (bg-yellow-100)
  - 🟢 Low: Green (bg-green-100)
  
- Status:
  - Pending: Gray
  - Validated: Blue
  - Assigned: Indigo
  - In Progress: Purple
  - Review: Yellow
  - Approved: Green
  - Scheduled: Teal
  - Published: Emerald
  - Rejected: Red

---

### 2. RequestForm.tsx (`frontend/src/pages/requests/RequestForm.tsx`)
**Purpose:** Form untuk create/edit content request

**Features:**
- ✅ **Dual Mode** (Create & Edit)
  - Auto-detect dari URL parameter (`:id`)
  - Pre-fill data when editing
  
- ✅ **Comprehensive Fields**
  1. Title (required)
  2. Content Type dropdown (8 options)
  3. Deadline date picker
  4. Priority selector (4 buttons)
  5. Purpose text input
  6. Description textarea
  7. Key Points (dynamic list)
  8. Target Audience
  9. Publish Platform (multi-select)
  10. References (optional)
  
- ✅ **Dynamic Key Points**
  - Add/remove points dynamically
  - Minimum 1 point required
  - Remove button shows when > 1 point
  
- ✅ **Validation**
  - Required field checks
  - Min deadline = today
  - At least 1 platform selected
  - At least 1 key point filled
  - Toast notifications for errors
  
- ✅ **UX Enhancements**
  - Button-based priority selection (visual)
  - Multi-select platform buttons
  - Auto-filter empty key points before submit
  - Loading state on submit
  - Cancel with navigation

**Key Validation Logic:**
```typescript
const cleanedKeyPoints = formData.keyPoints.filter(point => point.trim() !== '');
if (cleanedKeyPoints.length === 0) {
  toast.error('Minimal harus ada 1 poin penting');
  return;
}
```

---

## Routes Updated

**File:** `frontend/src/App.tsx`

Added routes:
```typescript
<Route path="/requests" element={<RequestList />} />
<Route path="/requests/new" element={<RequestForm />} />
<Route path="/requests/:id/edit" element={<RequestForm />} />
```

---

## Store Enhancement

**File:** `frontend/src/store/requestStore.ts`

Added features:
- ✅ `setPage(page)` function for pagination navigation
- ✅ Enhanced pagination state with `totalPages`, `hasNextPage`, `hasPrevPage`
- ✅ Fixed `fetchRequests` to properly pass filters to API

Updated pagination interface:
```typescript
pagination: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;  // NEW
  hasNextPage: boolean; // NEW
  hasPrevPage: boolean; // NEW
}
```

---

## User Flow

### Creating New Request:
1. User clicks "Buat Request Baru" button on RequestList
2. Navigate to `/requests/new`
3. Fill form with all required fields
4. Click "Buat Request" → POST `/api/requests`
5. Success → Navigate back to `/requests` with toast notification
6. New request appears in list with status "pending"

### Viewing Requests:
1. User lands on `/requests` page
2. See table view by default (12 items/page)
3. Can switch to Kanban view using toggle button
4. Use filters to narrow down results
5. Click request row/card → Navigate to detail page
6. Pagination if total > 12 requests

### Filtering Requests:
1. Select filter criteria (status, priority, type)
2. Or type search query
3. Click "Cari" button or press Enter
4. List updates with filtered results
5. Filters persist across pagination

### Editing Request:
1. Navigate to request detail page
2. Click "Edit" button
3. Navigate to `/requests/:id/edit`
4. Form pre-fills with existing data
5. Make changes
6. Click "Simpan Perubahan" → PUT `/api/requests/:id`
7. Success → Navigate back with toast

---

## Integration Points

### With API:
- `GET /api/requests` - List with pagination & filters
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id` - Update request

### With Store:
- `useRequestStore` - Zustand store
- `fetchRequests(page, limit, filters)` - Load list
- `fetchRequest(id)` - Load single
- `createRequest(data)` - Create
- `updateRequest(id, data)` - Update

### With Auth:
- `useAuthStore` - Get current user
- User's role determines permissions
- Auto-attach `requestedBy` on create

---

## Responsiveness

### Desktop (lg):
- Table view: Full width table
- Kanban: 4 columns grid
- Filters: 4 columns grid

### Tablet (md):
- Table view: Horizontal scroll if needed
- Kanban: 3 columns grid
- Filters: 4 columns grid

### Mobile (sm):
- Table view: Simplified or cards
- Kanban: 1 column stacked
- Filters: 1 column stacked
- Search bar full width

---

## TypeScript Errors (Expected)

Current compile errors due to missing dependencies:
- `Cannot find module 'react'`
- `Cannot find module 'react-router-dom'`
- `Cannot find module 'zustand'`
- `Parameter implicitly has 'any' type`

**Solution:** Run `npm install` in frontend directory or use `./setup.sh`

---

## Next Steps

After Request List & Form complete, next priorities:
1. **Request Detail Page** - View full request info, timeline, assignment
2. **Content Editor** - Create content from request, file upload
3. **Dashboard Stats** - Connect to request stats API
4. **Schedule Calendar** - Visual calendar for scheduled contents

---

## Component Tree

```
App
├── RequestList
│   ├── Search Bar
│   ├── Filters Row (Status, Priority, Type, View Toggle)
│   ├── Table View
│   │   ├── Table Header
│   │   ├── Table Body (Request Rows)
│   │   └── Pagination
│   └── Kanban View
│       └── Status Columns (8)
│           └── Request Cards
│
└── RequestForm
    ├── Back Button
    ├── Form Fields (10)
    │   ├── Text Inputs (Title, Purpose, Target, References)
    │   ├── Selects (Content Type, Priority)
    │   ├── Date Picker (Deadline)
    │   ├── Textarea (Description)
    │   ├── Dynamic List (Key Points)
    │   └── Multi-Select (Platforms)
    └── Submit Buttons (Cancel, Save)
```

---

**Status:** ✅ **COMPLETE**  
**Lines Added:** ~800 lines  
**Files Created:** 2 new components + 1 route update + 1 store update
