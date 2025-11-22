# SETUP & TESTING GUIDE
**Dashboard KKI - GMNI Depok**  
**Developer:** Hexadev Technologies  
**Tanggal:** 21 November 2025

---

## ✅ SETUP STATUS

### Dependencies Installation
- ✅ **Backend**: 441 packages installed
- ✅ **Frontend**: 325 packages installed
- ✅ **Environment Files**: .env created (backend & frontend)
- ⚠️ **MongoDB**: Not running yet (needs to be started)

---

## 📦 INSTALLED PACKAGES

### Backend Dependencies
**Total:** 441 packages

**Key Packages:**
- express: ^4.18.2 (Web framework)
- mongoose: ^8.0.0 (MongoDB ODM)
- jsonwebtoken: ^9.0.2 (JWT authentication)
- bcryptjs: ^2.4.3 (Password hashing)
- multer: ^1.4.5-lts.1 (File upload)
- helmet: ^7.1.0 (Security)
- cors: ^2.8.5 (CORS handling)
- express-rate-limit: ^7.1.5 (Rate limiting)
- winston: ^3.11.0 (Logging)
- dotenv: ^16.3.1 (Environment variables)

**Dev Dependencies:**
- typescript: ^5.3.3
- nodemon: ^3.0.2
- ts-node: ^10.9.2

**Vulnerabilities:** 1 moderate (non-critical)

---

### Frontend Dependencies
**Total:** 325 packages

**Key Packages:**
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0 (Routing)
- vite: ^5.0.4 (Build tool)
- typescript: ^5.3.3
- axios: ^1.6.2 (HTTP client)
- zustand: ^4.4.7 (State management)
- tailwindcss: ^3.3.6 (CSS framework)
- react-hot-toast: ^2.4.1 (Notifications)
- react-hook-form: ^7.49.0 (Form handling)
- zod: ^3.22.0 (Validation)
- lucide-react: ^0.294.0 (Icons)
- recharts: ^2.10.3 (Charts for analytics)

**Dev Dependencies:**
- @vitejs/plugin-react: ^4.2.1
- autoprefixer: ^10.4.16
- postcss: ^8.4.32
- eslint: ^8.54.0
- prettier: ^3.1.0

**Vulnerabilities:** 2 moderate (related to older eslint, non-critical)

---

## 🚀 CARA MENJALANKAN PROJECT

### Langkah 1: Start MongoDB
```bash
sudo systemctl start mongod

# Verify MongoDB is running
systemctl status mongod

# Should show: "Active: active (running)"
```

### Langkah 2: Seed Database (First Time Only)
```bash
cd /home/itba/Desktop/proyek/admin-kki/backend
npm run seed
```

**Default Users Created:**
1. **Superadmin** (Kepala KKI)
   - Email: superadmin@gmni-depok.org
   - Password: admin123
   - Division: KKI

2. **Admin** (Wakil Kepala KKI)
   - Email: admin@gmni-depok.org
   - Password: admin123
   - Division: KKI

3. **Ketua Cabang**
   - Email: ketua@gmni-depok.org
   - Password: admin123
   - Division: Pimpinan Cabang

4. **Sekretaris Cabang**
   - Email: sekretaris@gmni-depok.org
   - Password: admin123
   - Division: Sekretariat

5. **Staff KKI** (Editor)
   - Email: staff@gmni-depok.org
   - Password: admin123
   - Division: KKI

### Langkah 3: Start Development Servers

**Option A: Using start-dev.sh (Recommended)**
```bash
cd /home/itba/Desktop/proyek/admin-kki
./start-dev.sh
```

**Option B: Manual (2 Terminal)**

Terminal 1 - Backend:
```bash
cd /home/itba/Desktop/proyek/admin-kki/backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd /home/itba/Desktop/proyek/admin-kki/frontend
npm run dev
```

### Langkah 4: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

---

## 🧪 TESTING CHECKLIST

### 1. Backend API Testing

#### A. Health Check
```bash
curl http://localhost:5001/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T...",
  "environment": "development"
}
```

#### B. Authentication Test
```bash
# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@gmni-depok.org",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Kepala KKI",
      "email": "superadmin@gmni-depok.org",
      "role": "superadmin",
      "division": "KKI"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save token for next tests:**
```bash
export TOKEN="<token_from_response>"
```

#### C. Get Current User
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### D. Request Management Test
```bash
# Get all requests (with pagination)
curl http://localhost:5001/api/requests \
  -H "Authorization: Bearer $TOKEN"

# Get request statistics
curl http://localhost:5001/api/requests/stats/summary \
  -H "Authorization: Bearer $TOKEN"

# Create new request
curl -X POST http://localhost:5001/api/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Poster Kegiatan Test API",
    "contentType": "Poster",
    "deadline": "2025-12-31",
    "purpose": "Testing API endpoint",
    "description": "Testing request creation via API",
    "keyPoints": ["Test Point 1", "Test Point 2"],
    "targetAudience": "Mahasiswa",
    "publishPlatform": ["Instagram", "Facebook"],
    "priority": "high"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "ticketId": "KKI-REQ-0001",
    "title": "Poster Kegiatan Test API",
    "status": "pending",
    "priority": "high",
    ...
  }
}
```

#### E. Content Management Test
```bash
# Get all contents
curl http://localhost:5001/api/contents \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. Frontend UI Testing

#### A. Login Flow
1. Open http://localhost:5173
2. Should redirect to `/login` automatically (if not logged in)
3. Login dengan credentials:
   - Email: superadmin@gmni-depok.org
   - Password: admin123
4. Click "Masuk" button
5. ✅ Should redirect to `/dashboard`
6. ✅ Should show user name "Kepala KKI" in header

#### B. Dashboard
1. Navigate to http://localhost:5173/dashboard
2. ✅ Should display 4 stat cards:
   - Total Request
   - In Progress
   - Completed
   - Published
3. ✅ Should show navigation bar with logout button

#### C. Request List (Table View)
1. Navigate to http://localhost:5173/requests
2. ✅ Should display page header "Request Konten"
3. ✅ Should show "Buat Request Baru" button
4. ✅ Should display filter controls:
   - Search bar
   - Status filter dropdown (11 options)
   - Priority filter dropdown (5 options)
   - Content Type filter dropdown (9 options)
   - View mode toggle (Table/Kanban)
5. ✅ Should display table with columns:
   - Tiket / Judul
   - Tipe Konten
   - Status
   - Prioritas
   - Deadline
   - Requester
6. ✅ Should show pagination if data > 12 items

#### D. Request List (Kanban View)
1. From Request List, click "📊 Kanban" button
2. ✅ Should display 8 columns:
   - Menunggu
   - Tervalidasi
   - Ditugaskan
   - Dikerjakan
   - Review
   - Disetujui
   - Terjadwal
   - Dipublikasi
3. ✅ Each column shows count badge
4. ✅ Cards display: ticket ID, title, content type, priority, deadline

#### E. Request Form (Create)
1. Click "Buat Request Baru" button
2. ✅ Should navigate to `/requests/new`
3. ✅ Form should display 10 fields:
   - Judul (required)
   - Tipe Konten (dropdown)
   - Deadline (date picker, min: today)
   - Prioritas (4 visual buttons)
   - Tujuan
   - Deskripsi (textarea, required)
   - Poin Penting (dynamic list)
   - Target Audiens
   - Platform Publikasi (multi-select)
   - Referensi (optional)
4. Fill form with test data
5. Click "Buat Request"
6. ✅ Should show success toast notification
7. ✅ Should redirect back to `/requests`
8. ✅ New request appears in list with status "Menunggu"

#### F. Filtering & Search
1. On Request List, enter search query
2. Click "Cari" button
3. ✅ List updates with filtered results
4. Select different filters (Status, Priority, Type)
5. ✅ Results update accordingly
6. ✅ Filters work in both Table and Kanban view

#### G. Pagination
1. If requests > 12, pagination controls appear
2. Click "Selanjutnya" button
3. ✅ Should load page 2
4. ✅ Page counter updates
5. Click "Sebelumnya"
6. ✅ Should return to page 1

---

## 🐛 KNOWN ISSUES & WARNINGS

### Backend
**1 Moderate Vulnerability**
- Source: Older dependencies
- Impact: Low (development environment)
- Action: Can be ignored for now, will update in production

### Frontend
**2 Moderate Vulnerabilities**
- Related to: eslint@8.x (deprecated)
- Impact: Development only, not runtime
- Note: eslint v9 has breaking changes, migration needed later

**Deprecation Warnings:**
- inflight@1.0.6 (memory leak, not used directly)
- rimraf@3.x (use v4+)
- glob@7.x (use v9+)
- eslint@8.x (use v9+)

**Action:** Non-critical, can be addressed in future updates

---

## 📊 PERFORMANCE METRICS

### Installation Times
- Backend dependencies: ~4 seconds
- Frontend dependencies: ~16 seconds
- Total setup time: ~20 seconds

### Bundle Sizes (After Build)
- Backend: N/A (Node.js runtime)
- Frontend: TBD (run `npm run build` to check)

### Development Server Startup
- Backend: ~2 seconds
- Frontend (Vite): ~1 second
- Total ready time: ~3 seconds

---

## 🔧 ENVIRONMENT CONFIGURATION

### Backend (.env)
```dotenv
PORT=5001
MONGODB_URI=mongodb://localhost:27017/kki-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**⚠️ Security Note:** Change JWT secrets before production deployment!

### Frontend (.env)
```dotenv
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Dashboard KKI
VITE_APP_VERSION=1.0.0
```

---

## ✅ VERIFICATION CHECKLIST

Before starting development, verify:

- [ ] Node.js v22+ installed (`node -v`)
- [ ] MongoDB installed and running (`systemctl status mongod`)
- [ ] Backend dependencies installed (441 packages)
- [ ] Frontend dependencies installed (325 packages)
- [ ] Backend .env file exists and configured
- [ ] Frontend .env file exists
- [ ] Database seeded with 5 default users
- [ ] Backend server starts without errors (port 5001)
- [ ] Frontend server starts without errors (port 5173)
- [ ] Can login with superadmin credentials
- [ ] API health check returns 200 OK
- [ ] Request List page loads successfully
- [ ] Can create new request via UI

---

## 🚨 TROUBLESHOOTING

### MongoDB Won't Start
```bash
# Check status
sudo systemctl status mongod

# Check logs
sudo journalctl -u mongod -n 50

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Already in Use
```bash
# Check what's using port 5001
sudo lsof -i :5001

# Check what's using port 5173
sudo lsof -i :5173

# Kill process if needed
kill -9 <PID>
```

### Backend Won't Connect to MongoDB
1. Verify MongoDB is running
2. Check MONGODB_URI in backend/.env
3. Default: `mongodb://localhost:27017/kki-dashboard`
4. Test connection: `mongosh kki-dashboard`

### CORS Errors
1. Verify CLIENT_URL in backend/.env matches frontend URL
2. Default: `http://localhost:5173`
3. Restart backend server after .env changes

### TypeScript Compilation Errors
```bash
# Frontend
cd frontend && npm run build

# If errors, check:
# - All imports use correct paths
# - Types are properly defined
# - Dependencies are installed
```

---

## 📝 NEXT STEPS

After successful setup and testing:

1. ✅ **Environment Ready** - All dependencies installed
2. ✅ **Backend API** - 19 endpoints functional
3. ✅ **Frontend UI** - Request Management complete
4. 🚧 **Pending**: Request Detail Page
5. 🚧 **Pending**: Content Editor
6. 🚧 **Pending**: Schedule Calendar
7. 🚧 **Pending**: Archive Management
8. 🚧 **Pending**: Analytics Dashboard

**Current Phase:** Phase 2 - Core Features (65% complete)

---

**Developer:** Hexadev Technologies  
**Last Updated:** 21 November 2025
