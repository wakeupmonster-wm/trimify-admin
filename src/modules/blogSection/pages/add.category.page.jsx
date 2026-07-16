import { Container } from "@/components/common/container";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Layers } from "lucide-react";
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

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        title: editData.title || editData.name || "",
        description: editData.description || "",
        status: editData.status || "Active",
      });
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Category:", formData);
    // TODO: Dispatch action to create category API
  };

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading={isEdit ? "Edit Category" : "Add Category"}
            icon={<Layers className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading={
              isEdit
                ? "Update existing blog category."
                : "Create a new blog category."
            }
          />
        </Header>

        {/* Main Form Card */}
        <div className="mx-auto w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-brand-blue py-4 px-6 flex items-center justify-center">
            <h2 className="text-white text-lg font-bold tracking-wide">
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Category Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Category Title
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

            {/* Category Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Category Description
              </Label>
              <Textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200 resize-none p-3"
                required
              />
              <div className="text-xs text-slate-500 font-medium">
                Character Count: {formData.description.length} / 500
              </div>
            </div>

            {/* Category Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
                required
              >
                <SelectTrigger className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-200">
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
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded shadow-sm px-10 h-11 text-sm font-semibold flex items-center gap-2"
              >
                <Send size={16} />
                {isEdit ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddCategoryPage;
