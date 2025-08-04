# Manual Fresh Deployment Steps for 172.27.0.9

**Run these commands on the 172.27.0.9 server (after SSH connection):**

## Step 1: Complete Cleanup

```bash
# Stop all running processes
sudo pkill -f "next" 2>/dev/null || true
sudo pkill -f "node" 2>/dev/null || true
sudo pkill -f "npm" 2>/dev/null || true

# Check if any processes are still running
ps aux | grep -E "(node|next|npm)" | grep -v grep

# Force kill any remaining processes (if needed)
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
```

## Step 2: Remove Application Files

```bash
# Navigate to project directory
cd /home/peter/Desktop/dev

# Backup important data (optional)
mkdir -p /tmp/ntlp-backup-$(date +%Y%m%d_%H%M%S)
cp -r ntlp/public/uploads/* /tmp/ntlp-backup-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Remove the entire application directory
rm -rf ntlp

# Verify removal
ls -la
```

## Step 3: Database Cleanup (Optional)

**Option A: Keep existing data**
```bash
# Skip this step to preserve registrations and other data
echo "Keeping existing database data"
```

**Option B: Fresh database**
```bash
# Reset database completely
mysql -u root -p << 'EOF'
DROP DATABASE IF EXISTS conf;
DROP USER IF EXISTS 'conf_user'@'localhost';
DROP USER IF EXISTS 'conf_user'@'%';
FLUSH PRIVILEGES;
EOF
```

## Step 4: Fresh Code Clone

```bash
# Clone fresh code from GitHub
cd /home/peter/Desktop/dev
git clone https://github.com/peter-cyber-create/ntlp.git
cd ntlp

# Verify the clone
ls -la
git status
```

## Step 5: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

## Step 6: Database Setup (if reset in Step 3)

```bash
# Only run if you chose Option B in Step 3
mysql -u root -p < database/setup.sql

# Verify database setup
mysql -u conf_user -ptoor conf -e "SHOW TABLES;"
```

## Step 7: Production Environment

```bash
# Create production environment file
cat > .env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="The Communicable and Non-Communicable Diseases Conference 2025"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_APP_URL=http://172.27.0.9:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=conf_user
DB_PASSWORD=toor
DB_NAME=conf

# Security
JWT_SECRET=2b1e7c8e7f4a4e8b9c2d7e6f1a3b5c7d
SESSION_SECRET=8f3c2e1d4b6a7c9e0f2b3d5a6c8e1f0b
NEXTAUTH_URL=http://172.27.0.9:3000
NEXTAUTH_SECRET=prod_nextauth_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads/abstracts

# Production settings
NEXT_PUBLIC_DEBUG=false
FORCE_HTTPS=false
SECURE_COOKIES=false
EOF

# Create upload directories
mkdir -p public/uploads/abstracts
chmod 755 public/uploads/abstracts
```

## Step 8: Build Application

```bash
# Build for production
NODE_ENV=production npm run build

# Verify build
ls -la .next/
```

## Step 9: Test Database Connection

```bash
# Test database connectivity
NODE_ENV=production node debug-production.js
```

## Step 10: Start Application

```bash
# Start the production server
DB_HOST=localhost DB_PORT=3306 DB_USER=conf_user DB_PASSWORD=toor DB_NAME=conf NODE_ENV=production npx next start -p 3000 -H 0.0.0.0
```

## Step 11: Test Deployment

**In another terminal:**
```bash
# Test homepage
curl -I http://localhost:3000

# Test registration API
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Deploy",
    "email": "test-deploy@example.com",
    "phone": "+256700000000",
    "organization": "Fresh Deploy Test",
    "position": "Tester",
    "district": "Kampala",
    "registrationType": "local"
  }'

# Verify data in database
mysql -u conf_user -ptoor conf -e "SELECT id, firstName, lastName, email FROM registrations ORDER BY id DESC LIMIT 3;"
```

## Step 12: External Access Test

```bash
# Test external access (from local machine)
curl -I http://172.27.0.9:3000

# If this fails, configure firewall:
sudo ufw allow 3000
sudo ufw status
```

---

**After successful deployment, your application will be available at:**
- **Local**: http://localhost:3000
- **External**: http://172.27.0.9:3000
- **Admin**: http://172.27.0.9:3000/admin

**For persistent running, set up PM2:**
```bash
npm install -g pm2
pm2 start "DB_HOST=localhost DB_PORT=3306 DB_USER=conf_user DB_PASSWORD=toor DB_NAME=conf NODE_ENV=production npx next start -p 3000 -H 0.0.0.0" --name ntlp-conference
pm2 save
pm2 startup
```
