import React from "react";
import { Link } from "react-router-dom";
import ProductImageCarousel from "./ProductImageCarousel";
import { toBritishSpelling } from "../utils/britishSpelling";
import { getProductPath } from "../utils/productUtils";

const ProductCard = ({ product, className = "" }) => {
  const highlights = product.highlights ?? [];
  const productName = toBritishSpelling(product.name);
  const productPath = getProductPath(product);

  return (
    <article
      data-product-card
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm shadow-maroon-950/5 ${className}`}
    >
      <ProductImageCarousel
        images={product.images}
        alt={productName}
        className="aspect-square rounded-t-2xl"
      />

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <h3 className="font-heading text-sm font-bold leading-snug tracking-[0.08em] text-maroon-900 sm:text-[0.95rem]">
          {productName}
        </h3>

        {highlights.length > 0 && (
          <ul className="mt-4 flex flex-1 flex-wrap gap-2">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border border-maroon-200/60 bg-cream-50/90 px-2.5 py-1 font-sans text-[10px] font-medium leading-snug text-maroon-700 sm:px-3 sm:py-1.5 sm:text-[11px]"
              >
                {toBritishSpelling(highlight)}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex justify-start">
          <Link
            to={productPath}
            className="inline-flex items-center gap-1.5 rounded-sm border border-maroon-700 px-3 py-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-900 no-underline transition-colors duration-200 hover:border-maroon-900 hover:bg-maroon-50 sm:px-4 sm:py-2 sm:text-[11px]"
          >
            VIEW DETAILS
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
