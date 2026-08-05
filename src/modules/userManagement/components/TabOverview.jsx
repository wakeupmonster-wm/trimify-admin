import React from "react";
import {
  Activity,
  ShieldCheck,
  CreditCard,
  Calendar,
  Target,
  User,
  ClipboardList,
  Dumbbell,
  Footprints,
  CalendarDays,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Kpi, Card, KV, EmptyState } from "./UserProfileShared";
import { activityMeta } from "./activity.utils";

export function TabOverview({ data }) {
  const { user, es, cap, fmtDate, timeAgo, bmi, bmiCat, activeProgram } = data;
  const recentActivities = (user.recent_activities || []).filter((a) => {
    if (a.type === "step_log") {
      const steps = parseInt(((a.title || "").match(/\d+/) || ["0"])[0], 10);
      return steps > 0;
    }
    return true;
  });

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi
              icon={ClipboardList}
              label="Programs Enrolled"
              value={es.programs_enrolled || 0}
            />
            <Kpi
              icon={Dumbbell}
              label="Fitzone Assignments"
              value={es.fitzone_assignments || 0}
            />
            <Kpi
              icon={Footprints}
              label="Step Logs"
              value={es.step_logs_count || 0}
            />
            <Kpi
              icon={CalendarDays}
              label="Days Active (30d)"
              value={es.days_active_last_30_days || 0}
            />
          </div>

          <Card
            title="Recent Activity"
            subtitle="Latest actions across the account"
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
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                    <Activity className="h-5 w-5" />
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
                <div className="text-base font-bold tabular-nums text-slate-900">
                  {user.most_used_feature?.count}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <Card
            title="Snapshot"
            subtitle="Quick summary across all areas"
          >
            <KV
              icon={CreditCard}
              label="Plan"
              value={
                user.plan ? (
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide",
                      !user.paid
                        ? "bg-slate-100 text-slate-600"
                        : String(user.plan.title || user.plan).toLowerCase().includes("premium")
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-app-primary2"
                    )}>
                      {user.paid && <Star className="h-2.5 w-2.5 fill-current" />}
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
            />
            <KV
              icon={ShieldCheck}
              label="BMI"
              value={
                bmi ? (
                  <span className="inline-flex items-center gap-1.5">
                    {bmi.toFixed(1)}
                    <span
                      className={cn("text-[11px] font-semibold", bmiCat.color)}
                    >
                      {bmiCat.label}
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
            {user.sub_admin ? (
              <KV icon={User} label="Managed By" value={user.sub_admin?.name} />
            ) : (
              <KV
                icon={User}
                label="Managed By"
                value="No Sub-Admin Assigned"
              />
            )}
          </Card>

          <Card title="Account Connectivity" subtitle="Primary contact methods">
            <KV
              icon={Mail}
              label="Email"
              value={user.email || "Not Provided"}
            />
            <KV
              icon={Phone}
              label="Phone"
              value={user.mobile || "Not Provided"}
            />
            <KV
              icon={Activity}
              label="Last Login"
              value={user.last_login ? fmtDate(user.last_login) : "—"}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
