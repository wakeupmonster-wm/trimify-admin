import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";

export const getManageFitzoneCategoryColumns = (onAction) => [
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
    accessorKey: "created_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Created At
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-700">
        {row.original.created_at ? dayjs(row.original.created_at).format("DD MMM YYYY") : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Category Name
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.title || "-"}
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
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px] tracking-tight">
        {row.original.description || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "icon",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Icon
      </div>
    ),
    cell: ({ row }) => {
      const iconUrl = row.original.icon || row.original.icon_url;
      return (
        <div className="flex justify-center">
          {iconUrl ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
              <img
                src={iconUrl}
                alt="Icon"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = '<span class="text-[10px] text-slate-400">N/A</span>';
                }}
              />
            </div>
          ) : (
            <span className="text-[10px] text-slate-400">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Action
      </div>
    ),
    size: 80,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100 data-[state=open]:bg-slate-100"
              >
                <MoreVertical className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 z-[100] bg-white border-slate-200 shadow-lg">
              <DropdownMenuLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-brand-blue focus:text-brand-blue font-semibold text-xs"
                onClick={() => onAction && onAction(row.original, "edit")}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Category</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-red-50 focus:text-red-600 font-semibold text-xs text-red-500 transition-colors"
                onClick={() => onAction && onAction(row.original, "delete")}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
