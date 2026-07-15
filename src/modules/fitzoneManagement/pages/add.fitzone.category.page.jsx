import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { CloudUpload, Send, Layers } from "lucide-react";
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
  const [categoryName, setCategoryName] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit && editData) {
      setCategoryName(editData.title || "");
      setCategoryDetails(editData.description || "");
      setHtmlContent(editData.html_content || "");
      setIconPreview(editData.icon || editData.icon_url || null);
    }
  }, [isEdit, editData]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
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
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading={isEdit ? "Edit Work-Out Session" : "Add Work-Out Session"}
            icon={<Layers className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading={isEdit ? "Edit existing workout session category." : "Create a new workout session category."}
          />
        </Header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-auto w-full">
          <div className="bg-brand-blue px-6 py-4 relative flex items-center justify-center">
            <h2 className="text-white text-lg font-bold tracking-wide">
              {isEdit ? "Edit Work-Out Session" : "Add Work-Out Session"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Category Title
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Title Here"
                className="w-full h-11 px-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Category Details
              </label>
              <input
                type="text"
                value={categoryDetails}
                onChange={(e) => setCategoryDetails(e.target.value)}
                placeholder="e.g. 20 min , 182 kcal"
                className="w-full h-11 px-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                {isEdit ? "Replace Category Icon" : "Upload Category Icon"}
              </label>

              {isEdit && iconPreview && !iconFile && (
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-800 block mb-2">
                    Current Uploaded Icon
                  </label>
                  <div className="w-12 h-12 rounded-lg bg-blue-50/50 flex items-center justify-center border border-slate-100 p-2">
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div
                className="w-full h-32 border-2 border-slate-200 border-solid rounded-md bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {iconFile ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-brand-blue font-semibold">
                      {iconFile.name}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Click to replace
                    </span>
                  </div>
                ) : (
                  <React.Fragment>
                    <CloudUpload
                      className="w-10 h-10 text-slate-300 mb-2"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-slate-300 font-medium">
                      Drag and drop a file here or click
                    </span>
                  </React.Fragment>
                )}
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
              <label className="text-sm font-bold text-slate-800">
                Category Description
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter Description"
                className="w-full h-28 p-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium resize-none"
              />
              <div className="text-[11px] text-slate-500 font-medium">
                Character Count: {htmlContent.length}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 h-10 text-sm font-bold flex items-center gap-2 rounded shadow-sm"
              >
                <Send className="w-4 h-4" />
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Category"
                    : "Add Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddFitzoneCategoryPage;
