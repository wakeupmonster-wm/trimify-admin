import React from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilters, DataTableActiveChips } from "@/components/shared/datatable";

export default function KYCVerificationDataTable({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search verifications...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  meta,
  filters,
}) {
  const navigate = useNavigate();

  const handleClearAll = () => {
    filters.setStatusFilter("");
    filters.setSortBy("");
    if (setGlobalFilter) setGlobalFilter("");
    if (filters.setPagination) filters.setPagination({ pageIndex: 0, pageSize: 10 });
    else onPaginationChange((p) => ({ ...p, pageIndex: 0 }));

    sessionStorage.removeItem("kycVerificationStatusFilter");
    sessionStorage.removeItem("kycVerificationSortBy");
    sessionStorage.removeItem("kycVerificationGlobalFilter");
    sessionStorage.removeItem("kycVerificationPagination");
  };

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Verification Status",
      value: filters.statusFilter,
      onChange: (v) => {
        filters.setStatusFilter(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Not Started", value: "not_started" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" }
      ]
    },
    {
      type: "select",
      id: "sortBy",
      label: "Sort Order",
      value: filters.sortBy,
      onChange: (v) => {
        filters.setSortBy(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Alphabetical", value: "alphabetical" }
      ]
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
        setGlobalFilter(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      }}
      isLoading={isLoading}
      meta={meta}
      itemName="verifications"
      toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
      activeFiltersChildren={<DataTableActiveChips filterConfig={filterConfig} onClearAll={handleClearAll} />}
      onRowClick={(row) => {
        navigate(`/admin/management/users-management/view-profile`, {
          state: { userId: row.original.userId },
        });
      }}
    />
  );
}
