import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing your content...",
  height = 500,
  disabled = false,
  readOnly = false,
  error = null,
  label = null,
}) => {
  const editorRef = useRef(null);

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div
        className={`rounded-lg overflow-hidden ${
          error ? "border-red-500" : ""
        } shadow-sm transition-all`}
      >
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          value={value}
          disabled={disabled || readOnly}
          onEditorChange={onChange}
          init={{
            height,
            menubar: true,
            placeholder,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "wordcount",
              "codesample",
              "emoticons",
              "quickbars",
              "visualchars",
              "autoresize",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | " +
              "bold italic underline strikethrough superscript subscript | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist checklist outdent indent | " +
              "link image media table hr codesample | " +
              "forecolor backcolor removeformat | charmap emoticons | " +
              "fullscreen preview code",
            content_style: `
              body { 
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                font-size: 14px; 
                color: #334155; 
                line-height: 1.6; 
              }
              body[data-mce-placeholder]:before {
                color: #94a3b8;
              }
            `,
            branding: false,
            help_accessibility: false,
            skin: "oxide", // Light mode skin
            promotion: false, // Removes the upgrade prompt in free version
            quickbars_selection_toolbar:
              "bold italic underline | h2 h3 blockquote | quicklink quickimage quicktable",
            image_title: true,
            automatic_uploads: true,
            file_picker_types: "image",
            // Default image upload handler to base64 (since no upload endpoint is specified)
            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.addEventListener("change", (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  // Returns the base64 encoded string to the editor
                  cb(reader.result, { title: file.name });
                });
                reader.readAsDataURL(file);
              });

              input.click();
            },
          }}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1.5 font-medium">{error}</span>
      )}
    </div>
  );
};
