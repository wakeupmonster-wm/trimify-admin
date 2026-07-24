import React from "react";
import { RefreshCw } from "lucide-react";

const formatTime = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Cache-freshness indicator — dashboard data is cached ~30-60s server-side,
 * so this tells the admin when the numbers were last pulled and lets them
 * force a refresh instead of wondering if the page is stale.
 */
const LastUpdatedIndicator = ({ lastUpdated, onRefresh, refreshing }) => {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={refreshing}
      title="Refresh dashboard data"
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-white hover:bg-app-primary2 px-3 h-9 text-[11px] font-semibold text-slate-500 hover:text-white hover:border-app-primary2 transition-colors disabled:opacity-60 shrink-0"
    >
      <RefreshCw
        className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
      />
      As of {formatTime(lastUpdated)}
    </button>
  );
};

export default LastUpdatedIndicator;
