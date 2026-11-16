# Natura Homes

Bilingual (EN/ES) website for Natura Homes: property management, vacation rentals, concierge and real estate in La Fortuna, Costa Rica.

This project is built for static export and GitHub Pages deployment. The site remains fully bilingual, uses Next.js 16 App Router, and submits forms directly to Formspree from the browser.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000/en and use the locale switcher to browse the English and Spanish versions.

## Production build

```bash
npm run build
```

The build outputs a static `out/` directory ready for GitHub Pages. For a local static preview, run a lightweight static server from the `out/` folder.

## GitHub Pages deployment

1. Push the project to GitHub.
2. In the repository, open Settings → Pages.
3. Set the source to **GitHub Actions**.
4. The workflow publishes the generated `out/` folder on pushes to `main`.
5. The default Pages path is `/natura-homes`; the workflow can override it with repository variables.

The workflow defaults to:

```text
PAGES_BASE_PATH=/natura-homes
PAGES_SITE_URL=https://claudiaolivasmo.github.io
```

`PAGES_SITE_URL` is the origin only; the configured base path is added automatically. To use a custom domain at the site root, set repository variables `PAGES_BASE_PATH` to `/` and `PAGES_SITE_URL` to the custom-domain origin (for example `https://www.naturahomes.cr`). The base-path setting is build-time only.

## Required environment variables

Create `.env.local` from `.env.example` and replace the placeholder Formspree IDs with the actual IDs from your Formspree account.

```bash
NEXT_PUBLIC_SITE_URL=https://www.naturahomes.cr
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_FORMSPREE_CONTACT_ID=YOUR_CONTACT_FORM_ID
NEXT_PUBLIC_FORMSPREE_CONSULTATION_ID=YOUR_CONSULTATION_FORM_ID
NEXT_PUBLIC_FORMSPREE_CONCIERGE_ID=YOUR_CONCIERGE_FORM_ID
NEXT_PUBLIC_FORMSPREE_PROPERTY_INQUIRY_ID=YOUR_PROPERTY_INQUIRY_FORM_ID
```

Do not add any server-only secrets or admin credentials to the frontend build.

## Static export architecture

- `next.config.ts` uses `output: "export"` and `trailingSlash: true` for GitHub Pages compatibility.
- `NEXT_PUBLIC_BASE_PATH` selects the deployment path at build time. It is empty by default for local development and custom-domain roots; GitHub Actions defaults it to `/natura-homes`.
- Next.js applies `basePath` to framework CSS/JavaScript chunks and `next/link` navigation. Public images, logos, video, posters, and favicon URLs use a shared path helper.
- `assetPrefix` is intentionally unset; this site serves its Next.js assets from the same origin, not a separate CDN.
- Pages are prerendered as static HTML at build time.
- Locale-specific routes remain under `/en` and `/es`.
- Visiting the deployment root redirects to `/en/`; the Spanish locale remains directly available at `/es/`.
- Forms submit directly to the relevant Formspree endpoint without server APIs or Next.js route handlers.
- Hero media is managed manually by editing `data/hero-media.json`; no admin backend or cookies are required.

## GitHub Pages DNS and custom domain

Use the domain you already own and set the GitHub Pages custom domain to the exact hostname you want to serve (for example `www.naturahomes.cr` or `naturahomes.cr`).

Then configure your DNS at the registrar:

- If using an apex domain: add an A record pointing to GitHub Pages IPs, or use the GitHub Pages apex domain guidance.
- If using a subdomain such as `www`: add a CNAME record to `username.github.io`.
- If using a custom domain on GitHub Pages, also enable the custom domain in the GitHub Pages settings UI.

Exact records depend on the domain and the GitHub Pages setup; do not assume the same value for every registrar. Confirm the final values in the GitHub Pages UI and your DNS provider before publishing.

## Content and media

- Business content lives in `src/data/*.json` and is static at build time.
- The locale content remains in `messages/en.json` and `messages/es.json`.
- Hero media is configured in `data/hero-media.json` and uses the `public/` static asset directory.
- Replace or update images and video files directly inside the repository when content changes.

## Forms

The website uses the public Formspree IDs from the environment to submit directly from the browser. Each form includes form type, locale and page path metadata. No Netlify server functions, custom API routes, or server actions are required.

## Notes

- Node 20.9 or newer is required.
- The project intentionally does not keep the legacy admin hero panel or server-side inquiry endpoints.
- The resulting build is a static website designed for GitHub Pages hosting, not a Node.js server deployment.

