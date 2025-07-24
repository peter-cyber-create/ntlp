# The Communicable and Non-Communicable Diseases Conference 2025

A professional Next.js website for The Communicable and Non-Communicable Diseases Conference 2025 - "United Action Against Communicable and Non-Communicable Diseases", showcasing Uganda's premier health conference organized by the Ministry of Health Uganda with a comprehensive admin dashboard.

## 🚀 Key Features

### Public Website
- **Modern Design**: Clean, professional design built with Next.js 14 and Tailwind CSS
- **Responsive**: Fully responsive design that works on all devices
- **Performance**: Optimized for speed and SEO
- **Professional Pages**:
  - Homepage with hero section and key features
  - About page with mission and vision
  - Detailed agenda with 3-day schedule
  - Speaker profiles and featured experts
  - Partners and sponsorship opportunities
  - Contact page with form and information
  - Registration page with ticket selection

### Admin Dashboard
- **Authentication**: Secure login system (demo: admin/conference2025)
- **Comprehensive Analytics**: Interactive charts and dashboards with Recharts
- **Registration Management**: View, filter, and manage event registrations
- **Contact Management**: Handle contact form submissions and inquiries
- **Speaker Management**: Review and manage speaker applications
- **Settings Panel**: Configure event details, tickets, and system settings
- **Data Export**: CSV export functionality for all data types
- **Real-time Statistics**: Live dashboard with key metrics and KPIs

### Technical Features
- **MySQL Database**: Robust MySQL database with connection pooling
- **Interactive Charts**: Registration trends, geographic distribution, ticket analytics
- **Notification System**: Toast notifications for user feedback
- **Modal Components**: Reusable modal system for confirmations and forms
- **Loading States**: Skeleton components and loading spinners
- **Search & Filter**: Advanced filtering across all admin sections

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

### Database
- **MySQL**: Production-grade relational database
- **mysql2**: High-performance MySQL driver for Node.js
- **Connection Pooling**: Optimized database connections

### Production
- **Static Export**: Configured for static site generation
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm package manager
- MySQL 8.0+ database server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ntlp-conference-2025
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
```bash
./setup-mysql.sh
```

4. Build and start the production server:
```bash
npm run build
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run export` - Export static site

## 🚀 Ubuntu Server Deployment

For production deployment on Ubuntu server:

```bash
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

## 🏗️ Project Structure

```
tb/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── agenda/            # Agenda page
│   ├── contact/           # Contact page
│   ├── partners/          # Partners page
│   ├── register/          # Registration page
│   ├── speakers/          # Speakers page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Footer.tsx        # Footer component
│   └── Navbar.tsx        # Navigation component
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

### Colors

- **Primary**: Green tones (#22c55e, #16a34a, #15803d)
- **Secondary**: Neutral grays
- **Accent**: Blue, orange, purple variants for different content types

### Components

- **Buttons**: Primary and secondary button styles
- **Cards**: Consistent card designs for content sections
- **Typography**: Responsive text sizing with clear hierarchy
- **Layout**: Container and section padding utilities

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Static Export

The site is configured for static export with:
- `output: 'export'` in next.config.js
- Unoptimized images for static hosting
- Trailing slashes for better compatibility

### SEO

Each page includes:
- Proper meta titles and descriptions
- Structured markup
- Open Graph tags (can be added)

## 🚀 Deployment

The site can be deployed to any static hosting service:

1. Build and export:
```bash
npm run export
```

2. Upload the `out/` directory to your hosting service

Popular hosting options:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Cloudflare Pages

## 📧 Contact Information

For questions about the summit:
- **Email**: info@health.go.ug
- **Phone**: +256 414 340 872
- **Location**: Speke Resort Munyonyo, Kampala, Uganda

## 🤝 Contributing

This is a conference website. For updates or improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary to The Communicable and Non-Communicable Diseases Conference organization.

---

**The Communicable and Non-Communicable Diseases Conference 2025** - United Action Against Disease

## 🔧 Admin Dashboard

### Access
- **URL**: `/admin`
- **Demo Credentials**:
  - Username: `admin`
  - Password: `conference2025`

### Features

#### Overview Dashboard
- Real-time statistics and KPIs
- Recent registration and contact activities
- Quick access to all major functions

#### Registration Management
- View all event registrations
- Filter by status, ticket type, and date
- Export registration data to CSV
- Update registration status

#### Contact Management
- Handle contact form submissions
- Update inquiry status (new, replied, resolved)
- Filter and search contacts
- Response tracking

#### Speaker Management
- Review speaker applications
- Approve/reject applications
- View speaker expertise and session proposals
- Track speaker status and statistics

#### Analytics Dashboard
- Interactive charts showing:
  - Registration trends over time
  - Ticket type distribution
  - Geographic distribution of attendees
  - Contact status analytics
  - Key performance metrics

#### Settings Panel
- Event configuration (name, date, location)
- Email settings and notifications
- Ticket type management
- Security settings
- Data import/export tools

### Data Management
The admin system uses localStorage for demo purposes but is designed to easily integrate with a backend database. All data operations are abstracted through the `DataManager` class in `lib/dataManager.ts`.
