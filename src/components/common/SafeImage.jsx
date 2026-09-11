import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Displays an image safely. If the source is missing or fails to load,
 * it renders a graceful fallback in the exact same footprint.
 */
const SafeImage = ({
  src,
  alt = "Image",
  className,
  fallbackClassName,
  onLoad,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const hasSource = Boolean(src && String(src).trim());

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!hasSource || hasError) {
    return (
      <div
        role="img"
        aria-label={`${alt} unavailable`}
        className={cn(
          "flex items-center justify-center bg-slate-100 text-slate-400 shrink-0",
          fallbackClassName || className,
        )}
      >
        <ImageOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

// Safe dummy fallback export to prevent runtime crashes if imported, renders nothing
export const ImageFallback = () => null;

export default SafeImage;

