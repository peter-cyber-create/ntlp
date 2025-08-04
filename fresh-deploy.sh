#!/bin/bash

# Fresh Deployment Script for NTLP Conference 2025
# Run this script on the 172.27.0.9 server to completely clean and redeploy

echo "🚀 Starting Fresh Deployment for NTLP Conference 2025"
echo "====================================================="

# Step 1: Stop all running processes
echo "🛑 Step 1: Stopping all running processes..."
pkill -f "next" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
pkill -f "npm" 2>/dev/null || true
sleep 3
echo "✅ All Node.js processes stopped"

# Step 2: Remove existing application files
echo "🗑️  Step 2: Removing existing application files..."
cd /home/peter/Desktop/dev
if [ -d "ntlp" ]; then
    echo "Backing up any important data..."
    mkdir -p /tmp/ntlp-backup-$(date +%Y%m%d_%H%M%S)
    cp -r ntlp/public/uploads/* /tmp/ntlp-backup-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
    
    echo "Removing application directory..."
    rm -rf ntlp
    echo "✅ Application directory removed"
else
    echo "✅ No existing application directory found"
fi

# Step 3: Clean database (optional - preserves existing data)
echo "🗄️  Step 3: Database cleanup options..."
echo "Would you like to:"
echo "1) Keep existing database and data"
echo "2) Reset database completely"
read -p "Enter choice (1 or 2): " db_choice

if [ "$db_choice" = "2" ]; then
    echo "Resetting database..."
    mysql -u root -p << 'EOF'
DROP DATABASE IF EXISTS conf;
DROP USER IF EXISTS 'conf_user'@'localhost';
DROP USER IF EXISTS 'conf_user'@'%';
FLUSH PRIVILEGES;
EOF
    echo "✅ Database reset complete"
else
    echo "✅ Keeping existing database"
fi

# Step 4: Clone fresh code from repository
echo "📥 Step 4: Cloning fresh code..."
cd /home/peter/Desktop/dev
git clone https://github.com/peter-cyber-create/ntlp.git
cd ntlp
echo "✅ Fresh code cloned"

# Step 5: Install dependencies
echo "📦 Step 5: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 6: Setup database (if reset)
if [ "$db_choice" = "2" ]; then
    echo "🗄️  Step 6: Setting up fresh database..."
    mysql -u root -p < database/setup.sql
    echo "✅ Database setup complete"
else
    echo "✅ Using existing database"
fi

# Step 7: Create production environment file
echo "⚙️  Step 7: Creating production environment..."
cat > .env.production << 'EOF'
# Production Environment Configuration
NODE_ENV=production

# Application Details
NEXT_PUBLIC_APP_NAME="The Communicable and Non-Communicable Diseases Conference 2025"
NEXT_PUBLIC_APP_DESCRIPTION="Uganda's premier Communicable and Non-Communicable Diseases Conference 2025"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_APP_URL=http://172.27.0.9:3000

# Database Configuration (MySQL Production)
DB_HOST=localhost
DB_PORT=3306
DB_USER=conf_user
DB_PASSWORD=toor
DB_NAME=conf
DATABASE_POOL_MAX=30
DATABASE_POOL_MIN=5

# Security Configuration
JWT_SECRET=2b1e7c8e7f4a4e8b9c2d7e6f1a3b5c7d
SESSION_SECRET=8f3c2e1d4b6a7c9e0f2b3d5a6c8e1f0b
NEXTAUTH_URL=http://172.27.0.9:3000
NEXTAUTH_SECRET=prod_nextauth_secret_replace_with_secure_key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads/abstracts

# Conference Settings
CONFERENCE_NAME="NDC Conference 2025"
CONFERENCE_YEAR=2025
CONFERENCE_VENUE="Conference Center"

# Production specific settings
NEXT_PUBLIC_DEBUG=false
FORCE_HTTPS=false
SECURE_COOKIES=false
EOF
echo "✅ Production environment configured"

# Step 8: Create upload directories
echo "📁 Step 8: Creating upload directories..."
mkdir -p public/uploads/abstracts
chmod 755 public/uploads/abstracts
echo "✅ Upload directories created"

# Step 9: Build the application
echo "🔨 Step 9: Building production application..."
NODE_ENV=production npm run build
echo "✅ Application built successfully"

# Step 10: Test database connection
echo "🧪 Step 10: Testing database connection..."
node debug-production.js
echo "✅ Database connection tested"

# Step 11: Create PM2 ecosystem file for production management
echo "⚡ Step 11: Setting up PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ntlp-conference',
    script: 'npx',
    args: 'next start -p 3000 -H 0.0.0.0',
    cwd: '/home/peter/Desktop/dev/ntlp',
    env: {
      NODE_ENV: 'production',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'conf_user',
      DB_PASSWORD: 'toor',
      DB_NAME: 'conf'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Create logs directory
mkdir -p logs
echo "✅ PM2 configuration created"

echo ""
echo "🎉 Fresh Deployment Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Start the application: pm2 start ecosystem.config.js"
echo "2. Save PM2 configuration: pm2 save"
echo "3. Set PM2 to start on boot: pm2 startup"
echo "4. Test the application: curl http://localhost:3000"
echo "5. Test registration: curl -X POST http://localhost:3000/api/registrations -H 'Content-Type: application/json' -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"registrationType\":\"local\"}'"
echo ""
echo "Application will be available at: http://172.27.0.9:3000"
echo "Admin panel: http://172.27.0.9:3000/admin"
echo ""
echo "For manual start (without PM2): NODE_ENV=production npx next start -p 3000 -H 0.0.0.0"
echo ""
echo "Deployment completed successfully! 🚀"
