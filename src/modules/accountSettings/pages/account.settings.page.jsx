import React, { useState } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Settings } from "lucide-react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container>
      <div className="space-y-8">
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
        <div className="bg-white rounded-md shadow-sm border border-slate-300/60 p-6 sm:p-8">
          {/* TABS */}
          <div className="flex flex-wrap items-center gap-6 border-b border-slate-300/60 mb-8">
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    Old Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter old password"
                      className="pr-10 h-10 text-sm font-normal border-slate-300/60"
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
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-10 h-10 text-sm font-normal border-slate-300/60"
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
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter confirm password"
                      className="pr-10 h-10 text-sm font-normal border-slate-300/60"
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
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="px-8 font-bold text-xs h-10"
                  >
                    Clear
                  </Button>
                  <Button className="bg-app-primary2 hover:bg-app-primary3 text-white px-8 font-bold text-xs h-10 rounded-md transition-all active:scale-[0.99]">
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "email" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">
                    New Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter new email address"
                    className="h-10 text-sm font-normal border-slate-300/60"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="px-8 font-bold text-xs h-10"
                  >
                    Clear
                  </Button>
                  <Button className="bg-app-primary2 hover:bg-app-primary3 text-white px-8 font-bold text-xs h-10 rounded-md transition-all active:scale-[0.99]">
                    Update Email
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
