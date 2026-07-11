import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataTable, DataTableFilters, DataTableActiveChips } from "@/components/shared/datatable";
import { GENDER_OPTIONS } from "@/constants/gender.options";

export default function FakeProfileDataTable({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search profiles...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  meta,
  filters,
  sorting,
  setSorting,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClearAll = () => {
    filters.setStatusFilter("");
    filters.setGenderFilter("");
    filters.setPlanFilter("");
    if (setGlobalFilter) setGlobalFilter("");
    if (setSorting) setSorting([]);
    
    onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
    
    sessionStorage.removeItem("fakeProfileManagementSearch");
    sessionStorage.removeItem("fakeProfileManagementStatusFilter");
    sessionStorage.removeItem("fakeProfileManagementGenderFilter");
    sessionStorage.removeItem("fakeProfileManagementPlanFilter");
    sessionStorage.removeItem("fakeProfileManagementSorting");
    sessionStorage.removeItem("fakeProfileManagementPagination");
  };

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Account Status",
      value: filters.statusFilter,
      onChange: (v) => {
        filters.setStatusFilter(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Active", value: "active" },
        { label: "Deactivated", value: "deactivated" }
      ]
    },
    {
      type: "select",
      id: "genderFilter",
      label: "Gender",
      value: filters.genderFilter,
      onChange: (v) => {
        filters.setGenderFilter(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      },
      options: GENDER_OPTIONS,
      getDisplayValue: (val) => {
        const opt = GENDER_OPTIONS.find(o => o === val);
        return opt ? opt.replace("-", " ") : val;
      }
    },
    {
      type: "select",
      id: "planFilter",
      label: "Subscription Plan",
      value: filters.planFilter,
      onChange: (v) => {
        filters.setPlanFilter(v);
        onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Premium", value: "premium" },
        { label: "Free", value: "free" }
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
      itemName="fake profiles"
      toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
      activeFiltersChildren={<DataTableActiveChips filterConfig={filterConfig} onClearAll={handleClearAll} />}
      onRowClick={(row) => {
        navigate(`/admin/management/users-management/view-profile`, {
          state: {
            userId: row.original.user?.profile?.id,
            source: "fake-profiles",
            from: location.pathname || "/admin/management/fake-profiles",
          },
        });
      }}
    />
  );
}
