import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function AddSubAdminDialog({ open, onOpenChange, onAdd }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hospital: "",
    location: "Australia",
    phone: "",
    designation: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) {
      onAdd(formData);
    }
    // Optional: reset form and close dialog
    onOpenChange(false);
    setFormData({
      name: "",
      email: "",
      hospital: "",
      location: "Australia",
      phone: "",
      designation: "",
      password: "",
      role: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 border-none rounded-xl overflow-hidden shadow-2xl">
        <DialogHeader className="bg-brand-blue p-4 text-center">
          <DialogTitle className="text-white text-lg font-bold text-center w-full mx-auto">
            Add SubAdmin
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Name</Label>
              <Input
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Email address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Email address
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Hospital/Clinic Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Hospital/Clinic Name
              </Label>
              <Input
                name="hospital"
                placeholder="Enter Hospital/Clinic name"
                value={formData.hospital}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Country
              </Label>
              <Input
                name="location"
                value={formData.location}
                disabled
                className="h-10 text-sm bg-slate-100 text-slate-500 font-medium border-slate-300 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Phone Number
              </Label>
              <Input
                type="tel"
                name="phone"
                placeholder="Enter Number"
                value={formData.phone}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Designation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Designation
              </Label>
              <Input
                name="designation"
                placeholder="Enter Designation"
                value={formData.designation}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sub-Admin User">Sub-Admin User</SelectItem>
                  <SelectItem value="WhiteListing User">
                    WhiteListing User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center gap-2"
            >
              <Send size={16} />
              Add Sub-Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
