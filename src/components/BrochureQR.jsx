import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Link01Icon } from "@hugeicons/core-free-icons";
import {
  BROCHURE_PDF_URL,
  getBrochurePdfUrl,
  getBrochureQrUrl,
} from "../constants/brochure";

const BrochureQR = ({ variant = "card" }) => {
  const [brochureUrl, setBrochureUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    setBrochureUrl(getBrochurePdfUrl(origin));
    setQrUrl(getBrochureQrUrl(origin));
  }, []);

  const handleCopy = async () => {
    if (!brochureUrl) return;
    try {
      await navigator.clipboard.writeText(brochureUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!brochureUrl || !qrUrl) return null;

  const isCompact = variant === "compact";

  return (
    <div
      className={
        isCompact
          ? "w-full rounded-2xl border border-maroon-200/50 bg-white p-5 shadow-sm sm:p-6"
          : "mx-auto w-full max-w-md rounded-2xl border border-maroon-200/50 bg-white p-6 shadow-[0_8px_32px_-12px_rgba(42,10,10,0.12)] sm:p-8"
      }
    >
      <div className="flex flex-col items-center text-center">
        <p className="font-heading text-xs font-bold tracking-[0.14em] text-maroon-900 sm:text-sm">
          SCAN TO VIEW BROCHURE
        </p>
        <p className="mt-1.5 font-sans text-[11px] text-maroon-600 sm:text-xs">
          Scan the QR code to open our company brochure
        </p>

        <div className="mt-5 rounded-xl border border-cream-300/80 bg-cream-50 p-4">
          <QRCodeSVG
            value={qrUrl}
            size={isCompact ? 148 : 180}
            level="M"
            marginSize={2}
            bgColor="#faf7f2"
            fgColor="#5c1a22"
            aria-label="QR code linking to Aira Crest brochure"
          />
        </div>

        <div className="mt-5 w-full">
          <p className="mb-2 flex items-center justify-center gap-1.5 font-sans text-[10px] font-semibold tracking-[0.16em] text-maroon-500 uppercase">
            <HugeiconsIcon
              icon={Link01Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            Brochure link
          </p>
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all rounded-lg border border-maroon-100 bg-cream-50/80 px-3 py-2.5 font-sans text-xs leading-relaxed text-maroon-800 no-underline transition-colors hover:border-maroon-300 hover:text-maroon-950 sm:text-sm"
          >
            {brochureUrl}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-maroon-200 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-800 transition-colors hover:border-maroon-400 hover:bg-cream-50"
          >
            <HugeiconsIcon
              icon={Copy01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {copied ? "LINK COPIED" : "COPY LINK"}
          </button>
        </div>

        <a
          href={BROCHURE_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 font-sans text-[11px] font-medium text-gold-600 no-underline transition-colors hover:text-gold-500"
        >
          Open brochure directly →
        </a>
      </div>
    </div>
  );
};

export default BrochureQR;
