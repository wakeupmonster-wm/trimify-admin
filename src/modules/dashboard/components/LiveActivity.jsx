import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, Info } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { LuActivity } from "react-icons/lu";

export function LiveActivity({ data }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const formatTimeAgo = (date) => {
    if (!date || date === "Just now") return "just now";
    try {
      const now = new Date();
      const past = new Date(date);
      const diffInMs = now - past;

      const diffInSecs = Math.floor(diffInMs / 1000);
      if (diffInSecs < 60) return "just now";

      const diffInMins = Math.floor(diffInSecs / 60);
      if (diffInMins < 60) return `${diffInMins}m ago`;

      const diffInHours = Math.floor(diffInMins / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays}d ago`;

      return past.toLocaleDateString();
    } catch (e) {
      return "just now";
    }
  };

  const events = React.useMemo(() => {
    if (!data) return [];
    
    const users = (data.recentUsers || []).map(u => ({
      id: `u-${u.id}`,
      time: u.created_at,
      description: `New user ${u.name} registered.`,
      color: "hsl(182 59% 54%)"
    }));

    const txs = (data.recentTransactions || []).map(t => ({
      id: `t-${t.id}`,
      time: t.created_at,
      description: `${t.user_name} subscribed to ${t.plan_title} ($${t.amount}).`,
      color: "hsl(160, 60%, 45%)"
    }));

    return [...users, ...txs].sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [data]);

  return (
    <div className="bg-white border border-slate-200 hover:border-brand-aqua/50 transition-all duration-300 rounded-2xl py-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 px-6 border-b border-slate-200">
        <DashboardHead
          title="Live Activity"
          subtitle="Recent registrations and transactions"
          Icon={LuActivity}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />
      </div>

      {events.length > 0 ? (
        <ScrollArea className="flex-1 mt-3 pr-2 max-h-[300px] px-6">
          <div className="space-y-1">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`flex items-center gap-4 p-3 rounded-md transition-colors ${
                  index % 2 === 0 ? "bg-slate-100/90" : "bg-white"
                }`}
              >
                <span className="text-[11px] font-semibold text-secondary-foreground whitespace-nowrap min-w-[60px]">
                  {formatTimeAgo(event.time)}
                </span>
                <div className="relative min-w-[10px]">
                  <div
                    className="w-1.5 h-1.5 rounded-full z-10 relative"
                    style={{ backgroundColor: event.color }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-tight">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center mt-6 mx-6 border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/30 p-6">
          <div className="bg-slate-100 p-2.5 rounded-full mb-3">
            <Inbox size={18} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            No recent activity
          </p>
          <p className="text-[10px] text-slate-400/80 mt-1">
            Check back later for updates
          </p>
        </div>
      )}

      <div className="mt-4 mx-6 flex items-center gap-2 px-3 py-2 bg-brand-aqua/5 border border-brand-aqua/40 rounded-xl text-foreground/80 text-[11px] sm:text-xs font-medium">
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
          <Info size={12} className="text-brand-aqua" />
        </div>
        <span>
          Active monitoring:{" "}
          <strong className="font-extrabold text-brand-aqua">
            {events.length}
          </strong>{" "}
          events captured recently.
        </span>
      </div>
      
    </div>
  );
}
