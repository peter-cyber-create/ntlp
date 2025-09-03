#!/bin/bash

# Fresh Deployment Script for NACNDC Conference System
# This script will completely wipe the server and install a fresh deployment
# Server: conf@172.27.0.9

set -e  # Exit on any error

echo "🚀 Starting Fresh Deployment of NACNDC Conference System"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server details
SERVER="conf@172.27.0.9"
APP_DIR="/home/conf/conference-app"
BACKUP_DIR="/home/conf/backups"
NGINX_SITES="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

echo -e "${BLUE}Step 1: Connect to server and stop all services${NC}"
ssh $SERVER << 'EOF'
    echo "🛑 Stopping all services..."
    
    # Stop PM2 processes
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    
    # Stop and disable old services
    sudo systemctl stop conference-app 2>/dev/null || true
    sudo systemctl disable conference-app 2>/dev/null || true
    
    # Stop nginx temporarily
    sudo systemctl stop nginx 2>/dev/null || true
    
    echo "✅ Services stopped"
EOF

echo -e "${BLUE}Step 2: Clean server environment${NC}"
ssh $SERVER << 'EOF'
    echo "🧹 Cleaning server environment..."
    
    # Remove old application directory
    sudo rm -rf /home/conf/conference-app
    sudo rm -rf /home/conf/ndc-frontend
    sudo rm -rf /home/conf/ndc-backend
    
    # Remove old nginx configurations
    sudo rm -f /etc/nginx/sites-available/conference
    sudo rm -f /etc/nginx/sites-enabled/conference
    sudo rm -f /etc/nginx/sites-available/default
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Clean npm cache
    npm cache clean --force 2>/dev/null || true
    
    # Remove old node_modules
    sudo rm -rf /home/conf/node_modules 2>/dev/null || true
    
    # Clean PM2 logs
    pm2 flush 2>/dev/null || true
    
    echo "✅ Server cleaned"
EOF

echo -e "${BLUE}Step 3: Update system packages${NC}"
ssh $SERVER << 'EOF'
    echo "📦 Updating system packages..."
    
    sudo apt update
    sudo apt upgrade -y
    
    # Install essential packages
    sudo apt install -y curl wget git nginx mysql-server nodejs npm certbot python3-certbot-nginx
    
    # Install PM2 globally
    sudo npm install -g pm2
    
    echo "✅ System updated"
EOF

echo -e "${BLUE}Step 4: Setup MySQL database${NC}"
ssh $SERVER << 'EOF'
    echo "🗄️ Setting up MySQL database..."
    
    # Start MySQL service
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    # Create database and user
    sudo mysql << 'MYSQL_EOF'
        DROP DATABASE IF EXISTS conf;
        CREATE DATABASE conf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        
        DROP USER IF EXISTS 'conf_user'@'localhost';
        CREATE USER 'conf_user'@'localhost' IDENTIFIED BY 'conference2025!';
        GRANT ALL PRIVILEGES ON conf.* TO 'conf_user'@'localhost';
        FLUSH PRIVILEGES;
        
        USE conf;
        
        -- Create abstracts table
        CREATE TABLE abstracts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            primary_author JSON NOT NULL,
            co_authors JSON,
            abstract_summary TEXT NOT NULL,
            keywords JSON,
            category VARCHAR(100),
            subcategory VARCHAR(100),
            status ENUM('submitted', 'under_review', 'accepted', 'rejected', 'revision_required') DEFAULT 'submitted',
            admin_notes TEXT,
            reviewer_comments TEXT,
            reviewed_by VARCHAR(100),
            reviewed_at TIMESTAMP NULL,
            file_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
        -- Create registrations table
        CREATE TABLE registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            organization VARCHAR(255),
            position VARCHAR(100),
            registration_type ENUM('local', 'international', 'student') NOT NULL,
            payment_reference VARCHAR(500),
            status ENUM('submitted', 'payment_pending', 'confirmed', 'cancelled') DEFAULT 'submitted',
            admin_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
        -- Create contacts table
        CREATE TABLE contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            organization VARCHAR(255),
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('submitted', 'in_progress', 'resolved') DEFAULT 'submitted',
            admin_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
        -- Create sponsorships table
        CREATE TABLE sponsorships (
            id INT AUTO_INCREMENT PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            contact_person VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            website VARCHAR(255),
            industry VARCHAR(100),
            selected_package ENUM('platinum', 'gold', 'silver', 'bronze', 'custom') DEFAULT 'custom',
            special_requirements TEXT,
            message TEXT,
            company_description TEXT,
            status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
            admin_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
        -- Insert sample data
        INSERT INTO abstracts (title, primary_author, abstract_summary, keywords, category, subcategory, file_url) VALUES
        ('Sample Abstract 1', '{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "institution": "University of Health"}', 'This is a sample abstract for testing purposes.', '["health", "research", "conference"]', 'Clinical Research', 'Infectious Diseases', '{"name": "sample_abstract_1.pdf", "size": 12345, "type": "application/pdf"}'),
        ('Sample Abstract 2', '{"firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "institution": "Medical Center"}', 'Another sample abstract for demonstration.', '["medicine", "treatment", "study"]', 'Public Health', 'Prevention', '{"name": "sample_abstract_2.pdf", "size": 23456, "type": "application/pdf"}');
        
        INSERT INTO registrations (first_name, last_name, email, organization, registration_type, status) VALUES
        ('Alice', 'Johnson', 'alice@example.com', 'Health Ministry', 'local', 'confirmed'),
        ('Bob', 'Wilson', 'bob@example.com', 'Medical University', 'international', 'payment_pending');
        
        INSERT INTO contacts (name, email, subject, message, status) VALUES
        ('Dr. Sarah Brown', 'sarah@example.com', 'Conference Inquiry', 'I would like to know more about the conference schedule.', 'submitted'),
        ('Prof. Michael Lee', 'michael@example.com', 'Registration Help', 'I need assistance with the registration process.', 'in_progress');
        
        INSERT INTO sponsorships (company_name, contact_person, email, selected_package, company_description, status) VALUES
        ('HealthTech Solutions', 'David Chen', 'david@healthtech.com', 'gold', 'Leading provider of healthcare technology solutions.', 'under_review'),
        ('MediCare Plus', 'Lisa Rodriguez', 'lisa@medicare.com', 'silver', 'Comprehensive healthcare services provider.', 'submitted');
MYSQL_EOF
    
    echo "✅ Database setup complete"
EOF

echo -e "${BLUE}Step 5: Clone and setup application${NC}"
ssh $SERVER << 'EOF'
    echo "📥 Cloning application repository..."
    
    # Create application directory
    mkdir -p /home/conf/conference-app
    cd /home/conf/conference-app
    
    # Clone the frontend repository
    git clone https://github.com/peter-cyber-create/ndc-frontend.git frontend
    cd frontend
    
    # Install dependencies
    npm install
    
    # Create production environment file
    cat > .env.production << 'ENV_EOF'
NEXT_PUBLIC_API_URL=https://conference.health.go.ug
NEXT_PUBLIC_SITE_URL=https://conference.health.go.ug
NEXT_PUBLIC_ENVIRONMENT=production

# Database configuration
DB_HOST=localhost
DB_USER=conf_user
DB_PASSWORD=conference2025!
DB_NAME=conf
ENV_EOF
    
    # Create uploads directory
    mkdir -p public/uploads/abstracts
    mkdir -p public/uploads/payment-proofs
    chmod 755 public/uploads/abstracts
    chmod 755 public/uploads/payment-proofs
    
    echo "✅ Application setup complete"
EOF

echo -e "${BLUE}Step 6: Build application for production${NC}"
ssh $SERVER << 'EOF'
    echo "🔨 Building application for production..."
    
    cd /home/conf/conference-app/frontend
    
    # Build the application
    npm run build
    
    echo "✅ Application built successfully"
EOF

echo -e "${BLUE}Step 7: Setup PM2 process manager${NC}"
ssh $SERVER << 'EOF'
    echo "⚙️ Setting up PM2 process manager..."
    
    cd /home/conf/conference-app/frontend
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'conference-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/conf/conference-app/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/conf/logs/err.log',
    out_file: '/home/conf/logs/out.log',
    log_file: '/home/conf/logs/combined.log',
    time: true
  }]
};
PM2_EOF
    
    # Create logs directory
    mkdir -p /home/conf/logs
    
    # Start the application with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    echo "✅ PM2 setup complete"
EOF

echo -e "${BLUE}Step 8: Configure Nginx${NC}"
ssh $SERVER << 'EOF'
    echo "🌐 Configuring Nginx..."
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/conference << 'NGINX_EOF'
server {
    listen 80;
    server_name conference.health.go.ug;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name conference.health.go.ug;
    
    # SSL configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/conference.health.go.ug/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conference.health.go.ug/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Static files
    location /_next/static/ {
        alias /home/conf/conference-app/frontend/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /images/ {
        alias /home/conf/conference-app/frontend/public/images/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    location /uploads/ {
        alias /home/conf/conference-app/frontend/public/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX_EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/conference /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    echo "✅ Nginx configured"
EOF

echo -e "${BLUE}Step 9: Setup SSL with Let's Encrypt${NC}"
ssh $SERVER << 'EOF'
    echo "🔒 Setting up SSL certificate..."
    
    # Start Nginx temporarily for domain validation
    sudo systemctl start nginx
    
    # Obtain SSL certificate
    sudo certbot --nginx -d conference.health.go.ug --non-interactive --agree-tos --email admin@health.go.ug
    
    # Test certificate renewal
    sudo certbot renew --dry-run
    
    echo "✅ SSL certificate configured"
EOF

echo -e "${BLUE}Step 10: Final system configuration${NC}"
ssh $SERVER << 'EOF'
    echo "🔧 Final system configuration..."
    
    # Set proper permissions
    sudo chown -R conf:conf /home/conf/conference-app
    sudo chown -R conf:conf /home/conf/logs
    
    # Configure firewall
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    
    # Restart services
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    sudo systemctl restart mysql
    sudo systemctl enable mysql
    
    # Restart PM2 processes
    pm2 restart all
    pm2 save
    
    echo "✅ System configuration complete"
EOF

echo -e "${BLUE}Step 11: Verify deployment${NC}"
ssh $SERVER << 'EOF'
    echo "🔍 Verifying deployment..."
    
    # Check PM2 status
    echo "PM2 Status:"
    pm2 status
    
    # Check Nginx status
    echo "Nginx Status:"
    sudo systemctl status nginx --no-pager -l
    
    # Check MySQL status
    echo "MySQL Status:"
    sudo systemctl status mysql --no-pager -l
    
    # Test application
    echo "Testing application..."
    curl -I http://localhost:3000 || echo "Local application test failed"
    
    # Check disk space
    echo "Disk Usage:"
    df -h
    
    echo "✅ Deployment verification complete"
EOF

echo -e "${GREEN}🎉 Fresh Deployment Complete!${NC}"
echo "=================================================="
echo -e "${YELLOW}Application URL: https://conference.health.go.ug${NC}"
echo -e "${YELLOW}Admin Panel: https://conference.health.go.ug/admin${NC}"
echo -e "${YELLOW}Admin Credentials: admin / conference2025${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Test the application at https://conference.health.go.ug"
echo "2. Login to admin panel and verify all functionality"
echo "3. Test form submissions (abstracts, registrations, contacts, sponsorships)"
echo "4. Verify file uploads and downloads work correctly"
echo "5. Monitor logs: pm2 logs conference-frontend"
echo ""
echo -e "${GREEN}Deployment completed successfully! 🚀${NC}"
