/** Shared easing & variants — keep animations subtle and consistent site-wide */

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const transitions = {
  instant: { duration: 0 },
  fast: { duration: 0.22, ease: EASE_OUT },
  base: { duration: 0.45, ease: EASE_OUT },
  slow: { duration: 0.65, ease: EASE_OUT },
  spring: { type: "spring", stiffness: 380, damping: 32 },
  springSnappy: { type: "spring", stiffness: 420, damping: 28 },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const stagger = (gap = 0.06, delay = 0.08) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: gap,
      delayChildren: delay,
    },
  },
});

/** Returns motion props that skip animation when the user prefers reduced motion */
export const motionSafe = (prefersReducedMotion, props) => {
  if (!prefersReducedMotion) return props;

  return {
    ...props,
    initial: false,
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: transitions.instant,
    whileHover: undefined,
    whileTap: undefined,
    whileInView: undefined,
    variants: undefined,
  };
};
