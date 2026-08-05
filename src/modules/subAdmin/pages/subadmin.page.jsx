import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { LuUserRoundCheck, LuUserRoundCog, LuUsersRound } from "react-icons/lu";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import {
  Plus,
  Users,
  UserCheck,
  Shield,
  ShieldAlert,
  Download,
} from "lucide-react";
import Header from "@/components/common/header";
import ExportLoadingModal from "@/components/shared/ExportLoadingModal";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import { getSubAdminColumns } from "@/components/columns/sub.admin.columns";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchSubAdminList,
  toggleSubAdminStatus,
  deleteSubAdmin,
} from "../store/sub.admin.slice";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../../../hooks/useDebounce";

// Simple utility to convert an array of objects to CSV
const downloadCSV = (data, filename = "sub_admins.csv") => {
  if (!data || !data.length) return;
  const headers = [
    "S.No",
    "Created At",
    "User Name",
    "Email ID",
    "Hospital/Clinic Name",
    "Designation",
    "Country",
    "Role",
    "Status",
  ];
  const rows = data.map((item, index) => {
    let displayRole = "-";
    if (item.role == 1) displayRole = "WhiteListing User";
    else if (item.role == 0) displayRole = "Sub-Admin User";
    else if (item.role) displayRole = item.role;

    const dateValue = item.created_at;
    const createdAt =
      dateValue && !isNaN(new Date(dateValue).getTime())
        ? new Date(dateValue).toLocaleDateString()
        : "-";

    return [
      index + 1,
      createdAt,
      item.name || "-",
      item.email || "-",
      item.hospital || "-",
      item.designation || "-",
      item.location || "-",
      displayRole,
      item.status === "Active" || item.status === true ? "Active" : "Inactive",
    ];
  });

  // Excel auto-detects quoted date-like strings and converts them to real
  // dates, which then render as "####" when the column is too narrow. Wrap
  // the "Created At" column in an Excel text-literal formula so it's kept
  // as plain text instead of being reinterpreted.
  const escapeCsvField = (value, forceText = false) => {
    const str = String(value ?? "");
    const raw = forceText && str !== "-" ? `="${str}"` : str;
    return `"${raw.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value, i) => escapeCsvField(value, i === 1)).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SubAdminManagementPage = () => {
  const dispatch = useDispatch();
  const {
    subAdmins,
    kpis,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.subAdmin);

  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportCSV = () => {
    setExportLoading(true);
    setExportProgress(0);

    const duration = 1500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setExportProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          downloadCSV(subAdmins);
          setTimeout(() => {
            setExportLoading(false);
            setExportProgress(0);
          }, 2000);
        }, 300);
      }
    }, intervalTime);
  };

  // KPIs come straight from the backend (`response.kpis`) — they're computed
  // over the full sub_admins table regardless of search/role/status/page, so
  // they must NOT be recalculated from the currently-loaded page of `subAdmins`.
  const kpiItems = [
    {
      icon: LuUsersRound,
      label: "Total Admins",
      value: (kpis?.total ?? 0).toLocaleString(),
      description: "Total registered users",
      tone: "blue",
    },
    {
      icon: LuUserRoundCheck,
      label: "Active Accounts",
      value: (kpis?.active ?? 0).toLocaleString(),
      description: "Tap to filter",
      tone: "emerald",
      onClick: () => setStatusFilter("Active"),
      isSelected: statusFilter === "Active",
    },
    {
      icon: Shield,
      label: "Sub-Admin Users",
      value: (kpis?.subAdminUsers ?? 0).toLocaleString(),
      description: "Tap to filter",
      tone: "indigo",
      onClick: () => setRoleFilter(roleFilter === "0" ? "" : "0"),
      isSelected: roleFilter === "0",
    },
    {
      icon: ShieldAlert,
      label: "WhiteListing Users",
      value: (kpis?.whiteListingUsers ?? 0).toLocaleString(),
      description: "Tap to filter",
      tone: "rose",
      onClick: () => setRoleFilter(roleFilter === "1" ? "" : "1"),
      isSelected: roleFilter === "1",
    },
  ];

  useEffect(() => {
    dispatch(
      fetchSubAdminList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        role: roleFilter,
        status: statusFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    roleFilter,
    statusFilter,
  ]);

  const handleAction = useCallback(
    async (row, action, checked) => {
      const rowId = row.id || row._id;
      if (action === "toggle-status") {
        setToggleModal({ open: true, rowData: row, targetStatus: checked });
      } else if (action === "edit") {
        navigate("/admin/sub-admin-management/edit", {
          state: { editData: row },
        });
      } else if (action === "delete") {
        setDeleteModal({ open: true, rowData: row });
      }
    },
    [navigate],
  );

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const rowId = toggleModal.rowData.id || toggleModal.rowData._id;
    const status = toggleModal.targetStatus ? "Active" : "Inactive";
    setIsUpdating(true);

    try {
      const result = await dispatch(
        toggleSubAdminStatus({ id: rowId, status }),
      );

      if (toggleSubAdminStatus.fulfilled.match(result)) {
        toast.success("Sub-admin status updated successfully.");
        dispatch(
          fetchSubAdminList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            role: roleFilter,
          }),
        );
      } else {
        toast.error("Failed to update status.");
      }
    } finally {
      setIsUpdating(false);
      setToggleModal({ open: false, rowData: null, targetStatus: false });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    const rowId = deleteModal.rowData.id || deleteModal.rowData._id;
    setIsDeleting(true);

    try {
      const result = await dispatch(deleteSubAdmin(rowId));
      if (deleteSubAdmin.fulfilled.match(result)) {
        toast.success("Sub-admin deleted successfully.");
        dispatch(
          fetchSubAdminList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            role: roleFilter,
          }),
        );
      } else {
        toast.error("Failed to delete sub-admin.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, rowData: null });
    }
  };

  const columns = useMemo(
    () => getSubAdminColumns(handleAction),
    [handleAction],
  );

  // Check if the backend is doing manual pagination.
  // If serverPagination exists, it's server-paginated.
  const isManual = !!serverPagination;

  // Local fallback filtering in case the backend ignores the `role`/`status` parameters
  const filteredSubAdmins = useMemo(() => {
    let list = subAdmins || [];
    if (roleFilter) {
      list = list.filter((admin) => {
        // Handle both string and integer matching
        if (String(admin.role) === String(roleFilter)) return true;
        if (roleFilter === "0" && admin.role === "Sub-Admin User") return true;
        if (roleFilter === "1" && admin.role === "WhiteListing User")
          return true;
        return false;
      });
    }
    if (statusFilter) {
      list = list.filter(
        (admin) =>
          String(admin.status).toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    return list;
  }, [subAdmins, roleFilter, statusFilter]);

  const filterConfig = [
    {
      type: "select",
      id: "roleFilter",
      label: "Role",
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { label: "Sub-Admin User", value: "0" },
        { label: "WhiteListing User", value: "1" },
      ],
      placeholder: "All Roles",
      getDisplayValue: (val) =>
        val === "0"
          ? "Sub-Admin User"
          : val === "1"
            ? "WhiteListing User"
            : "All Roles",
    },
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
      placeholder: "All Status",
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Sub Admin Management"
                icon={
                  <LuUserRoundCog className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading="Manage sub-administrators and their access roles."
              />
            </div>

            <div className="flex flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                onClick={() => navigate("/admin/sub-admin-management/add")}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-3.5 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Sub Admin</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="flex-1 h-10 border-slate-300/60 bg-slate-50 hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white hover:border-app-primary2 text-xs font-medium transition-all active:scale-95 px-3.5 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Export CSV</span>
              </Button>
            </div>
          </div>
        </Header>

        <ModuleKpiRow
          items={kpiItems}
          loading={loading && !subAdmins?.length}
        />

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={filteredSubAdmins}
            rowCount={
              isManual ? serverPagination.total : filteredSubAdmins.length
            }
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by user name, email, designation..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                }}
              />
            }
          />
        </div>
      </div>

      <ExportLoadingModal
        exportLoading={exportLoading}
        exportProgress={exportProgress}
        setExportLoading={setExportLoading}
        setExportProgress={setExportProgress}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, rowData: null })
        }
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this sub-admin? This action cannot be undone."
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() =>
          !isUpdating &&
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this sub-admin to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
        loading={isUpdating}
      />
    </Container>
  );
};

export default SubAdminManagementPage;
