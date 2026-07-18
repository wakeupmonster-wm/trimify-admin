import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/datatable";
import { Plus, Layers } from "lucide-react";
import { getManageFitzoneCategoryColumns } from "@/components/columns/fitzone.category.columns";
import {
  getFitzoneCategories,
  deleteFitzoneCategory,
} from "../store/fitzone.category.slice";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";

const ManageFitzoneCategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading } = useSelector((state) => state.fitzoneCategory);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getFitzoneCategories(id));
    }
  }, [dispatch, id]);

  const handleAction = (row, action) => {
    if (action === "edit") {
      navigate(
        `/admin/fitzone-management/manage/category/edit-category/${id}/${row.id}`,
        { state: { editData: row } },
      );
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteFitzoneCategory(deleteTarget.id))
        .unwrap()
        .then(() => {
          toast.success("Category deleted successfully!");
          dispatch(getFitzoneCategories(id));
        })
        .catch((err) => {
          toast.error(err || "Failed to delete category");
        })
        .finally(() => {
          setDeleteTarget(null);
        });
    }
  };

  const columns = useMemo(
    () => getManageFitzoneCategoryColumns(handleAction),
    [],
  );

  const openAddModal = () => {
    navigate(`/admin/fitzone-management/manage/category/add-category/${id}`);
  };

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="WorkOut Sessions Management"
            icon={<Layers className="w-9 h-9 text-white" />}
            color="bg-app-primary2 shadow-blue-200"
            subheading="Manage categories for workout sessions."
          />
          <Button
            onClick={openAddModal}
            className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Session Category
          </Button>
        </Header>

        <DataTable
          data={categories || []}
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
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default ManageFitzoneCategoryPage;
