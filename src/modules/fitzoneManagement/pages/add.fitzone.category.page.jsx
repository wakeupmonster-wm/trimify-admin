import React, { useState, useRef, useEffect } from "react";
import CTAButton from "@/components/common/CTAButton";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Dumbbell, Send, Loader2, ArrowLeft } from "lucide-react";
import {
  addFitzoneCategory,
  updateFitzoneCategory,
} from "../store/fitzone.category.slice";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";

const AddFitzoneCategoryPage = () => {
  const { id, categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.fitzoneCategory);

  const isEdit = Boolean(categoryId);
  const editData = location.state?.editData || null;

  // Form State
  const [categoryName, setCategoryName] = useState(editData?.title || "");
  const [categoryDetails, setCategoryDetails] = useState(
    editData?.description || "",
  );
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(editData?.image || null);
  const [htmlContent, setHtmlContent] = useState(editData?.description || "");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit && editData) {
      setCategoryName(editData.title || "");
      setCategoryDetails(editData.description || "");
      setHtmlContent(editData.html_content || "");
      setIconPreview(editData.icon || editData.icon_url || null);
    }
  }, [isEdit, editData]);

  const handleIconLogic = (file) => {
    setIconFile(file);
    const objectUrl = URL.createObjectURL(file);
    setIconPreview(objectUrl);
    if (errors.iconFile) setErrors((prev) => ({ ...prev, iconFile: null }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleIconLogic(file);
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
      handleIconLogic(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category Title is required";
    if (!categoryDetails.trim())
      newErrors.categoryDetails = "Category Details are required";
    if (!htmlContent.trim())
      newErrors.htmlContent = "Category Description is required";
    if (!isEdit && !iconFile) newErrors.iconFile = "Category Icon is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit) {
      setIsConfirmModalOpen(true);
    } else {
      handleConfirmUpdate();
    }
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("fitzone_id", id);
    formData.append("title", categoryName);
    formData.append("description", categoryDetails);
    formData.append("html_content", htmlContent);

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    let resultAction;
    if (isEdit) {
      resultAction = await dispatch(
        updateFitzoneCategory({ id: categoryId, data: formData }),
      );
    } else {
      resultAction = await dispatch(addFitzoneCategory(formData));
    }

    if (
      updateFitzoneCategory.fulfilled.match(resultAction) ||
      addFitzoneCategory.fulfilled.match(resultAction)
    ) {
      toast.success(`Category ${isEdit ? "updated" : "added"} successfully!`);
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "An error occurred");
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
                heading={
                  isEdit ? "Edit Work-Out Session" : "Add Work-Out Session"
                }
                icon={<Dumbbell className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEdit
                    ? "Edit existing workout session category."
                    : "Create a new workout session category."
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

        <div className="bg-white rounded-xl shadow-sm px-4 sm:px-6 pt-5 pb-6 border border-slate-300/60 overflow-hidden mx-auto w-full min-w-0">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-4 w-full min-w-0"
          >
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Category Title
              </Label>
              <Input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (errors.categoryName)
                    setErrors({ ...errors, categoryName: null });
                }}
                placeholder="Enter Title Here"
                className={`w-full h-10 px-4 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-app-primary2 transition-colors placeholder:font-normal font-medium ${errors.categoryName ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.categoryName && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.categoryName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Category Details
              </Label>
              <Input
                type="text"
                value={categoryDetails}
                onChange={(e) => {
                  setCategoryDetails(e.target.value);
                  if (errors.categoryDetails)
                    setErrors((prev) => ({ ...prev, categoryDetails: null }));
                }}
                placeholder="e.g. 20 min , 182 kcal"
                className={`w-full h-10 px-4 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-app-primary2 transition-colors placeholder:font-normal font-medium ${errors.categoryDetails ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.categoryDetails && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.categoryDetails}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                {isEdit ? "Replace Category Icon" : "Upload Category Icon"}
              </Label>

              {iconPreview && (
                <div className="mb-4">
                  <Label className="text-xs font-bold text-slate-800 block mb-2">
                    {iconFile ? "New Icon Preview" : "Current Uploaded Icon"}
                  </Label>
                  <div className="w-16 h-16 rounded-md bg-blue-50/50 flex items-center justify-center border border-slate-100 p-2">
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div
                className={`w-full border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${
                  errors.iconFile
                    ? "border-red-500"
                    : isDragging
                      ? "border-app-primary2 bg-blue-50"
                      : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                <p className="text-sm font-semibold text-slate-700 text-center">
                  {iconFile
                    ? "Icon selected. Click or drag to replace."
                    : "Click or drag and drop to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG (max. 800x400px)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleIconChange}
              />
              {errors.iconFile && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.iconFile}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Category Description
              </Label>
              <div className="relative">
                <Textarea
                  value={htmlContent}
                  onChange={(e) => {
                    setHtmlContent(e.target.value);
                    if (errors.htmlContent)
                      setErrors((prev) => ({ ...prev, htmlContent: null }));
                  }}
                  placeholder="Enter Description"
                  maxLength={500}
                  className={`w-full px-4 py-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-app-primary2 transition-colors placeholder:font-normal font-medium resize-y min-h-[100px] pb-8 ${errors.htmlContent ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {htmlContent.length} / 500
                </div>
              </div>
              {errors.htmlContent && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.htmlContent}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                variant="outline"
                type="button"
                className="w-full sm:w-auto rounded-md px-5 h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto text-white rounded-md px-5 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold transition-all"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update" : "Save"}
                    <Send className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to update this category's details?"
        confirmText="Update"
        type="brand"
        loading={isSubmitting || loading}
      />
    </Container>
  );
};

export default AddFitzoneCategoryPage;
