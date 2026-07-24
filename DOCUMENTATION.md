# Takaful — Project Documentation

> **Living Document** — This file is updated every time a new feature is added, a bug is fixed, or the architecture changes.
> Last Updated: **2026-07-22** (Nuxt Migration & Polish Release)

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
9. [Performance & SSR Strategy](#9-performance--ssr-strategy)
10. [Utilities & Composables](#10-utilities--composables)
11. [Known Bugs & Fixes Log](#11-known-bugs--fixes-log)
12. [Changelog](#12-changelog)

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
Homepage → Get a Quote (prefilled address) → Quote Summary → Activate Cover & Pay → Cover Confirmed
Homepage → How It Works → Get a Quote
Homepage → Sign Up (account creation)
Direct Link → /pay?ref=...&plan=...&pc=... (shareable payment link)
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Nuxt (Vue 3 SSR) | 3.21.9+ |
| Language | TypeScript | 5.7.3 |
| Styling | Tailwind CSS v3 | 3.4.17 |
| Animation | VueUse Motion / CSS Keyframes | 3.0.3 / — |
| Icons | Lucide Vue Next | 0.511.x |
| 3D / WebGL | Three.js + Cobe (globe) | 0.185 / 2.0.1 |
| Particles | @tsparticles/vue3 (slim) | 4.3.2 |
| Form Utilities | vee-validate / vee-validate resolvers | 4.15 / — |
| AI Integration | @google/genai (Gemini) | 2.4.0 |
| Fonts | Inter (body) + Playfair Display (headings) | Google Fonts |

---

## 3. Project Structure

```
takaful-nuxt/
├── pages/                      # Nuxt Page-based Routing
│   ├── index.vue               # Homepage (main marketing page)
│   ├── get-quote.vue           # Full 6-step quote engine & wizard
│   ├── how-it-works.vue        # Explainer page for Takaful mutuals
│   ├── signup.vue              # Auth / Signup gateway
│   └── pay.vue                 # Shareable standalone payment page
│
├── components/
│   ├── ui/                     # Reusable UI component blocks (Globe, Beams, etc.)
│   └── global/                 # Global auto-imported Nuxt components
│
├── layouts/
│   └── default.vue             # Global wrapper with header and footer
│
├── composables/                # Shared logic & Vue state helper hooks
├── utils/                      # Helper utilities (cn tailwind-merge)
├── public/                     # Static assets (images, SVGs, webp)
├── assets/                     # Stylesheet entrypoints (Tailwind, global CSS)
├── nuxt.config.ts              # Nuxt project settings & modules
├── tailwind.config.js          # Tailwind customization & themes
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## 4. Pages & Routes

### `/` — Homepage (`pages/index.vue`)
The main marketing page showcasing value proposition and trust indicators.
- Prefetches and validates postcode/address entries.
- Utilizes auto-scrolling testimonials and custom slide comparisons.

### `/get-quote` — Quote Engine (`pages/get-quote.vue`)
A multi-step quote wizard featuring address suggestions, custom belongings options, and premium calculation.
- See **Section 6** for details.

### `/how-it-works` — Explainer (`pages/how-it-works.vue`)
Detailed guide describing the community pool, Sharia compliance, and the surplus return policy.

### `/pay` — Standalone Payments (`pages/pay.vue`)
Accepts query params (`ref`, `plan`, `pc`) from shareable links to load a payment summary sheet directly.

---

## 5. Components

### Core UI Components (`components/ui/`)

- `background-beams.vue`: WebGL-inspired background visual animations.
- `UkAddressAutocomplete.vue`: Auto-suggests UK addresses by integrating OpenStreetMap API lookup.
- `compare.vue`: interactive drag slider comparing Takaful vs standard insurance models.
- `globe-feature-section.vue`: Cobe 3D interactive globe.

---

## 6. Quote Engine — Deep Dive

**File:** `pages/get-quote.vue`

### Architecture & Steps
A single-file Vue 3 wizard layout managing multi-step progression:

1. **Step 1: Property Location & Details** - Real-time lookup with OSM Nominatim API, property characteristics.
2. **Step 2: Security & Protection** - Door locks, alarms, window locks, fire prevention.
3. **Step 3: Cover Details** - Selecting Buildings vs Contents, deductible (excess), start date.
4. **Step 4: Belongings value** - Items value estimate sliders.
5. **Step 5: Personal Profile** - Claims history and basic info.
6. **Step 6: Review & Submit** - Accordion layout of user choices.

### Premium Calculation Algorithm
Calculates monthly contributions using dynamic modifiers:
```typescript
base = 35 (both) / 22 (buildings) / 18 (contents)
+ bedrooms * 3
+ 8 (contents > £30k) or 12 (contents > £50k)
- 5 (if excess >= £500)
+ 4 (accidental damage) + 2 (legal support) + 3 (emergency cover)
- 2 (burglar alarm) - 1 (CCTV)
min floor: £15.00/month
```

### Quote Summary Card PARITY
Polished to match Next.js original design exactly:
- **Price animation**: Counts up rapidly from `0` to the estimate price in **250ms**.
- **Community Price Gauge**: Interactive typical-range visualizer with range indicators.
- **Button Centering**: Aligned CTAs with drop-shadow glows (`shadow-[#00c685]/30`).
- **Footer Controls**: Side-by-side **Back to Home** and **Share** triggers.

---

## 7. Payment Flow — Deep Dive

### 7.1 Embedded Flow (`PayFormEmbed` in `/get-quote`)
Activated upon clicking the main CTA on Quote Summary. Generates unique reference code (`TK-XXXXXX`) using Base36 on mount.

### 7.2 Standalone Payment Flow
Fully responsive 3-step checkout page validating:
- **Sort Code**: Auto-formatted `XX-XX-XX` structure.
- **Account Number**: Exactly 8 digits validation.
- **Processing state**: 1.5s simulated transition to Success status checkmark view.

---

## 8. Design System

- **Primary Accent**: `#00c685` (Green)
- **Deep Background**: `#0a1a14` (Dark Green-Black)
- **Card Fill**: `#0d2117`
- **Typography**: Inter (Body) + Playfair Display (Headings) via Google Fonts setup.

---

## 9. Performance & SSR Strategy

- **SSR Safety Guards**: Browser APIs like `requestAnimationFrame` and `performance.now()` are protected inside conditional checks (`typeof window !== 'undefined'`) to prevent server execution failures.
- **Transition/Fade Animations**: Predefined `.fade-enter-active` classes inside the global layout style ensure zero flash-of-unstyled-content during route updates.

---

## 10. Utilities & Composables

- `utils/cn.ts`: Conflict-free Tailwind merge utility.
- Autocomplete: `UkAddressAutocomplete` fetches suggestions cleanly without external key dependency.

---

## 11. Known Bugs & Fixes Log

| Date | Bug | File | Fix Applied |
|---|---|---|---|
| 2026-07-21 | Postcode query param fallback mismatch | `pages/get-quote.vue` | Fully decoupled input refs from dummy placeholders; populated from URL query. |
| 2026-07-22 | SSR crash: `requestAnimationFrame is not defined` | `pages/get-quote.vue` | Added a standard `typeof window === 'undefined'` guard to the animated counter watcher. |
| 2026-07-22 | Vue warning: Dynamic component loop | `pages/get-quote.vue` | Replaced `<component :is="...">` dynamic tag in trustBadges v-for with explicit conditional v-if checks. |
| 2026-07-22 | Select input double icon overlays | `pages/get-quote.vue` | Removed overlapping absolute emoji overlays from dropdown lists. |
| 2026-07-22 | Invisible typical price range track line | `pages/get-quote.vue` | Replaced non-existent `bg-white/8` class on gauge track with standard inline CSS opacity background styles. |

---

## 12. Changelog

### 2026-07-22
- **Port**: Completed full port from Next.js to Nuxt 3.
- **Feature**: Connected address search between homepage inputs and the multi-step quote wizard using Nominatim API.
- **UI Match**: Polished the Quote Summary card visual layouts, price speed sweeps (250ms), and button styles matching design requirements.
- **SSR Validation**: Guarded client-only request animation loops to ensure error-free server rendering.
- **Build**: Compiles cleanly with zero errors on production assets.
