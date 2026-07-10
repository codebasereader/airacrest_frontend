import { motion, useReducedMotion } from "motion/react";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { transitions } from "../motion/presets";

const About = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative flex w-full flex-col bg-header lg:flex-row lg:items-stretch"
    >
      {/* Left — content panel */}
      <div className="relative flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(122,46,53,0.18)_0%,transparent_65%)]"
          aria-hidden="true"
        />

        <LineRevealGroup className="relative max-w-xl" trigger="inView" gap={0.12} delay={0.08}>
          <LineReveal>
            <h2 className="font-heading text-3xl font-bold tracking-[0.12em] text-gold-400 sm:text-4xl lg:text-[2.5rem]">
              About Us
            </h2>
          </LineReveal>

          <LineReveal>
            <p className="mt-6 font-sans text-sm leading-relaxed text-cream-200/90 sm:mt-8 sm:text-base sm:leading-7">
              Aira Crest Private Limited is a Bengaluru based food export company
              supplying premium dehydrated vegetables, spices & natural honey
              from India to buyers across the EU, Gulf, US, UK, Japan and Southeast
              Asia. We combine reliable sourcing from India&apos;s leading
              production clusters with strict, lab verified quality control and
              dependable export logistics, so importers receive consistent,
              compliant, well documented product, shipment after shipment.
            </p>
          </LineReveal>

          <LineReveal>
            <p className="mt-5 font-sans text-sm leading-relaxed text-cream-200/90 sm:text-base sm:leading-7">
              We supply hotels and restaurants, supermarkets and wholesale
              traders, food producers and processors. Custom packaging and
              private label options are available, and every consignment is
              dispatched with a batch wise Certificate of Analysis.
            </p>
          </LineReveal>
        </LineRevealGroup>
      </div>

      {/* Right — image fade in */}
      <motion.div
        className="relative w-full shrink-0 self-stretch overflow-hidden bg-header lg:w-[48%] xl:w-[52%]"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...transitions.slow, delay: 0.1 }}
      >
        <img
          src="/about.webp"
          alt="Aira Crest food export operations and premium products"
          className="block h-[320px] w-full object-cover object-right sm:h-[400px] lg:h-full lg:min-h-[480px]"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-header to-transparent lg:w-24"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
};

export default About;
