import React, { useEffect, useMemo, useState } from "react";
import { UploadCloud, Eye, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IMAGE_BASE_URL } from "@/services/api-endpoints/base.url";
import SafeImage from "@/components/common/SafeImage";

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return null;
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Variant definitions
// "icon"   → 1:1 Square  (small thumbnails, circles on mobile)
// "banner" → ~2:1 Landscape (wide category/post banners)
// "card"   → ~3:2 Landscape (program grid cover cards)

const VARIANT_CONFIG = {
  icon: {
    badge: "Square 1:1",
    defaultHint: "Recommended: Square (1:1), 150×150 px to 256×256 px. PNG, SVG or WebP (max 5MB).",
    previewBox: "w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center p-3",
    innerBox: "max-w-[150px] max-h-[150px]",
    emptyBox: "max-w-xs",
    imgClass: "max-w-full max-h-full w-auto h-auto object-contain drop-shadow-xs",
    fallback: "w-28 h-28 rounded-lg bg-slate-100",
    checkerboard: true,
  },
  banner: {
    badge: "Banner ~2:1",
    defaultHint: "Recommended: Landscape banner (~2:1 ratio), 800×400 px or 1024×512 px. JPG, PNG or WebP (max 5MB).",
    previewBox: "w-full max-w-md min-h-[160px] max-h-[220px] flex items-center justify-center p-2.5",
    innerBox: "max-w-full max-h-[200px]",
    emptyBox: "w-full",
    imgClass: "max-w-full max-h-[200px] w-auto h-auto object-contain rounded-lg shadow-xs",
    fallback: "w-full h-36 rounded-lg bg-slate-100",
    checkerboard: false,
  },
  card: {
    badge: "Card ~3:2",
    defaultHint: "Recommended: Grid cover card (~3:2 aspect ratio), 400×280 px or 600×400 px. JPG, PNG or WebP (max 5MB).",
    previewBox: "w-full max-w-xs min-h-[140px] max-h-[200px] flex items-center justify-center p-2.5",
    innerBox: "max-w-full max-h-[180px]",
    emptyBox: "w-full",
    imgClass: "max-w-full max-h-[180px] w-auto h-auto object-contain rounded-lg shadow-xs",
    fallback: "w-full h-32 rounded-lg bg-slate-100",
    checkerboard: false,
  },
};

const ImageUploadPreview = ({
  file,
  previewUrl,
  onFileSelect,
  onRemove,
  label = "Upload Image",
  hint,
  id = "image-upload",
  error,
  variant, // "icon" | "banner" | "card"
  aspectRatioBadge,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState(null);

  // Resolve effective variant
  const resolvedVariant = (() => {
    if (variant === "icon" || variant === "banner" || variant === "card") return variant;
    // Auto-detect from label when variant not explicitly provided
    if (/icon|thumbnail|thumb|circle/i.test(label)) return "icon";
    if (/card|grid|cover/i.test(label)) return "card";
    return "banner";
  })();

  const cfg = VARIANT_CONFIG[resolvedVariant];
  const isIcon = resolvedVariant === "icon";
  const effectiveHint = hint || cfg.defaultHint;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect({ target: { files: [droppedFile] } });
    }
  };

  const localPreviewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(
    () => () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    },
    [localPreviewUrl],
  );

  const currentIconUrl = localPreviewUrl || (previewUrl?.startsWith("http")
    ? previewUrl
    : previewUrl
      ? `${IMAGE_BASE_URL}/${previewUrl.replace(/^\//, "")}`
      : null);

  const fileSizeLabel = file?.size ? formatBytes(file.size) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs 3xl:text-sm font-bold text-slate-800 flex items-center gap-1.5"
        >
          {label}
        </label>
        <span className="text-[10px] font-medium text-slate-400">
          {aspectRatioBadge || cfg.badge}
        </span>
      </div>

      <input
        id={id}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
      />

      {previewUrl || file ? (
        <div
          className={`relative rounded-xl border border-slate-200/90 overflow-hidden group bg-slate-50/80 transition-all ${cfg.previewBox}`}
        >
          {/* Checkerboard subtle pattern background for transparent icons */}
          {cfg.checkerboard && (
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            />
          )}

          <div
            className={`flex items-center justify-center w-full h-full relative ${cfg.innerBox}`}
          >
            <SafeImage
              src={currentIconUrl}
              alt={label || "Preview"}
              className={cfg.imgClass}
              fallbackClassName={cfg.fallback}
              onLoad={(event) =>
                setImageDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
            />
          </div>

          {/* Action buttons overlay (Hover on desktop, accessible on mobile) */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-[1px]">
            <button
              type="button"
              title="View full image"
              aria-label="View image"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="bg-white/95 text-slate-700 rounded-full p-2 hover:bg-white hover:text-slate-900 shadow-md transition-all hover:scale-110"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Replace image"
              aria-label="Replace image"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(id)?.click();
              }}
              className="bg-white/95 text-app-primary2 rounded-full p-2 hover:bg-white hover:text-app-primary3 shadow-md transition-all hover:scale-110"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Remove image"
              aria-label="Remove image"
              onClick={(e) => {
                e.stopPropagation();
                setImageDimensions(null);
                onRemove();
              }}
              className="bg-white/95 text-red-500 rounded-full p-2 hover:bg-white hover:text-red-600 shadow-md transition-all hover:scale-110"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Live Dimension and Size Badge */}
          {imageDimensions && (
            <div className="absolute bottom-1.5 right-2 rounded-md bg-slate-950/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white tracking-tight pointer-events-none shadow-xs">
              {imageDimensions.width} × {imageDimensions.height}px
              {fileSizeLabel && ` • ${fileSizeLabel}`}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-7 sm:p-9 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-app-primary2 bg-blue-50/70"
              : "border-slate-300/70 hover:border-app-primary2/70 bg-slate-50/60 hover:bg-slate-50"
          } ${cfg.emptyBox}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(id)?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-app-primary2/10 flex items-center justify-center mb-3">
            {isIcon ? (
              <ImageIcon className="w-6 h-6 text-app-primary2" />
            ) : (
              <UploadCloud className="w-6 h-6 text-app-primary2" />
            )}
          </div>
          <p className="text-[13px] font-semibold text-slate-800 text-center">
            Click or drag and drop to upload
          </p>
          <p className="text-[11px] text-slate-500 text-center mt-1 max-w-xs leading-relaxed">
            {effectiveHint}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-[10px] 3xl:text-[11px] font-medium mt-1">
          {error}
        </p>
      )}

      {/* Preview Full Image Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 rounded-2xl">
          <DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-bold text-slate-900">
              {label || "Image Preview"}
            </DialogTitle>
          </DialogHeader>
          {currentIconUrl && (
            <div className="p-6 bg-slate-900/5 flex items-center justify-center min-h-[260px] max-h-[70vh] overflow-auto">
              <SafeImage
                src={currentIconUrl}
                alt="Full Preview"
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
                fallbackClassName="h-64 w-full"
              />
            </div>
          )}
          {imageDimensions && (
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Dimensions:{" "}
                <strong className="text-slate-800">
                  {imageDimensions.width} × {imageDimensions.height} px
                </strong>
              </span>
              {fileSizeLabel && (
                <span>
                  File Size:{" "}
                  <strong className="text-slate-800">{fileSizeLabel}</strong>
                </span>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploadPreview;
