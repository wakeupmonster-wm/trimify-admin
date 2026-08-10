import React, { useState } from "react";
import {
  Target,
  Activity,
  ClipboardList,
  Dumbbell,
  Pencil,
} from "lucide-react";
import { Card, Pill, EmptyState } from "./UserProfileShared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditFitzoneDialogForm from "./profile/EditFitzoneDialogForm";

export function TabPrograms({ data }) {
  const { programs, fitzoneStatus, fmtDate } = data;
  const [editFitzoneOpen, setEditFitzoneOpen] = useState(false);
  const [selectedFitzone, setSelectedFitzone] = useState(null);

  return (
    <>
      <div className="flex flex-col gap-3.5">
        <Card
          title="Fitzone Assignments"
          subtitle="Active Fitzone sessions and assignments"
          icon={Dumbbell}
          right={
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
              {fitzoneStatus.length} Fitzones
            </span>
          }
        >
          {fitzoneStatus.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[350px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 pl-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500 w-16">
                      Sr. No.
                    </th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Category
                    </th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Assigned
                    </th>
                    <th className="pb-2 pr-2 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="h-22">
                  {fitzoneStatus.map((f, idx) => (
                    <tr
                      key={f.category_id}
                      className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-2.5 pl-2 align-middle text-[11px] font-bold text-slate-400">
                        {(idx + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="py-2.5 align-middle">
                        <div className="text-xs font-semibold text-slate-900">
                          {f.category_title}
                        </div>
                      </td>
                      <td className="py-2.5 align-middle">
                        <Pill
                          tone={f.status === "Active" ? "success" : "neutral"}
                        >
                          {f.status || "Unknown"}
                        </Pill>
                      </td>
                      <td className="py-2.5 align-middle">
                        <div className="text-[11px] font-medium text-slate-600">
                          {f.assigned_at ? fmtDate(f.assigned_at) : "—"}
                        </div>
                      </td>
                      <td className="py-2.5 pr-2 align-middle text-right">
                        <button
                          onClick={() => {
                            setSelectedFitzone(f);
                            setEditFitzoneOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-slate-500" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No Fitzone Assignments"
              subtitle="This user has no Fitzone assignments."
            />
          )}
        </Card>

        <Card
          title="Enrolled Programs"
          subtitle="Active and past program enrollments"
          icon={ClipboardList}
          right={
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
              {programs.length} Programs
            </span>
          }
        >
          {programs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[350px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 pl-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500 w-16">
                      Sr. No.
                    </th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Program
                    </th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Duration
                    </th>
                    <th className="pb-2 pr-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="h-22">
                  {programs.map((p, idx) => (
                    <tr
                      key={p.program_id}
                      className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-2.5 pl-2 align-middle text-[11px] font-bold text-slate-400">
                        {(idx + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="py-2.5 align-middle">
                        <div className="text-xs font-semibold text-slate-900">
                          {p.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          Assigned {fmtDate(p.assigned_at)}
                        </div>
                      </td>
                      <td className="py-2.5 align-middle text-xs">
                        {p.start_date ? (
                          `${fmtDate(p.start_date)} – ${fmtDate(p.end_date)}`
                        ) : (
                          <span className="text-slate-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-2 align-middle">
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
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No Enrolled Programs"
              subtitle="This user is not enrolled in any programs."
            />
          )}
        </Card>
      </div>

      <Dialog open={editFitzoneOpen} onOpenChange={setEditFitzoneOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <EditFitzoneDialogForm
            data={selectedFitzone}
            onClose={() => setEditFitzoneOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
