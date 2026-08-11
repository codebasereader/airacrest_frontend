import { motion } from "motion/react";
import { lineReveal, lineStagger } from "./reveal";
import { useStaticMotion } from "./useStaticMotion";

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
  const staticMotion = useStaticMotion();

  if (staticMotion) {
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
  const staticMotion = useStaticMotion();
  const Component = motion[as] ?? motion.div;

  if (staticMotion) {
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
