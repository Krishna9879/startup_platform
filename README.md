# InvestStart - Startup Investment Platform

A comprehensive web-based platform connecting startups seeking funding with investors looking for opportunities. The platform facilitates deal management, commission tracking, and access to incubation programs across India.

## Platform Overview

InvestStart is a multi-role platform with three distinct user types:

### 1. **Investors** 
- Browse and discover high-potential startups
- Filter opportunities by industry, funding stage, and amount
- Track investments and portfolio performance
- Manage deals with transparent commission calculations (2% + 2%)
- View incubation programs and government grants

### 2. **Startups**
- Create and manage pitch profiles
- Track investor interest and inquiries
- Monitor funding progress
- Apply to incubation centers and acceleration programs
- Showcase company information and documents

### 3. **Admins**
- Oversee platform operations
- Monitor all deals and transactions
- Track commission revenue
- Manage user approvals
- View system health and analytics

## Key Features

### Investment Management
- **Smart Deal Matching**: Filter startups by industry, funding stage (Idea, MVP, Pre-launch, Series A, etc.), and budget
- **Commission Calculator**: Automatic 2% + 2% commission split between investor and startup
- **Deal Tracking**: Monitor all deals with status tracking (Posted → Under Review → Approved → Funded → Closed)
- **Portfolio Management**: Track all investments with real-time valuation updates

### Incubation & Programs Directory
- Browse incubation centers across India (IIT Delhi, NASSCOM, TiE Mumbai, etc.)
- Access government grants and funding schemes
- View acceleration programs with application tracking
- Filter by state, industry, and program type

### User Management
- Role-based authentication system
- Profile management for all user types
- Settings for notifications and security preferences
- KYC/verification support

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MySQL (scripts included)
- **Authentication**: Session-based with secure password hashing
- **Design**: Modern investment platform UI with professional theming

## Database Schema

### Key Tables
- **users**: Core user information (investors, startups, admins)
- **investor_profiles**: Investor-specific details and preferences
- **startup_profiles**: Startup company information and funding needs
- **deals**: Investment deals with commission tracking
- **incubation_centers**: Incubation center listings
- **acceleration_programs**: Grant schemes and programs
- **incubation_applications**: Applications to centers
- **messages**: Investor-startup communication

Full SQL schema available in: `/scripts/database.sql`

## Getting Started

### 1. Setup Database

Import the MySQL schema:
```bash
mysql -u root -p < scripts/database.sql
```

This creates the `startup_investor_db` database with all required tables.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Test Credentials

**Investor Account:**
- Email: `investor@example.com`
- Password: `password123`

**Startup Account:**
- Email: `startup@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@investstart.com`
- Password: `admin123`

## Platform Routes

### Public Routes
- `/` - Home/Landing page
- `/login` - Login
- `/signup` - Sign up
- `/programs` - Public programs directory

### Investor Routes
- `/dashboard/investor` - Investor dashboard
- `/investor/browse` - Browse startups with filters
- `/investor/deals` - Manage deals and track commissions
- `/investor/portfolio` - View portfolio holdings
- `/settings` - Account settings

### Startup Routes
- `/dashboard/startup` - Startup dashboard
- `/startup/pitch` - Create/edit pitch profile
- `/startup/inquiries` - View investor inquiries
- `/startup/incubation` - Apply to incubation centers
- `/settings` - Account settings

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/startups` - Startup approvals
- `/admin/deals` - Deal monitoring
- `/admin/centers` - Incubation center management

## Commission Model

### Split Commission System (2% + 2%)

For a ₹100L investment deal:

```
Investment Amount: ₹100,00,000
├─ Startup Commission (2%): ₹2,00,000
└─ Investor Commission (2%): ₹2,00,000
  Total Commission: ₹4,00,000
```

- **2% from Startup**: Deducted from amount received
- **2% from Investor**: Deducted from their investment
- Commissions calculated and displayed automatically for each deal

## Features Breakdown

### For Investors
1. **Smart Search & Filtering**
   - Filter by industry (AI/ML, FinTech, E-commerce, etc.)
   - Filter by startup stage
   - Filter by funding range (0-25L, 25-50L, 50-100L, 100L+)
   - Text search by company name or description

2. **Deal Management**
   - Create new deals with automatic commission calculation
   - Track deal status through the pipeline
   - View commission breakdown
   - Monitor investor and startup commissions separately

3. **Portfolio Tracking**
   - View all investments at a glance
   - Track current valuation vs. investment amount
   - Calculate returns by percentage
   - See portfolio performance analytics

### For Startups
1. **Pitch Management**
   - Edit company information
   - Upload pitch deck and financial reports
   - Track profile visibility
   - Monitor investor views

2. **Funding Tracking**
   - Visual progress bar for funding goal
   - Monitor investor interest count
   - Track profile views
   - Manage investor inquiries

3. **Incubation Programs**
   - Browse 100+ incubation centers
   - Apply to programs in your state
   - Track application status
   - Direct contact with centers

### For Admins
1. **Platform Monitoring**
   - Real-time platform health metrics
   - System uptime tracking
   - Total funds processed
   - Commission revenue tracking

2. **User Management**
   - Approve/reject new registrations
   - Monitor user activity
   - Track KYC verification status
   - View user statistics

3. **Deal Monitoring**
   - Monitor all active deals
   - Track transaction history
   - Commission calculation verification
   - Fraud detection alerts

## Security Features

- **Password Hashing**: PBKDF2 with salting
- **Session Management**: Secure token-based auth
- **Input Validation**: Server-side validation for all forms
- **CORS Protection**: Safe cross-origin requests
- **Rate Limiting**: Protection against brute force attacks

## Design & UI

### Color Scheme
- **Primary**: Teal (#1e5f7a) - Trust and stability for investment platform
- **Secondary**: Light gray backgrounds
- **Accents**: Blue, green, orange for data visualization
- **Professional Theme**: Investment-focused aesthetic

### Components Used
- Custom sidebar navigation
- Responsive card layouts
- Advanced filtering interfaces
- Progress bars and charts
- Status badge system
- Modal dialogs for confirmations

## API Endpoints (Mock Implementations)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Future Real Database Integration Points
- `/api/startups` - Startup listings
- `/api/investors` - Investor profiles
- `/api/deals` - Deal management
- `/api/incubation` - Incubation center data
- `/api/programs` - Program listings

## Deployment

### To Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables Needed
```
DATABASE_URL=mysql://user:password@localhost/startup_investor_db
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

## Future Enhancements

1. **Real Database Integration**
   - Connect MySQL backend with API routes
   - Implement proper ORM (Prisma/TypeORM)
   - Add migration system

2. **Payment Integration**
   - Razorpay/Stripe for commission payments
   - Escrow system for deal amounts
   - Invoice generation

3. **Communication Features**
   - In-app messaging between investors and startups
   - Email notifications
   - Deal document signing (esign)

4. **Advanced Analytics**
   - Portfolio performance metrics
   - ROI calculation
   - Trend analysis
   - Market reports

5. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline access

## File Structure

```
/app
  /api/auth - Authentication endpoints
  /admin - Admin dashboard and management pages
  /investor - Investor-specific pages
  /startup - Startup-specific pages
  /dashboard - Role-based dashboards
  /programs - Incubation programs page
  /settings - User settings
  /login, /signup - Auth pages
  page.tsx - Home page
  layout.tsx - Root layout

/components
  sidebar.tsx - Navigation sidebar
  ui/* - shadcn UI components

/lib
  auth.ts - Authentication utilities
  utils.ts - Helper functions

/scripts
  database.sql - MySQL schema

/public
  - Static assets
```

## Support & Documentation

- Database setup guide: See `/scripts/database.sql`
- API documentation: Coming soon
- User guides: Available in-app

## License

This project is created for demonstration and development purposes.

## Contact & Support

For technical support or feature requests, contact the development team.

---

**Built with Next.js 16, React 19, and Tailwind CSS**
**Version 1.0 - Beta Release**
