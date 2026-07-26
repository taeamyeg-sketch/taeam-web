# taeam-web — Auth setup & go-live steps

The website now uses the **same auth rail as the Flutter apps** instead of
Supabase's built-in email/OAuth:

- **Email code** → `POST /api/email-otp/send-otp` (Resend, **6-digit**) then
  `POST /api/identity/email-session` (verifies the code + mints a real Supabase
  session). No Supabase-Auth email is ever sent.
- **Google** → Google Identity Services **id-token** → `signInWithIdToken`
  (no OAuth redirect, so it can never land on the admin site), then
  `POST /api/identity/link-provider`.
- **Apple** → "coming soon" (web Apple sign-in is a separate integration).
- **PIN / phone** → intentionally omitted on web (browser session persists).

Everything below is config only I couldn't do from code. Do these to finish.

---

## 1. Deploy the backend (required for email + Google to work)

Two backend files changed in `taeam_app/backend/`:
- `routes/api/identity.js` — new `POST /api/identity/email-session` endpoint.
- `server.js` — added `http://localhost:3000/3001` to the CORS allowlist.

Deploy the way this repo always does (Railway auto-deploys on push to master —
**not** `railway up` from the subdir):

```bash
git add taeam_app/backend/routes/api/identity.js taeam_app/backend/server.js
git commit -m "backend: web email-session endpoint + localhost CORS"
git push origin master
```

No new backend env vars are needed — `RESEND_API_KEY` / `RESEND_FROM` are
already set.

## 2. Google Cloud Console (required for the Google button)

Use the **same Web OAuth client** the app uses as `GOOGLE_WEB_CLIENT_ID`
(APIs & Services → Credentials → the "Web application" client):

- **Authorized JavaScript origins** → add:
  - `http://localhost:3000`
  - `https://taeam.ca`, `https://www.taeam.ca`
  - `https://taeam-web.pages.dev`
- (Authorized redirect URIs are **not** needed — GIS uses no redirect.)

Then paste that client ID into `taeam-web/.env.local`:

```
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=<the app's web client id>.apps.googleusercontent.com
```

Restart `next dev` after editing `.env.local`. If the id is missing, the Google
button simply hides and email still works.

## 3. Supabase dashboard — nothing to do for the website

The web no longer depends on Supabase's Site URL, redirect allow-list, or Email
OTP length. **Leave the admin's Auth URL config as-is** (the admin app still
uses Supabase magic-link and needs `taeam-admin.pages.dev` whitelisted).

---

## Testing on localhost before the backend is deployed

`NEXT_PUBLIC_BACKEND_URL` points at the **production** Railway backend, whose
CORS won't allow `localhost:3000` until step 1 ships. Two options:

- **Easiest:** deploy step 1 first, then test localhost against prod backend.
- **Or run the backend locally** (`cd taeam_app/backend && npm start`; in dev,
  `NODE_ENV != production` so all origins are allowed) and set
  `NEXT_PUBLIC_BACKEND_URL=http://localhost:<port>` in `.env.local`.

## Smoke test

1. Open `/signin` (or click **Join Taeam**).
2. Enter an email → **Email me a code** → you get a **6-digit** code from Resend.
3. (New email) enter your name + the code → you're signed in; a `users` row is
   created and the account menu shows.
4. Sign out, repeat with the same email → signed straight in (no new account).
5. **Continue with Google** → Google popup → signed in, no redirect to admin.

## Known edge case (pre-launch, negligible at zero users)

If an `auth.users` row ever exists **without** a matching `public.users` mirror
row, `email-session` will fail to create (email "already registered") rather
than recovering it. The `on_auth_user_created` trigger makes this rare; revisit
if it ever surfaces.
