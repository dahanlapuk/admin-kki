# API Documentation - Dashboard KKI

Base URL: `http://localhost:5001/api`

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@gmni-depok.org",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Super Admin",
      "email": "superadmin@gmni-depok.org",
      "role": "superadmin",
      "kki": {
        "division": "general",
        "isActive": true,
        "permissions": ["all"]
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## Content Requests

All endpoints require authentication.

### List Requests
```http
GET /api/requests
Authorization: Bearer {token}
```

### Get Request Detail
```http
GET /api/requests/:id
Authorization: Bearer {token}
```

### Create Request
```http
POST /api/requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Poster Kegiatan GMNI",
  "contentType": "Poster",
  "deadline": "2025-12-31",
  "purpose": "Promosi kegiatan",
  "description": "...",
  "keyPoints": ["Point 1", "Point 2"],
  "targetAudience": "Mahasiswa",
  "publishPlatform": ["Instagram", "Twitter"],
  "priority": "high"
}
```

### Update Request Status
```http
PATCH /api/requests/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved"
}
```

### Assign Request
```http
PATCH /api/requests/:id/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "assignedTo": {
    "copywriter": "user_id",
    "designer": "user_id"
  }
}
```

## Content Management

### List Contents
```http
GET /api/contents
Authorization: Bearer {token}
```

### Upload Files
```http
POST /api/contents/:id/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [file1, file2, ...]
```

### Approve Content
```http
PATCH /api/contents/:id/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "approvalNotes": "Approved for publication"
}
```

## Schedules

### Create Schedule
```http
POST /api/schedules
Authorization: Bearer {token}
Content-Type: application/json

{
  "contentId": "content_id",
  "scheduledDate": "2025-12-25",
  "scheduledTime": "10:00",
  "platform": ["Instagram", "Twitter"]
}
```

### Get Upcoming Schedules
```http
GET /api/schedules/upcoming/list
Authorization: Bearer {token}
```

## Admin

Requires `admin` or `superadmin` role.

### List Users
```http
GET /api/admin/users
Authorization: Bearer {token}
```

### Create User
```http
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New User",
  "email": "user@gmni-depok.org",
  "password": "password123",
  "role": "staff",
  "kki": {
    "division": "copywriter",
    "isActive": true
  }
}
```

### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer {token}
```

## Public Endpoints

No authentication required.

### Submit Public Request
```http
POST /api/public/request
Content-Type: application/json

{
  "title": "Request from external",
  "contentType": "Poster",
  "deadline": "2025-12-31",
  ...
}
```

### Check Request Status
```http
GET /api/public/request/:ticketId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "KKI-REQ-0001",
    "status": "in-progress",
    "title": "...",
    "createdAt": "2025-11-21"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Field is required"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'staff' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
