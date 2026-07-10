import React from "react";

const AdminEmptyState = ({ title, description }) => (
  <div className="rounded-xl border border-dashed border-maroon-200 bg-cream-50/80 px-5 py-10 text-center">
    <p className="font-sans text-sm font-medium text-maroon-800">{title}</p>
    {description && (
      <p className="mt-2 font-sans text-xs text-maroon-600">{description}</p>
    )}
  </div>
);

export default AdminEmptyState;
