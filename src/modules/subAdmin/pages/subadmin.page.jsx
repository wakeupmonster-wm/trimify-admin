import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { LuUserRoundCog } from "react-icons/lu";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import {
  Plus,
  FileText,
  Users,
  UserCheck,
  Shield,
  ShieldAlert,
  Download,
} from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
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

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((str) => `"${str}"`).join(",")),
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
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.subAdmin);

  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const list = subAdmins || [];
    return {
      total: pagination?.total || list.length,
      active: list.filter((s) => s.status === "Active").length,
      subAdmins: list.filter(
        (s) => s.role === 0 || s.role_name === "Sub-Admin User",
      ).length,
      whiteListing: list.filter(
        (s) => s.role === 1 || s.role_name === "WhiteListing User",
      ).length,
    };
  }, [subAdmins, pagination]);

  const kpiItems = [
    {
      icon: Users,
      label: "Total Admins",
      value: kpiStats.total.toLocaleString(),
      description: "Total registered users",
      tone: "blue",
    },
    {
      icon: UserCheck,
      label: "Active Accounts",
      value: kpiStats.active.toLocaleString(),
      description: "Currently active",
      tone: "emerald",
    },
    {
      icon: Shield,
      label: "Sub-Admin Users",
      value: kpiStats.subAdmins.toLocaleString(),
      description: "Tap to filter",
      tone: "indigo",
      onClick: () => setRoleFilter("0"),
    },
    {
      icon: ShieldAlert,
      label: "WhiteListing Users",
      value: kpiStats.whiteListing.toLocaleString(),
      description: "Tap to filter",
      tone: "rose",
      onClick: () => setRoleFilter("1"),
    },
  ];

  useEffect(() => {
    dispatch(
      fetchSubAdminList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        role: roleFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    roleFilter,
  ]);

  const handleAction = async (row, action, checked) => {
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
  };

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const rowId = toggleModal.rowData.id || toggleModal.rowData._id;
    const status = toggleModal.targetStatus ? "Active" : "Inactive";
    const result = await dispatch(toggleSubAdminStatus({ id: rowId, status }));
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
    setToggleModal({ open: false, rowData: null, targetStatus: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    const rowId = deleteModal.rowData.id || deleteModal.rowData._id;
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
    setDeleteModal({ open: false, rowData: null });
  };

  const columns = useMemo(() => getSubAdminColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // Local fallback filtering in case the backend ignores the `role` parameter
  const filteredSubAdmins = useMemo(() => {
    if (!roleFilter) return subAdmins || [];
    return (subAdmins || []).filter((admin) => {
      // Handle both string and integer matching
      if (String(admin.role) === String(roleFilter)) return true;
      if (roleFilter === "0" && admin.role === "Sub-Admin User") return true;
      if (roleFilter === "1" && admin.role === "WhiteListing User") return true;
      return false;
    });
  }, [subAdmins, roleFilter]);

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
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
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
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Sub Admin</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadCSV(subAdmins)}
                className="flex-1 h-10 border-slate-300/60 bg-slate-50 hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white hover:border-app-primary2 text-xs font-medium transition-all active:scale-95 px-4 flex items-center justify-center gap-1.5"
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
                onClearAll={() => setRoleFilter("")}
              />
            }
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this sub-admin? This action cannot be undone."
      />

      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() =>
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this sub-admin to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default SubAdminManagementPage;
