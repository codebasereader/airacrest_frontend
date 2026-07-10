import { EASE_OUT } from "./presets";

/** Horizontal clip reveal — mask opens left to right (0% → 100%) */
export const maskReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)" },
};

/** Line slides up inside an overflow-hidden wrapper */
export const lineReveal = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const lineStagger = (gap = 0.1, delay = 0.12) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: gap,
      delayChildren: delay,
    },
  },
});
