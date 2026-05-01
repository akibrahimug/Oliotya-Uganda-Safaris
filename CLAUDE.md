# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Oliotya Safaris (package name `oliotya-safaris`) — a Next.js 15 App Router site combining a public-facing safari booking website with a built-in Clerk-protected CMS. Note: the README still references the older "Nambi Uganda Safaris" branding in places (e.g. R2 bucket name, default admin email); see `docs/REBRANDING_SUMMARY.md`.

## Commands

```bash
yarn dev                  # Next dev server (port 3000)
yarn build                # Production build (typescript errors are ignored — see next.config.mjs)
yarn start                # Production server
yarn lint                 # ESLint
yarn test                 # Jest (uses multi-project config: "default" jsdom + "database" node)
yarn test:watch
yarn test:coverage        # Strict 100% thresholds on tested modules (see jest.config.ts)

# Run a single test file
yarn jest path/to/file.test.ts
yarn jest -t "describe or it pattern"

# Prisma
npx prisma generate       # Output goes to prisma/app/generated/prisma-client (NOT @prisma/client)
npx prisma migrate dev
npx prisma migrate deploy

# One-off scripts (use tsconfig.script.json for ts-node scripts)
yarn migrate:images       # scripts/upload-images-to-r2.ts
yarn sync:r2-to-cms       # scripts/sync-r2-to-cms.ts
yarn seed:hero            # scripts/seed-hero-slides.mjs
# Many more seeds in scripts/seed-*.mjs — run with `node scripts/<name>.mjs`
```

Node `>=22` is required (per `engines` in package.json).

## Architecture

### Two apps in one Next.js project

The `app/` directory contains both the public site and the CMS:

- **Public routes** at the root: `app/page.tsx`, `app/about`, `app/packages`, `app/destinations`, `app/destination/[slug]`, `app/package/[slug]`, `app/contact`, `app/book`, `app/booking-confirmation`, `app/build-package`, `app/bundle-packages`, `app/gallery`.
- **CMS routes** under `app/cms/*` and `app/api/cms/*`. The CMS layout (`app/cms/layout.tsx`) is gated by Clerk: it requires `userId`, then checks for admin via `publicMetadata.role === "admin"` OR an `org:admin` org membership. `middleware.ts` enforces auth on `/cms(.*)` and `/api/cms(.*)`; everything else is public.
- All CMS pages are `force-dynamic` with `revalidate = 0`.

### Content model — "CMS overlay" pattern

There are TWO sets of content models in `prisma/schema.prisma`, and this is intentional:

- **Operational models** (used by the public site): `Destination`, `Package`, `Booking`, `ContactInquiry`, `NewsletterSubscription`, `User`, `UserFavorite`, `CustomPackage`, `PackageBundle`.
- **CMS / page-content models** (edited via the CMS, often with `ContentStatus { DRAFT | PUBLISHED }` + `publishedAt`): `CMSImage`, `CMSDestination`, `HeroSlide`, `SiteSettings`, `TeamMember`, `TeamSection`, `FAQ`, `CMSAuditLog`, `EmailTemplate`, plus per-section models for each page (`HomeHero`, `ExperienceSection`, `TourGuideSection`, `VideoSection`, `AboutHero`, `AboutStorySection`, `AboutCommunitySection`, `AboutStats`, `AboutValue`, `AboutCTA`, `ContactHero`, `ContactInfo`, `ContactResource`, `PackagesHero`, `DestinationsHero`, `DestinationsCTA`, `BookingConfirmation*`, `CustomPackage{Hero,Content}`).

When adding a CMS-editable section, the pattern is consistent: a Prisma model → an `app/api/cms/<section>/route.ts` (and modal component in `components/cms/`) → a public component in `components/<section>.tsx` that reads the published row.

### Prisma client location

The generated client lives at `prisma/app/generated/prisma-client`, NOT the default `@prisma/client`. Always import via `lib/db.ts`:

```ts
import { prisma } from "@/lib/db";
```

`lib/db.ts` uses the standard "globalThis singleton in dev" pattern.

### Image pipeline (R2 + client-side WebP)

This is a non-trivial subsystem worth knowing:

1. Browser uploads go through `lib/image-client.ts` — compresses to WebP at 85% → 70% → 50% as needed, max 3840px, target <4MB to fit Vercel's body limit (originals up to 10MB allowed).
2. `app/api/cms/images/route.ts` (Node runtime, `force-dynamic`) receives the upload, may further process with Sharp, and uploads via `lib/r2.ts` (`uploadToR2`) which writes to Cloudflare R2 under `${BUCKET_NAME}/<folder>/<filename>` with a 1-year `Cache-Control`.
3. Metadata is stored in `CMSImage`. Public URL comes from `NEXT_PUBLIC_R2_PUBLIC_URL`.
4. `next.config.mjs` whitelists `**.r2.cloudflarestorage.com`, `**.r2.dev`, and `images.nambiugandasafaris.com` in `images.remotePatterns`.

When wiring images into UI, prefer `next/image` and pull URLs from CMS records — don't hardcode CDN paths.

### Auth

- Clerk via `@clerk/nextjs`. `middleware.ts` only protects CMS surfaces. The CMS layout does the admin role check (metadata or org).
- API routes under `/api/cms/*` re-check `auth()` themselves and 401 unauthenticated callers — don't rely solely on middleware.

### Validation, errors, rate limiting

- Zod schemas live in `lib/validations/*.ts` (booking, contact, custom-package, hero-slide, image, newsletter, package). These are the canonical request shapes — reuse them rather than re-validating ad hoc.
- `lib/error-handler.ts` and `lib/api-errors.ts` standardize API error responses.
- `lib/rate-limit.ts` uses `@upstash/ratelimit` with a sliding window. If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` aren't set, it falls back to a no-op mock that always allows — so locally rate limits silently pass; in production they are enforced.

### Email

`lib/email.ts` wraps Resend. `EMAIL_SUBJECT_PREFIX` (default `"Oliotya"`) is auto-prepended to subjects, with logic to avoid double-prefixing. React Email templates live in `emails/`. Editable email content (subject, copy, colors) is stored in the `EmailTemplate` model and managed in `app/cms/email-templates`.

### TypeScript / build quirks

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — `next build` will succeed despite type errors. **This means TS errors must be caught manually** (`npx tsc --noEmit`) or via `yarn lint`; CI / Vercel won't catch them at build time. Don't assume a green build means types are clean.
- `reactStrictMode: false` is intentional (per the comment, to reduce hydration warnings).
- Path alias `@/*` → repo root.

### Testing

`jest.config.ts` defines two projects:
- **default** (jsdom): everything except `lib/__tests__/db*`.
- **database** (node): `lib/__tests__/db*.test.ts` — these expect a real DB connection. Skip them with `yarn jest --selectProjects default` if you don't want to hit Postgres.

Coverage thresholds are **100% for specific tested modules** (`lib/validations/*`, `lib/seo.ts`, `lib/error-handler.ts`, `lib/utils.ts`, `components/ui/{input,textarea}.tsx`, `components/package-card.tsx`) and 10% globally. If you add code to these modules, you must keep their coverage at 100% or `yarn test:coverage` will fail.

## Adding a new CMS-editable section (recipe)

1. Add the Prisma model with `ContentStatus` + `publishedAt` if it should support draft/publish.
2. `npx prisma migrate dev` and regenerate the client.
3. Create `app/api/cms/<section>/route.ts` (GET + PATCH/PUT) — Node runtime, `force-dynamic`, re-check `auth()`, write a `CMSAuditLog` entry on mutation.
4. Add a modal in `components/cms/<section>-modal.tsx` matching the existing patterns.
5. Add a public component (or update an existing one) under `components/` that reads the published row server-side.
6. If image-bearing, use `components/cms/image-picker.tsx` rather than rolling a new uploader.

## Things to know before destructive operations

- The `prisma/migrations` directory has a long history; never reset it without checking with the user.
- R2 uploads are not auto-deleted when a `CMSImage` row is removed — confirm intent before adding cascading deletes.
- `force-dynamic` is set on CMS layouts/routes deliberately. Don't add `revalidate` or `generateStaticParams` to CMS surfaces.
