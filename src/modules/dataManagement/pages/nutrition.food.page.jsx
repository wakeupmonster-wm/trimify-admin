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
    console.log("Delete nutrition food", deleteModal.rowData);
    // Add dispatch for delete action here when API is ready
    setDeleteModal({ open: false, rowData: null });
  };

  const columns = useMemo(() => getNutritionFoodColumns(handleAction), []);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Nutrition Food"
                icon={<Apple className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-brand-blue"
                subheading="Manage all nutrition food items and recipes."
              />
            </div>

            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                onClick={() => navigate("/admin/data-management/add-nutrition")}
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Food</span>
              </Button>
              <Button
                onClick={() =>
                  navigate("/admin/data-management/ai-food-upload")
                }
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <UploadCloud className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Upload Food</span>
              </Button>
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
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this nutrition food? This action cannot be undone."
      />
    </Container>
  );
};

export default NutritionFoodPage;
