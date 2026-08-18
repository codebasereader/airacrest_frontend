import { SITE_URL } from "./seo";

export const BROCHURE_PDF_URL = "/Aira_Crest_Brochure.pdf";
export const BROCHURE_PDF_NAME = "Aira_Crest_Brochure.pdf";
export const BROCHURE_SHARE_PATH = "/brochure";

export const getBrochurePdfUrl = () => `${SITE_URL}${BROCHURE_PDF_URL}`;

export const getBrochureShareUrl = () => `${SITE_URL}${BROCHURE_SHARE_PATH}`;

/** URL encoded in QR codes — opens brochure via share route, then redirects to PDF */
export const getBrochureQrUrl = () => getBrochureShareUrl();
