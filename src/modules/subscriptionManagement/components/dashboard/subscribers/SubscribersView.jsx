import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Users, UserCheck, CalendarOff, ShieldOff } from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import StatsGrid from "@/components/common/stats.grid";
import ConfirmModal from "@/components/common/ConfirmModal";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
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
import { fetchSubscribers, manageSubscriber } from "../../../store/subscription-dashboard.slice";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";

const STATUS_OPTIONS = ["All", "Active", "Expired", "Revoked"];

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

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("all");

  const [confirmAction, setConfirmAction] = useState(null); // { subscriber, action: "expire"|"revoke" }
  const [upgradeSubscriber, setUpgradeSubscriber] = useState(null);

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
      status: statusFilter === "All" ? "" : statusFilter,
      plan_id: planFilter === "all" ? "" : planFilter,
    }),
    [pagination, debouncedSearch, statusFilter, planFilter]
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
    const ok = await runManage(confirmAction.subscriber.id, { action: confirmAction.action });
    if (ok) setConfirmAction(null);
  };

  const handleUpgradeConfirm = async (body) => {
    if (!upgradeSubscriber) return;
    const ok = await runManage(upgradeSubscriber.id, { action: "upgrade", ...body });
    if (ok) setUpgradeSubscriber(null);
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Subscribers",
        val: subscribersCounts.total || 0,
        icon: <Users size={22} />,
        color: "blue",
        description: "All-time, unfiltered",
      },
      {
        label: "Active",
        val: subscribersCounts.active || 0,
        icon: <UserCheck size={22} />,
        color: "emerald",
        description: "Currently subscribed",
      },
      {
        label: "Expired",
        val: subscribersCounts.expired || 0,
        icon: <CalendarOff size={22} />,
        color: "amber",
        description: "Subscription ended",
      },
      {
        label: "Revoked",
        val: subscribersCounts.revoked || 0,
        icon: <ShieldOff size={22} />,
        color: "rose",
        description: "Access removed",
      },
    ],
    [subscribersCounts]
  );

  const columns = useMemo(() => getSubscriberColumns(handleAction), []);

  const isFirstLoad = subscribersLoading && subscribersPagination === null;

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
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[110px] rounded-xl" />)
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
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}>
              <SelectTrigger className="h-9 3xl:h-10 w-[130px] bg-white border-slate-200 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}>
              <SelectTrigger className="h-9 3xl:h-10 w-[150px] bg-white border-slate-200 text-xs font-medium">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Plans</SelectItem>
                {plans?.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)} className="text-xs">
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={manageLoading}
        type={confirmAction?.action === "revoke" ? "danger" : "warning"}
        title={confirmAction?.action === "revoke" ? "Revoke Access" : "Mark as Expired"}
        message={
          confirmAction?.action === "revoke"
            ? `Revoke ${confirmAction?.subscriber?.name}'s subscription access immediately?`
            : `Mark ${confirmAction?.subscriber?.name}'s subscription as expired?`
        }
        confirmText={confirmAction?.action === "revoke" ? "Revoke" : "Mark Expired"}
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
