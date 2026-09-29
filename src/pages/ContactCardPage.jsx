import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  WhatsappIcon,
  Mail01Icon,
  Download04Icon,
} from "@hugeicons/core-free-icons";
import SeoHead from "../components/SeoHead";
import { COMPANY } from "../constants/company";

const CONTACT_CARDS = {
  sri: {
    logoAlt: "Aira Crest emblem",
    name: "Chetan R Srivatsa",
    role: "Director",
    org: COMPANY.legalName,
    phoneDisplay: COMPANY.phoneDisplay,
    phoneTel: COMPANY.phoneTel,
    email: "srivatsa@airacrest.com",
    vcfHref: "/sri.vcf",
    vcfFilename: "sri.vcf",
    pageTitle: "Chetan R Srivatsa | Aira Crest",
  },
  connect: {
    logoAlt: "Aira Crest emblem",
    name: COMPANY.legalName,
    role: "Dehydrated Vegetables & Fruits · Spices · Natural Honey",
    org: null,
    phoneDisplay: COMPANY.phoneDisplay,
    phoneTel: COMPANY.phoneTel,
    email: COMPANY.email,
    vcfHref: "/connect.vcf",
    vcfFilename: "connect.vcf",
    pageTitle: "Contact Aira Crest",
  },
};

const actionButtonClass =
  "flex flex-1 flex-col items-center gap-2 rounded-xl border border-maroon-200 bg-cream-50 px-3 py-4 text-maroon-800 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:border-gold-400 hover:text-maroon-950 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

const ContactCardPage = ({ variant }) => {
  const card = CONTACT_CARDS[variant];
  const whatsappHref = `https://wa.me/${COMPANY.whatsappE164}`;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-maroon-950 via-maroon-900 to-maroon-950 px-4 py-8">
      <SeoHead title={card.pageTitle} path={`/${variant}`} noIndex />

      <div className="w-full max-w-sm rounded-2xl border border-gold-500/40 bg-cream-100 p-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sm:p-8">
        <img
          src="/logoemblem.webp"
          alt={card.logoAlt}
          className="mx-auto h-16 w-16 object-contain"
        />

        <p className="mt-4 font-script text-2xl text-maroon-600">
          Aira Crest
        </p>

        <h1 className="mt-1 font-heading text-2xl font-bold tracking-[0.04em] text-maroon-950">
          {card.name}
        </h1>

        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-gold-600">
          {card.role}
        </p>

        {card.org ? (
          <p className="mt-1 text-sm text-maroon-700">{card.org}</p>
        ) : null}

        <a
          href={card.vcfHref}
          download={card.vcfFilename}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 font-semibold text-maroon-950 shadow-md transition-colors duration-150 hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-800"
        >
          <HugeiconsIcon icon={Download04Icon} size={20} strokeWidth={2} />
          Save Contact
        </a>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <a href={`tel:${card.phoneTel}`} className={actionButtonClass}>
            <HugeiconsIcon icon={Call02Icon} size={22} strokeWidth={1.8} />
            <span className="text-xs font-medium">Call</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={actionButtonClass}
          >
            <HugeiconsIcon icon={WhatsappIcon} size={22} strokeWidth={1.8} />
            <span className="text-xs font-medium">WhatsApp</span>
          </a>

          <a href={`mailto:${card.email}`} className={actionButtonClass}>
            <HugeiconsIcon icon={Mail01Icon} size={22} strokeWidth={1.8} />
            <span className="text-xs font-medium">Email</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-maroon-500">{card.phoneDisplay}</p>
      </div>
    </div>
  );
};

export default ContactCardPage;
