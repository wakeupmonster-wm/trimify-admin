import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Activity, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addFitzone, updateFitzone } from "../store/fitzone.slice";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { IMAGE_BASE_URL } from "@/services/api-endpoints/base.url";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImageUploadPreview from "@/components/common/ImageUploadPreview";

const AddFitzonePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    bannerImage: null,
    workoutHeading: editData?.workout_heading || "",
    workoutDescription: editData?.workout_sub_heading || "",
  });

  const [previewUrl, setPreviewUrl] = useState(editData?.image || null);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.bannerImage)
        setErrors((prev) => ({ ...prev, bannerImage: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.workoutHeading.trim())
      newErrors.workoutHeading = "Workout Heading is required";
    if (!formData.workoutDescription.trim())
      newErrors.workoutDescription = "Workout Headline is required";
    if (!isEditMode && !formData.bannerImage)
      newErrors.bannerImage = "Banner Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("workout_heading", formData.workoutHeading);
    payload.append("workout_sub_heading", formData.workoutDescription);
    if (formData.bannerImage) {
      payload.append("image", formData.bannerImage);
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateFitzone({ id: editData.id, data: payload }),
        ).unwrap();
        toast.success("Fitzone updated successfully");
      } else {
        await dispatch(addFitzone(payload)).unwrap();
        toast.success("Fitzone created successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error(error || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEditMode ? "Edit Fitzone" : "Add Fitzone"}
                icon={<Activity className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEditMode
                    ? "Update the details of the fitzone."
                    : "Create a new fitzone."
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-5 pb-6 space-y-5 sm:space-y-4 w-full min-w-0"
          >
            <div className="grid grid-cols-1 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-5 sm:gap-y-4">
              {/* Row 1: Title and Workout Heading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-5 sm:gap-y-6">
                <div className="space-y-1.5">
                  <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                    Fitzone Title
                  </Label>
                  <Input
                    name="title"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full h-10 px-4 text-sm border rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors placeholder:font-normal font-medium border-slate-300/60"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                    Workout Session Heading
                  </Label>
                  <Input
                    name="workoutHeading"
                    placeholder="Enter Workout Heading"
                    value={formData.workoutHeading}
                    onChange={handleChange}
                    className="w-full h-10 px-4 text-sm border rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors placeholder:font-normal font-medium border-slate-300/60"
                  />
                  {errors.workoutHeading && (
                    <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                      {errors.workoutHeading}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Workout Headline */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Workout Session Headline
                </Label>
                <Input
                  name="workoutDescription"
                  placeholder="Enter Workout Description"
                  value={formData.workoutDescription}
                  onChange={handleChange}
                  className="w-full h-10 px-4 text-sm border rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors placeholder:font-normal font-medium border-slate-300/60"
                />
                {errors.workoutDescription && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.workoutDescription}
                  </p>
                )}
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Fitzone Description
                </Label>
                <div className="relative">
                  <Textarea
                    name="description"
                    placeholder="Enter Fitzone Description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={500}
                    className="w-full min-h-[120px] p-4 pb-8 text-sm border rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors placeholder:font-normal font-medium resize-none border-slate-300/60"
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

              {/* Row 4: Thumbnail Image Upload (Circle Chip on App) */}
              <ImageUploadPreview
                file={formData.bannerImage}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                onRemove={() => {
                  setFormData((prev) => ({ ...prev, bannerImage: null }));
                  setPreviewUrl(null);
                }}
                label={isEditMode ? "Replace Program Thumbnail (Circle View)" : "Upload Program Thumbnail (Circle View)"}
                variant="icon"
                aspectRatioBadge="Circle 1:1"
                hint="Recommended: Square thumbnail (1:1), 150×150 px to 256×256 px. Renders as a circular chip on mobile app (max 5MB)."
                id="banner-upload"
                error={errors.bannerImage}
              />
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-md px-5 h-100 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-white rounded-md px-5 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update Fitzone" : "Add Fitzone"}
                    <Save className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
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
        title={isEditMode ? "Confirm Update" : "Confirm Creation"}
        message={
          isEditMode
            ? "Are you sure you want to update this fitzone's details?"
            : "Are you sure you want to create this new fitzone?"
        }
        confirmText={isEditMode ? "Update" : "Create"}
        type="brand"
        loading={isSubmitting}
      />
    </Container>
  );
};

export default AddFitzonePage;
