// import React, { useRef } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export const RichTextEditor = ({
//   value,
//   onChange,
//   placeholder = "Start typing your content...",
//   height = 500,
//   disabled = false,
//   readOnly = false,
//   error = null,
//   label = null,
// }) => {
//   const editorRef = useRef(null);

//   return (
//     <div className="w-full flex flex-col">
//       {label && (
//         <label className="text-sm font-semibold text-slate-700 mb-2">
//           {label}
//         </label>
//       )}
//       <div
//         className={`rounded-lg overflow-hidden ${
//           error ? "border-red-500" : ""
//         } shadow-sm transition-all`}
//       >
//         <Editor
//           tinymceScriptSrc="/tinymce/tinymce.min.js"
//           licenseKey="gpl"
//           onInit={(_evt, editor) => (editorRef.current = editor)}
//           value={value}
//           disabled={disabled || readOnly}
//           onEditorChange={onChange}
//           init={{
//             height,
//             menubar: true,
//             placeholder,
//             plugins: [
//               "advlist",
//               "autolink",
//               "lists",
//               "link",
//               "image",
//               "charmap",
//               "preview",
//               "anchor",
//               "searchreplace",
//               "visualblocks",
//               "code",
//               "fullscreen",
//               "insertdatetime",
//               "media",
//               "table",
//               "code",
//               "wordcount",
//               "codesample",
//               "emoticons",
//               "quickbars",
//               "visualchars",
//               "autoresize",
//             ],
//             toolbar:
//               "undo redo | blocks fontfamily fontsize | " +
//               "bold italic underline strikethrough superscript subscript | " +
//               "alignleft aligncenter alignright alignjustify | " +
//               "bullist numlist checklist outdent indent | " +
//               "link image media table hr codesample | " +
//               "forecolor backcolor removeformat | charmap emoticons | " +
//               "fullscreen preview code",
//             content_style: `
//               body { 
//                 font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
//                 font-size: 14px; 
//                 color: #334155; 
//                 line-height: 1.6; 
//               }
//               body[data-mce-placeholder]:before {
//                 color: #94a3b8;
//               }
//             `,
//             branding: false,
//             help_accessibility: false,
//             skin: "oxide", // Light mode skin
//             promotion: false, // Removes the upgrade prompt in free version
//             quickbars_selection_toolbar:
//               "bold italic underline | h2 h3 blockquote | quicklink quickimage quicktable",
//             image_title: true,
//             automatic_uploads: true,
//             file_picker_types: "image",
//             // Default image upload handler to base64 (since no upload endpoint is specified)
//             file_picker_callback: (cb, value, meta) => {
//               const input = document.createElement("input");
//               input.setAttribute("type", "file");
//               input.setAttribute("accept", "image/*");

//               input.addEventListener("change", (e) => {
//                 const file = e.target.files[0];
//                 const reader = new FileReader();
//                 reader.addEventListener("load", () => {
//                   // Returns the base64 encoded string to the editor
//                   cb(reader.result, { title: file.name });
//                 });
//                 reader.readAsDataURL(file);
//               });

//               input.click();
//             },
//           }}
//         />
//       </div>
//       {error && (
//         <span className="text-xs text-red-500 mt-1.5 font-medium">{error}</span>
//       )}
//     </div>
//   );
// };


import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

// Shimmer skeleton that matches the editor layout while TinyMCE initializes
const EditorSkeleton = ({ height }) => (
  <div
    style={{ height: height || 500 }}
    className="rounded-lg border border-slate-200 bg-white overflow-hidden animate-pulse"
  >
    {/* Fake menubar */}
    <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 bg-slate-50">
      <div className="h-3 w-10 rounded bg-slate-200" />
      <div className="h-3 w-8 rounded bg-slate-200" />
      <div className="h-3 w-12 rounded bg-slate-200" />
      <div className="h-3 w-10 rounded bg-slate-200" />
      <div className="h-3 w-8 rounded bg-slate-200" />
    </div>
    {/* Fake toolbar */}
    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50 flex-wrap">
      <div className="h-6 w-6 rounded bg-slate-200" />
      <div className="h-6 w-6 rounded bg-slate-200" />
      <div className="h-6 w-px bg-slate-200 mx-1" />
      <div className="h-6 w-20 rounded bg-slate-200" />
      <div className="h-6 w-20 rounded bg-slate-200" />
      <div className="h-6 w-14 rounded bg-slate-200" />
      <div className="h-6 w-px bg-slate-200 mx-1" />
      <div className="h-6 w-6 rounded bg-slate-200" />
      <div className="h-6 w-6 rounded bg-slate-200" />
      <div className="h-6 w-6 rounded bg-slate-200" />
      <div className="h-6 w-6 rounded bg-slate-200" />
    </div>
    {/* Fake content area */}
    <div className="p-4 space-y-3">
      <div className="h-3 w-3/4 rounded bg-slate-100" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-5/6 rounded bg-slate-100" />
      <div className="h-3 w-2/3 rounded bg-slate-100" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-1/2 rounded bg-slate-100" />
    </div>
  </div>
);

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
  const [editorReady, setEditorReady] = useState(false);

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
      )}

      {/* Skeleton shown immediately while editor script & iframe load */}
      {!editorReady && <EditorSkeleton height={height} />}

      {/* Real editor container - hidden until onInit fires, then smooth fade-in */}
      <div
        className={`rounded-lg overflow-hidden ${error ? "border-red-500" : ""
          } shadow-sm`}
        style={{
          opacity: editorReady ? 1 : 0,
          height: editorReady ? "auto" : 0,
          overflow: editorReady ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_evt, editor) => {
            editorRef.current = editor;
            setEditorReady(true);
          }}
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
            skin: "oxide",
            promotion: false,
            quickbars_selection_toolbar:
              "bold italic underline | h2 h3 blockquote | quicklink quickimage quicktable",
            image_title: true,
            automatic_uploads: true,
            file_picker_types: "image",
            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.addEventListener("change", (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", () => {
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
