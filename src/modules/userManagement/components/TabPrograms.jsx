import React from "react";
import { Target, Activity } from "lucide-react";
import { Card, Pill, EmptyState } from "./UserProfileView";

export function TabPrograms({ data }) {
  const { programs, fitzoneStatus, fmtDate } = data;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <Card
          title="Enrolled Programs"
          subtitle="Active and past program enrollments"
          right={
            <span className="text-[10.5px] font-semibold text-slate-400">
              {programs.length}
            </span>
          }
        >
          {programs.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Program
                  </th>
                  <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Duration
                  </th>
                  <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr
                    key={p.program_id}
                    className="border-b border-slate-50 last:border-b-0"
                  >
                    <td className="py-2.5 align-top">
                      <div className="text-[11.5px] font-semibold text-slate-900">
                        {p.title}
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-slate-400">
                        Assigned {fmtDate(p.assigned_at)}
                      </div>
                    </td>
                    <td className="py-2.5 align-top text-[11.5px]">
                      {p.start_date ? (
                        `${fmtDate(p.start_date)} – ${fmtDate(p.end_date)}`
                      ) : (
                        <span className="text-slate-400">Not scheduled</span>
                      )}
                    </td>
                    <td className="py-2.5 align-top">
                      <Pill
                        tone={p.status === "Active" ? "success" : "neutral"}
                      >
                        {p.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={Target}
              title="No Enrolled Programs"
              subtitle="This user is not enrolled in any programs."
            />
          )}
        </Card>

        <Card
          title="Fitzone Assignments"
          subtitle="Active Fitzone sessions and assignments"
          right={
            <span className="text-[10.5px] font-semibold text-slate-400">
              {fitzoneStatus.length}
            </span>
          }
        >
          {fitzoneStatus.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {fitzoneStatus.map((f) => (
                <div
                  key={f.category_id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2.5"
                >
                  <div>
                    <div className="text-[11.5px] font-semibold text-slate-900">
                      {f.category_title}
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      Since {fmtDate(f.assigned_at)}
                    </div>
                  </div>
                  <Pill tone={f.status === "Active" ? "success" : "neutral"}>
                    {f.status}
                  </Pill>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No Fitzone Assignments"
              subtitle="This user has no Fitzone assignments."
            />
          )}
        </Card>
      </div>
    </>
  );
}
