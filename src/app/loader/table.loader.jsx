import { cn } from "@/lib/utils";
import React from "react";
import Loader from "@/components/common/Loader";

export function TableLoader({ className, text }) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-white/50 w-full flex flex-col gap-1 items-center justify-center z-10",
        className,
      )}
    >
      <Loader width={100} height={100} />
      {text && (
        <span className="w-max text-sm font-bold text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
