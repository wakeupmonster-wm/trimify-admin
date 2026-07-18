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
  const [deleteModal, setDeleteModal] = useState({ open: false, rowData: null });

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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Nutrition Food"
              icon={<Apple className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Manage all nutrition food items and recipes."
            />

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                onClick={() => navigate("/admin/data-management/add-nutrition")}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Food
              </Button>
              <Button
                onClick={() => navigate("/admin/data-management/ai-food-upload")}
                className="w-full xs:w-auto bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Food
              </Button>
            </div>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={nutrition || []}
          rowCount={nutrition?.length ? serverPagination.total : 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search food..."
          itemName="entries"
          isLoading={loading}
          manualPagination={true}
          manualFiltering={true}
        />
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
