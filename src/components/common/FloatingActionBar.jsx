import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const FloatingActionBar = ({ selectedCount, children }) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 left-[40%] -translate-x-1/2 z-50 flex items-center gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80"
        >
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200/80">
            <span className="flex items-center justify-center bg-app-primary2/10 text-app-primary2 font-bold w-6 h-6 rounded-full text-xs">
              {selectedCount}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionBar;
