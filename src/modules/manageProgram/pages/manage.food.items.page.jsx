import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Utensils } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/datatable";
import {
  getFoodList,
  addFood,
  updateFood,
  toggleFoodStatus,
  deleteFood,
  getFoodCategoriesDrop,
} from "../store/food.slice";
import { getManageFoodItemsColumns } from "@/components/columns/manage.food.items.columns";
import ConfirmModal from "@/components/common/ConfirmModal";

const ManageFoodItemsPage = () => {
  const { programId, categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { foods, dropdownCategories, loading } = useSelector(
    (state) => state.manageFood,
  );

  // Table State
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");

  // Consolidated Form State (Add & Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "Non Approved",
    category_id: categoryId || "",
    quantity: "",
    unit: "",
  });

  const standardUnits = [
    "g",
    "mg",
    "kg",
    "ml",
    "L",
    "cup",
    "tbsp",
    "tsp",
    "oz",
    "lbs",
    "piece",
    "slice",
  ];

  useEffect(() => {
    // Fetch drop down categories for the select input
    dispatch(getFoodCategoriesDrop());
  }, [dispatch]);

  useEffect(() => {
    // Fetch food items for this program and category
    if (programId && categoryId) {
      dispatch(getFoodList({ programId, categoryId }));
      setFormData((prev) => ({ ...prev, category_id: categoryId }));
    }
  }, [dispatch, programId, categoryId]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingFoodId(null);
    setFormData({
      title: "",
      type: "Non Approved",
      category_id: categoryId || "",
      quantity: "",
      unit: "",
    });
  };

  console.log("formData: ", formData);

  const handleAddOrUpdateFood = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a food name.");
      return;
    }
    if (!formData.category_id) {
      toast.error("Please select a food category.");
      return;
    }

    if (isEditing) {
      const payload = {
        foodName: formData.title,
        approvalStatus: formData.type,
        category: formData.category_id,
        quantity: formData.quantity,
        unit: formData.unit,
      };

      console.log("payload: ", payload);
      const resultAction = await dispatch(
        updateFood({ id: editingFoodId, data: payload }),
      );
      if (updateFood.fulfilled.match(resultAction)) {
        toast.success("Food updated successfully!");
        resetForm();
        dispatch(getFoodList({ programId, categoryId }));
      } else {
        toast.error(resultAction.payload || "Failed to update food.");
      }
    } else {
      const payload = {
        program_id: programId,
        category: formData.category_id,
        foodName: formData.title,
        approvalStatus: formData.type,
        quantity: formData.quantity,
        unit: formData.unit,
      };

      const resultAction = await dispatch(addFood(payload));
      if (addFood.fulfilled.match(resultAction)) {
        toast.success("Food added successfully!");
        resetForm();
        dispatch(getFoodList({ programId, categoryId }));
      } else {
        toast.error(resultAction.payload || "Failed to add food.");
      }
    }
  };

  const handleAction = async (row, action, val) => {
    if (action === "toggle") {
      const newStatus = val ? "Approved" : "Non Approved";
      const resultAction = await dispatch(
        toggleFoodStatus({ id: row.id, status: newStatus }),
      );
      if (toggleFoodStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        dispatch(getFoodList({ programId, categoryId }));
      } else {
        toast.error(resultAction.payload || "Failed to update status.");
      }
    } else if (action === "edit") {
      setIsEditing(true);
      setEditingFoodId(row.id);
      const isApproved =
        row.approval_status === "Approved" ||
        row.approval_status === 1 ||
        row.is_approved;
      setFormData({
        title: row.name || row.title || row.meal?.Meal_title || "",
        type: isApproved ? "Approved" : "Non Approved",
        category_id: row.category_id || row.foodcategory_id || categoryId || "",
        quantity: row.quantity || row.meal?.quantity || row.meal_quantity || "",
        unit: row.unit || row.meal?.unit || row.meal_unit || "",
      });
      // Scroll to top where the form is
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const resultAction = await dispatch(deleteFood(deleteTarget.id));
    if (deleteFood.fulfilled.match(resultAction)) {
      toast.success("Food deleted successfully!");
      dispatch(getFoodList({ programId, categoryId }));
    } else {
      toast.error(resultAction.payload || "Failed to delete food.");
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(
    () => getManageFoodItemsColumns(handleAction),
    [programId, categoryId],
  );

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading={isEditing ? "Edit Food Item" : "Add Food Item"}
              icon={<Utensils className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-blue-200"
              subheading={
                isEditing
                  ? "Modify the selected food item's details."
                  : "Add a new specific food item."
              }
            />
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mx-auto w-full">
          <div className="px-6 md:px-8 pt-5 pb-6 space-y-6">
            {/* Approval Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Approval Status
              </Label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="Approved"
                    checked={formData.type === "Approved"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-4 h-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                  />
                  Approved
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="Non Approved"
                    checked={formData.type === "Non Approved"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-4 h-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                  />
                  Non Approved
                </label>
              </div>
            </div>

            {/* Search / Food Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEditing ? "Food Name" : "Search Food Name"}
              </Label>
              <Input
                type="text"
                placeholder="Enter Food Name..."
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Food Category
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(val) =>
                  setFormData({ ...formData, category_id: val })
                }
                disabled={isEditing}
              >
                <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-blue transition-colors bg-white font-medium disabled:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name || cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional Fields based on Approved status */}
            {formData.type === "Approved" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Food Quantity
                  </Label>
                  <Input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                    placeholder="Enter Food Quantity"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Select Unit
                  </Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(val) =>
                      setFormData({ ...formData, unit: val })
                    }
                  >
                    <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-blue transition-colors bg-white font-medium">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardUnits.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="mt-8 flex justify-end gap-4">
              {isEditing && (
                <Button
                  variant="outline"
                  className="rounded-md px-8 py-2.5 h-auto text-xs font-semibold"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-8 py-2.5 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm"
                onClick={handleAddOrUpdateFood}
                disabled={loading}
              >
                {!isEditing && <Send size={16} />}
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Food"
                    : "Add Food"}
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={foods}
          rowCount={foods.length}
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
        title="Delete Food Item"
        message={`Are you sure you want to delete "${deleteTarget?.name || deleteTarget?.title || deleteTarget?.meal?.Meal_title}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default ManageFoodItemsPage;
