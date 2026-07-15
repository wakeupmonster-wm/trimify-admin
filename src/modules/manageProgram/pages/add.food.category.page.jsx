import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Send, Layers } from "lucide-react";
import { toast } from "sonner";
import { addFoodCategory, updateFoodCategory } from "../store/food.slice";
import { BASE_URL } from "@/services/api-endpoints/base.url";

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
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    editData?.image
      ? `${BASE_URL.replace("/api", "")}/${editData.image}`
      : null,
  );

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

  const handleDrop = (e) => {
    e.preventDefault();
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", categoryName);
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
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Manage Food Category"
            icon={<Layers className="w-9 h-10 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading={
              isEditMode
                ? "Edit and configure food category."
                : "Add and configure food categories."
            }
          />
        </Header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-auto w-full">
          {/* Card Header */}
          <div className="bg-brand-blue text-white px-6 py-4 flex items-center justify-center">
            <h2 className="text-lg font-semibold tracking-wide">
              {isEditMode ? "Edit Food Category" : "Add Food Category"}
            </h2>
          </div>

          {/* Card Content */}
          <div className="p-8 space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter Category Name"
                className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {isEditMode && editData?.image && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
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

            {/* Upload Icon */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {isEditMode ? "Replace Uploaded Icon" : "Upload Icon"}
              </label>
              <div
                className="w-full border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("icon-upload").click()}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain mb-2"
                    />
                    <span className="text-xs text-slate-500">
                      Click or drag to replace
                    </span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-slate-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-slate-400 font-medium">
                      Drag and drop a file here or click
                    </p>
                  </>
                )}
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Maximum Icon Size: Up to 6MB per upload
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pb-8 flex justify-center">
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 h-11 text-sm font-semibold shadow-sm w-48"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Send className="w-4 h-4 mr-2" />
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Update Category"
                  : "Add Category"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddFoodCategoryPage;
