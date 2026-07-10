import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiChemistry02Icon,
  Leaf01Icon,
  SustainableEnergyIcon,
} from "@hugeicons/core-free-icons";
import MaskImage from "../motion/MaskImage";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";

const FEATURES = [
  { label: "Pure & Natural", icon: Leaf01Icon },
  { label: "Lab Tested", icon: AiChemistry02Icon },
  { label: "Sustainable", icon: SustainableEnergyIcon },
  { label: "Global Standards", icon: SustainableEnergyIcon },
];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-140px)] w-full flex-col bg-header lg:min-h-[calc(100vh-160px)] lg:flex-row lg:items-stretch"
    >
      {/* Left — content panel */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:flex-none lg:basis-[38%] lg:max-w-[520px] lg:px-12 lg:py-20 xl:basis-[36%] xl:max-w-[480px] xl:px-16">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[72%] bg-[radial-gradient(ellipse_at_0%_55%,rgba(122,46,53,0.2)_0%,transparent_68%)]"
          aria-hidden="true"
        />

        <LineRevealGroup className="relative max-w-xl" trigger="onMount" gap={0.12} delay={0.1}>
          <LineReveal>
            <h1 className="font-heading text-3xl font-bold leading-[1.15] tracking-[0.12em] text-gold-400 sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              PREMIUM QUALITY.
            </h1>
          </LineReveal>

          <LineReveal>
            <span className="font-heading text-3xl font-bold leading-[1.15] tracking-[0.12em] text-gold-400 sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              GLOBAL REACH.
            </span>
          </LineReveal>

          <LineReveal>
            <p className="font-script mt-4 text-2xl text-gold-400 sm:mt-5 sm:text-3xl lg:text-4xl">
              Trusted Exports. Lasting Partnerships.
            </p>
          </LineReveal>

          <LineReveal>
            <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-cream-200/90 sm:mt-8 sm:text-base sm:leading-7">
              We export premium quality Dehydrated Vegetables & Fruits, Spices & Natural Honey
              from India to the world with trust, quality and commitment.
            </p>
          </LineReveal>

          <LineReveal>
            <div className="mt-10 flex flex-col gap-2.5 sm:mt-14 sm:gap-3">
              {[FEATURES.slice(0, 2), FEATURES.slice(2, 4)].map((row) => (
                <div
                  key={row.map((f) => f.label).join("-")}
                  className="flex items-center gap-2.5 sm:gap-3"
                >
                  {row.map((feature, index) => (
                    <React.Fragment key={feature.label}>
                      {index > 0 && (
                        <span
                          className="shrink-0 font-sans text-cream-300/40"
                          aria-hidden="true"
                        >
                          |
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2 font-sans text-[11px] font-medium tracking-[0.14em] text-cream-200/85 sm:text-xs">
                        <HugeiconsIcon
                          icon={feature.icon}
                          size={18}
                          color="currentColor"
                          strokeWidth={1.5}
                          className="shrink-0 text-gold-400"
                          aria-hidden="true"
                        />
                        {feature.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </LineReveal>
        </LineRevealGroup>
      </div>

      {/* Right — masked image reveal */}
      <MaskImage
        src="/herobgac1.webp"
        alt="Aira Crest premium dehydrated vegetables, wild honey, and fresh produce"
        className="w-full lg:min-w-0 lg:flex-1 lg:basis-[62%] xl:basis-[64%]"
        blendClassName="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-header/90 to-transparent lg:w-16"
        trigger="onMount"
        delay={0.35}
      />
    </section>
  );
};

export default Hero;
