import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Utensils, Plus } from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import { getFoodCategories, deleteFoodCategory } from "../store/food.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getManageFoodCategoryColumns } from "@/components/columns/manage.food.category.columns";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const ManageFoodProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    categories,
    pagination: serverPagination,
    loading,
  } = useSelector((state) => state.manageFood);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(
      getFoodCategories({
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

  const handleAction = (row, action) => {
    if (action === "manage-food") {
      // Navigate to manage specific foods for this program and category
      navigate(`/admin/manage-program/manage/food/add-food/${id}/${row.id}`);
    } else if (action === "edit") {
      navigate(
        `/admin/manage-program/manage/food/edit-food-category/${id}/${row.id}`,
        { state: { editData: row } },
      );
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteFoodCategory(deleteTarget.id));
    if (deleteFoodCategory.fulfilled.match(result)) {
      toast.success("Food Category deleted successfully");
      dispatch(
        getFoodCategories({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
    } else {
      toast.error(result.payload || "Failed to delete food category.");
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(
    () => getManageFoodCategoryColumns(handleAction),
    [id],
  );

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Food Category"
                icon={<Utensils className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Manage approved and non-approved foods and food categories for this program."
              />
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 xl:flex-none bg-slate-50 hover:bg-app-primary2 text-secondary-foreground hover:text-white border rounded-md px-4 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all duration-300"
                onClick={() =>
                  navigate(
                    "/admin/manage-program/manage/food/add-food-category",
                  )
                }
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Food Category</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={categories}
            rowCount={serverPagination.total || categories.length}
            searchPlaceholder="Search by category name..."
            pagination={pagination}
            setPagination={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isLoading={loading}
            manualPagination={true}
            pageCount={serverPagination.totalPages || 1}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Food Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name || deleteTarget?.title}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default ManageFoodProgramPage;
