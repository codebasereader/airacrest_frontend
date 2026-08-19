import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook02Icon,
  InstagramIcon,
  Linkedin02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { usePublicBlogs } from "../hooks/usePublicBlogs";
import { areBlogsPubliclyVisible } from "../constants/blogs";
import {
  CATALOGUE_DOWNLOAD,
  COMPANY,
  COMPANY_REGISTRATIONS,
  SOCIAL_LINKS,
  isLiveExternalUrl,
} from "../constants/company";

const NAV_QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/#about" },
  { label: "Blogs", to: "/blogs", requiresBlogs: true },
  { label: "Contact Us", to: "/#contact" },
];

const SOCIAL_ITEMS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin02Icon,
    href: SOCIAL_LINKS.linkedin,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: WhatsappIcon,
    href: SOCIAL_LINKS.whatsapp,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
    href: SOCIAL_LINKS.instagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook02Icon,
    href: SOCIAL_LINKS.facebook,
  },
];

const footerHeadingClass =
  "font-heading text-sm font-bold tracking-[0.14em] text-gold-400";

const footerLinkClass =
  "font-sans text-sm text-cream-200/85 no-underline transition-colors hover:text-gold-400";

const Footer = () => {
  const year = new Date().getFullYear();
  const { blogs, loading: blogsLoading } = usePublicBlogs();
  const showBlogsNav = !blogsLoading && areBlogsPubliclyVisible(blogs);

  const quickLinks = useMemo(
    () =>
      NAV_QUICK_LINKS.filter((link) => !link.requiresBlogs || showBlogsNav),
    [showBlogsNav],
  );

  const visibleSocial = useMemo(
    () => SOCIAL_ITEMS.filter((item) => isLiveExternalUrl(item.href)),
    [],
  );

  return (
    <footer id="contact" className="bg-header text-cream-100/90">
      {/* Contact strip — horizontal row */}
      <div className="border-b border-cream-100/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-4 py-5 sm:px-6 sm:py-6 md:grid-cols-3 lg:px-10">
          <div className="text-center md:text-left">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Email
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="mt-1.5 inline-block break-all font-sans text-sm text-cream-100/90 no-underline transition-colors hover:text-gold-400 sm:text-base"
            >
              {COMPANY.email}
            </a>
          </div>

          <div className="text-center md:text-left">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Phone
            </p>
            <a
              href={`tel:${COMPANY.phoneTel}`}
              className="mt-1.5 inline-block font-sans text-sm text-cream-100/90 no-underline transition-colors hover:text-gold-400 sm:text-base"
            >
              {COMPANY.phoneDisplay}
            </a>
          </div>

          <div className="text-center md:text-left">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-gold-400 uppercase">
              WhatsApp
            </p>
            {isLiveExternalUrl(SOCIAL_LINKS.whatsapp) ? (
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block font-sans text-sm text-cream-100/90 no-underline transition-colors hover:text-gold-400 sm:text-base"
              >
                {COMPANY.whatsappDisplay}
              </a>
            ) : (
              <p className="mt-1.5 font-sans text-sm text-cream-100/90 sm:text-base">
                {COMPANY.whatsappDisplay}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Blocks — company identity + quick links */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Company identity */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="inline-flex no-underline"
              aria-label="Aira Crest — Home"
            >
              <img
                src="/fulllogonew.webp"
                alt="Aira Crest"
                className="mx-auto h-20 w-auto object-contain md:mx-0 md:h-24"
              />
            </Link>

            <p className="mt-5 font-sans text-sm font-semibold text-cream-100">
              {COMPANY.legalName}
            </p>

            <address className="mt-3 font-sans text-sm not-italic leading-relaxed text-cream-200/80">
              {COMPANY.registeredAddress}
            </address>

            <p className="mt-4 font-sans text-xs leading-relaxed text-cream-200/75">
              <span className="font-semibold tracking-[0.12em] text-gold-400/90 uppercase">
                CIN
              </span>
              {" "}
              <span className="break-all text-cream-100/90">{COMPANY.cin}</span>
            </p>

            <ul
              className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start"
              aria-label="Company registrations"
            >
              {COMPANY_REGISTRATIONS.map((item) => (
                <li
                  key={item.label}
                  className="rounded-sm border border-cream-100/15 bg-cream-100/5 px-2.5 py-1.5 font-sans text-[10px] leading-snug tracking-[0.04em] text-cream-200/85"
                >
                  <span className="text-cream-100/95">{item.label}</span>
                  {item.value ? (
                    <span className="text-cream-200/70"> {item.value}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links (+ catalogue) */}
          <div className="text-center md:text-left">
            <h3 className={footerHeadingClass}>QUICK LINKS</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={CATALOGUE_DOWNLOAD.href}
                  download={CATALOGUE_DOWNLOAD.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  {CATALOGUE_DOWNLOAD.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social icons row (only live destinations; order fixed) */}
        {visibleSocial.length > 0 && (
          <div className="mt-12 border-t border-cream-100/10 pt-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <h3 className={footerHeadingClass}>FOLLOW US</h3>
              <ul className="flex flex-wrap items-center justify-center gap-3">
                {visibleSocial.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-cream-100/20 text-cream-100 transition-colors hover:border-gold-400/60 hover:text-gold-400"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        color="currentColor"
                        strokeWidth={1.75}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-cream-100/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-6 text-center font-sans text-xs sm:px-6 lg:px-10">
          <p className="text-cream-200/70">
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <span
            className="hidden text-cream-300/30 sm:inline"
            aria-hidden="true"
          >
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
