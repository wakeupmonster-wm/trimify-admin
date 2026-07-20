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

const ManageFitzoneSessionPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sessions, loading } = useSelector((state) => state.fitzoneSession);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getFitzoneSessions(id));
    }
  }, [dispatch, id]);

  const handleAction = async (row, action, value) => {
    if (action === "edit") {
      navigate(
        `/admin/fitzone-management/manage/session/edit-session/${id}/${row.id}`,
        { state: { editData: row } },
      );
    } else if (action === "toggle-status") {
      const statusStr = value ? "Active" : "Inactive";
      const resultAction = await dispatch(
        toggleFitzoneSessionStatus({ id: row.id, status: statusStr }),
      );
      if (toggleFitzoneSessionStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        dispatch(getFitzoneSessions(id));
      } else {
        toast.error(resultAction.payload || "Failed to update status");
      }
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      const resultAction = await dispatch(
        deleteFitzoneSession(deleteTarget.id),
      );
      if (deleteFitzoneSession.fulfilled.match(resultAction)) {
        toast.success("Session deleted successfully!");
        dispatch(getFitzoneSessions(id));
      } else {
        toast.error(resultAction.payload || "Failed to delete session");
      }
      setDeleteTarget(null);
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
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Session Management"
                icon={<Video className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Manage workout sessions and videos."
              />
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                onClick={openAddModal}
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
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
            searchPlaceholder="Search..."
            pagination={pagination}
            onPaginationChange={setPagination}
            loading={loading}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Session"
        message={`Are you sure you want to delete the session "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default ManageFitzoneSessionPage;
