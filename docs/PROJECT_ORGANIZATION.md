# Project Organization & Structure Guide

## 📁 Current Organized Structure

### Root Directory
```
/home/peter/Desktop/dev/ntlp/
├── app/                  # Next.js application pages and API routes
├── components/           # Reusable React components
├── lib/                 # Utility libraries and data management
├── database/            # Database schema and related files
├── config/              # Configuration files (Nginx, etc.)
├── scripts/             # Deployment and utility scripts
├── docs/                # Documentation files
├── public/              # Static assets and uploads
├── .env.local           # Local environment variables
├── .env.production      # Production environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Node.js dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── postcss.config.js    # PostCSS configuration
└── README.md            # Main project documentation
```

### App Directory (`app/`)
```
app/
├── globals.css          # Global styles
├── layout.tsx           # Root layout component
├── page.tsx             # Homepage
├── about/               # About page
├── admin/               # Admin dashboard
│   ├── layout.tsx      # Admin layout
│   ├── page.tsx        # Admin dashboard
│   ├── dashboard/      # Dashboard sections
│   └── contacts/       # Contact management
├── agenda/              # Conference agenda
├── api/                 # API routes
│   ├── abstracts/      # Abstract management API
│   ├── admin/          # Admin API routes
│   ├── auth/           # Authentication API
│   ├── contacts/       # Contact form API
│   └── registrations/  # Registration API
├── abstracts/           # Abstract submission pages
├── contact/             # Contact pages
├── partners/            # Partner/sponsor pages
├── register/            # Registration pages
└── speakers/            # Speaker information pages
```

### Components Directory (`components/`)
```
components/
├── AnalyticsCharts.tsx       # Dashboard analytics
├── ConditionalLayout.tsx     # Layout components
├── Footer.tsx                # Site footer
├── HeroBackgroundSlideshow.tsx  # Hero section
├── HomeSlideshow.tsx         # Homepage slideshow
├── LoadingComponents.tsx     # Loading states
├── Modal.tsx                 # Modal system
├── Navbar.tsx               # Navigation bar
├── NotificationSystem.tsx   # Notifications
├── SecurityDashboard.tsx    # Security components
├── Toast.tsx                # Toast notifications
├── UgandaStripe.tsx         # Uganda themed elements
└── VideoBackground.tsx      # Video backgrounds
```

### Library Directory (`lib/`)
```
lib/
├── mysql.ts             # Database connection and management
├── dataManager.ts       # Data access layer
└── security.ts          # Security utilities
```

### Configuration Directory (`config/`)
```
config/
└── ntlp-conference.conf  # Nginx server configuration
```

### Scripts Directory (`scripts/`)
```
scripts/
├── deploy-ubuntu.sh     # Ubuntu deployment script
└── setup-mysql.sh       # MySQL database setup
```

### Documentation Directory (`docs/`)
```
docs/
├── UBUNTU_NGINX_DEPLOYMENT.md    # Complete Ubuntu deployment guide
├── MYSQL_SETUP.md                # Database setup instructions
└── SINGLE_SERVER_DEPLOYMENT.md   # Single server deployment guide
```

### Database Directory (`database/`)
```
database/
└── schema.sql           # MySQL database schema
```

### Public Directory (`public/`)
```
public/
├── favicon.ico
├── icon.png
├── images/              # Static images
│   ├── abstract.jpg
│   ├── charles.jpeg
│   ├── diana.jpeg
│   ├── home1.jpeg
│   ├── home2.jpg
│   ├── idi-logo.png
│   ├── ruth.jpeg
│   ├── uganda-coat-of-arms.png
│   └── who-logo.png
└── uploads/             # User uploaded files
    └── abstracts/       # Abstract file uploads
```

## ✅ Organization Checklist

### File Organization
- [x] **Application Code**: Properly organized in `app/` directory following Next.js App Router conventions
- [x] **Components**: All reusable React components in `components/` directory
- [x] **Utilities**: Database and utility functions in `lib/` directory
- [x] **Configuration**: Server configurations in `config/` directory
- [x] **Scripts**: Deployment and utility scripts in `scripts/` directory
- [x] **Documentation**: All documentation in `docs/` directory
- [x] **Database**: Schema files in `database/` directory
- [x] **Static Assets**: Images and uploads properly organized in `public/`

### Configuration Files
- [x] **Environment Variables**: Properly configured `.env.local` and `.env.production`
- [x] **Next.js Config**: Optimized `next.config.js` for production
- [x] **TypeScript Config**: Proper `tsconfig.json` configuration
- [x] **Tailwind Config**: Optimized `tailwind.config.js`
- [x] **PostCSS Config**: Basic `postcss.config.js`
- [x] **Nginx Config**: Production-ready Nginx configuration in `config/`

### Deployment Files
- [x] **Ubuntu Deployment**: Comprehensive `scripts/deploy-ubuntu.sh`
- [x] **MySQL Setup**: Automated `scripts/setup-mysql.sh`
- [x] **Documentation**: Complete deployment guides in `docs/`

### Security & Best Practices
- [x] **File Permissions**: Proper separation of scripts and configuration
- [x] **Environment Security**: Sensitive data in environment files
- [x] **Upload Security**: Secure file upload handling
- [x] **Database Security**: Proper MySQL user and permissions setup

## 🚀 Deployment Structure

### Production Directory Layout (`/var/www/ntlp/`)
```
/var/www/ntlp/
├── app/                 # Application code
├── components/          # React components
├── lib/                # Utilities
├── public/             # Static assets
│   └── uploads/        # File uploads (with proper permissions)
├── .env.local          # Production environment
├── .next/              # Built application (generated)
├── node_modules/       # Dependencies (generated)
└── package.json        # Dependencies
```

### System Integration
- **Nginx**: Configuration in `/etc/nginx/sites-available/ntlp`
- **PM2**: Process management for Node.js application
- **MySQL**: Database running on localhost (127.0.0.1)
- **UFW**: Firewall configured for security
- **Backups**: Automated backups in `/var/backups/ntlp/`

## 📋 Maintenance Structure

### Log Files
- **Application**: PM2 logs (`pm2 logs ntlp-production`)
- **Nginx**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- **MySQL**: `/var/log/mysql/error.log`

### Backup System
- **Database**: Daily automated MySQL dumps
- **Files**: Daily backup of uploads directory
- **Retention**: 7 days of backup history

### Monitoring Points
- **Application Health**: PM2 status monitoring
- **Server Resources**: CPU, memory, disk usage
- **Network**: Connection and bandwidth monitoring
- **Security**: Log monitoring and intrusion detection

## 🔧 Development vs Production

### Development Structure
- Source files in development directory
- Hot reloading and development tools
- Local database connection
- Development environment variables

### Production Structure
- Compiled application in `/var/www/ntlp/`
- Process management with PM2
- Nginx reverse proxy
- Production environment variables
- SSL/TLS configuration (optional)
- Automated backups and monitoring

---

This organized structure ensures:
1. **Scalability**: Easy to add new features and components
2. **Maintainability**: Clear separation of concerns
3. **Security**: Proper file permissions and access controls
4. **Deployment**: Automated and reliable deployment process
5. **Documentation**: Comprehensive guides for all aspects
