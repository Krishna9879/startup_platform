# InvestStart Platform - Complete Setup Guide

This guide will help you set up and run the InvestStart startup investment platform locally using XAMPP and the provided MySQL scripts.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- XAMPP (with MySQL) - Download from [apachefriends.org](https://www.apachefriends.org/)
- A code editor (VS Code recommended)

## Step 1: Install XAMPP and Start MySQL

### Windows/Mac
1. Download and install XAMPP from the official website
2. Open XAMPP Control Panel
3. Click "Start" next to Apache and MySQL

### Linux
```bash
sudo apt-get install xampp
cd /opt/lampp
sudo ./manager-linux-x64.run
```

Verify MySQL is running:
```bash
mysql -u root -p
# Enter when prompted (default password is empty)
```

## Step 2: Create the Database

### Option A: Using phpMyAdmin (Easiest)

1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click on "SQL" tab at the top
3. Copy-paste the entire content from `/scripts/database.sql`
4. Click "Go" to execute

### Option B: Using Command Line

```bash
# Navigate to the project directory
cd path/to/investstart

# Import the database
mysql -u root < scripts/database.sql

# Verify the database was created
mysql -u root -e "SHOW DATABASES;" | grep startup_investor_db
```

## Step 3: Verify Database Setup

Connect to the database and check tables:

```bash
mysql -u root startup_investor_db

# List all tables
SHOW TABLES;

# Check users table
SELECT * FROM users;

# Exit
EXIT;
```

You should see 11 tables created:
- users
- investor_profiles
- startup_profiles
- deals
- incubation_centers
- acceleration_programs
- incubation_applications
- investor_interests
- messages
- admin_activity_log
- (and indices)

## Step 4: Setup the Next.js Application

### Install Dependencies

```bash
# Navigate to project directory
cd path/to/investstart

# Install all dependencies
npm install
# or
yarn install
```

### Set Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection (currently using mock data, ready for real DB integration)
DATABASE_URL=mysql://root@localhost:3306/startup_investor_db

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET_KEY=your-secret-key-here

# JWT/Auth
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE_IN=7d
```

## Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:3000`

## Step 6: Access the Platform

### Test Accounts

Use these credentials to log in:

#### Investor Account
- Email: `investor@example.com`
- Password: `password123`
- Role: Investor

#### Startup Account
- Email: `startup@example.com`
- Password: `password123`
- Role: Startup

#### Admin Account
- Email: `admin@investstart.com`
- Password: `admin123`
- Role: Admin

## Troubleshooting

### MySQL Connection Issues

**Error: "Connection refused"**
```bash
# Check if MySQL is running
mysql -u root

# If not running, restart XAMPP
# Windows: Open XAMPP Control Panel and click "Start" for MySQL
# Mac: Use XAMPP Manager
# Linux: sudo ./opt/lampp/manager-linux-x64.run
```

**Error: "Access denied for user 'root'@'localhost'"**
```bash
# MySQL default has no password
# Try:
mysql -u root

# If still fails, reset password:
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '';"
```

### Database Import Issues

**Error: "Unknown database"**
```bash
# The database.sql file should create it automatically
# If not, create manually:
mysql -u root -e "CREATE DATABASE startup_investor_db;"

# Then import:
mysql -u root startup_investor_db < scripts/database.sql
```

**Error: "Syntax error in line X"**
- Ensure you're using the correct character encoding (UTF-8)
- Try using phpMyAdmin's import feature instead of command line

### Node.js/npm Issues

**Error: "npm: command not found"**
```bash
# Install Node.js from nodejs.org
# Then verify:
node --version
npm --version
```

**Error: "Port 3000 already in use"**
```bash
# Change the port:
npm run dev -- -p 3001

# Or kill the process using port 3000:
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

## Database Structure Overview

### Users Table
Stores all user accounts (investors, startups, admins)
- Unique email addresses
- Hashed passwords using PBKDF2
- Role-based access control

### Investor Profiles
Extended profile for investor users
- Investment budget and preferences
- Industry interests
- Portfolio tracking fields

### Startup Profiles
Company information for startup users
- Funding requirements
- Company stage and industry
- Pitch information and documents

### Deals Table
Investment deals between investors and startups
- Commission calculation (2% + 2% split)
- Deal status tracking
- Investor and startup commission amounts

### Incubation Centers & Programs
Directory data for government programs and incubators
- Location-based filtering
- Program eligibility
- Contact information

## Database Backup & Restore

### Backup the Database

```bash
# Create a backup
mysqldump -u root startup_investor_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup all databases
mysqldump -u root --all-databases > full_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup

```bash
# Restore specific database
mysql -u root startup_investor_db < backup_20240208_120000.sql

# Restore all databases
mysql -u root < full_backup_20240208_120000.sql
```

## Next Steps: Real Database Integration

The current application uses **mock data** for demonstration. To integrate the real database:

1. **Update API Routes** in `/app/api/`:
   - Install MySQL library: `npm install mysql2 promise`
   - Create database connection pool
   - Replace mock queries with real queries

2. **Create API Endpoints** for:
   - User authentication and profiles
   - Startup listings and details
   - Deal management
   - Incubation center data

3. **Implement Queries** for:
   - Filtering startups by industry, stage, funding
   - Commission calculations on deal creation
   - Portfolio tracking and valuation updates
   - User management and approvals

## Performance Optimization

### Database Indexing
The included schema has indices on frequently queried fields:
- email in users table
- industry, stage, status in startup_profiles
- Foreign keys for relationships

### Query Optimization Tips
- Use indexed fields in WHERE clauses
- Limit results with LIMIT clause
- Use appropriate JOIN types
- Monitor slow query log in XAMPP

## Security Notes

### Password Storage
Current implementation uses PBKDF2. For production:
```bash
npm install bcrypt
```

Replace in `/lib/auth.ts`:
```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
```

### SQL Injection Prevention
- Always use parameterized queries
- Never concatenate user input directly into SQL
- Validate and sanitize all inputs

### Data Protection
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Store sensitive data encrypted
- Regular security audits

## Deployment Checklist

- [ ] Database migrated to production MySQL server
- [ ] Environment variables updated
- [ ] API routes connected to real database
- [ ] Authentication system tested
- [ ] Commission calculations verified
- [ ] Payment integration added (if applicable)
- [ ] Email notifications configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing done

## Support & Resources

- **Database Issues**: MySQL Documentation - [dev.mysql.com](https://dev.mysql.com)
- **Next.js Help**: [nextjs.org/docs](https://nextjs.org/docs)
- **React Documentation**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## Project Structure Quick Reference

```
investstart/
├── app/
│   ├── api/auth/          # Authentication endpoints
│   ├── admin/             # Admin pages
│   ├── investor/          # Investor pages
│   ├── startup/           # Startup pages
│   ├── dashboard/         # Role dashboards
│   ├── programs/          # Programs directory
│   ├── login/signup       # Auth pages
│   └── page.tsx           # Home page
├── components/
│   ├── sidebar.tsx        # Main navigation
│   └── ui/                # shadcn UI components
├── lib/
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Helper functions
├── scripts/
│   └── database.sql       # MySQL schema
├── public/                # Static assets
├── README.md              # Project documentation
└── SETUP_GUIDE.md         # This file
```

---

**Happy developing! If you encounter any issues, refer to the troubleshooting section or check the project README.**

Last Updated: February 2024
