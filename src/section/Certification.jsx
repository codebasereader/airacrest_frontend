import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { fadeUp, stagger } from "../motion/presets";

const CERTIFICATIONS = [
  {
    image: "/certification/fssai.webp",
    alt: "FSSAI logo",
    title: "FSSAI Certified",
    label: "Licence No.",
    value: "11226998000290",
    sub: "(Central Licence)",
  },
  {
    image: "/certification/apeda.webp",
    alt: "APEDA logo",
    title: "APEDA Registered",
    label: "Registration No.",
    value: "RCMC/APEDA/29919/2026-2027",
  },
  {
    image: "/certification/spices.webp",
    alt: "Spice Board India logo",
    title: "Spice Board India",
    label: "Registration No.",
    value: "CRES/SBCB/28380/2026-2027",
  },
  {
    textTile: "IEC",
    title: "IEC NUMBER",
    label: "Importer Exporter Code (IEC)",
    value: "ABECA7833K",
  },
  {
    textTile: "CIN",
    title: "CIN Registered",
    label: "Corporate Identity No.",
    value: "U10302KA2026PTC215246",
  },
  {
    image: "/certification/gst.webp",
    alt: "GST logo",
    title: "GST Registered",
    label: "GSTIN No.",
    value: "29ABECA7833K1Z8",
  },
  {
    image: "/certification/udyam.webp",
    alt: "Udyam MSME logo",
    title: "Udyam Registered",
    label: "Registration No.",
    value: "UDYAM-KR-03-0705530",
  },
];

const TextCertBadge = ({ label }) => (
  <div
    className="mb-5 flex h-16 w-16 items-center justify-center rounded-sm border border-gold-400/60 bg-maroon-800 shadow-[0_4px_16px_-4px_rgba(42,10,10,0.35)] sm:h-[72px] sm:w-[72px]"
    aria-hidden="true"
  >
    <span className="font-heading text-base font-bold tracking-[0.14em] text-gold-400 sm:text-lg">
      {label}
    </span>
  </div>
);

const CertCard = ({ cert, index }) => {
  const showDivider = index % 3 !== 2;

  return (
    <motion.div
      variants={fadeUp}
      className="relative flex flex-col items-center px-6 py-8 text-center sm:px-8 sm:py-10 lg:px-10"
    >
      {showDivider && (
        <span
          className="absolute top-1/4 right-0 hidden h-1/2 w-px -translate-y-1/2 bg-gold-400/50 lg:block"
          aria-hidden="true"
        />
      )}

      {cert.textTile ? (
        <TextCertBadge label={cert.textTile} />
      ) : (
        <img
          src={cert.image}
          alt={cert.alt}
          className="mb-5 h-16 w-auto object-contain sm:h-[72px]"
          loading="lazy"
        />
      )}

      <h3 className="font-sans text-sm font-bold text-maroon-950 sm:text-base">
        {cert.title}
      </h3>

      {cert.label && (
        <p className="mt-3 font-sans text-xs text-maroon-800 sm:text-sm">
          {cert.label}
        </p>
      )}

      <p className="mt-1 font-sans text-xs font-medium text-maroon-950 sm:text-sm">
        {cert.value}
      </p>

      {cert.sub && (
        <p className="mt-1 font-sans text-xs text-maroon-800">{cert.sub}</p>
      )}
    </motion.div>
  );
};

const Certification = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="certifications"
      className="bg-cream-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <LineRevealGroup
          className="text-center"
          trigger="inView"
          gap={0.1}
          delay={0.05}
        >
          <LineReveal>
            <h2 className="font-heading text-2xl font-bold tracking-[0.1em] text-maroon-900 sm:text-3xl lg:text-4xl">
              CERTIFIED. COMPLIANT. TRUSTED GLOBALLY.
            </h2>
          </LineReveal>
        </LineRevealGroup>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-y-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={prefersReducedMotion ? fadeUp : stagger(0.08, 0.15)}
        >
          {CERTIFICATIONS.map((cert, index) => (
            <CertCard key={cert.title} cert={cert} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certification;
