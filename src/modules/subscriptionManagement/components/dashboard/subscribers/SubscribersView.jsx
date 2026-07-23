import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CalendarOff, ShieldOff } from "lucide-react";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import ConfirmModal from "@/components/common/ConfirmModal";
import ErrorState from "@/components/shared/ErrorState";
import { getSubscriberColumns } from "./subscriber.columns";
import UpgradeSubscriberDialog from "./UpgradeSubscriberDialog";
import {
  fetchSubscribers,
  manageSubscriber,
} from "../../../store/subscription-dashboard.slice";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { LuUserRoundCheck, LuUsersRound } from "react-icons/lu";

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

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

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
    else if (action === "view") navigate(`/admin/users/view-user/${subscriber.userId || subscriber.user_id || subscriber.id}`);
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

  const kpiItems = useMemo(
    () => [
      {
        label: "Total Subscribers",
        value: subscribersCounts.total || 0,
        icon: LuUsersRound,
        tone: statusFilter === "" ? "blue" : "slate",
        description: "All-time, unfiltered",
        onClick: () => {
          setStatusFilter("");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
      },
      {
        label: "Active",
        value: subscribersCounts.active || 0,
        icon: LuUserRoundCheck,
        tone: statusFilter === "Active" ? "emerald" : (statusFilter === "" ? "emerald" : "slate"),
        description: "Currently subscribed",
        onClick: () => {
          setStatusFilter((prev) => (prev === "Active" ? "" : "Active"));
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
      },
      {
        label: "Expired",
        value: subscribersCounts.expired || 0,
        icon: CalendarOff,
        tone: statusFilter === "Expired" ? "amber" : (statusFilter === "" ? "amber" : "slate"),
        description: "Subscription ended",
        onClick: () => {
          setStatusFilter((prev) => (prev === "Expired" ? "" : "Expired"));
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
      },
      {
        label: "Revoked",
        value: subscribersCounts.revoked || 0,
        icon: ShieldOff,
        tone: statusFilter === "Revoked" ? "rose" : (statusFilter === "" ? "rose" : "slate"),
        description: "Access removed",
        onClick: () => {
          setStatusFilter((prev) => (prev === "Revoked" ? "" : "Revoked"));
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
      },
    ],
    [subscribersCounts, statusFilter],
  );

  const filterConfig = useMemo(() => [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Active", value: "Active" },
        { label: "Expired", value: "Expired" },
        { label: "Revoked", value: "Revoked" },
      ],
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
      options: plans?.map((p) => ({ label: p.title, value: String(p.id) })) || [],
      placeholder: "All Plans",
    },
  ], [statusFilter, planFilter, plans]);

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
        toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
        activeFiltersChildren={
          <DataTableActiveChips
            filterConfig={filterConfig}
            onClearAll={() => {
              setStatusFilter("");
              setPlanFilter("");
              setPagination((p) => ({ ...p, pageIndex: 0 }));
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
