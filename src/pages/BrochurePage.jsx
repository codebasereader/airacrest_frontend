import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BrochureQR from "../components/BrochureQR";
import DownloadBrochureButton from "../components/DownloadBrochureButton";
import { BROCHURE_PDF_URL } from "../constants/brochure";

const BrochurePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const redirectTimer = window.setTimeout(() => {
      window.location.href = BROCHURE_PDF_URL;
    }, 400);

    return () => window.clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-script text-2xl text-maroon-600 sm:text-3xl">
            Product Catalogue
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold tracking-[0.1em] text-maroon-900 sm:text-3xl">
            AIRA CREST
          </h1>
          <p className="mt-4 font-sans text-sm leading-relaxed text-maroon-700 sm:text-base">
            Opening product catalogue… If it doesn&apos;t start automatically,
            scan the QR code or use the download button below.
          </p>

          <div className="mt-8 flex flex-col items-center gap-6">
            <BrochureQR />
            <DownloadBrochureButton variant="enquire" />
            <Link
              to="/"
              className="font-sans text-xs font-semibold tracking-[0.14em] text-maroon-600 no-underline transition-colors hover:text-maroon-900"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrochurePage;
