import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { UserCog, Plus, FileText } from "lucide-react";
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
    const createdAt = dateValue && !isNaN(new Date(dateValue).getTime())
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
  const { subAdmins, loading, pagination: serverPagination } = useSelector((state) => state.subAdmin);

  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ open: false, rowData: null });

  useEffect(() => {
    dispatch(
      fetchSubAdminList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        role: roleFilter,
      }),
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, debouncedSearchTerm, roleFilter ]);

  const handleAction = async (row, action, checked) => {
    const rowId = row.id || row._id;
    if (action === "toggle-status") {
      console.log("Toggle status for:", rowId, "to", checked);
      const status = checked ? "Active" : "Inactive";
      dispatch(toggleSubAdminStatus({ id: rowId, status }));
    } else if (action === "edit") {
      navigate("/admin/sub-admin-management/edit", {
        state: { editData: row },
      });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    const rowId = deleteModal.rowData.id || deleteModal.rowData._id;
    const result = await dispatch(deleteSubAdmin(rowId));
    if (deleteSubAdmin.fulfilled.match(result)) {
      dispatch(
        fetchSubAdminList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Sub Admin Management"
              icon={<UserCog className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Manage sub-administrators and their access roles."
            />

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                onClick={() => navigate("/admin/sub-admin-management/add")}
                className="w-full xs:w-auto bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Sub Admin
              </Button>
              <Button
                onClick={() => downloadCSV(subAdmins)}
                className="w-full xs:w-auto bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </Header>

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
          searchPlaceholder="Search sub admins..."
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

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this sub-admin? This action cannot be undone."
      />
    </Container>
  );
};

export default SubAdminManagementPage;
