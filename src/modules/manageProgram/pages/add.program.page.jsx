import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Loader2, ArrowLeft } from "lucide-react";
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

const AddProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    duration: editData?.duration ? `${editData.duration} Weeks` : "",
    bannerImage: null,
  });

  const [previewUrl, setPreviewUrl] = useState(editData?.image || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDurationChange = (value) => {
    setFormData((prev) => ({ ...prev, duration: value }));
    if (errors.duration) setErrors((prev) => ({ ...prev, duration: "" }));
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
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.bannerImage)
        setErrors((prev) => ({ ...prev, bannerImage: "" }));
    }
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

  const handleSubmit = async (e) => {
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
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
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
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
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
                  className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60 resize-none p-3 pb-8"
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

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEditMode ? "Replace Uploaded Banner Image" : "Upload Banner Image"}
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging
                    ? "border-app-primary2 bg-blue-50"
                    : "border-slate-300/60 hover:border-app-primary2/80 bg-slate-50 hover:bg-slate-50/80"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("banner-upload").click()}
              >
                <input
                  id="banner-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Banner preview"
                      className="w-32 h-32 object-contain rounded-md border border-slate-300/60 p-2 mb-3"
                    />
                    <span className="text-sm font-semibold text-slate-700 text-center">
                      {formData.bannerImage
                        ? formData.bannerImage.name
                        : "Current banner. Click or drag to replace."}
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                    <p className="text-sm font-semibold text-slate-700">
                      Click or drag and drop to upload
                    </p>
                  </>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
              {errors.bannerImage && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.bannerImage}
                </p>
              )}
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
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4 Weeks">4 Weeks</SelectItem>
                  <SelectItem value="6 Weeks">6 Weeks</SelectItem>
                  <SelectItem value="8 Weeks">8 Weeks</SelectItem>
                  <SelectItem value="12 Weeks">12 Weeks</SelectItem>
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
                className="w-full sm:w-auto rounded-md px-6 h-10 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 h-10 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
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
    </Container>
  );
};

export default AddProgramPage;
