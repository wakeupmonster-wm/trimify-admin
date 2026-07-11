import React from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilters, DataTableActiveChips } from "@/components/shared/datatable";
import { GENDER_OPTIONS } from "@/constants/gender.options";

export default function UserDataTables({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search by nickname, email or phone...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  meta,
  filters,
}) {
  const navigate = useNavigate();

  const handleClearAll = () => {
    if (filters.setAccountStatus) {
      filters.setAccountStatus("");
      filters.setIsDeactivated(undefined);
      filters.setIsScheduledForDeletion(undefined);
      filters.setLast24HR(undefined);
      filters.setIsGhosting(undefined);
    }
    if (filters.setIsPremium) filters.setIsPremium(undefined);
    if (filters.setGender) filters.setGender("");
    
    if (setGlobalFilter) setGlobalFilter("");
    if (filters.setPagination) filters.setPagination({ pageIndex: 0, pageSize: 10 });
    else if (onPaginationChange) onPaginationChange((p) => ({ ...p, pageIndex: 0 }));

    sessionStorage.removeItem("userManagementPagination");
    sessionStorage.removeItem("userManagementGlobalFilter");
    sessionStorage.removeItem("userManagementAccountStatus");
    sessionStorage.removeItem("userManagementIsPremium");
    sessionStorage.removeItem("userManagementLast24HR");
    sessionStorage.removeItem("userManagementGender");
    sessionStorage.removeItem("userManagementIsDeactivated");
    sessionStorage.removeItem("userManagementIsScheduledForDeletion");
    sessionStorage.removeItem("userManagementIsGhosting");
    sessionStorage.removeItem("userManagementPreset");
    sessionStorage.removeItem("userManagementFrom");
    sessionStorage.removeItem("userManagementTo");
  };

  const filterConfig = [];

  if (filters.setAccountStatus) {
    filterConfig.push({
      type: "checkbox-group",
      id: "accountStatusGroup",
      label: "Account Status",
      getDisplayValue: (options) => {
        const active = options.find(o => o.value === true || (typeof o.value === "string" && o.value !== ""));
        return active ? active.label : "All Status";
      },
      options: [
        { id: "status_active", label: "Active", value: filters.accountStatus === "active", onChange: () => { filters.setAccountStatus(filters.accountStatus === "active" ? "" : "active"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
        { id: "status_banned", label: "Banned", value: filters.accountStatus === "banned", onChange: () => { filters.setAccountStatus(filters.accountStatus === "banned" ? "" : "banned"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
        { id: "status_suspended", label: "Suspended", value: filters.accountStatus === "suspended", onChange: () => { filters.setAccountStatus(filters.accountStatus === "suspended" ? "" : "suspended"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } }
      ],
      groups: [
        {
          label: "Account Status",
          options: [
            { id: "status_active", label: "Active", value: filters.accountStatus === "active", onChange: () => { filters.setAccountStatus(filters.accountStatus === "active" ? "" : "active"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "status_banned", label: "Banned", value: filters.accountStatus === "banned", onChange: () => { filters.setAccountStatus(filters.accountStatus === "banned" ? "" : "banned"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "status_suspended", label: "Suspended", value: filters.accountStatus === "suspended", onChange: () => { filters.setAccountStatus(filters.accountStatus === "suspended" ? "" : "suspended"); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } }
          ]
        },
        {
          options: [
            { id: "last24", label: "Joined last 24Hr", value: filters.last24HR, onChange: () => { filters.setLast24HR(filters.last24HR === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "ghosting", label: "Ghosted Users", value: filters.isGhosting, onChange: () => { filters.setIsGhosting(filters.isGhosting === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "deactivated", label: "Deactivated", value: filters.isDeactivated, onChange: () => { filters.setIsDeactivated(filters.isDeactivated === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "deletion", label: "Deletion", value: filters.isScheduledForDeletion, onChange: () => { filters.setIsScheduledForDeletion(filters.isScheduledForDeletion === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } }
          ]
        }
      ]
    });
  }

  if (filters.setIsPremium) {
    filterConfig.push({
      type: "checkbox-group",
      id: "planGroup",
      label: "Plan Type",
      getDisplayValue: () => {
        if (filters.isPremium === true) return "Premium";
        if (filters.isPremium === false) return "Free";
        return "All Plans";
      },
      options: [
        { id: "premium", label: "Premium", value: filters.isPremium === true, onChange: () => { filters.setIsPremium(filters.isPremium === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
        { id: "free", label: "Free", value: filters.isPremium === false, onChange: () => { filters.setIsPremium(filters.isPremium === false ? undefined : false); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } }
      ],
      groups: [
        {
          label: "Plan Type",
          options: [
            { id: "premium", label: "Premium Only", value: filters.isPremium === true, onChange: () => { filters.setIsPremium(filters.isPremium === true ? undefined : true); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } },
            { id: "free", label: "Free Only", value: filters.isPremium === false, onChange: () => { filters.setIsPremium(filters.isPremium === false ? undefined : false); onPaginationChange?.((p) => ({ ...p, pageIndex: 0 })); } }
          ]
        }
      ]
    });
  }

  if (filters.setGender) {
    filterConfig.push({
      type: "select",
      id: "gender",
      label: "Gender",
      value: filters.gender,
      onChange: (v) => {
        filters.setGender(v);
        onPaginationChange?.((p) => ({ ...p, pageIndex: 0 }));
      },
      options: GENDER_OPTIONS,
      getDisplayValue: (val) => {
        const opt = GENDER_OPTIONS.find(o => o === val);
        return opt ? opt.replace("-", " ") : val;
      }
    });
  }

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
        onPaginationChange?.((p) => ({ ...p, pageIndex: 0 }));
      }}
      isLoading={isLoading}
      meta={meta}
      itemName="users"
      toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
      activeFiltersChildren={<DataTableActiveChips filterConfig={filterConfig} onClearAll={handleClearAll} />}
      onRowClick={(row) => {
        navigate(`/admin/management/users-management/view-profile`, {
          state: { userId: row.original._id },
        });
      }}
    />
  );
}
