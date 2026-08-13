# JobNest — Backend API

JobNest is a full-featured job portal platform connecting candidates with employers. This repository contains the **backend REST API**, built with Express, TypeScript, PostgreSQL, and Prisma ORM.

🔗 **Live API:** https://jobnest-backend-kappa.vercel.app

🔗 **Frontend Repository:** [jobnest-frontend](https://github.com/kibriarobin/jobnest-frontend)

🔗 **Live Website:** https://jobnest-frontend-three.vercel.app

---

## ✨ Features

- **Role-based Authentication** — Candidate, Employer, and Admin roles with JWT (access + refresh tokens) and Google OAuth (candidate-only)
- **Job Management** — Full CRUD with an admin approval workflow (Pending → Approved/Rejected/Closed)
- **Application Pipeline** — Candidates apply to jobs; employers manage applicants through a status pipeline (Applied → Shortlisted → Interview → Hired/Rejected)
- **Company Profiles** — Employer company pages with admin verification
- **Category Management** — Admin-managed job categories
- **Saved Jobs** — Candidates can bookmark jobs for later
- **Company Reviews** — Candidates can review companies after completing an interview stage
- **Analytics** — Role-specific dashboards with aggregated stats and chart-ready data (candidate, employer, and admin overviews)
- **Search & Filtering** — Job listing supports search, category/location/type filters, and pagination
- **Centralized Error Handling** — Consistent error responses across Prisma, Zod, and custom application errors

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, Express |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (multi-file schema) |
| Auth | JWT (`jsonwebtoken`), Passport.js (Google OAuth 2.0) |
| Validation | Zod |
| Security | bcrypt, CORS, cookie-based auth |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app.ts                  # Express app configuration
├── server.ts                # Server entry point
├── config/                  # Environment configuration
├── errors/                  # Custom AppError class
├── middlewares/              # auth, validateRequest, error handlers
├── utils/                   # catchAsync, sendResponse, JWT helpers, passport
├── lib/                      # Prisma client instance
└── modules/
    ├── auth/                # Register, login, refresh token, Google OAuth
    ├── user/                # Profile management (candidate/employer/admin)
    ├── category/             # Job category CRUD
    ├── job/                  # Job CRUD, approval workflow, filtering
    ├── application/          # Job applications, status pipeline
    ├── savedJob/             # Bookmark jobs
    ├── review/                # Company reviews
    ├── company/               # Company profiles, admin verification
    └── analytics/             # Dashboard statistics

prisma/
├── schema/                  # Multi-file Prisma schema
│   ├── schema.prisma          # Generator + datasource
│   ├── enums.prisma
│   ├── user.prisma
│   ├── company.prisma
│   ├── category.prisma
│   ├── job.prisma
│   ├── application.prisma
│   └── review.prisma
└── migrations/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm / npm
- PostgreSQL database (e.g. [Neon](https://neon.tech))

### Installation

```bash
git clone https://github.com/kibriarobin/jobnest-backend.git
cd jobnest-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host:5432/jobnest?sslmode=require"
CLIENT_URL="http://localhost:3000"

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=12

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

SESSION_SECRET="your-session-secret"
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Run the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 📡 API Overview

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, refresh token, logout, Google OAuth |
| Users | `/api/users` | Profile CRUD, admin user management |
| Categories | `/api/categories` | Job category CRUD |
| Jobs | `/api/jobs` | Job CRUD, public listing, admin approval |
| Applications | `/api/applications` | Apply, withdraw, employer status management |
| Saved Jobs | `/api/saved-jobs` | Bookmark/unbookmark jobs |
| Reviews | `/api/reviews` | Submit and view company reviews |
| Companies | `/api/companies` | Public company listing, admin verification |
| Analytics | `/api/analytics` | Role-based dashboard statistics |

All protected routes require a valid JWT sent via httpOnly cookies (`accessToken`) or the `Authorization: Bearer <token>` header.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Candidate | demo.candidate@jobnest.com | demo1234 |
| Employer | demo.employer@jobnest.com | demo1234 |
| Admin | demo.admin@jobnest.com | demo1234 |

---

## 🏗️ Architecture Notes

- **Modular structure** — each domain (auth, job, application, etc.) has its own route, controller, service, and validation files
- **Centralized error handling** — Zod validation errors, Prisma known errors, and custom `AppError` instances are normalized into consistent JSON responses
- **Role-based access control** — a reusable `auth(...allowedRoles)` middleware protects routes by role
- **Soft deletes** — jobs use an `isDeleted` flag rather than hard deletion to preserve data integrity

---

## 👤 Author

**Golam Kibria Robin**
[GitHub](https://github.com/kibriarobin) · [LinkedIn](https://linkedin.com/in/golam-kibria97)

Built as part of the Programming Hero "Next Level Web Development" — AI-Driven Software Engineering Bootcamp.
