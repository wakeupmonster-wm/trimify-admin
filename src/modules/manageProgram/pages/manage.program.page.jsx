import { Container } from '@/components/common/container';
import { PageHeader } from '@/components/common/headSubhead';
import { LayoutDashboard, Plus } from 'lucide-react';
import Header from '@/components/common/header';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/shared/datatable';
import { getManageProgramColumns } from '@/components/columns/manage.program.columns';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProgramList,
  toggleProgramStatus,
  toggleFoodVisibility,
  deleteProgram,
  replicateProgram
} from '../store/program.slice';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { toast } from 'sonner';


const ManageProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { programs, loading, pagination: serverPagination } = useSelector((state) => state.manageProgram);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, row: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fallback to empty array if no data
  const displayData = programs || [];

  const loadPrograms = () => {
    dispatch(fetchProgramList({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: globalFilter
    }));
  };

  useEffect(() => {
    loadPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      console.log("Toggle status for:", row.id, "to", value);
      const status = value ? "Active" : "Inactive";
      dispatch(toggleProgramStatus({ id: row.id, status }));
    } else if (action === "toggle-food-visibility") {
      console.log("Toggle food visibility for:", row.id, "to", value);
      dispatch(toggleFoodVisibility(row.id));
    } else if (action === "view-user") {
      console.log("View users for program:", row.id);
    } else if (action === "open-program") {
      console.log("Open program:", row.id);
    } else if (action === "edit") {
      navigate("edit-program", { state: { editData: row } });
    } else if (action === "delete") {
      console.log("Delete program:", row);
      const result = await dispatch(deleteProgram(row.id));
      if (deleteProgram.fulfilled.match(result)) {
        dispatch(fetchProgramList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter
        }));
      }
    } else if (action === "replicate") {
      console.log("Replicate program:", row.id);
      const result = await dispatch(replicateProgram(row.id));
      if (replicateProgram.fulfilled.match(result)) {
        dispatch(fetchProgramList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter
        }));
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete.row) return;
    setDeleteLoading(true);
    dispatch(deleteProgram(confirmDelete.row.id))
      .unwrap()
      .then(() => {
        toast.success("Program deleted successfully");
        setConfirmDelete({ open: false, row: null });
      })
      .catch((err) => toast.error(err || "Failed to delete program"))
      .finally(() => setDeleteLoading(false));
  };

  const columns = useMemo(() => getManageProgramColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  return (
    <Container>
      {/* Top Header Section outside of the white card */}


      <div className='space-y-8'>
        <Header>
          <PageHeader
            heading="Manage Program"
            icon={<LayoutDashboard className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Create, configure, and monitor health and wellness programs."
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
              onClick={() => navigate("add-program")}
            >
              <Plus className="w-4 h-4" />
              Create Program
            </Button>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={displayData}
          rowCount={isManual ? serverPagination.total : (displayData?.length || 0)}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search programs..."
          itemName="entries"
          isLoading={loading}
          manualPagination={isManual}
          manualFiltering={isManual}
        />
      </div>

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, row: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Program"
        message={`Are you sure you want to delete "${confirmDelete.row?.programName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={deleteLoading}
      />
    </Container>
  );
};

export default ManageProgramPage;
