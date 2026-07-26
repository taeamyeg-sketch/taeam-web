# Taeam Website — Handoff Brief (2026-07-04)

You are picking up the **taeam-web** customer ordering website (Next.js) on a Windows machine. This brief is everything a previous agent (on macOS) tried, deployed, and learned, plus Rayan's vision and the open decisions. Read it fully before touching code.

---

## 0. FIRST THING: you won't have `.env.local`
`taeam-web/.env.local` is gitignored, so it did NOT come through git. The site will not build or run without it. Recreate `taeam-web/.env.local` (copy `taeam-web/.env.example` and fill real values). Keys needed:
- `NEXT_PUBLIC_SUPABASE_URL` = https://qpeoyqhillxhcrphwure.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Supabase project anon key, public)
- `NEXT_PUBLIC_BACKEND_URL` = https://taeam-backend-production.up.railway.app
- `NEXT_PUBLIC_STRIPE_PK_TEST` and `NEXT_PUBLIC_STRIPE_PK_LIVE` = Stripe publishable keys (live one lives in `taeam_app/.env.production`)

Ask Rayan for the anon key + Stripe PKs if you don't have them. All are `NEXT_PUBLIC` (publishable), not true secrets, but still never commit `.env.local`.

---

## 1. What this is + where it lives
- **taeam-web/** — Next.js 16 (App Router) + Tailwind v4 + `@phosphor-icons/react` + `@supabase/supabase-js` + Stripe. Customer ordering site: browse → restaurant menu → cart → checkout (Stripe) → live tracking, plus account pages and marketing/SEO pages.
- **Live preview:** https://taeam-web.pages.dev (Cloudflare Pages project **`taeam-web`**, direct-upload, NOT git-connected). Becomes **taeam.ca** at launch.
- **Experiment page:** https://taeam-web.pages.dev/v2 (see §4).
- **Data:** read live from Supabase project `qpeoyqhillxhcrphwure` (public-read RLS tables: `restaurants`, `menu_items`, `delivery_zones`, `config`). Static export bakes data at build time.
- **Backend:** Railway Express (`NEXT_PUBLIC_BACKEND_URL`) for Stripe create-payment-intent, compute-route, finalize-delivery. `taeam-web.pages.dev` is already in the backend's KNOWN_ORIGINS, so checkout works with no backend change.

### DO NOT TOUCH
- Cloudflare project **`taeam-website`** (serves the real taeam.ca marketing site, https://taeam-website.pages.dev). Different project. We only borrow its *look*, we don't deploy to it.
- The "fake"/test restaurants in the DB (`taeams_donair` is_test=true, `penny_donair_921` seed). Rayan says they're fine pre-launch. Do not spend time removing them.

---

## 2. Commands
```
cd CascadeProjects/taeam-web
npm install                 # first time on Windows
npm run dev                 # local dev at http://localhost:3000
npx tsc --noEmit            # fast type-check
PREVIEW_EXPORT=1 npm run build   # static export to out/ (Cloudflare needs this env)
npx wrangler pages deploy out --project-name taeam-web --branch main --commit-dirty=true   # publish
```
`PREVIEW_EXPORT=1` toggles `output:'export'` in `next.config.ts` (static site in `out/`). Without it you get a normal SSR build (no `out/`).

Edge function deploy (Supabase CLI, must be logged in + project linked):
```
cd CascadeProjects
supabase functions deploy places-suggest --no-verify-jwt --project-ref qpeoyqhillxhcrphwure
```

---

## 3. What the previous agent did this session (all DEPLOYED and live)
Rayan's fix list, all done + published to taeam-web.pages.dev:
1. **Killed every em/en dash in user-facing copy.** Rayan: dashes "scream ai written." This is a HARD RULE going forward — zero `—`/`–` in any copy. Rewrite with commas/periods. Compound hyphens ("Taeam-verified", "20-30 min") are fine.
2. **Nav:** logo-only hard-left (removed the "Taeam" wordmark text + "Edmonton" pill), bigger actions hard-right, header+logo shrink on scroll, frosted backdrop. (`src/components/Header.tsx`)
3. **Hero (current /):** brand lockup طعام | Taeam + headline **"Taste the trust."** + halal subline. REMOVED the "ta'ām = Arabic word for food" meaning-explainer (Rayan: "why tf are we telling the meaning of our brand"). Also reworded /about H1. Staggered on-load entrance. (`src/app/page.tsx`, `.rise` in `globals.css`)
4. **Category browsing** on /restaurants: app-style sticky chip rail with Phosphor icons + gold selected state, derived from each restaurant's `categories` (excludes "Halal"), instant client filter. (`src/components/RestaurantsBrowser.tsx`)
5. **Motion pass:** richer scroll-reveal (adds scale), card hover lift + arrow-slide, chip transitions, `.link-underline`. Respects `prefers-reduced-motion`.
6. **Real address autocomplete** (app parity). Browsers can't call Google Places directly (CORS), so there is a NEW public edge function **`places-suggest`** (see §5). NEW `src/lib/places.ts` + `src/components/AddressAutocomplete.tsx`. Wired into:
   - Hero `AddressGate` — the typed box used to be a FAKE DOOR (ignored input, routed to /restaurants); now it geocodes → checks `delivery_zones` → stores `taeam.location`.
   - Checkout "Deliver to" — unblocks web-only ordering with no saved address.
   - Degrades gracefully if the function is down (no dropdown; GPS + saved addresses still work).

---

## 4. The /v2 experiment (the current active question)
Rayan felt the current cream + serif + cinematic **video hero reads like a clothing brand**. He loves the **diagonal split** on taeam.ca. So the previous agent recreated taeam.ca's components and put them on a throwaway **`/v2`** page to compare (nothing on `/` was lost):
- **Diagonal clip-path hero** (`clip-path: polygon(100% 0, 100% 100%, 0 100%)`): near-black **TAEAM / Taste the trust** on the light upper-left (over a real food photo), giant gold **طعام / طعم الثقة** on the dark lower-right. Vivid gold `#EAB308` on `#0f0f0f`.
- Waitlist swapped for the real **address search** (big white pill + gold "Find food" button). Offer line repurposed: "15% off + 1000 founding points on your first order."
- **The Halal Trust Gap** section ported from taeam.ca (CBC citations — the strongest content on either site).
- Then flows into our cream ordering content (founding restaurants).
- Files: `src/app/v2/page.tsx`, `src/components/marketing/MarketingHero.tsx`, `src/components/marketing/TrustGap.tsx`.

**The decision Rayan is weighing (build this next):**
- Does the `/v2` gold-on-black diagonal direction win over the cream/video `/`?
- If yes: **commit the gold-on-black brand across the WHOLE site** (re-skin every page), OR keep cream and only borrow the diagonal hero. The honest issue with `/v2` today is the abrupt jump from the dark bold top to the cream cards below — pick one lane.

---

## 5. `places-suggest` edge function (deployed, verified)
- File: `CascadeProjects/supabase/functions/places-suggest/index.ts`.
- Deployed to Supabase `qpeoyqhillxhcrphwure`, **verify_jwt=false** (public, because the homepage address box runs before sign-in).
- Guards: **Origin allowlist** (taeam-web.pages.dev, taeam.ca, www.taeam.ca, localhost:3000), input-length cap, `country:ca`. Reuses the existing `GOOGLE_PLACES_API_KEY` project secret (same key `places-proxy` uses).
- Verified live: returns Edmonton predictions; 403s missing/non-Taeam origins.
- **STILL TODO (Rayan, off-repo):** restrict the Google Maps/Places API key by HTTP referrer in Google Cloud Console. That's the real spend guard. Do this before public launch.
- If you add a new domain (e.g. taeam.ca), add it to `ALLOWED_ORIGINS` in the function and redeploy.

---

## 6. Rayan's vision + hard rules
- **Brand voice:** tagline is **"Taste the trust"** (Arabic: طعم الثقة). NO em/en dashes anywhere. Never explain the brand meaning ("Taeam = food") on marketing surfaces — just show طعام + Taeam. Logo-only nav.
- **Look:** must feel **modern/expensive**, and read as **food** (appetizing), not fashion. He likes the taeam.ca **diagonal split**, the **bold uppercase TAEAM**, and **gold `#EAB308` on near-black**. Our current site uses a softer gold `#eea742` on cream — pick ONE system if we go gold-on-black.
- **Motion:** tasteful entrance/delight + glassmorphism OK; NO glows, NO forever-loops, flat gold. (This is the app's "de-AI calibration"; keep to it, except the /v2 experiment intentionally mirrors taeam.ca which has subtle gold glow accents — Rayan to decide.)
- **App parity:** categories and address autocomplete should feel like the Flutter app (`CascadeProjects/taeam_app`).
- **The merge (future, NOT now):** eventually taeam.ca = ONE site = this ordering app as the front door + taeam.ca's story content (Trust Gap, The Fridge, Arbaab AI, Drive, The Promise) folded into nav pages, waitlist removed (the "15% off + 1000 founding points" becomes a first-order incentive). Rayan explicitly does NOT want to do the real merge yet — /v2 is just to see the components together.

---

## 7. Open sub-decisions / known gaps
- **Web checkout requires an app PIN.** The backend `requireOnboarded` middleware 403s users without `has_pin=true` on Stripe/order routes. So a pure web signup can't pay until they set a PIN in the Flutter app (a friendly error is shown). Needs a product decision (let web set a PIN, or accept the friction).
- **Marketing site source is NOT in this repo** (separate/off-repo project). To port taeam.ca's exact pages/components (Fridge, Arbaab, Promise), get that repo from Rayan. The /v2 components were re-created from the rendered HTML, not copied.
- **Arabic font weight:** taeam.ca's طعام is heavier/blacker than the `Amiri` (weight 400) we load. If we commit to the bold look, add a heavier Arabic font.
- **Fridge + Arbaab:** decide if they launch now (full pages) or "coming soon" teasers.
- **Stripe:** currently live mode; a real E2E $1 order test on web is still pending. Apple/Google Pay won't show until the domain is registered in Stripe.
- **metadataBase** warning at build (OG images) — set `metadataBase` in `layout.tsx` at launch (to taeam.ca).
- Site is `robots: noindex` everywhere until launch — flip it at launch and add a sitemap.

---

## 8. Files added/changed this session (all under taeam-web/, now tracked in git)
- `src/app/page.tsx` (hero + de-dash), `src/app/layout.tsx` (meta), `src/app/globals.css` (motion), `src/components/Header.tsx` (nav)
- `src/components/RestaurantsBrowser.tsx` (NEW, category rail), `src/app/restaurants/page.tsx`
- `src/lib/places.ts` (NEW), `src/components/AddressAutocomplete.tsx` (NEW), `src/components/AddressGate.tsx` (rewrite), `src/app/checkout/page.tsx` (autocomplete + de-dash)
- `src/components/marketing/MarketingHero.tsx` (NEW), `src/components/marketing/TrustGap.tsx` (NEW), `src/app/v2/page.tsx` (NEW)
- De-dash edits across about/edmonton/track/account/signin/not-found/Footer/RestaurantCard/VerifiedBadge/etc.
- `CascadeProjects/supabase/functions/places-suggest/index.ts` (NEW edge function)
- Root `.gitignore`: un-ignored `CascadeProjects/taeam-web/` so it now syncs via git.

Everything type-checks (`npx tsc --noEmit`) and builds (`PREVIEW_EXPORT=1 npm run build`).
