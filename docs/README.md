# JobTracker

A modern, full-stack personal job application tracker and career management CRM. Built with a decoupled architecture featuring **React 19** + **TypeScript** on the frontend and **Laravel 13** on the backend.

> [!NOTE]
> **Single-Tenant Personal Application**: This project is intentionally designed for personal use by the owner. There is **no public registration page** by design; the owner account is initialized and seeded directly via environment configuration and database seeders.

---

## Architecture & Tech Stack

```
job-tracker/
├── frontend/     # React 19 + TypeScript + Vite + Tailwind CSS v4
├── backend/      # Laravel 13 API + Laravel Sanctum (SPA Authentication) + Resend Mail
└── docs/         # Documentation & Guides
```

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Geist font
- **State & Data Fetching**: `@tanstack/react-query` v5 (automatic caching, invalidations, and deduplication)
- **Data Table**: `@tanstack/react-table` v9
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **UI Components**: Shadcn UI / Base UI

### Backend
- **Framework**: Laravel 13 (PHP 8.3+)
- **Authentication**: Laravel Sanctum (Cookie-based SPA Session Auth with CSRF protection)
- **Database**: PostgreSQL (Supabase) or SQLite (zero-config local)
- **Email & Notifications**: Resend (`resend/resend-laravel`) for transactional email delivery
- **Task Scheduling**: Laravel Scheduler for automated daily interview reminders
- **Scraping & Metadata Extraction**: Native PHP `DOMDocument`, `DOMXPath`, and JSON-LD schema parsing

---

## Key Features

- **Application Pipeline**: Track jobs across stages (`Saved`, `Applied`, `Interviewing`, `Offered`, `Rejected`) with notes, referral flags, salary targets, and dates.
- **Smart URL Scraping & Auto-Fill**:
  - Paste any job posting URL (LinkedIn, Lever, Greenhouse, Workable, Ashby, etc.) to automatically extract and populate **Company Name** and **Role Title**.
  - Includes dedicated LinkedIn title parser (`"{Company} hiring {Role} in {Location}"`) with graceful fallback to manual entry if unparseable.
- **Automated Interview Reminders (Resend)**:
  - Daily scheduled cron (`applications:send-interview-reminders` at 09:00 AM) scans for interviews scheduled for the next day.
  - Sends formatted email notifications with interview dates, company details, role names, and direct links to view the application in the web app.
- **Overview Dashboard & Analytics**:
  - Live KPIs: Total applications, active interviews, offers, and rejection ratios.
  - Interactive Recharts visualization showing status distributions and application trends.
- **Interactive Calendar**:
  - Track upcoming interviews and follow-up deadlines by month/week with direct modal previews.
- **Candidate Profile & Career Hub**:
  - Centralized candidate identity: Headline, bio, target roles, preferred workplace modes (`Remote`, `Hybrid`, `On-site`), and target compensation.
  - Primary resume manager and live pipeline activity stats.
- **Settings & Preferences**:
  - Email verification indicator, theme switcher (`Light`, `Dark`, `System`), and notification toggles.
- **Collapsible Sidebar**:
  - Modern collapsible sidebar supporting both expanded (`w-64`) and compact icon-only (`w-[68px]`) modes with persistent state in `localStorage`.
- **Password Visibility Toggle**:
  - Interactive open/close eye toggle on the login page for effortless credential entry.

---

## Getting Started

### Prerequisites
- **PHP** 8.3 or higher & **Composer**
- **Node.js** 20+ & **npm**
- **Laravel Herd** (recommended on Windows/macOS) or PHP CLI

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your owner account, database, and Resend credentials in `.env`:
   ```env
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173

   # Database (SQLite or Supabase / PostgreSQL)
   DB_CONNECTION=pgsql
   DB_HOST=aws-0-ap-southeast-2.pooler.supabase.com
   DB_PORT=6543
   DB_DATABASE=postgres
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   # Owner account credentials (seeded automatically)
   SEED_ADMIN=true
   ADMIN_EMAIL=your-email@example.com
   ADMIN_NAME="Your Name"
   ADMIN_PASSWORD=your-secure-password

   # Email Delivery (Resend)
   MAIL_MAILER=resend
   RESEND_API_KEY=re_your_api_key_here
   MAIL_FROM_ADDRESS="onboarding@resend.dev"
   MAIL_FROM_NAME="${APP_NAME}"
   ```

5. Generate application key, run migrations, and seed the owner account:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```

6. Start the backend API server:
   ```bash
   php artisan serve
   ```
   *The API will be available at `http://localhost:8000`.*

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Create or verify `.env` (optional, defaults to `http://localhost:8000`):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be available at `http://localhost:5173`.*

---

## Authentication & Access

Because this is a personal workspace:
1. Open `http://localhost:5173/login`.
2. Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in your backend `.env`.
3. Toggle the password eye icon to inspect credentials if needed.
4. Click **Log in** to start tracking jobs.

Sanctum manages first-party session cookies with `withCredentials: true` and `withXSRFToken: true`, ensuring smooth authentication and CSRF security across all endpoints.

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/
│   │   │       └── SendInterviewReminders.php # Daily interview reminder command
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/                          # Sanctum login & session handlers
│   │   │   ├── JobApplicationController.php    # Full CRUD & Calendar endpoints
│   │   │   └── ScrapeJobUrlController.php      # OpenGraph, JSON-LD & LinkedIn parser
│   │   ├── Models/
│   │   │   ├── JobApplication.php
│   │   │   └── User.php
│   │   ├── Notifications/
│   │   │   └── JobApplicationReminder.php     # Resend email notification
│   │   └── Policies/
│   ├── config/
│   │   ├── mail.php                           # Resend transport configuration
│   │   └── services.php                       # Resend API key configuration
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       ├── AdminSeeder.php                # Seeds owner account from .env
│   │       └── DatabaseSeeder.php
│   └── routes/
│       ├── api.php                            # API route declarations
│       └── console.php                        # Scheduled tasks (daily 9:00 AM reminder)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                        # Sidebar, MobileNav, Nav config
│   │   │   └── ui/                            # Reusable design system primitives
│   │   ├── features/
│   │   │   ├── auth/                          # Login form & useAuthSession hook
│   │   │   ├── calendar/                      # Calendar view & event queries
│   │   │   ├── job-track/                     # Job table, JobForm, jobService
│   │   │   ├── settings/                      # Theme, Email verification, Notifications
│   │   │   └── stats/                         # Overview KPIs & Recharts
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx                  # Main layout with sticky sidebar & header toggle
│   │   │   └── AuthLayout.tsx                 # Clean centered layout for login
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── JobsPage.tsx
│   │   │   ├── JobDetailPage.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── lib/
│   │   │   └── api.ts                         # Axios instance with Sanctum CSRF config
│   │   ├── App.tsx                            # Client routes & protected route guards
│   │   └── main.tsx                           # TanStack QueryClient provider setup
│   └── package.json
```

---

## Useful Development Scripts

### Frontend
- `npm run dev` — Start the local development server with HMR.
- `npm run build` — Type-check with `tsc` and produce an optimized production bundle with Vite.
- `npm run lint` — Run ESLint across all TypeScript and React source files.

### Backend
- `php artisan serve` — Run local PHP development server.
- `php artisan migrate` — Execute pending database migrations.
- `php artisan db:seed` — Re-seed the owner administrator account.
- `php artisan applications:send-interview-reminders` — Manually trigger the interview reminder email job.
- `php artisan schedule:run` / `php artisan schedule:work` — Execute scheduled background tasks.
- `php artisan route:list` — List all registered API endpoints.
- `php artisan test` — Run automated backend test suites.

