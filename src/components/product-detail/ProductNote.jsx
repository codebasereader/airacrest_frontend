import React from "react";

import { toBritishSpelling } from "../../utils/britishSpelling";

const ProductNote = ({ note }) => {
  if (!note) return null;

  return (
    <aside className="mt-6 flex gap-3 rounded-xl border border-gold-400/30 bg-gold-400/8 px-5 py-4 sm:px-6 sm:py-5">
      <span
        className="mt-0.5 font-heading text-sm text-gold-600"
        aria-hidden="true"
      >
        ✦
      </span>
      <p className="font-sans text-xs leading-relaxed text-maroon-800 sm:text-sm sm:leading-6">
        <span className="font-semibold text-maroon-900">Note: </span>
        {toBritishSpelling(note)}
      </p>
    </aside>
  );
};

export default ProductNote;
