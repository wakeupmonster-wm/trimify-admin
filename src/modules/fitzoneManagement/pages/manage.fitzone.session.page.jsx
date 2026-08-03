import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/datatable";
import { Plus, Video } from "lucide-react";
import { getManageFitzoneSessionColumns } from "@/components/columns/fitzone.session.columns";
import {
  getFitzoneSessions,
  toggleFitzoneSessionStatus,
  deleteFitzoneSession,
} from "../store/fitzone.session.slice";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";

const ManageFitzoneSessionPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    sessions,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.fitzoneSession);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [toggleTarget, setToggleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);

  useEffect(() => {
    if (id) {
      dispatch(
        getFitzoneSessions({
          id,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch,
        }),
      );
    }
  }, [
    dispatch,
    id,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
  ]);

  const handleAction = async (row, action, value) => {
    if (action === "edit") {
      navigate(
        `/admin/fitzone-management/manage/session/edit-session/${id}/${row.id}`,
        { state: { editData: row } },
      );
    } else if (action === "toggle-status") {
      setToggleTarget({ row, value });
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmToggle = async () => {
    if (toggleTarget) {
      const { row, value } = toggleTarget;
      const statusStr = value ? "Active" : "Inactive";
      setIsUpdating(true);
      try {
        const resultAction = await dispatch(
          toggleFitzoneSessionStatus({ id: row.id, status: statusStr }),
        );
        if (toggleFitzoneSessionStatus.fulfilled.match(resultAction)) {
          toast.success("Status updated successfully!");
          dispatch(
            getFitzoneSessions({
              id,
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: debouncedSearch,
            }),
          );
        } else {
          toast.error(resultAction.payload || "Failed to update status");
        }
      } finally {
        setIsUpdating(false);
        setToggleTarget(null);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      setIsDeleting(true);
      try {
        const resultAction = await dispatch(
          deleteFitzoneSession(deleteTarget.id),
        );
        if (deleteFitzoneSession.fulfilled.match(resultAction)) {
          toast.success("Session deleted successfully!");
          dispatch(
            getFitzoneSessions({
              id,
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: debouncedSearch,
            }),
          );
        } else {
          toast.error(resultAction.payload || "Failed to delete session");
        }
      } finally {
        setIsDeleting(false);
        setDeleteTarget(null);
      }
    }
  };

  const columns = useMemo(
    () => getManageFitzoneSessionColumns(handleAction),
    [dispatch, id],
  );

  const openAddModal = () => {
    navigate(`/admin/fitzone-management/manage/session/add-session/${id}`);
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Session Management"
                icon={<Video className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage workout sessions and videos."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                onClick={openAddModal}
                className="w-full sm:w-auto flex-1 md:flex-none bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Session</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            data={sessions || []}
            columns={columns}
            searchable={true}
            searchPlaceholder="Search by session title or category..."
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            loading={loading}
            manualPagination={true}
            manualFiltering={true}
            pageCount={serverPagination?.totalPages || 1}
            rowCount={serverPagination?.total || 1}
            itemName="sessions"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Session"
        message={`Are you sure you want to delete the session "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of "${toggleTarget?.row?.title || "this session"}" to ${toggleTarget?.value ? "Active" : "Inactive"}?`}
        confirmText="Update"
        type="brand"
        loading={isUpdating}
      />
    </Container>
  );
};

export default ManageFitzoneSessionPage;
