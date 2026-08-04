import React from "react";
import { Link } from "react-router-dom";

const AdminBrand = ({ className = "" }) => (
  <Link
    to="/admin/categories"
    className={`inline-flex shrink-0 items-center no-underline ${className}`}
    aria-label="Aira Crest Admin — Categories"
  >
    <img
      src="/fulllogonew.webp"
      alt="Aira Crest"
      className="h-9 w-auto object-contain sm:h-10"
    />
  </Link>
);

export default AdminBrand;
