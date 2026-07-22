import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Dumbbell, Plus, CheckCircle, Clock, Flame } from "lucide-react";
import { KpiStatCard } from "@/components/shared/KpiStatCard";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
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
  const dispatch = useDispatch();
  const {
    fitzones,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.fitzoneManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
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

  useEffect(() => {
    dispatch(
      fetchFitzoneList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
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
    const result = await dispatch(toggleFitzoneStatus({ id: rowId, status }));
    if (toggleFitzoneStatus.fulfilled.match(result)) {
      toast.success("Fitzone status updated successfully.");
      dispatch(
        fetchFitzoneList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
    } else {
      toast.error("Failed to update status.");
    }
    setToggleModal({ open: false, rowData: null, targetStatus: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    const result = await dispatch(deleteFitzone(deleteModal.rowData.id));
    if (deleteFitzone.fulfilled.match(result)) {
      toast.success("Fitzone deleted successfully.");
      dispatch(
        fetchFitzoneList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
    } else {
      toast.error("Failed to delete fitzone.");
    }
    setDeleteModal({ open: false, rowData: null });
  };

  const columns = useMemo(() => getFitzoneManagementColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const list = fitzones || [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      total: serverPagination?.total || list.length,
      active: list.filter((f) => f.status === "Active").length,
      inactive: list.filter((f) => f.status !== "Active").length,
      recent: list.filter(
        (f) => f.updated_at && new Date(f.updated_at) >= thirtyDaysAgo,
      ).length,
    };
  }, [fitzones, serverPagination]);

  return (
    <Container>
      {/* Top Header Section outside of the white card */}
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Fitzone Management"
                icon={
                  <Dumbbell className="w-6 h-6 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-blue-200"
                subheading="Create, configure, and monitor Fitzone workouts and sessions."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 xl:flex-none bg-slate-50 hover:bg-app-primary2 text-secondary-foreground hover:text-white border rounded-md px-4 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all duration-300"
                onClick={() => navigate("add-fitzone")}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Fitzone</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KpiStatCard
            title="Total Fitzones"
            value={kpiStats.total}
            icon={Dumbbell}
            colorClass="text-brand-blue"
            bgClass="bg-blue-50"
            description="All workout groups"
          />
          <KpiStatCard
            title="Active Fitzones"
            value={kpiStats.active}
            icon={CheckCircle}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            description="Currently accessible"
          />
          <KpiStatCard
            title="Draft / Inactive"
            value={kpiStats.inactive}
            icon={Clock}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
            description="Not visible to users"
          />
          <KpiStatCard
            title="Recently Updated"
            value={kpiStats.recent}
            icon={Flame}
            colorClass="text-rose-600"
            bgClass="bg-rose-50"
            description="Modified in last 30 days"
          />
        </div>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={fitzones || []}
            rowCount={isManual ? serverPagination.total : fitzones?.length || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by fitzone name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this fitzone? This action cannot be undone."
      />
      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() =>
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this fitzone to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default FitzoneManagementPage;
