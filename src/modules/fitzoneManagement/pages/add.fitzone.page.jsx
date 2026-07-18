import { Container } from "@/components/common/container";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Activity, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addFitzone, updateFitzone } from "../store/fitzone.slice";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";

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

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        await dispatch(updateFitzone({ id: editData.id, data: payload })).unwrap();
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
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading={isEditMode ? "Edit Fitzone" : "Add Fitzone"}
              icon={<Activity className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-blue-200"
              subheading={
                isEditMode
                  ? "Update the details of the fitzone."
                  : "Create a new fitzone."
              }
            />
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <form
            onSubmit={handleSubmit}
            className="px-6 md:px-8 pt-5 pb-6 space-y-6"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
              {/* Row 1: Title and Workout Heading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Fitzone Title
                  </Label>
                  <Input
                    name="title"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Workout Session Heading
                  </Label>
                  <Input
                    name="workoutHeading"
                    placeholder="Enter Workout Heading"
                    value={formData.workoutHeading}
                    onChange={handleChange}
                    className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Workout Headline */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Workout Session Headline
                </Label>
                <Input
                  name="workoutDescription"
                  placeholder="Enter Workout Description"
                  value={formData.workoutDescription}
                  onChange={handleChange}
                  className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
                  required
                />
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Fitzone Description
                </Label>
                <Textarea
                  name="description"
                  placeholder="Enter Fitzone Description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  className="w-full min-h-[120px] p-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium resize-none"
                  required
                />
                <div className="text-xs text-slate-500 font-medium text-right">
                  {formData.description.length} / 500 characters
                </div>
              </div>

              {/* Row 4: Banner Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Upload Banner Image
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-brand-blue bg-blue-50"
                      : "border-slate-300 hover:border-brand-blue/50 bg-slate-50 hover:bg-slate-50/80"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("banner-upload").click()
                  }
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
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-md px-6 py-2.5 h-auto text-xs font-semibold border-slate-300 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-6 py-2.5 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update Fitzone" : "Add Fitzone"}
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

export default AddFitzonePage;
