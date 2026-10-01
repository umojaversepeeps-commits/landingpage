# Umojaverse

A multipage website refined from the individual Stitch page designs in `design/New/`. Built with Next.js App Router, TypeScript, and Tailwind CSS for deployment on Vercel. No Vite.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production commands:

```sh
npm run build
npm run start
```

## Pages

- `/` — a concise editorial homepage introducing the community, a program, and a builder story.
- `/programs` — filterable program archive, upcoming empty state, and individual program pages.
- `/projects` — documented program outcomes and a community story.
- `/about` — purpose and community values.
- `/partners` — collaboration options and an enquiry draft flow.
- `/join` — community introduction, a confirmed destination, and accessible expandable questions.

## Content and contact

Edit `src/lib/site.ts` for shared information, program records, and source URLs. Page content lives under `src/app/`.

The example event and AfriPay repository in the Stitch export were unverified, so the implementation uses documented past Umojaverse programs. It does not advertise expired dates as upcoming events. Program outcome figures link to the January 2025 report and are not presented as current community totals.

The confirmed X profile is the default community/contact destination. Copy `.env.example` to `.env.local` to supply a confirmed community invite and partnership inbox. Public environment variables are included at build time, so rebuild after changing them.

The partnership form **prepares a message; it does not send or store submissions**. It validates input, preserves an editable draft, and offers a copy/X handoff. With `NEXT_PUBLIC_CONTACT_EMAIL` configured, it opens a populated email draft instead. Add a verified email delivery service later if direct submissions are needed.

## Assets

- The header and footer logo assets are cropped from the provided `Lz2MQ2Zv_400x400.jpg`.
- The website uses six photos the owner supplied in `select/`, exported as optimized WebP files under `public/images/community-*`. Each placement has its own focal position and descriptive alt text; see `photos/README.md` for the original-to-asset mapping and `src/lib/photos.ts` for the assets in use. The three earlier `arbitrum-pulse-ethiopia-*` exports remain as unused alternatives.
- Geist is self-hosted via `next/font/local` for consistent sans-serif typography and offline builds, with no runtime font requests to third parties.
- Keep `design/` as reference material; the application does not execute its CDN-based HTML.

## Appearance

The header appearance control offers Light, Dark, and System. New visitors follow their device theme. Choices persist in local storage and synchronize across tabs; System follows device changes. If storage is unavailable, switching still works for the current page.

A small inline script applies the preference before the page paints, and CSS follows the device when JavaScript is disabled. Theme colors cover page surfaces, text, controls, and logos; event photographs retain their natural color. No theme dependency or request-time server rendering is needed.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm run test:theme
npx playwright install chromium
npm run test:e2e
```

Browser tests cover the main routes, mobile navigation, program filtering, enquiry drafts, responsive overflow, and a missing program. Tests start the production server, so run the build first. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing Chromium installation.

Theme unit tests cover the initial appearance, saved choices, device changes, restricted storage, and cross-tab updates. Browser tests additionally exercise the appearance control, keyboard dismissal, mobile navigation, and persistence across routes and reloads.

## Vercel

Import the project into Vercel and use its Next.js framework preset. The repository root is the application root. Add any confirmed public environment values in project settings and deploy. No custom server or Vercel configuration file is required.

Publication still needs confirmed community/contact destinations. No deployment has been performed by this implementation.
