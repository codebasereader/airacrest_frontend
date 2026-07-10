import React from "react";
import { Link } from "react-router-dom";

const ProductDetailActions = () => (
  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    <Link
      to={`/#enquiry`}
      className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold-500 px-8 py-3.5 font-sans text-[11px] font-bold tracking-[0.18em] text-maroon-950 no-underline transition-colors hover:bg-gold-400"
    >
      REQUEST BULK QUOTE
      <span aria-hidden="true">→</span>
    </Link>
    <Link
      to="/products"
      className="inline-flex items-center justify-center gap-2 rounded-sm border border-maroon-700 bg-white px-8 py-3.5 font-sans text-[11px] font-semibold tracking-[0.18em] text-maroon-900 no-underline transition-colors hover:border-maroon-900 hover:bg-maroon-50"
    >
      VIEW ALL PRODUCTS
    </Link>
    <Link
      to="/"
      className="inline-flex items-center justify-center gap-2 rounded-sm border border-maroon-200 px-8 py-3.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-700 no-underline transition-colors hover:border-maroon-400 hover:text-maroon-900"
    >
      ← BACK TO HOME
    </Link>
  </div>
);

export default ProductDetailActions;
