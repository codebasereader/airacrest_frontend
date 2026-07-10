import { motion, useReducedMotion } from "motion/react";
import { motionSafe, transitions } from "./presets";
import { lineReveal, lineStagger } from "./reveal";

/**
 * Staggers child LineReveal items for sequential line-by-line text entrance.
 * @param {"onMount" | "inView"} trigger
 */
const LineRevealGroup = ({
  children,
  className,
  trigger = "onMount",
  gap = 0.1,
  delay = 0.12,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const viewProps =
    trigger === "inView"
      ? {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.25 },
        }
      : {
          initial: "hidden",
          animate: "visible",
        };

  return (
    <motion.div
      className={className}
      variants={lineStagger(gap, delay)}
      {...viewProps}
    >
      {children}
    </motion.div>
  );
};

/**
 * Single line of text revealed by sliding up from a clipped container.
 */
const LineReveal = ({ children, className, as = "div" }) => {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="overflow-hidden">
      <Component className={`block ${className ?? ""}`} variants={lineReveal}>
        {children}
      </Component>
    </div>
  );
};

export { LineReveal, LineRevealGroup };
