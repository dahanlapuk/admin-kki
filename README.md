# Dashboard Admin KKI - GMNI DPC Depok

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-development-yellow.svg)

Dashboard manajemen konten untuk Kantor Komunikasi dan Informasi (KKI) DPC GMNI Depok.

## 📋 Deskripsi

Dashboard ini adalah sistem terintegrasi untuk mengelola workflow produksi konten KKI, dari request hingga publikasi.

**Fitur Utama:**
- 📝 Content Request Management
- 🎨 Content Production & Versioning
- 📅 Schedule & Publishing
- 📦 Archive & Portfolio
- 👥 User & Role Management
- 📊 Analytics & Reporting

## 🏗️ Arsitektur

```
admin-kki/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd admin-kki

# Install dependencies
npm run install:all

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files dengan konfigurasi Anda
```

### Development

```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)  
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- API Docs: http://localhost:5001/api/docs

## 📚 Dokumentasi

- [Progress Reports](./docs/progress-reports/) - Laporan per fase development
- [API Documentation](./docs/api/) - Endpoint specifications
- [User Manual](./docs/user-manual/) - Panduan penggunaan
- [Technical Docs](./docs/technical/) - Architecture & design

## 🔧 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- ShadCN UI
- Zustand
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- Multer

## 👥 Team

**Developer:** Hexadev Technologies  
**Collaboration:** Hexadev Technologies x KKI DPC GMNI Depok  
**Users:** 5 core team members

## 📄 License

Private - DPC GMNI Depok

## 📞 Support

Untuk bantuan atau pertanyaan, hubungi:
- Email: [sekretariatgmnidpcdepok@gmail.com] [hexadevtechnologies@gmail.com]
- Website: [dpcgmnidepok.vercel.app]

---

**Status:** 🚧 Under Development  
**Last Update:** 2025-11-22
