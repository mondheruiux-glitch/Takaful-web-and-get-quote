# Graph Report - .  (2026-07-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 352 nodes · 451 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- cn
- dependencies
- page.tsx
- page.tsx
- page.tsx
- compilerOptions
- hero-section-nexus.tsx
- devDependencies
- pill-badge.tsx
- particles.tsx
- package.json
- layout.tsx
- react
- stack-feature-section.tsx
- interactive-scrolling-story-component.tsx
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `compilerOptions` - 17 edges
3. `PillBadge()` - 8 edges
4. `Particles()` - 6 edges
5. `scripts` - 6 edges
6. `Button` - 5 edges
7. `react` - 5 edges
8. `include` - 5 edges
9. `AnimatedTooltip()` - 4 edges
10. `Meteors()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Comparison()` --calls--> `cn()`  [EXTRACTED]
  app/page.tsx → lib/utils.ts
- `Globe()` --calls--> `cn()`  [EXTRACTED]
  components/blocks/globe-feature-section.tsx → lib/utils.ts
- `BoxesCore()` --calls--> `cn()`  [EXTRACTED]
  components/ui/background-boxes.tsx → lib/utils.ts
- `BentoGrid()` --calls--> `cn()`  [EXTRACTED]
  components/ui/bento-grid.tsx → lib/utils.ts
- `Compare()` --calls--> `cn()`  [EXTRACTED]
  components/ui/compare.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (31): tooltipPeople, Globe(), GLOBE_CONFIG, AnimatedTooltip(), Boxes, BoxesCore(), BentoGrid(), BentoGridProps (+23 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (49): autoprefixer, class-variance-authority, clsx, cobe, framer-motion, @google/genai, @hookform/resolvers, lucide-react (+41 more)

### Community 2 - "page.tsx"
Cohesion: 0.05
Nodes (25): BackgroundBeams, Boxes, claimsSteps, compRows, containerVariants, coverageItems, Dot, ease (+17 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (18): PROPERTY_TYPES, STEP_DESCS, STEP_TITLES, Alert, AlertContent, AlertDescription, AlertProps, AlertTitle (+10 more)

### Community 4 - "page.tsx"
Cohesion: 0.08
Nodes (16): containerVariants, FeaturedSectionStats, Features8, HoverFooter, itemVariants, StickyFeatureSection, Testimonial1, tooltipPeople (+8 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+19 more)

### Community 6 - "hero-section-nexus.tsx"
Cohesion: 0.08
Nodes (10): cn(), Dot, DropdownItemProps, DropdownMenuProps, NavLink(), NavLinkProps, RotatingText, RotatingTextProps (+2 more)

### Community 7 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, firebase-tools, devDependencies, eslint, eslint-config-next, firebase-tools, tailwindcss (+17 more)

### Community 8 - "pill-badge.tsx"
Cohesion: 0.16
Nodes (9): PillBadge(), PillBadgeProps, AnimatedHeader(), features, useScrollAnimation(), firstColumn, secondColumn, testimonials (+1 more)

### Community 9 - "particles.tsx"
Cohesion: 0.29
Nodes (6): MinimalAuthPage(), MinimalAuthPageProps, hexToRgb(), MousePosition, Particles(), ParticlesProps

### Community 10 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, dev, lint, start (+1 more)

### Community 11 - "layout.tsx"
Cohesion: 0.25
Nodes (4): metadata, extends, nextConfig, next

### Community 12 - "react"
Cohesion: 0.40
Nodes (4): Comparison(), useIsMobile(), react, react

## Knowledge Gaps
- **149 isolated node(s):** `extends`, `STEP_TITLES`, `STEP_DESCS`, `PROPERTY_TYPES`, `BackgroundBeams` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`, `react`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `cn`, `dependencies`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `page.tsx`, `page.tsx`, `page.tsx`, `particles.tsx`, `react`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **What connects `extends`, `STEP_TITLES`, `STEP_DESCS` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06397306397306397 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0545876887340302 - nodes in this community are weakly interconnected._