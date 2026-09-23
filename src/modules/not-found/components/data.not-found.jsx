import React from "react";
import { SearchX, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export const DataNotFound = ({
  icon,
  title,
  subtitle,
  message,
  action,
  isSearch = false,
  className,
}) => {
  const displayTitle =
    title ||
    message ||
    (isSearch ? "No matching results found" : "No data available");

  const displaySubtitle =
    subtitle !== undefined
      ? subtitle
      : isSearch
        ? "We couldn't find any results matching your search keyword. Try a different term or clear the search."
        : "There are currently no records to display. New entries will appear here once added.";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4 py-8 select-none",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm mb-3 transition-transform duration-300 hover:scale-105",
          isSearch
            ? "bg-amber-50/80 border-amber-200/70 text-amber-500"
            : "bg-app-primary2/10 border-app-primary2/20 text-app-primary2",
        )}
      >
        {icon ? (
          icon
        ) : isSearch ? (
          <SearchX className="h-6 w-6" strokeWidth={2} />
        ) : (
          <Inbox className="h-6 w-6" strokeWidth={2} />
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-800 tracking-tight">
        {displayTitle}
      </h4>

      {displaySubtitle && (
        <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 leading-relaxed">
          {displaySubtitle}
        </p>
      )}

      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
};
