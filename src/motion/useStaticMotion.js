import { useReducedMotion } from "motion/react";

/** Matches Googlebot and other common crawlers / link preview bots. */
const CRAWLER_RE =
  /googlebot|google-inspectiontool|chrome-lighthouse|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|linkedinbot|twitterbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|crawler|spider|bot\b/i;

export const isCrawlerUserAgent = (ua = "") => CRAWLER_RE.test(ua);

export const getBrowserUserAgent = () =>
  typeof navigator !== "undefined" ? navigator.userAgent : "";

const normalizePathname = (value, origin = "https://www.airacrest.com") => {
  if (!value) return "/";
  try {
    const url = /^https?:\/\//i.test(value)
      ? new URL(value)
      : new URL(value, origin);
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return "/";
  }
};

/**
 * Keep prerendered HTML for crawlers (GSC live tests) instead of wiping
 * `#root` with createRoot and showing a header-only first paint.
 * Unprerendered URLs (canonical mismatch) still mount React.
 */
export const shouldSkipCrawlerRemount = ({
  userAgent = "",
  prerenderReady = false,
  canonicalHref = "",
  currentPathname = "/",
} = {}) => {
  if (!isCrawlerUserAgent(userAgent) || !prerenderReady) return false;
  return (
    normalizePathname(canonicalHref) === normalizePathname(currentPathname)
  );
};

/**
 * True when animations should be skipped so content stays visible:
 * reduced-motion preference OR known crawler (e.g. Google Search Console).
 */
export const useStaticMotion = () => {
  const prefersReducedMotion = useReducedMotion();
  if (isCrawlerUserAgent(getBrowserUserAgent())) return true;
  return Boolean(prefersReducedMotion);
};
