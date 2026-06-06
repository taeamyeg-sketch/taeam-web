// Base URL for the Taeam Node backend (Railway). Used by the marketing site
// for the few server-side actions it can't do directly against Supabase —
// e.g. sending branded waitlist confirmation emails via Resend.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://taeam-backend-production.up.railway.app';
