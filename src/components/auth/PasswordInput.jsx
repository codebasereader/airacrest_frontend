import React, { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

const inputClass =
  "w-full rounded-sm border border-maroon-200/70 bg-cream-50/80 px-4 py-3.5 pr-12 font-sans text-sm text-maroon-900 placeholder:text-maroon-400/60 transition-colors duration-200 focus:border-maroon-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-600/10 disabled:cursor-not-allowed disabled:opacity-60";

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  disabled = false,
  required = true,
}) => {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block font-sans text-xs font-semibold tracking-[0.12em] text-maroon-800 uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-maroon-500 transition-colors hover:text-maroon-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <HugeiconsIcon
            icon={visible ? ViewOffIcon : ViewIcon}
            size={18}
            color="currentColor"
            strokeWidth={1.75}
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
