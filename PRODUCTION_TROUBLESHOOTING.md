# Production Server (172.27.0.9) Troubleshooting

## Quick Fix for Form Submission Issues

### 1. Run Diagnostic Script
```bash
cd /path/to/your/app
node debug-production.js
```

### 2. Common Issues & Solutions

**Database Connection Failed:**
```bash
# Check MySQL service
systemctl status mysql
# Test connection manually
mysql -h 172.27.0.9 -u conf_user -ptoor conf
```

**Missing Database Columns:**
```bash
# Run complete database setup
mysql -h 172.27.0.9 -u root -p < database/setup.sql
```

**Environment Variables Missing:**
```bash
# Ensure .env.production exists with:
NODE_ENV=production
DB_HOST=172.27.0.9
DB_USER=conf_user
DB_PASSWORD=toor
DB_NAME=conf
NEXT_PUBLIC_APP_URL=http://172.27.0.9:3000
```

**File Upload Permissions:**
```bash
mkdir -p public/uploads/abstracts
chmod 755 public/uploads/abstracts
```

### 3. Test Registration
```bash
# Test API endpoint
curl -X POST http://172.27.0.9:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","registrationType":"local"}'
```

### 4. Production Deployment Steps
```bash
# 1. Set up database
mysql -h 172.27.0.9 -u root -p < database/setup.sql

# 2. Install dependencies
npm install --production

# 3. Build application  
npm run build

# 4. Start production server
npm start

# 5. Test the application
curl http://172.27.0.9:3000/register
```

### 5. Monitor Logs
```bash
# If using PM2
pm2 logs ntlp-conference

# If using direct npm start
tail -f ~/.pm2/logs/ntlp-conference-out.log
```

**Most Common Issue:** Database schema mismatch - the API expects new columns that don't exist in the database. Solution: Run the complete database setup script.
