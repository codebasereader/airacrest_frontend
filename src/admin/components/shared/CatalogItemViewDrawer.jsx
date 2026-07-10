import React from "react";
import { getImageUrl } from "../../utils/catalogImage";
import { toBritishSpelling } from "../../../utils/britishSpelling";
import AdminDrawer from "./AdminDrawer";
import AdminStatusBadge from "./AdminStatusBadge";

const DetailRow = ({ label, children }) => (
  <div className="border-b border-maroon-100/80 py-3 last:border-b-0">
    <dt className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
      {label}
    </dt>
    <dd className="mt-1 font-sans text-sm text-maroon-900">{children}</dd>
  </div>
);

const CatalogItemViewDrawer = ({
  open,
  onClose,
  item,
  type = "category",
  parentCategoryName,
}) => {
  if (!item) return null;

  const imageUrl = getImageUrl(item.image);
  const itemName = toBritishSpelling(item.name);
  const itemDescription = toBritishSpelling(item.description);
  const typeLabel = type === "subcategory" ? "Subcategory" : "Category";

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={itemName}
      description={`View ${typeLabel.toLowerCase()} details`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <AdminStatusBadge isActive={item.isActive} />
          <span className="font-sans text-xs text-maroon-600">
            {item.isActive ? "Visible on storefront" : "Hidden from storefront"}
          </span>
        </div>

        {imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-maroon-100">
            <img
              src={imageUrl}
              alt={itemName}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-maroon-100 bg-cream-100">
            <span className="font-heading text-3xl text-maroon-300">
              {item.name?.charAt(0) || "?"}
            </span>
          </div>
        )}

        <dl className="rounded-xl border border-maroon-100 bg-white px-4">
          <DetailRow label="Name">{itemName}</DetailRow>
          {type === "subcategory" && parentCategoryName && (
            <DetailRow label="Parent category">
              {toBritishSpelling(parentCategoryName)}
            </DetailRow>
          )}
          {item.description && (
            <DetailRow label="Description">{itemDescription}</DetailRow>
          )}
          <DetailRow label="Sort order">{item.sortOrder ?? 0}</DetailRow>
          {item.slug && <DetailRow label="Slug">{item.slug}</DetailRow>}
        </dl>
      </div>
    </AdminDrawer>
  );
};

export default CatalogItemViewDrawer;
