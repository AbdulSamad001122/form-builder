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
- **Authentication** — Secure credential-based creator auth (self-hosted HMAC-SHA256 + salt)
- **Form Builder** — Drag-and-drop field editor with fractional indexing for smooth field reordering
- **Field Types** — TEXT, LONG_TEXT, EMAIL, NUMBER, YES_NO, PASSWORD, SINGLE_SELECT, MULTI_SELECT, CHECKBOX, DROPDOWN, RATING, DATE
- **Field Config** — Required/optional toggle, placeholders, and choice values
- **Visual Logic branching & Canvas** — Interactive logic map mapping paths visually with specific option handles (blue dots) and generic "Otherwise" fallback handles (black dots)
- **Custom Slugs (Bonus)** — Custom slug support enabling public form URLs like `/f/my-survey-slug` which resolve dynamically in the backend (with fallback UUID query support)
- **Workspace Custom Branding** — Live brand image uploads stored in Cloudinary and custom color palette overrides (background, text, cards, and input fields)
- **Password Protected Forms (Bonus)** — Secure, cookie-based authenticated form filling using encrypted password verification
- **Form Expiry & Response Limit (Bonus)** — Automatic expiration and limits validation during response submissions
- **QR Code Sharing** — Generates and downloads high-quality QR codes for instant sharing
- **Visibility Modes** — `PUBLIC` (visible in explore page listings) or `UNLISTED` (hidden from Explore, accessible only via direct URL)
- **Response Analytics** — Interactive dashboards showing 7-day trend charts, total forms, submissions, published/draft status, and list of responses
- **CSV Response Export (Bonus)** — Client-side CSV generation and download of responses data
- **Edit & Delete Forms** — Core CRUD features

### Respondent Features
- **Public Form Filling** — Fast, unauthenticated form filling with a two-step capture flow
- **Dynamic UX Progress (Bonus)** — Responsive indicators that dynamically show "Final Question" and "Ready to submit" on logic forms, hiding absolute step counts to maintain fluid progress
- **Thank-You Confirmation** — Polished confirmation splash screens on successful submission
- **Graceful Error Handling** — Safe, descriptive error cards for drafts, expired links, and response limit blocks

### Discovery Features
- **Explore Gallery** — Live community dashboard containing all public published forms
- **Live Search** — Interactive exploring search by title

### Infrastructure
- **API Rate Limiting** — Secure express-rate-limit protection (5 req/min on form responses, 20 req/min general traffic)
- **Email Notifications** — Automated inbox alerts on every submission via Resend integration
- **Scalar API Docs** — Comprehensive OpenAPI documentation at `/docs` (including tRPC health routers)
- **Demo-ready Seed script** — Seeds demo user (`demo@formit.dev` / `Demo@1234`) with 3 themed forms and 16 responses

---

## 🛠 Local Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- PostgreSQL database
- Cloudinary account (for brand logo uploads)

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

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=your_cloudinary_folder_name
```

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/formit
JWT_SECRET=your_jwt_secret_here
RESEND_API_KEY=your_resend_api_key
BASE_URL=http://localhost:4000
PORT=4000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=your_cloudinary_folder_name
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

