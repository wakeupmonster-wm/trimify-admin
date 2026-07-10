import React, { useState, useRef, useEffect } from "react";
import { Download, Maximize2, FileText, Camera, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

export const ZoomableImage = ({ src, label, alt, className, userName }) => {
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    setHasDragged(true);

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Handle Wheel Zoom (Non-passive to prevent page scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomStep = 0.2;
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;

      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom + delta, 1.05), 10);
        return parseFloat(newZoom.toFixed(2));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handleDownload = async () => {
    const cleanLabel = (label || "image").toLowerCase();
    let downloadSuffix = label || "image";

    if (cleanLabel.includes("id") || cleanLabel.includes("document")) {
      downloadSuffix = "Document";
    } else if (cleanLabel.includes("selfie")) {
      downloadSuffix = "Selfie";
    }

    const fileName = `${(userName || "user").replace(/\s+/g, "_")}_${downloadSuffix.replace(/\s+/g, "_")}.jpg`;

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to old method if fetch fails (e.g. CORS issues)
      const link = document.createElement("a");
      link.href = src;
      link.download = fileName;
      link.click();
    }
  };

  const isSelfie = (label || "").toLowerCase().includes("selfie");

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm",
          className,
        )}
      >
        {/* Doc Viewer Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-300/80">
          <div className="flex items-center gap-2">
            {isSelfie ? (
              <Camera className="w-4 h-4 text-purple-500" />
            ) : (
              <FileText className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-[11px] font-black uppercase tracking-[0.05em] text-slate-500">
              {label || "Image"}
            </span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-foreground hover:text-brand-aqua transition-colors"
          >
            <Download
              className={`w-3.5 h-3.5 ${isSelfie ? "text-purple-500" : "text-amber-500"}`}
            />
            Download
          </button>
        </div>

        {/* Image Container Area */}
        <div className="relative flex-1 bg-white max-h-[430px] 3xl:max-h-[580px] overflow-hidden group">
          <div
            ref={containerRef}
            className={cn(
              "w-full h-[414px] 3xl:h-[580px] flex items-center justify-center select-none touch-none overflow-hidden bg-slate-50/30",
              zoom > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default",
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => {
              if (!hasDragged) setIsPreviewOpen(true);
            }}
          >
            <img
              src={src}
              alt={label || alt}
              draggable={false}
              className="max-w-full h-[340px] 3xl:h-[580px] object-contain pointer-events-none transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center",
                transition: isDragging
                  ? "none"
                  : "transform 300ms cubic-bezier(0.2, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* External Link Overlay */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-aqua shadow-sm transition-all hover:-translate-y-0.5"
              title="View Full Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Slider Wrapper (Matching Image Exactly) */}
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <div className="bg-white backdrop-blur-sm border border-slate-300 rounded-xl py-1.5 px-3 shadow-sm flex items-center gap-4 group/slider">
              <div className="relative flex items-center justify-center">
                <LuZoomOut
                  className="w-4 h-4 text-slate-800"
                  style={{ top: "6px" }}
                />
              </div>

              <div className="flex-1 relative flex items-center">
                {/* Custom Track Background */}
                <div className="absolute w-full h-[4px] border-[0.1px] border-slate-500 px-1 bg-foreground/80 rounded-sm" />
                {/* Custom Track Active */}
                <div
                  className="absolute h-[4px] bg-brand-aqua rounded-full z-10"
                  style={{ width: `${((zoom - 1) / 9) * 100}%` }}
                />
                <input
                  type="range"
                  min="1.05"
                  max="10"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="relative w-full h-6 bg-transparent appearance-none cursor-pointer z-20 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-3 
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-brand-aqua 
                    [&::-webkit-slider-thumb]:border-none
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:transition-transform
                    hover:[&::-webkit-slider-thumb]:scale-125"
                />
              </div>

              <div className="relative flex items-center justify-center">
                <LuZoomIn className="w-4 h-4 text-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- IMAGE PREVIEW MODAL --- */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          {/* Close Button Overlay */}
          {/* <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 z-[100] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <X size={20} />
          </button> */}

          <img
            src={src}
            className="max-w-full max-h-[92vh] object-contain shadow-2xl"
            alt="High Res Preview"
          />

          {/* Label Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-white text-[11px] font-black uppercase tracking-widest">
              {label || "Full Resolution View"}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};