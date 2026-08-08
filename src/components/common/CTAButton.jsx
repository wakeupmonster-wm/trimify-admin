import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTAButton({
  icon: Icon,
  label,
  onClick,
  className,
  variant = "outline",
  ...props
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 flex-1 h-10 rounded-md shadow-none text-xs font-medium transition-all active:scale-95 px-3.5",
        variant === "outline" &&
          "bg-slate-50 hover:bg-app-primary2 border border-slate-300/60 text-slate-500 hover:text-white hover:border-app-primary2",
        variant === "primary" &&
          "bg-app-primary2 text-white border border-app-primary2 hover:bg-app-primary5 hover:border-app-primary5",
        variant === "danger" &&
          "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="whitespace-nowrap">{label}</span>
    </Button>
  );
}
