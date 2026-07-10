import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/headSubhead";
import { ShieldAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportedProfiles } from "../store/profile-review.slice";
import { useLocation, useNavigate } from "react-router";
import { reportColumns } from "@/components/columns/reportColumns";
import ReportsDataTables from "@/components/shared/data-tables/reports.data.tables";
import StatsGrid from "@/components/common/stats.grid";
import {
  IconAlertOctagon,
  IconCircleCheck,
  IconClipboardList,
  IconLoader,
  IconSparkles,
} from "@tabler/icons-react";
import { Container } from "@/components/common/container";
import { bgMap, colorMap } from "@/constants/colors";
import { startOfDay, endOfDay, subDays } from "date-fns";

const getDateRangeFromPreset = (preset) => {
  const today = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());
  switch (preset) {
    case "today":
      return { from: today, to: endOfToday };
    case "yesterday":
      const yesterday = subDays(today, 1);
      return { from: yesterday, to: endOfDay(yesterday) };
    case "last7":
      return { from: subDays(today, 7), to: endOfToday };
    case "last30":
      return { from: subDays(today, 30), to: endOfToday };
    case "last90":
      return { from: subDays(today, 90), to: endOfToday };
    default:
      return null;
  }
};

export default function ReportsProfilesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // 1. Redux State
  const {
    list,
    pagination: reduxPagination,
    kpiStats,
    loading,
  } = useSelector((s) => s.profileReview);

  // Determine if we arrived via dashboard navigation (location.state)
  const navState = location?.state;
  const isFromDashboard =
    navState?.id === "reported" ||
    navState?.badge === "Medium" ||
    navState === "Medium" ||
    navState === "Users flagged" ||
    navState?.label === "Users flagged";

  // 2. Local Filter/Pagination State
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("reportsGlobalFilter") || "",
  );
  const [statusFilter, setStatusFilter] = useState(() => {
    if (navState === "Users flagged" || navState?.label === "Users flagged") {
      return "new";
    }
    // Restore last used filter from sessionStorage
    return sessionStorage.getItem("reportsStatusFilter") || "";
  });
  const [priorityFilter, setPriorityFilter] = useState(() => {
    // Priority 1: Dashboard "High Reported Users" → show high priority reports
    if (navState?.id === "reported") return "high";
    return sessionStorage.getItem("reportsPriorityFilter") || "";
  });
  const [pagination, setPagination] = useState(() => {
    // Reset to page 0 when coming from dashboard
    if (isFromDashboard) return { pageIndex: 0, pageSize: 10 };
    const saved = sessionStorage.getItem("reportsPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });

  const [dateRangeFilter, setDateRangeFilter] = useState(() => {
    if (isFromDashboard) {
      if (navState?.dateRange) {
        return navState.dateRange;
      }
      if (navState?.from || navState?.to) {
        return {
          from: navState.from,
          to: navState.to,
        };
      }
      if (navState?.preset) {
        return getDateRangeFromPreset(navState.preset);
      }
    }
    return null;
  });

  // Clear location state once it has been consumed on mount
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, location.state]);

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    if (globalFilter) {
      sessionStorage.setItem("reportsGlobalFilter", globalFilter);
    } else {
      sessionStorage.removeItem("reportsGlobalFilter");
    }

    if (statusFilter) {
      sessionStorage.setItem("reportsStatusFilter", statusFilter);
    } else {
      sessionStorage.removeItem("reportsStatusFilter");
    }

    if (priorityFilter) {
      sessionStorage.setItem("reportsPriorityFilter", priorityFilter);
    } else {
      sessionStorage.removeItem("reportsPriorityFilter");
    }

    if (pagination && (pagination.pageIndex !== 0 || pagination.pageSize !== 10)) {
      sessionStorage.setItem("reportsPagination", JSON.stringify(pagination));
    } else {
      sessionStorage.removeItem("reportsPagination");
    }
  }, [globalFilter, statusFilter, priorityFilter, pagination]);

  // Determine status value to send to backend API (Hybrid status parameter)
  const apiStatus = useMemo(() => {
    if (statusFilter) return statusFilter;
    if (priorityFilter === "high") return "high";
    return "";
  }, [statusFilter, priorityFilter]);

  // 3. API Fetch with Filters (executes instantly on filter/page changes, debounced strictly for search input)
  useEffect(() => {
    dispatch(
      fetchReportedProfiles({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status: apiStatus,
        dateRange: dateRangeFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    apiStatus,
    dateRangeFilter,
  ]);

  // Client-side filtering logic for priority
  const filteredList = useMemo(() => {
    if (!list) return [];
    return list.filter((item) => {
      // If we filtered by high priority on the backend, no need to filter client-side
      if (priorityFilter === "high" && !statusFilter) {
        return true;
      }
      if (priorityFilter === "high") {
        return item.severity === "high";
      }
      if (priorityFilter === "low") {
        return item.severity === "low" || item.severity === "medium" || !item.severity;
      }
      return true;
    });
  }, [list, priorityFilter, statusFilter]);

  const columns = useMemo(() => reportColumns(navigate), [navigate]);

  const statsData = useMemo(() => {
    return [
      {
        label: "Total Reports",
        val: kpiStats?.totalReports || 0,
        icon: <IconClipboardList size={22} />,
        color: "blue",
        description: "Lifetime reports",
      },
      {
        label: "Pending",
        val: kpiStats?.newReports || 0,
        icon: <IconSparkles size={22} />,
        color: "amber",
        description: "Unassigned/Recent",
      },
      {
        label: "In Progress",
        val: kpiStats?.inProgressReports || 0,
        icon: <IconLoader size={22} className="animate-spin-slow" />,
        color: "blue",
        description: "Being reviewed",
      },
      {
        label: "Resolved",
        val: kpiStats?.resolvedReports || 0,
        icon: <IconCircleCheck size={22} />,
        color: "emerald",
        description: "Issues fixed",
      },
      {
        label: "High Priority",
        val: kpiStats?.highPriorityReports || 0,
        icon: <IconAlertOctagon size={22} />,
        color: "red",
        description: "Critical action",
      },
    ];
  }, [kpiStats]);

  return (
    <Container>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <PageHeader
            heading="Reported Profiles"
            icon={<ShieldAlert className="w-9 h-9 text-white" />}
            color="bg-red-500"
            subheading="Review and manage user safety reports."
          />
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsGrid
            stats={statsData}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset filters first
              setStatusFilter("");
              setPriorityFilter("");
              setGlobalFilter("");
              setDateRangeFilter(null); // Clear date range filter when user clicks a stats card

              if (label === "Pending") {
                setStatusFilter("new");
              } else if (label === "In Progress") {
                setStatusFilter("in_progress");
              } else if (label === "Resolved") {
                setStatusFilter("resolved");
              } else if (label === "High Priority") {
                setPriorityFilter("high");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <ReportsDataTables
          columns={columns}
          data={filteredList}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by nickname or report details..."
          filters={{
            statusFilter,
            setStatusFilter: (val) => {
              setStatusFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            priorityFilter,
            setPriorityFilter: (val) => {
              setPriorityFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            dateRangeFilter,
            setDateRangeFilter: (val) => {
              setDateRangeFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            setGlobalFilter,
            setPagination,
          }}
        />
      </div>
    </Container>
  );
}
