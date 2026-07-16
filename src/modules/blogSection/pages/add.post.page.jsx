import { Container } from "@/components/common/container";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, UploadCloud, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddPostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    status: "Public",
    bannerImage: null,
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        title: editData.title || "",
        category: editData.category || "",
        description: editData.description || "",
        status: editData.status || "Public",
        bannerImage: null,
      });
    }
  }, [isEdit, editData]);

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Post:", formData);
    // TODO: Dispatch action to create blog post API
  };

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading={isEdit ? "Edit Blog Post" : "Add Blog Post"}
            icon={<FileText className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading={
              isEdit ? "Update existing blog post." : "Create a new blog post."
            }
          />
        </Header>

        {/* Main Form Card */}
        <div className="mx-auto w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-brand-blue py-4 px-6 flex items-center justify-center">
            <h2 className="text-white text-lg font-bold tracking-wide">
              {isEdit ? "Edit Blog Post" : "Add Blog Post"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Post Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Post Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleSelectChange("category", val)}
                required
              >
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nutrition">Nutrition</SelectItem>
                  <SelectItem value="Workout">Workout</SelectItem>
                  {/* More categories can be fetched from API here */}
                </SelectContent>
              </Select>
            </div>

            {/* Post Content/Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Content / Description
              </Label>
              <Textarea
                name="description"
                placeholder="Enter content"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[200px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200 resize-none p-3"
                required
              />
            </div>

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                {isEdit ? "Replace Featured Image" : "Upload Featured Image"}
              </Label>
              {isEdit && editData?.image && !formData.bannerImage && (
                <div className="mb-4">
                  <Label className="text-sm font-bold text-slate-800 block mb-2">
                    Current Featured Image
                  </Label>
                  <div className="w-24 h-24 rounded-lg bg-blue-50/50 flex items-center justify-center border border-slate-100 p-2">
                    <img
                      src={editData.image}
                      alt="Current Featured"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? "border-brand-blue bg-brand-blue" : "border-slate-200 hover:border-slate-300"}`}
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
                <UploadCloud className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  {formData.bannerImage
                    ? formData.bannerImage.name
                    : "Drag and drop a file here or click"}
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Maximum Image Size: Up to 6MB per upload
              </div>
            </div>

            {/* Post Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange("status", val)}
                required
              >
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded shadow-sm px-10 h-11 text-sm font-semibold flex items-center gap-2"
              >
                <Send size={16} />
                {isEdit ? "Update Post" : "Add Post"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddPostPage;
