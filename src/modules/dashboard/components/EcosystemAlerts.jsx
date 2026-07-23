import React, { useMemo } from "react";
import { ShieldCheck, AlertTriangle, Clock, ArrowRight, Target } from "lucide-react";
import { useNavigate } from "react-router";
import { startOfDay, endOfDay, subDays } from "date-fns";

export function EcosystemAlerts({ data, selectedDate }) {
  if (!data?.alerts?.length) return null;
  const navigate = useNavigate();

  // Resolve preset-based date selections to actual from/to dates
  // so destination pages receive usable date values for API filtering
  const resolvedDateRange = useMemo(() => {
    if (selectedDate?.from && selectedDate?.to) {
      return { from: selectedDate.from, to: selectedDate.to };
    }
    const now = new Date();
    switch (selectedDate?.preset) {
      case "today":
        return { from: startOfDay(now).toISOString(), to: endOfDay(now).toISOString() };
      case "yesterday": {
        const yd = subDays(now, 1);
        return { from: startOfDay(yd).toISOString(), to: endOfDay(yd).toISOString() };
      }
      case "7d":
        return { from: startOfDay(subDays(now, 6)).toISOString(), to: endOfDay(now).toISOString() };
      case "30d":
        return { from: startOfDay(subDays(now, 29)).toISOString(), to: endOfDay(now).toISOString() };
      default:
        return { from: null, to: null };
    }
  }, [selectedDate]);

  const config = {
    kyc: {
      bgColor: "bg-[#FFFCF0]",
      borderColor: "border-[#FDE68A]",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      badgeBg: "bg-[#FFFCF0]",
      badgeText: "text-[#D97706]",
      actionBg: "bg-[#FFFFFF]",
      actionText: "text-[#D97706]",
      actionLabel: "Review now",
      icon: ShieldCheck,
    },
    reported: {
      bgColor: "bg-[#FFF5F5]",
      borderColor: "border-[#FECACA]",
      iconBg: "bg-[#FEE2E2]",
      iconColor: "text-[#DC2626]",
      badgeBg: "bg-[#FFF5F5]",
      badgeText: "text-[#DC2626]",
      actionBg: "bg-[#FFFFFF]",
      actionText: "text-[#DC2626]",
      actionLabel: "Investigate",
      icon: AlertTriangle,
    },
    ghosting: {
      bgColor: "bg-[#F5F3FF]",
      borderColor: "border-[#DDD6FE]",
      iconBg: "bg-[#EDE9FE]",
      iconColor: "text-[#7C3AED]",
      badgeBg: "bg-[#F5F3FF]",
      badgeText: "text-[#7C3AED]",
      actionBg: "bg-[#FFFFFF]",
      actionText: "text-[#7C3AED]",
      actionLabel: "Analyze",
      icon: Clock,
    },
    stalled: {
      bgColor: "bg-[#FFFCF0]",
      borderColor: "border-[#FDE68A]",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      badgeBg: "bg-[#FFFCF0]",
      badgeText: "text-[#D97706]",
      actionBg: "bg-[#FFFFFF]",
      actionText: "text-[#D97706]",
      actionLabel: "Manage",
      icon: Target,
    },
  };

  return (
    <div className="mb-1">
      <div className="mb-4 flex flex-col items-start gap-1">
        <h2 className="text-base font-bold text-slate-900 group">Alerts</h2>
        <p className="text-[11px] font-medium text-slate-500 leading-none">
          Needs your attention
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data.alerts) && data.alerts.map((alert, idx) => {
          const alertConfig = config[alert.id] || config.kyc;
          const AlertIcon = alertConfig.icon;

          return (
            <div
              key={idx}
              className={`group relative flex items-center gap-3 border ${alertConfig.borderColor} ${alertConfig.bgColor} rounded-xl p-4 py-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden`}
              onClick={() => {
                sessionStorage.clear();
                navigate(alert.route || "/admin/management/users-management", {
                  state: {
                    id: alert.id,
                    badge: alert.badge,
                    preset: selectedDate?.preset,
                    dateRange: resolvedDateRange,
                    filterId: alert.filterId,
                  },
                })
              }}
            >
              {/* Circular Icon container */}
              <div
                className={`w-12 h-12 rounded-full ${alertConfig.iconBg} flex items-center justify-center shrink-0 border border-white shadow-sm`}
              >
                <AlertIcon
                  className={`${alertConfig.iconColor}`}
                  size={24}
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 gap-0.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-bold text-foreground leading-tight">
                    {alert.label}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground font-semibold leading-tight line-clamp-2">
                  {alert.value}
                </p>
              </div>

              {/* Action Button */}
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${alertConfig.actionBg} ${alertConfig.actionText} font-semibold text-[12px] shadow-sm hover:shadow transition-all whitespace-nowrap`}
              >
                {alertConfig.actionLabel}
                <ArrowRight size={13} className="ml-0.5" strokeWidth={3} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
