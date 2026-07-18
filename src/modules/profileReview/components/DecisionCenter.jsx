import React, { useState } from "react";
import { CheckCircle2, Ban, Clock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";
import ConfirmModal from "@/components/common/ConfirmModal";
import { BulkReplyList } from "./BulkReplyList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REASON_CONFIGS } from "@/constants/reason.config";

/*========== Decision Center component for the left column bottom ========*/
export const DecisionCenter = ({
  p,
  formData,
  onUpdate,
  onSubmit,
  isSubmitting,
  success,
  isConfirmOpen,
  setIsConfirmOpen,
}) => {
  const allReportsResolved = p?.reports?.every((r) => r.status === "resolved");
  const [selectedDropdownReason, setSelectedDropdownReason] = useState("");
  const [durationType, setDurationType] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);

  const currentStatus = p?.accountStatus || p?.status || p?.account?.status;
  const isBanned = currentStatus === "banned";
  const isSuspended = currentStatus === "suspended";

  const ACTION_CONFIG = {
    resolve: { label: "Dismiss Reports", type: "brand" },
    warn: { label: "Issue Warning", type: "warning" },
    suspend: { label: "Suspend Account", type: "warning" },
    ban: { label: "Ban Permanently", type: "danger" },
    reply: { label: "Reply to Reporter", type: "brand" },
  };

  if (allReportsResolved) {
    return (
      <Card className="w-full rounded-xl border-slate-300/60 shadow-sm bg-white py-8 overflow-hidden">
        <CardContent className="px-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Investigation Resolved
          </h3>
          <p className="text-sm font-medium text-muted-foreground/80 mt-2 max-w-md">
            This profile has been reviewed and all flags have been resolved. The
            account status is currently synced with the platform's safety
            guidelines.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden">
        <CardHeader className="px-8">
          <div className="w-full flex items-center justify-between gap-2 pb-4 border-b border-slate-300/60">
            <DashboardHead
              Icon={ShieldCheck}
              title="Decision Center"
              subtitle="Select an action to execute on this profile based on your investigation."
              iconColor="text-slate-600"
              iconBg="bg-slate-100"
            />
          </div>
        </CardHeader>
        <CardContent className="px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsConfirmOpen(true);
            }}
            className="space-y-6"
          >
            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  id: "resolve",
                  label: "Dismiss Reports",
                  sub: "No violation found.",
                  icon: CheckCircle2,
                  color: "emerald",
                  bg: "bg-emerald-50",
                  border: "border-emerald-200",
                  text: "text-emerald-600",
                  activeBorder: "border-emerald-400",
                  activeBg: "bg-emerald-100",
                  hoverBg: "hover:bg-emerald-100",
                },
                {
                  id: "reply",
                  label: "Reply to Report",
                  sub: "Communicate with reporter.",
                  icon: ShieldCheck,
                  color: "blue",
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  text: "text-blue-600",
                  activeBorder: "border-blue-400",
                  activeBg: "bg-blue-100",
                  hoverBg: "hover:bg-blue-100",
                },
                {
                  id: "suspend",
                  label: "Suspend Account",
                  sub: "Disable temporarily.",
                  icon: Clock,
                  color: "orange",
                  bg: "bg-orange-50",
                  border: "border-orange-200",
                  text: "text-orange-600",
                  activeBorder: "border-orange-400",
                  activeBg: "bg-orange-100",
                  hoverBg: "hover:bg-orange-100",
                },
                {
                  id: "ban",
                  label: "Ban Permanently",
                  sub: "Block from platform.",
                  icon: Ban,
                  color: "red",
                  bg: "bg-red-50",
                  border: "border-red-200",
                  text: "text-red-600",
                  activeBorder: "border-red-400",
                  activeBg: "bg-red-100",
                  hoverBg: "hover:bg-red-100",
                },
              ].map((opt) => {
                const isSelected = formData.action === opt.id;
                const isDisabled =
                  (isBanned && (opt.id === "ban" || opt.id === "suspend")) ||
                  (isSuspended && opt.id === "suspend");

                return (
                  <Button
                    key={opt.id}
                    type="button"
                    variant="outline"
                    disabled={isDisabled}
                    onClick={() => {
                      if (formData.action === opt.id) {
                        // Deselect if already selected
                        onUpdate("action", "");
                        setSelectedDropdownReason("");
                        onUpdate("reason", "");
                      } else {
                        // Select new action
                        setSelectedDropdownReason("");
                        onUpdate("reason", "");
                        onUpdate("action", opt.id);
                        if (opt.id === "suspend") {
                          setDurationType("24");
                          onUpdate("suspendDuration", 24);
                        }
                      }
                    }}
                    className={cn(
                      "flex flex-col items-start gap-2 px-4 py-12 rounded-xl border transition-all text-left",
                      isSelected
                        ? `${opt?.activeBg} ${opt?.activeBorder}`
                        : `${opt?.bg} ${opt?.border} ${opt?.hoverBg} opacity-90 hover:opacity-100`,
                      isDisabled &&
                        "opacity-50 cursor-not-allowed hover:opacity-50 grayscale",
                    )}
                  >
                    <opt.icon className={cn("w-5 h-5", opt.text)} />
                    <div className="space-y-0.5">
                      <p
                        className={cn(
                          "text-xs font-bold capitalize tracking-tight",
                          opt.text,
                        )}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                        {opt.sub}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
            {/* Dynamic Fields */}
            <div className="space-y-4">
              {/* Reason Dropdown (for Suspend/Ban) */}
              {(formData.action === "suspend" || formData.action === "ban") && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedDropdownReason}
                    onValueChange={(val) => {
                      setSelectedDropdownReason(val);
                      if (val !== "Other") {
                        onUpdate("reason", val);
                      } else {
                        onUpdate("reason", ""); // Reset custom reason
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 w-full bg-slate-50 border-slate-300/60 rounded-lg">
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-300/60">
                      {REASON_CONFIGS[
                        formData.action === "suspend" ? "suspended" : "banned"
                      ]?.map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="text-xs font-medium py-2.5"
                        >
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Notes Field / Custom Reason */}
              {(formData.action === "resolve" ||
                (["suspend", "ban"].includes(formData.action) &&
                  selectedDropdownReason === "Other")) && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    {selectedDropdownReason === "Other"
                      ? "Custom Detailed Reason"
                      : formData.action === "resolve"
                        ? "Admin Notes (Required)"
                        : "Admin Notes (Optional)"}
                    {(selectedDropdownReason === "Other" ||
                      formData.action === "resolve") && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Textarea
                    placeholder="Add context or internal notes for this decision..."
                    value={formData.reason}
                    onChange={(e) => onUpdate("reason", e.target.value)}
                    className={cn(
                      "min-h-[100px] rounded-lg bg-slate-50 text-sm font-medium focus:ring-slate-200 resize-none border",
                      (formData.reason || "").length > 500
                        ? "border-red-400 focus-visible:border-red-500"
                        : "border-slate-300/60 focus-visible:border-slate-500",
                    )}
                  />
                  <div className="flex justify-between items-center">
                    {(formData.reason || "").length > 500 && (
                      <span className="text-[10px] font-semibold text-red-500 animate-in fade-in duration-200">
                        Maximum 500 characters allowed
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-semibold transition-colors ml-auto",
                        (formData.reason || "").length > 500
                          ? "text-red-500"
                          : (formData.reason || "").length > 450
                            ? "text-amber-500"
                            : "text-slate-400",
                      )}
                    >
                      {(formData.reason || "").length} / 500
                    </span>
                  </div>
                </div>
              )}

              {/* Reply Specific Fields */}
              {formData.action === "reply" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold capitalize tracking-wider text-blue-600">
                        Bulk Reply Mode
                      </Label>
                      <p className="text-[10px] font-semibold text-blue-500/80">
                        Respond to all pending reports individually in one go.
                      </p>
                    </div>
                    <Switch
                      checked={isBulkMode}
                      onCheckedChange={(val) => {
                        setIsBulkMode(val);
                        onUpdate("isBulkMode", val);
                        if (val) onUpdate("selectedReportId", "");
                      }}
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-200"
                    />
                  </div>

                  {!isBulkMode ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                        Target Report <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.selectedReportId}
                        onValueChange={(val) =>
                          onUpdate("selectedReportId", val)
                        }
                      >
                        <SelectTrigger className="h-11 w-full bg-slate-50 border-slate-300/60 rounded-lg">
                          <SelectValue placeholder="Select report to reply to..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-300/60">
                          {p?.reports
                            ?.filter((r) => r.status !== "resolved")
                            .map((r) => (
                              <SelectItem
                                key={r._id || r.id}
                                value={r._id || r.id}
                                className="text-xs font-medium py-2.5"
                              >
                                Report by {r.reportedBy?.nickname || "User"} -{" "}
                                {r.reason}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <BulkReplyList
                      reports={p?.reports?.filter(
                        (r) => r.status !== "resolved",
                      )}
                    />
                  )}

                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      {isBulkMode ? "Bulk Reply Message" : "Reply Message"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder={
                        isBulkMode
                          ? "Write your unified response to send to ALL targeted reporters..."
                          : "Write your message to the reporter..."
                      }
                      value={formData.replyMessage}
                      onChange={(e) => onUpdate("replyMessage", e.target.value)}
                      className="min-h-[100px] rounded-lg bg-slate-50 border-slate-300/60 text-sm font-medium focus:ring-slate-200 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Suspend Duration */}
              {formData.action === "suspend" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={durationType}
                      onValueChange={(val) => {
                        setDurationType(val);
                        if (val !== "custom") {
                          onUpdate("suspendDuration", val);
                        } else {
                          onUpdate("suspendDuration", "");
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 w-full bg-slate-50 border-slate-300/60 rounded-lg">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-300/60">
                        <SelectItem
                          value="12"
                          className="text-xs font-medium py-2.5"
                        >
                          12 Hours
                        </SelectItem>
                        <SelectItem
                          value="24"
                          className="text-xs font-medium py-2.5"
                        >
                          24 Hours (1 Day)
                        </SelectItem>
                        <SelectItem
                          value="48"
                          className="text-xs font-medium py-2.5"
                        >
                          48 Hours (2 Days)
                        </SelectItem>
                        <SelectItem
                          value="72"
                          className="text-xs font-medium py-2.5"
                        >
                          72 Hours (3 Days)
                        </SelectItem>
                        <SelectItem
                          value="custom"
                          className="text-xs font-medium py-2.5"
                        >
                          Custom Hours
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {durationType === "custom" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                          Enter Custom Hours{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {formData.suspendDuration > 168 && (
                          <span className="text-[10px] font-bold text-red-500">
                            Max 168 hrs (7 days)
                          </span>
                        )}
                        {formData.suspendDuration !== "" &&
                          Number(formData.suspendDuration) < 1 && (
                            <span className="text-[10px] font-bold text-red-500">
                              Min 1 hour
                            </span>
                          )}
                      </div>
                      <Input
                        type="number"
                        min={1}
                        max={168}
                        placeholder="e.g. 36"
                        value={formData.suspendDuration}
                        onChange={(e) =>
                          onUpdate("suspendDuration", e.target.value)
                        }
                        className={cn(
                          "h-11 rounded-lg bg-slate-50 border-slate-300/60",
                          (formData.suspendDuration > 168 ||
                            (formData.suspendDuration !== "" &&
                              Number(formData.suspendDuration) < 1)) &&
                            "border-red-500 focus-visible:ring-red-500",
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="px-6 h-10 rounded-md text-muted-foreground/60 border-slate-300/60 font-bold text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => onUpdate("action", "")}
                disabled={!formData.action || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.action ||
                  (["suspend", "ban", "resolve"].includes(formData.action) &&
                    (!formData.reason ||
                      (formData.reason || "").length > 500)) ||
                  (formData.action === "suspend" &&
                    (!formData.suspendDuration ||
                      formData.suspendDuration > 168 ||
                      Number(formData.suspendDuration) < 1)) ||
                  (formData.action === "reply" &&
                    !formData.isBulkMode &&
                    (!formData.replyMessage || !formData.selectedReportId)) ||
                  (formData.action === "reply" &&
                    formData.isBulkMode &&
                    !formData.replyMessage)
                }
                className={cn(
                  "px-6 h-10 rounded-md font-bold text-xs uppercase tracking-widest text-white transition-all shadow-sm disabled:opacity-95 disabled:cursor-not-allowed",
                  ["suspend", "ban", "resolve"].includes(formData.action) &&
                    (formData.reason || "").length > 500
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300/60 hover:bg-slate-200 hover:text-slate-400"
                    : "bg-app-primary2 hover:bg-brand-hoverAqua",
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Execute Decision"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirm Decision Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          if (isSubmitting || success) return;
          setIsConfirmOpen(false);
        }}
        onConfirm={onSubmit}
        title={ACTION_CONFIG[formData.action]?.label || "Confirm Action"}
        message={`Are you sure you want to "${
          ACTION_CONFIG[formData.action]?.label || formData.action
        }" this profile?${
          formData.reason ? ` Notes: "${formData.reason}"` : ""
        }${
          formData.action === "suspend"
            ? ` Duration: ${formData.suspendDuration || 0} hours.`
            : ""
        }`}
        confirmText="Execute"
        type={ACTION_CONFIG[formData.action]?.type || "brand"}
        loading={isSubmitting}
        success={success}
      />
    </>
  );
};
