# HauxHunt

Marketing website for HauxHunt, built with Next.js.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://motion.dev)
- [Lucide Icons](https://lucide.dev)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project structure

```text
src/
  app/                  # Routes, layouts, route handlers (App Router)
  components/
    ui/                 # shadcn/ui primitives (generated, don't hand-edit)
    layout/             # Structural components — header, footer, nav
    sections/           # Page sections composed from smaller components
    shared/              # Reusable, cross-page components (logo, badges, etc.)
    providers/           # Client-side context/providers
  config/               # Site-wide config (metadata, nav, links)
  hooks/                # Reusable client-side hooks
  lib/                  # Utilities, helpers, third-party client setup
  types/                # Shared TypeScript types
  data/                 # Static content/data for marketing sections
public/
  images/               # Static images served as-is
```

### Conventions

- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Add shadcn/ui components with `npx shadcn@latest add <component>` — they land in `src/components/ui`.
- Keep page-specific markup in `components/sections`, and only compose those sections inside `app/**/page.tsx`.
- Site-wide constants (name, description, URLs, nav) live in `src/config/site.ts` — update there, not inline.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint with ESLint
- `npm run format` — format with Prettier

## Deployment

Deploys cleanly to [Vercel](https://vercel.com/new) or any Node-compatible host.
