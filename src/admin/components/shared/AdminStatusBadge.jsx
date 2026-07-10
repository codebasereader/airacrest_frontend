import React from "react";

const AdminStatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide uppercase ${
      isActive
        ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
        : "bg-maroon-50 text-maroon-600 ring-1 ring-maroon-200"
    }`}
  >
    {isActive ? "Active" : "Hidden"}
  </span>
);

export default AdminStatusBadge;
