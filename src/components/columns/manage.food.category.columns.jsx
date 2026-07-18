import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { BASE_URL } from "@/services/api-endpoints/base.url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getManageFoodCategoryColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        SR.No
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => (
      <div className="px-1 text-left font-bold text-[11px] text-foreground/90">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Category Name
      </div>
    ),
    size: 250,
    minSize: 250,
    cell: ({ row }) => (
      <span className="font-semibold text-slate-700 text-[11px] tracking-tight">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Category Icon
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.image ? (
          <img
            src={`${BASE_URL.replace("/api", "")}/${row.original.image}`}
            alt={row.original.name}
            className="w-8 h-8 object-contain rounded-md bg-slate-50 border border-slate-100"
          />
        ) : (
          <span className="text-xs text-slate-400">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Created At
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-700 text-left">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Updated At
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-700 text-left">
        {row.original.updated_at
          ? new Date(row.original.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "manage",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Manage
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          onClick={() =>
            handleAction && handleAction(row.original, "manage-food")
          }
          className="bg-app-primary2 hover:bg-app-primary5 text-white h-7 px-4 text-[10px] font-medium rounded shadow-sm"
        >
          Manage Food
        </Button>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Action
      </div>
    ),
    size: 120,
    minSize: 120,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
              >
                <MoreVertical className="h-4 w-4 text-foreground/90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 p-2 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-brand-blue font-semibold text-xs "
                onClick={() =>
                  handleAction && handleAction(row.original, "edit")
                }
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleAction && handleAction(row.original, "delete")
                }
                className="text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg py-2 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
