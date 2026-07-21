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
import { useDebounce } from "@/hooks/useDebounce";

const ManageFitzoneCategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading, pagination: serverPagination } = useSelector((state) => state.fitzoneCategory);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getFitzoneCategories({
        id,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch
      }));
    }
  }, [dispatch, id, pagination.pageIndex, pagination.pageSize, debouncedSearch]);

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
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="WorkOut Sessions Management"
                icon={<Layers className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Manage categories for workout sessions."
              />
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                onClick={openAddModal}
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Session Category</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            data={categories || []}
            columns={columns}
            searchable={true}
            searchPlaceholder="Search by category name..."
            itemName="categories"
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            loading={loading}
            manualPagination={true}
            manualFiltering={true}
            pageCount={serverPagination?.totalPages || 1}
          />
        </div>
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
