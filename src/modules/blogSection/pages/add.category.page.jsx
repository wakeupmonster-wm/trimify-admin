import { Container } from "@/components/common/container";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Save, Layers, UploadCloud, Loader2 } from "lucide-react";
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
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addBlogCategory, updateBlogCategory } from "../store/blog.slice";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    iconImage: null,
  });

  const [isDragging, setIsDragging] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error("Category Title is required");
    }

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
        await dispatch(updateBlogCategory({ id, data: payload })).unwrap();
        toast.success("Category updated successfully!");
      } else {
        if (!formData.iconImage) {
          setLoading(false);
          return toast.error("Category icon is required");
        }
        await dispatch(addBlogCategory(payload)).unwrap();
        toast.success("Category added successfully!");
      }
      navigate(-1);
    } catch (error) {
      toast.error(error || "An error occurred while saving the category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 w-full">
            <PageHeader
              heading={isEdit ? "Edit Category" : "Add Category"}
              icon={<Layers className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading={
                isEdit
                  ? "Update existing blog category."
                  : "Create a new blog category."
              }
            />
          </div>
        </Header>

        {/* Main Form Card */}
        <div className="mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-6 md:px-8 pt-5 pb-6 space-y-6"
          >
            {/* Category Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category Title
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

            {/* Category Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category Description
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

            {/* Upload Icon Image */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEdit ? "Replace Category Icon" : "Upload Category Icon"}
              </Label>
              {isEdit && editData?.icon && !formData.iconImage && (
                <div className="mb-4">
                  <Label className="text-xs font-bold text-slate-800 block mb-2">
                    Current Icon
                  </Label>
                  <div className="w-24 h-24 rounded-lg bg-blue-50/50 flex items-center justify-center border border-slate-100 p-2">
                    <img
                      src={editData.icon}
                      alt="Current Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-brand-blue bg-blue-50"
                    : "border-slate-300/60 hover:border-brand-blue/50 bg-slate-50 hover:bg-slate-50/80"
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
                <UploadCloud className="w-10 h-10 text-brand-blue mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {formData.iconImage
                    ? formData.iconImage.name
                    : "Click or drag and drop to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 6144 KB)
                </p>
              </div>
            </div>

            {/* Category Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-6 py-2.5 h-11 sm:h-10 text-sm sm:text-xs font-semibold border-slate-300/60"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-6 py-2.5 h-11 sm:h-10 text-sm sm:text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin shrink-0" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update Category" : "Save Category"}
                    <Save size={16} className="shrink-0" />
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

export default AddCategoryPage;
