import { format } from "date-fns";

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
    accessorKey: "createDate",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Create Date
      </div>
    ),
    size: 180,
    minSize: 180,
    cell: ({ row }) => {
      const dateValue = row.original.createDate;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-xs">-</span>;
      }
      return (
        <div className="text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Message
      </div>
    ),
    size: 300,
    minSize: 300,
    cell: ({ row }) => (
      <div className="font-medium text-slate-600 text-[11px] tracking-tight">
        {row.original.message || "-"}
      </div>
    ),
  },
];
