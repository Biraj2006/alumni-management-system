# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Alumni Management System - a full-stack application connecting alumni, students, and administrators for a college/university. Three user roles (admin, alumni, student) with alumni requiring admin approval before access.

## Development Commands

### Backend (from `backend/`)
```powershell
npm run dev      # Start with nodemon (hot reload)
npm start        # Production start
```

### Frontend (from `frontend/`)
```powershell
npm start        # Start dev server (port 3000)
npm run build    # Production build
npm test         # Run tests (Jest via react-scripts)
```

### Database Setup
```sql
-- Run backend/database/schema.sql in MySQL to initialize
-- Default admin: admin@college.edu / admin123
```

### Environment
Copy `backend/.env.example` to `backend/.env` and configure:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` for MySQL
- `JWT_SECRET` for authentication
- Frontend proxies to `http://localhost:5000` via package.json

## Architecture

### Backend (Node.js/Express + MySQL)
```
backend/
├── config/db.js          # MySQL connection pool
├── controllers/          # Request handlers (business logic)
├── middleware/
│   ├── auth.js          # JWT auth + role guards (authenticate, isAdmin, isAlumni, isStudent, isApproved)
│   └── validation.js    # express-validator rules
├── models/              # Data access layer (static class methods with raw SQL)
├── routes/              # Express route definitions
└── server.js            # App entry point
```

**API Base**: `/api` with routes for `/auth`, `/users`, `/alumni`, `/mentorship`, `/announcements`, `/jobs`

**Auth Flow**: JWT in Authorization header (`Bearer <token>`). Alumni must be approved (`is_approved`) before accessing protected resources.

### Frontend (React 18 + React Router 6)
```
frontend/src/
├── context/AuthContext.jsx   # Auth state via Context API (useAuth hook)
├── services/api.js          # Axios instance with interceptors for token injection
├── components/              # Shared UI (Navbar, ProtectedRoute, LoadingSpinner)
└── pages/
    ├── admin/               # Admin dashboard views
    ├── alumni/              # Alumni profile, jobs, mentorship views
    └── student/             # Student dashboard views
```

**State**: Auth state in `AuthContext`, token persisted in `localStorage`. API interceptor auto-redirects to `/login` on 401.

### Data Model
- **users**: Base table for all user types with `role` ENUM (admin/alumni/student)
- **alumni_profiles** / **student_profiles**: Extended info linked to users via `user_id`
- **mentorship_requests**: Student→Alumni with status (pending/accepted/rejected)
- **announcements**: Targeted to all/alumni/students
- **job_postings**: Posted by alumni, toggleable `is_active` status

## Code Patterns

**Models**: Static class methods returning raw query results (no ORM). Password hashing via bcryptjs.

**Controllers**: Async/await with try-catch, errors passed to Express error handler.

**Validation**: Middleware arrays using express-validator, exported from `middleware/validation.js`.

**Frontend API Calls**: Use exported functions from `services/api.js` (e.g., `authAPI.login()`, `jobsAPI.create()`).
