#!/bin/bash

# Conference 2025 - Ubuntu Server Deployment Script
# Complete production deployment with Nginx and PM2
# Target: Ubuntu 20.04+ with 172.27.0.9 IP configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="conf-production"
APP_DIR="/var/www/conf"
SERVER_IP="172.27.0.9"
DB_NAME="conf"
DB_USER="conf_user"
DB_PASS="secure_password_here"

echo -e "${BLUE}🚀 Conference 2025 - Ubuntu Server Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Target Server: ${SERVER_IP}${NC}"
echo -e "${YELLOW}Application: Communicable and Non-Communicable Diseases Conference${NC}"
echo ""

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons. Please run as regular user with sudo privileges."
fi

# Check if we're on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    error "This script is designed for Ubuntu systems only"
fi

log "✅ Running on Ubuntu system"

# Function to check if service is active
check_service() {
    local service=$1
    if systemctl is-active --quiet $service; then
        log "✅ $service is running"
        return 0
    else
        warning "$service is not running"
        return 1
    fi
}

# Update system packages
log "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
log "📦 Installing system dependencies..."
sudo apt install -y curl wget git unzip software-properties-common \
    nginx mysql-server ufw htop tree zip unzip \
    build-essential python3-certbot-nginx

# Install Node.js 18 LTS
log "📦 Installing Node.js 18 LTS..."
if ! command -v node &> /dev/null || [[ $(node --version | cut -d'.' -f1 | cut -d'v' -f2) -lt 18 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    log "✅ Node.js $(node --version) installed"
else
    log "✅ Node.js $(node --version) already installed"
fi

# Install PM2
log "📦 Installing PM2 process manager..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    log "✅ PM2 installed"
else
    log "✅ PM2 already installed"
fi

# Configure firewall
log "🔒 Configuring UFW firewall..."
sudo ufw --force enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow from 127.0.0.1 to any port 3306  # MySQL localhost only
sudo ufw allow from $SERVER_IP to any port 3306  # MySQL from server IP
log "✅ Firewall configured"

# Create application directory
log "📁 Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copy application files if not already in target directory
if [ "$(pwd)" != "$APP_DIR" ]; then
    log "📋 Copying application files to $APP_DIR..."
    sudo cp -r . $APP_DIR/
    sudo chown -R $USER:$USER $APP_DIR
    cd $APP_DIR
fi

# Make scripts executable
log "🔧 Setting script permissions..."
chmod +x scripts/setup-mysql.sh

# Database setup
log "🗄️ Setting up MySQL database..."
if ! mysql -u $DB_USER -p$DB_PASS -e "USE $DB_NAME;" 2>/dev/null; then
    ./scripts/setup-mysql.sh
    log "✅ Database setup completed"
else
    log "✅ Database already exists"
fi

# Install Node.js dependencies
log "📦 Installing Node.js dependencies..."
npm ci --production

# Set up environment
log "⚙️ Setting up environment configuration..."
if [ ! -f .env.local ]; then
    cp .env.production .env.local
    
    # Update environment file with server-specific settings
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=http://$SERVER_IP|g" .env.local
    sed -i "s|DB_HOST=.*|DB_HOST=127.0.0.1|g" .env.local
    
    log "✅ Environment file created and configured"
else
    log "✅ Environment file already exists"
fi

# Build application
log "🔨 Building Next.js application..."
npm run build
log "✅ Application build completed"

# Set up file upload directories
log "📁 Setting up upload directories and permissions..."
sudo mkdir -p $APP_DIR/public/uploads/abstracts
sudo mkdir -p $APP_DIR/public/uploads/documents
sudo mkdir -p /var/backups/conf
sudo chown -R www-data:www-data $APP_DIR/public/uploads
sudo chmod -R 755 $APP_DIR/public/uploads
log "✅ Upload directories configured"

# Configure Nginx
log "🌐 Configuring Nginx..."
sudo cp config/ntlp-conference.conf /etc/nginx/sites-available/conf

# Update Nginx config with correct paths
sudo sed -i "s|/var/www/ntlp|$APP_DIR|g" /etc/nginx/sites-available/conf

sudo ln -sf /etc/nginx/sites-available/conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    sudo systemctl reload nginx
    log "✅ Nginx configured and reloaded"
else
    error "Nginx configuration test failed"
fi

# Import database schema
log "🗄️ Importing database schema..."
if mysql -u $DB_USER -p$DB_PASS $DB_NAME < database/schema.sql; then
    log "✅ Database schema imported"
else
    warning "Database schema import failed (might already exist)"
fi

# Stop existing PM2 process if running
log "🔄 Managing PM2 processes..."
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
log "🚀 Starting application with PM2..."
pm2 start npm --name "$APP_NAME" -- start
pm2 startup
pm2 save
log "✅ Application started with PM2"

# Set up backup script
log "💾 Setting up backup system..."
cat > scripts/backup.sh << 'EOF'
BACKUP_DIR="/var/backups/conf"
DATE=$(date +%Y%m%d_%H%M%S)
echo "Creating database backup..."
mysqldump -u conf_user -ptoor conf > $BACKUP_DIR/database_$DATE.sql
EOF

chmod +x scripts/backup.sh

# Add backup to crontab
if ! crontab -l 2>/dev/null | grep -q "backup.sh"; then
    (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/backup.sh") | crontab -
    log "✅ Daily backup scheduled at 2 AM"
fi

# Final health checks
log "🔍 Performing health checks..."

# Check services
check_service nginx
check_service mysql

# Check PM2
if pm2 list | grep -q $APP_NAME; then
    log "✅ PM2 application running"
else
    error "PM2 application not running"
fi

# Check application response
sleep 5
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    log "✅ Application responding on port 3000"
else
    warning "Application may not be responding correctly"
fi

# Check Nginx proxy
if curl -f http://localhost >/dev/null 2>&1; then
    log "✅ Nginx proxy working"
else
    warning "Nginx proxy may not be working correctly"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "🌐 Website URL: ${YELLOW}http://$SERVER_IP${NC}"
echo -e "👨‍💼 Admin Panel: ${YELLOW}http://$SERVER_IP/admin${NC}"
echo -e "📍 Application Path: ${YELLOW}$APP_DIR${NC}"
echo ""
echo -e "${BLUE}🔐 Admin Credentials:${NC}"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}conference2025${NC}"
echo ""
echo -e "${BLUE}🛠️ Management Commands:${NC}"
echo -e "   ${YELLOW}pm2 status${NC}                     # Check application status"
echo -e "   ${YELLOW}pm2 logs $APP_NAME${NC}         # View application logs"
echo -e "   ${YELLOW}pm2 restart $APP_NAME${NC}      # Restart application"
echo -e "   ${YELLOW}sudo systemctl status nginx${NC}   # Check Nginx status"
echo -e "   ${YELLOW}sudo systemctl status mysql${NC}   # Check MySQL status"
echo -e "   ${YELLOW}$APP_DIR/scripts/backup.sh${NC} # Manual backup"
echo ""
echo -e "${BLUE}📁 Important Directories:${NC}"
echo -e "   Application: ${YELLOW}$APP_DIR${NC}"
echo -e "   Uploads: ${YELLOW}$APP_DIR/public/uploads${NC}"
echo -e "   Backups: ${YELLOW}/var/backups/conf${NC}"
echo -e "   Logs: ${YELLOW}pm2 logs $APP_NAME${NC}"
echo ""
echo -e "${YELLOW}⚠️  Security Recommendations:${NC}"
echo "1. Change admin password in database immediately"
echo "2. Configure SSL certificate using: sudo certbot --nginx"
echo "3. Review and update firewall rules if needed"
echo "4. Set up monitoring and alerting"
echo "5. Test backup and restore procedures"
echo ""
echo -e "${BLUE}📚 Documentation: ${YELLOW}$APP_DIR/docs/${NC}"
echo -e "${GREEN}============================================${NC}"
