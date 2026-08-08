import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Dumbbell, Plus, CheckCircle2, XCircle, ListVideo } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
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
import { useDebounce } from "../../../hooks/useDebounce";

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
  const dateRangeFromDashboard = location.state?.dateRange || null;
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

  useEffect(() => {
    dispatch(
      fetchFitzoneList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        status: statusFilter,
        ...(dateRangeFromDashboard?.preset ? { preset: dateRangeFromDashboard.preset } : {}),
        ...(dateRangeFromDashboard?.from ? { from: dateRangeFromDashboard.from } : {}),
        ...(dateRangeFromDashboard?.to ? { to: dateRangeFromDashboard.to } : {}),
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    statusFilter,
  ]);

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      setToggleModal({ open: true, rowData: row, targetStatus: value });
    } else if (action === "open-program") {
      navigate(`manage/${row.id}`);
    } else if (action === "edit") {
      navigate("edit-fitzone", { state: { editData: row } });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const rowId = toggleModal.rowData.id;
    const status = toggleModal.targetStatus ? "Active" : "Inactive";
    setIsUpdating(true);
    try {
      const result = await dispatch(toggleFitzoneStatus({ id: rowId, status }));
      if (toggleFitzoneStatus.fulfilled.match(result)) {
        toast.success("Fitzone status updated successfully.");
        dispatch(
          fetchFitzoneList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            status: statusFilter,
          }),
        );
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
        dispatch(
          fetchFitzoneList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            status: statusFilter,
          }),
        );
      } else {
        toast.error("Failed to delete fitzone.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, rowData: null });
    }
  };

  const columns = useMemo(() => getFitzoneManagementColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // Local fallback filtering in case the backend ignores the `status` parameter
  const displayData = useMemo(() => {
    if (isManual || !statusFilter) return fitzones || [];
    return (fitzones || []).filter(
      (fz) =>
        String(fz.status || "Active").toLowerCase() ===
        statusFilter.toLowerCase(),
    );
  }, [fitzones, statusFilter, isManual]);

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
      value: dateRangeFromDashboard,
      onChange: () => {
        // Clear navigation state by replacing it without dateRange
        navigate(".", { replace: true, state: { ...location.state, dateRange: null } });
      },
    },
  ];

  const localKpis = useMemo(() => {
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
  }, [kpis, fitzones, serverPagination]);

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
                label="Create Fitzone"
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
              isManual ? serverPagination.total : displayData?.length || 0
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
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setStatusFilter("");
                  if (dateRangeFromDashboard) {
                    navigate(".", { replace: true, state: { ...location.state, dateRange: null } });
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
    </Container>
  );
};

export default FitzoneManagementPage;
