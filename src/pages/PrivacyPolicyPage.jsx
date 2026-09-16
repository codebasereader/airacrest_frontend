import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";
import { COMPANY } from "../constants/company";

const LAST_UPDATED = "16 September 2026";

const sectionHeadingClass =
  "mt-10 font-heading text-lg font-bold tracking-[0.08em] text-maroon-900 sm:text-xl";

const paragraphClass =
  "mt-3 font-sans text-sm leading-relaxed text-maroon-700 sm:text-base";

const listClass =
  "mt-3 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-maroon-700 sm:text-base";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-cream-100">
      <SeoHead
        title="Privacy Policy"
        path="/privacy-policy"
        description="How Aira Crest Private Limited collects, uses, and protects information submitted through this website."
      />
      <Header />

      <main className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-script text-2xl text-maroon-600 sm:text-3xl">
            Privacy Policy
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold tracking-[0.1em] text-maroon-900 sm:text-3xl">
            AIRA CREST
          </h1>
          <p className="mt-4 font-sans text-xs tracking-wide text-maroon-500">
            Last updated: {LAST_UPDATED}
          </p>

          <p className={paragraphClass}>
            {COMPANY.legalName} (&quot;Aira Crest&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) operates airacrest.com (the
            &quot;Site&quot;). This Privacy Policy explains what information
            we collect when you use the Site, how we use it, and the choices
            you have.
          </p>

          <h2 className={sectionHeadingClass}>Information We Collect</h2>
          <p className={paragraphClass}>
            When you submit our enquiry form, we collect the details you
            provide: your name, company name, email address, phone/WhatsApp
            number, country, destination port, the products and quantities
            you&apos;re enquiring about, and any message you add. We use this
            solely to respond to your enquiry.
          </p>

          <h2 className={sectionHeadingClass}>
            How We Use Your Information
          </h2>
          <ul className={listClass}>
            <li>To respond to enquiries and provide requested quotations.</li>
            <li>To communicate with you about products, pricing, and logistics.</li>
            <li>To maintain business records required for trade and compliance.</li>
            <li>To protect the Site against spam and abusive submissions.</li>
          </ul>

          <h2 className={sectionHeadingClass}>Third-Party Services</h2>
          <p className={paragraphClass}>
            This Site uses Cloudflare Turnstile, an invisible challenge that
            helps us tell real visitors apart from automated bots when the
            enquiry form is submitted. Turnstile may process limited
            technical information (such as your IP address and browser
            signals) to make that determination. Cloudflare&apos;s use of
            this data is described in the{" "}
            <a
              href="https://www.cloudflare.com/turnstileprivacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-maroon-800 underline hover:text-maroon-900"
            >
              Cloudflare Turnstile Privacy Policy Addendum
            </a>
            .
          </p>

          <h2 className={sectionHeadingClass}>Data Security</h2>
          <p className={paragraphClass}>
            We use reasonable technical and organisational measures to
            protect the information you share with us against unauthorised
            access, alteration, or disclosure.
          </p>

          <h2 className={sectionHeadingClass}>Data Retention</h2>
          <p className={paragraphClass}>
            We retain enquiry information for as long as needed to respond to
            you and to satisfy our business and legal record-keeping
            obligations, after which it is deleted or anonymised.
          </p>

          <h2 className={sectionHeadingClass}>Your Rights</h2>
          <p className={paragraphClass}>
            You may ask us to access, correct, or delete the personal
            information you&apos;ve submitted to us by writing to{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-semibold text-maroon-800 underline hover:text-maroon-900"
            >
              {COMPANY.email}
            </a>
            .
          </p>

          <h2 className={sectionHeadingClass}>Changes to This Policy</h2>
          <p className={paragraphClass}>
            We may update this Privacy Policy from time to time. Changes take
            effect once posted on this page, and the &quot;Last updated&quot;
            date above will reflect the latest revision.
          </p>

          <h2 className={sectionHeadingClass}>Contact Us</h2>
          <p className={paragraphClass}>
            Questions about this Privacy Policy can be sent to{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-semibold text-maroon-800 underline hover:text-maroon-900"
            >
              {COMPANY.email}
            </a>{" "}
            or to our registered address: {COMPANY.registeredAddress}.
          </p>

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.14em] text-maroon-600 no-underline transition-colors hover:text-maroon-900"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
