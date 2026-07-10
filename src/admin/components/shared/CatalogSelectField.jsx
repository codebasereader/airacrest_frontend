import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import {
  adminFieldClass,
  adminLabelClass,
} from "../../constants/formStyles";

const CatalogSelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  onAdd,
  addLabel = "Add",
  addDisabled = false,
}) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-3">
      <label htmlFor={id} className={adminLabelClass}>
        {label}
        {required && <span className="text-maroon-500"> *</span>}
      </label>
      <button
        type="button"
        onClick={onAdd}
        disabled={addDisabled || disabled}
        className="inline-flex cursor-pointer items-center gap-1 font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-800 uppercase transition-colors hover:text-maroon-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <HugeiconsIcon
          icon={Add01Icon}
          size={14}
          color="currentColor"
          strokeWidth={1.75}
        />
        {addLabel}
      </button>
    </div>

    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={adminFieldClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default CatalogSelectField;
