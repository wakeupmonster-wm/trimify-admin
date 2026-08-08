import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { Send, X, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/datatable";
import {
  getFoodList,
  addFood,
  updateFood,
  toggleFoodStatus,
  deleteFood,
  getFoodCategoriesDrop,
  searchFoodItems,
} from "../store/food.slice";
import { getManageFoodItemsColumns } from "@/components/columns/manage.food.items.columns";
import ConfirmModal from "@/components/common/ConfirmModal";
import { IoFastFoodOutline } from "react-icons/io5";
import CTAButton from "@/components/common/CTAButton";

const ManageFoodItemsPage = () => {
  const { programId, categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    foods,
    foodsPagination,
    dropdownCategories,
    foodSearchResults,
    loading,
  } = useSelector((state) => state.manageFood);

  // Table State
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");

  // Consolidated Form State (Add & Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    food_id: "",
    type: "Non Approved",
    category_id: categoryId || "",
    quantity: "",
    unit: "",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFoodSelected, setIsFoodSelected] = useState(false);
  const [errors, setErrors] = useState({});
  const searchTimeout = useRef(null);

  // Reset to page 1 and sync the form's category whenever the route's
  // categoryId changes — done during render (not an effect) since this is
  // just adjusting state in response to a prop change.
  const [prevCategoryId, setPrevCategoryId] = useState(categoryId);
  if (categoryId !== prevCategoryId) {
    setPrevCategoryId(categoryId);
    setFormData((prev) => ({ ...prev, category_id: categoryId || "" }));
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    );
  }

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
    // Fetch food items for this program and category, page by page
    if (programId && categoryId) {
      dispatch(
        getFoodList({
          programId,
          categoryId,
          params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
          },
        }),
      );
    }
  }, [
    dispatch,
    programId,
    categoryId,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingFoodId(null);
    setFormData({
      title: "",
      food_id: "",
      type: "Non Approved",
      category_id: categoryId || "",
      quantity: "",
      unit: "",
    });
    setShowSuggestions(false);
    setIsFoodSelected(false);
  };

  const handleSearchFood = (val) => {
    setFormData({ ...formData, title: val });
    if (errors.title) setErrors({ ...errors, title: null });

    if (isEditing) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (val.trim()) {
      setShowSuggestions(true);
      searchTimeout.current = setTimeout(async () => {
        setIsSearching(true);
        await dispatch(searchFoodItems({ query: val }));
        setIsSearching(false);
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddOrUpdateFood = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Please enter a food name.";
    else if (!formData.food_id)
      newErrors.title = "Please select a food from the suggestions.";
    if (!formData.category_id)
      newErrors.category_id = "Please select a food category.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      const payload = {
        foodName: formData.food_id,
        approvalStatus: formData.type,
        category: formData.category_id,
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
        category: formData.category_id,
        foodName: formData.food_id,
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
      const newStatus = val ? "Active" : "Inactive";
      setToggleTarget({ row, newStatus });
    } else if (action === "edit") {
      setIsEditing(true);
      setEditingFoodId(row.id);
      const isApproved =
        row.approval_status === "Approved" ||
        row.approval_status === 1 ||
        row.is_approved;

      const rawUnit =
        row.unit ||
        row.food_unit ||
        row.meal?.unit ||
        row.meal_unit ||
        row.Meal_unit ||
        "";
      const matchedUnit =
        standardUnits.find(
          (u) => u.toLowerCase() === String(rawUnit).toLowerCase(),
        ) || rawUnit;

      setFormData({
        title: row.name || row.title || row.meal?.Meal_title || "",
        food_id: row.food_id || row.meal_id || row.meal?.id || row.id || "",
        type: isApproved ? "Approved" : "Non Approved",
        category_id: row.category_id || row.foodcategory_id || categoryId || "",
        quantity:
          row.quantity ||
          row.qty ||
          row.food_quantity ||
          row.meal?.quantity ||
          row.meal_quantity ||
          row.Meal_Serving ||
          row.meal?.Meal_Serving ||
          "",
        unit: matchedUnit,
      });
      setIsFoodSelected(true); // Treat as selected so the pill shows if needed (or just keep normal input depending on logic)
      // Scroll to top where the form is
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "delete") {
      setDeleteTarget(row);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteFood(deleteTarget.id));
      if (deleteFood.fulfilled.match(resultAction)) {
        toast.success("Food deleted successfully!");
        dispatch(getFoodList({ programId, categoryId }));
      } else {
        toast.error(resultAction.payload || "Failed to delete food.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const { row, newStatus } = toggleTarget;
    setIsUpdating(true);
    try {
      const resultAction = await dispatch(
        toggleFoodStatus({ id: row.id, status: newStatus }),
      );
      if (toggleFoodStatus.fulfilled.match(resultAction)) {
        toast.success("Status updated successfully!");
        dispatch(getFoodList({ programId, categoryId }));
      } else {
        toast.error(resultAction.payload || "Failed to update status.");
      }
    } finally {
      setIsUpdating(false);
      setToggleTarget(null);
    }
  };

  const columns = useMemo(
    () => getManageFoodItemsColumns(handleAction),
    [programId, categoryId],
  );

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEditing ? "Edit Food Item" : "Add Food Item"}
                icon={
                  <IoFastFoodOutline className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading={
                  isEditing
                    ? "Modify the selected food item's details."
                    : "Add a new specific food item."
                }
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Header>

        <form
          onSubmit={(e) => handleAddOrUpdateFood(e)}
          className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden mx-auto w-full"
        >
          <div className="px-4 sm:px-6 pt-5 pb-6 space-y-5">
            {/* Approval Status */}
            <div className="space-y-1.5 pb-2">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Approval Status
              </Label>
              <div className="flex items-center gap-6 mt-4">
                <Label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-normal">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="Approved"
                    checked={formData.type === "Approved"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-4 h-4 text-app-primary2 border-slate-300/60 focus:ring-app-primary2"
                  />
                  Approved
                </Label>
                <Label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-normal">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="Non Approved"
                    checked={formData.type === "Non Approved"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-4 h-4 text-app-primary2 border-slate-300/60 focus:ring-app-primary2"
                  />
                  Non Approved
                </Label>
              </div>
            </div>

            {/* Search / Food Name */}
            {isFoodSelected && !isEditing ? (
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Selected Food
                </Label>
                <div className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md flex items-center justify-between bg-white font-medium">
                  <span className="truncate">{formData.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      setIsFoodSelected(false);
                      setFormData({ ...formData, title: "", food_id: "" });
                    }}
                    className="text-slate-400 hover:text-red-500 hover:bg-transparent shrink-0 ml-2 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 relative">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  {isEditing ? "Food Name" : "Search Food Name"}
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Food Name..."
                  className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors font-medium"
                  value={formData.title}
                  onChange={(e) => handleSearchFood(e.target.value)}
                  onFocus={() => {
                    if (
                      !isEditing &&
                      formData.title.trim().length >= 2 &&
                      foodSearchResults &&
                      foodSearchResults.length > 0
                    ) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
                {/* Autocomplete Suggestions */}
                {showSuggestions && !isEditing && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300/60 rounded-md shadow-lg max-h-60 overflow-auto">
                    {isSearching || loading ? (
                      <div className="p-3 text-sm text-slate-500 text-center">
                        Searching...
                      </div>
                    ) : foodSearchResults && foodSearchResults.length > 0 ? (
                      <ul className="py-1">
                        {foodSearchResults.map((item, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevents input onBlur from firing first
                              setFormData({
                                ...formData,
                                title:
                                  item.title ||
                                  item.name ||
                                  item.Meal_title ||
                                  item.food_name ||
                                  item.meal?.Meal_title ||
                                  formData.title,
                                food_id: item.id,
                                category_id:
                                  item.category_id?.toString() ||
                                  formData.category_id,
                                quantity: item.quantity || formData.quantity,
                                unit: item.unit || formData.unit,
                                type: item.type || formData.type,
                              });
                              setShowSuggestions(false);
                              setIsFoodSelected(true);
                            }}
                          >
                            <span>
                              {item.title ||
                                item.name ||
                                item.Meal_title ||
                                item.food_name ||
                                item.meal?.Meal_title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-sm text-slate-500 text-center">
                        No results found.
                      </div>
                    )}
                  </div>
                )}
                {errors.title && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.title}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Food Category
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(val) => {
                  setFormData({ ...formData, category_id: val });
                  if (errors.category_id)
                    setErrors({ ...errors, category_id: null });
                }}
                disabled={isEditing}
              >
                <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-app-primary2 transition-colors bg-white font-medium disabled:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed">
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
              {errors.category_id && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.category_id}
                </p>
              )}
            </div>

            {/* Optional Fields based on Approved status */}
            {formData.type === "Approved" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                    Food Quantity
                  </Label>
                  <Input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
                    placeholder="Enter Food Quantity"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                    Select Unit
                  </Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(val) =>
                      setFormData({ ...formData, unit: val })
                    }
                  >
                    <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-app-primary2 transition-colors bg-white font-medium">
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

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              {isEditing && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-md px-6 h-10 text-xs font-semibold"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-5 h-10 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  !isEditing && <Send size={16} />
                )}
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
        </form>

        {/* Data Table */}
        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={foods}
            rowCount={foodsPagination?.total || foods.length}
            manualPagination={true}
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
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Food Item"
        message={`Are you sure you want to delete "${deleteTarget?.name || deleteTarget?.title || deleteTarget?.meal?.Meal_title}"? This action cannot be undone.`}
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => !toggleLoading && setToggleTarget(null)}
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of "${toggleTarget?.row?.name || toggleTarget?.row?.title || toggleTarget?.row?.meal?.Meal_title}"?`}
        type="brand"
        confirmText="Update"
        loading={isUpdating}
      />
    </Container>
  );
};

export default ManageFoodItemsPage;
