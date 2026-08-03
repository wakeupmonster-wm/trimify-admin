import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import {
  LayoutDashboard,
  Plus,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Users2,
} from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { getManageProgramColumns } from "@/components/columns/manage.program.columns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgramList,
  toggleProgramStatus,
  toggleFoodVisibility,
  deleteProgram,
  replicateProgram,
} from "../store/program.slice";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../../../hooks/useDebounce";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "sonner";

const ManageProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    programs,
    kpis,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.manageProgram);

  const location = useLocation();

  const [globalFilter, setGlobalFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    location.state?.filterId || "",
  );
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(
      fetchProgramList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        duration: durationFilter,
        status: statusFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    durationFilter,
    statusFilter,
  ]);

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      setToggleConfirm({
        row,
        action,
        value,
        title: "Change Status",
        message: "Are you sure you want to change the status of this program?",
      });
    } else if (action === "toggle-food-visibility") {
      setToggleConfirm({
        row,
        action,
        value,
        title: "Change Food Visibility",
        message: "Are you sure you want to change the food visibility setting?",
      });
    } else if (action === "view-user") {
      navigate(`view-user/${row.id}`);
    } else if (action === "open-program") {
      navigate(`manage/${row.id}`);
    } else if (action === "edit") {
      navigate("edit-program", { state: { editData: row } });
    } else if (action === "delete") {
      setDeleteTarget(row);
    } else if (action === "replicate") {
      const result = await dispatch(replicateProgram(row.id));
      if (replicateProgram.fulfilled.match(result)) {
        dispatch(
          fetchProgramList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            duration: durationFilter,
            status: statusFilter,
          }),
        );
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteProgram(deleteTarget.id));
      if (deleteProgram.fulfilled.match(result)) {
        dispatch(
          fetchProgramList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            duration: durationFilter,
            status: statusFilter,
          }),
        );
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleConfirm) return;
    const { row, action, value } = toggleConfirm;
    setIsUpdating(true);

    try {
      if (action === "toggle-status") {
        const status = value ? "Active" : "Inactive";
        await dispatch(toggleProgramStatus({ id: row.id, status }));
        toast.success("Status updated successfully!");
      } else if (action === "toggle-food-visibility") {
        await dispatch(toggleFoodVisibility(row.id));
        toast.success("Food visibility updated successfully!");
      }
    } finally {
      setIsUpdating(false);
      setToggleConfirm(null);
    }
  };

  const columns = useMemo(() => getManageProgramColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // Local fallback filtering
  const displayData = useMemo(() => {
    let data = programs || [];
    if (durationFilter) {
      data = data.filter((p) => String(p.duration) === String(durationFilter));
    }
    if (
      statusFilter &&
      ["active", "inactive"].includes(statusFilter.toLowerCase())
    ) {
      data = data.filter(
        (p) =>
          String(p.status || "Active").toLowerCase() ===
          statusFilter.toLowerCase(),
      );
    }
    return data;
  }, [programs, durationFilter, statusFilter]);

  const filterConfig = [
    {
      type: "select",
      id: "durationFilter",
      label: "Duration",
      value: durationFilter,
      onChange: setDurationFilter,
      options: [
        { label: "4 Weeks", value: "4" },
        { label: "6 Weeks", value: "6" },
        { label: "8 Weeks", value: "8" },
        { label: "12 Weeks", value: "12" },
      ],
      placeholder: "All Durations",
    },
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Zero Enrollment", value: "zero_enrollment" },
        { label: "Stale Content", value: "stale_content" },
      ],
      placeholder: "All Status",
    },
  ];

  const localKpis = useMemo(() => {
    if (kpis) return kpis;
    const all = programs || [];
    const active = all.filter(
      (p) => String(p.status || "Active").toLowerCase() === "active",
    ).length;
    return {
      totalPrograms: serverPagination?.total || all.length,
      activePrograms: active,
      inactivePrograms: all.length - active,
      // The list API doesn't return a per-program `assigned_users_count`,
      // and there's no cross-program aggregate endpoint yet (see the
      // Backend TODO in program.slice.js) — so there's no real number to
      // fall back to here. Leave it null so ModuleKpiRow shows "—"
      // instead of a fake 0 until the backend ships `kpis.totalAssignedUsers`.
      totalAssignedUsers: null,
    };
  }, [kpis, programs, serverPagination]);

  const kpiItems = [
    {
      icon: ClipboardCheck,
      label: "Total Programs",
      value: localKpis?.totalPrograms?.toLocaleString() || "0",
      description: "Tap to view all",
      onClick: () => setStatusFilter(""),
      isSelected: statusFilter === "",
    },
    {
      icon: CheckCircle2,
      label: "Active Programs",
      value: localKpis?.activePrograms?.toLocaleString() || "0",
      description: "Tap to filter",
      tone: "emerald",
      onClick: () => setStatusFilter("Active"),
      isSelected: statusFilter === "Active",
    },
    {
      icon: XCircle,
      label: "Inactive Programs",
      value: localKpis?.inactivePrograms?.toLocaleString() || "0",
      description: "Tap to filter",
      tone: "rose",
      onClick: () => setStatusFilter("Inactive"),
      isSelected: statusFilter === "Inactive",
    },
    {
      icon: Users2,
      label: "Assigned Users",
      value:
        localKpis?.totalAssignedUsers != null
          ? localKpis.totalAssignedUsers.toLocaleString()
          : undefined,
      description: "Across all programs",
      tone: "violet",
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Program"
                icon={
                  <LayoutDashboard className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading="Create, configure, and monitor health and wellness programs."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                onClick={() => navigate("add-program")}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Program</span>
              </Button>
            </div>
          </div>
        </Header>

        <ModuleKpiRow items={kpiItems} loading={loading && !programs?.length} />

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
            searchPlaceholder="Search by program name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setDurationFilter("");
                  setStatusFilter("");
                }}
              />
            }
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={!!toggleConfirm}
        onClose={() => setToggleConfirm(null)}
        onConfirm={handleConfirmToggle}
        title={toggleConfirm?.title || ""}
        message={toggleConfirm?.message || ""}
        type="brand"
        confirmText="Update"
        loading={isUpdating}
      />
    </Container>
  );
};

export default ManageProgramPage;
