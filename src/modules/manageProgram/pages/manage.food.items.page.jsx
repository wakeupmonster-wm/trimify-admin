import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Send, X, Utensils } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/datatable";
import {
  getFoodList,
  addFood,
  updateFood,
  toggleFoodStatus,
  getFoodCategoriesDrop,
} from "../store/food.slice";
import { getManageFoodItemsColumns } from "@/components/columns/manage.food.items.columns";

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
        title: formData.title,
        type: formData.type,
        quantity: formData.quantity,
        unit: formData.unit,
      };
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
        foodcategory_id: formData.category_id,
        name: formData.title, // Add endpoint expects 'name' historically based on earlier assumptions, but we map title to it
        approval_status: formData.type,
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
        quantity: row.quantity || "",
        unit: row.unit || "",
      });
      // Scroll to top where the form is
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "delete") {
      console.log("Delete food", row);
    }
  };

  const columns = useMemo(
    () => getManageFoodItemsColumns(handleAction),
    [programId, categoryId],
  );

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Manage Food Items"
            icon={<Utensils className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Add, edit, or remove specific food items."
          />
        </Header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-auto w-full mb-6">
          <div className="bg-brand-blue text-white px-6 py-4 flex items-center justify-center relative">
            <h2 className="text-lg font-semibold tracking-wide">
              {isEditing ? "Edit Food" : "Add Food"}
            </h2>
            {isEditing && (
              <Button
                variant="ghost"
                onClick={resetForm}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="p-8 space-y-6">
            {/* Approval Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Approval Status
              </label>
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {isEditing ? "Food Name" : "Search Food Name"}
              </label>
              <input
                type="text"
                placeholder="Enter Food Name..."
                className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Food Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Food Category
              </label>
              <select
                className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-slate-100 appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                disabled={isEditing}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {dropdownCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Fields based on Approved status */}
            {formData.type === "Approved" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Food Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
                    placeholder="Enter Food Quantity"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Select Unit
                  </label>
                  <select
                    className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-white appearance-none cursor-pointer"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Unit
                    </option>
                    {standardUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="pb-8 flex justify-center gap-4 border-b border-slate-100">
            {isEditing && (
              <Button
                variant="outline"
                className="h-11 text-sm font-semibold px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 h-11 text-sm font-semibold shadow-sm w-48"
              onClick={handleAddOrUpdateFood}
              disabled={loading}
            >
              {!isEditing && <Send className="w-4 h-4 mr-2" />}
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Food"}
            </Button>
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
    </Container>
  );
};

export default ManageFoodItemsPage;
