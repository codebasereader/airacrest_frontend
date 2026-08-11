import React from "react";
import {motion} from "motion/react";
import { useStaticMotion } from "../../motion/useStaticMotion";
import { LineReveal, LineRevealGroup } from "../../motion/LineReveal";
import { toBritishSpelling } from "../../utils/britishSpelling";

const ProductHero = ({ product }) => {
  const prefersReducedMotion = useStaticMotion();
  const highlights = product.highlights ?? [];

  return (
    <LineRevealGroup trigger="onMount" gap={0.1} delay={0.05}>
      <LineReveal>
        <p className="font-sans text-[10px] font-semibold tracking-[0.22em] text-maroon-500 uppercase">
          {toBritishSpelling(product.category?.name ?? "Premium Export Grade")}
        </p>
      </LineReveal>

      <LineReveal>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-[0.06em] text-maroon-900 sm:text-4xl lg:text-[2.75rem]">
          {toBritishSpelling(product.name)}
        </h1>
      </LineReveal>

      <LineReveal>
        <div className="mt-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-16 bg-gold-500" />
          <span className="font-heading text-[10px] text-gold-500">✦</span>
          <span className="h-px flex-1 max-w-32 bg-maroon-200/80" />
        </div>
      </LineReveal>

      <LineReveal>
        <p className="mt-6 font-sans text-sm leading-relaxed text-maroon-800 sm:text-base sm:leading-7">
          {toBritishSpelling(product.description)}
        </p>
      </LineReveal>

      {highlights.length > 0 && (
        <motion.ul
          className="mt-8 flex flex-wrap gap-2"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
        >
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full border border-maroon-200/60 bg-white/80 px-3.5 py-1.5 font-sans text-[11px] font-medium tracking-wide text-maroon-700 shadow-sm"
            >
              {toBritishSpelling(highlight)}
            </li>
          ))}
        </motion.ul>
      )}
    </LineRevealGroup>
  );
};

export default ProductHero;
