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

const ProductFaqsEditor = ({
  faqs,
  disabled,
  duplicateIndexes = [],
  onChange,
  onAdd,
  onRemove,
  onReorder,
}) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const duplicateSet = new Set(duplicateIndexes);

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
      <label className={`${adminLabelClass} mb-2 block`}>FAQs</label>
      <p className="mb-3 font-sans text-[11px] leading-relaxed text-maroon-500">
        Add product-specific questions and answers. Questions must be unique
        within this product — duplicates are blocked on save.
      </p>

      {faqs.length === 0 && (
        <p className="mb-3 rounded-lg border border-dashed border-maroon-200 bg-cream-50/60 px-3 py-4 font-sans text-xs text-maroon-600">
          No FAQs yet. Add the first question below.
        </p>
      )}

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isDragging = dragIndex === index;
          const isDragOver = dragOverIndex === index && dragIndex !== index;
          const isDuplicate = duplicateSet.has(index);

          return (
            <div
              key={faq.id}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={resetDragState}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={() => handleDrop(index)}
              className={`rounded-lg border bg-white p-3 transition-all ${
                isDragging
                  ? "border-maroon-400 opacity-50"
                  : isDragOver
                    ? "border-gold-400 bg-gold-50/40"
                    : isDuplicate
                      ? "border-red-300 bg-red-50/40"
                      : "border-maroon-100"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={`Reorder FAQ ${index + 1}`}
                    className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-sm text-maroon-500 transition-colors hover:bg-cream-100 hover:text-maroon-800 active:cursor-grabbing"
                  >
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      size={16}
                      color="currentColor"
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
                    FAQ {index + 1}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={disabled}
                  className={`${adminDangerButtonClass} shrink-0 px-2.5`}
                  aria-label="Remove FAQ"
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={1.75}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  value={faq.question}
                  onChange={(event) =>
                    onChange(index, "question", event.target.value)
                  }
                  placeholder="Question"
                  rows={2}
                  disabled={disabled}
                  className={`${adminFieldClass} min-h-[64px] resize-y`}
                />
                <textarea
                  value={faq.answer}
                  onChange={(event) =>
                    onChange(index, "answer", event.target.value)
                  }
                  placeholder="Answer"
                  rows={3}
                  disabled={disabled}
                  className={`${adminFieldClass} min-h-[88px] resize-y`}
                />
              </div>

              {isDuplicate && (
                <p className="mt-2 font-sans text-[11px] text-red-700">
                  This question already exists on this product.
                </p>
              )}
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
        Add FAQ
      </button>
    </div>
  );
};

export default ProductFaqsEditor;
