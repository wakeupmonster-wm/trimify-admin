import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const DashboardHead = ({
  title,
  caseType = false,
  subtitle,
  Icon,
  iconColor = "text-blue-600", // Default color
  iconBg = "bg-blue-50", // Default background
  titlestyle,
  iconSizeClass = "h-10 w-10",
  titleSizeClass = "text-[14px]",
  iconInnerClass = "h-5 w-5",
  tooltipText,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Dynamic Icon Container with dynamic background */}
      {Icon && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg transition-all duration-300",
            iconBg,
            iconSizeClass,
          )}
        >
          <Icon className={cn(iconInnerClass, iconColor)} />
        </div>
      )}

      <div
        className={`flex ${subtitle ? "flex-col items-start gap-1" : "flex-row items-center justify-center gap-0"}`}
      >
        <div className="flex items-center gap-1.5">
          <h3
            className={cn(
              "font-bold leading-tight text-slate-900 transition-all duration-300",
              caseType ? "uppercase" : "capitalize",
              titleSizeClass,
              titlestyle,
            )}
          >
            {title}
          </h3>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="cursor-help text-slate-400 hover:text-app-primary2 transition-colors">
                    <Info size={14} strokeWidth={2.5} />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-slate-900 border-slate-800 text-slate-100 max-w-[250px] p-2.5 rounded-lg text-[11px] font-medium leading-relaxed shadow-xl"
                  side="right"
                >
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {subtitle && (
          <div className="text-xs -mt-0.5 font-medium text-slate-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHead;
