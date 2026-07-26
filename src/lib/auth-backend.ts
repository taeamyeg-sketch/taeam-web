"use client";

import { BACKEND_URL } from "./backend";

/**
 * Web auth against the Taeam Node backend — the SAME rail the Flutter apps use.
 * Email codes are 6-digit, generated server-side and delivered via Resend (not
 * Supabase's mailer), and the session is minted admin-side. The website never
 * touches Supabase's built-in email OTP.
 *
 * Login is unauthenticated by definition, so these calls send no bearer token.
 * `linkProvider` is the one exception — it runs after a session exists.
 */

export class AuthBackendError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthBackendError";
  }
}

async function call<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Network / CORS failure — surface a friendly, actionable message.
    throw new AuthBackendError(0, "Can't reach the server. Check your connection and try again.");
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    const msg = (json.error as string) || `Request failed (${res.status})`;
    throw new AuthBackendError(res.status, msg);
  }
  return json as T;
}

/** Send a 6-digit code to `email` via Resend. Idempotent-ish (rate-limited). */
export function sendEmailCode(email: string): Promise<{ success: true; expiresIn: number }> {
  return call("/api/email-otp/send-otp", { email: email.trim().toLowerCase() });
}

/** Is this an existing account? Used to tailor the signup vs sign-in copy. */
export async function identityExists(email: string): Promise<boolean> {
  try {
    const r = await call<{ exists?: boolean }>("/api/identity/lookup", {
      email: email.trim().toLowerCase(),
    });
    return !!r.exists;
  } catch {
    // A lookup failure must never block login — assume returning user (no name
    // prompt) and let the verify step be the source of truth.
    return true;
  }
}

/**
 * Verify the code and get a real Supabase session. Feed `refresh_token` to
 * supabaseBrowser().auth.setSession(). Creates the account on first sign-in.
 */
export function emailSession(
  email: string,
  otp: string,
  name?: string,
): Promise<{
  success: true;
  is_new_user: boolean;
  access_token: string;
  refresh_token: string;
}> {
  return call("/api/identity/email-session", {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
    ...(name && name.trim() ? { name: name.trim() } : {}),
  });
}

/**
 * Attach a Google identity to the profile row after a client-side id-token
 * sign-in — mirrors the app's post-Google `link-provider` call so a web Google
 * user's row carries `google_id`/name/email just like a mobile one. Best-effort:
 * the session already exists, so a failure here doesn't block login.
 */
export async function linkGoogleProvider(
  accessToken: string,
  fields: { google_id?: string; name?: string; email?: string },
): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/identity/link-provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(fields),
    });
  } catch {
    /* non-fatal — profile linking is an enhancement, login already succeeded */
  }
}
