import React from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  X,
  Trash2,
  CheckCircle2,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmText = "Delete",
  type = "danger", // danger, warning, or brand
  loading = false,
  success = false,
}) => {
  if (!isOpen) return null;

  // Determine header color based on type
  const headerStyle =
    type === "danger"
      ? "bg-red-600 text-white"
      : type === "brand"
        ? "bg-app-primary2 text-white"
        : type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-orange-500 text-white";

  const buttonStyle = success
    ? "bg-green-500 hover:bg-green-600 text-white shadow-none border border-emerald-800/20"
    : type === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-100"
      : type === "brand"
        ? "bg-app-primary2 hover:bg-app-primary5 text-white shadow-sm shadow-app-primary2/10"
        : type === "success"
          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-50"
          : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-50";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not child elements
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - matching Dialog UI */}
        <div
          className={`p-5 px-6 ${headerStyle} flex items-center justify-between`}
        >
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            {type === "danger" && <Trash2 className="h-5 w-5" />}
            {type === "warning" && <AlertTriangle className="h-5 w-5" />}
            {type === "success" && <CheckCircle2 className="h-5 w-5" />}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white min-h-[100px] flex items-center">
          <p className="text-slate-600 font-medium text-[14px] leading-relaxed w-full">
            {message}
          </p>
        </div>

        {/* Actions - matching Dialog UI */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-300/60 flex items-center gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-semibold text-slate-500 border border-slate-300/60"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!loading && !success) {
                onConfirm();
              }
            }}
            disabled={loading || success}
            className={cn(
              "min-w-[120px] text-[13px] font-semibold h-9 flex items-center justify-center gap-2 transition-all duration-300",
              buttonStyle,
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in duration-300 text-white" />
                <span>Success!</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
