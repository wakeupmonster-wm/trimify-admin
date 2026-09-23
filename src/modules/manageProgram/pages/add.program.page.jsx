import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ArrowLeft, UploadCloud, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addProgram, updateProgram } from "../store/program.slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImageUploadPreview from "@/components/common/ImageUploadPreview";

const normalizeDuration = (duration) => {
  const weeks = String(duration ?? "").match(/\d+/)?.[0];
  return weeks ? `${weeks} Weeks` : "";
};

const STANDARD_DURATIONS = ["4 Weeks", "6 Weeks", "8 Weeks", "12 Weeks", "16 Weeks"];

const AddProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    duration: normalizeDuration(editData?.duration),
    bannerImage: null,
  });

  const [previewUrl, setPreviewUrl] = useState(editData?.image || null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDurationChange = (value) => {
    setFormData((prev) => ({ ...prev, duration: value }));
    if (errors.duration) setErrors((prev) => ({ ...prev, duration: "" }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.bannerImage)
        setErrors((prev) => ({ ...prev, bannerImage: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Program Title is required";
    if (!formData.description.trim())
      newErrors.description = "Program Description is required";
    if (!formData.duration) newErrors.duration = "Program Duration is required";
    if (!isEditMode && !formData.bannerImage)
      newErrors.bannerImage = "Banner Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleSaveOrUpdate = async () => {
    setIsSubmitting(true);

    const durationStr = formData.duration
      ? formData.duration.split(" ")[0]
      : "";
    const duration = durationStr ? parseInt(durationStr, 10) : "";

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (duration) {
      payload.append("duration", duration);
    }
    if (formData.bannerImage) {
      payload.append("image", formData.bannerImage);
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateProgram({ id: editData.id, data: payload }),
        ).unwrap();
        toast.success("Program updated successfully");
      } else {
        await dispatch(addProgram(payload)).unwrap();
        toast.success("Program created successfully");
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
                heading={isEditMode ? "Edit Program" : "Add Program"}
                icon={<UploadCloud className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEditMode
                    ? "Edit and configure program details."
                    : "Create a new health and wellness program."
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-5 pb-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Program Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60"
              />
              {errors.title && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Program Description */}
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Program Description
              </Label>
              <div className="relative">
                <Textarea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60 resize-none p-3 pb-8"
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

            {/* Upload Program Grid Cover Image */}
            <ImageUploadPreview
              file={formData.bannerImage}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, bannerImage: null }));
                setPreviewUrl(null);
              }}
              label={isEditMode ? "Replace Program Grid Cover" : "Upload Program Grid Cover"}
              variant="card"
              aspectRatioBadge="Card ~3:2"
              hint="Recommended: Grid cover card (~3:2 aspect ratio), 400×280 px or 600×400 px. JPG, PNG or WebP (max 5MB)."
              id="banner-upload"
              error={errors.bannerImage}
            />

            <div className="w-full max-w-xs rounded-lg border border-app-primary2/20 bg-app-primary2/[0.05] p-3 text-[11px] leading-relaxed text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="h-3.5 w-3.5 shrink-0 text-app-primary2" />
                <span>Mobile App Display Note</span>
              </div>
              <p className="text-[10.5px] text-slate-600">
                Use a <strong>3:2 landscape image</strong>, ideally <strong>600×400 px</strong>. Other ratios may crop differently in the mobile app. Maximum file size: <strong>5 MB</strong>.
              </p>
            </div>

            {/* Program Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                Program Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={handleDurationChange}
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-normal border-slate-300/60">
                  <SelectValue
                    placeholder="Select..."
                    className="placeholder:font-normal"
                  />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_DURATIONS.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                  {formData.duration &&
                    !STANDARD_DURATIONS.includes(formData.duration) && (
                      <SelectItem value={formData.duration}>
                        {formData.duration}
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto rounded-md px-5 h-10 text-xs 3xl:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-white rounded-md px-4 h-10 text-xs 3xl:text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update" : "Save"}
                    <Save size={16} />
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
        onConfirm={handleSaveOrUpdate}
        title={isEditMode ? "Confirm Update" : "Confirm Creation"}
        message={
          isEditMode
            ? "Are you sure you want to update this program's details?"
            : "Are you sure you want to create this new program?"
        }
        confirmText={isEditMode ? "Update" : "Create"}
        type="brand"
        loading={isSubmitting}
      />
    </Container>
  );
};

export default AddProgramPage;
