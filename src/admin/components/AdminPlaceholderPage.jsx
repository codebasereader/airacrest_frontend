import React from "react";

const AdminPlaceholderPage = ({ title, description }) => (
  <section>
    <div className="rounded-2xl border border-maroon-200/50 bg-white p-6 shadow-sm sm:p-8">
      <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase">
        Admin
      </p>
      <h1 className="mt-2 font-heading text-2xl font-bold tracking-[0.08em] text-maroon-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-maroon-700 sm:text-base">
        {description}
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-maroon-200 bg-cream-50/80 px-5 py-10 text-center">
        <p className="font-sans text-sm text-maroon-600">
          Content management for this section will be connected next.
        </p>
      </div>
    </div>
  </section>
);

export default AdminPlaceholderPage;
