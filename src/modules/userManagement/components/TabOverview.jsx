import React from "react";
import {
  Activity,
  ShieldCheck,
  CreditCard,
  Calendar,
  Target,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Kpi, Card, Pill, KV, EmptyState } from "./UserProfileView";
import { activityMeta } from "./activity.utils";

export function TabOverview({ data }) {
  const { user, es, cap, fmtDate, timeAgo, bmi, bmiCat, activeProgram } = data;
  const recentActivities = user.recent_activities || [];

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi label="Programs Enrolled" value={es.programs_enrolled || 0} />
            <Kpi
              label="Fitzone Assignments"
              value={es.fitzone_assignments || 0}
            />
            <Kpi label="Step Logs" value={es.step_logs_count || 0} />
            <Kpi
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
          <Card title="Snapshot" subtitle="Quick summary across all areas">
            <KV
              icon={CreditCard}
              label="Plan"
              value={
                user.plan ? (
                  <span className="inline-flex items-center gap-1.5">
                    {user.plan.title}
                    <Pill tone={user.paid ? "success" : "neutral"}>
                      {user.paid ? "Paid" : "Unpaid"}
                    </Pill>
                  </span>
                ) : (
                  "No active plan"
                )
              }
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
                  <span className="inline-flex items-center gap-1.5">
                    {activeProgram.title}
                    <Pill tone={activeProgram.status === "Active" ? "success" : "neutral"}>
                      {activeProgram.status}
                    </Pill>
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
                    <span className={cn("text-[11px] font-semibold", bmiCat.color)}>
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
              <KV icon={User} label="Managed By" value="No Sub-Admin Assigned" />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
