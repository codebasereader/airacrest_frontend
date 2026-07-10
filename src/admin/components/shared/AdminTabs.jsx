import React from "react";

const AdminTabs = ({ tabs, activeTab, onChange }) => (
  <div
    className="inline-flex w-full max-w-md rounded-xl border border-maroon-200/60 bg-cream-50/80 p-1"
    role="tablist"
    aria-label="Catalogue sections"
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${
            isActive
              ? "bg-maroon-800 text-gold-400 shadow-sm"
              : "text-maroon-700 hover:bg-white hover:text-maroon-900"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default AdminTabs;
