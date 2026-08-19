import { COMPANY } from "../constants/company";

/** Digits only, as used in wa.me links (country code + mobile). */
export const WHATSAPP_WA_ME_NUMBER = COMPANY.whatsappE164;

const titleFromSlug = (slug) =>
  decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const buildWhatsAppMessage = (sourceTag) => {
  const tag = String(sourceTag || "Website").trim() || "Website";
  return `Enquiry from airacrest.com | ${tag}`;
};

/** Readable product name for WhatsApp source tags (title-cases ALL CAPS names). */
export const formatProductWhatsAppTag = (name) => {
  const text = String(name || "").trim();
  if (!text) return "";

  if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return text;
};

/**
 * https://wa.me/{number}?text={urlencoded message with per-page source tag}
 */
export const getWhatsAppEnquiryUrl = (sourceTag) => {
  const text = encodeURIComponent(buildWhatsAppMessage(sourceTag));
  return `https://wa.me/${WHATSAPP_WA_ME_NUMBER}?text=${text}`;
};

export const getWhatsAppSourceFromPath = (pathname = "/") => {
  if (pathname === "/") return "Home";
  if (pathname === "/products") return "Products";

  const faqMatch = pathname.match(/^\/products\/([^/]+)\/faq\/?$/);
  if (faqMatch) return titleFromSlug(faqMatch[1]);

  const productMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (productMatch) return titleFromSlug(productMatch[1]);

  if (pathname === "/blogs") return "Blogs";

  const blogMatch = pathname.match(/^\/blogs\/([^/]+)\/?$/);
  if (blogMatch) return titleFromSlug(blogMatch[1]);

  if (pathname === "/brochure") return "Product Catalogue";
  if (pathname === "/login") return "Login";
  return "Website";
};

export const COMPANY_EMAIL_MAILTO = `mailto:${COMPANY.email}`;
