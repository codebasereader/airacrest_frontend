import React from "react";

const AdminSpinner = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-12">
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-maroon-200 border-t-maroon-700"
      aria-hidden="true"
    />
    <span className="font-sans text-sm text-maroon-700">{label}</span>
  </div>
);

export default AdminSpinner;
