import { motion } from "motion/react";
import { maskReveal } from "./reveal";
import { useStaticMotion } from "./useStaticMotion";

/**
 * Image revealed via horizontal clip-path mask (0% → 100%).
 * @param {"onMount" | "inView"} trigger
 */
const MaskImage = ({
  src,
  alt,
  className = "",
  imageClassName = "",
  blendClassName = "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-header to-transparent lg:w-24",
  trigger = "onMount",
  delay = 0.2,
  blend = true,
}) => {
  const staticMotion = useStaticMotion();

  const inner = (
    <div className="absolute inset-0">
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover object-right ${imageClassName}`}
      />
      {blend && <div className={blendClassName} aria-hidden="true" />}
    </div>
  );

  const baseClassName = `relative shrink-0 self-stretch overflow-hidden bg-header h-[320px] sm:h-[400px] lg:h-auto ${className}`;

  if (staticMotion) {
    return <div className={baseClassName}>{inner}</div>;
  }

  const triggerProps =
    trigger === "inView"
      ? {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.1, margin: "0px 0px -80px 0px" },
        }
      : {
          initial: "hidden",
          animate: "visible",
        };

  return (
    <motion.div
      className={baseClassName}
      variants={maskReveal}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      {...triggerProps}
    >
      {inner}
    </motion.div>
  );
};

export default MaskImage;
