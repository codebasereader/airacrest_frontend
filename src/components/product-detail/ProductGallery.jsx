import React, { useState } from "react";
import {motion} from "motion/react";
import { useStaticMotion } from "../../motion/useStaticMotion";
import { getProductImageUrls } from "../../utils/productUtils";

const ProductGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useStaticMotion();
  const imageUrls = getProductImageUrls(images);

  if (imageUrls.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-maroon-200/40 bg-cream-200/60" />
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-maroon-200/40 bg-white shadow-[0_12px_48px_-16px_rgba(42,10,10,0.18)]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="aspect-square">
          <img
            src={imageUrls[activeIndex]}
            alt={title}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-maroon-950/5"
          aria-hidden="true"
        />
      </motion.div>

      {imageUrls.length > 1 && (
        <div className="flex gap-3">
          {imageUrls.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-gold-500 shadow-md shadow-gold-500/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <img
                src={image}
                alt=""
                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
