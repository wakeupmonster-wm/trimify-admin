import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Layers, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addFoodCategory, updateFoodCategory } from "../store/food.slice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddFoodCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const { loading } = useSelector((state) => state.manageFood);

  const [categoryName, setCategoryName] = useState(
    editData?.name || editData?.title || "",
  );
  const [description, setDescription] = useState(editData?.description || "");
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(editData?.image || null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        toast.error("File size exceeds 6MB limit.");
        return;
      }
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        toast.error("File size exceeds 6MB limit.");
        return;
      }
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    // Add more validation if necessary

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", description);
    if (iconFile) {
      formData.append("image", iconFile);
    }

    if (isEditMode) {
      const resultAction = await dispatch(
        updateFoodCategory({ id: categoryId, data: formData }),
      );
      if (updateFoodCategory.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Food category updated successfully!");
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to update food category.");
      }
    } else {
      const resultAction = await dispatch(addFoodCategory(formData));
      if (addFoodCategory.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Food category added successfully!");
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to add food category.");
      }
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
           <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Food Category"
                icon={<Layers className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEditMode
                    ? "Edit and configure food category."
                    : "Add and configure food categories."
                }
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-2.5 h-10 flex items-center justify-center gap-1 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm px-4 sm:px-6 pt-5 pb-6 border border-slate-300/60 overflow-hidden mx-auto w-full">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Category Name
              </Label>
              <Input
                placeholder="Enter Category Name"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.categoryName ? "border-red-500" : "border-slate-300/60"}`}
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (errors.categoryName)
                    setErrors({ ...errors, categoryName: null });
                }}
              />
              {errors.categoryName && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.categoryName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Description
              </Label>
              <div className="relative">
                <Textarea
                  placeholder="Enter Category Description"
                  maxLength={500}
                  className={`text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-y min-h-[100px] pb-8 ${errors.description ? "border-red-500" : "border-slate-300/60"}`}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors({ ...errors, description: null });
                  }}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {description.length} / 500
                </div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {isEditMode && editData?.image && (
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Current Uploaded Banner Image
                </Label>
                <div className="flex flex-col items-center justify-center py-4">
                  <img
                    src={editData.image}
                    alt="Current Category"
                    className="w-16 h-16 object-contain rounded-md"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                {isEditMode ? "Replace Uploaded Icon" : "Upload Icon"}
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging
                    ? "border-app-primary2 bg-blue-50"
                    : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("icon-upload").click()}
              >
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain mb-3"
                    />
                    <span className="text-sm font-semibold text-slate-700 text-center">
                      Icon selected. Click or drag to replace.
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                    <p className="text-sm font-semibold text-slate-700 text-center">
                      Click or drag and drop to upload
                    </p>
                  </>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG (max. 800x400px)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-md px-6 h-10 text-xs font-semibold"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 h-10 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  {isEditMode ? "Update" : "Save"}
                  <Save className="w-4 h-4 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddFoodCategoryPage;
