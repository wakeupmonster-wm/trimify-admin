import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { LayoutDashboard, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
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
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.manageProgram);

  const [globalFilter, setGlobalFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProgramList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        duration: durationFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    durationFilter,
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
      console.log("Replicate program:", row.id);
      const result = await dispatch(replicateProgram(row.id));
      if (replicateProgram.fulfilled.match(result)) {
        dispatch(
          fetchProgramList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
            duration: durationFilter,
          }),
        );
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteProgram(deleteTarget.id));
    if (deleteProgram.fulfilled.match(result)) {
      dispatch(
        fetchProgramList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
          duration: durationFilter,
        }),
      );
    }
    setDeleteTarget(null);
  };

  const handleConfirmToggle = () => {
    if (!toggleConfirm) return;
    const { row, action, value } = toggleConfirm;

    if (action === "toggle-status") {
      const status = value ? "Active" : "Inactive";
      dispatch(toggleProgramStatus({ id: row.id, status }));
      toast.success("Status updated successfully!");
    } else if (action === "toggle-food-visibility") {
      dispatch(toggleFoodVisibility(row.id));
      toast.success("Food visibility updated successfully!");
    }

    setToggleConfirm(null);
  };

  const columns = useMemo(() => getManageProgramColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  // Local fallback filtering
  const displayData = useMemo(() => {
    if (!durationFilter) return programs || [];
    return (programs || []).filter(
      (p) => String(p.duration) === String(durationFilter),
    );
  }, [programs, durationFilter]);

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
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Manage Program"
                icon={
                <LayoutDashboard className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-blue-200"
                subheading="Create, configure, and monitor health and wellness programs."
              />
            </div>

            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
                onClick={() => navigate("add-program")}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Program</span>
              </Button>
            </div>
          </div>
        </Header>

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
            searchPlaceholder="Search program name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => setDurationFilter("")}
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
      />

      <ConfirmModal
        isOpen={!!toggleConfirm}
        onClose={() => setToggleConfirm(null)}
        onConfirm={handleConfirmToggle}
        title={toggleConfirm?.title || ""}
        message={toggleConfirm?.message || ""}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default ManageProgramPage;
