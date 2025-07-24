#!/bin/bash

# NTLP Conference 2025 - Ubuntu Server Deployment Script
# Production deployment for Next.js application with MySQL

echo "🚀 Starting NTLP Conference 2025 Production Deployment..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ntlp-conference-2025"
DB_NAME="ntlp_conference_2025"
APP_USER="ntlp"
APP_DIR="/var/www/ntlp"
NGINX_CONF="/etc/nginx/sites-available/ntlp"
PM2_APP_NAME="ntlp-production"

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

print_status "Starting production deployment for NTLP Conference 2025..."

# Step 1: Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js 18.x (LTS)
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js installed: $NODE_VERSION"
print_success "npm installed: $NPM_VERSION"

# Step 3: Install MySQL Server
print_status "Installing MySQL Server..."
sudo apt install -y mysql-server

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

print_success "MySQL Server installed and started"

# Step 4: Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

print_success "Nginx installed and started"

# Step 5: Install PM2 globally
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Step 6: Create application user and directory
print_status "Creating application user and directory..."
sudo useradd -m -s /bin/bash $APP_USER || print_warning "User $APP_USER already exists"
sudo mkdir -p $APP_DIR
sudo chown -R $APP_USER:$APP_USER $APP_DIR

# Step 7: Clone or copy application
print_status "Setting up application directory..."
# Note: You should manually copy your application files to $APP_DIR
print_warning "Manual step required: Copy your application files to $APP_DIR"
print_warning "Run: sudo cp -r /path/to/your/app/* $APP_DIR/"
print_warning "Then: sudo chown -R $APP_USER:$APP_USER $APP_DIR"

# Step 8: Install application dependencies
print_status "Installing application dependencies..."
sudo -u $APP_USER bash -c "cd $APP_DIR && npm ci --only=production"

# Step 9: Build the application
print_status "Building the application..."
sudo -u $APP_USER bash -c "cd $APP_DIR && npm run build"

# Step 10: Configure MySQL database
print_status "Configuring MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
sudo mysql -e "CREATE USER IF NOT EXISTS '$APP_USER'@'localhost' IDENTIFIED BY 'secure_password_123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$APP_USER'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import database schema
if [ -f "$APP_DIR/database/schema.sql" ]; then
    print_status "Importing database schema..."
    sudo mysql $DB_NAME < $APP_DIR/database/schema.sql
    print_success "Database schema imported"
else
    print_warning "Database schema file not found at $APP_DIR/database/schema.sql"
fi

# Step 11: Create environment file
print_status "Creating production environment file..."
sudo -u $APP_USER bash -c "cat > $APP_DIR/.env.local << 'EOF'
# Production Environment Configuration
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=$APP_USER
DB_PASSWORD=secure_password_123!
DB_NAME=$DB_NAME

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# Security
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
EOF"

# Step 12: Configure PM2
print_status "Configuring PM2..."
sudo -u $APP_USER bash -c "cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '$APP_DIR/logs/combined.log',
    out_file: '$APP_DIR/logs/out.log',
    error_file: '$APP_DIR/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
EOF"

# Create logs directory
sudo -u $APP_USER mkdir -p $APP_DIR/logs

# Step 13: Configure Nginx
print_status "Configuring Nginx..."
sudo bash -c "cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Update with your SSL certificate paths)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    # For now, comment out SSL and use HTTP only
    # Uncomment and configure SSL certificates for production

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection \"1; mode=block\";
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # File upload size limit
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files
    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # Public files
    location /images/ {
        alias $APP_DIR/public/images/;
        expires 1y;
        add_header Cache-Control \"public\";
    }

    # File uploads
    location /uploads/ {
        alias $APP_DIR/public/uploads/;
        expires 1y;
        add_header Cache-Control \"public\";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
    }
}
EOF"

# Enable the site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Step 14: Configure firewall
print_status "Configuring UFW firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MySQL (restrict this in production)
sudo ufw --force enable

# Step 15: Start the application
print_status "Starting the application..."
sudo -u $APP_USER bash -c "cd $APP_DIR && pm2 start ecosystem.config.js"
sudo -u $APP_USER pm2 save
sudo -u $APP_USER pm2 startup

# Step 16: Reload Nginx
print_status "Reloading Nginx..."
sudo systemctl reload nginx

# Step 17: Set up log rotation
print_status "Setting up log rotation..."
sudo bash -c "cat > /etc/logrotate.d/ntlp << 'EOF'
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 0644 $APP_USER $APP_USER
    postrotate
        sudo -u $APP_USER pm2 reloadLogs
    endscript
}
EOF"

# Step 18: Create backup script
print_status "Creating backup script..."
sudo bash -c "cat > /usr/local/bin/ntlp-backup.sh << 'EOF'
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=\"/var/backups/ntlp\"
mkdir -p \$BACKUP_DIR

# Database backup
mysqldump -u $APP_USER -p'secure_password_123!' $DB_NAME > \$BACKUP_DIR/db_\$DATE.sql

# Application backup
tar -czf \$BACKUP_DIR/app_\$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find \$BACKUP_DIR -name \"*.sql\" -mtime +7 -delete
find \$BACKUP_DIR -name \"*.tar.gz\" -mtime +7 -delete

echo \"Backup completed: \$DATE\"
EOF"

sudo chmod +x /usr/local/bin/ntlp-backup.sh

# Set up daily backup cron job
(sudo crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/ntlp-backup.sh") | sudo crontab -

print_success "Deployment completed successfully!"

echo ""
echo "==================== DEPLOYMENT SUMMARY ===================="
echo ""
print_success "✅ System packages updated"
print_success "✅ Node.js $(node --version) installed"
print_success "✅ MySQL Server installed and configured"
print_success "✅ Nginx installed and configured"
print_success "✅ PM2 process manager installed"
print_success "✅ Application user '$APP_USER' created"
print_success "✅ Database '$DB_NAME' created"
print_success "✅ Environment configuration created"
print_success "✅ PM2 configuration created"
print_success "✅ Nginx configuration created"
print_success "✅ Firewall configured"
print_success "✅ Log rotation configured"
print_success "✅ Backup script created"

echo ""
echo "==================== NEXT STEPS ===================="
echo ""
print_warning "1. Copy your application files to $APP_DIR"
print_warning "2. Update $APP_DIR/.env.local with your actual domain and secrets"
print_warning "3. Configure SSL certificates in Nginx"
print_warning "4. Update database password in production"
print_warning "5. Test the application: http://your-server-ip"

echo ""
echo "==================== USEFUL COMMANDS ===================="
echo ""
echo "# Check application status:"
echo "sudo -u $APP_USER pm2 status"
echo ""
echo "# View application logs:"
echo "sudo -u $APP_USER pm2 logs $PM2_APP_NAME"
echo ""
echo "# Restart application:"
echo "sudo -u $APP_USER pm2 restart $PM2_APP_NAME"
echo ""
echo "# Check Nginx status:"
echo "sudo systemctl status nginx"
echo ""
echo "# Check MySQL status:"
echo "sudo systemctl status mysql"
echo ""
echo "# Run backup manually:"
echo "sudo /usr/local/bin/ntlp-backup.sh"

echo ""
print_success "🎉 NTLP Conference 2025 deployment ready!"
print_warning "⚠️  Don't forget to secure your server and configure SSL certificates!"
