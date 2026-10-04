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
- `/blog` — published community posts and individual articles.
- `/admin` and `/site/umojaverseupdate` — authenticated content dashboards.

## Content dashboard

Run `supabase/schema.sql` in your Supabase project to create programs, posts,
publication policies, the public media bucket, and initial content. Set the
Supabase variables listed in `.env.example` in `.env.local` for development and
in Vercel's production environment for deployment. Keep the service role key
server-only; never commit `.env.local` or credentials.

Create an administrator in Supabase Auth and put their email in `ADMIN_EMAILS`.
Only listed accounts may sign in to the dashboard; an empty allowlist denies
access. Editors can manage publication, dates, Markdown, video links, and cover
images. Image uploads are limited to 4MB to fit Vercel's request-size limit.
Public content falls back to the bundled seed data when Supabase is unavailable.

Administrators sign in at `/admin/login`. To change an administrator's email,
update the existing user in Supabase Auth and the `ADMIN_EMAILS` value in both
development and Vercel, then redeploy so the allowlist takes effect.

The private password-reset form is at `/admin/reset-password`. An account
operator can use Supabase's server-side `auth.admin.generateLink` with type
`recovery` for the administrator's email, then deliver a link in the format
`https://umojaverse.xyz/admin/reset-password#token_hash=<hashed_token>`. Never
commit or log the resulting token. This generation method does not send email.
The administrator chooses a new password in the form and signs in again after
the change. Opening the page without a valid recovery link cannot change a
password. Recovery sessions use separate, HttpOnly cookies scoped to the reset
page and expire after 15 minutes; they do not grant dashboard access.

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
npm run test:content
npm run test:password-reset
npx playwright install chromium
npm run test:e2e
```

Browser tests cover the main routes, mobile navigation, program filtering, enquiry drafts, responsive overflow, and a missing program. Tests start the production server, so run the build first. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing Chromium installation.

Theme unit tests cover the initial appearance, saved choices, device changes, restricted storage, and cross-tab updates. Browser tests additionally exercise the appearance control, keyboard dismissal, mobile navigation, and persistence across routes and reloads.

Password-reset tests cover token validation, the administrator allowlist,
password-policy retries, session isolation, and cookie cleanup. Browser tests
check that the token stays out of navigation URLs and that a missing recovery
link cannot authorize a password change.

## Vercel

Production runs in the existing Vercel project `umojatemplate`, team
`griffins-projects-4324ce43`. Source code lives in
`umojaversepeeps-commits/landingpage`. The repository root is the application
root; the framework is Next.js, installation uses `npm ci`, and the build
command is `npm run build`. Production variables live in Vercel settings.
`.vercelignore` excludes local secrets, test artifacts, and original assets.

https://umojaverse.xyz serves the site. `www.umojaverse.xyz` redirects to the
apex domain with HTTP 308, preserving paths. Both domains and HTTPS were checked
on 4 October 2026. See `truehost-dns-request.md` for DNS and certificate details.

Deployments to this project currently use the CLI. Automatic Git deployments
require repository write access for the GitHub account connected to Vercel,
`FidelCoder`, followed by connecting the repository in Vercel project settings.
The outdated `Griffins-sys254/umojatemplate` repository has been disconnected.

Before a manual production deployment, confirm that the local Vercel link points
to `umojatemplate` in `griffins-projects-4324ce43`, then run:

```sh
vercel --prod --scope griffins-projects-4324ce43
```

The separate deployment at https://umojaverse-site.vercel.app remains available.
Confirmed community/contact destinations remain optional environment variables;
without them the site uses its documented X handoff.
