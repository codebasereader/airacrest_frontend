# Backend setup: spam protection for `POST /api/enquiries`

The frontend (`src/section/Enquire.jsx`) now sends three extra signals with
every enquiry submission. **None of them do anything until the backend
(the separate API Gateway / Lambda repo) checks them.** This doc is a
paste-ready guide for that repo, matching its Express/Mongoose style per
`ENQUIRY-API-SCHEMA.md`.

## Cloudflare Turnstile widget configuration (for reference)

The client has already set up the Cloudflare account and widget:

| Setting | Value |
|---|---|
| Widget name | Aira Crest enquiry form |
| Hostnames | `airacrest.com`, `www.airacrest.com` |
| Mode | Invisible |
| Pre-clearance | Off |
| Site key (public, already live in `src/config.js`) | `0x4AAAAAAAE2EFHDzxyggPcSh` |
| Secret key | **Not in this doc** — sent to you separately (Slack/email), never committed to a repo. Set it as `TURNSTILE_SECRET_KEY` per step 1 below. |

Because the widget mode is Invisible, Cloudflare requires a link to their
Turnstile Privacy Policy Addendum on the site — this is already handled on
the frontend (a new `/privacy-policy` page links to
https://www.cloudflare.com/turnstileprivacypolicy/). No backend action
needed for that part.

## What changed in the request body

```json
{
  "...": "...existing fields unchanged...",
  "turnstileToken": "0.AAbc...xyz",
  "companyWebsite": ""
}
```

| New field | Type | Meaning |
|---|---|---|
| `turnstileToken` | `string \| undefined` | Cloudflare Turnstile token from the invisible widget. `undefined` if Turnstile's script was blocked/failed to load (ad-blocker, CDN issue) — the frontend fails open rather than blocking a real visitor, so treat a missing token as "unverified," not as an automatic reject (see rate limit note below). |
| `companyWebsite` | `string` | Honeypot. Always `""` for a real visitor. The frontend already refuses to submit client-side if this is filled — you'll only ever see a non-empty value here from a request that bypassed the browser form entirely (a bot POSTing straight to this endpoint). **Always reject those.** |

## 1. Verify the Turnstile token

Get your **secret key** from the same Cloudflare Turnstile dashboard page
where you generated the site key
(https://dash.cloudflare.com/?to=/:account/turnstile). Set it as
`TURNSTILE_SECRET_KEY` in the API's environment (Lambda env var / `.env`
locally) — never expose it client-side.

```javascript
// utils/verifyTurnstile.js
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token, remoteIp) {
  if (!token) return { success: false, reason: "missing-token" };

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteIp,
    }),
  });

  const result = await response.json();
  return { success: result.success === true, reason: result["error-codes"] };
}

module.exports = { verifyTurnstile };
```

## 2. Honeypot + Turnstile + numeric-quantity in the route handler

```javascript
// routes/enquiries.js (or wherever POST /api/enquiries lives)
const { verifyTurnstile } = require("../utils/verifyTurnstile");

const QUANTITY_DIGIT_PATTERN = /\d/;

router.post("/enquiries", enquiryRateLimiter, async (req, res) => {
  const { turnstileToken, companyWebsite, products, ...rest } = req.body;

  // Honeypot: any value here means a bot bypassed the real form.
  if (companyWebsite && companyWebsite.trim()) {
    // Respond as if it worked — don't tip the bot off, don't waste a
    // real validation error message on it, and definitely don't persist it.
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: { _id: "0", status: "pending", createdAt: new Date().toISOString() },
    });
  }

  // Turnstile: a genuine visitor almost always has a token. Missing token
  // is treated as "unverified" rather than an instant hard block, because
  // the widget fails open when its script can't load — lean on the rate
  // limiter (below) to catch abuse from that gap instead of losing real leads.
  const { success: turnstileOk } = await verifyTurnstile(
    turnstileToken,
    req.ip,
  );
  if (turnstileToken && !turnstileOk) {
    // A token WAS provided but failed verification — that's a forged/replayed
    // token, not a missing-script case. Reject outright.
    return res.status(400).json({
      success: false,
      message: "Verification failed. Please refresh the page and try again.",
    });
  }

  // Numeric-only quantity check (frontend only checks "contains a digit" —
  // this is the authoritative check).
  const quantityErrors = {};
  (products || []).forEach((line, i) => {
    if (!QUANTITY_DIGIT_PATTERN.test(line.estimatedQuantity || "")) {
      quantityErrors[`products.${i}.estimatedQuantity`] =
        "Estimated quantity must include a number, e.g. 500 kg or 2 MT.";
    }
  });
  if (Object.keys(quantityErrors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: quantityErrors,
    });
  }

  // ...existing enquiry creation logic using `rest` + `products`...
});
```

## 3. Rate limiting

A plain in-memory limiter (`express-rate-limit` with its default store)
**will not work reliably on Lambda** — each cold start gets fresh memory, so
a bot that triggers a new container resets its count. Use a store that
survives across invocations. Since this API already uses MongoDB, the
simplest fix is a Mongo-backed store:

```bash
npm install express-rate-limit rate-limit-mongo
```

```javascript
// middleware/enquiryRateLimiter.js
const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const enquiryRateLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: "enquiryRateLimits",
    expireTimeMs: 60 * 60 * 1000,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 4, // 4 submissions per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "You've reached the limit of 4 enquiries per hour. Please try again later, or email connect@airacrest.com and our team will get back to you directly.",
  },
});

module.exports = { enquiryRateLimiter };
```

If you'd rather not add a dependency, API Gateway also supports basic
per-IP throttling via a **usage plan** — coarser (applies to the whole
route, not smart about repeat offenders) but zero backend code.

## 4. Update the Mongoose schema (optional but recommended)

You don't need to persist `turnstileToken` or `companyWebsite` — they're
verified and discarded before the enquiry is saved. No schema change
needed unless you want an audit trail of rejected spam attempts (e.g. a
separate `spamAttempts` collection logging IP + reason).

## Order of checks

Run them in this order so cheap checks short-circuit before the network
call to Cloudflare:

1. Rate limit (middleware, before the handler body runs)
2. Honeypot (`companyWebsite`) — free, in-process
3. Turnstile verify — network call to Cloudflare
4. Existing field validation (name/email/phone/etc.) + numeric quantity
