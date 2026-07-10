import React, { useCallback, useEffect, useRef, useState } from "react";
import { adminLabelClass } from "../../constants/formStyles";
import { useImageUpload } from "../../hooks/useImageUpload";

const TOOLBAR_BUTTONS = [
  { command: "bold", label: "B", title: "Bold", className: "font-bold" },
  { command: "italic", label: "I", title: "Italic", className: "italic" },
  { command: "underline", label: "U", title: "Underline", className: "underline" },
  { command: "formatBlock", value: "h2", label: "H2", title: "Heading 2" },
  { command: "formatBlock", value: "h3", label: "H3", title: "Heading 3" },
  { command: "insertUnorderedList", label: "•", title: "Bullet list" },
  { command: "insertOrderedList", label: "1.", title: "Numbered list" },
  { command: "createLink", label: "Link", title: "Insert link" },
];

const ToolbarButton = ({ onClick, label, title, className = "", active }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(event) => {
      event.preventDefault();
      onClick();
    }}
    className={`inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-sm border px-2 font-sans text-xs transition-colors ${
      active
        ? "border-maroon-600 bg-maroon-800 text-cream-50"
        : "border-maroon-200/70 bg-white text-maroon-800 hover:border-maroon-400 hover:bg-cream-50"
    } ${className}`}
  >
    {label}
  </button>
);

const BlogRichTextEditor = ({ value, onChange, disabled, label = "Content" }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const { uploadFile, uploading, error: uploadError } = useImageUpload("blogs");
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const syncContent = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const execCommand = (command, commandValue) => {
    if (disabled) return;
    editorRef.current?.focus();

    if (command === "createLink") {
      const url = window.prompt("Enter URL:");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    } else if (command === "formatBlock" && commandValue) {
      document.execCommand(command, false, `<${commandValue}>`);
    } else {
      document.execCommand(command, false, commandValue);
    }

    syncContent();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    setActiveFormats(formats);
  };

  const handleImageInsert = async (file) => {
    if (!file || disabled) return;

    try {
      const key = await uploadFile(file);
      if (!key) return;

      editorRef.current?.focus();
      const imgHtml = `<img src="${URL.createObjectURL(file)}" alt="" data-key="${key}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`;
      document.execCommand("insertHTML", false, imgHtml);
      syncContent();
    } catch {
      // Error surfaced via uploadError
    }
  };

  return (
    <div>
      <label className={adminLabelClass}>{label}</label>

      <div className="mt-1 overflow-hidden rounded-xl border border-maroon-200/70 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-maroon-100 bg-cream-50/80 p-2">
          {TOOLBAR_BUTTONS.map((btn) => (
            <ToolbarButton
              key={`${btn.command}-${btn.value || btn.label}`}
              label={btn.label}
              title={btn.title}
              className={btn.className}
              active={activeFormats.has(btn.command)}
              onClick={() => execCommand(btn.command, btn.value)}
            />
          ))}
          <ToolbarButton
            label={uploading ? "…" : "Img"}
            title="Insert image"
            onClick={() => imageInputRef.current?.click()}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleImageInsert(file);
              event.target.value = "";
            }}
          />
        </div>

        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={syncContent}
          onBlur={syncContent}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="min-h-[280px] max-h-[480px] overflow-y-auto px-4 py-4 font-sans text-sm leading-relaxed text-maroon-900 outline-none [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-maroon-900 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-maroon-900 [&_img]:my-3 [&_img]:rounded-lg [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_a]:text-maroon-700 [&_a]:underline"
          data-placeholder="Start writing your article…"
        />
      </div>

      {(uploadError) && (
        <p className="mt-2 font-sans text-xs text-maroon-700">{uploadError}</p>
      )}

      <p className="mt-1.5 font-sans text-[10px] text-maroon-500">
        Use the toolbar for formatting. Images are uploaded to your media library.
      </p>
    </div>
  );
};

export default BlogRichTextEditor;
