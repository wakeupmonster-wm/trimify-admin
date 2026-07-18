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
      console.log("Toggle status for:", row.id, "to", value);
      const status = value ? "Active" : "Inactive";
      dispatch(toggleProgramStatus({ id: row.id, status }));
    } else if (action === "toggle-food-visibility") {
      console.log("Toggle food visibility for:", row.id, "to", value);
      dispatch(toggleFoodVisibility(row.id));
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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Program"
              icon={<LayoutDashboard className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-blue-200"
              subheading="Create, configure, and monitor health and wellness programs."
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="w-full xs:w-auto bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
                onClick={() => navigate("add-program")}
              >
                <Plus className="w-4 h-4" />
                Create Program
              </Button>
            </div>
          </div>
        </Header>

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
          searchPlaceholder="Search programs..."
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
      />
    </Container>
  );
};

export default ManageProgramPage;
