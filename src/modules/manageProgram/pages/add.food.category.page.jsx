import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud, Layers } from "lucide-react";
import { toast } from "sonner";
import { addFoodCategory, updateFoodCategory } from "../store/food.slice";
import { BASE_URL } from "@/services/api-endpoints/base.url";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddFoodCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const { loading } = useSelector((state) => state.manageFood);

  const [categoryName, setCategoryName] = useState(
    editData?.name || editData?.title || "",
  );
  const [description, setDescription] = useState(editData?.description || "");
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    editData?.image
      ? `${BASE_URL.replace("/api", "")}/${editData.image}`
      : null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        toast.error("File size exceeds 6MB limit.");
        return;
      }
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      if (file.size > 6 * 1024 * 1024) {
        toast.error("File size exceeds 6MB limit.");
        return;
      }
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!categoryName.trim()) newErrors.categoryName = "Category Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    // Add more validation if necessary
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", description);
    if (iconFile) {
      formData.append("image", iconFile);
    }

    if (isEditMode) {
      const resultAction = await dispatch(
        updateFoodCategory({ id: categoryId, data: formData }),
      );
      if (updateFoodCategory.fulfilled.match(resultAction)) {
        toast.success("Food category updated successfully!");
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to update food category.");
      }
    } else {
      const resultAction = await dispatch(addFoodCategory(formData));
      if (addFoodCategory.fulfilled.match(resultAction)) {
        toast.success("Food category added successfully!");
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to add food category.");
      }
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Food Category"
              icon={<Layers className="w-9 h-10 text-white" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading={
                isEditMode
                  ? "Edit and configure food category."
                  : "Add and configure food categories."
              }
            />
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm px-6 md:px-8 pt-5 pb-6 border border-slate-300/60 overflow-hidden">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category Name
              </Label>
              <Input
                placeholder="Enter Category Name"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.categoryName ? 'border-red-500' : 'border-slate-300/60'}`}
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (errors.categoryName) setErrors({ ...errors, categoryName: null });
                }}
              />
              {errors.categoryName && <p className="text-red-500 text-[10px] mt-1">{errors.categoryName}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Description
              </Label>
              <Textarea
                placeholder="Enter Category Description"
                className={`text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-y min-h-[100px] ${errors.description ? 'border-red-500' : 'border-slate-300/60'}`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
              />
              {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description}</p>}
            </div>

            {isEditMode && editData?.image && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Current Uploaded Banner Image
                </label>
                <div className="flex flex-col items-center justify-center py-4">
                  <img
                    src={`${BASE_URL.replace("/api", "")}/${editData.image}`}
                    alt="Current Category"
                    className="w-16 h-16 object-contain rounded-md"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEditMode ? "Replace Uploaded Icon" : "Upload Icon"}
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-app-primary2 bg-blue-50"
                    : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("icon-upload").click()}
              >
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain mb-3"
                    />
                    <span className="text-sm font-semibold text-slate-700 text-center">
                      Icon selected. Click or drag to replace.
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                    <p className="text-sm font-semibold text-slate-700 text-center">
                      Click or drag and drop to upload
                    </p>
                  </>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG (max. 800x400px)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outline"
              className="rounded-md px-8 py-2.5 h-auto text-sm font-semibold"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center gap-2 shadow-sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save size={16} />
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                  ? "Update"
                  : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddFoodCategoryPage;
