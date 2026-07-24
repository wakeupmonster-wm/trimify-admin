import React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }) {
  return (
    <div
      className={cn(
        "w-8 h-8 border-4 border-app-primary2 border-t-transparent rounded-full animate-spin",
        className
      )}
      {...props}
    />
  );
}
