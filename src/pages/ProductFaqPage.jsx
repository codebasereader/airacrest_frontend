import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";
import PrerenderReady from "../components/PrerenderReady";
import ProductFaqPreview from "../components/product-detail/ProductFaqPreview";
import TradingHouseNote from "../components/product-detail/TradingHouseNote";
import WhatsAppInlineButton from "../components/WhatsAppInlineButton";
import { usePublicProduct } from "../hooks/usePublicProducts";
import { useSetWhatsAppSource } from "../hooks/useSetWhatsAppSource";
import { COMPANY } from "../constants/company";
import { absoluteUrl } from "../constants/seo";
import { toBritishSpelling } from "../utils/britishSpelling";
import {
  getProductFaqPath,
  getProductPath,
  getVisibleFaqs,
} from "../utils/productUtils";
import { formatProductWhatsAppTag } from "../utils/whatsapp";

const ProductFaqSkeleton = () => (
  <div className="mx-auto max-w-[900px] animate-pulse">
    <div className="h-4 w-40 rounded bg-cream-200/80" />
    <div className="mt-8 h-9 w-2/3 rounded bg-cream-200/80" />
    <div className="mt-4 h-4 w-48 rounded bg-cream-200/60" />
    <div className="mt-10 space-y-3">
      <div className="h-16 w-full rounded-2xl bg-cream-200/70" />
      <div className="h-16 w-full rounded-2xl bg-cream-200/60" />
      <div className="h-16 w-full rounded-2xl bg-cream-200/70" />
    </div>
  </div>
);

const ProductFaqPage = () => {
  const { slug } = useParams();
  const { product, loading, error, resolvedViaId } = usePublicProduct(slug);
  const whatsAppSourceTag = product
    ? formatProductWhatsAppTag(toBritishSpelling(product.name))
    : null;

  useSetWhatsAppSource(whatsAppSourceTag);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <main className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
          <ProductFaqSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return <Navigate to="/products" replace />;
  }

  if (resolvedViaId && product.slug && product.slug !== slug) {
    return <Navigate to={`/products/${product.slug}/faq`} replace />;
  }

  const productPath = getProductPath(product);
  const faqPath = getProductFaqPath(product);
  const faqs = getVisibleFaqs(product.faqs);
  const productName = formatProductWhatsAppTag(toBritishSpelling(product.name));

  if (faqs.length === 0) {
    return <Navigate to={productPath} replace />;
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: toBritishSpelling(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: toBritishSpelling(faq.answer),
      },
    })),
    url: absoluteUrl(faqPath),
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <SeoHead
        title={`${productName} FAQ`}
        path={faqPath}
        description={`Frequently asked questions about ${productName.toLowerCase()} from Aira Crest — quality, packaging, and export details.`}
        jsonLd={faqJsonLd}
      />
      <PrerenderReady ready />
      <Header />

      <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div
          className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-maroon-300/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[900px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-600">
              <li>
                <Link
                  to="/products"
                  className="no-underline transition-colors hover:text-maroon-900"
                >
                  PRODUCTS
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to={productPath}
                  className="no-underline transition-colors hover:text-maroon-900"
                >
                  {productName.toUpperCase()}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-maroon-900">FAQ</li>
            </ol>
          </nav>

          <header className="mt-8">
            <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-600 uppercase">
              {productName}
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold tracking-[0.06em] text-maroon-900 sm:text-3xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-maroon-700">
              Answers about quality, packaging, and export details for{" "}
              {productName.toLowerCase()}.
            </p>
          </header>

          <ProductFaqPreview
            product={product}
            faqs={faqs}
            previewOnly={false}
            showHeading={false}
            className="mt-10"
          />

          <TradingHouseNote />

          <div className="mt-10 flex flex-col gap-4 border-t border-maroon-200/40 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Enquiry — ${productName}`)}`}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-maroon-700 bg-white px-5 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-900 no-underline transition-colors hover:border-maroon-900 hover:bg-maroon-50"
              >
                {COMPANY.email}
              </a>
              <WhatsAppInlineButton sourceTag={productName} />
            </div>

            <Link
              to={productPath}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-maroon-800 no-underline transition-colors hover:text-maroon-950"
            >
              ← BACK TO PRODUCT
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductFaqPage;
