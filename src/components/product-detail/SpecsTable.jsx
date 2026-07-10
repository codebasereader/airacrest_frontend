import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, stagger } from "../../motion/presets";
import { getVisibleSpecifications } from "../../utils/specifications";
import { toBritishSpelling } from "../../utils/britishSpelling";

const SpecRow = ({ spec, index }) => (
  <motion.div
    variants={fadeUp}
    className={`grid grid-cols-1 border-b border-maroon-100 last:border-b-0 sm:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] ${
      index % 2 === 0 ? "bg-white" : "bg-cream-50/60"
    } transition-colors duration-200 hover:bg-cream-100/80`}
  >
    <div className="border-b border-maroon-100 bg-cream-200/50 px-5 py-4 sm:border-b-0 sm:border-r sm:py-5">
      <dt className="font-sans text-xs font-bold tracking-wide text-maroon-800 sm:text-sm">
        {toBritishSpelling(spec.label)}
      </dt>
    </div>
    <dd className="px-5 py-4 font-sans text-xs leading-relaxed text-maroon-900 sm:py-5 sm:text-sm sm:leading-6">
      {toBritishSpelling(spec.value)}
    </dd>
  </motion.div>
);

const SpecsTable = ({ specifications }) => {
  const prefersReducedMotion = useReducedMotion();
  const visibleSpecs = getVisibleSpecifications(specifications);

  if (visibleSpecs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="specs-heading">
      <h2
        id="specs-heading"
        className="font-heading text-xl font-bold tracking-[0.08em] text-maroon-900 sm:text-2xl"
      >
        Specifications
      </h2>

      <motion.dl
        className="mt-6 overflow-hidden rounded-2xl border border-maroon-200/50 shadow-[0_8px_32px_-12px_rgba(42,10,10,0.1)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={prefersReducedMotion ? fadeUp : stagger(0.04, 0.1)}
      >
        {visibleSpecs.map((spec, index) => (
          <SpecRow key={`${spec.label}-${index}`} spec={spec} index={index} />
        ))}
      </motion.dl>
    </section>
  );
};

export default SpecsTable;
