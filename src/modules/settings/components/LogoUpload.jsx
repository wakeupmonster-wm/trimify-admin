import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal"; // Update with your actual path

export default function LogoUpload({ currentLogo, onFileSelect }) {
  const [preview, setPreview] = useState(currentLogo);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeSuccess, setRemoveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(currentLogo);
  }, [currentLogo]);

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
      handleFileLogic(file);
    }
  };

  const handleFileLogic = (file) => {
    if (file.size > 1024 * 1024) {
      alert("File size is too large! Max 1MB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileLogic(file);
    }
  };

  // Step 1: Just open the modal
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Step 2: Actually remove after confirmation
  const handleConfirmRemove = async () => {
    setRemoveLoading(true);
    setRemoveSuccess(false);
    // Simulate minor delay for premium animation effect
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setRemoveSuccess(true);
    setRemoveLoading(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setRemoveSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-slate-800">Upload Logo</label>
      <div
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging
            ? "border-app-primary2 bg-blue-50"
            : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          id="logo-upload-input"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-contain mb-3"
            />
            <span className="text-sm font-semibold text-slate-700 text-center">
              Logo selected. Click or drag to replace.
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

      {preview && (
        <button
          type="button"
          onClick={handleRemoveClick}
          className="text-[10px] text-red-500 hover:underline flex items-center gap-1"
        >
          <X size={10} /> Remove Image
        </button>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          if (removeLoading || removeSuccess) return;
          setIsModalOpen(false);
        }}
        onConfirm={handleConfirmRemove}
        title="Remove Logo?"
        message="Are you sure you want to remove the logo? This change will reflect once you save the settings."
        confirmText="Yes, Remove"
        type="danger"
        loading={removeLoading}
        success={removeSuccess}
      />
    </div>
  );
}
