import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Loader2, ArrowLeft, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addBlogCategory, updateBlogCategory } from "../store/blog.slice";
import { TbCategoryPlus } from "react-icons/tb";
import ConfirmModal from "@/components/common/ConfirmModal";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [removedExistingImage, setRemovedExistingImage] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    iconImage: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(null);
  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        title: editData.title || editData.name || "",
        description: editData.description || "",
        status: editData.status || "Active",
        iconImage: null,
      });
    }
  }, [isEdit, editData]);

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
      setFormData((prev) => ({ ...prev, iconImage: file }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, iconImage: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Category Title is required";
    if (!formData.description.trim())
      newErrors.description = "Category Description is required";
    if (!isEdit && !formData.iconImage)
      newErrors.iconImage = "Category Icon is required";
    if (isEdit && removedExistingImage && !formData.iconImage)
      newErrors.iconImage = "Category Icon is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("status", formData.status);

      if (formData.iconImage) {
        payload.append("icon", formData.iconImage);
      }

      if (isEdit) {
        const result = await dispatch(
          updateBlogCategory({ id, data: payload }),
        ).unwrap();
        toast.success("Category updated successfully!");
        setCurrentIcon(result?.data?.icon || currentIcon);
        setFormData((prev) => ({ ...prev, iconImage: null }));
        navigate(-1);
      } else {
        await dispatch(addBlogCategory(payload)).unwrap();
        toast.success("Category added successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error || "An error occurred while saving the category");
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Category" : "Add Category"}
                icon={
                  <TbCategoryPlus className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading={
                  isEdit
                    ? "Update existing blog category."
                    : "Create a new blog category."
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

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-5 pb-6 space-y-4 w-full min-w-0"
          >
            {/* Category Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 flex items-center h-5">
                Category Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.title ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.title && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 flex items-center h-5">
                Category Description
              </Label>
              <div className="relative">
                <Textarea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  className={`w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium resize-none p-3 pb-8 ${errors.description ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {formData.description.length} / 500
                </div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Upload Icon Image */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 flex items-center h-5">
                {isEdit ? "Replace Category Icon" : "Upload Category Icon"}
              </Label>
              {formData.iconImage ||
              (isEdit && editData?.icon && !removedExistingImage) ? (
                <div className="relative w-full max-w-sm rounded-lg border border-slate-200 overflow-hidden group">
                  <img
                    src={
                      formData.iconImage
                        ? URL.createObjectURL(formData.iconImage)
                        : editData.icon
                    }
                    alt="Category Icon"
                    className="w-full h-48 object-cover bg-slate-50"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const imgSrc = formData.iconImage
                          ? URL.createObjectURL(formData.iconImage)
                          : editData.icon;
                        setCurrentIcon(imgSrc);
                        setPreviewOpen(true);
                      }}
                      className="bg-white text-slate-700 rounded-full p-2 hover:bg-slate-100 shadow-sm transition-transform hover:scale-105"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({ ...prev, iconImage: null }));
                        if (isEdit) setRemovedExistingImage(true);
                        if (errors.iconImage)
                          setErrors((prev) => ({ ...prev, iconImage: "" }));
                      }}
                      className="bg-white text-red-500 rounded-full p-2 hover:bg-red-50 shadow-sm transition-transform hover:scale-105"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-app-primary2 bg-blue-50"
                      : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("icon-upload").click()}
                >
                  <input
                    id="icon-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Click or drag and drop to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    SVG, PNG, JPG or GIF (max. 6144 KB)
                  </p>
                </div>
              )}
              {errors.iconImage && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.iconImage}
                </p>
              )}
            </div>

            {/* Category Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 flex items-center h-5">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.status ? "border-red-500" : "border-slate-300/60"}`}
                >
                  <SelectValue
                    placeholder="Select..."
                    className="placeholder:font-normal"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-md px-5 h-10 text-xs 3xl:text-sm font-semibold border-slate-300/60 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto text-white rounded-md px-5 h-10 text-xs 3xl:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin shrink-0" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update" : "Save"}
                    <Save size={16} className="shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {currentIcon && (
            <img
              src={currentIcon}
              alt="Category icon"
              className="w-full max-h-[75vh] object-contain bg-slate-50"
            />
          )}
          <div className="p-4">
            <p className="text-sm font-semibold text-slate-800">
              {formData.title || "Category Icon"}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title={isEdit ? "Confirm Update" : "Confirm Creation"}
        message={
          isEdit
            ? "Are you sure you want to update this category's details?"
            : "Are you sure you want to create this new category?"
        }
        confirmText={isEdit ? "Update" : "Create"}
        type="brand"
        loading={loading}
      />
    </Container>
  );
};

export default AddCategoryPage;
