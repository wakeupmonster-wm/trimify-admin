import { Button } from "@/components/ui/button";

export const getManageFitzoneDetailsColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        SR.No
      </div>
    ),
    size: 80,
    minSize: 60,
    cell: ({ row }) => (
      <div className="w-10 px-1 text-left font-bold text-[11px] text-foreground/90">
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
    size: 250,
    minSize: 150,
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Description
      </div>
    ),
    size: 400,
    minSize: 200,
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px] tracking-tight">
        {row.original.description}
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
    minSize: 100,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          onClick={() => handleAction && handleAction(row.original.id)}
          className="bg-app-primary2 hover:bg-app-primary5 text-white h-7 px-4 text-[10px] font-medium rounded shadow-sm"
        >
          Manage
        </Button>
      </div>
    ),
  },
];
