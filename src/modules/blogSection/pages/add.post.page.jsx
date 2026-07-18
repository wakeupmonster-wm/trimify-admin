import { Container } from "@/components/common/container";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, FileText, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  addBlogPost,
  updateBlogPost,
  fetchBlogCategoryDropdown,
} from "../store/blog.slice";

const AddPostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    status: "Active", // "Active" maps to the SelectItem displaying "Public"
    bannerImage: null,
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        title: editData.title || "",
        category:
          editData.category?.id?.toString() ||
          editData.blog_category_id?.toString() ||
          "",
        description: editData.description || "",
        // If backend sends "Active", we store "Active" so the Select dropdown displays "Public"
        status:
          editData.status === "Active"
            ? "Active"
            : editData.status === "Inactive"
              ? "Inactive"
              : "Active",
        bannerImage: null,
      });
    }
  }, [isEdit, editData]);

  useEffect(() => {
    dispatch(fetchBlogCategoryDropdown())
      .unwrap()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        toast.error("Failed to load categories");
      });
  }, [dispatch]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error("Post Title is required");
    }
    if (!formData.category) {
      return toast.error("Please select a category");
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category_id", formData.category);
      payload.append("content", formData.description);
      payload.append("status", formData.status);

      if (formData.bannerImage) {
        payload.append("image", formData.bannerImage);
      }

      if (isEdit) {
        await dispatch(updateBlogPost({ id, data: payload })).unwrap();
        toast.success("Post updated successfully!");
      } else {
        await dispatch(addBlogPost(payload)).unwrap();
        toast.success("Post added successfully!");
      }
      navigate(-1);
    } catch (error) {
      toast.error(error || "An error occurred while saving the post");
    } finally {
      setLoading(false);
    }
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
        <div className="mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-6 md:px-8 pt-5 pb-6 space-y-6"
          >
            {/* Post Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Post Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category
              </Label>
              <Select
                key={`cat-${categories.length}-${formData.category}`}
                value={formData.category}
                onValueChange={(val) => handleSelectChange("category", val)}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Post Content/Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Content / Description
              </Label>
              <RichTextEditor
                value={formData.description}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, description: content }))
                }
                placeholder="Enter content"
                height={300}
              />
            </div>

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEdit ? "Replace Featured Image" : "Upload Featured Image"}
              </Label>
              {isEdit && editData?.image && !formData.bannerImage && (
                <div className="mb-4">
                  <Label className="text-xs font-bold text-slate-800 block mb-2">
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
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-brand-blue bg-blue-50"
                    : "border-slate-300 hover:border-brand-blue/50 bg-slate-50 hover:bg-slate-50/80"
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

            {/* Post Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange("status", val)}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Public</SelectItem>
                  <SelectItem value="Inactive">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-md px-6 py-2.5 h-auto text-xs font-semibold border-slate-300"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-6 py-2.5 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update Post" : "Save Post"}
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

export default AddPostPage;
