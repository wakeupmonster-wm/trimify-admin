import { Container } from '@/components/common/container';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addProgram, updateProgram } from '../store/program.slice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_KB = 6144;

const AddProgramPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const editData = location.state?.editData;
    const isEditMode = !!editData;

    const [formData, setFormData] = useState({
      title: editData?.programName || "",
      description: editData?.description || "",
      duration: editData?.programDuration || "",
      bannerImage: null
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDurationChange = (value) => {
      setFormData(prev => ({ ...prev, duration: value }));
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
        setFormData(prev => ({ ...prev, bannerImage: file }));
      }
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, bannerImage: file }));
      }
    };

    const validateImage = (file) => {
      if (!file) return true;
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only JPEG, PNG, GIF or WEBP images are allowed");
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
        toast.error("Image size must not exceed 6MB");
        return false;
      }
      return true;
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!isEditMode && !formData.bannerImage) {
        toast.error("Please upload a program cover image");
        return;
      }

      if (!validateImage(formData.bannerImage)) return;

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("duration", formData.duration);
      if (formData.bannerImage) {
        payload.append("image", formData.bannerImage);
      }

      setIsSubmitting(true);

      const action = isEditMode
        ? updateProgram({ id: editData.id, formData: payload })
        : addProgram(payload);

      dispatch(action)
        .unwrap()
        .then(() => {
          toast.success(isEditMode ? "Program updated successfully" : "Program added successfully");
          navigate(-1);
        })
        .catch((err) => toast.error(err || "Something went wrong"))
        .finally(() => setIsSubmitting(false));
    };

    return (
      <Container>
        {/* Top Header Section */}
        <div className="flex w-full mb-6 mt-2">
           <Button
             className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
             onClick={() => navigate(-1)}
           >
             <ArrowLeft className="w-4 h-4" />
             Previous
           </Button>
        </div>

        {/* Main Form Card */}
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-slate-300/80 overflow-hidden">
          <div className="bg-brand-blue py-4 px-6 text-center">
            <h2 className="text-white text-lg font-bold">{isEditMode ? "Edit Program" : "Add Program"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Program Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Program Title</Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                maxLength={255}
                className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300/80"
                required
              />
            </div>

            {/* Program Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Program Description</Label>
              <Textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300/80 resize-none p-3"
                required
              />
              <div className="text-xs text-slate-500 font-medium">
                Character Count: {formData.description.length} / 500
              </div>
            </div>

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Upload Banner Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-brand-aqua bg-brand-aqua/5' : 'border-slate-200 hover:border-slate-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('banner-upload').click()}
              >
                <input
                  id="banner-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                />
                <UploadCloud className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  {formData.bannerImage
                    ? formData.bannerImage.name
                    : isEditMode && editData?.image
                      ? `Current image: ${editData.image.split('/').pop()} (click to replace)`
                      : "Drag and drop a file here or click"}
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Maximum Image Size: Up to 6MB per upload
              </div>
            </div>

            {/* Program Duration */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Program Duration</Label>
              <Select value={formData.duration} onValueChange={handleDurationChange} required>
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300/80">
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

            {/* Submit Button */}
            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-10 py-2.5 h-auto text-sm font-semibold flex items-center gap-2 shadow-md disabled:opacity-60"
               >
                <Send size={16} />
                {isSubmitting
                  ? (isEditMode ? "Updating..." : "Adding...")
                  : (isEditMode ? "Update Program" : "Add Program")}
              </Button>
            </div>

          </form>
        </div>
      </Container>
    );
};

export default AddProgramPage;
