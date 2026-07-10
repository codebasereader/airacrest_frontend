import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Edit02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { getImageUrl } from "../../utils/catalogImage";
import AdminStatusBadge from "./AdminStatusBadge";
import { toBritishSpelling } from "../../../utils/britishSpelling";

const CatalogItemCard = ({
  item,
  subtitle,
  saving,
  onView,
  onEdit,
  onDelete,
}) => {
  const imageUrl = getImageUrl(item.image);
  const itemName = toBritishSpelling(item.name);
  const itemDescription = toBritishSpelling(item.description);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-maroon-200/50 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] bg-cream-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-cream-100 to-cream-200">
            <span className="font-heading text-2xl text-maroon-300">
              {item.name?.charAt(0) || "?"}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <AdminStatusBadge isActive={item.isActive} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-sans text-sm font-semibold text-maroon-900">
          {itemName}
        </h3>
        {subtitle && (
          <p className="mt-1 font-sans text-[11px] font-medium tracking-wide text-gold-700 uppercase">
            {toBritishSpelling(subtitle)}
          </p>
        )}
        {item.description && (
          <p className="mt-2 line-clamp-2 flex-1 font-sans text-xs leading-relaxed text-maroon-600">
            {itemDescription}
          </p>
        )}
        <p className="mt-3 font-sans text-[10px] tracking-wide text-maroon-500 uppercase">
          Order {item.sortOrder ?? 0}
          {item.slug ? ` · ${item.slug}` : ""}
        </p>

        <div className="mt-4 flex items-center gap-1.5 border-t border-maroon-100 pt-4">
          <button
            type="button"
            onClick={() => onView(item)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-700 uppercase transition-colors hover:border-maroon-400 hover:bg-maroon-50 disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={ViewIcon}
              size={13}
              color="currentColor"
              strokeWidth={1.75}
            />
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 bg-cream-50 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-800 uppercase transition-colors hover:border-maroon-400 hover:bg-white disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.75}
            />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={saving}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border border-maroon-200/70 px-2 py-2 font-sans text-[9px] font-semibold tracking-[0.08em] text-maroon-600 uppercase transition-colors hover:border-maroon-400 hover:bg-maroon-50 hover:text-maroon-900 disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.75}
            />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default CatalogItemCard;
