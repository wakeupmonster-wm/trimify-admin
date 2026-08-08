import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Edit3 } from "lucide-react";

export const getManageFitzoneDetailsColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 50,
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
        Section
      </div>
    ),
    size: 200,
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
    size: 350,
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
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <div className="flex justify-center">
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
              onClick={() => handleAction && handleAction(row.original.id)}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
