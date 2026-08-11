import { motion } from "motion/react";
import { fadeUp, motionSafe, transitions } from "./presets";
import { useStaticMotion } from "./useStaticMotion";

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
  header: motion.header,
  footer: motion.footer,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

/**
 * Reusable fade-up entrance — use on sections, cards, and text blocks.
 */
const FadeIn = ({
  children,
  className,
  as = "div",
  delay = 0,
  duration,
  once = true,
  amount = 0.2,
  variant = fadeUp,
  ...props
}) => {
  const staticMotion = useStaticMotion();
  const Component = MOTION_TAGS[as] ?? motion.div;

  const safe = motionSafe(staticMotion, {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
    variants: variant,
    transition: {
      ...transitions.base,
      duration: duration ?? transitions.base.duration,
      delay,
    },
    ...props,
  });

  return (
    <Component className={className} {...safe}>
      {children}
    </Component>
  );
};

export default FadeIn;
