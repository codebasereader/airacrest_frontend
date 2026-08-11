import { useReducedMotion } from "motion/react";

/** Matches Googlebot and other common crawlers / link preview bots. */
const CRAWLER_RE =
  /googlebot|google-inspectiontool|chrome-lighthouse|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|linkedinbot|twitterbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|crawler|spider|bot\b/i;

export const isCrawlerUserAgent = (ua = "") => CRAWLER_RE.test(ua);

export const getBrowserUserAgent = () =>
  typeof navigator !== "undefined" ? navigator.userAgent : "";

/**
 * True when animations should be skipped so content stays visible:
 * reduced-motion preference OR known crawler (e.g. Google Search Console).
 */
export const useStaticMotion = () => {
  const prefersReducedMotion = useReducedMotion();
  if (isCrawlerUserAgent(getBrowserUserAgent())) return true;
  return Boolean(prefersReducedMotion);
};
