import React from "react";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/#about" },
  { label: "Products", to: "/#products" },
  { label: "Export Capability", to: "/#export" },
  { label: "Request a Quote", to: "/#enquiry" },
  { label: "All Products", to: "/products" },
];

const TOP_ITEMS = [
  {
    label: "Company",
    value: "Aira Crest Private Limited",
    href: null,
  },
  {
    label: "Email",
    value: "connect@airacrest.com",
    href: "mailto:connect@airacrest.com",
  },
  {
    label: "Phone",
    value: "+91 9187454810",
    href: "tel:+919187454810",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-header text-cream-100/90">
      {/* Top info strip */}
      <div className="border-b border-cream-100/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-4 py-5 sm:px-6 sm:py-6 md:grid-cols-3 lg:px-10">
          {TOP_ITEMS.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-gold-400 uppercase">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-1.5 inline-block font-sans text-sm text-cream-100/90 no-underline transition-colors hover:text-gold-400 sm:text-base"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1.5 font-sans text-sm text-cream-100/90 sm:text-base">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 xl:gap-16">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link to="/" className="inline-flex no-underline" aria-label="Aira Crest — Home">
              <img
                src="/fulllogo.webp"
                alt="Aira Crest"
                className="h-24 w-auto object-contain sm:h-28"
              />
            </Link>
            <p className="mt-5 max-w-xs text-center font-sans text-sm leading-relaxed text-cream-200/80 lg:text-left">
              Premium dehydrated vegetables, spices and natural honey, exported
              from India with trust, quality and commitment.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center lg:text-left">
            <h3 className="font-heading text-sm font-bold tracking-[0.14em] text-gold-400">
              QUICK LINKS
            </h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-cream-200/85 no-underline transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & office */}
          <div className="text-center lg:text-left">
            <h3 className="font-heading text-sm font-bold tracking-[0.14em] text-gold-400">
              CONTACT
            </h3>
            <ul className="mt-5 space-y-3 font-sans text-sm text-cream-200/85">
              <li>
                <a
                  href="mailto:connect@airacrest.com"
                  className="no-underline text-cream-200/85"
                >
                  connect@airacrest.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919187454810"
                  className="no-underline text-cream-200/85"
                >
                  +91 9187454810
                </a>
              </li>
            </ul>

            <h3 className="mt-8 font-heading text-sm font-bold tracking-[0.14em] text-gold-400">
              REGISTERED OFFICE
            </h3>
            <address className="mt-5 font-sans text-sm not-italic leading-relaxed text-cream-200/85">
              41, Ground Floor, Upadhyayara Sangha (Sinche), Near Manasanagar
              Bus Stop, Nagarabhavi, Bengaluru, Karnataka 560072, India
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream-100/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-6 text-center font-sans text-xs sm:px-6 lg:px-10">
          <p className="text-cream-200/70">
            © {year} Aira Crest Private Limited. All rights reserved.
          </p>
          <span className="hidden text-cream-300/30 sm:inline" aria-hidden="true">
            |
          </span>
          <p className="text-cream-200/60">
            Designed and Developed by{" "}
            <a
              href="https://www.naviinfo.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400/90 no-underline transition-colors hover:text-gold-400"
            >
              Navi Infotech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
