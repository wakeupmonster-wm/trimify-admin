import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { updateSubAdmin } from "../store/sub.admin.slice";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { LuUserRoundPen } from "react-icons/lu";
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";

const EditSubAdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);

  const fitnessDesignations = [
    "Fitness Trainer",
    "Nutritionist",
    "Health Coach",
    "Wellness Advisor",
    "Gym Manager",
  ];

  useEffect(() => {
    if (!editData) {
      // If accessed directly without state, go back
      navigate("/admin/sub-admin-management");
      return;
    }

    const initialDesignation = editData.designation || "";
    if (
      initialDesignation &&
      !fitnessDesignations.includes(initialDesignation)
    ) {
      setIsCustomDesignation(true);
    }

    setFormData({
      name: editData.name || editData.userName || "",
      email: editData.email || editData.emailId || "",
      hospital: editData.hospital || editData.hospitalName || "",
      location: editData.location || editData.country || "Australia",
      phone: editData.phone || "",
      designation: initialDesignation,
      password: "", // Leave blank unless they want to update it
      role:
        editData.role === 1 ||
        editData.role === "1" ||
        editData.role === "WhiteListing User" ||
        editData.role_name === "WhiteListing User"
          ? "WhiteListing User"
          : editData.role === 0 ||
              editData.role === "0" ||
              editData.role === "Sub-Admin User" ||
              editData.role_name === "Sub-Admin User"
            ? "Sub-Admin User"
            : String(editData.role || editData.role_name || ""),
    });
  }, [editData, navigate]);

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
    if (!formData.hospital.trim())
      newErrors.hospital = "Hospital/Clinic Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);

    try {
      // Map role string back to number if needed by the backend
      const submitData = { ...formData };
      if (submitData.role === "WhiteListing User") submitData.role = 1;
      else if (submitData.role === "Sub-Admin User") submitData.role = 0;

      // If password is not modified, you might want to remove it from the payload
      if (!submitData.password) {
        delete submitData.password;
      }

      const result = await dispatch(
        updateSubAdmin({ id: editData.id || editData._id, data: submitData }),
      );

      if (updateSubAdmin.fulfilled.match(result)) {
        navigate("/admin/sub-admin-management");
      }
    } finally {
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Edit Sub Admin"
                icon={
                  <LuUserRoundPen className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading="Edit sub-administrator details."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Name
                </Label>
                <Input
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.name ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Email address
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.email ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Hospital/Clinic Name */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Hospital/Clinic Name
                </Label>
                <Input
                  name="hospital"
                  placeholder="Enter Hospital/Clinic name"
                  value={formData.hospital}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.hospital ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.hospital && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.hospital}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Country
                </Label>
                <Input
                  name="location"
                  value={formData.location}
                  disabled
                  className="h-11 sm:h-10 text-sm bg-slate-100 text-slate-500 placeholder:font-normal font-medium border-slate-300/60 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.phone ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Designation
                </Label>

                {!isCustomDesignation ? (
                  <Select
                    key={formData.designation || "desig-placeholder"}
                    value={formData.designation || undefined}
                    onValueChange={(val) => {
                      if (val === "CUSTOM_ADD_NEW") {
                        setIsCustomDesignation(true);
                        setFormData((prev) => ({ ...prev, designation: "" }));
                      } else {
                        setFormData((prev) => ({ ...prev, designation: val }));
                      }
                      if (errors.designation)
                        setErrors((prev) => ({ ...prev, designation: null }));
                    }}
                  >
                    <SelectTrigger
                      className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.designation ? "border-red-500" : "border-slate-300/60"}`}
                    >
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessDesignations.map((desig) => (
                        <SelectItem key={desig} value={desig}>
                          {desig}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value="CUSTOM_ADD_NEW"
                        className="text-app-primary2 font-semibold"
                      >
                        + Other (Enter Manually)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      name="designation"
                      placeholder="Enter Custom Designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={`flex-1 h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.designation ? "border-red-500" : "border-slate-300/60"}`}
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCustomDesignation(false);
                        setFormData((prev) => ({ ...prev, designation: "" }));
                        if (errors.designation)
                          setErrors((prev) => ({ ...prev, designation: null }));
                      }}
                      className="h-11 sm:h-10 px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                {errors.designation && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs 3xl:text-sm font-bold text-slate-800">
                  Role
                </Label>
                <Select
                  key={formData.role || "role-placeholder"}
                  value={formData.role || undefined}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger
                    className={`h-11 sm:h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-normal ${errors.role ? "border-red-500" : "border-slate-300/60"}`}
                  >
                    <SelectValue
                      placeholder="Select Role"
                      className="font-medium"
                    />
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
                {errors.role && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/sub-admin-management")}
                className="w-full sm:w-auto rounded-md px-4 h-10 text-xs 3xl:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-4 h-10 text-xs 3xl:text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to update this sub-administrator's details?"
        confirmText="Update"
        type="brand"
        loading={isSubmitting}
      />
    </Container>
  );
};

export default EditSubAdminPage;
