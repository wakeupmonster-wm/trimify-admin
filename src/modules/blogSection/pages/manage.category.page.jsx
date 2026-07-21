import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
import { getManageCategoryColumns } from "@/components/columns/manage.category.columns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogCategories,
  toggleBlogCategoryStatus,
  deleteBlogCategory,
} from "../store/blog.slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ManageCategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, categoriesLoading, categoriesPagination } = useSelector(
    (state) => state.blogSection,
  );

  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryPage, setCategoryPageState] = useState({
    pageIndex: Math.max(0, categoriesPagination.page - 1),
    pageSize: categoriesPagination.limit || 10,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });

  useEffect(() => {
    dispatch(
      fetchBlogCategories({
        page: categoryPage.pageIndex + 1,
        limit: categoryPage.pageSize,
        search: categoryFilter,
      }),
    );
  }, [dispatch, categoryPage.pageIndex, categoryPage.pageSize, categoryFilter]);

  const handleCategoryAction = async (row, action, value) => {
    if (action === "toggle-status") {
      setToggleModal({ open: true, rowData: row, targetStatus: value });
    } else if (action === "edit") {
      navigate(`/admin/blog-section/edit-category/${row.id}`, {
        state: { editData: row },
      });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    try {
      await dispatch(toggleBlogCategoryStatus(toggleModal.rowData.id)).unwrap();
      toast.success("Category status updated successfully!");
      dispatch(
        fetchBlogCategories({
          page: categoryPage.pageIndex + 1,
          limit: categoryPage.pageSize,
          search: categoryFilter,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to update category status");
    }
    setToggleModal({ open: false, rowData: null, targetStatus: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    try {
      await dispatch(deleteBlogCategory(deleteModal.rowData.id)).unwrap();
      toast.success("Category deleted successfully!");
      setDeleteModal({ open: false, rowData: null });
      dispatch(
        fetchBlogCategories({
          page: categoryPage.pageIndex + 1,
          limit: categoryPage.pageSize,
          search: categoryFilter,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to delete category");
    }
  };

  const categoryColumns = useMemo(
    () => getManageCategoryColumns(handleCategoryAction),
    [],
  );
  const displayCategories =
    categories && categories.length > 0 ? categories : [];
  const isCategoryManual = !!(
    categoriesPagination && categoriesPagination.total > 0
  );

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Manage Category"
                icon={<FileText className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-md"
                subheading="Manage blog categories for the platform."
              />
            </div>

            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
                onClick={() => navigate("/admin/blog-section/add-category")}
              >
                <Plus className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Category</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={categoryColumns}
            data={displayCategories}
            rowCount={
              isCategoryManual
                ? categoriesPagination.total
                : displayCategories?.length || 0
            }
            pagination={categoryPage}
            onPaginationChange={setCategoryPageState}
            globalFilter={categoryFilter}
            setGlobalFilter={setCategoryFilter}
            searchPlaceholder="Search by title or description..."
            itemName="categories"
            isLoading={categoriesLoading}
            manualPagination={isCategoryManual}
            manualFiltering={isCategoryManual}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() => setToggleModal({ open: false, rowData: null, targetStatus: false })}
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this category to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default ManageCategoryPage;
