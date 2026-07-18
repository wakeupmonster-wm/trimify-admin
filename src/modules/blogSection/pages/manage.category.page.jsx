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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Category"
              icon={<FileText className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-md"
              subheading="Manage blog categories for the platform."
            />

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
                onClick={() => navigate("/admin/blog-section/add-category")}
              >
                <Plus className="w-4 h-4" />
                Create Category
              </Button>
            </div>
          </div>
        </Header>

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
          searchPlaceholder="Search categories..."
          itemName="categories"
          isLoading={categoriesLoading}
          manualPagination={isCategoryManual}
          manualFiltering={isCategoryManual}
        />
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
