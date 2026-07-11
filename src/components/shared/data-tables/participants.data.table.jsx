import React from "react";
import { DataTable, DataTableFilters } from "@/components/shared/datatable";

export default function ParticipantsDataTables({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search participants...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  filters,
}) {
  const filterConfig = [
    {
      type: "date",
      id: "date",
      label: "Date",
      value: filters?.date,
      onChange: (v) => {
        if (filters?.setDate) {
          filters.setDate(v);
        }
        if (onPaginationChange) {
          onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
        }
      },
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={rowCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      searchPlaceholder={searchPlaceholder}
      globalFilter={globalFilter}
      setGlobalFilter={(v) => {
        if (setGlobalFilter) setGlobalFilter(v);
        if (onPaginationChange) onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      }}
      isLoading={isLoading}
      itemName="participants"
      toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
    />
  );
}
