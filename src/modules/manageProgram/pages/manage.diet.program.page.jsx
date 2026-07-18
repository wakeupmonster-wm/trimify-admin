import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/datatable";
import {
  getDietMeals,
  toggleDietMealStatus,
  deleteDietMeal,
} from "../store/diet.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getManageDietProgramColumns } from "@/components/columns/manage.diet.program.columns";
import { useDebounce } from "@/hooks/useDebounce";

const ManageDietProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dietMeals, loading } = useSelector((state) => state.manageDiet);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDietMeals = () => {
    if (id) {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      };
      dispatch(getDietMeals({ id, params }));
    }
  };

  useEffect(() => {
    fetchDietMeals();
  }, [
    dispatch,
    id,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
  ]);

  const handleAction = async (row, action, val) => {
    if (action === "toggle") {
      const newStatus = val ? "Active" : "Inactive";
      const resultAction = await dispatch(
        toggleDietMealStatus({ id: row.id, status: newStatus }),
      );
      if (toggleDietMealStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        fetchDietMeals();
      } else {
        toast.error(resultAction.payload || "Failed to update status.");
      }
    } else if (action === "edit") {
      navigate(
        `/admin/manage-program/manage/diet-plan/edit-diet/${id}/${row.id}`,
      );
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const resultAction = await dispatch(deleteDietMeal(deleteTarget.id));
    if (deleteDietMeal.fulfilled.match(resultAction)) {
      toast.success("Diet meal deleted successfully!");
      fetchDietMeals();
    } else {
      toast.error(resultAction.payload || "Failed to delete diet meal.");
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(() => getManageDietProgramColumns(handleAction), []);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <PageHeader
            heading="Manage Diet Meal plan"
            icon={<CalendarCheck className="w-9 h-9 text-white" />}
            color="bg-app-primary2 shadow-blue-200"
            subheading="Manage day-by-day diet meals for this program."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
              onClick={() =>
                navigate(
                  `/admin/manage-program/manage/diet-plan/add-diet/${id}`,
                )
              }
            >
              <Plus className="w-4 h-4" />
              Add Diet & Meal
            </Button>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={dietMeals || []}
          rowCount={(dietMeals || []).length}
          pagination={pagination}
          setPagination={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          loading={loading}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diet Meal"
        message={`Are you sure you want to delete the diet meal "${deleteTarget?.diet_meal_data?.Meal_title || deleteTarget?.meal}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default ManageDietProgramPage;
