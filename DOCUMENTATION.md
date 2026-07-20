# Takaful — Project Documentation

> **Living Document** — This file is updated every time a new feature is added, a bug is fixed, or the architecture changes.
> Last Updated: **2026-07-20**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Components](#5-components)
6. [Quote Engine — Deep Dive](#6-quote-engine--deep-dive)
7. [Payment Flow — Deep Dive](#7-payment-flow--deep-dive)
8. [Design System](#8-design-system)
9. [Performance Strategy](#9-performance-strategy)
10. [Security Architecture](#10-security-architecture)
11. [Configuration & Environment Variables](#11-configuration--environment-variables)
12. [Utilities & Hooks](#12-utilities--hooks)
13. [Known Bugs & Fixes Log](#13-known-bugs--fixes-log)
14. [Changelog](#14-changelog)

---

## 1. Project Overview

**Takaful** is a Sharia-compliant, community-backed home insurance platform targeting UK Muslim homeowners. The core proposition:

- **Interest-free** — no Riba (interest) charged or paid
- **Sharia-certified** — all financial flows are structured as mutual community contributions, not traditional insurance premiums
- **Instant quote** — users receive a personalised monthly estimate in under 2 minutes
- **Direct debit activation** — policy can be activated and cover started on the same day

The product targets the UK market and is structured around the UK Direct Debit Guarantee for payment collection.

### Key User Flows

```
Homepage → Get a Quote → Quote Summary → Activate Cover & Pay → Cover Confirmed
Homepage → How It Works → Get a Quote
Homepage → Sign Up (account creation)
Direct Link → /pay?ref=...&plan=...&pc=... (shareable payment link)
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.4.9+ |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS v4 | 4.1.11 |
| Animation | Framer Motion | 12.42.x |
| Icons | Lucide React | 0.553.x |
| Icons (extra) | React Icons + Tabler Icons | 5.7 / 3.44 |
| 3D / WebGL | Three.js + Cobe (globe) | 0.185 / 2.0 |
| Particles | @tsparticles/react (slim) | 3.x |
| Charts | Recharts | 3.x |
| UI Primitives | Radix UI (Select, Tooltip, Progress, Slot) | various |
| Form Utilities | class-variance-authority, clsx, tailwind-merge | — |
| AI Integration | @google/genai (Gemini) | 2.4.x |
| Fonts | Inter (body) + Playfair Display (headings) | Google Fonts |
| Deployment | Standalone Next.js output | — |
| Runtime | Node.js / Edge (middleware) | — |

### Dev Dependencies

| Tool | Version |
|---|---|
| ESLint + eslint-config-next | 9.39 / 16.0 |
| Firebase Tools (CLI) | 15.x |
| Tailwind Typography plugin | 0.5.x |
| tw-animate-css | 1.4.x |

---

## 3. Project Structure

```
takaful-project/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — fonts, meta, OG, viewport
│   ├── page.tsx                # Homepage (main marketing page)
│   ├── globals.css             # Global styles + custom keyframe animations
│   ├── sitemap.ts              # Auto-generated sitemap
│   ├── get-quote/
│   │   ├── layout.tsx          # Quote page layout wrapper
│   │   └── page.tsx            # Full 6-step quote engine (1,718 lines)
│   ├── how-it-works/
│   │   └── page.tsx            # Takaful explainer page (945 lines)
│   ├── pay/
│   │   ├── layout.tsx          # Pay page layout wrapper
│   │   └── page.tsx            # Shareable payment page (400 lines)
│   └── signup/
│       └── page.tsx            # Signup redirect / auth entry
│
├── components/
│   ├── ui/                     # 35 reusable UI components
│   └── blocks/                 # 2 larger section blocks
│
├── hooks/
│   └── use-mobile.ts           # Mobile breakpoint hook
│
├── lib/
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│
├── public/                     # Static assets (images, SVGs, webp)
├── assets/                     # Source assets
├── middleware.ts               # Edge middleware (security, tracing)
├── next.config.ts              # Next.js config, headers, image domains
├── postcss.config.mjs          # PostCSS (Tailwind)
├── .env.example                # Environment variable reference
└── package.json
```

---

## 4. Pages & Routes

### `/` — Homepage (`app/page.tsx`)

The main marketing page. Composed of these sections (in scroll order):

| Section | Component | Loading |
|---|---|---|
| Navigation | ScrollAwareNav (inline) | Eager |
| Hero (split screen) | LightningSplit | Eager |
| How Takaful Works | Inline scroll section | Eager |
| Statistics / Trust | FeaturedSectionStats | Lazy (next/dynamic) |
| Features Grid | Features8 | Lazy |
| Sticky Scroll Cards | StickyFeatureSection | Lazy |
| Testimonials | Testimonial1 | Lazy |
| Footer | HoverFooter | Lazy |

**Key behaviours:**
- `ScrollAwareNav` uses `requestAnimationFrame` to throttle scroll events and avoids layout reflow by reading `data-dark="true"` attributes instead of `getComputedStyle`.
- Background images (`/bg-image-1.webp`, `/bg-image-2.webp`) are `<link rel="preload">` in the root layout for LCP optimisation.
- Cursor spotlight effect (260px radius) follows the mouse on the hero split section.
- UK address autocomplete via `UKAddressAutocomplete` component (backed by `api.postcodes.io`).

**Navigation items:**

| Label | Route |
|---|---|
| Home | `/` |
| How it Works | `/how-it-works` |
| Compare | `/#compare` |
| About Us | `/#about` |
| Contact | `/#contact` |

---

### `/get-quote` — Quote Engine (`app/get-quote/page.tsx`)

The most complex page in the project — a **6-step guided quote wizard** (1,718 lines).

See **Section 6** for a full deep-dive.

---

### `/how-it-works` — Explainer Page (`app/how-it-works/page.tsx`)

Educational page explaining the Takaful mutual insurance model. Sections include:
- Hero with `RotatingText` animation
- Step-by-step contribution flow
- Cover types explanation (Buildings, Contents, Combined)
- Security features (Burglar alarms, CCTV, Flood risk)
- FAQ accordion
- Testimonials
- Footer

All heavy below-fold components are lazy-loaded via `next/dynamic`.

---

### `/pay` — Payment Page (`app/pay/page.tsx`)

A **shareable standalone payment page** (400 lines). Accepts URL parameters:

| Param | Example | Description |
|---|---|---|
| `ref` | `TK-T70M2P` | Quote reference ID |
| `plan` | `buildings` / `contents` / `both` | Cover type |
| `pc` | `SW1A 1AA` | Postcode (URL-encoded) |

Displays the same 3-step direct debit payment form as the embedded `PayFormEmbed` in `/get-quote`. Useful for sending a payment link to someone else.

---

### `/signup` — Sign Up (`app/signup/page.tsx`)

Entry point for new account creation. Uses `MinimalAuthPage` component.

---

## 5. Components

### 5.1 UI Components (`components/ui/`)

| File | Description |
|---|---|
| `alert.tsx` | Radix-style alert with AlertDescription |
| `animated-tooltip.tsx` | Hover tooltip with avatar stack (used in homepage hero) |
| `background-beams.tsx` | Animated beam effect (WebGL-inspired CSS) |
| `background-boxes.tsx` | Grid-box background animation |
| `bento-grid.tsx` | CSS grid layout for feature cards |
| `button.tsx` | CVA-based button with variants |
| `card.tsx` | Basic card with header/content/footer |
| `compare.tsx` | Slide-to-compare component (before/after) |
| `demo.tsx` | Component demo wrapper |
| `featured-section-stats.tsx` | Trust stats strip (e.g., "5,000+ members") |
| `globe-feature-section.tsx` | Cobe.js 3D globe section |
| `hero-section-nexus.tsx` | RotatingText — cycling animated headline text |
| `hover-footer-demo.tsx` | HoverFooter export — footer with hover link animations |
| `hover-footer.tsx` | Core hover footer implementation |
| `input.tsx` | Styled input wrapper |
| `interactive-scrolling-story-component.tsx` | Scroll-driven story animation |
| `label.tsx` | Accessible form label |
| `lightning-split.tsx` | Hero split-screen component with lightning animation |
| `meteors.tsx` | CSS meteor shower background effect |
| `minimal-auth-page.tsx` | Sign-up / login form (dark theme, accessible labels) |
| `moving-dot-card.tsx` | Card with an orbiting animated dot border |
| `multi-step-form.tsx` | Reusable multi-step form shell |
| `particles.tsx` | tsParticles integration (star-field background) |
| `pill-badge.tsx` | Rounded badge / chip component |
| `progress.tsx` | Radix Progress bar |
| `select.tsx` | Radix Select with custom styling |
| `shader-animation.tsx` | WebGL shader canvas animation |
| `sparkles.tsx` | tsParticles sparkle overlay |
| `stack-feature-section.tsx` | Stacked feature cards with scroll-triggered reveals |
| `sticky-scroll-cards-section.tsx` | StickyFeatureSection — sticky left panel + scrolling right cards |
| `sticky-scroll-reveal.tsx` | Core sticky scroll logic |
| `testimonial-1.tsx` | Testimonial1 — avatar testimonials with star ratings |
| `testimonials-columns-1.tsx` | Testimonials — multi-column testimonial grid |
| `tooltip.tsx` | Radix Tooltip with custom styling |
| `uk-address-autocomplete.tsx` | Postcode lookup using api.postcodes.io |

### 5.2 Block Components (`components/blocks/`)

| File | Description |
|---|---|
| `features-8.tsx` | Features8 — 8-feature marketing grid with icons and descriptions |
| `globe-feature-section.tsx` | Globe-centred feature section (blocks variant) |

---

## 6. Quote Engine — Deep Dive

**File:** `app/get-quote/page.tsx` (1,718 lines)

### Architecture

```
GetQuotePage          <- default export, wraps in React Suspense
  └── GetQuoteForm    <- main state machine (all 6 steps)
        └── QuoteReadyCard  <- shown when done=true (quote result)
              └── PayFormEmbed  <- embedded payment flow
                    └── PaySuccessScreen  <- shown after payment completes
```

### Steps

| Step | Title | Key Fields |
|---|---|---|
| 1 | Home Details | Postcode, Address, Property type, Bedrooms, Bathrooms, Living rooms, Kitchens, Year built, Floors, Wall construction, Roof type, Heating, Occupancy |
| 2 | Security & Protection | Door locks, Window locks, Burglar alarm (monitored?), Smoke alarms, CCTV, Safe, Flood risk |
| 3 | Cover & Protection | Cover type (buildings/contents/both), Excess (£100-£1000), Cover start date, Add-ons |
| 4 | Your Belongings | Contents value, Jewellery value, Electronics value, Portable valuables |
| 5 | About You | Full name, Email, Phone, DOB, Household members, Claims history |
| 6 | Review & Customise | Accordion review of all answers before quote generation |

### Monthly Estimate Algorithm

```
base = 35 (combined) / 22 (buildings only) / 18 (contents only)
+ bedrooms * 3
+ 8  if contentsValue > £30,000
+ 12 if contentsValue > £50,000
- 5  if excess >= £500 (voluntary higher excess)
+ 4  if accidentalDamage add-on selected
+ 2  if legalExpenses add-on selected
+ 3  if homeEmergency add-on selected
- 2  if burglarAlarm installed
- 1  if hasCCTV installed
floor at £15/month minimum
```

### Property Types

`Detached`, `Terraced`, `Flat`, `Bungalow`, `Semi-detached`

### Inline Sub-components

| Component | Purpose |
|---|---|
| AnimatedCounter | Spring-animated number counter (framer-motion useSpring) |
| PayField | Styled form input with optional leading icon |
| PaySteps | 3-step progress indicator |
| PaySuccessScreen | Confirmation screen after successful payment |
| PayFormEmbed | Full 3-step embedded payment form |
| QuoteReadyCard | Quote result card with community price range chart |
| SectionLabel | Green uppercase section heading |
| FieldLabel | Accessible form label |
| TooltipIcon | Info icon with Radix tooltip |
| Divider | Horizontal rule |
| Stepper | +/- number stepper for room counts |
| RoomRow | Icon + label + Stepper row |
| CoverTypeCard | Selectable cover type button card |
| ClaimsCard | Selectable claims history card |
| ToggleRow | Yes/No toggle switch row |
| RiderCard | Selectable add-on card with checkbox |

### Quote Ready Card Features

- Animated price counter (springs to calculated monthly value)
- Cover breakdown table (cover type, bedrooms, add-ons, postcode)
- Community price range chart (£20-£90/month scale, user quote marked, typical zone £25-£42 highlighted)
- "Activate Cover & Pay" CTA — transitions to PayFormEmbed inline
- Share Quote dropdown (WhatsApp, Email, X/Twitter, LinkedIn, Copy Link)

---

## 7. Payment Flow — Deep Dive

### 7.1 Embedded (`PayFormEmbed` in `/get-quote`)

Activated when user clicks "Activate Cover & Pay" on QuoteReadyCard. Renders inline within the same card. Quote reference generated as `TK-${Date.now().toString(36).toUpperCase().slice(-6)}`.

### 7.2 Standalone `/pay` Page

Accepts query params (`ref`, `plan`, `pc`) from a shareable URL.

### Payment Steps

| Step | Fields |
|---|---|
| 1 — Personal Details | Full name (required), Email (required), Phone (optional), Date of birth |
| 2 — Direct Debit | Bank name, Sort code (auto-formatted XX-XX-XX), Account number (8 digits) |
| 3 — Confirm | Summary table + authorisation text + "Confirm & Activate" |

### Validation Rules

| Field | Rule |
|---|---|
| Full name | Non-empty string |
| Email | Must contain @ |
| Sort code | Exactly 6 digits (formatted as XX-XX-XX) |
| Account number | Exactly 8 digits |

### Success State

After a 1.8-second simulated processing delay, PaySuccessScreen is shown with an animated checkmark, the quote reference number, and a "Go to Dashboard" button routing to `/`.

---

## 8. Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Accent | #00c685 | Buttons, highlights, active states, borders |
| Accent Dark | #00a871 | Gradient end, hover states |
| Background Deep | #0a1a14 | Page background (dark green-black) |
| Card Background | #0d2117 | Card surfaces |
| Moving Dot / Glow | #0CF2A0 | Animated dot card accent |
| Text Primary | #ffffff | Main content |
| Text Secondary | gray-300 (#d1d5db) | Secondary labels |
| Text Muted | gray-500 (#6b7280) | Placeholder, captions |
| Error | red-400 / red-500 | Validation errors |

### Typography

| Role | Font | Weights |
|---|---|---|
| Body | Inter | 300, 400, 500, 600, 700 |
| Display / Headings | Playfair Display | 400, 600, 700 (+ Italic) |

Fonts loaded non-blocking from Google Fonts with `font-display: swap`.

### Animation System

| Class / Token | Effect | Duration |
|---|---|---|
| `.hero-reveal` | Fade up from 28px | 1.1s |
| `.hero-fade` | Fade up from 20px | 1.0s |
| `.hero-zoom` | Scale from 1.08 to 1 | 1.8s |
| Framer `fadeUp` variant | opacity 0→1, y 24→0 | varies |
| `meteor` keyframe | Diagonal meteor sweep | 5s infinite |
| `moveDot` keyframe | Orbiting dot on card border | 6s infinite |

All hero animations respect `prefers-reduced-motion`.

### Reusable CSS Tokens (TypeScript constants)

```typescript
const INPUT_CLS   = 'w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-neutral-900/60 text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#00c685]/15 focus:outline-none focus:border-[#00c685]/60 transition-all h-9 text-sm';
const SELECT_CLS  = 'bg-neutral-900/60 border-white/10 text-white h-9 data-[placeholder]:text-gray-500';
const CONTENT_CLS = 'bg-neutral-900 border-white/10 text-white z-[99999]';
const ACCENT      = '#00c685';
```

---

## 9. Performance Strategy

### Critical Path (Eager Load)

- `BackgroundBeams` — above-the-fold hero visual
- `LightningSplit` — hero split component
- Google Fonts (non-blocking, swap)
- `/bg-image-1.webp` and `/bg-image-2.webp` — `<link rel="preload">`

### Below-the-Fold (Lazy Load via `next/dynamic`)

All sections below the hero are deferred with `{ ssr: false }` to avoid blocking initial paint. Pattern used on both homepage and how-it-works page.

### Bundle Optimisation

Tree-shaking applied to large packages via `next.config.ts`:
```typescript
optimizePackageImports: ['lucide-react', 'framer-motion', 'motion', 'three']
```

### Image Optimisation

- Formats: `avif` then `webp`
- Browser cache TTL: 1 year
- Static files: `Cache-Control: public, max-age=31536000, immutable`
- Responsive device sizes configured in `next.config.ts`

### Scroll Performance

- `ScrollAwareNav` uses `requestAnimationFrame` to batch scroll events
- Reads `data-dark="true"` attributes (no forced reflow)
- All event listeners are `{ passive: true }`

---

## 10. Security Architecture

### Edge Middleware (`middleware.ts`)

Runs at the network edge on every request:

1. **HTTPS Redirect** — Permanent 301 redirect from HTTP to HTTPS in production
2. **Bot Blocking** — Blocks scanners: `sqlmap`, `nikto`, `nessus`, `acunetix`, `masscan`, `zgrab`, `python-requests/2.[0-3]`
3. **Request Tracing** — Injects `X-Request-Id` header for distributed tracing

Matcher: all routes except `_next/static`, `_next/image`, favicon, and static file extensions.

### HTTP Security Headers

| Header | Value |
|---|---|
| X-Frame-Options | SAMEORIGIN — prevents clickjacking |
| X-Content-Type-Options | nosniff — prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Disables camera, microphone, geolocation, payment |
| Strict-Transport-Security | 1-year HSTS with subdomain preload |
| X-XSS-Protection | 1; mode=block (legacy browsers) |
| Content-Security-Policy-Report-Only | Strict CSP in report-only mode |

**CSP `connect-src` allows:**
- `https://api.postcodes.io` — UK address autocomplete
- `https://generativelanguage.googleapis.com` — Gemini AI API

---

## 11. Configuration & Environment Variables

### `.env.example`

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"   # Required for Gemini AI features
APP_URL="MY_APP_URL"                 # Production URL (metadata + HTTPS redirect)
```

### `next.config.ts` Key Settings

| Setting | Value | Purpose |
|---|---|---|
| `reactStrictMode` | true | Double-invokes lifecycle methods in dev |
| `typescript.ignoreBuildErrors` | false | TypeScript errors block production builds |
| `eslint.ignoreDuringBuilds` | true | ESLint does not block CI builds |
| `output` | 'standalone' | Bundles for Docker/Cloud Run deployment |
| `transpilePackages` | ['motion'] | Ensures motion package is transpiled correctly |

### Allowed Image Remote Patterns

| Domain | Use |
|---|---|
| picsum.photos | Placeholder images |
| images.higgs.ai | AI-generated images |
| d8j0ntlcm91z4.cloudfront.net | CloudFront assets |
| *.s3.eu-north-1.amazonaws.com | S3 production assets |
| images.unsplash.com | Unsplash stock images |

---

## 12. Utilities & Hooks

### `lib/utils.ts` — `cn()` helper

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Used throughout for conditional, conflict-safe Tailwind class merging.

### `hooks/use-mobile.ts`

Detects mobile breakpoint. Used to conditionally render mobile vs desktop layouts.

---

## 13. Known Bugs & Fixes Log

| Date | Bug | File | Fix Applied |
|---|---|---|---|
| 2026-07-20 | `ReferenceError: AnimatePresence is not defined` | `app/get-quote/page.tsx` | Added `AnimatePresence` to `framer-motion` import |
| 2026-07-20 | `ReferenceError: ArrowLeft is not defined` | `app/get-quote/page.tsx` | Added `ArrowLeft` to `lucide-react` import |
| 2026-07-20 | Form input labels unreadable in dark mode | `components/ui/minimal-auth-page.tsx` | Changed label colour to `text-white/90` |
| 2026-07-20 | **Deployment build crash** — `EBADPLATFORM` error: `@next/swc-darwin-arm64`, `@tailwindcss/oxide-darwin-arm64`, `lightningcss-darwin-arm64` are macOS ARM64 binaries that cannot install on Linux x64 Docker build server | `package.json` | Moved all three macOS-specific packages from `dependencies` to `optionalDependencies` — npm silently skips optional packages on non-matching platforms |

---

## 14. Changelog

### 2026-07-20

- **Bug fix:** Resolved `AnimatePresence` crash in quote engine — missing import from `framer-motion`
- **Bug fix:** Resolved `ArrowLeft` crash in quote engine — missing import from `lucide-react`
- **Accessibility:** Improved label contrast in `minimal-auth-page.tsx` (`text-white/90`)
- **Feature:** Embedded payment flow (`PayFormEmbed`) integrated directly into `QuoteReadyCard` — users can complete payment inline on `/get-quote` without navigating to `/pay`
- **Repository:** Initial codebase pushed to `https://github.com/mondheruiux-glitch/Takaful-project`
- **Documentation:** This `DOCUMENTATION.md` file created and added to project root
- **Deployment fix:** Moved `@next/swc-darwin-arm64`, `@tailwindcss/oxide-darwin-arm64`, and `lightningcss-darwin-arm64` from `dependencies` to `optionalDependencies` in `package.json` to fix `EBADPLATFORM` crash on Linux x64 Docker build servers

---

> **Developer note:** After every change — new component, bug fix, new page, design update — add a row to the **Bugs Log** (if applicable) and an entry in the **Changelog**. Keep section numbers stable; add new sections at the end.
