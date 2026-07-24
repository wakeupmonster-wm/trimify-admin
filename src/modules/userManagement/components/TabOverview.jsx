import React from "react";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  Bell,
  CreditCard,
  User,
  Activity,
} from "lucide-react";
import { Kpi, Card, GoalTile, Pill, KV, EmptyState } from "./UserProfileView";

export function TabOverview({ data }) {
  const { user, es, waterGoal, caloriesGoal, targetSteps, macroTotal, macros, cap, initials, fmtDate, timeAgo } = data;

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

          <Card title="Daily Targets" subtitle="Nutrition & step goals">
            <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <GoalTile
                label="Water Goal"
                value={`${waterGoal.toLocaleString()} ml`}
                pct={Math.min(100, (waterGoal / 4000) * 100)}
              />
              <GoalTile
                label="Calories Goal"
                value={`${caloriesGoal.toLocaleString()} kcal`}
                pct={Math.min(100, (caloriesGoal / 3500) * 100)}
              />
              <GoalTile
                label="Step Target"
                value={targetSteps.toLocaleString()}
                pct={Math.min(100, (targetSteps / 12000) * 100)}
              />
            </div>
            <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
              Macro split
            </div>
            <div className="mb-2.5 flex h-2 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
              {macros.map((m) => (
                <div
                  key={m.label}
                  style={{
                    width: `${macroTotal ? ((m.v / macroTotal) * 100).toFixed(1) : 0}%`,
                    background: m.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3.5">
              {macros.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-sm"
                    style={{ background: m.color }}
                  />
                  {m.label} · {m.v}g
                </div>
              ))}
            </div>
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
          <Card title="Managed By" subtitle="Assigned sub-admin"
            // right={
            //   <Pill
            //     tone={
            //       user.sub_admin?.status === "Active" ||
            //       user.sub_admin?.status === "1"
            //         ? "success"
            //         : "neutral"
            //     }
            //   >
            //     {user.sub_admin?.status === "1"
            //       ? "Active"
            //       : user.sub_admin?.status === "0"
            //         ? "Inactive"
            //         : user.sub_admin?.status}
            //   </Pill>
            // }
          >
            {user.sub_admin ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-500">
                    {initials(user.sub_admin?.name)}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">
                      {user.sub_admin?.name}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      {user.sub_admin?.designation} · {user.sub_admin?.hospital}
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <KV icon={Mail} label="Email" value={user.sub_admin?.email} />
                  <KV icon={Phone} label="Phone" value={user.sub_admin?.phone} />
                  <KV icon={Globe} label="Location" value={user.sub_admin?.location} />
                </div>
              </>
            ) : (
              <EmptyState
                icon={User}
                title="No Sub-Admin Assigned"
                subtitle="This user is not managed by a specific sub-admin."
              />
            )}
          </Card>

          <Card title="Account" subtitle="User account details">
            <KV icon={CreditCard} label="Payment" value={user.paid ? "Paid" : "Unpaid"} />
            <KV icon={ShieldCheck} label="Plan" value={user.plan ? cap(user.plan) : "No active plan"} />
            <KV icon={Bell} label="Notifications" value={user.notification_status ? "Enabled" : "Disabled"} />
            <KV icon={Calendar} label="Updated" value={fmtDate(user.updated_at)} />
          </Card>
        </div>
      </div>
    </>
  );
}
