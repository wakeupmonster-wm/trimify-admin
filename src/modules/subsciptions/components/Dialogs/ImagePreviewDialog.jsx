import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export const ImagePreviewDialog = ({ open, onOpenChange, src, title }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center">
        <DialogHeader className="sr-only">
          <DialogTitle>{title || "Image Preview"}</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <img
                src={src}
                alt={title || "Preview"}
                className="max-w-full max-h-[90vh] object-contain"
              />
              {title && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10 whitespace-nowrap">
                  {title}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
