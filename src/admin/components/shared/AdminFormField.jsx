import React from "react";
import {
  adminFieldClass,
  adminLabelClass,
} from "../../constants/formStyles";

const AdminFormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
  as = "input",
  options = [],
}) => (
  <div>
    <label htmlFor={id} className={adminLabelClass}>
      {label}
      {required && <span className="text-maroon-500"> *</span>}
    </label>
    {as === "select" ? (
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
    ) : as === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={3}
        className={`${adminFieldClass} resize-y`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        className={adminFieldClass}
      />
    )}
  </div>
);

export default AdminFormField;
