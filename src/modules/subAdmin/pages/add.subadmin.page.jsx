import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { addSubAdmin } from "../store/sub.admin.slice";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";

const AddSubAdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.hospital.trim()) newErrors.hospital = "Hospital/Clinic Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Role is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      if (submitData.role === "WhiteListing User") submitData.role = 1;
      else if (submitData.role === "Sub-Admin User") submitData.role = 0;

      const result = await dispatch(addSubAdmin(submitData));
      if (addSubAdmin.fulfilled.match(result)) {
        navigate("/admin/sub-admin-management");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full">
              <PageHeader
                heading="Add Sub Admin"
                icon={<UserPlus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 text-white shrink-0" />}
                color="bg-app-primary2 shadow-brand-blue"
                subheading="Create a new sub-administrator account."
              />
            </div>
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden w-full min-w-0">
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 pb-5 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-6">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">Name</Label>
                <Input
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.name ? 'border-red-500' : 'border-slate-300/60'}`}
                />
                {errors.name && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Email address
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.email ? 'border-red-500' : 'border-slate-300/60'}`}
                />
                {errors.email && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Hospital/Clinic Name */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Hospital/Clinic Name
                </Label>
                <Input
                  name="hospital"
                  placeholder="Enter Hospital/Clinic name"
                  value={formData.hospital}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.hospital ? 'border-red-500' : 'border-slate-300/60'}`}
                />
                {errors.hospital && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.hospital}</p>}
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Country
                </Label>
                <Input
                  name="location"
                  value={formData.location}
                  disabled
                  className="h-11 sm:h-10 text-sm bg-slate-100 text-slate-500 font-medium border-slate-300/60 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.phone ? 'border-red-500' : 'border-slate-300/60'}`}
                />
                {errors.phone && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Designation
                </Label>
                <Input
                  name="designation"
                  placeholder="Enter Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.designation ? 'border-red-500' : 'border-slate-300/60'}`}
                />
                {errors.designation && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.designation}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium pr-10 ${errors.password ? 'border-red-500' : 'border-slate-300/60'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-bold text-slate-800">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium ${errors.role ? 'border-red-500' : 'border-slate-300/60'}`}>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sub-Admin User">
                      Sub-Admin User
                    </SelectItem>
                    <SelectItem value="WhiteListing User">
                      WhiteListing User
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.role}</p>}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/sub-admin-management")}
                className="w-full sm:w-auto rounded-md px-8 h-11 sm:h-10 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-8 h-11 sm:h-10 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
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

export default AddSubAdminPage;
