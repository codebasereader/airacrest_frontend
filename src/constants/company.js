import { BROCHURE_PDF_NAME, BROCHURE_PDF_URL } from "./brochure";

export const COMPANY = {
  legalName: "Aira Crest Private Limited",
  registeredAddress:
    "41, Ground Floor, Upadhyayara Sangha (Sinche), Near Manasanagar Bus Stop, Nagarabhavi, Bengaluru, Karnataka 560072, India",
  cin: "U10302KA2026PTC215246",
  email: "connect@airacrest.com",
  phoneDisplay: "+91 9187454810",
  phoneTel: "+919187454810",
  whatsappDisplay: "+91 9187454810",
  /** Digits for wa.me links — matches brief: https://wa.me/9187454810 */
  whatsappE164: "9187454810",
};

export const COMPANY_REGISTRATIONS = [
  { label: "FSSAI Central Licence", value: "11226998000290" },
  { label: "APEDA RCMC", value: null },
  { label: "Spice Board", value: null },
  { label: "IEC", value: "ABECA7833K" },
];

/**
 * Per-network profile URLs. Leave empty to hide that icon.
 * Never set a placeholder — icons only render when a real URL is present.
 */
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/airacrest",
  whatsapp: `https://wa.me/${COMPANY.whatsappE164}`,
  instagram: "",
  facebook: "",
};

export const CATALOGUE_DOWNLOAD = {
  href: BROCHURE_PDF_URL,
  download: BROCHURE_PDF_NAME,
  label: "Download Product Catalogue",
};

/** True only for usable absolute http(s) destinations (no empty / # / javascript:). */
export const isLiveExternalUrl = (value) => {
  if (typeof value !== "string") return false;
  const url = value.trim();
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
