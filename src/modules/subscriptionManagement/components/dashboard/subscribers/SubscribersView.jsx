import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { UserCheck, CalendarOff, ShieldOff } from "lucide-react";
import { LuUsersRound } from "react-icons/lu";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ConfirmModal from "@/components/common/ConfirmModal";
import ErrorState from "@/components/shared/ErrorState";
import { useLocation, useNavigate } from "react-router-dom";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { getSubscriberColumns } from "./subscriber.columns";
import UpgradeSubscriberDialog from "./UpgradeSubscriberDialog";
import RevokeSubscriberDialog from "./RevokeSubscriberDialog";
import {
  fetchSubscribers,
  manageSubscriber,
} from "../../../store/subscription-dashboard.slice";
import { getSubscribersAPI } from "../../../services/subscription-dashboard.services";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { useDebounce } from "@/hooks/useDebounce";

const STATUS_OPTIONS = ["Active", "Expired", "Revoked", "expiring_soon"];

export default function SubscribersView() {
  const navigate = useNavigate();
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
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState(
    location.state?.filterId || "",
  );
  const [planFilter, setPlanFilter] = useState("");

  const [confirmAction, setConfirmAction] = useState(null); // { subscriber, action: "expire"|"revoke" }
  const [upgradeSubscriber, setUpgradeSubscriber] = useState(null);

  const isUnfiltered = !statusFilter && !planFilter && !debouncedSearch;
  const [pinnedCounts, setPinnedCounts] = useState(null);

  useEffect(() => {
    // If we arrived with a filter, background fetch the true unfiltered stats
    if (!isUnfiltered && !pinnedCounts) {
      getSubscribersAPI({ limit: 1 })
        .then((res) => {
          if (res && res.success) {
            setPinnedCounts({
              total: res.data.counts?.total || 0,
              active: res.data.counts?.active || 0,
              expired: res.data.counts?.expired || 0,
              revoked: res.data.counts?.revoked || 0,
            });
          }
        })
        .catch(() => {});
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
    else if (action === "view")
      navigate(
        `/admin/users/view-user/${subscriber.userId || subscriber.user_id || subscriber.id}`,
      );
    else setConfirmAction({ subscriber, action });
  };

  const runManage = async (id, body) => {
    const result = await dispatch(manageSubscriber({ id, ...body }));
    if (manageSubscriber.fulfilled.match(result)) {
      toast.success("Subscriber updated successfully");
      const refetched = await dispatch(fetchSubscribers(fetchParams));
      if (fetchSubscribers.fulfilled.match(refetched)) {
        setPinnedCounts(refetched.payload.counts);
      }
      return true;
    }
    const payload = result.payload;
    const message = payload?.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload?.message || "Failed to update subscriber";
    toast.error(message);
    return false;
  };

  const handleConfirm = async (data = {}) => {
    if (!confirmAction) return;
    const { subscriber, action } = confirmAction;

    if (action === "revoke") {
      // Revoke is async: the backend proxies to the main backend's
      // internal refund endpoint which returns 202. The webhook will
      // set revoked_at/paid=0 after Stripe processes the refund.
      const result = await dispatch(
        manageSubscriber({ id: subscriber.id, action, ...data })
      );
      if (manageSubscriber.fulfilled.match(result)) {
        setConfirmAction(null);
        toast.loading("Processing revocation...", { id: "revoke-toast" });
        setTimeout(async () => {
          const refetched = await dispatch(fetchSubscribers(fetchParams));
          toast.success("Subscriber revoked successfully", { id: "revoke-toast" });
          if (fetchSubscribers.fulfilled.match(refetched)) {
            setPinnedCounts(refetched.payload.counts);
          }
        }, 4000);
      } else {
        const payload = result.payload;
        const message = payload?.errors
          ? Object.values(payload.errors).flat().join(" ")
          : payload?.message || "Failed to revoke subscriber";
        toast.error(message);
      }
      return;
    }

    // Non-revoke actions (expire, etc.) — synchronous flow
    const ok = await runManage(subscriber.id, { action, ...data });
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

  const kpiCounts = pinnedCounts ||
    subscribersCounts || { total: 0, active: 0, expired: 0, revoked: 0 };

  const kpiItems = useMemo(
    () => [
      {
        label: "Total Subscribers",
        value: kpiCounts.total || 0,
        icon: LuUsersRound,
        tone: "blue",
        description: "Tap to clear filters",
        onClick: () => {
          setStatusFilter("");
          setPlanFilter("");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "" && planFilter === "",
      },
      {
        label: "Active Subscriptions",
        value: kpiCounts.active || 0,
        icon: UserCheck,
        tone: "emerald",
        description: "Not revoked, not expired",
        onClick: () => {
          setStatusFilter("active");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "active",
      },
      {
        label: "Expired Plans",
        value: kpiCounts.expired || 0,
        icon: CalendarOff,
        tone: "amber",
        description: "Tap to filter",
        onClick: () => {
          setStatusFilter("expired");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "expired",
      },
      {
        label: "Revoked Access",
        value: kpiCounts.revoked || 0,
        icon: ShieldOff,
        tone: "rose",
        description: "Tap to filter",
        onClick: () => {
          setStatusFilter("revoked");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "revoked",
      },
    ],
    [kpiCounts, statusFilter, planFilter],
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
        label: s === "expiring_soon" ? "Expiring Soon" : s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
      placeholder: "All Status",
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
      <ModuleKpiRow items={kpiItems} loading={isFirstLoad} />

      <DataTable
        columns={columns}
        data={subscribers}
        rowCount={subscribersPagination?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={search}
        setGlobalFilter={setSearch}
        searchPlaceholder="Search by subscriber name or email..."
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
        isOpen={confirmAction?.action === "expire"}
        onClose={() => !manageLoading && setConfirmAction(null)}
        onConfirm={() => handleConfirm()}
        loading={manageLoading}
        type="warning"
        title="Mark as Expired"
        message={`Mark ${confirmAction?.subscriber?.name}'s subscription as expired?`}
        confirmText="Mark Expired"
      />

      <RevokeSubscriberDialog
        open={confirmAction?.action === "revoke"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        subscriber={confirmAction?.subscriber}
        onConfirm={handleConfirm}
        loading={manageLoading}
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
