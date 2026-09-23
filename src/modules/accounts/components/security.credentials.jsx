import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { Check, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { changePassword } from "../store/account.slice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";
import { useDispatch } from "react-redux";
import ConfirmModal from "@/components/common/ConfirmModal";

const SecurityCredentials = ({ account, loading, passwordSuccess }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const getStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length > 6) score++;
    if (password.length > 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: "Very Weak", color: "bg-alerts-error" },
      { label: "Weak", color: "bg-alerts-error" },
      { label: "Fair", color: "bg-alerts-warning" },
      { label: "Strong", color: "bg-alerts-success" },
      { label: "Very Strong", color: "bg-alerts-success" },
    ];
    return { score, ...levels[Math.min(score - 1, 4)] };
  };

  const strength = getStrength(form.newPassword);

  const passwordsMatch =
    form.confirmPassword && form.newPassword === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword && form.newPassword !== form.confirmPassword;
  const isSamePassword =
    form.currentPassword &&
    form.newPassword &&
    form.currentPassword === form.newPassword;

  const validateForm = () => {
    const errs = {};
    if (!form.currentPassword.trim()) {
      errs.currentPassword = "Current password is required";
    }
    if (!form.newPassword) {
      errs.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      errs.newPassword = "New password must be at least 6 characters";
    } else if (form.currentPassword && form.newPassword === form.currentPassword) {
      errs.newPassword = "New password cannot be the same as the current password";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsModalOpen(true);
  };

  const confirmUpdatePassword = async () => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        changePassword({
          old_password: form.currentPassword,
          new_password: form.newPassword,
        }),
      ).unwrap();

      toast.success(result?.message || "Password updated successfully!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || err?.error || "Failed to update password";

      toast.error(errorMessage);
      if (
        errorMessage.toLowerCase().includes("current") ||
        errorMessage.toLowerCase().includes("old") ||
        errorMessage.toLowerCase().includes("incorrect")
      ) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: errorMessage,
        }));
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const EyeToggle = ({ isVisible, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
    >
      {isVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
    </button>
  );

  const checks = [
    { label: "Min. 8 characters", pass: form.newPassword.length > 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(form.newPassword) },
    { label: "Number", pass: /[0-9]/.test(form.newPassword) },
    { label: "Special symbol", pass: /[^A-Za-z0-9]/.test(form.newPassword) },
  ];

  return (
    <Card className="mx-auto border-none gap-3 shadow-none bg-transparent overflow-hidden pb-5 font-sans w-full">
      <CardHeader className="p-0">
        <div className="pb-4 px-4 border-b border-slate-300/60">
          <DashboardHead
            title="Security Credentials"
            subtitle="Keep your admin account safe with a strong password."
            Icon={IconLock}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>
      </CardHeader>

      <CardContent className="px-5 py-1 space-y-6">
        <form onSubmit={handleFormSubmit} className="grid gap-4">
          {/* Current Password - Full Width */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-800">
              Current Password
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                className={`pr-10 h-10 text-sm font-normal ${
                  errors.currentPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-slate-300/60"
                }`}
                value={form.currentPassword}
                onChange={(e) => {
                  setForm({ ...form, currentPassword: e.target.value });
                  if (errors.currentPassword) {
                    setErrors((prev) => ({ ...prev, currentPassword: "" }));
                  }
                }}
                placeholder="Enter current password"
              />
              <EyeToggle
                isVisible={showPasswords.current}
                onToggle={() => toggleVisibility("current")}
              />
            </div>
            {errors.currentPassword && (
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.currentPassword}
              </span>
            )}
          </div>

          {/* New Passwords Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  className={`pr-10 h-10 text-sm font-normal ${
                    errors.newPassword || isSamePassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-slate-300/60"
                  }`}
                  value={form.newPassword}
                  onChange={(e) => {
                    setForm({ ...form, newPassword: e.target.value });
                    if (errors.newPassword) {
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }
                  }}
                  placeholder="Create new password"
                />
                <EyeToggle
                  isVisible={showPasswords.new}
                  onToggle={() => toggleVisibility("new")}
                />
              </div>
              {errors.newPassword ? (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {errors.newPassword}
                </span>
              ) : isSamePassword ? (
                <span className="text-red-500 text-[11px] mt-1 block">
                  New password cannot be the same as current password
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  className={`pr-10 h-10 text-sm font-normal ${
                    passwordsMismatch || errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-slate-300/60"
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm({ ...form, confirmPassword: e.target.value });
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  placeholder="Repeat new password"
                />
                <EyeToggle
                  isVisible={showPasswords.confirm}
                  onToggle={() => toggleVisibility("confirm")}
                />
              </div>
              {(errors.confirmPassword || passwordsMismatch) && (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {errors.confirmPassword || "Passwords do not match"}
                </span>
              )}
            </div>
          </div>

          {/* Password Strength Section */}
          {form.newPassword && (
            <div className="p-4 space-y-3 animate-in fade-in zoom-in-95 border rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">
                  Password strength
                </span>
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    strength.color
                      ?.replace("bg-", "text-")
                      .replace("-500", "-600") || "text-slate-500",
                  )}
                >
                  {strength.label}
                </span>
              </div>

              <div className="flex gap-1.5 h-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-500 ${
                      step <= strength.score ? strength.color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1">
                {checks.map((c) => (
                  <li
                    key={c.label}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300",
                      c.pass ? "text-slate-700" : "text-slate-400",
                    )}
                  >
                    <Check
                      className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        c.pass ? "text-emerald-500" : "text-slate-300",
                      )}
                      strokeWidth={3}
                    />
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              variant="outline"
              type="button"
              className="text-slate-600 border border-slate-300 rounded-md px-5 h-10 text-[11px] 3xl:text-xs font-semibold"
              onClick={() => {
                setForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !form.currentPassword ||
                !form.newPassword ||
                !form.confirmPassword ||
                form.newPassword !== form.confirmPassword ||
                isSamePassword
              }
              className="bg-app-primary2 hover:bg-app-primary3 text-white hover:text-white border-none font-semibold px-5 h-10 text-[11px] 3xl:text-xs rounded-md transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
              ) : null}
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        onConfirm={confirmUpdatePassword}
        title="Update Password?"
        message="Are you sure you want to update your password? You will need to use the new password on your next login."
        confirmText="Update"
        type="brand"
        loading={isSubmitting}
        success={passwordSuccess}
      />
    </Card>
  );
};

export default SecurityCredentials;
