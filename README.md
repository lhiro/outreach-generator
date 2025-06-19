# Outreach Generator

A next-generation, full-stack template leveraging Drizzle ORM, Supabase, and automatic Swagger-based API type generation for modern, type-safe development.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.9.0
- pnpm >= 8

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Supabase project credentials.

### 3. Database Initialization

This project uses Drizzle ORM with Supabase for type-safe schema management and migrations.

```bash
pnpm db:init   # Generate Drizzle schema from the current database
pnpm db:push   # Push schema changes to Supabase
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Useful Scripts

| Script         | Description                                         |
| -------------- | --------------------------------------------------- |
| `dev`          | Start Next.js development server                    |
| `build`        | Build for production                               |
| `start`        | Start production server                            |
| `lint`         | Run ESLint                                         |
| `db:init`      | Generate Drizzle schema from the database           |
| `db:push`      | Push schema changes to Supabase                    |
| `db:migrate`   | Run database migrations                            |
| `gen:api`      | Generate TypeScript API client from Swagger         |
| `gen:schema`   | Generate Zod schema from Drizzle schema            |
| `prettier`     | Format the codebase                                |

---

## 📁 Project Structure

```text
.
├── app/           # Next.js application entry: pages, layouts, styles
├── api/           # Backend API routes and OpenAPI/Swagger integration
├── components/    # Reusable UI components
├── context/       # React context providers for global state
├── db/            # Database connection and Drizzle ORM config
├── drizzle/       # Drizzle ORM generated migrations and metadata
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and third-party integrations
├── schema/        # Business data schemas and validation (Zod)
├── scripts/       # Automation scripts (API generation, migrations)
├── utils/         # General utility functions
```

---

## 📝 Roadmap & TODO

- [ ] **Playwright E2E Testing** — Integrate robust end-to-end testing for quality and reliability
---

## License

MIT
