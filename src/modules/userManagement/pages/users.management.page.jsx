import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Users } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import { getUserManagementColumns } from "@/components/columns/user.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../store/user.slice";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";

const UsersManagementPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.usersManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchUsersList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        status: statusFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    statusFilter,
  ]);

  const handleAction = (row, action) => {
    if (action === "view") {
      navigate(`/admin/users/view-user/${row.id}`, {
        state: { userData: row },
      });
    } else {
      console.log("Action:", action, "Row:", row);
    }
  };

  const columns = useMemo(() => getUserManagementColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // Local fallback filtering in case the backend ignores the `status` parameter
  const filteredUsers = useMemo(() => {
    if (!statusFilter) return users || [];
    return (users || []).filter((user) => {
      const userStatus = String(user.status || "Active").toLowerCase();
      if (userStatus === statusFilter.toLowerCase()) return true;
      if (
        statusFilter === "Active" &&
        (userStatus === "1" || userStatus === "true")
      )
        return true;
      if (
        statusFilter === "Inactive" &&
        (userStatus === "0" || userStatus === "false")
      )
        return true;
      return false;
    });
  }, [users, statusFilter]);

  const filterConfig = [
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
      placeholder: "All Statuses",
    },
  ];

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="User Management"
              icon={<Users className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-blue"
              subheading="Manage application users, view their active plans, and modify their statuses."
            />
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={filteredUsers}
          rowCount={isManual ? serverPagination.total : filteredUsers.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search user name & email ID..."
          itemName="entries"
          isLoading={loading}
          manualPagination={isManual}
          manualFiltering={isManual}
          toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
          activeFiltersChildren={
            <DataTableActiveChips
              filterConfig={filterConfig}
              onClearAll={() => setStatusFilter("")}
            />
          }
        />
      </div>
    </Container>
  );
};

export default UsersManagementPage;
