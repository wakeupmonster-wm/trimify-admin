import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ArrowUpDown, Eye } from "lucide-react";

const CATEGORY_MAP = {
  PREMIUM_PLAN: { label: "Premium Plan", color: "text-brand-aqua" },
  SUPER_KEEN: { label: "Super Keen", color: "text-amber-600" },
  SUPERCHARGE: { label: "Super Charge", color: "text-amber-600" },
};

const TYPE_MAP = {
  SUBSCRIPTION: { label: "Subscription", color: "text-blue-600" },
  CONSUMABLE: { label: "Consumable", color: "text-amber-600" },
};

const Pill = ({ label, colorCls }) => (
  <span
    className={cn(
      "w-max inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
      colorCls,
    )}
  >
    {label}
  </span>
);

export const getProductsColumns = (onEdit, handleSort, sortCol, sortDir) => [
  {
    id: "sno",
    header: () => (
      <div className="text-foreground/80 px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-center flex items-center justify-center">
        Sr.No.
      </div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="text-center font-bold text-[11px] text-foreground/80">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "displayName",
    header: () => (
      <div
        className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1"
        onClick={() => handleSort("displayName")}
      >
        Name{" "}
        {sortCol === "displayName" &&
          (sortDir === "asc" ? (
            <ChevronUp className="w-3 h-3 text-brand-aqua" />
          ) : (
            <ChevronDown className="w-3 h-3 text-brand-aqua" />
          ))}
      </div>
    ),
    cell: ({ row }) => (
      <p className="text-xs font-bold text-slate-800">
        {row.original.displayName}
      </p>
    ),
  },
  {
    accessorKey: "type",
    header: () => (
      <div
        className="text-foreground/80 px-5 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1"
        onClick={() => handleSort("type")}
      >
        Type{" "}
        {sortCol === "type" &&
          (sortDir === "asc" ? (
            <ChevronUp className="w-3 h-3 text-brand-aqua" />
          ) : (
            <ChevronDown className="w-3 h-3 text-brand-aqua" />
          ))}
      </div>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const meta = TYPE_MAP[type] || { label: type, color: "text-slate-500" };
      return <Pill label={meta.label} colorCls={meta.color} />;
    },
  },
  {
    accessorKey: "category",
    header: () => (
      <div
        className="text-foreground/80 px-5 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1"
        onClick={() => handleSort("category")}
      >
        Category{" "}
        {sortCol === "category" &&
          (sortDir === "asc" ? (
            <ChevronUp className="w-3 h-3 text-brand-aqua" />
          ) : (
            <ChevronDown className="w-3 h-3 text-brand-aqua" />
          ))}
      </div>
    ),
    cell: ({ row }) => {
      const isSub = row.original.type === "SUBSCRIPTION";
      let catKey = row.original.category;
      if (!catKey) {
        if (isSub) {
          catKey = "PREMIUM_PLAN";
        } else {
          catKey = row.original.consumableType === "BOOST"
              ? "SUPERCHARGE" : row.original.consumableType || "SUPER_KEEN";
        }
      }
      const meta = CATEGORY_MAP[catKey] || {
        label: catKey,
        color: "text-slate-500",
      };
      return <Pill label={meta.label} colorCls={meta.color} />;
    },
  },
  {
    accessorKey: "displayPrice",
    header: () => (
      <div
        className="text-foreground/80 whitespace-nowrap px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1"
        onClick={() => handleSort("displayPrice")}
      >
        Ref. Price (AUD){" "}
        {sortCol === "displayPrice" &&
          (sortDir === "asc" ? (
            <ChevronUp className="w-3 h-3 text-brand-aqua" />
          ) : (
            <ChevronDown className="w-3 h-3 text-brand-aqua" />
          ))}
      </div>
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <span className="text-xs font-bold text-slate-800">
          {/* {product.currency || "AUD"}  */}
          {product.displayPrice ? `$${product.displayPrice}` : "—"}
        </span>
      );
    },
  },
  /* Apple ID - commented out
  {
    accessorKey: "appleProductId",
    header: () => (
      <div className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left flex items-center max-w-[120px]">
        Apple ID
      </div>
    ),
    cell: ({ row }) =>
      row.original.appleProductId ? (
        <span
          className="text-[10px] font-bold text-slate-600 truncate block max-w-[120px]"
          title={row.original.appleProductId}
        >
          {row.original.appleProductId}
        </span>
      ) : (
        <span className="text-[10px] text-slate-300 font-bold">—</span>
      ),
  },
  */
  /* Google ID - commented out
  {
    accessorKey: "googleProductId",
    header: () => (
      <div className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left flex items-center max-w-[120px]">
        Google ID
      </div>
    ),
    cell: ({ row }) =>
      row.original.googleProductId ? (
        <span
          className="text-[10px] font-bold text-slate-600 truncate block max-w-[120px]"
          title={row.original.googleProductId}
        >
          {row.original.googleProductId}
        </span>
      ) : (
        <span className="text-[10px] text-slate-300 font-bold">—</span>
      ),
  },
  */
  {
    accessorKey: "subtitle",
    header: () => (
      <div className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left flex items-center">
        Subtitle
      </div>
    ),
    cell: ({ row }) => {
      const subtitle = row.original.subtitle;
      return subtitle ? (
        <span className="text-xs font-bold text-slate-800">{subtitle}</span>
      ) : (
        <span className="text-xs font-bold text-slate-300">—</span>
      );
    },
  },
  {
    id: "sysBadge",
    header: () => (
      <div className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left flex items-center">
        Badge
      </div>
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div>
          <div className="w-max flex flex-col items-start gap-1.5">
            {product.badge && (
              <span className="text-[10px] font-bold text-slate-800 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 leading-none">
                {product.badge}
              </span>
            )}
            {/* {product.badgeText && (
              <span
                className="text-[10px] font-bold text-white px-2 py-0.5 rounded leading-none"
                style={{ backgroundColor: product.badgeColor }}
              >
                {product.badgeText}
              </span>
            )} */}
            {!product.badge && !product.badgeText && (
              <span className="text-[10px] text-slate-300 font-bold">—</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <div className="text-foreground/80 whitespace-nowrap px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left flex items-center">
        Status
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        className={cn(
          "text-[9px] font-black rounded-full px-2.5 py-0.5 border-none shadow-none uppercase tracking-widest transition-all duration-200 hover:scale-105",
          row.original.isActive
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-400",
        )}
      >
        {row.original.isActive ? "Active" : "Archived"}
      </Badge>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: ({ column }) => (
      <div className="flex items-center justify-center h-10 bg-slate-100/50">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] text-foreground/80 font-bold uppercase"
        >
          Order
          <ArrowUpDown className="svg text-muted-foreground" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-bold text-xs text-slate-500">
        {row.original.sortOrder || 0}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-foreground/80 px-6 uppercase font-bold h-10 bg-slate-100/50 text-[10px] text-center flex items-center justify-center">
        Action
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          className="h-8 w-8 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/5 transition-all duration-300 rounded-lg"
        >
          <Eye size={14} />
        </Button>
      </div>
    ),
  },
];
