# PlacementPrep | LeetCode & Placement Track Dashboard

**PlacementPrep** is a high-level, full-stack web application designed for college engineering students preparing for technical placements. The platform gamifies LeetCode preparation, tracks problem-solving statistics, aggregates college-wide student rankings, and enables peer-to-peer benchmarking through interactive visual comparison charts.

Built using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM (v7)**, and **PostgreSQL (Supabase)**.

---

## 🎓 Why This Platform Helps Students

Preparing for software engineering placements can be overwhelming. PlacementPrep addresses core student paint points:
1. **Gamified Progress Tracking**: Earns points based on problem difficulty (Easy = 10, Medium = 20, Hard = 30). This keeps students motivated.
2. **Revision Notes Facility**: Let's face it: students forget approaches to difficult problems. The custom revision notes overlay lets students log trick cases, complexities, or pointers on individual questions to review right before coding rounds.
3. **Healthy Competition (Leaderboard)**: Ranks students campus-wide. Real-time scores create a competitive and motivating environment.
4. **Peer Benchmarking (Pinning)**: Students can follow/pin classmates and compare their daily solve rates over the last 7 days. This helps study groups stay synced and pushes underperforming students to code more.

---

## ✨ Core Features

*   **Premium Glassmorphic Interface**: Sleek dark mode styling with glowing background gradients and micro-animations on interactive components.
*   **Curated LeetCode Tracks**: CURAND (Easy, Medium, Hard) problem lists linking directly to the LeetCode platform.
*   **Solve & Star Toggles**: Mark problems solved to gain points instantly, or star them for bookmarked review.
*   **Comparative Graphing**: A custom-built reactive SVG time-series chart showing 7-day solve counts for the logged-in student and their pinned peers.
*   **Search & Pinning Drawer**: Search student profiles on campus, pin them, or track their overall points and colleges.
*   **College-wide Ranks**: Filter rankings globally or within specific engineering colleges.

---

## 📐 Industrial Layered Architecture



```
placement-tracker/
├── prisma/
│   ├── schema.prisma            # Model Layer (PostgreSQL Data Types)
│   └── seed.js                  # Database Seeder (Seeds 20 popular LeetCode questions)
├── src/
│   ├── app/                     # === CONTROLLER LAYER ===
│   │   ├── api/                 # REST Route Handlers (Exposes backend to frontend)
│   │   ├── dashboard/           # View Controller: Dashboard page
│   │   ├── leaderboard/         # View Controller: Rank List page
│   │   └── page.tsx             # View Controller: Welcome Auth page
│   │
│   ├── backend/                 # === SERVICE & DATA ACCESS LAYER ===
│   │   ├── db/
│   │   │   └── prisma.ts        # Prisma Client instantiation (Global pool singleton)
│   │   └── services/            # Pure Business logic & Database transactions
│   │       ├── userService.ts   # Registrations, profile retrievals, follows
│   │       ├── questionService.ts # Solves, stars, notes updates, transactional score add
│   │       └── leaderboardService.ts # Weekly chart compilers and ranking aggregates
│   │
│   └── frontend/                # === PRESENTATION LAYER ===
│       └── components/          # Reusable React components
│           ├── Navbar.tsx       # PlacementPrep sticky header with point tallies
│           ├── QuestionCard.tsx # Individual problem row with solved/star checkmarks
│           └── NoteModal.tsx    # Slide-over modal to save approach details
```

### Key Engineering Decisions:
*   **Database Transactions (`prisma.$transaction`)**: Checked-off solve progress modifies both the `UserProgress` table and increment/decrement properties in the `User` table. To protect database integrity, we execute these updates inside an atomic SQL transaction.
*   **Prisma 7 WASM Compiler**: Prisma 7 has transitioned to a Rust-free WASM query compiler. It requires database connections to go through **Driver Adapters** (`pg` and `@prisma/adapter-pg`).
*   **Hot-Reload Protection (Singleton)**: Next.js hot-reloads modules on save, which leaks database connections. We solve this by registering the Prisma Pg adapter instance on `globalThis` during development.
*   **Zero-Dependency Vector Charting**: We chose to implement a custom SVG-based line chart in React to render time-series comparative statistics. This prevents SSR/hydration mismatches and has zero package footprint.

---

## 🛠️ Technology Stack & Dependencies

*   **Framework**: Next.js 16.2.6 (Turbopack, App Router)
*   **Language**: TypeScript 5.9.3 (Strict types)
*   **Styling**: Tailwind CSS 4.3.0 & PostCSS
*   **ORM**: Prisma 7.8.0
*   **Database**: PostgreSQL (Supabase)
*   **Database Client**: `pg` v8.21.0 & `@prisma/adapter-pg`
*   **Package Manager**: `pnpm` v10.28.1

---

## ⚙️ Setup and Installation

Follow these steps to set up the project on your local machine:

### 1. Prerequisites
Ensure you have **Node.js (v20+)** and **pnpm** installed on your system.

### 2. Configure Environment Variables
In the project root, open the `.env` file and replace the `DATABASE_URL` with your direct PostgreSQL connection string (e.g., from Supabase or Neon.tech):

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

### 3. Install Dependencies
Run `pnpm install` to download node modules. 

pnpm install
```

### 4. Push Database Schema
Sync the database schema with Supabase using Prisma:
```bash
pnpm prisma db push
```

### 5. Compile Prisma Client Types
Generate the type-safe client models for your editor:
```bash
pnpm prisma generate
```

### 6. Seed LeetCode Questions
Seed the database with the 20 curated LeetCode questions (Blind 75 essentials):
```bash
pnpm prisma db seed
or node prisma/seed.js
```

---

## 🚀 Running the Project

Start the local development server:
```bash
pnpm run dev
```

Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

## 🧪 Suggested Testing Flow

1.  **Register Users**: Open a browser, navigate to `/`, and register user `Madhav` from `IIT Kharagpur`. Open a private tab and register `Mohan` from `BITS Pilani`.
2.  **Gain Points**: Logged in as `Mohan`, mark several *Medium* and *Hard* questions as solved. Your total points will rise. Add a revision note to "Two Sum" explaining a map solution.
3.  **Follow Peers**: Logged in as `Madhav`, type `Mohan` in the **Compare Peer Solves** search bar on the right side of the dashboard, and click **Pin**.
4.  **View Comparative Charts**: The custom SVG line chart will now render two lines comparing the daily solve progress of `adhav` (0) and `Mohan` (3).
5.  **Explore Leaderboard**: Click on the **Global Leaderboard** page to see ranks updated globally and filtered by college.
