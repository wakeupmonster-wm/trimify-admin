import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Layers,
  Plus,
  FolderTree,
  CheckCircle,
  EyeOff,
  Sparkles,
  X,
} from "lucide-react";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import { getManageCategoryColumns } from "@/components/columns/manage.category.columns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogCategories,
  toggleBlogCategoryStatus,
  deleteBlogCategory,
} from "../store/blog.slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TbCategory2 } from "react-icons/tb";

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
  const [statusFilter, setStatusFilter] = useState("");
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
      const statusStr = toggleModal.targetStatus ? "Active" : "Inactive";
      await dispatch(toggleBlogCategoryStatus({ id: toggleModal.rowData.id, status: statusStr })).unwrap();
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
  const displayCategories = useMemo(() => {
    let list = categories && categories.length > 0 ? categories : [];
    if (statusFilter === "Active") {
      list = list.filter((c) => c.status === "Active");
    } else if (statusFilter === "Inactive") {
      list = list.filter((c) => c.status !== "Active");
    } else if (statusFilter === "Recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      list = list.filter(
        (c) => c.created_at && new Date(c.created_at) >= thirtyDaysAgo,
      );
    }
    return list;
  }, [categories, statusFilter]);

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Recent", value: "Recent" },
      ],
      placeholder: "All Status",
    },
  ];

  const isCategoryManual = !!(
    categoriesPagination && categoriesPagination.total > 0
  );

  // KPI Calculations
  const kpiItems = useMemo(() => {
    const list = categories || [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const total = categoriesPagination?.total || list.length;
    const active = list.filter((c) => c.status === "Active").length;
    const inactive = list.filter((c) => c.status !== "Active").length;
    const recent = list.filter(
      (c) => c.created_at && new Date(c.created_at) >= thirtyDaysAgo,
    ).length;

    return [
      {
        label: "Total Categories",
        value: total,
        icon: FolderTree,
        tone: statusFilter === "" ? "blue" : "slate",
        description: "All blog categories",
        onClick: () => setStatusFilter(""),
      },
      {
        label: "Active Categories",
        value: active,
        icon: CheckCircle,
        tone:
          statusFilter === "Active"
            ? "emerald"
            : statusFilter === ""
              ? "emerald"
              : "slate",
        description: "Currently visible",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Active" ? "" : "Active")),
      },
      {
        label: "Inactive Categories",
        value: inactive,
        icon: EyeOff,
        tone:
          statusFilter === "Inactive"
            ? "amber"
            : statusFilter === ""
              ? "amber"
              : "slate",
        description: "Hidden from users",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Inactive" ? "" : "Inactive")),
      },
      {
        label: "Recently Added",
        value: recent,
        icon: Sparkles,
        tone:
          statusFilter === "Recent"
            ? "indigo"
            : statusFilter === ""
              ? "indigo"
              : "slate",
        description: "Added in last 30 days",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Recent" ? "" : "Recent")),
      },
    ];
  }, [categories, categoriesPagination?.total, statusFilter]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Category"
                icon={<TbCategory2 className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage blog categories for the platform."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                onClick={() => navigate("/admin/blog-section/add-category")}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Category</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* KPIs Row */}
        <ModuleKpiRow
          items={kpiItems}
          loading={categoriesLoading && !categories?.length}
        />

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
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => setStatusFilter("")}
              />
            }
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
        onClose={() =>
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
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
