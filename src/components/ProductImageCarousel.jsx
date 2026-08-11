import { useStaticMotion } from "../motion/useStaticMotion";
import React, { useEffect, useState } from "react";
import { getProductImageUrls } from "../utils/productUtils";

const ProductImageCarousel = ({
  images,
  alt,
  interval = 2000,
  className = "",
  imageClassName = "h-full w-full object-cover object-center",
}) => {
  const urls = getProductImageUrls(images);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useStaticMotion();

  useEffect(() => {
    setActiveIndex(0);
  }, [urls.join("|")]);

  useEffect(() => {
    if (urls.length <= 1 || prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % urls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [urls.length, interval, prefersReducedMotion]);

  if (urls.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-cream-200/60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {urls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={index === activeIndex ? alt : ""}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${imageClassName} ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          loading={index === 0 ? "lazy" : undefined}
        />
      ))}
    </div>
  );
};

export default ProductImageCarousel;
