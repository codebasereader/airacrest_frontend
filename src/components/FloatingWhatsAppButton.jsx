import React from "react";
import { useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { useWhatsAppSource } from "../context/WhatsAppSourceContext";
import {
  getWhatsAppEnquiryUrl,
  getWhatsAppSourceFromPath,
} from "../utils/whatsapp";

/**
 * Fixed bottom-right WhatsApp CTA on every public page.
 * Prefills a source-tagged enquiry message from the current route.
 */
const FloatingWhatsAppButton = ({ sourceTag } = {}) => {
  const { pathname } = useLocation();
  const whatsAppSource = useWhatsAppSource();

  const hideOnRoute =
    pathname === "/login" || pathname.startsWith("/admin");

  if (hideOnRoute) {
    return null;
  }

  const tag =
    sourceTag ||
    whatsAppSource?.override ||
    getWhatsAppSourceFromPath(pathname);
  const href = getWhatsAppEnquiryUrl(tag);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.55)] transition-transform duration-200 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <HugeiconsIcon
        icon={WhatsappIcon}
        size={28}
        color="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </a>
  );
};

export default FloatingWhatsAppButton;
