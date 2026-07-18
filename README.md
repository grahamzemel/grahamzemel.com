# Graham Zemel (.com)

[![Vercel Status](https://img.shields.io/badge/vercel-deployed-000?logo=vercel&style=flat-square)](https://grahamzemel.com)

Personal portfolio and admin dashboard for [Graham Zemel](https://grahamzemel.com).

- **Live site:** [https://grahamzemel.com](https://grahamzemel.com)
- **Frontend:** SvelteKit + Tailwind CSS, deployed on Vercel
- **Backend:** [grahamzemel.com_backend](https://github.com/grahamzemel/grahamzemel.com_backend) — Express income engine on Heroku

## What's in this repo

This is the fourth iteration of my personal site. It started as a front-end playground and grew into a lightweight portfolio CMS with a private admin dashboard.

### Public site

A single-page portfolio with animated sections, project filtering, and SSR-friendly SEO.

| Section | What it does |
|--------|--------------|
| **Hero** | Intro, tagline, and social links |
| **About** | Bio, current focus (FratDoor, TextCloaker, IFC), and tech stack |
| **Featured Projects** | Deep-dive cards for FratDoor, TextCloaker, and the offline-sync-engine library |
| **Projects** | Searchable, filterable grid of 20+ projects with live links and repos |
| **Resume** | Embedded résumé with download link |
| **Blog** | Pulls latest posts from The Gray Area's Medium RSS feed |
| **Get in Touch** | Contact form routed through Web3Forms |
| **Footer** | Links and copyright |

### Admin dashboard (`/admin`)

A password-protected income and cash-flow dashboard connected to the backend.

- **Overview** — monthly/annual income, startup percentage, next 30-day projection, Stripe balances, and AI-generated insights via Anthropic
- **Income Sources** — manage hourly, salary, freelance, and business income
- **Cashflow** — upcoming payment timeline with modifiers
- **Stripe** — multi-account balance and subscription MRR
- **Settings** — backend configuration

### API routes

| Route | Purpose |
|-------|---------|
| `/api/contact` | Proxy contact form to Web3Forms |
| `/api/admin-auth` | Cookie-based gate for `/admin` sessions |
| `/pass` | Short redirect endpoint |

## Tech stack

### Frontend

- [SvelteKit](https://kit.svelte.dev) — framework
- [Vite](https://vitejs.dev) — build tool
- [Tailwind CSS](https://tailwindcss.com) — styling
- [PostCSS](https://postcss.org) — CSS processing
- [GSAP](https://greensock.com/gsap) + [Lenis](https://lenis.studiofreight.com) — scroll and animation
- [TypeScript](https://www.typescriptlang.org) — types

### Backend integration

- `src/lib/api.js` wraps authenticated calls to `grahamzemelcom-596da5a7c96e.herokuapp.com`
- Endpoints consumed: `/api/dashboard/summary`, `/api/projections/cashflow`, `/api/income`, `/api/modifiers`, `/api/insights`, `/api/stripe/*`, `/api/config`, `/api/auth`

### Infra

- Vercel for hosting (SvelteKit Vercel adapter, edge runtime)
- Heroku for the backend
- Firebase Admin SDK on the backend for Firestore

## Project catalog

### Featured

| Project | Description | Link |
|---------|-------------|------|
| **FratDoor** | Door-check system for 42+ fraternities; ID/QR scanning, ticketing, offline-first sync, 150,000+ swipes | [fratdoor.com](https://fratdoor.com) |
| **TextCloaker** | AI-detector cloaking with zero visible text changes; 7,000+ users | [text-cloaker.com](https://text-cloaker.com) |
| **offline-sync-engine** | NPM library: offline-first mutation queue with exactly-once delivery | [GitHub](https://github.com/grahamzemel/offline-sync-engine) |

### More projects on the site

- **CU EventHub** — IFC event registration and safety workflows
- **Student Living Advocacy Group (SLAG)** — off-campus housing reporting hub
- **Nick Lathrop Photography** — Astro + Svelte portfolio with Playwright/Instagram sync
- **Apartment Availability Tracker** — GitHub Actions scraper with email summaries
- **Game Bank** — browser arcade lobby
- **QuantumChat** — BB84 quantum-key-distribution chat demo
- **Powerschool GPA Calculator** — Chrome extension for weighted GPA calculation
- **Medium Twitter Bot** — auto-posts The Gray Area articles to Twitter
- **Web Heck Scanner** — Bash-driven bug-bounty recon toolkit
- **Hecker Bot** — Telegram bot for recon automation
- **Bash Bunny** — Hak5 hotplug attack payloads
- **IDOR Automation** — Python scripts for insecure direct object reference testing
- **Aesculapius** — MetroHacks 2022 healthcare-accessibility chatbot
- **Template Project** — Svelte + Bulma + Python starter
- **Crypto Token Template** — ERC-20 token template for learning
- **Discrete Mathematics** — class notes and Python visualizations
- **The Vault Collection** — Unity mobile arcade bundle

## Development

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/grahamzemel/grahamzemel.com.git
cd grahamzemel.com
npm install
```

### Run locally

```bash
npm run dev
```

The dev server starts at `http://localhost:5173` by default. The admin dashboard proxies to `http://localhost:3000` when `window.location.hostname === 'localhost'`.

### Build

```bash
npm run build
npm run preview
```

### Lint / format

```bash
npm run lint
npm run format
```

## Deployment

Pushes to `main` trigger a Vercel production deployment. The `svelte.config.js` uses `@sveltejs/adapter-vercel` with `runtime: "edge"`.

## Environment variables

The frontend does not require build-time env vars. The backend is configured separately in `grahamzemel.com_backend`.

## File structure

```
.
├── src/
│   ├── lib/
│   │   ├── api.js              # backend fetch wrapper
│   │   ├── engine.js           # contact/visibility utilities
│   │   ├── climb.js            # scroll helpers
│   │   ├── seo.css             # global SEO styles
│   │   └── components/         # Svelte sections and cards
│   ├── routes/
│   │   ├── +page.svelte        # homepage
│   │   ├── +layout.svelte      # root layout
│   │   ├── admin/              # dashboard pages
│   │   ├── preview/            # project preview pages
│   │   ├── seo/                # SEO page
│   │   ├── api/                # SvelteKit API routes
│   │   └── pass/+server.js     # redirect endpoint
│   ├── app.html                # HTML template with structured data
│   ├── app.postcss             # global styles
│   ├── hooks.server.js         # /admin auth check
│   └── svelte.config.js        # SvelteKit + Vercel config
├── static/                     # images, icons, favicon, manifest
├── tailwind.config.cjs         # Tailwind theme
├── postcss.config.cjs
├── package.json
└── README.md
```

## License & reuse

Developers are welcome to reuse the code in their own projects; the copyright notice in the footer must remain intact.

## Connect

- [grahamzemel.com](https://grahamzemel.com)
- [The Gray Area](https://thegrayarea.tech)
- [Medium](https://medium.com/@grahamzemel)
- [GitHub](https://github.com/grahamzemel)
