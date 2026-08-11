import React from "react";
import {
  Activity,
  CreditCard,
  Calendar,
  Target,
  User,
  ClipboardList,
  Dumbbell,
  Footprints,
  Mail,
  Phone,
  Star,
  Droplets,
  Utensils,
  Scale,
  Clock,
  Monitor,
  Smartphone,
  Globe,
} from "lucide-react";
import { GiWeightLiftingUp } from "react-icons/gi";
import { cn } from "@/lib/utils";
import { Kpi, Card, KV, EmptyState } from "./UserProfileShared";
import { activityMeta } from "./activity.utils";
import { LuUserRound } from "react-icons/lu";
import { FaLink } from "react-icons/fa6";

export function TabOverview({ data }) {
  const { user, es, cap, fmtDate, timeAgo, bmi, bmiCat, activeProgram } = data;
  const recentActivities = (user.recent_activities || []).filter((a) => {
    const valMatch = (a.title || "").match(/\d+/);
    if (valMatch && parseInt(valMatch[0], 10) === 0) return false;
    return true;
  });

  const getFeatureIcon = (feature) => {
    const f = (feature || "").toLowerCase();
    if (f.includes("step")) return Footprints;
    if (f.includes("water") || f.includes("hydration")) return Droplets;
    if (f.includes("food") || f.includes("meal") || f.includes("diet"))
      return Utensils;
    if (f.includes("weight") || f.includes("scale")) return Scale;
    if (
      f.includes("fitzone") ||
      f.includes("workout") ||
      f.includes("exercise")
    )
      return Dumbbell;
    if (f.includes("program")) return ClipboardList;
    return Activity;
  };

  const FeatureIcon = getFeatureIcon(user.most_used_feature?.feature);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Kpi
          // icon={ClipboardList}
          label="Programs Enrolled"
          value={es.programs_enrolled || 0}
          tone="blue"
        />
        <Kpi
          // icon={Dumbbell}
          label="Fitzone Assignments"
          value={es.fitzone_assignments || 0}
          tone="purple"
        />
        <Kpi
          // icon={Footprints}
          label="Step Logs"
          value={es.step_logs_count || 0}
          tone="emerald"
        />
        <Kpi
          // icon={CalendarDays}
          label="Days Active (30d)"
          value={es.days_active_last_30_days || 0}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <Card
            title="Recent Activity"
            subtitle="Latest actions across the account"
            icon={Activity}
          >
            {recentActivities.length > 0 ? (
              <div className="flex flex-col">
                {recentActivities.slice(0, 6).map((a, i) => {
                  const { icon: Icon, className } = activityMeta(a.type);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 border-b border-slate-50 py-2.5 last:border-b-0 last:pb-0"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          className,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-semibold text-slate-900">
                          {a.title}
                        </div>
                      </div>
                      <div className="shrink-0 text-[10.5px] font-medium text-slate-400">
                        {timeAgo(a.created_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No Recent Activity"
                subtitle="This user hasn't performed any tracked actions yet."
              />
            )}
          </Card>

          {user.most_used_feature && (
            <Card
              title="Most Used Feature"
              subtitle="Highest logged activity in this account"
              icon={Star}
            >
              <>
                <div className="flex items-center justify-between pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                      <FeatureIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-900">
                        {cap(user.most_used_feature?.feature)}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">
                        Last logged {timeAgo(es.last_active_at)}
                      </div>
                    </div>
                  </div>
                  {/* <div className="text-base font-bold tabular-nums text-slate-900">
                    {user.most_used_feature?.count}
                  </div> */}
                </div>
              </>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <Card
            title="Snapshot"
            subtitle="Quick summary across all areas"
            icon={ClipboardList}
          >
            <KV
              icon={CreditCard}
              label="Plan"
              value={
                user.plan ? (
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
                        !user.paid
                          ? "bg-slate-100 text-slate-600"
                          : String(user.plan.title || user.plan)
                            .toLowerCase()
                            .includes("premium")
                            ? "bg-amber-100/50 text-amber-600"
                            : "bg-blue-50 text-app-primary2",
                      )}
                    >
                      {user.paid && (
                        <Star className="h-2.5 w-2.5 fill-current" />
                      )}
                      {String(user.plan.title || user.plan).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  "No active plan"
                )
              }
              noBorder={true}
            />
            <KV
              icon={Calendar}
              label="Plan Expiry"
              value={user.plan_expiry ? fmtDate(user.plan_expiry) : "—"}
              noBorder={true}
            />
            <KV
              icon={Target}
              label="Active Program"
              value={
                activeProgram ? (
                  <span className="font-semibold text-slate-800">
                    {activeProgram.title}
                  </span>
                ) : (
                  "None assigned"
                )
              }
              noBorder={true}
            />
            <KV
              icon={GiWeightLiftingUp}
              label="BMI"
              value={
                bmi ? (
                  <span className="inline-flex items-center gap-1.5 justify-end w-full">
                    {bmi.toFixed(1)}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 uppercase text-[11px] font-bold tracking-wide",
                        bmiCat.label.toLowerCase() === "normal"
                          ? "bg-emerald-100/50 text-emerald-600"
                          : bmiCat.label.toLowerCase() === "overweight" ||
                            bmiCat.label.toLowerCase() === "underweight"
                            ? "bg-amber-100/50 text-amber-600"
                            : bmiCat.label.toLowerCase() === "obese"
                              ? "bg-rose-100/50 text-rose-600"
                              : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {bmiCat.label}
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
              noBorder={true}
            />
            {user.sub_admin ? (
              <KV
                icon={LuUserRound}
                label="Managed By"
                value={user.sub_admin?.name}
                noBorder={true}
              />
            ) : (
              <KV
                icon={User}
                label="Managed By"
                value="No Sub-Admin Assigned"
                noBorder={true}
              />
            )}
          </Card>

          <Card
            title="Account Connectivity"
            subtitle="Primary contact details"
            icon={FaLink}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-100/50">
                <div className="p-2 bg-slate-100/50 rounded-full">
                  <Mail size={18} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                    Email
                  </p>
                  <p className="text-xs font-bold text-foreground/80 truncate">
                    {user.email || "Not Provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-100/50">
                <div className="p-2 bg-slate-100/50 rounded-full">
                  <Phone size={18} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                    Phone
                  </p>
                  <p className="text-xs font-bold text-foreground/80 truncate">
                    {user.mobileNo || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Recent Logins"
            subtitle="Active sessions and device history"
            icon={Monitor}
          >
            <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {(user.recentLogins || []).length > 0 ? (
                (user.recentLogins || []).map((login, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-4 px-3 rounded-xl bg-slate-50/50 border border-slate-100 transition-colors hover:bg-slate-100/50"
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm border border-slate-200">
                      {(() => {
                        const browser = (login.browser || "").toLowerCase();
                        if (
                          browser.includes("mobile") ||
                          browser.includes("ios") ||
                          browser.includes("android") ||
                          browser.includes("phone")
                        ) {
                          return (
                            <Smartphone size={18} className="text-slate-600" />
                          );
                        }
                        if (
                          browser.includes("safari") ||
                          browser.includes("chrome") ||
                          browser.includes("edge") ||
                          browser.includes("firefox") ||
                          browser.includes("web")
                        ) {
                          return <Globe size={18} className="text-blue-500" />;
                        }
                        return <Monitor size={18} className="text-slate-600" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-bold text-slate-900 truncate">
                          {login.browser || "Unknown Device"}
                        </p>
                        {login.current && (
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {login.loc || login.ip || "Unknown Location"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end min-w-0">
                      <p className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                        {login.date || "Unknown Date"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                        {login.time || "Unknown Time"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Monitor}
                  title="No Recent Logins"
                  subtitle="No active sessions or login history found."
                />
              )}
            </div>
          </Card>

          {/* <Card title="Location & Context" subtitle="User geographic summary">
            <KV
              icon={MapPin}
              label="City/State"
              value={
                user.city || user.state
                  ? `${user.city || ""}${user.city && user.state ? ", " : ""}${user.state || ""}`
                  : "Not Provided"
              }
              noBorder={true}
            />
            <KV
              icon={Target}
              label="Country"
              value={user.country || "Not Provided"}
              noBorder={true}
            />
          </Card> */}

          {/* <Card
            title="Account Reports"
            subtitle="User standing & flags"
            icon={Flag}
          >
            <div className="p-4 rounded-lg bg-green-50/50 flex items-center gap-4 border border-green-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-700">Clean Record</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">
                  No reports filed against this user
                </p>
              </div>
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
