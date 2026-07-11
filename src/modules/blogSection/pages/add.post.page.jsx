import { Container } from '@/components/common/container';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddPostPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      title: "",
      category: "",
      description: "",
      status: "Public",
      bannerImage: null
    });

    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submit Post:", formData);
      // TODO: Dispatch action to create blog post API
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-brand-blue py-4 px-6 text-center">
            <h2 className="text-white text-lg font-bold">Add Blog Post</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Post Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Post Title</Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Category</Label>
              <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} required>
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200">
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
              <Label className="text-sm font-bold text-slate-800">Content / Description</Label>
              <Textarea
                name="description"
                placeholder="Enter content"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[200px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200 resize-none p-3"
                required
              />
            </div>

            {/* Upload Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Upload Featured Image</Label>
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
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <UploadCloud className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  {formData.bannerImage ? formData.bannerImage.name : "Drag and drop a file here or click"}
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Maximum Image Size: Up to 6MB per upload
              </div>
            </div>

            {/* Post Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)} required>
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200">
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
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-10 py-2.5 h-auto text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <Send size={16} />
                Add Post
              </Button>
            </div>

          </form>
        </div>
      </Container>
    );
};

export default AddPostPage;
