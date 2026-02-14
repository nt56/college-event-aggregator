# 🎓 College Event Aggregator

A centralized SaaS platform where colleges publish events and students discover, register, and participate — all from one place. Built to solve the problem of fragmented event information across colleges.

---

## 📖 About the Project

College students often miss events because information is scattered across WhatsApp groups, notice boards, Instagram pages, and college websites. **College Event Aggregator** is a unified platform that brings all college events into a single, browsable, and searchable hub.

**Key goals:**

- Students can discover events across colleges and register in a few clicks
- Organizers can create, manage events and track participant lists
- Admins can manage the entire platform — users, colleges, and events

**Current status:** Phase 1 (Core MVP) — Backend complete with full REST API, authentication, and role-based access control. Frontend development is next.

---

## ⚙️ Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| **Framework**   | Next.js 16 (App Router)                     |
| **Language**    | TypeScript                                  |
| **Database**    | MongoDB with Mongoose ODM                   |
| **Auth**        | Better Auth (Email/Password, session-based) |
| **Validation**  | Zod v4                                      |
| **Styling**     | Tailwind CSS v4                             |
| **Runtime**     | Node.js 18+                                 |
| **Package Mgr** | npm                                         |

---

## 👥 User Roles & Permissions

| Capability                    | Student | Organizer | Admin |
| ----------------------------- | ------- | --------- | ----- |
| Browse & search events        | ✅      | ✅        | ✅    |
| Register / cancel for events  | ✅      | ✅        | ✅    |
| View own registrations        | ✅      | ✅        | ✅    |
| Create & manage events        | ❌      | ✅        | ✅    |
| View event participant list   | ❌      | ✅ (own)  | ✅    |
| Manage all users & roles      | ❌      | ❌        | ✅    |
| Manage & verify colleges      | ❌      | ❌        | ✅    |
| Delete any event/user/college | ❌      | ❌        | ✅    |

> **Security:** Every new user is assigned the `student` role. Only an admin can promote users to `organizer` or `admin` via the API. Users **cannot** set their own role.

---

## 🗄️ Data Models

### User

`firstName`, `lastName`, `email`, `gender`, `dateOfBirth`, `phone`, `role` (student/organizer/admin), `collegeId`, `bio`, `authUserId`

### College

`name`, `location`, `isVerified`

### Event

`title`, `description`, `date`, `venue`, `organizerId`, `collegeId`, `registrationDeadline`, `capacity`, `status` (upcoming/closed/completed), `category` (workshop/seminar/cultural/sports/technical/social/other)

### Registration

`eventId`, `studentId`, `registeredAt` — with unique index on `(eventId, studentId)` to prevent duplicates

---

## 🔌 API Reference

### Authentication

| Endpoint             | Method | Auth     | Description                       |
| -------------------- | ------ | -------- | --------------------------------- |
| `/api/auth/register` | POST   | No       | Register a new account (student)  |
| `/api/auth/login`    | POST   | No       | Login with email & password       |
| `/api/auth/sign-out` | POST   | Required | Logout current session            |
| `/api/auth/profile`  | GET    | Required | Get current user's profile        |
| `/api/auth/profile`  | PATCH  | Required | Update profile (name, phone, bio) |
| `/api/auth/profile`  | POST   | Required | Change password                   |
| `/api/auth/*`        | \*     | —        | Better Auth internal routes       |

### Events

| Endpoint          | Method | Auth     | Role            | Description                             |
| ----------------- | ------ | -------- | --------------- | --------------------------------------- |
| `/api/events`     | GET    | Optional | Any             | List events with filtering & pagination |
| `/api/events`     | POST   | Required | Organizer/Admin | Create a new event                      |
| `/api/events/:id` | GET    | Optional | Any             | Get single event details                |
| `/api/events/:id` | PUT    | Required | Owner/Admin     | Update an event                         |
| `/api/events/:id` | DELETE | Required | Owner/Admin     | Delete event & its registrations        |

**GET `/api/events` Query Parameters:**

| Parameter   | Type   | Default | Description                               |
| ----------- | ------ | ------- | ----------------------------------------- |
| `page`      | number | 1       | Page number                               |
| `limit`     | number | 10      | Items per page (max 50)                   |
| `status`    | string | —       | Filter: `upcoming`, `closed`, `completed` |
| `collegeId` | string | —       | Filter by college ObjectId                |
| `category`  | string | —       | Filter by event category                  |
| `search`    | string | —       | Full-text search in title & description   |
| `sortBy`    | string | date    | Sort field: `date`, `createdAt`, `title`  |
| `sortOrder` | string | asc     | Sort direction: `asc`, `desc`             |

### Registrations

| Endpoint             | Method | Auth     | Role              | Description                      |
| -------------------- | ------ | -------- | ----------------- | -------------------------------- |
| `/api/registrations` | GET    | Required | Any               | List registrations (role-scoped) |
| `/api/registrations` | POST   | Required | Student           | Register for an event            |
| `/api/registrations` | DELETE | Required | Student/Organizer | Cancel / remove a registration   |

**Business rules enforced:**

- Cannot register for closed/completed events
- Cannot register past the deadline
- Cannot exceed event capacity
- Duplicate registrations are prevented

### Colleges

| Endpoint            | Method | Auth     | Role      | Description                       |
| ------------------- | ------ | -------- | --------- | --------------------------------- |
| `/api/colleges`     | GET    | No       | Any       | List colleges (filterable, paged) |
| `/api/colleges`     | POST   | Optional | Any/Admin | Suggest or create a college       |
| `/api/colleges/:id` | GET    | No       | Any       | Get college details               |
| `/api/colleges/:id` | PUT    | Required | Admin     | Update a college                  |
| `/api/colleges/:id` | DELETE | Required | Admin     | Delete a college                  |

> Colleges created by non-admins are `isVerified: false` (pending admin verification).

### Users

| Endpoint         | Method | Auth     | Role       | Description                 |
| ---------------- | ------ | -------- | ---------- | --------------------------- |
| `/api/users`     | GET    | Required | Admin      | List all users (filterable) |
| `/api/users`     | PUT    | Required | Any        | Update own profile          |
| `/api/users/me`  | GET    | Required | Any        | Get profile with stats      |
| `/api/users/me`  | POST   | Required | Any        | Sync auth user with MongoDB |
| `/api/users/:id` | GET    | Required | Self/Admin | Get user by ID              |
| `/api/users/:id` | PATCH  | Required | Admin      | Change user role            |
| `/api/users/:id` | DELETE | Required | Admin      | Delete a user               |

---

## 📦 Response Format

All API responses follow a consistent structure:

**Success:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": ["Validation error message"]
  }
}
```

**Paginated:**

```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasMore": true
    }
  }
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** instance (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/college-event-aggregator.git
cd college-event-aggregator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/college-events

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin seed (optional — for seed script)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
ADMIN_FIRST_NAME=Super
ADMIN_LAST_NAME=Admin
```

### 4. Start the development server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### 5. Seed the admin user (first time only)

> The dev server **must be running** before executing the seed script.

```bash
npm run seed:admin
```

This creates the first admin account using the credentials in `.env`.

### 6. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
college-event-aggregator/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles (Tailwind)
│   └── api/                      # API Routes (REST)
│       ├── auth/
│       │   ├── [...all]/         # Better Auth catch-all handler
│       │   ├── register/         # Custom registration endpoint
│       │   ├── login/            # Custom login endpoint
│       │   ├── profile/          # Profile CRUD + password change
│       │   └── sign-out/         # Custom sign-out endpoint
│       ├── events/               # Events CRUD + filtering
│       │   └── [id]/             # Single event operations
│       ├── registrations/        # Registration management
│       ├── colleges/             # Colleges CRUD
│       │   └── [id]/             # Single college operations
│       ├── users/                # User management
│       │   ├── [id]/             # Single user + role management
│       │   └── me/               # Current user profile + sync
│       └── test-db/              # Database connection test
├── lib/                          # Shared utilities
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Client-side auth helpers
│   ├── auth-guard.ts             # Auth middleware (role checks)
│   ├── db.ts                     # MongoDB connection (cached)
│   ├── api-response.ts           # Standardized response helpers
│   └── validators/               # Zod validation schemas
│       ├── auth.ts               # SignUp, SignIn, Password schemas
│       ├── event.schema.ts       # Event create/update/query schemas
│       ├── college.schema.ts     # College create/update/query schemas
│       ├── registration.schema.ts# Registration schemas
│       └── user.schema.ts        # User update/query schemas
├── models/                       # Mongoose models
│   ├── User.ts                   # User model (with role system)
│   ├── Event.ts                  # Event model (with categories)
│   ├── College.ts                # College model (with verification)
│   └── Registration.ts           # Registration model (unique index)
├── types/                        # TypeScript interfaces & formatters
│   ├── index.ts                  # Exports + pagination helpers
│   ├── user.ts                   # IUser, UserResponse, formatter
│   ├── event.ts                  # IEvent, EventResponse, formatter
│   ├── college.ts                # ICollege, CollegeResponse, formatter
│   ├── registration.ts           # IRegistration, formatter
│   └── auth.ts                   # Auth-related types
├── scripts/
│   └── seed-admin.ts             # Admin user seeding script
├── documents/                    # Project documentation
│   ├── college_event_aggregator_detailed.md
│   ├── phase1_implementation_plan.md
│   ├── phase1_backend_step_by_step.md
│   ├── phase1_frontend_step_by_step.md
│   ├── AI_DESIGN_PROMPT.md       # AI design generation prompt
│   ├── POSTMAN_API_TESTING_GUIDE.md
│   └── folder_struture.txt
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tailwind.config (via CSS)
```

---

## 🔐 Authentication Flow

1. **Register** → `POST /api/auth/register` — Creates Better Auth user + MongoDB user profile (always as `student`)
2. **Login** → `POST /api/auth/login` — Validates credentials, returns session cookie
3. **Session** — Cookie-based sessions (7-day expiry, auto-refresh every 24h)
4. **Auth Guard** — Every protected route uses `requireAuth()` which validates the session and optionally checks the user's role
5. **Sign Out** → `POST /api/auth/sign-out` — Clears session

---

## 🗺️ Roadmap

### Phase 1 — Core MVP ✅ (Backend Complete)

- [x] Authentication & role-based access control
- [x] College management with verification
- [x] Event CRUD with categories, filtering, search, pagination
- [x] Event registration with capacity & deadline enforcement
- [x] User profile management
- [x] Admin user & college management
- [ ] Frontend UI (Next phase)

### Phase 2 — Engagement & Scale

- [ ] Inter-college events
- [ ] Notifications & email reminders
- [ ] Organizer analytics dashboard
- [ ] Student profile enhancements
- [ ] College verification workflow

### Phase 3 — AI & Modern Features

- [ ] AI-powered event recommendations
- [ ] Natural language search
- [ ] AI event description generator
- [ ] Participation prediction
- [ ] AI chat assistant

---

## 📜 Available Scripts

| Script     | Command              | Description                       |
| ---------- | -------------------- | --------------------------------- |
| Dev server | `npm run dev`        | Start Next.js in development mode |
| Build      | `npm run build`      | Production build                  |
| Start      | `npm start`          | Start production server           |
| Lint       | `npm run lint`       | Run ESLint                        |
| Seed Admin | `npm run seed:admin` | Create the first admin user       |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
