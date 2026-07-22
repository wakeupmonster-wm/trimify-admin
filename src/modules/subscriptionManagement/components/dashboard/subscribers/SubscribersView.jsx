import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Users, UserCheck, CalendarOff, ShieldOff } from "lucide-react";
import { DataTable, DataTableFilters, DataTableActiveChips } from "@/components/shared/datatable";
import StatsGrid from "@/components/common/stats.grid";
import ConfirmModal from "@/components/common/ConfirmModal";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
import { colorMap, bgMap } from "@/constants/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubscriberColumns } from "./subscriber.columns";
import UpgradeSubscriberDialog from "./UpgradeSubscriberDialog";
import {
  fetchSubscribers,
  manageSubscriber,
} from "../../../store/subscription-dashboard.slice";
import { getSubscribersAPI } from "../../../services/subscription-dashboard.services";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";

const STATUS_OPTIONS = ["Active", "Expired", "Revoked", "canceled", "expiring_soon"];

export default function SubscribersView() {
  const dispatch = useDispatch();
  const {
    subscribers,
    subscribersCounts,
    subscribersPagination,
    subscribersLoading,
    subscribersError,
    manageLoading,
  } = useSelector((state) => state.subscriptionDashboard);
  const { plans } = useSelector((state) => state.subscriptionManagement);

  const location = useLocation();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(location.state?.filterId || "");
  const [planFilter, setPlanFilter] = useState("");

  const [confirmAction, setConfirmAction] = useState(null); // { subscriber, action: "expire"|"revoke" }
  const [upgradeSubscriber, setUpgradeSubscriber] = useState(null);

  const isUnfiltered = !statusFilter && !planFilter && !debouncedSearch;
  const [pinnedCounts, setPinnedCounts] = useState(null);

  useEffect(() => {
    // If we arrived with a filter, background fetch the true unfiltered stats
    if (!isUnfiltered && !pinnedCounts) {
      getSubscribersAPI({ limit: 1 }).then((res) => {
        if (res && res.success) {
          setPinnedCounts({
            total: res.data.counts?.total || 0,
            active: res.data.counts?.active || 0,
            expired: res.data.counts?.expired || 0,
            revoked: res.data.counts?.revoked || 0,
          });
        }
      }).catch(() => {});
    }
  }, [isUnfiltered, pinnedCounts]);

  // Capture unfiltered when the main list loads unfiltered
  useEffect(() => {
    if (isUnfiltered && subscribersCounts.total > 0 && !pinnedCounts) {
      setPinnedCounts({ ...subscribersCounts });
    }
  }, [isUnfiltered, subscribersCounts, pinnedCounts]);

  useEffect(() => {
    if (!plans?.length) dispatch(fetchSubscriptionPlans({ limit: 100 }));
  }, [dispatch, plans]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch,
      status: statusFilter,
      plan_id: planFilter,
    }),
    [pagination, debouncedSearch, statusFilter, planFilter],
  );

  useEffect(() => {
    dispatch(fetchSubscribers(fetchParams));
  }, [dispatch, fetchParams]);

  const handleAction = (subscriber, action) => {
    if (action === "upgrade") setUpgradeSubscriber(subscriber);
    else setConfirmAction({ subscriber, action });
  };

  const runManage = async (id, body) => {
    const result = await dispatch(manageSubscriber({ id, ...body }));
    if (manageSubscriber.fulfilled.match(result)) {
      toast.success("Subscriber updated successfully");
      dispatch(fetchSubscribers(fetchParams));
      return true;
    }
    const payload = result.payload;
    const message = payload?.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload?.message || "Failed to update subscriber";
    toast.error(message);
    return false;
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const ok = await runManage(confirmAction.subscriber.id, {
      action: confirmAction.action,
    });
    if (ok) setConfirmAction(null);
  };

  const handleUpgradeConfirm = async (body) => {
    if (!upgradeSubscriber) return;
    const ok = await runManage(upgradeSubscriber.id, {
      action: "upgrade",
      ...body,
    });
    if (ok) setUpgradeSubscriber(null);
  };

  const kpiCounts = pinnedCounts || subscribersCounts || { total: 0, active: 0, expired: 0, revoked: 0 };

  const stats = useMemo(
    () => [
      {
        label: "Total Subscribers",
        val: kpiCounts.total || 0,
        icon: <Users size={22} />,
        color: "blue",
        description: "All-time, unfiltered",
      },
      {
        label: "Active",
        val: kpiCounts.active || 0,
        icon: <UserCheck size={22} />,
        color: "emerald",
        description: "Tap to filter",
        onClick: () => {
          setStatusFilter("Active");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "Active",
      },
      {
        label: "Expired",
        val: kpiCounts.expired || 0,
        icon: <CalendarOff size={22} />,
        color: "amber",
        description: "Tap to filter",
        onClick: () => {
          setStatusFilter("Expired");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "Expired",
      },
      {
        label: "Revoked",
        val: kpiCounts.revoked || 0,
        icon: <ShieldOff size={22} />,
        color: "rose",
        description: "Tap to filter",
        onClick: () => {
          setStatusFilter("Revoked");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "Revoked",
      },
    ],
    [kpiCounts, statusFilter],
  );

  const columns = useMemo(() => getSubscriberColumns(handleAction), []);

  const isFirstLoad = subscribersLoading && subscribersPagination === null;

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: STATUS_OPTIONS.map((s) => ({
        label: s === "canceled" ? "Canceled" : s === "expiring_soon" ? "Expiring Soon" : s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
      placeholder: "All Statuses",
    },
    {
      type: "select",
      id: "planFilter",
      label: "Plan",
      value: planFilter,
      onChange: (v) => {
        setPlanFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: plans?.map((plan) => ({ label: plan.title, value: String(plan.id) })) || [],
      placeholder: "All Plans",
    },
  ];

  if (subscribersError && !subscribersPagination) {
    return (
      <ErrorState
        error="We couldn't load subscribers."
        fetchVisitorData={() => dispatch(fetchSubscribers(fetchParams))}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isFirstLoad ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-xl" />
          ))
        ) : (
          <StatsGrid stats={stats} colorMap={colorMap} bgMap={bgMap} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        rowCount={subscribersPagination?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={search}
        setGlobalFilter={setSearch}
        searchPlaceholder="Search by name, email or mobile..."
        itemName="subscribers"
        isLoading={subscribersLoading}
        manualPagination
        manualFiltering
        toolbarChildren={
          <>
            <DataTableFilters filterConfig={filterConfig} />
          </>
        }
        activeFiltersChildren={
          <DataTableActiveChips
            filterConfig={filterConfig}
            onClearAll={() => {
              setStatusFilter("");
              setPlanFilter("");
            }}
          />
        }
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={manageLoading}
        type={confirmAction?.action === "revoke" ? "danger" : "warning"}
        title={
          confirmAction?.action === "revoke"
            ? "Revoke Access"
            : "Mark as Expired"
        }
        message={
          confirmAction?.action === "revoke"
            ? `Revoke ${confirmAction?.subscriber?.name}'s subscription access immediately?`
            : `Mark ${confirmAction?.subscriber?.name}'s subscription as expired?`
        }
        confirmText={
          confirmAction?.action === "revoke" ? "Revoke" : "Mark Expired"
        }
      />

      <UpgradeSubscriberDialog
        open={!!upgradeSubscriber}
        onOpenChange={(open) => !open && setUpgradeSubscriber(null)}
        subscriber={upgradeSubscriber}
        plans={plans || []}
        onConfirm={handleUpgradeConfirm}
        loading={manageLoading}
      />
    </div>
  );
}
