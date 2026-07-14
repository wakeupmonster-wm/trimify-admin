import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/shared/datatable";
import { getNutritionColumns } from "@/components/columns/nutrition.columns";
import { fetchNutritionList } from "../store/nutrition.slice";
import { NutritionDetailDialog } from "./nutrition-detail.dialog";

export const BulkFoodUploadTab = () => {
  const dispatch = useDispatch();
  const { nutrition, loading } = useSelector((state) => state.nutritionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    dispatch(fetchNutritionList());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return nutrition;
    const term = globalFilter.toLowerCase();
    return nutrition.filter((item) =>
      [item.Meal_title, item.Meal_Type, item.Meal_Status]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [nutrition, globalFilter]);

  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  const columns = useMemo(() => getNutritionColumns(setSelectedMeal), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        rowCount={filteredData.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={globalFilter}
        setGlobalFilter={handleGlobalFilterChange}
        searchPlaceholder="Search food items..."
        itemName="food items"
        isLoading={loading}
        manualPagination={true}
        manualFiltering={true}
      />

      <NutritionDetailDialog
        meal={selectedMeal}
        open={!!selectedMeal}
        onOpenChange={(open) => !open && setSelectedMeal(null)}
      />
    </>
  );
};
