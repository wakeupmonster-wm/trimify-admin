import React from "react";
import DashboardHead from "@/components/shared/dashboard.head";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

/**
 * Reusable drill-down table widget for the dashboard's list/table row —
 * recent transactions, expiring plans, abandoned checkouts, sub-admin
 * roster, recent notifications all share this shell so they read as one
 * system. Pass `actionLabel` + `onAction(row)` for the "actionable" lists
 * (renew/contact, follow-up) called out in the design brief.
 */
const DashboardTableCard = ({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-700",
  iconBg = "bg-slate-50",
  columns = [],
  rows = [],
  emptyMessage = "Nothing to show here.",
  actionLabel,
  onAction,
  footerStat,
}) => {
  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
        />
      </div>

      <div className="flex-1 overflow-x-auto">
        <Table className="min-w-[520px]">
          <TableHeader className="bg-slate-50/60 !px-5">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 h-10 ${col.align === "right" ? "text-right" : "text-left"} ${col.width ? col.width : ""}`}
                >
                  {col.label}
                </TableHead>
              ))}
              {actionLabel && (
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 h-10">
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionLabel ? 1 : 0)}
                  className="h-24 text-center text-xs text-slate-400 font-medium"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={row.list_key ?? row.id ?? idx} className="hover:bg-slate-50/70">
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={`py-2.5 text-xs font-medium text-slate-700 ${col.align === "right" ? "text-right" : "text-left"} ${col.width ? col.width : ""}`}
                    >
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </TableCell>
                  ))}
                  {actionLabel && (
                    <TableCell className="py-2.5 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onAction?.(row)}
                        className="h-7 text-[11px] px-2.5"
                      >
                        {actionLabel}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {footerStat && (
        <div className="px-6 py-2.5 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-semibold text-slate-500">{footerStat.label}</span>
          <span className="text-xs font-extrabold text-slate-800">{footerStat.value}</span>
        </div>
      )}
    </div>
  );
};

export default DashboardTableCard;
