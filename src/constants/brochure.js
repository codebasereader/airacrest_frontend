import { SITE_URL } from "./seo";

export const BROCHURE_PDF_URL = "/Aira_Crest_Brochure.pdf";
export const BROCHURE_PDF_NAME = "Aira_Crest_Brochure.pdf";
export const BROCHURE_SHARE_PATH = "/brochure";

/** Always the public production PDF — never a local preview origin. */
export const BROCHURE_PDF_ABSOLUTE_URL =
  "https://www.airacrest.com/Aira_Crest_Brochure.pdf";

export const getBrochurePdfUrl = () => BROCHURE_PDF_ABSOLUTE_URL;

export const getBrochureShareUrl = () => `${SITE_URL}${BROCHURE_SHARE_PATH}`;

/** URL encoded in QR codes — the PDF itself, so a scan opens the catalogue. */
export const getBrochureQrUrl = () => BROCHURE_PDF_ABSOLUTE_URL;
