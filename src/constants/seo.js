import { COMPANY } from "./company";

export const SITE_NAME = "Aira Crest";

/** Canonical production origin — override with VITE_SITE_URL when needed. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://www.airacrest.com"
).replace(/\/$/, "");

export const DEFAULT_DESCRIPTION =
  "Bengaluru export house supplying green banana flour, ripe banana powder, moringa leaf powder and wild forest honey worldwide. FSSAI and APEDA registered.";

export const DEFAULT_TITLE = `${SITE_NAME} | Banana Powder, Moringa and Honey Exporter from India`;

export const absoluteUrl = (path = "/") => {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const truncateMeta = (text, max = 160) => {
  if (!text) return DEFAULT_DESCRIPTION;
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
};

export const brandTitle = (pageTitle) =>
  pageTitle ? `${pageTitle} | ${SITE_NAME}` : DEFAULT_TITLE;

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  url: SITE_URL,
  email: COMPANY.email,
  telephone: COMPANY.phoneTel,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.registeredAddress,
    addressCountry: "IN",
  },
});
