import React from "react";

const TradingHouseNote = ({ className = "mt-10 lg:mt-12" }) => (
  <aside
    className={`${className} rounded-2xl border border-maroon-200/40 bg-cream-50/80 px-5 py-5 sm:px-6 sm:py-6`}
    aria-labelledby="trading-house-note-heading"
  >
    <p
      id="trading-house-note-heading"
      className="font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-600 uppercase"
    >
      A note on who we are
    </p>
    <p className="mt-3 font-sans text-sm leading-relaxed text-maroon-800 sm:text-[0.95rem] sm:leading-7">
      Aira Crest is an export trading house, not a factory. We source through
      qualified partner processors, apply our own specification and inspection
      discipline, and take full commercial responsibility for what arrives at
      your port. We state this openly because buyers deserve to know it before
      the first purchase order, not at audit stage.
    </p>
  </aside>
);

export default TradingHouseNote;
