import { useState } from "react";
import { format } from "date-fns";
import {
  IconShieldCheck,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconId,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RejectReasonDialog from "./Dialogs/RejectReasonDialog";
import { ZoomableImage } from "./zoomable.image";
import ConfirmKycActionModal from "../pages/ConfirmKycActionModal";
import { cn } from "@/lib/utils";
import dummyImg from "@/assets/web/dummyImg.webp";
import dummyID from "@/assets/web/dummyIDCard.webp";
import DashboardHead from "@/components/shared/dashboard.head";

const VerificationCard = ({
  verification,
  isVerifying,
  onApprove,
  onReject,
  userName,
}) => {
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [reasonDialogMode, setReasonDialogMode] = useState("reject");
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const currentStatus = verification?.status || "pending";

  const submittedDateStr = verification?.submittedAt
    ? `Submitted: ${format(new Date(verification.submittedAt), "dd MMMM, yyyy")}`
    : "";

  const resolvedDateLabel = currentStatus === "rejected" ? "Rejected" : "Verified";
  const resolvedDateStr = verification?.verifiedAt
    ? `${resolvedDateLabel}: ${format(new Date(verification.verifiedAt), "dd MMMM, yyyy")}`
    : "";

  const dateInfo = [submittedDateStr, resolvedDateStr].filter(Boolean).join(" • ");

  const statusStyles = {
    approved:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]",
    rejected:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]",
    pending:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]",
    not_started:
      "bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-[0_0_15px_-3px_rgba(148,163,184,0.2)]",
  };

  const handleConfirmApprove = () => {
    onApprove("approved");
    setIsApproveConfirmOpen(false);
    setInspectorOpen(false);
  };

  const isRejected = currentStatus === "rejected";
  const isApproved = currentStatus === "approved";
  const isActionDisabled =
    isVerifying || isApproved || currentStatus === "not_started";

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white">
      {/* Header Section */}
      <CardHeader className="px-5 border-b border-slate-200">
        <div className="flex items-center justify-between pb-1">
          <DashboardHead
            title="Identity Verification"
            subtitle={dateInfo}
            Icon={IconId}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />

          <Badge
            className={cn(
              "px-3 py-1 text-[10px] rounded-xl font-bold uppercase tracking-widest border border-transparent transition-all",
              statusStyles[currentStatus],
            )}
          >
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dynamic Status Feedback Note (Only for Rejected) */}
        {currentStatus === "rejected" && (
          <div className="rounded-xl p-4 border animate-in slide-in-from-top-2 duration-300 bg-rose-100/50 border-rose-300">
            <div className="flex items-center gap-2 mb-1.5">
              <IconAlertTriangle className="h-4 w-4 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">
                Rejection Protocol
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              {verification?.rejectReason ||
                "Identity document was rejected by the administration."}
            </p>
          </div>
        )}

        {/* Thumbnail Comparison Row */}
        <div className="flex items-center justify-start gap-3">
          <div className="group relative w-full h-56 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-brand-bg transition-all duration-300">
            <img
              src={verification?.docUrl || dummyID}
              alt="Document"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-3">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                Document
              </span>
            </div>
          </div>
          <div className="group relative w-full h-56 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-brand-bg transition-all duration-300">
            <img
              src={verification?.selfieUrl || dummyImg}
              alt="Selfie"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-3">
              <span className="text-[10px] font-bold text-white uppercase ">
                Selfie
              </span>
            </div>
          </div>
        </div>

        {/* --- CONSOLIDATED ACTION ROW (Exactly like Image) --- */}
        <div className={cn(
          "grid gap-3",
          isApproved ? "grid-cols-1" : (isRejected ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3")
        )}>
          <div className={cn(
            isApproved ? "col-span-1" : (isRejected ? "col-span-1" : "col-span-2 lg:col-span-1")
          )}>
            <Dialog open={inspectorOpen} onOpenChange={setInspectorOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full bg-white hover:bg-brand-aqua border border-slate-300 text-slate-600 font-bold text-sm rounded-lg hover:text-white transition-all duration-300 shadow-sm"
                >
                  Launch Inspector
                </Button>
              </DialogTrigger>

              <DialogContent className={cn(
                "max-w-5xl 3xl:max-w-[1280px] w-full flex flex-col p-0 bg-white overflow-hidden rounded-xl border-none shadow-xl",
                isApproved ? "h-[75vh] 3xl:h-[68vh] gap-4" : "gap-6 h-[90vh] 3xl:h-[80vh]"
              )}>
                {/* --- MODAL HEADER --- */}
                <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                  <DashboardHead
                    title="Visual Identity Inspector"
                    titleSizeClass="text-[18px]"
                    iconSizeClass="w-12 h-12 rounded-xl shadow-lg shadow-brand-aqua/10"
                    iconInnerClass="h-6 w-6"
                    subtitle={
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-400">
                          Reviewing:
                        </span>
                        <span className="text-xs font-semibold text-brand-aqua">
                          {userName || "Unknown User"}
                        </span>
                      </div>
                    }
                    Icon={IconShieldCheck}
                    iconColor="text-brand-aqua"
                    iconBg="bg-brand-aqua/10"
                  />
                  {/* <button
                    onClick={() => setInspectorOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <IconX size={20} strokeWidth={2.5} />
                  </button> */}
                </div>

                {/* --- MODAL BODY --- */}
                <div className="flex-1 overflow-y-auto px-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                    <ZoomableImage
                      src={verification?.docUrl || dummyID}
                      label="ID Document"
                      alt="Identity Document"
                      className="h-full"
                      userName={userName}
                    />
                    <ZoomableImage
                      src={verification?.selfieUrl || dummyImg}
                      label="User Selfie"
                      alt="User Selfie"
                      className="h-full"
                      userName={userName}
                    />
                  </div>
                </div>

                {!isApproved && (
                  <div className="px-8 py-6 bg-white border-t border-slate-300 flex gap-4 shrink-0">
                    {!isRejected && (
                      <Button
                        variant="ghost"
                        className="flex-1 h-12 3xl:h-14 bg-alerts-error hover:bg-alerts-error_dark text-white hover:text-white font-bold uppercase tracking-[0.1em] text-[13px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-95 disabled:cursor-not-allowed"
                        onClick={() => {
                          setReasonDialogMode("reject");
                          setReasonDialogOpen(true);
                        }}
                        disabled={isActionDisabled || isRejected}
                      >
                        <IconX className="w-4 h-4" strokeWidth={3} />
                        Reject Documentation
                      </Button>
                    )}
                    <Button
                      className="flex-1 h-12 3xl:h-14  bg-alerts-success hover:bg-alerts-success_dark text-white hover:text-white font-bold uppercase tracking-[0.1em] text-[13px] rounded-lg shadow-sm border-none transition-all flex items-center justify-center gap-3 disabled:opacity-95 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (isRejected) {
                          setReasonDialogMode("re-approve");
                          setReasonDialogOpen(true);
                        } else {
                          setIsApproveConfirmOpen(true);
                        }
                      }}
                      disabled={isActionDisabled}
                    >
                      <IconCheck className="w-4 h-4" strokeWidth={3} />
                      {isRejected ? "Re-approve Identity" : "Approve Identity"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {!isApproved && (
            <>
              {!isRejected && (
                <Button
                  className="h-11 bg-alerts-error hover:bg-alerts-error_dark text-white hover:text-white border-none font-bold text-sm rounded-lg transition-all shadow-sm disabled:opacity-95 disabled:cursor-not-allowed"
                  onClick={() => {
                    setReasonDialogMode("reject");
                    setReasonDialogOpen(true);
                  }}
                  disabled={isActionDisabled || isRejected}
                >
                  Reject
                </Button>
              )}

              <Button
                className="h-11 bg-alerts-success hover:bg-alerts-success_dark text-white hover:text-white border-none font-bold text-sm rounded-lg transition-all shadow-sm disabled:opacity-95 disabled:cursor-not-allowed"
                onClick={() => {
                  if (isRejected) {
                    setReasonDialogMode("re-approve");
                    setReasonDialogOpen(true);
                  } else {
                    setIsApproveConfirmOpen(true);
                  }
                }}
                disabled={isActionDisabled}
              >
                {isRejected ? "Re-approve" : "Approve"}
              </Button>
            </>
          )}
        </div>
      </CardContent>

      <ConfirmKycActionModal
        open={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={handleConfirmApprove}
        type="approve"
        loading={isVerifying}
      />

      <RejectReasonDialog
        isOpen={reasonDialogOpen}
        onClose={() => setReasonDialogOpen(false)}
        onConfirm={(reason) => {
          if (reasonDialogMode === "re-approve") {
            onApprove("approved", reason);
          } else {
            onReject(reason, "rejected");
          }
          setReasonDialogOpen(false);
          setInspectorOpen(false);
        }}
        mode={reasonDialogMode}
        isLoading={isVerifying}
        userName={userName}
      />
    </Card>
  );
};

export default VerificationCard;
