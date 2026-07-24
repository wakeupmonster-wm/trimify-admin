import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ExportLoadingModal = ({ exportLoading, exportProgress, setExportLoading, setExportProgress }) => {
  return (
    <AnimatePresence>
      {(exportLoading || exportProgress > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <style>
            {`
              @keyframes shimmer-progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}
          </style>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-80 relative group">
            {/* Close Button */}
            <button
              onClick={() => {
                setExportLoading(false);
                setExportProgress(0);
              }}
              className="absolute -top-2 -right-1 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-all z-[101] text-slate-400 hover:text-slate-600 hover:scale-110 active:scale-95"
            >
              <X size={14} strokeWidth={2} />
            </button>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-500",
                    exportProgress === 100
                      ? "bg-emerald-50 border-emerald-100 shadow-emerald-100/50"
                      : "bg-app-primary2/10 border-app-primary2/20",
                  )}
                >
                  {exportProgress === 100 ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <Loader2 className="animate-spin h-5 w-5 text-app-primary2" />
                  )}
                </div>
                <div>
                  <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight">
                    {exportProgress === 100
                      ? "Export Ready"
                      : "Exporting Data"}
                  </h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    {exportProgress === 100
                      ? "File Downloaded"
                      : "Generating CSV"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "px-3 py-1.5 rounded-xl border transition-colors duration-500",
                  exportProgress === 100
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-app-primary2/10 border-app-primary2/20 text-app-primary2",
                )}
              >
                <span className="font-mono text-base font-bold tracking-tighter">
                  {exportProgress}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 120,
                  }}
                  className={cn(
                    "h-full relative rounded-full transition-colors duration-500",
                    exportProgress === 100
                      ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-app-primary2 shadow-[0_0_10px_rgba(0,127,192,0.3)]",
                  )}
                >
                  {/* Active Shimmer Effect */}
                  {exportProgress < 100 && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      style={{
                        width: "100px",
                        animation: "shimmer-progress 2s infinite linear",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              <div className="flex items-center justify-between text-[11px] px-1">
                <div className="flex items-center gap-1.5">
                  {exportProgress < 100 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-app-primary2 animate-pulse" />
                  )}
                  <span className="text-slate-600 font-semibold tracking-tight">
                    {exportProgress === 100
                      ? "Export completed successfully"
                      : "Processing records..."}
                  </span>
                </div>
                {exportProgress === 100 && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-500 font-black uppercase tracking-tighter"
                  >
                    Success
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportLoadingModal;
