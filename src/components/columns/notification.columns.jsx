import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const getNotificationColumns = () => [
  {
    id: "sno",
    header: () => (
      <div className="w-16 text-center text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 60,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-16 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Title
      </div>
    ),
    size: 250,
    minSize: 200,
    cell: ({ row }) => (
      <div className="font-bold text-slate-700 text-[11px] tracking-tight truncate max-w-[250px]" title={row.original.title}>
        {row.original.title || "-"}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Message
      </div>
    ),
    size: 350,
    minSize: 300,
    cell: ({ row }) => (
      <div className="font-medium text-slate-600 text-[11px] tracking-tight truncate max-w-[350px]" title={row.original.message}>
        {row.original.message || "-"}
      </div>
    ),
  },
  {
    accessorKey: "target_audience",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Target Audience
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const audience = row.original.target_audience;
      if (!audience) return <span className="text-slate-400 text-[11px]">-</span>;
      return (
        <Badge variant="outline" className="text-[10px] font-bold capitalize bg-slate-50 border-slate-200 text-slate-600">
          {audience}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Sent Date
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const dateValue = row.original.created_at;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-[11px]">-</span>;
      }
      return (
        <div className="text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy, p")}
        </div>
      );
    },
  },
];
