import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export function ViewUserDialog({ open, onOpenChange, userData }) {
  if (!userData) return null;

  // Calculate BMI
  let bmi = "N/A";
  if (userData.height && userData.weight) {
    const heightInMeters = parseFloat(userData.height) / 100;
    const weightInKg = parseFloat(userData.weight);
    if (heightInMeters > 0) {
      bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
  }

  // Format Date of Birth
  let formattedDob = "-";
  if (userData.dob) {
    formattedDob = format(new Date(userData.dob), "dd-MM-yyyy");
  }

  // Formatting boolean/int to Yes/No
  const getYesNo = (val) => (val ? "Yes" : "No");
  
  // Safe extraction for Sub Admin Name
  let subAdminName = "-";
  if (userData.sub_admin) {
     subAdminName = typeof userData.sub_admin === 'object' ? userData.sub_admin.name : userData.sub_admin;
  }

  const fields = [
    { label: "Name", value: userData.name || "-" },
    { label: "User Default ID", value: userData.user_id || "-" },
    { label: "Email Address", value: userData.email || "-" },
    { label: "Phone Number", value: userData.mobileNo || "-" },
    { label: "Assign Sub-Admin", value: subAdminName, isSelect: true },
    { label: "Date of Birth", value: formattedDob },
    { label: "Height (cm)", value: userData.height || "-" },
    { label: "Weight (kg)", value: userData.weight || "-" },
    { label: "Gender", value: userData.gender || "-" },
    { label: "Fluid Restriction", value: getYesNo(userData.fluid_restrictions) },
    { label: "weight Goal", value: userData.weight_goal || "-" },
    { label: "Main Goal", value: userData.main_goal || "-" },
    { label: "Body Shape", value: userData.body_shape || "-" },
    { label: "Body Shape Goal", value: userData.body_shape_goal || "-" },
    { label: "Ideal Weight Period", value: userData.ideal_weight_period || "-" },
    { label: "Fitness Level", value: userData.fitness_level || "-" },
    { label: "Vegetarian", value: getYesNo(userData.vegetarian) },
    { label: "BMI", value: bmi },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 border-none rounded-xl overflow-hidden shadow-2xl">
        <DialogHeader className="bg-brand-blue p-4 text-center">
          <DialogTitle className="text-white text-lg font-bold text-center w-full mx-auto">
            View User
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {fields.map((field, idx) => (
              <div key={idx} className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  {field.label}
                </Label>
                {field.isSelect ? (
                  <Select value={field.value !== "-" ? field.value : undefined} disabled>
                    <SelectTrigger className="h-10 text-sm bg-slate-100 text-slate-500 font-medium border-slate-300 cursor-not-allowed focus-visible:ring-0">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </Select>
                ) : (
                  <Input
                    readOnly
                    value={field.value}
                    className="h-10 text-sm bg-slate-100 text-slate-500 font-medium border-slate-300 cursor-not-allowed focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
