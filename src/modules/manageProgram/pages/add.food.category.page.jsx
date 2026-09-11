import React, { useState } from "react";
import CTAButton from "@/components/common/CTAButton";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import {
  Save,
  Layers,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { addFoodCategory, updateFoodCategory } from "../store/food.slice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_BASE_URL } from "@/services/api-endpoints/base.url";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImageUploadPreview from "@/components/common/ImageUploadPreview";

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
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedExistingImage, setRemovedExistingImage] = useState(false);

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



  const handleSubmit = (e) => {
    e.preventDefault();
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

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);
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
        toast.success(
          resultAction.payload?.message ||
            "Food category updated successfully!",
        );
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to update food category.");
      }
    } else {
      const resultAction = await dispatch(addFoodCategory(formData));
      if (addFoodCategory.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || "Food category added successfully!",
        );
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to add food category.");
      }
    }
    setIsSubmitting(false);
    setIsConfirmModalOpen(false);
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
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
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Header>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="bg-white rounded-xl shadow-sm px-4 sm:px-6 pt-5 pb-6 border border-slate-300/60 overflow-hidden mx-auto w-full"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Category Name
              </Label>
              <Input
                placeholder="Enter Category Name"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.categoryName ? "border-red-500" : "border-slate-300/60"}`}
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
                  className={`text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium resize-y min-h-[100px] pb-8 ${errors.description ? "border-red-500" : "border-slate-300/60"}`}
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

            <ImageUploadPreview
              file={iconFile}
              previewUrl={removedExistingImage ? null : previewUrl}
              onFileSelect={handleFileChange}
              onRemove={() => {
                setIconFile(null);
                setPreviewUrl(null);
                if (isEditMode) setRemovedExistingImage(true);
              }}
              label={isEditMode ? "Category Icon" : "Upload Category Icon"}
              variant="icon"
              aspectRatioBadge="Square 1:1"
              hint="Recommended: Square icon (1:1), 128×128 px to 256×256 px. PNG, SVG or WebP (max 5MB)."
              id="icon-upload"
            />
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
              className="w-full sm:w-auto text-white rounded-md px-6 h-10 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              type="submit"
              disabled={loading}
            >
              {isSubmitting || loading ? (
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
        </form>
      </div>



      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title={isEditMode ? "Confirm Update" : "Confirm Creation"}
        message={
          isEditMode
            ? "Are you sure you want to update this food category?"
            : "Are you sure you want to create this new food category?"
        }
        confirmText={isEditMode ? "Update" : "Create"}
        type="brand"
        loading={isSubmitting || loading}
      />
    </Container>
  );
};

export default AddFoodCategoryPage;
