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
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Session Management"
            icon={<Video className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Manage workout sessions and videos."
          />
          <Button
            onClick={openAddModal}
            className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </Button>
        </Header>

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
