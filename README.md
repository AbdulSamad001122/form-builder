# Formit — Form Builder SaaS

A production-style Typeform-inspired form builder built with Turborepo, tRPC, Drizzle ORM, Zod, and Next.js. Create dynamic forms, publish shareable links, collect responses and view analytics — all inside a polished monorepo architecture.

---

## 🚀 Live Demo

**Frontend:** [https://formfit-builder-web.vercel.app](https://formfit-builder-web.vercel.app)

**API / Backend:** Deployed separately (Express + tRPC)

**API Docs (Scalar):** `<your-api-base-url>/docs`

**OpenAPI JSON:** `<your-api-base-url>/openapi.json`

---

## 🔑 Demo Credentials

| Field    | Value                        |
|----------|------------------------------|
| Email    | `demo@formit.dev`            |
| Password | `Demo@1234`                  |

> The demo account comes pre-loaded with themed sample forms, seeded responses, and analytics data so judges can explore the product immediately without any manual setup.

---

## 📦 Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Monorepo     | Turborepo                                   |
| Frontend     | Next.js 16, React 19, Tailwind CSS v4       |
| Backend      | Express.js, tRPC, trpc-to-openapi           |
| Database     | PostgreSQL + Drizzle ORM                    |
| Validation   | Zod                                         |
| Auth         | JWT + HMAC-SHA256 password hashing          |
| Email        | Resend API                                  |
| API Docs     | Scalar (`@scalar/express-api-reference`)    |
| Rate Limiting| express-rate-limit                          |
| UI           | shadcn/ui, Radix UI, Tabler Icons           |
| Drag & Drop  | @dnd-kit                                    |
| QR Code      | qrcode.react                                |

---

## 🗂 Monorepo Structure

```
trpc-monorepo/
├── apps/
│   ├── api/          # Express backend — tRPC + OpenAPI + Scalar docs
│   └── web/          # Next.js frontend — dashboard, public forms, landing
├── packages/
│   ├── database/     # Drizzle ORM schema, migrations, seed
│   ├── trpc/         # tRPC router definitions, procedures, context
│   ├── services/     # Business logic (FormService, UserService, etc.)
│   ├── logger/       # Shared logger utility
│   └── typescript-config/
└── turbo.json
```

---

## ✨ Features

### Creator Features
- **Authentication** — Email/password sign up and sign in
- **Form Builder** — Create forms with a drag-and-drop field editor
- **Field Types** — TEXT, LONG_TEXT, EMAIL, NUMBER, YES_NO, PASSWORD, SINGLE_SELECT, MULTI_SELECT, CHECKBOX, DROPDOWN, RATING, DATE
- **Field Config** — Required/optional, placeholder text, options for select fields
- **Drag & Drop Reorder** — Fractional indexing for stable field ordering
- **Themes** — Multiple visual themes with live preview (gradient accent strips)
- **Publish / Unpublish** — Toggle form status with one click
- **Copy Link** — Instantly copy the shareable public form URL
- **QR Code Sharing** — Generate, copy image, and download a QR code for any published form
- **Visibility Modes** — `PUBLIC` (visible in Explore) or `UNLISTED` (direct link only)
- **Response Analytics** — 7-day submission trend chart, total stats, recent submissions table
- **Response Management** — View all responses and individual answers per submission
- **Search & Sort** — Filter forms by title and sort by newest/oldest
- **Edit & Delete Forms** — Full CRUD management
- 

### Respondent Features
- **Public Form Filling** — No login required
- **Email Capture** — Two-step flow: enter email → fill form → submit
- **Thank-You Screen** — Animated confirmation on successful submission
- **Graceful Error States** — Friendly messages for invalid, unpublished or unavailable forms

### Discovery Features
- **Explore Page** — Browse all public published forms from all creators
- **Search in Explore** — Filter community forms by title

### Product Pages
- **Landing Page** — Hero, features, testimonials, pricing and CTA sections
- **Pricing Page** — Embedded in landing page (no real payments needed)

### Infrastructure
- **Rate Limiting** — 5 req/min on public form submission, 20 req/min general API
- **Email Notifications** — Resend API sends creator an email on every new submission
- **API Documentation** — Full OpenAPI spec via Scalar at `/docs`
- **Seed Data** — 3 themed demo forms with realistic responses pre-loaded

---

## 🛠 Local Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- PostgreSQL database (local or hosted)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd trpc-monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the `.env` file in each relevant package and fill in your values:

**`packages/database/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/formit
```

**`packages/services/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/formit
JWT_SECRET=your_jwt_secret_here
RESEND_API_KEY=your_resend_api_key
```

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/formit
JWT_SECRET=your_jwt_secret_here
RESEND_API_KEY=your_resend_api_key
BASE_URL=http://localhost:4000
PORT=4000
```

**`apps/web/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run database migrations

```bash
pnpm --filter @repo/database db:migrate
```

### 5. Seed demo data

```bash
pnpm --filter @repo/database db:seed
```

### 6. Start development servers

```bash
pnpm dev
```

This starts both `apps/api` (port 4000) and `apps/web` (port 3000) concurrently via Turborepo.

---

## 📖 API Documentation

The backend exposes a full OpenAPI spec generated from tRPC routes using `trpc-to-openapi`.

| Endpoint       | Description                          |
|----------------|--------------------------------------|
| `/docs`        | Interactive Scalar API documentation |
| `/openapi.json`| Raw OpenAPI JSON spec                |
| `/trpc/*`      | tRPC batch endpoint                  |
| `/api/*`       | REST-style OpenAPI endpoint          |

---

## 🌱 Seeding the Database

The seed script creates a demo user and 3 themed sample forms with realistic responses and analytics data.

```bash
pnpm --filter @repo/database db:seed
```

After seeding:
- **Demo user** is created (see Demo Credentials above)
- **3 themed forms** are created (Customer Satisfaction Survey, Hackathon Registration 2026, Movie Night Picks)
- **~15 realistic responses** with answers are seeded across all forms

---

## 🗃 Database Schema

| Table                   | Description                              |
|-------------------------|------------------------------------------|
| `users`                 | Creator accounts                         |
| `forms`                 | Form metadata, status, visibility, theme |
| `form_fields`           | Individual fields with type and options  |
| `form_responses`        | Per-submission records with email        |
| `form_response_answers` | Individual answers linked to fields      |

---

## 🚀 Deployment

### Frontend (Vercel)
The Next.js web app is deployed to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend URL in Vercel environment variables.

### Backend (Render / Railway)
The Express API is deployed as a Node.js web service. Set all required environment variables in your hosting dashboard.

---

## 📝 Submission Info

| Item                  | Value                                                |
|-----------------------|------------------------------------------------------|
| GitHub Repository     | [github.com/your-username/trpc-monorepo](https://github.com) |
| Deployed Demo         | [https://formfit-builder-web.vercel.app](https://formfit-builder-web.vercel.app) |
| API Documentation     | `<your-api-url>/docs`                                |
| Demo Email            | `demo@formit.dev`                                    |
| Demo Password         | `Demo@1234`                                          |

---

## 👤 Author

Built solo for the hackathon by Abdul Samad.

