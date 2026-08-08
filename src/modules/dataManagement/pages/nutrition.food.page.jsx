import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Plus, UploadCloud, Apple } from "lucide-react";
import Header from "@/components/common/header";
import { DataTable } from "@/components/shared/datatable";
import { Button } from "@/components/ui/button";
import { getNutritionFoodColumns } from "@/components/columns/nutrition.food.columns";
import { fetchNutritionList } from "../store/nutrition.slice";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import CTAButton from "@/components/common/CTAButton";

const NutritionFoodPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    nutrition,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.nutrition);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(
      fetchNutritionList({
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
    if (action === "edit") {
      navigate(`/admin/data-management/edit-nutrition/${row.id}`, {
        state: { editData: row },
      });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    setIsDeleting(true);
    try {
      // Add dispatch for delete action here when API is ready
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, rowData: null });
    }
  };

  const columns = useMemo(() => getNutritionFoodColumns(handleAction), []);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Nutrition Food"
                icon={<Apple className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage all nutrition food items and recipes."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={Plus}
                label="Add Food"
                onClick={() => navigate("/admin/data-management/add-nutrition")}
              />
              <CTAButton
                icon={UploadCloud}
                label="Upload Food"
                onClick={() =>
                  navigate("/admin/data-management/ai-food-upload")
                }
              />
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={nutrition || []}
            rowCount={nutrition?.length ? serverPagination.total : 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by food name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={true}
            manualFiltering={true}
            onRowClick={(row) => handleAction(row, "edit")}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this nutrition food? This action cannot be undone."
        loading={isDeleting}
      />
    </Container>
  );
};

export default NutritionFoodPage;
