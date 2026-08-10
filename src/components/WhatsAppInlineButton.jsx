import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { getWhatsAppEnquiryUrl } from "../utils/whatsapp";

const VARIANTS = {
  light:
    "inline-flex items-center justify-center gap-2 rounded-sm border border-[#25D366]/40 bg-[#25D366] px-4 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-[#20bd5a]",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-sm border border-[#25D366]/50 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-[#128C7E] no-underline transition-colors hover:border-[#25D366] hover:bg-[#25D366]/8",
};

/**
 * Inline WhatsApp CTA with a per-page source tag in the prefilled message.
 */
const WhatsAppInlineButton = ({
  sourceTag,
  label = "WHATSAPP",
  variant = "light",
  className = "",
}) => {
  const href = getWhatsAppEnquiryUrl(sourceTag);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${VARIANTS[variant] || VARIANTS.light} ${className}`}
    >
      <HugeiconsIcon
        icon={WhatsappIcon}
        size={16}
        color="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      {label}
    </a>
  );
};

export default WhatsAppInlineButton;
