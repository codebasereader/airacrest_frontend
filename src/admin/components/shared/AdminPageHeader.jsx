import React from "react";

const AdminPageHeader = ({ eyebrow = "Admin", title, description }) => (
  <header className="mb-6">
    <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase">
      {eyebrow}
    </p>
    <h1 className="mt-2 font-heading text-2xl font-bold tracking-[0.08em] text-maroon-900 sm:text-3xl">
      {title}
    </h1>
    {description && (
      <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-maroon-700 sm:text-base">
        {description}
      </p>
    )}
  </header>
);

export default AdminPageHeader;
