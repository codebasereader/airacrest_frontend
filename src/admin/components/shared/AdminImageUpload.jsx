import React, { useId, useRef } from "react";
import { adminLabelClass } from "../../constants/formStyles";

const AdminImageUpload = ({
  label = "Image",
  previewUrl,
  uploading,
  error,
  disabled,
  onFileSelect,
  onClear,
}) => {
  const inputId = useId();
  const inputRef = useRef(null);

  return (
    <div>
      <label htmlFor={inputId} className={adminLabelClass}>
        {label}
      </label>

      <div className="mt-1 rounded-xl border border-dashed border-maroon-200/80 bg-white p-4">
        {previewUrl ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-maroon-100 bg-cream-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-40 w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer font-sans text-xs font-semibold tracking-wide text-maroon-800 uppercase hover:text-maroon-950 disabled:opacity-50"
              >
                Replace image
              </button>
              {onClear && (
                <button
                  type="button"
                  disabled={disabled || uploading}
                  onClick={onClear}
                  className="cursor-pointer font-sans text-xs font-semibold tracking-wide text-maroon-500 uppercase hover:text-maroon-800 disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-cream-50/80 px-4 py-8 text-center transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="font-sans text-sm font-medium text-maroon-800">
              {uploading ? "Uploading..." : "Click to upload image"}
            </span>
            <span className="font-sans text-xs text-maroon-500">
              JPG, PNG or WebP
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileSelect(file);
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

export default AdminImageUpload;
