import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export const Header = ({ p }) => {
  const nickname = p?.profile?.nickname || p?.userId?.slice(0, 8) || "Unknown";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!p?.userId) return;
    try {
      await navigator.clipboard.writeText(p.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("User ID Copied");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/management/profile-reports"
          className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-300/60 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
          <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
            Profile Reports
          </span>
          <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
            /
          </span>
          <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
            {nickname}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="group flex items-center gap-2 bg-white text-[10px] font-medium text-muted-foreground px-3 py-1.5 rounded-md border border-muted-foreground/25 transition-all active:scale-95 shadow-sm"
        >
          ID: {p?.userId || "N/A"}
        </button>
      </div>
    </header>
  );
};
