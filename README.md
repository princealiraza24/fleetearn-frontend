# FleetEarn — Frontend

React 18 + Vite + Tailwind CSS v4 frontend for the FleetEarn investment platform.

## Stack
- React 18 + TypeScript
- Vite 6 + TailwindCSS v4
- TanStack Query v5 (data fetching)
- Zustand (auth + UI state)
- React Router v7
- React Hook Form + Zod (forms)
- Recharts (earnings chart)
- Lucide React (icons)
- PWA support (vite-plugin-pwa)

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run typecheck  # TS checks
```

## Environment
API requests proxy to `http://localhost:5000` in dev (configured in vite.config.ts).
For production, set `VITE_API_BASE` or update the vite proxy.

## Pages
| Route          | Page              |
|---------------|-------------------|
| /login         | Login             |
| /register      | Register          |
| /dashboard     | Main dashboard    |
| /plans         | Fleet plans       |
| /calculator    | Earnings calc     |
| /deposit       | Deposit funds     |
| /withdraw      | Withdraw funds    |
| /transactions  | Tx history        |
| /referrals     | Referral program  |
| /profile       | User profile      |
| /admin/*       | Admin panel       |
