# Ubuntu Server Deployment with Nginx

## 🚀 Complete Production Deployment Guide
*Deploy the Communicable and Non-Communicable Diseases Conference website on Ubuntu Server with Nginx*

### Prerequisites

#### Server Requirements
- **OS**: Ubuntu 20.04 LTS or 22.04 LTS
- **RAM**: Minimum 4GB (8GB recommended for production)
- **Storage**: Minimum 20GB free space
- **Network**: Static IP address (configured as 172.27.0.9)
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL)

#### Domain & SSL (Optional but Recommended)
- Domain name pointing to your server IP
- SSL certificate (Let's Encrypt recommended)

### Step 1: Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Configure firewall
sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MySQL (optional for external access)
```

### Step 2: Install Node.js 18+

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 3: Install and Configure MySQL

```bash
# Install MySQL Server
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
# Follow prompts:
# - Set root password: YES (choose strong password)
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 4: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Test Nginx installation
curl http://localhost  # Should show Nginx welcome page
```

### Step 5: Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/ntlp
sudo chown -R $USER:$USER /var/www/ntlp

# Clone repository (replace with your actual repository URL)
cd /var/www
git clone https://github.com/peter-cyber-create/ntlp.git
cd ntlp

# Install dependencies
npm install

# Set up environment
cp .env.production .env.local

# Make scripts executable
chmod +x scripts/setup-mysql.sh
chmod +x scripts/deploy-ubuntu.sh
```

### Step 6: Database Setup

```bash
# Run MySQL setup script
./scripts/setup-mysql.sh

# Import database schema
mysql -u ntlp_user -p ntlp_conference_2025 < database/schema.sql
```

### Step 7: Build Application

```bash
# Build the Next.js application
npm run build

# Test the application
npm start &
curl http://localhost:3000  # Should show the website
pkill node  # Stop test server
```

### Step 8: Configure PM2

```bash
# Start application with PM2
pm2 start npm --name "ntlp-production" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Check PM2 status
pm2 status
pm2 logs ntlp-production  # View logs
```

### Step 9: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp config/ntlp-conference.conf /etc/nginx/sites-available/ntlp

# Enable the site
sudo ln -s /etc/nginx/sites-available/ntlp /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 10: Set Up File Uploads

```bash
# Create upload directories
sudo mkdir -p /var/www/ntlp/public/uploads/abstracts
sudo mkdir -p /var/www/ntlp/public/uploads/documents

# Set proper permissions
sudo chown -R www-data:www-data /var/www/ntlp/public/uploads
sudo chmod -R 755 /var/www/ntlp/public/uploads

# Set SELinux context (if SELinux is enabled)
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_unified 1
```

### Step 11: SSL Configuration (Recommended)

```bash
# Install Certbot for Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## 📁 Final Directory Structure

```
/var/www/ntlp/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                   # Utility libraries
├── public/                # Static assets
│   └── uploads/           # File uploads
├── database/              # Database schema
├── config/                # Configuration files
│   └── ntlp-conference.conf
├── scripts/               # Deployment scripts
│   ├── deploy-ubuntu.sh
│   └── setup-mysql.sh
├── docs/                  # Documentation
├── .env.local            # Environment variables
├── package.json          # Dependencies
└── next.config.js        # Next.js config
```

## 🔧 Configuration Files

### Environment Variables (.env.local)
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=ntlp_user
DB_PASSWORD=secure_password_here
DB_NAME=ntlp_conference_2025

# Application Configuration
NEXTAUTH_URL=http://172.27.0.9
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=production

# Conference Settings
CONFERENCE_NAME="The Communicable and Non-Communicable Diseases Conference"
CONFERENCE_YEAR=2025
CONFERENCE_DATE="March 10-12, 2025"
CONFERENCE_LOCATION="Speke Resort Munyonyo, Kampala, Uganda"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=conference2025

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/ntlp/public/uploads
```

### Nginx Configuration (config/ntlp-conference.conf)
```nginx
server {
    listen 80;
    server_name 172.27.0.9;  # Replace with your domain if using one
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # File upload size limit
    client_max_body_size 50M;

    # Proxy to Next.js application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # File uploads
    location /uploads/ {
        alias /var/www/ntlp/public/uploads/;
        expires 1d;
        add_header Cache-Control "public";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

## 🔄 Monitoring & Maintenance

### Daily Checks
```bash
# Check application status
pm2 status

# Check application logs
pm2 logs ntlp-production --lines 50

# Check Nginx status
sudo systemctl status nginx

# Check MySQL status
sudo systemctl status mysql

# Check disk space
df -h

# Check memory usage
free -h
```

### Weekly Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services if needed
sudo systemctl restart nginx
pm2 restart ntlp-production

# Clean PM2 logs
pm2 flush

# Backup database
mysqldump -u ntlp_user -p ntlp_conference_2025 > backup_$(date +%Y%m%d).sql
```

### Backup Strategy
```bash
# Create backup script
cat << 'EOF' > /var/www/ntlp/scripts/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ntlp"

# Create backup directory
sudo mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u ntlp_user -p$DB_PASSWORD ntlp_conference_2025 > $BACKUP_DIR/database_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/ntlp/public/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/ntlp/scripts/backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /var/www/ntlp/scripts/backup.sh" | sudo crontab -
```

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check PM2 logs
pm2 logs ntlp-production

# Check if port 3000 is available
sudo netstat -tlnp | grep :3000

# Restart application
pm2 restart ntlp-production
```

#### Database Connection Issues
```bash
# Test MySQL connection
mysql -u ntlp_user -p -h 127.0.0.1

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

#### Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

#### File Upload Issues
```bash
# Check upload directory permissions
ls -la /var/www/ntlp/public/uploads/

# Fix permissions
sudo chown -R www-data:www-data /var/www/ntlp/public/uploads
sudo chmod -R 755 /var/www/ntlp/public/uploads
```

## 📞 Support

### Log Locations
- **Application Logs**: `pm2 logs ntlp-production`
- **Nginx Access Logs**: `/var/log/nginx/access.log`
- **Nginx Error Logs**: `/var/log/nginx/error.log`
- **MySQL Logs**: `/var/log/mysql/error.log`

### Performance Monitoring
```bash
# Monitor system resources
htop

# Monitor disk usage
watch df -h

# Monitor network connections
sudo netstat -tulnp
```

---
*Last Updated: August 3, 2025*
*Environment: Ubuntu Server with Nginx*
*IP: 172.27.0.9*
