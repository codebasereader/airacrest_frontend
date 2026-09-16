export const API_BASE_URL ="https://jvau29a6le.execute-api.ap-south-1.amazonaws.com/api"
  // "https://mgc3mrxrva.execute-api.ap-south-1.amazonaws.com/api/";

// Cloudflare Turnstile site key (public, safe to expose client-side).
// Set VITE_TURNSTILE_SITE_KEY in your .env / Amplify build environment.
// Get one at https://dash.cloudflare.com/?to=/:account/turnstile.
// The matching SECRET key belongs on the backend only, for verifying the
// token server-side — see BACKEND-TURNSTILE-SETUP.md.
export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAAE2EFHDzxyggPcSh";
