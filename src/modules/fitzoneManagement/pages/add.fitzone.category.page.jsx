import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { UploadCloud, Layers, Send, Loader2 } from "lucide-react";
import {
  addFitzoneCategory,
  updateFitzoneCategory,
} from "../store/fitzone.category.slice";
import { toast } from "sonner";

const AddFitzoneCategoryPage = () => {
  const { id, categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.fitzoneCategory);

  const isEdit = Boolean(categoryId);
  const editData = location.state?.editData || null;

  // Form State
  const [categoryName, setCategoryName] = useState(editData?.title || "");
  const [categoryDetails, setCategoryDetails] = useState(
    editData?.description || "",
  );
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(editData?.image || null);
  const [htmlContent, setHtmlContent] = useState(editData?.description || "");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit && editData) {
      setCategoryName(editData.title || "");
      setCategoryDetails(editData.description || "");
      setHtmlContent(editData.html_content || "");
      setIconPreview(editData.icon || editData.icon_url || null);
    }
  }, [isEdit, editData]);

  // Helper logic for upload image
  const handleIconLogic = (file) => {
    setIconFile(file);
    const objectUrl = URL.createObjectURL(file);
    setIconPreview(objectUrl);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleIconLogic(file);
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
      handleIconLogic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("fitzone_id", id);
    formData.append("title", categoryName);
    formData.append("description", categoryDetails);
    formData.append("html_content", htmlContent);

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    let resultAction;
    if (isEdit) {
      resultAction = await dispatch(
        updateFitzoneCategory({ id: categoryId, data: formData }),
      );
    } else {
      resultAction = await dispatch(addFitzoneCategory(formData));
    }

    if (
      updateFitzoneCategory.fulfilled.match(resultAction) ||
      addFitzoneCategory.fulfilled.match(resultAction)
    ) {
      toast.success(`Category ${isEdit ? "updated" : "added"} successfully!`);
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "An error occurred");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Work-Out Session" : "Add Work-Out Session"}
                icon={<Layers className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading={
                  isEdit
                    ? "Edit existing workout session category."
                    : "Create a new workout session category."
                }
              />
            </div>
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm px-4 sm:px-6 md:px-8 pt-5 pb-6 border border-slate-300/60 overflow-hidden w-full min-w-0">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full min-w-0">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Category Title
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Title Here"
                className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Category Details
              </label>
              <input
                type="text"
                value={categoryDetails}
                onChange={(e) => setCategoryDetails(e.target.value)}
                placeholder="e.g. 20 min , 182 kcal"
                className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                {isEdit ? "Replace Category Icon" : "Upload Category Icon"}
              </label>

              {isEdit && iconPreview && !iconFile && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-800 block mb-2">
                    Current Uploaded Icon
                  </label>
                  <div className="w-16 h-16 rounded-md bg-blue-50/50 flex items-center justify-center border border-slate-100 p-2">
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div
                className={`w-full border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${
                  isDragging
                    ? "border-brand-blue bg-blue-50"
                    : "border-slate-300/60 hover:border-brand-blue/50 bg-slate-50 hover:bg-slate-50/80"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-brand-blue mb-3" />
                <p className="text-sm font-semibold text-slate-700 text-center">
                  {iconFile
                    ? "Icon selected. Click or drag to replace."
                    : "Click or drag and drop to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SVG, PNG, JPG (max. 800x400px)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleIconChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Category Description
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter Description"
                className="w-full px-4 py-3 text-sm border border-slate-300/60 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue transition-colors font-medium resize-y min-h-[100px]"
              />
              <div className="text-[11px] text-slate-500 font-medium">
                Character Count: {htmlContent.length}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                variant="outline"
                type="button"
                className="w-full sm:w-auto rounded-xl px-5 sm:px-6 h-11 sm:h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-5 sm:px-6 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update" : "Save"}
                    <Send className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
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

export default AddFitzoneCategoryPage;
