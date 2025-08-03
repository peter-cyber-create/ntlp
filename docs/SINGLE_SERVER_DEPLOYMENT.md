# NTLP Conference 2025 - Single Server Deployment Checklist

## 🚀 Single Server Deployment Guide for 172.27.0.9
*Complete deployment of Frontend, Backend APIs, Database, and File Storage on one server*

### Pre-Deployment Requirements

#### Server Specifications
- **Server IP**: 172.27.0.9
- **OS**: Ubuntu 20.04+ or CentOS 7+
- **RAM**: Minimum 4GB (8GB+ recommended)
- **Storage**: Minimum 50GB free space
- **Network**: Open ports 80, 443, 3306 (MySQL), 3000 (Node.js)

#### Required Software
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Nginx installed and configured
- [ ] PM2 installed for process management
- [ ] Git installed
- [ ] UFW/firewall configured

### Deployment Steps

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx mysql-server nodejs npm git ufw -y

# Install PM2 globally
sudo npm install -g pm2

# Configure firewall
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3306  # MySQL (optional, for external access)
```

#### 2. Database Setup
- [ ] Run `chmod +x setup-mysql.sh`
- [ ] Execute `./setup-mysql.sh`
- [ ] Verify database creation: `mysql -u ntlp_user -p ntlp_conference_2025`
- [ ] Import schema from `database/schema.sql`
- [ ] Test database connectivity

#### 3. Application Deployment
```bash
# Clone repository to server
git clone <repository-url> /var/www/ntlp
cd /var/www/ntlp

# Install dependencies
npm install

# Set production environment
cp .env.production .env.local

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ntlp-production" -- start
pm2 save
pm2 startup
```

#### 4. Nginx Configuration
```bash
# Copy nginx config
sudo cp ntlp-conference.conf /etc/nginx/sites-available/ntlp
sudo ln -s /etc/nginx/sites-available/ntlp /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. File Upload Directory Setup
```bash
# Create upload directories
sudo mkdir -p /var/www/ntlp/public/uploads/abstracts
sudo mkdir -p /var/www/ntlp/public/uploads/documents

# Set permissions
sudo chown -R www-data:www-data /var/www/ntlp/public/uploads
sudo chmod -R 755 /var/www/ntlp/public/uploads
```

### Environment Configuration

#### Database Connection
- **Host**: 127.0.0.1 (local MySQL)
- **Database**: ntlp_conference_2025
- **User**: ntlp_user
- **Password**: secure_password_here

#### Application URLs
- **Frontend**: http://172.27.0.9
- **Admin Panel**: http://172.27.0.9/admin
- **API Endpoints**: http://172.27.0.9/api/*

### Post-Deployment Verification

#### Health Checks
- [ ] Website loads at http://172.27.0.9
- [ ] Admin panel accessible at http://172.27.0.9/admin
- [ ] Database connectivity test
- [ ] File upload functionality test
- [ ] API endpoints responding correctly

#### Test Cases
1. **Registration Flow**
   - [ ] User can register for conference
   - [ ] Registration data saved to database
   - [ ] Confirmation email sent (if configured)

2. **Abstract Submission**
   - [ ] Users can submit abstracts
   - [ ] Files upload successfully
   - [ ] Admin can review submissions

3. **Admin Dashboard**
   - [ ] Login with credentials: admin/conference2025
   - [ ] View all registrations
   - [ ] Download abstracts with proper filenames
   - [ ] Update abstract statuses

### Monitoring & Maintenance

#### Log Files
- **Nginx Logs**: /var/log/nginx/ntlp-conference.*.log
- **Application Logs**: PM2 logs via `pm2 logs ntlp-production`
- **MySQL Logs**: /var/log/mysql/error.log

#### Regular Maintenance
- [ ] Weekly database backups
- [ ] Monitor disk space usage
- [ ] Check PM2 process status
- [ ] Update dependencies monthly

#### Backup Strategy
```bash
# Database backup
mysqldump -u ntlp_user -p ntlp_conference_2025 > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/ntlp/public/uploads
```

### Troubleshooting

#### Common Issues
1. **Application won't start**
   - Check PM2 logs: `pm2 logs ntlp-production`
   - Verify environment variables
   - Check database connectivity

2. **File uploads failing**
   - Verify upload directory permissions
   - Check Nginx client_max_body_size
   - Review application logs

3. **Database connection errors**
   - Verify MySQL service status: `sudo systemctl status mysql`
   - Check credentials in .env.local
   - Test connection: `mysql -u ntlp_user -p`

#### Performance Optimization
- [ ] Enable Nginx gzip compression
- [ ] Configure MySQL query cache
- [ ] Set up log rotation
- [ ] Monitor memory usage

### Security Checklist
- [ ] Change default database passwords
- [ ] Configure firewall rules
- [ ] Set up SSL certificate (recommended)
- [ ] Regular security updates
- [ ] Monitor access logs

### Contact Information
- **System Administrator**: [Your Contact]
- **Database Administrator**: [Your Contact]
- **Application Support**: [Your Contact]

---
*Last Updated: August 3, 2025*
*Version: 1.0.0*
*Environment: Single Server Production (172.27.0.9)*
