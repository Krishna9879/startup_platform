# InvestStart - Quick Start Guide

Get up and running with InvestStart in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- XAMPP installed (with MySQL running)

## 1. Clone & Install (1 minute)

```bash
# Navigate to project directory
cd investstart

# Install dependencies
npm install
```

## 2. Setup Database (2 minutes)

### Option A: phpMyAdmin (Easiest)
1. Open `http://localhost/phpmyadmin`
2. Click SQL tab
3. Copy-paste content of `/scripts/database.sql`
4. Click "Go"

### Option B: Command Line
```bash
mysql -u root < scripts/database.sql
```

Verify:
```bash
mysql -u root -e "USE startup_investor_db; SHOW TABLES;"
```

## 3. Start Development Server (30 seconds)

```bash
npm run dev
```

The app opens at: **http://localhost:3000**

## 4. Login with Test Account (30 seconds)

Choose one:

**Option 1 - Investor**
- Email: `investor@example.com`
- Password: `password123`

**Option 2 - Startup**
- Email: `startup@example.com`
- Password: `password123`

**Option 3 - Admin**
- Email: `admin@investstart.com`
- Password: `admin123`

## Done! 🎉

You now have a fully functional startup investment platform running locally!

---

## Quick Navigation

### For Investors:
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard/investor
- Browse Startups: http://localhost:3000/investor/browse
- My Deals: http://localhost:3000/investor/deals
- My Portfolio: http://localhost:3000/investor/portfolio

### For Startups:
- Dashboard: http://localhost:3000/dashboard/startup
- Edit Pitch: http://localhost:3000/startup/pitch
- Incubation: http://localhost:3000/startup/incubation

### For Admins:
- Dashboard: http://localhost:3000/admin

### Public:
- Programs: http://localhost:3000/programs
- Settings: http://localhost:3000/settings

---

## Key Features at a Glance

✅ **Browse Startups**
- Filter by industry, stage, funding range
- View detailed startup profiles
- Express investment interest

✅ **Manage Deals**
- Create new investment deals
- Automatic 2% + 2% commission calculation
- Track deal status

✅ **Portfolio Tracking**
- Monitor all investments
- View returns and valuation
- Analyze portfolio distribution

✅ **Incubation Programs**
- Browse 100+ programs
- Apply to incubation centers
- Track application status

✅ **Edit Your Profile**
- Update company/investor information
- Manage documents
- Adjust settings

---

## Common Tasks

### Create a New Deal (as Investor)
1. Go to `/investor/deals`
2. Click "Create Deal"
3. Enter startup name, amount, equity %
4. Commission calculates automatically
5. Click "Create Deal"

### Browse Startups (as Investor)
1. Go to `/investor/browse`
2. Use filters (industry, stage, funding)
3. Click "View" on any startup
4. Click "Express Interest"

### Edit Your Pitch (as Startup)
1. Go to `/startup/pitch`
2. Click "Edit Profile"
3. Update information
4. Click "Save Changes"

### Apply to Incubation (as Startup)
1. Go to `/startup/incubation`
2. Find center in "Browse"
3. Click "Apply Now"
4. Track status in "My Applications"

---

## Troubleshooting

### MySQL not running?
```bash
# Windows: Open XAMPP Control Panel, click "Start" for MySQL
# Mac: Open XAMPP Manager
# Linux: sudo ./opt/lampp/manager-linux-x64.run
```

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Database not created?
```bash
# Create manually
mysql -u root -e "CREATE DATABASE startup_investor_db;"

# Then import
mysql -u root startup_investor_db < scripts/database.sql
```

### Can't login?
- Check test credentials in this file
- Credentials are hardcoded for demo
- Try logging out and back in

---

## Next: Real Database Integration

The app currently uses **mock data**. To use real MySQL:

1. Update API routes in `/app/api/`
2. Install: `npm install mysql2`
3. Create database connection
4. Replace mock queries with real queries

See `README.md` for detailed integration steps.

---

## Resources

- **Setup Guide**: See `SETUP_GUIDE.md`
- **All Features**: See `FEATURES.md`
- **Build Summary**: See `BUILD_SUMMARY.md`
- **Full Documentation**: See `README.md`

---

## Support

Stuck? Check:
1. SETUP_GUIDE.md - Detailed instructions
2. FEATURES.md - Complete feature list
3. README.md - Project documentation

---

**Happy investing! 🚀**

Built with ❤️ using Next.js, React & TypeScript
