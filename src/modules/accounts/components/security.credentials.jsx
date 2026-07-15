import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { AlertCircle, Badge, Check, Loader2, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { Label } from "recharts";
import { changePassword } from "../store/account.slice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";

const SecurityCredentials = ({ account, loading, passwordSuccess }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return;

    try {
      const result = await dispatch(
        changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      ).unwrap();
      toast.success(result.message || "Success", {
        description: result.description,
      });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err || "Failed to update password");
    }
  };

  // 1. ADD THIS: Toggle function for passwords
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 2. Helper for the eye icon button (Updated with correct component name)
  const EyeToggle = ({ isVisible, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
    >
      {isVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
    </button>
  );

  const checks = [
    { label: "Min. 8 characters", pass: form.newPassword.length > 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(form.newPassword) },
    { label: "Number", pass: /[0-9]/.test(form.newPassword) },
    { label: "Special symbol", pass: /[^A-Za-z0-9]/.test(form.newPassword) },
  ];

  return (
    <Card className="mx-auto border-none gap-4 shadow-none bg-transparent overflow-hidden font-jakarta w-full">
      <CardHeader className="p-0">
        {/* <div className="flex items-center gap-5">
          <div className="p-4 bg-brand-blue rounded-2xl text-brand-blue ring-4 ring-brand-blue">
            <IconLock size={32} stroke={2.5} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
              Security Credentials
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium text-sm"></CardDescription>
          </div>
        </div> */}

        <div className="pb-4 px-5 border-b border-slate-200">
          <DashboardHead
            title="Security Credentials"
            subtitle="Keep your admin account safe with a strong password."
            Icon={IconLock}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-10 space-y-6">
        <form onSubmit={onSubmit} className="grid gap-6">
          {/* Current Password - Full Width */}
          <div className="space-y-3 group">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Current Password
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                className="h-12 border-slate-200 placeholder:text-slate-400 bg-slate-50/30 pr-12 rounded-lg text-base focus-visible:border-slate-500 transition-[background-color,border-color] duration-300"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
              />
              <EyeToggle
                isVisible={showPasswords.current}
                onToggle={() => toggleVisibility("current")}
              />
            </div>
          </div>

          {/* New Passwords Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 group">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  className="h-12 border-slate-200 placeholder:text-slate-400 bg-slate-50 pr-12 rounded-lg text-base focus-visible:border-slate-500 transition-[background-color,border-color] duration-300"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="Create new password"
                />
                <EyeToggle
                  isVisible={showPasswords.new}
                  onToggle={() => toggleVisibility("new")}
                />
              </div>
            </div>

            <div className="space-y-3 group">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  className={cn(
                    "h-12 rounded-lg pr-12 text-base transition-all border-slate-200 bg-slate-50 duration-300 focus-visible:outline-none",
                    passwordsMatch && form.confirmPassword
                      ? "border-slate-500 focus-visible:border-slate-500"
                      : passwordsMismatch
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                        : "border-slate-200 focus-visible:border-slate-500",
                  )}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat new password"
                />
                <EyeToggle
                  isVisible={showPasswords.confirm}
                  onToggle={() => toggleVisibility("confirm")}
                />
              </div>
              {passwordsMismatch && (
                <p className="text-[11px] text-red-600 font-bold flex items-center gap-1.5 mt-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </p>
              )}
            </div>
          </div>

          {/* Password Strength Section */}
          {form.newPassword && (
            <div className="p-5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Security Strength
                </span>
                <Badge
                  className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    strength.color
                      ?.replace("bg-", "text-")
                      .replace("-500", "-700"),
                    strength.color?.replace("bg-", "bg-") + "/10",
                  )}
                >
                  {strength.label}
                </Badge>
              </div>

              <div className="flex gap-2 h-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-700 ${
                      step <= strength.score ? strength.color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                {checks.map((c) => (
                  <li
                    key={c.label}
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-bold transition-all",
                      c.pass ? "text-emerald-600" : "text-slate-400",
                    )}
                  >
                    <div
                      className={cn(
                        "p-0.5 rounded-full",
                        c.pass ? "bg-emerald-100" : "bg-slate-100",
                      )}
                    >
                      <Check className="w-2.5 h-2.5" strokeWidth={4} />
                    </div>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              loading ||
              form.newPassword !== form.confirmPassword ||
              !form.newPassword
            }
            className="h-11 w-full bg-brand-blue hover:bg-brand-hoverAqua disabled:opacity-50 disabled:hover:bg-brand-hoverBlue text-white font-semibold text-[13px] capitalize tracking-wide rounded-lg shadow-md shadow-brand-blue transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Securing Account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} strokeWidth={2.5} />
                <span>Update Credentials</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurityCredentials;
