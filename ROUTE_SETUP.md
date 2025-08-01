# Web Server to Database Route Setup

This document provides a detailed overview of the main API routes and their flow from the web server (Next.js) to the database (MySQL), including data entry points, validation, and storage.

## 1. Abstract Submission
- **Frontend Entry Point:** `/app/abstracts/page.tsx` (form)
- **API Route:** `/app/api/abstracts/route.ts`
- **DB Layer:** `/lib/mysql.ts`, `/lib/dataManager.ts`
- **Flow:**
  1. User submits abstract form (title, authors, file, etc.)
  2. Form data and file are sent via POST to `/api/abstracts/`
  3. API route validates input, checks file type/size, parses JSON
  4. Data is inserted into MySQL via helper in `lib/dataManager.ts`
  5. File is saved to `/public/uploads/abstracts/` (or similar)
  6. Success/failure response returned to frontend

## 2. Registration
- **Frontend Entry Point:** `/app/register/page.tsx` (form)
- **API Route:** `/app/api/registrations/route.ts`
- **DB Layer:** `/lib/mysql.ts`, `/lib/dataManager.ts`
- **Flow:**
  1. User fills registration form (personal info, payment, etc.)
  2. Data sent via POST to `/api/registrations/`
  3. API route validates, parses, and inserts into MySQL
  4. Confirmation email sent (if enabled)
  5. Success/failure response returned

## 3. Contact Form
- **Frontend Entry Point:** `/app/contact/page.tsx` (form)
- **API Route:** `/app/api/contacts/route.ts`
- **DB Layer:** `/lib/mysql.ts`, `/lib/dataManager.ts`
- **Flow:**
  1. User submits contact form
  2. Data sent via POST to `/api/contacts/`
  3. API route validates and stores in MySQL
  4. Optional: notification email sent
  5. Success/failure response returned

## 4. Admin Dashboard
- **Frontend Entry Point:** `/app/admin/dashboard/page.tsx`
- **API Routes:** `/app/api/admin/route.ts`, `/app/api/abstracts/route.ts`, `/app/api/registrations/route.ts`
- **DB Layer:** `/lib/mysql.ts`, `/lib/dataManager.ts`
- **Flow:**
  1. Admin views dashboard, requests data (GET)
  2. API routes query MySQL for abstracts, registrations, contacts
  3. Data returned for display, export, or management

## 5. Database Connection
- **Config:** `/lib/mysql.ts` (MySQL connection pool)
- **Schema:** `/database/schema.sql`
- **Security:**
  - All API routes validate and sanitize input
  - File uploads restricted by type/size
  - Authentication for admin routes via NextAuth.js

## 6. File Uploads
- **Location:** `/public/uploads/abstracts/`
- **Handled by:** API route `/api/abstracts/route.ts`
- **Validation:** File type (PDF/DOC/DOCX), size (<2MB)

## 7. Error Handling
- All API routes return structured JSON responses
- Frontend displays toast notifications for errors/success

---

**For further details, see the respective API route files and database schema.**
