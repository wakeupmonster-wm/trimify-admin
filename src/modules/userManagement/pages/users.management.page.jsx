import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { getUserManagementColumns } from "@/components/columns/user.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../store/user.slice";
import { getUserManagementAPI } from "../services/user.services";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  LuUserRoundCheck,
  LuUsersRound,
  LuUserRoundX,
  LuUserRoundPlus,
} from "react-icons/lu";

const UsersManagementPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    kpis,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.usersManagement);

  const location = useLocation();
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    location.state?.filterId || "",
  );
  // Optional dateRange passed via navigation from Dashboard KPI cards
  const [dateRangeFilter, setDateRangeFilter] = useState(
    location.state?.dateRange || null,
  );
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      fetchUsersList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        status: statusFilter,
        // Backend expects 'preset', 'from', 'to' at the root query level, not nested
        ...(dateRangeFilter?.preset ? { preset: dateRangeFilter.preset } : {}),
        ...(dateRangeFilter?.from ? { from: dateRangeFilter.from } : {}),
        ...(dateRangeFilter?.to ? { to: dateRangeFilter.to } : {}),
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    statusFilter,
    dateRangeFilter,
  ]);

  const handleAction = useCallback((row, action) => {
    if (action === "view") {
      navigate(`/admin/users/view-user/${row.id}`, {
        state: { userData: row },
      });
    }
  }, [navigate]);

  const isUnfiltered = !statusFilter && !debouncedSearchTerm;
  const [pinnedKpis, setPinnedKpis] = useState(null);

  // Background fetch for true KPIs if the backend doesn't provide them
  useEffect(() => {
    // If we already have pinned KPIs, don't refetch
    if (pinnedKpis) return;

    // If the backend provided `kpis` in the initial fetch, use them directly
    if (kpis) {
      setPinnedKpis(kpis);
      return;
    }

    // Otherwise, we need to fetch the counts manually because calculating them
    // from the current page of users is mathematically incorrect.
    Promise.all([
      getUserManagementAPI({ limit: 1 }),
      getUserManagementAPI({ limit: 1, status: "Active" }),
      getUserManagementAPI({ limit: 1, status: "Inactive" }),
      getUserManagementAPI({ limit: 1, status: "new_today" }),
    ])
      .then(([resTotal, resActive, resInactive, resNew]) => {
        setPinnedKpis({
          totalUsers: resTotal?.pagination?.total || 0,
          activeUsers: resActive?.pagination?.total || 0,
          inactiveUsers: resInactive?.pagination?.total || 0,
          newSignupsToday: resNew?.pagination?.total || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch KPIs:", err);
      });
  }, [kpis, pinnedKpis]);

  const columns = useMemo(() => getUserManagementColumns(handleAction), [handleAction]);

  const localKpis = useMemo(() => {
    if (pinnedKpis) return pinnedKpis;

    return {
      totalUsers: serverPagination?.total || 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newSignupsToday: 0,
    };
  }, [serverPagination, pinnedKpis]);

  const kpiItems = [
    {
      icon: LuUsersRound,
      label: "Total Users",
      value: localKpis?.totalUsers?.toLocaleString() || "0",
      description: "All registered users",
      onClick: () => {
        setStatusFilter("");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "",
    },
    {
      icon: LuUserRoundCheck,
      label: "Active Users",
      value: localKpis?.activeUsers?.toLocaleString() || "0",
      description: "Currently active users",
      tone: "emerald",
      onClick: () => {
        setStatusFilter("Active");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "Active",
    },
    {
      icon: LuUserRoundX,
      label: "Inactive Users",
      value: localKpis?.inactiveUsers?.toLocaleString() || "0",
      description: "Currently inactive users",
      tone: "rose",
      onClick: () => {
        setStatusFilter("Inactive");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "Inactive",
    },
    {
      icon: LuUserRoundPlus,
      label: "New Signups",
      value: localKpis?.newSignupsToday?.toLocaleString() || "0",
      description: "Signups from today",
      tone: "violet",
      onClick: () => {
        setStatusFilter("new_today");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "new_today",
    },
  ];

  // If serverPagination exists, it's server-paginated.
  const isManual = !!serverPagination;

  // Local fallback filtering in case the backend ignores the `status` parameter
  const filteredUsers = useMemo(() => {
    if (isManual || !statusFilter) return users || [];
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
  }, [users, statusFilter, isManual]);

  const handleStatusFilterChange = (v) => {
    setStatusFilter(v);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    if (location.state?.filterId) {
      const newState = { ...location.state };
      delete newState.filterId;
      navigate(location.pathname, { replace: true, state: newState });
    }
  };

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: handleStatusFilterChange,
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Ghosted", value: "ghosted" },
        { label: "Zero Engagement", value: "zero_engagement" },
        { label: "New Signups Today", value: "new_today" },
        { label: "Missed Step Goals", value: "missed_step_goals" },
        { label: "Missed Diet Logs", value: "missed_diet_logs" },
        { label: "Missed Water Logs", value: "missed_water_logs" },
      ],
      placeholder: "All Status",
    },
    {
      type: "dateRange",
      id: "dateRangeFilter",
      label: "Date",
      value: location.state?.dateRange || null,
      onChange: () => {
        // Clear navigation state by replacing it without dateRange
        navigate(".", { replace: true, state: { ...location.state, dateRange: null } });
      },
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="User Management"
                icon={<LuUsersRound className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage application users, view their active plans, and modify their statuses."
              />
            </div>
          </div>
        </Header>

        <ModuleKpiRow items={kpiItems} loading={loading && !users?.length} />

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
                onClearAll={() => {
                  handleStatusFilterChange("");
                  if (location.state?.dateRange) {
                    navigate(".", { replace: true, state: { ...location.state, dateRange: null } });
                  }
                }}
              />
            }
          />
        </div>
      </div>
    </Container>
  );
};

export default UsersManagementPage;
