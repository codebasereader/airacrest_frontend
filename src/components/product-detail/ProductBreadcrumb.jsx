import React from "react";
import { Link } from "react-router-dom";
import { toBritishSpelling } from "../../utils/britishSpelling";

const ProductBreadcrumb = ({ title }) => (
  <nav aria-label="Breadcrumb" className="mb-8 lg:mb-10">
    <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] tracking-wide text-maroon-600 sm:text-xs">
      <li>
        <Link to="/" className="no-underline transition-colors hover:text-maroon-900">
          Home
        </Link>
      </li>
      <li aria-hidden="true" className="text-maroon-300">
        /
      </li>
      <li>
        <Link
          to="/products"
          className="no-underline transition-colors hover:text-maroon-900"
        >
          Products
        </Link>
      </li>
      <li aria-hidden="true" className="text-maroon-300">
        /
      </li>
      <li className="font-medium text-maroon-900" aria-current="page">
        {toBritishSpelling(title)}
      </li>
    </ol>
  </nav>
);

export default ProductBreadcrumb;
