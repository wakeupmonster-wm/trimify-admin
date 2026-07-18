import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Loader2 } from "lucide-react";
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
import { BASE_URL } from "@/services/api-endpoints/base.url";

const AddProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    duration: editData?.duration ? `${editData.duration} Week` : "",
    bannerImage: null,
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value) => {
    setFormData((prev) => ({ ...prev, duration: value }));
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
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading={isEditMode ? "Edit Program" : "Add Program"}
              icon={<UploadCloud className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-blue"
              subheading={
                isEditMode
                  ? "Edit and configure program details."
                  : "Create a new health and wellness program."
              }
            />
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-6 md:px-8 pt-5 pb-6 space-y-6"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Program Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                required
              />
            </div>

            {/* Program Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Program Description
              </Label>
              <Textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60 resize-none p-3"
                required
              />
              <div className="text-xs text-slate-500 font-medium">
                Character Count: {formData.description.length} / 500
              </div>
            </div>

            {isEditMode && editData?.image && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Current Uploaded Banner Image
                </Label>
                <div className="flex flex-col items-center justify-center py-4">
                  <img
                    src={`${BASE_URL.replace("/api", "")}/${editData.image}`}
                    alt="Current Program Banner"
                    className="w-32 h-32 object-contain rounded-md border border-slate-300/60 p-2"
                  />
                </div>
              </div>
            )}

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Upload Banner Image
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-brand-blue bg-blue-50"
                    : "border-slate-300/60 hover:border-brand-blue/50 bg-slate-50 hover:bg-slate-50/80"
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
                <UploadCloud className="w-10 h-10 text-brand-blue mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {formData.bannerImage
                    ? formData.bannerImage.name
                    : "Click or drag and drop to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>

            {/* Program Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Program Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={handleDurationChange}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4 Week">4 Week</SelectItem>
                  <SelectItem value="6 Week">6 Week</SelectItem>
                  <SelectItem value="8 Week">8 Week</SelectItem>
                  <SelectItem value="12 Week">12 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-md px-8 py-2.5 h-auto text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center gap-2 shadow-sm"
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
