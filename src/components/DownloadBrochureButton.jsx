import React from "react";
import {motion} from "motion/react";
import { useStaticMotion } from "../motion/useStaticMotion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { transitions } from "../motion/presets";
import { BROCHURE_PDF_NAME, BROCHURE_PDF_URL } from "../constants/brochure";

const VARIANTS = {
  header:
    "inline-flex items-center gap-1.5 rounded-sm border border-gold-400/40 bg-transparent px-2.5 py-2 font-sans text-[9px] font-bold tracking-[0.1em] text-cream-100 no-underline transition-colors hover:border-gold-400 hover:text-gold-400 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-[10px] sm:tracking-[0.12em] xl:gap-2 xl:border-gold-400/45 xl:px-3.5 xl:py-2.5 xl:hover:bg-gold-400/10",
  enquire:
    "inline-flex w-full items-center justify-center gap-2 rounded-sm border border-maroon-700 bg-white px-8 py-3.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-900 no-underline transition-colors duration-200 hover:border-maroon-900 hover:bg-maroon-50 sm:w-auto sm:px-10",
};

const DownloadBrochureButton = ({ variant = "enquire", className = "" }) => {
  const prefersReducedMotion = useStaticMotion();
  const isHeader = variant === "header";

  const label = (
    <>
      <HugeiconsIcon
        icon={Download01Icon}
        size={isHeader ? 14 : 16}
        color="currentColor"
        strokeWidth={1.5}
        className={variant === "enquire" ? "text-maroon-700" : "shrink-0"}
        aria-hidden="true"
      />
      <span
        className={isHeader ? "cta-short-label" : undefined}
        data-short-label={isHeader ? "CATALOGUE" : undefined}
      >
        DOWNLOAD PRODUCT CATALOGUE
      </span>
    </>
  );

  if (isHeader) {
    return (
      <motion.a
        href={BROCHURE_PDF_URL}
        download={BROCHURE_PDF_NAME}
        target="_blank"
        rel="noopener noreferrer"
        className={`${VARIANTS[variant]} ${className}`}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        transition={transitions.fast}
      >
        {label}
      </motion.a>
    );
  }

  return (
    <a
      href={BROCHURE_PDF_URL}
      download={BROCHURE_PDF_NAME}
      target="_blank"
      rel="noopener noreferrer"
      className={`${VARIANTS[variant]} ${className}`}
    >
      {label}
    </a>
  );
};

export default DownloadBrochureButton;
