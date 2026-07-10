import React from "react";

const AdminAlert = ({ variant = "error", message, onDismiss }) => {
  if (!message) return null;

  const styles =
    variant === "success"
      ? "border-gold-400/40 bg-gold-50 text-maroon-900"
      : "border-maroon-300/40 bg-maroon-50 text-maroon-800";

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-sm border px-4 py-3 font-sans text-sm ${styles}`}
    >
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 cursor-pointer font-sans text-xs font-semibold tracking-wide text-maroon-700 uppercase hover:text-maroon-900"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default AdminAlert;
