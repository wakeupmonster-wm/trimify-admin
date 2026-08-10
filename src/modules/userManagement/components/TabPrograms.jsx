import React, { useState } from "react";
import {
  Target,
  Activity,
  ClipboardList,
  Dumbbell,
  Pencil,
} from "lucide-react";
import { Pill, EmptyState } from "./UserProfileShared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditFitzoneDialogForm from "./profile/EditFitzoneDialogForm";
import DashboardHead from "@/components/shared/dashboard.head";

export function TabPrograms({ data }) {
  const { programs, fitzoneStatus, fmtDate } = data;
  const [editFitzoneOpen, setEditFitzoneOpen] = useState(false);
  const [selectedFitzone, setSelectedFitzone] = useState(null);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Fitzone Assignments Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
            <DashboardHead
              title="Fitzone Assignments"
              subtitle="Active Fitzone sessions and assignments"
              Icon={Dumbbell}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
            <span className="inline-flex items-center ml-auto sm:ml-0 w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
              {fitzoneStatus.length} Fitzones
            </span>
          </div>
          <div className="p-0 bg-white">
            {fitzoneStatus.length > 0 ? (
              <div className="flex flex-col w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-16">
                          SR.No
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Category
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Status
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Assigned
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fitzoneStatus.map((f, idx) => (
                        <tr
                          key={f.category_id}
                          className="transition-colors hover:bg-slate-50/50 even:bg-slate-50/30"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="text-[11px] font-semibold text-slate-900">
                              {f.category_title}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <Pill
                              tone={
                                f.status === "Active" ? "success" : "neutral"
                              }
                            >
                              {f.status || "Unknown"}
                            </Pill>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="text-[11px] font-medium text-slate-600">
                              {f.assigned_at ? fmtDate(f.assigned_at) : "—"}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-right">
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
              </div>
            ) : (
              <div className="p-8 pb-12">
                <EmptyState
                  icon={Activity}
                  title="No Fitzone Assignments"
                  subtitle="This user has no Fitzone assignments."
                />
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Programs Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
            <DashboardHead
              title="Enrolled Programs"
              subtitle="Active and past program enrollments"
              Icon={ClipboardList}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
            <span className="inline-flex items-center ml-auto sm:ml-0 w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
              {programs.length} Programs
            </span>
          </div>
          <div className="p-0 bg-white">
            {programs.length > 0 ? (
              <div className="flex flex-col w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-16">
                          SR.No
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Program
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Duration
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {programs.map((p, idx) => (
                        <tr
                          key={p.program_id}
                          className="transition-colors hover:bg-slate-50/50 even:bg-slate-50/30"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="text-[11px] font-semibold text-slate-900">
                              {p.title}
                            </div>
                            <div className="mt-0.5 text-[10px] text-slate-500">
                              Assigned {fmtDate(p.assigned_at)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-[11px] font-medium text-slate-600">
                            {p.start_date ? (
                              `${fmtDate(p.start_date)} – ${fmtDate(p.end_date)}`
                            ) : (
                              <span className="text-slate-500">
                                Not scheduled
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <Pill
                              tone={
                                p.status === "Active" ? "success" : "neutral"
                              }
                            >
                              {p.status}
                            </Pill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 pb-12">
                <EmptyState
                  icon={Target}
                  title="No Enrolled Programs"
                  subtitle="This user is not enrolled in any programs."
                />
              </div>
            )}
          </div>
        </div>
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
