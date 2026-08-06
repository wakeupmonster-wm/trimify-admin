import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Plus } from "lucide-react";
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
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
      setToggleModal({ open: true, rowData: row, targetStatus: val });
    } else if (action === "edit") {
      navigate(
        `/admin/manage-program/manage/diet-plan/edit-diet/${id}/${row.id}`,
      );
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const newStatus = toggleModal.targetStatus ? "Active" : "Inactive";
    setIsUpdating(true);
    try {
      const resultAction = await dispatch(
        toggleDietMealStatus({ id: toggleModal.rowData.id, status: newStatus }),
      );
      if (toggleDietMealStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        fetchDietMeals();
      } else {
        toast.error(resultAction.payload || "Failed to update status.");
      }
    } finally {
      setIsUpdating(false);
      setToggleModal({ open: false, rowData: null, targetStatus: false });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteDietMeal(deleteTarget.id));
      if (deleteDietMeal.fulfilled.match(resultAction)) {
        toast.success("Diet meal deleted successfully!");
        fetchDietMeals();
      } else {
        toast.error(resultAction.payload || "Failed to delete diet meal.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns = useMemo(() => getManageDietProgramColumns(handleAction), []);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Manage Diet Meal Plan"
                icon={<CalendarCheck className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage day-by-day diet meals for this program."
              />
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                onClick={() =>
                  navigate(
                    `/admin/manage-program/manage/diet-plan/add-diet/${id}`,
                  )
                }
                className="w-full sm:w-auto flex-1 md:flex-none bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add Diet & Meal</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={dietMeals || []}
            rowCount={(dietMeals || []).length}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            loading={loading}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diet Meal"
        message={`Are you sure you want to delete the diet meal "${deleteTarget?.diet_meal_data?.Meal_title || deleteTarget?.meal}"? This action cannot be undone.`}
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() =>
          !isUpdating &&
          setToggleModal({ open: false, rowData: null, targetStatus: false })
        }
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of "${toggleModal.rowData?.diet_meal_data?.Meal_title || toggleModal.rowData?.meal || "this diet meal"}" to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        loading={isUpdating}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default ManageDietProgramPage;
