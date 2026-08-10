import React from "react";
import { normalizeImages } from "../../utils/catalogImage";
import { toBritishSpelling } from "../../../utils/britishSpelling";
import AdminDrawer from "../shared/AdminDrawer";
import AdminStatusBadge from "../shared/AdminStatusBadge";

const DetailRow = ({ label, children }) => (
  <div className="border-b border-maroon-100/80 py-3 last:border-b-0">
    <dt className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
      {label}
    </dt>
    <dd className="mt-1 font-sans text-sm text-maroon-900">{children}</dd>
  </div>
);

const ProductViewDrawer = ({
  open,
  onClose,
  product,
  categoryName,
  subcategoryName,
}) => {
  if (!product) return null;

  const productName = toBritishSpelling(product.name);
  const productDescription = toBritishSpelling(product.description);
  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : product.highlights
      ? [product.highlights]
      : [];
  const images = normalizeImages(product.images);
  const specifications = (product.specifications || []).filter(
    (spec) => spec?.label && spec?.value,
  );
  const faqs = (product.faqs || []).filter(
    (faq) => faq?.question?.trim() && faq?.answer?.trim(),
  );

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      size="lg"
      title={productName}
      description="View product details"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <AdminStatusBadge isActive={product.isActive} />
          {product.isFeatured && (
            <span className="inline-flex rounded-full bg-gold-400/90 px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide text-maroon-950 uppercase">
              Featured
            </span>
          )}
          <span className="font-sans text-xs text-maroon-600">
            {product.isActive ? "Visible on storefront" : "Hidden from storefront"}
          </span>
        </div>

        {images.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={image.key || image.url || index}
                className="overflow-hidden rounded-xl border border-maroon-100"
              >
                <img
                  src={image.url}
                  alt={`${productName} ${index + 1}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-maroon-100 bg-cream-100">
            <span className="font-heading text-3xl text-maroon-300">
              {product.name?.charAt(0) || "?"}
            </span>
          </div>
        )}

        <dl className="rounded-xl border border-maroon-100 bg-white px-4">
          <DetailRow label="Name">{productName}</DetailRow>
          {(categoryName || subcategoryName) && (
            <DetailRow label="Catalogue">
              {[categoryName, subcategoryName].filter(Boolean).join(" · ")}
            </DetailRow>
          )}
          {product.description && (
            <DetailRow label="Description">{productDescription}</DetailRow>
          )}
          {product.note && (
            <DetailRow label="Note">{toBritishSpelling(product.note)}</DetailRow>
          )}
          <DetailRow label="Sort order">{product.sortOrder ?? 0}</DetailRow>
          {product.slug && <DetailRow label="Slug">{product.slug}</DetailRow>}
        </dl>

        {highlights.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
              Highlights
            </h3>
            <ul className="mt-2 space-y-1.5">
              {highlights.map((highlight, index) => (
                <li
                  key={`${highlight}-${index}`}
                  className="rounded-lg border border-maroon-100 bg-cream-50/60 px-3 py-2 font-sans text-sm text-maroon-800"
                >
                  {toBritishSpelling(highlight)}
                </li>
              ))}
            </ul>
          </div>
        )}

          {specifications.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
              Specifications
            </h3>
            <dl className="mt-2 rounded-xl border border-maroon-100 bg-white px-4">
              {specifications.map((spec, index) => (
                <DetailRow key={`${spec.label}-${index}`} label={spec.label}>
                  {toBritishSpelling(spec.value)}
                </DetailRow>
              ))}
            </dl>
          </div>
        )}

        {faqs.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
              FAQs ({faqs.length})
            </h3>
            <div className="mt-2 space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id || faq.id || `${faq.question}-${index}`}
                  className="rounded-xl border border-maroon-100 bg-white px-4 py-3"
                >
                  <p className="font-sans text-sm font-semibold text-maroon-900">
                    {toBritishSpelling(faq.question)}
                  </p>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-maroon-700">
                    {toBritishSpelling(faq.answer)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminDrawer>
  );
};

export default ProductViewDrawer;
