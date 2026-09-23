import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Dumbbell, Plus, CheckCircle2, XCircle, ListVideo } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { getFitzoneManagementColumns } from "@/components/columns/fitzone.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchFitzoneList,
  toggleFitzoneStatus,
  deleteFitzone,
} from "../store/fitzone.slice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "../../../hooks/useDebounce";
import { getFitzoneManagementAPI, getFitzoneAssignmentRunsAPI } from "../services/fitzone.services";
import AssignSelectiveUsersDialog from "../components/AssignSelectiveUsersDialog";

const formatLocalDateParam = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const getDateRangeFromLocation = (location) => {
  const params = new URLSearchParams(location.search);
  const preset = params.get("preset") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  if (preset || from || to) {
    return { preset, from, to };
  }

  return location.state?.dateRange || null;
};

const buildDateRangeSearch = (dateRange) => {
  const params = new URLSearchParams();
  if (dateRange?.preset) params.set("preset", dateRange.preset);

  const from = formatLocalDateParam(dateRange?.from);
  const to = formatLocalDateParam(dateRange?.to);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const query = params.toString();
  return query ? `?${query}` : "";
};

const FitzoneManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    fitzones,
    kpis,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.fitzoneManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  // Optional dateRange from Dashboard KPI navigation
  const [dateRangeFilter, setDateRangeFilter] = useState(() =>
    getDateRangeFromLocation(location),
  );
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectiveAssignModal, setSelectiveAssignModal] = useState({ open: false, rowData: null });
  const [globalKpisData, setGlobalKpisData] = useState(null);
  const [assignmentLogs, setAssignmentLogs] = useState({ open: false, row: null, runs: [], loading: false });

  useEffect(() => {
    let isMounted = true;
    const fetchGlobalKpis = async () => {
      try {
        const response = await getFitzoneManagementAPI({ limit: 1 });
        if (isMounted && response && (response.success || response.status === "success")) {
          if (response.kpis) {
            setGlobalKpisData(response.kpis);
          } else {
            const all = response.fitzones || response.data || [];
            const active = all.filter(
              (fz) => String(fz.status || "Active").toLowerCase() === "active"
            ).length;
            setGlobalKpisData({
              totalFitzones: response.pagination?.total || all.length,
              activeFitzones: active,
              inactiveFitzones: all.length - active,
              totalSessions: all.reduce(
                (sum, fz) => sum + (fz.sessions?.length || fz.session_count || 0),
                0
              ),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch global KPIs", error);
      }
    };
    fetchGlobalKpis();
    return () => {
      isMounted = false;
    };
  }, []);

  const listRequestParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchTerm,
    status: statusFilter,
    ...(dateRangeFilter?.preset ? { preset: dateRangeFilter.preset } : {}),
    ...(dateRangeFilter?.from ? { from: dateRangeFilter.from } : {}),
    ...(dateRangeFilter?.to ? { to: dateRangeFilter.to } : {}),
  }), [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    statusFilter,
    dateRangeFilter,
  ]);

  useEffect(() => {
    dispatch(fetchFitzoneList(listRequestParams));
  }, [dispatch, listRequestParams]);

  const handleAction = useCallback((row, action, value) => {
    if (action === "toggle-status") {
      setToggleModal({ open: true, rowData: row, targetStatus: value });
    } else if (action === "open-program") {
      navigate(`manage/${row.id}`);
    } else if (action === "edit") {
      navigate("edit-fitzone", { state: { editData: row } });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    } else if (action === "assign") {
      setSelectiveAssignModal({ open: true, rowData: row });
    } else if (action === "assignment-logs") {
      setAssignmentLogs({ open: true, row, runs: [], loading: true });
      getFitzoneAssignmentRunsAPI(row.id)
        .then((response) => setAssignmentLogs({ open: true, row, runs: response?.runs || [], loading: false }))
        .catch(() => setAssignmentLogs({ open: true, row, runs: [], loading: false }));
    }
  }, [navigate]);

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const rowId = toggleModal.rowData.id;
    const status = toggleModal.targetStatus ? "Active" : "Inactive";
    setIsUpdating(true);
    try {
      const result = await dispatch(toggleFitzoneStatus({ id: rowId, status }));
      if (toggleFitzoneStatus.fulfilled.match(result)) {
        toast.success("Fitzone status updated successfully.");
        dispatch(fetchFitzoneList(listRequestParams));
      } else {
        toast.error("Failed to update status.");
      }
    } finally {
      setIsUpdating(false);
      setToggleModal({ open: false, rowData: null, targetStatus: false });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteFitzone(deleteModal.rowData.id));
      if (deleteFitzone.fulfilled.match(result)) {
        toast.success("Fitzone deleted successfully.");
        dispatch(fetchFitzoneList(listRequestParams));
      } else {
        toast.error("Failed to delete fitzone.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, rowData: null });
    }
  };

  const columns = useMemo(() => getFitzoneManagementColumns(handleAction), [handleAction]);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  const displayData = useMemo(() => {
    let data = fitzones || [];
    if (statusFilter) {
      data = data.filter(
        (fz) =>
          String(fz.status || "Active").toLowerCase() ===
          statusFilter.toLowerCase(),
      );
    }
    return data;
  }, [fitzones, statusFilter]);

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
    {
      type: "dateRange",
      id: "dateRangeFilter",
      label: "Date",
      value: dateRangeFilter,
      onChange: (val) => {
        setDateRangeFilter(val);
        // URL is the single source of truth for a date-scoped list. This
        // keeps Dashboard drill-downs correct after reload/back navigation.
        navigate(
          { pathname: location.pathname, search: buildDateRangeSearch(val) },
          { replace: true, state: { ...location.state, dateRange: null } },
        );
      },
    },
  ];

  const localKpis = useMemo(() => {
    if (globalKpisData) return globalKpisData;
    if (kpis) return kpis;
    const all = fitzones || [];
    const active = all.filter(
      (fz) => String(fz.status || "Active").toLowerCase() === "active",
    ).length;
    return {
      totalFitzones: serverPagination?.total || all.length,
      activeFitzones: active,
      inactiveFitzones: all.length - active,
      totalSessions: all.reduce(
        (sum, fz) => sum + (fz.sessions?.length || fz.session_count || 0),
        0,
      ),
    };
  }, [globalKpisData, kpis, fitzones, serverPagination]);

  const kpiItems = [
    {
      icon: Dumbbell,
      label: "Total Fitzones",
      value: localKpis?.totalFitzones?.toLocaleString() || "0",
      description: "All fitzones",
      onClick: () => setStatusFilter(""),
      isSelected: statusFilter === "",
    },
    {
      icon: CheckCircle2,
      label: "Active Fitzones",
      value: localKpis?.activeFitzones?.toLocaleString() || "0",
      description: "Currently active fitzones",
      tone: "emerald",
      onClick: () => setStatusFilter("Active"),
      isSelected: statusFilter === "Active",
    },
    {
      icon: XCircle,
      label: "Inactive Fitzones",
      value: localKpis?.inactiveFitzones?.toLocaleString() || "0",
      description: "Currently inactive fitzones",
      tone: "rose",
      onClick: () => setStatusFilter("Inactive"),
      isSelected: statusFilter === "Inactive",
    },
    {
      icon: ListVideo,
      label: "Total Sessions",
      value: localKpis?.totalSessions?.toLocaleString() || "0",
      description: "Across all fitzones",
      tone: "cyan",
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Fitzone Management"
                icon={<Dumbbell className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Create, configure, and monitor Fitzone workouts and sessions."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={Plus}
                label="Add Fitzone"
                onClick={() => navigate("add-fitzone")}
              />
            </div>
          </div>
        </Header>

        <ModuleKpiRow items={kpiItems} loading={loading && !fitzones?.length} />

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={displayData}
            rowCount={
              statusFilter
                ? displayData?.length || 0
                : isManual
                  ? serverPagination.total
                  : displayData?.length || 0
            }
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by fitzone name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
            onRowClick={(row) => handleAction(row.original, "open-program")}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setStatusFilter("");
                  setDateRangeFilter(null);
                  if (location.state) {
                    navigate(".", { replace: true, state: null });
                  }
                }}
              />
            }
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, rowData: null })
        }
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this fitzone? This action cannot be undone."
        loading={isDeleting}
      />
      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() =>
          !isUpdating &&
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this fitzone to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
        loading={isUpdating}
      />

      <Dialog open={assignmentLogs.open} onOpenChange={(open) => setAssignmentLogs((current) => ({ ...current, open }))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Fitzone Assignment Logs — {assignmentLogs.row?.title}</DialogTitle></DialogHeader>
          {assignmentLogs.loading ? <p className="text-sm text-slate-500">Loading assignment status…</p> : assignmentLogs.runs.length ? (
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
              {assignmentLogs.runs.map((run) => <div key={run.id} className="rounded-lg border border-slate-200 p-3 text-xs">
                <div className="flex items-center justify-between gap-3"><strong className="capitalize">{String(run.status || "queued").replace(/_/g, " ")}</strong><span className="text-slate-500">{run.processed_users || 0} / {run.total_users || 0} processed</span></div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-slate-600"><span>Assigned: <b>{run.assigned_users || 0}</b></span><span>Skipped: <b>{run.skipped_users || 0}</b></span><span>Failed: <b className="text-red-600">{run.failed_users || 0}</b></span></div>
                {run.failure_message && <p className="mt-2 text-red-600">{run.failure_message}</p>}
                {run.recent_failures?.length > 0 && <div className="mt-3 rounded-md bg-red-50 p-2 text-red-700"><p className="font-semibold">Failed users</p>{run.recent_failures.map((failure) => <p key={`${run.id}-failed-${failure.user_id}`} className="mt-1">{failure.name || `User ${failure.user_id}`}{failure.email ? ` (${failure.email})` : ""}: {failure.error_message}</p>)}</div>}
                {run.recent_skips?.length > 0 && <div className="mt-3 rounded-md bg-amber-50 p-2 text-amber-800"><p className="font-semibold">Skipped users</p>{run.recent_skips.map((skip) => <p key={`${run.id}-skipped-${skip.user_id}`} className="mt-1">{skip.name || `User ${skip.user_id}`}{skip.email ? ` (${skip.email})` : ""}: {skip.error_message || "Already assigned"}</p>)}</div>}
              </div>)}
            </div>
          ) : <p className="text-sm text-slate-500">No assignment run has been recorded yet.</p>}
        </DialogContent>
      </Dialog>
      <AssignSelectiveUsersDialog
        open={selectiveAssignModal.open}
        onOpenChange={(open) => setSelectiveAssignModal((prev) => ({ ...prev, open }))}
        fitzone={selectiveAssignModal.rowData}
        onSuccess={() => {
          dispatch(fetchFitzoneList(listRequestParams));
        }}
      />
    </Container>
  );
};

export default FitzoneManagementPage;
