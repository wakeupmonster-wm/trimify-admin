import { Button } from "@/components/ui/button";

export const getManageProgramDetailsColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        S.No
      </div>
    ),
    size: 60,
    cell: ({ row }) => (
      <div className="text-left font-bold text-[11px] text-foreground/90">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Manage
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Action
      </div>
    ),
    size: 150,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          onClick={() => handleAction && handleAction(row.original.id)}
          className="bg-brand-blue hover:bg-brand-hoverBlue text-white h-7 px-4 text-[10px] font-medium rounded shadow-sm"
        >
          Manage
        </Button>
      </div>
    ),
  },
];
