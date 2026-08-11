import { motion } from "motion/react";
import { fadeUp, motionSafe, stagger } from "./presets";
import { useStaticMotion } from "./useStaticMotion";

/**
 * Staggers child FadeIn / motion items — ideal for nav lists, feature grids, etc.
 */
const Stagger = ({
  children,
  className,
  as = "div",
  gap = 0.06,
  delay = 0.08,
  once = true,
  amount = 0.15,
  ...props
}) => {
  const staticMotion = useStaticMotion();
  const Component = motion[as] ?? motion.div;

  const safe = motionSafe(staticMotion, {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
    variants: stagger(gap, delay),
    ...props,
  });

  return (
    <Component className={className} {...safe}>
      {children}
    </Component>
  );
};

export { fadeUp as staggerItem };
export default Stagger;
