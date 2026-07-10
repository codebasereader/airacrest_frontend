import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons";
import {
  adminDangerButtonClass,
  adminFieldClass,
  adminLabelClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";

const ProductSpecificationsEditor = ({
  specifications,
  disabled,
  onChange,
  onAdd,
  onRemove,
  onReorder,
}) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    if (disabled) return;
    setDragIndex(index);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    if (disabled || dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) {
      resetDragState();
      return;
    }

    onReorder(dragIndex, index);
    resetDragState();
  };

  const resetDragState = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div>
      <label className={`${adminLabelClass} mb-2 block`}>Specifications</label>
      <p className="mb-3 font-sans text-[11px] leading-relaxed text-maroon-500">
        Default export labels are prefilled. Fill values, drag to reorder, or
        delete rows that do not apply.
      </p>

      <div className="space-y-2">
        {specifications.map((spec, index) => {
          const isDragging = dragIndex === index;
          const isDragOver = dragOverIndex === index && dragIndex !== index;

          return (
            <div
              key={spec.id}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={resetDragState}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={() => handleDrop(index)}
              className={`flex items-start gap-2 rounded-lg border bg-white p-2 transition-all ${
                isDragging
                  ? "border-maroon-400 opacity-50"
                  : isDragOver
                    ? "border-gold-400 bg-gold-50/40"
                    : "border-maroon-100"
              }`}
            >
              <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={`Reorder ${spec.label || "specification"}`}
                className="mt-2 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-sm text-maroon-500 transition-colors hover:bg-cream-100 hover:text-maroon-800 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HugeiconsIcon
                  icon={DragDropVerticalIcon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.75}
                />
              </div>

              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(event) =>
                    onChange(index, "label", event.target.value)
                  }
                  placeholder="Label"
                  disabled={disabled}
                  className={adminFieldClass}
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(event) =>
                    onChange(index, "value", event.target.value)
                  }
                  placeholder="Value"
                  disabled={disabled}
                  className={adminFieldClass}
                />
              </div>

              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className={`${adminDangerButtonClass} mt-2 shrink-0 px-2.5`}
                aria-label="Remove specification"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={14}
                  color="currentColor"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={`${adminSecondaryButtonClass} mt-3 w-full gap-1.5`}
      >
        <HugeiconsIcon
          icon={Add01Icon}
          size={14}
          color="currentColor"
          strokeWidth={1.75}
        />
        Add row
      </button>
    </div>
  );
};

export default ProductSpecificationsEditor;
