import React, { useState } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Settings, Loader2 } from "lucide-react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  updateEmail,
  verifyEmailOtp,
} from "../store/account.settings.slice";

const AccountSettingsPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.accountSettings);

  const [activeTab, setActiveTab] = useState("password");

  // Password state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Email state
  const [emailForm, setEmailForm] = useState({
    email: "",
    otp: "",
  });
  const [emailErrors, setEmailErrors] = useState({});
  const [showOtpField, setShowOtpField] = useState(false);

  const handlePasswordSubmit = async () => {
    let errors = {};
    if (!passwordForm.old_password)
      errors.old_password = "Old password is required";
    if (!passwordForm.new_password)
      errors.new_password = "New password is required";
    if (!passwordForm.confirm_password)
      errors.confirm_password = "Confirm password is required";
    else if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await dispatch(
        changePassword({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }),
      ).unwrap();

      toast.success(res?.message || "Password updated successfully!");
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error(error?.message || "Failed to update password.");
    }
  };

  const handleEmailSubmit = async () => {
    let errors = {};
    if (!emailForm.email) errors.email = "Email address is required";

    setEmailErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await dispatch(
        updateEmail({ email: emailForm.email }),
      ).unwrap();

      toast.success(res?.message || "OTP has been sent to your email.");
      setShowOtpField(true);
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async () => {
    let errors = {};
    if (!emailForm.otp) errors.otp = "OTP is required";
    else if (emailForm.otp.length !== 6) errors.otp = "OTP must be 6 digits";

    setEmailErrors((prev) => ({ ...prev, ...errors }));
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await dispatch(
        verifyEmailOtp({
          email: emailForm.email,
          otp: emailForm.otp,
        }),
      ).unwrap();

      toast.success(
        res?.message || "Email updated successfully. Please log in again.",
      );
      setShowOtpField(false);
      setEmailForm({ email: "", otp: "" });
      setEmailErrors({});
    } catch (error) {
      toast.error(error?.message || "Failed to verify OTP.");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Account Settings"
              icon={<Settings className="w-6 h-6 text-white shrink-0" />}
              variant="primary"
              subheading="Manage your personal account settings and preferences."
            />
          </div>
        </Header>

        {/* Content Card */}
        <div className="bg-white rounded-md shadow-sm border border-slate-300/60 p-6">
          {/* TABS */}
          <div className="flex flex-wrap items-center gap-6 border-b border-slate-300/60 mb-6">
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "password"
                  ? "text-app-primary2 border-b-2 border-app-primary2"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "email"
                  ? "text-app-primary2 border-b-2 border-app-primary2"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Change Email
            </button>
          </div>

          {/* Forms */}
          <div className="max-w-2xl">
            {activeTab === "password" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    Old Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter old password"
                      value={passwordForm.old_password}
                      onChange={(e) => {
                        setPasswordForm({
                          ...passwordForm,
                          old_password: e.target.value,
                        });
                        if (passwordErrors.old_password)
                          setPasswordErrors({
                            ...passwordErrors,
                            old_password: null,
                          });
                      }}
                      className={`pr-10 h-10 text-sm font-normal ${passwordErrors.old_password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300/60"}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.old_password && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {passwordErrors.old_password}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordForm.new_password}
                      onChange={(e) => {
                        setPasswordForm({
                          ...passwordForm,
                          new_password: e.target.value,
                        });
                        if (passwordErrors.new_password)
                          setPasswordErrors({
                            ...passwordErrors,
                            new_password: null,
                          });
                      }}
                      className={`pr-10 h-10 text-sm font-normal ${passwordErrors.new_password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300/60"}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {passwordErrors.new_password}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter confirm password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => {
                        setPasswordForm({
                          ...passwordForm,
                          confirm_password: e.target.value,
                        });
                        if (passwordErrors.confirm_password)
                          setPasswordErrors({
                            ...passwordErrors,
                            confirm_password: null,
                          });
                      }}
                      className={`pr-10 h-10 text-sm font-normal ${passwordErrors.confirm_password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300/60"}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {passwordErrors.confirm_password}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="text-slate-600 border border-slate-300 rounded-md px-5 h-10 text-[11px] 3xl:text-xs font-semibold"
                    onClick={() => {
                      setPasswordForm({
                        old_password: "",
                        new_password: "",
                        confirm_password: "",
                      });
                      setPasswordErrors({});
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    className="bg-app-primary2 hover:bg-app-primary3 text-white hover:text-white border-none font-semibold px-5 h-10 text-[11px] 3xl:text-xs rounded-md transition-all active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    ) : null}
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "email" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    New Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter new email address"
                    value={emailForm.email}
                    onChange={(e) => {
                      setEmailForm({ ...emailForm, email: e.target.value });
                      if (emailErrors.email)
                        setEmailErrors({ ...emailErrors, email: null });
                    }}
                    disabled={showOtpField}
                    className={`h-10 text-sm font-normal ${emailErrors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300/60"}`}
                  />
                  {emailErrors.email && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {emailErrors.email}
                    </span>
                  )}
                </div>

                {showOtpField && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800">
                      Enter OTP
                    </Label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={emailForm.otp}
                      onChange={(e) => {
                        setEmailForm({ ...emailForm, otp: e.target.value });
                        if (emailErrors.otp)
                          setEmailErrors({ ...emailErrors, otp: null });
                      }}
                      className={`h-10 text-sm font-normal ${emailErrors.otp ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300/60"}`}
                    />
                    {emailErrors.otp && (
                      <span className="text-red-500 text-[11px] mt-1 block">
                        {emailErrors.otp}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="text-slate-600 border border-slate-300 rounded-md px-5 h-10 text-[11px] 3xl:text-xs font-semibold"
                    onClick={() => {
                      setEmailForm({ email: "", otp: "" });
                      setEmailErrors({});
                      setShowOtpField(false);
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant="outline"
                    onClick={showOtpField ? handleOtpSubmit : handleEmailSubmit}
                    disabled={loading}
                    className="bg-app-primary2 hover:bg-app-primary3 text-white border-none hover:text-white rounded-md px-5 h-10 text-[11px] 3xl:text-xs font-semibold transition-all active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    ) : null}
                    {showOtpField ? "Verify OTP" : "Update Email"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountSettingsPage;
