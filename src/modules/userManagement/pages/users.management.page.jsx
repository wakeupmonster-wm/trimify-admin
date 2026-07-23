import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
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
import { LuUsersRound } from "react-icons/lu";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState(location.state?.filterId || "");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

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

  const isUnfiltered = !statusFilter && !debouncedSearchTerm;
  const [pinnedKpis, setPinnedKpis] = useState(null);

  // Background fetch for true KPIs if we arrive with a filter applied
  useEffect(() => {
    if (!isUnfiltered && !pinnedKpis) {
      getUserManagementAPI({ limit: 1 }).then((res) => {
        if (res && res.status === "success") {
          const fetchedKpis = res.kpis || {
            totalUsers: res.pagination?.total || 0,
            activeUsers: 0, // Fallback if backend doesn't provide
            inactiveUsers: 0,
            newSignupsToday: 0,
          };
          setPinnedKpis(fetchedKpis);
        }
      }).catch(() => {});
    }
  }, [isUnfiltered, pinnedKpis]);

  const columns = useMemo(() => getUserManagementColumns(handleAction), []);

  const localKpis = useMemo(() => {
    // If we have pinned KPIs, ALWAYS use them. This ensures clicking a filter doesn't change the cards.
    if (pinnedKpis) return pinnedKpis;

    // If the data is unfiltered right now, we can calculate and pin the real KPIs
    if (isUnfiltered && (kpis || users?.length > 0)) {
      const all = users || [];
      const active = all.filter(
        (u) =>
          String(u.status || "Active").toLowerCase() === "active" ||
          u.status === "1" ||
          u.status === "true"
      ).length;
      
      const computedKpis = kpis || {
        totalUsers: serverPagination?.total || all.length,
        activeUsers: active,
        inactiveUsers: (serverPagination?.total || all.length) - active,
        newSignupsToday: all.filter((u) => {
          if (!u.created_at) return false;
          const today = new Date().toISOString().split("T")[0];
          return String(u.created_at).startsWith(today);
        }).length,
      };
      
      // Update the pinned state in the next tick to avoid render warnings
      setTimeout(() => setPinnedKpis(computedKpis), 0);
      return computedKpis;
    }

    // Fallback while loading
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newSignupsToday: 0,
    };
  }, [kpis, users, serverPagination, isUnfiltered, pinnedKpis]);

  const kpiItems = [
    {
      icon: Users,
      label: "Total Users",
      value: localKpis?.totalUsers?.toLocaleString() || "0",
      description: "All-time platform total",
    },
    {
      icon: UserCheck,
      label: "Active Users",
      value: localKpis?.activeUsers?.toLocaleString() || "0",
      description: "Tap to filter",
      tone: "emerald",
      onClick: () => {
        setStatusFilter("Active");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "Active",
    },
    {
      icon: UserX,
      label: "Inactive Users",
      value: localKpis?.inactiveUsers?.toLocaleString() || "0",
      description: "Tap to filter",
      tone: "rose",
      onClick: () => {
        setStatusFilter("Inactive");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "Inactive",
    },
    {
      icon: UserPlus,
      label: "New Signups",
      value: localKpis?.newSignupsToday?.toLocaleString() || "0",
      description: "Tap to filter",
      tone: "violet",
      onClick: () => {
        setStatusFilter("new_today");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      isSelected: statusFilter === "new_today",
    },
  ];

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
        { label: "Ghosted", value: "ghosted" },
        { label: "Zero Engagement", value: "zero_engagement" },
      ],
      placeholder: "Any Status",
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
                color="bg-app-primary2 shadow-app-primary2"
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
