# MentorLagbe (Client)

**MentorLagbe** is a Smart Tuition & Mentorship platform. Tutors post subject-wise tuition batches or 1-on-1 mentorship, students search, filter and apply, and admins moderate listings, users and Stripe revenue.

- **Live URL:** https://your-client.vercel.app  *(replace after deploy)*
- **Server repo / API:** https://your-server.vercel.app  *(replace after deploy)*

## Test credentials (created by `npm run seed` in the server repo)

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@mentorlagbe.com | Admin@12345 |
| Tutor | rafiq@mentorlagbe.com | Tutor@12345 |
| Student | sadia@mentorlagbe.com | Student@12345 |

## Key features

- Role-based auth (Student / Tutor / Admin) with **BetterAuth + MongoDB adapter**; the client generates a **JWT** (`/api/token`) for every protected Express request
- Home page: hero with search, **6 latest approved tuitions** from MongoDB (equal-height cards), pricing, how it works, top subjects, live platform counters, testimonials
- **Browse Tuitions** with **server-side search + filters (subject, class level, mode) + pagination**
- Tuition details with tutor profile, reviews, and a **student-only** apply form (duplicate applications blocked)
- **Stripe Checkout** for Pro plans (Tutor $15, Student $10), success/cancel pages, plan upgraded + payment stored
- Dashboards with collapsible sidebar, top bar and profile summary
  - Student: overview stats, my applications (cancel while pending, rate after accepted), saved tuitions
  - Tutor: overview, post tuition (free plan limit: 2), my tuitions (edit / delete / open-close), manage applicants
  - Admin: overview, user roles, tuition approval, Stripe transactions
- **ImgBB** direct file upload (profile photo and tuition banner)
- Optional features included: server-side pagination, AI-style seed data, bookmarks, dark/light theme, review and rating
- Custom `loading.js` skeletons, `not-found.js`, `error.js`, sonner toasts, responsive on mobile/tablet/desktop, new **X** logo in the footer

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Environment variables (`.env.local`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Express server URL |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB upload key |
| `MONGODB_URI`, `DB_NAME` | MongoDB (same DB as the server) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | BetterAuth secret (32+ chars) and the site URL |
| `JWT_SECRET` | Must equal the server's `JWT_SECRET` |

## NPM packages

`next`, `react`, `react-dom`, `better-auth`, `mongodb`, `jose`, `sonner`, `framer-motion`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`, `daisyui`

## Deploy (Vercel)

Import this repo, add the environment variables above (set `BETTER_AUTH_URL` to the production URL), deploy. Then add the production URL to the server's `CLIENT_URL`.
