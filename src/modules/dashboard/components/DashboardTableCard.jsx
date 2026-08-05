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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Eye } from "lucide-react";

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
      <div className="pt-5 pb-4 px-6 border-b border-slate-100">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
        />
      </div>

      <div className="flex-1 w-full min-h-0 overflow-auto">
        <Table className="min-w-[700px] xl:min-w-full">
          <TableHeader>
            <TableRow className="border-y border-slate-300/60 bg-app-primary2/5 hover:bg-app-primary2/5">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-[10px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-4 last:pr-6 whitespace-nowrap ${col.align === "right" ? "text-right" : "text-left"} ${col.width ? col.width : ""}`}
                >
                  {col.label}
                </TableHead>
              ))}
              {actionLabel && (
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 h-10 first:pl-6 last:pr-6 whitespace-nowrap">
                  <div className="flex justify-start w-full">Action</div>
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
                <TableRow
                  key={row.list_key ?? row.id ?? idx}
                  className={`hover:bg-slate-100/50 border-y border-slate-200/60 last:border-0 transition-colors ${onAction ? "cursor-pointer" : ""}`}
                  onClick={() => onAction && onAction(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={`py-2.5 text-xs font-medium text-slate-700 first:pl-6 last:pr-6 whitespace-nowrap ${col.align === "right" ? "text-right" : "text-left"} ${col.width ? col.width : ""}`}
                    >
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </TableCell>
                  ))}
                  {actionLabel && (
                    <TableCell className="py-3 first:pl-6 last:pr-9 w-1/12">
                      <div className="flex items-center justify-center w-full">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
                            >
                              <Ellipsis className="h-4 w-4 text-foreground/90" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm bg-white"
                          >
                            <DropdownMenuLabel className="text-[11px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs"
                              onClick={() => onAction?.(row)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {actionLabel}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {footerStat && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-semibold text-slate-500">
            {footerStat.label}
          </span>
          <span className="text-xs font-extrabold text-slate-800">
            {footerStat.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardTableCard;
