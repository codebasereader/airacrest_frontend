export const BROCHURE_PDF_URL = "/AiraCrestBrochureFinal.pdf";
export const BROCHURE_PDF_NAME = "Aira_Crest_Brochure.pdf";
export const BROCHURE_SHARE_PATH = "/brochure";

/** Production site URL — set in .env as VITE_SITE_URL for stable QR codes before deploy */
const SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "";

export const getBrochurePdfUrl = (origin = "") => {
  const base = SITE_URL || origin.replace(/\/$/, "");
  return `${base}${BROCHURE_PDF_URL}`;
};

export const getBrochureShareUrl = (origin = "") => {
  const base = SITE_URL || origin.replace(/\/$/, "");
  return `${base}${BROCHURE_SHARE_PATH}`;
};

/** URL encoded in QR codes — opens brochure via share route, then redirects to PDF */
export const getBrochureQrUrl = (origin = "") => getBrochureShareUrl(origin);
