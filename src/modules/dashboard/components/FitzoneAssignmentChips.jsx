import { UsersRound } from "lucide-react";

const FitzoneAssignmentChips = ({ details = [] }) => {
  if (!details.length) return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-sky-50/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
          <UsersRound className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-xs font-bold text-slate-800">Assigned Fitzones</p>
          <p className="text-[10px] font-medium text-slate-500">Each chip shows the unique users assigned to that Fitzone in the selected period.</p>
        </div>
      </div>
      <div className="space-y-2">
        {details.map((period) => (
          <div key={period.period} className="flex flex-wrap items-center gap-2">
            <span className="min-w-[54px] text-[10px] font-bold uppercase tracking-wide text-violet-700">
              {period.period}
            </span>
            {period.fitzones.map((fitzone) => (
              <span
                key={`${period.period}-${fitzone.fitzone_id}`}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm"
                title={`${fitzone.title}: ${fitzone.assigned_users} users assigned`}
              >
                <span className="max-w-[150px] truncate">{fitzone.title}</span>
                <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
                  {Number(fitzone.assigned_users || 0).toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitzoneAssignmentChips;
