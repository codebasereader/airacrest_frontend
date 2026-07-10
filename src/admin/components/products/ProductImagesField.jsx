import React, { useId, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { adminLabelClass } from "../../constants/formStyles";

const ProductImagesField = ({
  images,
  uploading,
  error,
  disabled,
  onFileSelect,
  onRemove,
}) => {
  const inputId = useId();
  const inputRef = useRef(null);

  return (
    <div>
      <label htmlFor={inputId} className={adminLabelClass}>
        Product Images
      </label>

      <div className="mt-1 space-y-3 rounded-xl border border-dashed border-maroon-200/80 bg-white p-4">
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={image.key || image.url || index}
                className="group relative overflow-hidden rounded-lg border border-maroon-100"
              >
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={disabled || uploading}
                  className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-maroon-900/75 text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-cream-50/80 px-4 py-6 text-center transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="font-sans text-sm font-medium text-maroon-800">
            {uploading ? "Uploading..." : "Click to upload images"}
          </span>
          <span className="font-sans text-xs text-maroon-500">
            JPG, PNG or WebP · multiple allowed
          </span>
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0) onFileSelect(files);
            event.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mt-2 font-sans text-xs text-maroon-700">{error}</p>
      )}
    </div>
  );
};

export default ProductImagesField;
