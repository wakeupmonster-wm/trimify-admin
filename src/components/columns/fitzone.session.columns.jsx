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

export const getManageFitzoneSessionColumns = (onAction) => [
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
      <div className="text-left px-1 font-bold text-[11px] text-foreground/90">
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
    size: 120,
    minSize: 100,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-700">
        {row.original.created_at
          ? dayjs(row.original.created_at).format("DD MMM YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Session Title
      </div>
    ),
    size: 200,
    minSize: 200,
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.title || "-"}
      </span>
    ),
  },
  {
    accessorKey: "session_category",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Session Category
      </div>
    ),
    size: 200,
    minSize: 200,
    cell: ({ row }) => {
      // It might be a nested object or a string depending on the API.
      const categoryName = row.original.workoutsession?.title || "N/A";
      return (
        <span className="font-medium text-slate-600 text-[11px] tracking-tight">
          {categoryName}
        </span>
      );
    },
  },
  {
    accessorKey: "video",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Video
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const hasVideo = !!row.original.video || !!row.original.video_url;
      return (
        <span className="font-medium text-[11px] tracking-tight">
          {hasVideo ? "Available" : "Not Available"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const isActive =
        row.original.status === "Active" ||
        row.original.status === true ||
        row.original.status === 1;
      return (
        <div className="flex justify-center">
          <button
            onClick={() =>
              onAction && onAction(row.original, "toggle-status", !isActive)
            }
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? "bg-app-primary2" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                isActive ? "transform translate-x-5" : ""
              }`}
            />
          </button>
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
    size: 100,
    minSize: 100,
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
            <DropdownMenuContent
              align="end"
              className="w-40 p-2 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-brand-blue font-semibold text-xs "
                onClick={() => onAction && onAction(row.original, "edit")}
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600 font-semibold text-xs"
                onClick={() => onAction && onAction(row.original, "delete")}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
