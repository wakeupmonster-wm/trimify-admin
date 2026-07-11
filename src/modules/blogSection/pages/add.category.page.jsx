import { Container } from '@/components/common/container';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
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

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      status: "Active"
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value) => {
      setFormData(prev => ({ ...prev, status: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submit Category:", formData);
      // TODO: Dispatch action to create category API
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
            <h2 className="text-white text-lg font-bold">Add Category</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Category Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Category Title</Label>
              <Input
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
                className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200"
                required
              />
            </div>

            {/* Category Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Category Description</Label>
              <Textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200 resize-none p-3"
                required
              />
              <div className="text-xs text-slate-500 font-medium">
                Character Count: {formData.description.length} / 500
              </div>
            </div>

            {/* Category Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange} required>
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
                Add Category
              </Button>
            </div>

          </form>
        </div>
      </Container>
    );
};

export default AddCategoryPage;
