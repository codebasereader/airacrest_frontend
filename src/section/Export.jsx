import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { fadeUp, stagger } from "../motion/presets";

const EXPORT_ITEMS = [
  {
    image: "/process/port.webp",
    alt: "Port of loading icon",
    title: "PORT OF LOADING",
    description:
      "Mundra (INMUN1) primary and Pipavav (INPAV1), Gujarat; also Nhava Sheva / JNPT, Chennai, Visakhapatnam and Krishnapatnam (Andhra Pradesh), and Bangalore ICD and Air Cargo. AD Code registered across 11 Indian ports for flexible routing from the gateway nearest the buyer's shipping line.",
  },
  {
    image: "/process/lead.webp",
    alt: "Lead time icon",
    title: "LEAD TIME",
    description:
      "15–20 days from order confirmation (production and dispatch); up to 3–4 weeks for large or custom orders.",
  },
  {
    image: "/process/package.webp",
    alt: "Packaging icon",
    title: "PACKAGING",
    description:
      "Standard export cartons / bags; custom & private label available.",
  },
  {
    image: "/process/quality.webp",
    alt: "Quality assurance icon",
    title: "QUALITY ASSURANCE",
    description:
      "Batch wise COA, phytosanitary & origin certificates as required.",
  },
];

const ExportCard = ({ item, index }) => {
  const showDivider = index < EXPORT_ITEMS.length - 1;

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

      <img
        src={item.image}
        alt={item.alt}
        className="mb-5 h-16 w-auto object-contain sm:h-[72px]"
        loading="lazy"
      />

      <h3 className="font-heading text-sm font-bold tracking-[0.12em] text-gold-400 sm:text-base">
        {item.title}
      </h3>

      <p className="mt-4 font-sans text-xs leading-relaxed text-cream-200/90 sm:text-sm sm:leading-6">
        {item.description}
      </p>
    </motion.div>
  );
};

const Export = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="export"
      className="bg-header px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <LineRevealGroup
          className="text-center"
          trigger="inView"
          gap={0.1}
          delay={0.05}
        >
          <LineReveal>
            <h2 className="font-heading text-2xl font-bold tracking-[0.12em] text-gold-400 sm:text-3xl lg:text-4xl">
              EXPORT CAPABILITY
            </h2>
          </LineReveal>

          <LineReveal>
            <div
              className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-gold-400/50" />
              <span className="font-heading text-xs text-gold-400">✦</span>
              <span className="h-px flex-1 bg-gold-400/50" />
            </div>
          </LineReveal>
        </LineRevealGroup>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-y-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={prefersReducedMotion ? fadeUp : stagger(0.08, 0.15)}
        >
          {EXPORT_ITEMS.map((item, index) => (
            <ExportCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Export;
