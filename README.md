# Natura Homes

Bilingual (EN/ES) website for Natura Homes: property management, vacation rentals, concierge and real estate in La Fortuna, Costa Rica.

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · next-intl 4 · Motion · Zod 4 · React Hook Form

## Run it

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000 (redirects to /en)
npm run build && npm start   # production
```

Node 20.9 or newer. If you pin Next.js 15 instead of 16, rename `src/proxy.ts` to `src/middleware.ts`.

## Before launch: what to supply

| Item | Where |
|---|---|
| White landscape brand icon (`natura-homes-icon.png`) | `public/branding/`; used in the footer and resized for the site and Apple touch icons. A separate full logo can still be configured in `src/config/site.ts` for the header. |
| Editorial photography (hero, intro, section images) | `public/images/editorial/`, then fill the slots in `src/config/media.ts` |
| Property photos and videos | `public/images/properties/<slug>/`, referenced from the JSON files |
| Official WhatsApp, email and Instagram | Set in `src/config/site.ts`; optional Facebook remains configurable through `NEXT_PUBLIC_FACEBOOK_URL`. |
| Form delivery | `.env.local`: set the four `NEXT_PUBLIC_FORMSPREE_*_ID` values from Formspree. Contact, consultation, concierge, and property/experience inquiries each use their own Formspree form. Replace the clearly named placeholders before testing or deploying. |
| Real listings, experiences details, reviews | `src/data/*.json` |
| Privacy notice and terms | `messages/*.json` → `legal`. Shipped as drafts: have counsel review. |

## Content

All business content lives in `src/data/`:

- `vacation-rentals.json`, `real-estate.json`, `experiences.json`, `testimonials.json`
- Every record is validated against `src/schemas/content.ts`. Invalid records are skipped and logged, never rendered half-broken.
- Unknown values stay `null`. The UI hides missing facts rather than inventing them.
- `published: false` hides an entry; `featured: true` surfaces it on the home page.
- Real estate `status`: `available`, `under-contract`, `sold`. Sold listings never show a price, sort last, and are excluded from the default filter.
- Testimonials: paste reviews exactly as written, with `source` and `sourceUrl`. The section is hidden while the file is empty.
- Amenities are keys (`pool`, `volcano-view`, `wifi`...) translated in `messages/*.json` → `amenities`. Unknown keys still display.
- Text fields are plain text. Blank lines become paragraphs. HTML is never rendered.

`src/data/vacation-rentals.json` contains one example entry (Volterra House, from the brief) with empty details. Replace or unpublish it.

Image entry example:

```json
{ "src": "/images/properties/volterra-house/pool.jpg",
  "alt": { "en": "Pool terrace facing Arenal Volcano", "es": "Terraza de la piscina frente al Volcán Arenal" },
  "width": 2400, "height": 1600 }
```

## Architecture

```
src/
  app/[locale]/        pages (home, property-management, vacation-rentals/[slug],
                       concierge/[slug], real-estate/[slug], about-contact, privacy, terms)
  app/api/inquiry/     legacy endpoint; website forms submit directly to Formspree
  components/          layout, navigation, ui, properties, real-estate, experiences, gallery, forms, whatsapp
  config/              site.ts (contact, logo, nav), media.ts (editorial images)
  data/                JSON content
  i18n/                next-intl routing, navigation, request config
  lib/content/         data access layer (provider interface + JSON provider)
  lib/                 seo, structured data, booking layer, form delivery, formatting
  schemas/             Zod schemas for content and forms
messages/              en.json, es.json (UI copy only; business content lives in data/)
```

**Swapping the data source.** Pages call `src/lib/content/index.ts` only. To move to Sanity, a PMS or a database, implement `ContentProvider` (`src/lib/content/provider.ts`) and change one line in `index.ts`.

**Booking.** `src/lib/booking.ts`. A rental with `booking.url` links out ("Check Availability"); otherwise the button opens the inquiry form. Nothing simulates availability or payments. A channel manager plugs in by implementing `BookingAdapter`.

**WhatsApp.** The floating button reads a page-specific message: detail pages set it with `<SetWhatsAppMessage />`, so the chat opens already naming the property, listing or experience.

**Animation.** Reveal-on-scroll is CSS plus one shared IntersectionObserver (`RevealObserver`), so it costs no per-component JavaScript. Content is visible without JS, a safety timer reveals everything if scripts fail, and `prefers-reduced-motion` disables movement. Motion for React is used only for the mobile menu.

**Accessibility.** Skip link, landmark navigation, `aria-current` states, dialog focus traps with Escape and focus return (mobile menu, gallery), keyboard and swipe gallery navigation, labelled form fields with linked error messages, live regions for results and form status, 44px touch targets.

**SEO.** Per-page metadata, canonical URLs, `hreflang` (en, es-CR, x-default), Open Graph (default social card generated at `app/[locale]/opengraph-image.tsx`), `sitemap.xml`, `robots.txt` (blocks indexing outside production), JSON-LD for the business, services, breadcrumbs, and vacation rentals once a rental has photos and a description.

**Forms.** The contact, consultation, concierge, and property/experience inquiry forms use `@formspree/react` and submit asynchronously without leaving the site. Client-side Zod validation, English/Spanish status messages, and a Formspree honeypot are retained. Each submission includes its form type, locale, and page path. The previous `/api/inquiry` delivery route remains available but is not used by these forms.

## Future integrations

- **CMS**: implement `ContentProvider` for Sanity; add the CDN host to `images.remotePatterns`.
- **Booking engine**: implement `BookingAdapter`; the rental page already branches on booking mode.
- **Owner portal**: add an authenticated `app/[locale]/owners/` segment; the data layer and types are ready to extend.
- **Analytics**: add GA4 or Plausible with a consent banner where required. Nothing is tracked today.
