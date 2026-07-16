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
import { getManageDietProgramColumns } from "@/components/columns/manage.diet.program.columns";

const ManageDietProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dietMeals, loading } = useSelector((state) => state.manageDiet);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getDietMeals(id));
    }
  }, [dispatch, id]);

  const handleAction = async (row, action, val) => {
    if (action === "toggle") {
      const newStatus = val ? "Active" : "Inactive";
      const resultAction = await dispatch(
        toggleDietMealStatus({ id: row.id, status: newStatus }),
      );
      if (toggleDietMealStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        dispatch(getDietMeals(id));
      } else {
        toast.error(resultAction.payload || "Failed to update status.");
      }
    } else if (action === "edit") {
      navigate(`/admin/manage-program/manage/diet-plan/edit-diet/${id}/${row.id}`);
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this diet meal?")) {
        const resultAction = await dispatch(deleteDietMeal(row.id));
        if (deleteDietMeal.fulfilled.match(resultAction)) {
          toast.success("Diet meal deleted successfully!");
          dispatch(getDietMeals(id));
        } else {
          toast.error(resultAction.payload || "Failed to delete diet meal.");
        }
      }
    }
  };

  const columns = useMemo(() => getManageDietProgramColumns(handleAction), []);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <PageHeader
            heading="Manage Diet Meal plan"
            icon={<CalendarCheck className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Manage day-by-day diet meals for this program."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
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
    </Container>
  );
};

export default ManageDietProgramPage;
