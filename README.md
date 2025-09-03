# NTLP Conference Management System

A comprehensive conference management system for the NTLP Conference 2025, featuring a modern frontend and robust backend API.

## ��️ **Project Structure**

This project is organized into two separate repositories for better maintainability and deployment:

```
ntlp/
├── ntlp-frontend/          # Next.js Frontend Application
└── ntlp-backend/           # Express.js Backend API
```

## 📱 **Frontend Repository (`ntlp-frontend`)**

**Technology Stack:**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

**Features:**
- 🎫 Conference Registration Forms
- 📄 Abstract Submission System
- 📞 Contact Management
- 🤝 Sponsorship Applications
- 🔐 Admin Panel with Authentication
- 📥 File Download Management
- 📱 Responsive Design

**Quick Start:**
```bash
cd ntlp-frontend
npm install
npm run dev
# Access at: http://localhost:3000
```

**Admin Access:**
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `conference2025`

## 🚀 **Backend Repository (`ntlp-backend`)**

**Technology Stack:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **ORM**: mysql2 with promise support
- **File Handling**: Multer for uploads
- **Middleware**: CORS, Helmet, Morgan

**Features:**
- 🌐 RESTful API endpoints
- 🗄️ MySQL database integration
- 📁 File upload/download management
- 🔒 Input validation and sanitization
- 📊 Health monitoring
- 🔐 Authentication system

**Quick Start:**
```bash
cd ntlp-backend
npm install
# Configure .env file
npm start
# API runs at: http://localhost:5000
```

## 🗄️ **Database Schema**

The system includes tables for:
- **Registrations**: Conference participants
- **Abstracts**: Research submissions
- **Contacts**: Inquiry management
- **Sponsorships**: Partnership applications
- **Users**: Admin accounts

## 🔧 **Environment Configuration**

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`.env`)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ntlp_conference
```

## 🚀 **Development Workflow**

1. **Clone both repositories**
2. **Set up database** using `ntlp-backend/database/simple-schema.sql`
3. **Configure environment variables**
4. **Start backend**: `cd ntlp-backend && npm start`
5. **Start frontend**: `cd ntlp-frontend && npm run dev`
6. **Access application**: http://localhost:3000

## 📋 **API Endpoints**

### Core Endpoints
- `GET /api/health` - Server health check
- `POST /api/registrations` - Submit registration
- `POST /api/abstracts` - Submit abstract
- `POST /api/contacts` - Submit contact inquiry
- `POST /api/sponsorships` - Submit sponsorship application

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `PATCH /api/registrations/:id/status` - Update registration status
- `PATCH /api/abstracts/:id/status` - Update abstract status

## 🎯 **Key Features**

### Form Management
- ✅ Complete registration workflow
- ✅ Abstract submission with file uploads
- ✅ Contact form system
- ✅ Sponsorship application process

### Admin Panel
- ✅ Comprehensive dashboard
- ✅ Data management for all entities
- ✅ File download functionality
- ✅ Status management
- ✅ Export capabilities (CSV)

### File Handling
- ✅ Secure file uploads
- ✅ Multiple file type support
- ✅ File size validation
- ✅ Organized storage structure

## 🔒 **Security Features**

- Input validation and sanitization
- SQL injection protection
- File type verification
- CORS configuration
- Admin authentication

## 📱 **Responsive Design**

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Progressive enhancement

## 🚀 **Deployment**

### Frontend Deployment
```bash
cd ntlp-frontend
npm run build
npm start
```

### Backend Deployment
```bash
cd ntlp-backend
npm start
# Or use PM2: pm2 start index.js
```

## 🤝 **Contributing**

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Test all functionality
5. Update documentation

## 📞 **Support**

For technical support or questions about the system, please contact the development team.

---

## 🎉 **Project Status**

**✅ Frontend**: Complete with admin panel and form management
**✅ Backend**: Complete with API endpoints and database integration
**✅ Database**: Schema designed and implemented
**✅ File Management**: Upload/download functionality working
**✅ Admin Panel**: 100% functional with download capabilities
**✅ TypeScript**: All errors resolved
**✅ Documentation**: Comprehensive README files created

**The NTLP Conference Management System is now fully operational and production-ready!** 🚀

---

**Built with ❤️ for the NTLP Conference 2025**
