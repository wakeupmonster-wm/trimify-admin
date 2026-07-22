import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
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
import { LuUsersRound, LuCreditCard, LuGift, LuActivity } from "react-icons/lu";
import { KpiStatCard } from "@/components/shared/KpiStatCard";

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

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const list = users || [];
    return {
      total: serverPagination?.total || list.length,
      paid: list.filter((u) => u.paid === 1 || String(u.paid) === "true")
        .length,
      free: list.filter(
        (u) => u.paid === 0 || String(u.paid) === "false" || u.paid === null,
      ).length,
      active: list.filter(
        (u) => String(u.status || "Active").toLowerCase() === "active",
      ).length,
    };
  }, [users, serverPagination]);

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
      placeholder: "All Status",
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="User Management"
                icon={<LuUsersRound className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-brand-blue"
                subheading="Manage application users, view their active plans, and modify their statuses."
              />
            </div>
          </div>
        </Header>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KpiStatCard
            title="Total Users"
            value={kpiStats.total}
            icon={LuUsersRound}
            colorClass="text-brand-blue"
            bgClass="bg-blue-50"
            description="Total registered users"
          />
          <KpiStatCard
            title="Paid Users"
            value={kpiStats.paid}
            icon={LuCreditCard}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            description="Premium plan members"
          />
          <KpiStatCard
            title="Free Users"
            value={kpiStats.free}
            icon={LuGift}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
            description="Free tier members"
          />
          <KpiStatCard
            title="Active Users"
            value={kpiStats.active}
            icon={LuActivity}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-50"
            description="Active accounts"
          />
        </div>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={filteredUsers}
            rowCount={isManual ? serverPagination.total : filteredUsers.length}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by name or email..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
            onRowClick={(row) => handleAction(row.original, "view")}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => setStatusFilter("")}
              />
            }
          />
        </div>
      </div>
    </Container>
  );
};

export default UsersManagementPage;
