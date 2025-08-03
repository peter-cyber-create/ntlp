# Backend Enhancement Updates

## Overview
This document outlines the changes made to align the frontend registration form with the backend API and database schema.

## Key Changes Made

### 1. Database Schema Updates (`MYSQL_SETUP.md`)

#### Registrations Table Updates:
- **Changed `institution` → `organization`** to match frontend form field
- **Added `district` field** for location tracking 
- **Updated `registration_type` enum** to match frontend ticket types:
  - `undergrad` (Undergraduate Student)
  - `grad` (Graduate Student) 
  - `local` (Uganda/East Africa Non-Student)
  - `intl` (International Delegate)
  - `online` (Online Participation)
- **Renamed `special_needs` → `special_requirements`** for consistency
- **Added payment tracking fields:**
  - `payment_amount` (DECIMAL)
  - `payment_currency` (VARCHAR)
  - `payment_reference` (VARCHAR)
  - `is_verified` (BOOLEAN)
  - `payment_status` (ENUM: pending, completed, failed, refunded)

### 2. API Route Enhancements (`/app/api/registrations/route.ts`)

#### New Features:
- **Ticket Price Calculation**: Automatic price assignment based on registration type
- **Currency Management**: Proper USD/UGX currency handling
- **Enhanced Validation**: 
  - Registration type validation
  - Email format validation
  - Required field validation with trim checking
- **Better Error Handling**: More descriptive error messages
- **Complete Data Mapping**: Proper field mapping between frontend and database

#### Helper Functions Added:
```typescript
getTicketPrice(registrationType: string): number
getTicketCurrency(registrationType: string): string
```

### 3. Frontend Integration (`/app/register/page.tsx`)

#### API Endpoint Update:
- **Changed from**: `http://localhost:5000/api/users`
- **Changed to**: `/api/registrations`

This ensures the frontend uses the Next.js API route instead of an external server.

### 4. Database Migration Script

Created `database/migration_001_update_registrations.sql` for existing databases:
- Safe column additions and modifications
- Index optimization
- Pricing configuration updates
- Backward compatibility checks

## Field Mapping Reference

| Frontend Form Field | Database Column | Type | Notes |
|-------------------|-----------------|------|-------|
| `first_name` | `first_name` | VARCHAR(100) | Required |
| `last_name` | `last_name` | VARCHAR(100) | Required |
| `email` | `email` | VARCHAR(255) | Required, Unique |
| `phone` | `phone` | VARCHAR(20) | Required |
| `organization` | `organization` | VARCHAR(255) | Required |
| `position` | `position` | VARCHAR(255) | Required |
| `district` | `district` | VARCHAR(100) | Required |
| `registrationType` | `registration_type` | ENUM | Required |
| `special_needs` | `special_requirements` | TEXT | Optional |

## Ticket Types & Pricing

| Frontend ID | Display Name | Price | Currency |
|------------|-------------|--------|----------|
| `undergrad` | Undergraduate Student | 100,000 | UGX |
| `grad` | Graduate Student | 150,000 | UGX |
| `local` | Uganda/East Africa (Non-Student) | 350,000 | UGX |
| `intl` | International Delegate | 300 | USD |
| `online` | Online Participation | 50 | USD |

## Configuration Updates

### Environment Variables
Ensure your `.env.local` includes:
```env
DATABASE_URL="mysql://username:password@localhost:3306/ntlp_conference_2025"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ntlp_conference_2025
DB_USER=your_username
DB_PASSWORD=your_password
```

### Settings Table Additions
New pricing configuration entries added to the `settings` table for dynamic price management.

## Migration Instructions

### For New Installations:
1. Run the full schema from `MYSQL_SETUP.md`
2. All tables and data will be created correctly

### For Existing Installations:
1. Backup your database first:
   ```bash
   mysqldump -u your_user -p ntlp_conference_2025 > backup_$(date +%Y%m%d).sql
   ```

2. Run the migration script:
   ```bash
   mysql -u your_user -p ntlp_conference_2025 < database/migration_001_update_registrations.sql
   ```

## API Response Format

### Successful Registration Response:
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "registrationType": "local",
    "district": "Kampala",
    "organization": "Ministry of Health",
    "payment_amount": 350000,
    "payment_currency": "UGX",
    "status": "pending",
    "payment_status": "pending",
    "registrationDate": "2025-08-02T10:30:00.000Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Missing required fields",
  "missingFields": ["district", "organization"]
}
```

## Testing Checklist

- [ ] Registration form submits to correct API endpoint
- [ ] All form fields map correctly to database
- [ ] Price calculation works for all ticket types
- [ ] Email validation prevents duplicates
- [ ] Required field validation works
- [ ] Database migration runs without errors
- [ ] Admin dashboard displays new fields correctly

## Next Steps

1. **Payment Integration**: Implement payment gateway integration using the new payment fields
2. **Email Notifications**: Set up automated confirmation emails
3. **Admin Dashboard**: Update admin views to display new registration data
4. **Reporting**: Create reports using the enhanced data structure

## Support

If you encounter issues during migration or integration:
1. Check database connection settings
2. Verify all required fields are present in forms
3. Review error logs for detailed error messages
4. Ensure database user has sufficient privileges for table modifications
