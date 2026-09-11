import React, { useCallback, useEffect, useMemo, useState } from "react";
import CTAButton from "@/components/common/CTAButton";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { CalendarCheck, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  DataTableActiveChips,
  DataTableFilters,
} from "@/components/shared/datatable";
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

  const {
    dietMeals,
    pagination: serverPagination,
    loading,
  } = useSelector((state) => state.manageDiet);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [mealFilter, setMealFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDietMeals = useCallback(() => {
    if (!id) return;

    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(weekFilter && { week: weekFilter }),
      ...(mealFilter && { meal: mealFilter }),
      ...(dayFilter && { day: dayFilter }),
      ...(statusFilter && { status: statusFilter }),
    };
    dispatch(getDietMeals({ id, params }));
  }, [
    dayFilter,
    debouncedSearch,
    dispatch,
    id,
    mealFilter,
    pagination.pageIndex,
    pagination.pageSize,
    statusFilter,
    weekFilter,
  ]);

  useEffect(() => {
    fetchDietMeals();
  }, [fetchDietMeals]);

  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  };

  const handleAction = useCallback((row, action, val) => {
    if (action === "toggle") {
      setToggleModal({ open: true, rowData: row, targetStatus: val });
    } else if (action === "edit") {
      navigate(
        `/admin/manage-program/manage/diet-plan/edit-diet/${id}/${row.id}`,
      );
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  }, [id, navigate]);

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

  const columns = useMemo(
    () => getManageDietProgramColumns(handleAction),
    [handleAction],
  );

  const resetToFirstPage = (setValue) => (value) => {
    setValue(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const filterConfig = [
    {
      type: "select", id: "week", label: "Week", value: weekFilter,
      onChange: resetToFirstPage(setWeekFilter),
      options: Array.from({ length: 12 }, (_, index) => ({ label: `Week ${index + 1}`, value: String(index + 1) })),
      placeholder: "All Weeks",
    },
    {
      type: "select", id: "meal", label: "Meal Type", value: mealFilter,
      onChange: resetToFirstPage(setMealFilter),
      options: ["Breakfast", "Lunch", "Dinner", "Snacks"], placeholder: "All Meals",
    },
    {
      type: "select", id: "day", label: "Meal Day", value: dayFilter,
      onChange: resetToFirstPage(setDayFilter),
      options: Array.from({ length: 7 }, (_, index) => ({ label: `Day ${index + 1}`, value: String(index + 1) })),
      placeholder: "All Days",
    },
    {
      type: "select", id: "status", label: "Status", value: statusFilter,
      onChange: resetToFirstPage(setStatusFilter),
      options: ["Active", "Inactive"], placeholder: "All Status",
    },
  ];

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
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
              <CTAButton
                icon={Plus}
                label="Add Diet & Meal"
                onClick={() =>
                  navigate(
                    `/admin/manage-program/manage/diet-plan/add-diet/${id}`,
                  )
                }
              />
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={dietMeals || []}
            rowCount={serverPagination?.total ?? (dietMeals || []).length}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={handleGlobalFilterChange}
            isLoading={loading}
            manualPagination
            manualFiltering
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setWeekFilter("");
                  setMealFilter("");
                  setDayFilter("");
                  setStatusFilter("");
                  setPagination((current) => ({ ...current, pageIndex: 0 }));
                }}
              />
            }
            onRowClick={(row) => handleAction(row.original, "edit")}
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
