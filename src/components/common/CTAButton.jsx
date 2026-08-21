import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTAButton({
  icon: Icon,
  label,
  onClick,
  className,
  variant = "primary",
  ...props
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 flex-1 h-10 rounded-md shadow-none text-xs font-medium transition-all active:scale-95 px-3.5",
        variant === "outline" &&
          "bg-white border border-slate-300/80 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400",
        variant === "primary" &&
          "bg-app-primary2 text-white border border-app-primary2 hover:bg-app-primary5 hover:border-app-primary5",
        variant === "danger" &&
          "bg-rose-600 text-white border border-rose-600 shadow-sm hover:bg-rose-700 hover:border-rose-700",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="whitespace-nowrap">{label}</span>
    </Button>
  );
}
