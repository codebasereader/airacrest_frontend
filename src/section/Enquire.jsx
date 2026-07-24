import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CargoShipIcon,
  CustomerService01Icon,
  MoneyBag02Icon,
  WindTurbineIcon,
} from "@hugeicons/core-free-icons";
import { motion, useReducedMotion } from "motion/react";
import { LineReveal, LineRevealGroup } from "../motion/LineReveal";
import { fadeUp, stagger } from "../motion/presets";
import DownloadBrochureButton from "../components/DownloadBrochureButton";
import BrochureQR from "../components/BrochureQR";
import { submitEnquiry } from "../api/enquire";
import { listPublicProducts } from "../api/productsApi";
import { normalizeLoadMoreResponse } from "../api/loadMore";
import { ApiError } from "../api/client";
import { toBritishSpelling } from "../utils/britishSpelling";

const PACKAGING_OPTIONS = [
  "Bulk Cartons",
  "Retail Packs",
  "Private Label",
  "Custom",
];

const OTHER_COUNTRY = "Other";

const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "United States",
  "Japan",
  "Singapore",
  "Malaysia",
  "Australia",
  "South Africa",
  OTHER_COUNTRY,
];

const BENEFITS = [
  {
    title: "COMPETITIVE PRICING",
    description: "Best value without compromising quality.",
    icon: MoneyBag02Icon,
  },
  {
    title: "RELIABLE LOGISTICS",
    description: "Strong global network for on-time delivery.",
    icon: CargoShipIcon,
  },
  {
    title: "CUSTOMER FOCUSED",
    description: "Dedicated support at every step.",
    icon: CustomerService01Icon,
  },
  {
    title: "ETHICAL & SUSTAINABLE",
    description: "Responsible sourcing for a better tomorrow.",
    icon: WindTurbineIcon,
  },
];

const createProductLine = () => ({
  productId: "",
  estimatedQuantity: "",
  packagingPreference: "",
  productNote: "",
});

const INITIAL_FORM = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  country: "",
  otherCountry: "",
  destinationPort: "",
  products: [createProductLine()],
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full rounded-md border border-maroon-200 bg-white px-4 py-3.5 font-sans text-sm text-maroon-900 placeholder:text-maroon-400/70 transition-colors duration-200 focus:border-maroon-600 focus:outline-none focus:ring-2 focus:ring-maroon-600/10";

const fieldErrorClass =
  "border-red-400/80 focus:border-red-500 focus:ring-red-500/10";

const selectClass = `${fieldClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%237a2e35%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E')] bg-size-[1rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10`;

const FormField = ({ id, label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="font-sans text-xs font-semibold tracking-wide text-maroon-800"
    >
      {label}
      {required && <span className="text-maroon-500"> *</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="font-sans text-[11px] text-maroon-500">{hint}</p>
    )}
    {error && (
      <p className="font-sans text-[11px] text-red-700/90" role="alert">
        {error}
      </p>
    )}
  </div>
);

const BenefitItem = ({ benefit }) => (
  <motion.div variants={fadeUp} className="flex gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-maroon-950/5">
      <HugeiconsIcon
        icon={benefit.icon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
        className="text-maroon-700"
        aria-hidden="true"
      />
    </div>
    <div>
      <h3 className="font-heading text-xs font-bold tracking-[0.14em] text-maroon-900 sm:text-sm">
        {benefit.title}
      </h3>
      <p className="mt-1.5 font-sans text-xs leading-relaxed text-maroon-700 sm:text-sm">
        {benefit.description}
      </p>
    </div>
  </motion.div>
);

const Enquire = () => {
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        let allProducts = [];
        let skip = 0;
        let hasMore = true;

        while (hasMore && !cancelled) {
          const data = await listPublicProducts({ limit: 50, skip });
          const { items, loadMore } = normalizeLoadMoreResponse(data);
          allProducts = [...allProducts, ...items];
          hasMore = loadMore.hasMore ?? false;
          skip = loadMore.nextSkip ?? skip + items.length;
          if (items.length === 0) break;
        }

        if (!cancelled) {
          const sorted = [...allProducts].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
          );
          setProducts(sorted);
        }
      } catch {
        if (!cancelled) {
          setProductsError(
            "Unable to load products right now. Please refresh and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const updateProductLine = (index, field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [field]: value } : line,
      ),
    }));
    setErrors((prev) => {
      if (!prev.products?.[index]?.[field] && !prev.products) return prev;
      const nextProductErrors = [...(prev.products || [])];
      nextProductErrors[index] = {
        ...(nextProductErrors[index] || {}),
        [field]: "",
      };
      return { ...prev, products: nextProductErrors };
    });
    setSubmitError("");
  };

  const addProductLine = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, createProductLine()],
    }));
    setSubmitError("");
  };

  const removeProductLine = (index) => {
    setForm((prev) => {
      if (prev.products.length === 1) return prev;
      return {
        ...prev,
        products: prev.products.filter((_, lineIndex) => lineIndex !== index),
      };
    });
    setErrors((prev) => ({
      ...prev,
      products: (prev.products || []).filter((_, lineIndex) => lineIndex !== index),
    }));
    setSubmitError("");
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      country: value,
      otherCountry: value === OTHER_COUNTRY ? prev.otherCountry : "",
    }));
    setErrors((prev) => ({ ...prev, country: "", otherCountry: "" }));
    setSubmitError("");
  };

  const isOtherCountry = form.country === OTHER_COUNTRY;

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Please enter your company name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone or WhatsApp number.";
    } else if (form.phone.trim().replace(/\D/g, "").length < 8) {
      nextErrors.phone = "Please include your country code and a valid number.";
    }

    if (!form.country) {
      nextErrors.country = "Please select your country.";
    } else if (isOtherCountry && !form.otherCountry.trim()) {
      nextErrors.otherCountry = "Please enter your country name.";
    }

    const productErrors = form.products.map((line) => {
      const lineErrors = {};

      if (!line.productId) {
        lineErrors.productId = "Please select a product.";
      }

      if (!line.estimatedQuantity.trim()) {
        lineErrors.estimatedQuantity = "Please enter an estimated quantity.";
      }

      if (line.productNote.trim().length > 500) {
        lineErrors.productNote = "Product note must be 500 characters or less.";
      }

      return lineErrors;
    });

    if (productErrors.some((lineErrors) => Object.keys(lineErrors).length > 0)) {
      nextErrors.products = productErrors;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      companyName: form.companyName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: isOtherCountry ? form.otherCountry.trim() : form.country,
      destinationPort: form.destinationPort.trim() || undefined,
      products: form.products.map((line) => ({
        product: line.productId,
        estimatedQuantity: line.estimatedQuantity.trim(),
        packagingPreference: line.packagingPreference || undefined,
        note: line.productNote.trim() || undefined,
      })),
      message: form.message.trim() || undefined,
    };

    setSubmitting(true);

    try {
      await submitEnquiry(payload);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitError("");
    setErrors({});
  };

  return (
    <section
      id="enquiry"
      className="relative overflow-hidden bg-cream-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-gold-400/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-maroon-300/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-12 sm:gap-14 lg:grid lg:grid-cols-[minmax(0,1.65fr)_1px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          <div>
            <LineRevealGroup trigger="inView" gap={0.1} delay={0.05}>
              <LineReveal>
                <p className="font-script text-2xl text-maroon-600 sm:text-3xl">
                  Let&apos;s Build a Stronger Partnership
                </p>
              </LineReveal>

              <LineReveal>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-[0.12em] text-maroon-900 sm:text-3xl lg:text-4xl">
                  REQUEST A QUOTE
                </h2>
              </LineReveal>

              <LineReveal>
                <div
                  className="mt-4 flex max-w-xs items-center gap-3"
                  aria-hidden="true"
                >
                  <span className="h-px w-12 bg-gold-500" />
                  <span className="font-heading text-[10px] text-gold-500">✦</span>
                  <span className="h-px flex-1 bg-maroon-200/80" />
                </div>
              </LineReveal>
            </LineRevealGroup>

            <motion.div
              className="mt-10 overflow-hidden rounded-2xl border border-maroon-200/60 bg-white shadow-[0_8px_40px_-12px_rgba(42,10,10,0.12)]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              {submitted ? (
                <div className="px-6 py-14 text-center sm:px-10 sm:py-16">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/50 bg-gold-50">
                    <span
                      className="font-heading text-xl text-gold-600"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold tracking-widest text-maroon-900 sm:text-xl">
                    THANK YOU FOR YOUR ENQUIRY
                  </h3>
                  <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-maroon-700">
                    We have received your request. Our export team will review the
                    details and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-2 rounded-sm border border-maroon-200 bg-white px-6 py-3 font-sans text-[11px] font-bold tracking-[0.16em] text-maroon-800 transition-colors duration-200 hover:border-maroon-400 hover:bg-cream-50"
                  >
                    SUBMIT ANOTHER ENQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <FormField
                      id="enquiry-name"
                      label="Your Name"
                      required
                      error={errors.name}
                    >
                      <input
                        id="enquiry-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={updateField("name")}
                        autoComplete="name"
                        className={`${fieldClass} ${errors.name ? fieldErrorClass : ""}`}
                      />
                    </FormField>

                    <FormField
                      id="enquiry-company"
                      label="Company Name"
                      required
                      error={errors.companyName}
                    >
                      <input
                        id="enquiry-company"
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={updateField("companyName")}
                        autoComplete="organization"
                        className={`${fieldClass} ${errors.companyName ? fieldErrorClass : ""}`}
                      />
                    </FormField>

                    <FormField
                      id="enquiry-email"
                      label="Email"
                      required
                      error={errors.email}
                    >
                      <input
                        id="enquiry-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={updateField("email")}
                        autoComplete="email"
                        className={`${fieldClass} ${errors.email ? fieldErrorClass : ""}`}
                      />
                    </FormField>

                    <FormField
                      id="enquiry-phone"
                      label="Phone / WhatsApp"
                      required
                      error={errors.phone}
                      hint="Include country code, e.g. +971 50 123 4567"
                    >
                      <input
                        id="enquiry-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={updateField("phone")}
                        autoComplete="tel"
                        placeholder="+971 50 123 4567"
                        className={`${fieldClass} ${errors.phone ? fieldErrorClass : ""}`}
                      />
                    </FormField>

                    <div className={isOtherCountry ? "sm:col-span-2" : ""}>
                      <FormField
                        id="enquiry-country"
                        label="Country"
                        required
                        error={errors.country}
                      >
                        <select
                          id="enquiry-country"
                          name="country"
                          value={form.country}
                          onChange={handleCountryChange}
                          className={`${selectClass} ${errors.country ? fieldErrorClass : ""}`}
                        >
                          <option value="" disabled>
                            Select country
                          </option>
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      {isOtherCountry && (
                        <FormField
                          id="enquiry-other-country"
                          label="Enter your country"
                          required
                          error={errors.otherCountry}
                        >
                          <input
                            id="enquiry-other-country"
                            type="text"
                            name="otherCountry"
                            value={form.otherCountry}
                            onChange={updateField("otherCountry")}
                            autoComplete="country-name"
                            placeholder="e.g. Canada, Brazil"
                            className={`${fieldClass} mt-4 ${errors.otherCountry ? fieldErrorClass : ""}`}
                          />
                        </FormField>
                      )}
                    </div>

                    <FormField
                      id="enquiry-port"
                      label="Destination Port"
                      error={errors.destinationPort}
                    >
                      <input
                        id="enquiry-port"
                        type="text"
                        name="destinationPort"
                        value={form.destinationPort}
                        onChange={updateField("destinationPort")}
                        placeholder="e.g. Jebel Ali"
                        className={fieldClass}
                      />
                    </FormField>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-sans text-xs font-semibold tracking-wide text-maroon-800">
                            Products Interested In <span className="text-maroon-500">*</span>
                          </p>
                          <p className="mt-1 font-sans text-[11px] text-maroon-500">
                            Add one or more products with quantity for each.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={addProductLine}
                          disabled={productsLoading || !!productsError}
                          className="inline-flex items-center rounded-sm border border-maroon-200 bg-white px-3 py-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-800 transition-colors duration-200 hover:border-maroon-400 hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          + ADD PRODUCT
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        {form.products.map((line, index) => {
                          const lineErrors = errors.products?.[index] || {};

                          return (
                            <div
                              key={`enquiry-product-line-${index}`}
                              className="rounded-xl border border-maroon-200/60 bg-cream-50/50 p-4"
                            >
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <p className="font-sans text-[11px] font-semibold tracking-widest text-maroon-700 uppercase">
                                  Product {index + 1}
                                </p>
                                {form.products.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeProductLine(index)}
                                    className="font-sans text-[11px] font-semibold tracking-[0.12em] text-maroon-600 uppercase transition-colors hover:text-maroon-900"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                  <FormField
                                    id={`enquiry-product-${index}`}
                                    label="Product"
                                    required
                                    error={lineErrors.productId || productsError}
                                  >
                                    <select
                                      id={`enquiry-product-${index}`}
                                      name={`productId-${index}`}
                                      value={line.productId}
                                      onChange={updateProductLine(index, "productId")}
                                      disabled={productsLoading || !!productsError}
                                      className={`${selectClass} ${lineErrors.productId || productsError ? fieldErrorClass : ""} disabled:cursor-not-allowed disabled:opacity-60`}
                                    >
                                      <option value="" disabled>
                                        {productsLoading
                                          ? "Loading products…"
                                          : "Select a product"}
                                      </option>
                                      {products.map((product) => (
                                        <option key={product._id} value={product._id}>
                                          {toBritishSpelling(product.name).toUpperCase()}
                                        </option>
                                      ))}
                                    </select>
                                  </FormField>
                                </div>

                                <FormField
                                  id={`enquiry-quantity-${index}`}
                                  label="Estimated Quantity"
                                  required
                                  error={lineErrors.estimatedQuantity}
                                  hint="kg / MT / containers"
                                >
                                  <input
                                    id={`enquiry-quantity-${index}`}
                                    type="text"
                                    name={`estimatedQuantity-${index}`}
                                    value={line.estimatedQuantity}
                                    onChange={updateProductLine(index, "estimatedQuantity")}
                                    placeholder="e.g. 500 kg, 2 MT, 1 container"
                                    className={`${fieldClass} ${lineErrors.estimatedQuantity ? fieldErrorClass : ""}`}
                                  />
                                </FormField>

                                <FormField
                                  id={`enquiry-packaging-${index}`}
                                  label="Packaging Preference"
                                >
                                  <select
                                    id={`enquiry-packaging-${index}`}
                                    name={`packagingPreference-${index}`}
                                    value={line.packagingPreference}
                                    onChange={updateProductLine(index, "packagingPreference")}
                                    className={selectClass}
                                  >
                                    <option value="">Select packaging (optional)</option>
                                    {PACKAGING_OPTIONS.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </FormField>

                                <div className="sm:col-span-2">
                                  <FormField
                                    id={`enquiry-product-note-${index}`}
                                    label="Product Note (optional)"
                                    error={lineErrors.productNote}
                                    hint="Specs, grade, certification requirements, etc. (max 500 characters)"
                                  >
                                    <textarea
                                      id={`enquiry-product-note-${index}`}
                                      name={`productNote-${index}`}
                                      rows={3}
                                      maxLength={500}
                                      value={line.productNote}
                                      onChange={updateProductLine(index, "productNote")}
                                      placeholder="e.g. Need organic certification and COA"
                                      className={`${fieldClass} resize-none ${lineErrors.productNote ? fieldErrorClass : ""}`}
                                    />
                                  </FormField>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <FormField id="enquiry-message" label="Your Message">
                        <textarea
                          id="enquiry-message"
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={updateField("message")}
                          className={`${fieldClass} resize-none`}
                        />
                      </FormField>
                    </div>
                  </div>

                  {submitError && (
                    <p
                      className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
                      role="alert"
                    >
                      {submitError}
                    </p>
                  )}

                  <div className="mt-8 flex justify-center border-t border-maroon-100 pt-8">
                    <button
                      type="submit"
                      disabled={submitting || productsLoading || !!productsError}
                      className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-sm bg-gold-500 px-10 py-3.5 font-sans text-[11px] font-bold tracking-[0.2em] text-maroon-950 transition-colors duration-200 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "SUBMITTING…" : "SUBMIT ENQUIRY"}
                      {!submitting && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          <div
            className="my-12 hidden bg-maroon-200/50 lg:block"
            aria-hidden="true"
          />

          <motion.div
            className="flex flex-col border-t border-maroon-200/40 pt-10 sm:pt-12 lg:border-t-0 lg:pt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={prefersReducedMotion ? fadeUp : stagger(0.1, 0.15)}
          >
            <div className="flex flex-col gap-8 sm:gap-10">
              {BENEFITS.map((benefit) => (
                <BenefitItem key={benefit.title} benefit={benefit} />
              ))}
            </div>

            <motion.div
              className="mt-10 flex flex-col gap-5 border-t border-maroon-200/50 pt-10 sm:mt-12 sm:pt-12"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <BrochureQR variant="compact" />
              <DownloadBrochureButton variant="enquire" className="w-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Enquire;
