import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircle2,
  Ban,
  Clock,
  Loader2,
  ShieldAlert,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import dummyImg from "@/assets/web/dummyImg.webp";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  bannedUserProfile,
  unbanUserProfile,
  unsuspendUserProfile,
} from "../../users/store/user.slice";
import { BanUserModal } from "../../users/components/ban-user-modal";
import { LiftRestrictionDialog } from "../../users/components/Dialogs/lift.restriction.dialog";
import { toast } from "sonner";
import { LuUserRound } from "react-icons/lu";

// Safe Date Formatting Helper to prevent app crashes on invalid Date objects
const safeFormatDate = (dateValue, formatStr) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "—" : format(date, formatStr);
};

/** Sidebar component for the right column */
export const ReviewSidebar = ({ p, onStatusChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmBanOpen, setIsConfirmBanOpen] = useState(false);
  const [isUnbanConfirmOpen, setIsUnbanConfirmOpen] = useState(false);
  const [isUnsuspendDialogOpen, setIsUnsuspendDialogOpen] = useState(false);
  const [isUnsuspendFinalConfirmOpen, setIsUnsuspendFinalConfirmOpen] =
    useState(false);
  const [unsuspendData, setUnsuspendData] = useState({
    category: "",
    reason: "",
  });
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [isUnsuspending, setIsUnsuspending] = useState(false);
  const [unsuspendSuccess, setUnsuspendSuccess] = useState(false);

  // Determine initial banned status from props
  const initialIsBanned =
    p?.accountStatus === "banned" ||
    p?.status === "banned" ||
    p?.account?.status === "banned";
  const [localIsBanned, setLocalIsBanned] = useState(initialIsBanned);

  const initialIsSuspended =
    p?.accountStatus === "suspended" ||
    p?.status === "suspended" ||
    p?.account?.status === "suspended";
  const [localIsSuspended, setLocalIsSuspended] = useState(initialIsSuspended);

  // Sync local state if the parent data updates
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLocalIsBanned(initialIsBanned);
    setLocalIsSuspended(initialIsSuspended);
  }, [initialIsBanned, initialIsSuspended]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const pendingCount =
    p?.reports?.filter((r) => r.status !== "resolved").length || 0;

  const mostCommonReason = p?.mostCommonReason || "—";
  const uniqueReporters = p?.uniqueReporters || 0;
  const riskLevel =
    p?.reportCount >= 5 ? "High" : p?.reportCount >= 2 ? "Medium" : "Low";

  const nickname = p?.profile?.nickname || "User";

  // Bugfix: Handle when photos is an array of objects or strings, or single string
  const userPhoto =
    (Array.isArray(p?.profile?.photos)
      ? p?.profile?.photos[0]?.url || p?.profile?.photos[0]
      : p?.profile?.photos) || dummyImg;

  const lastActivity = p?.reports?.[0]?.createdAt;
  const memberSince = p?.profile?.createdAt;

  // Check if user is banned (using local state for immediate UI updates)
  const isBanned = localIsBanned;

  const handleImmediateBan = async (reason) => {
    try {
      const res = await dispatch(
        bannedUserProfile({
          userId: p?.userId,
          category: "Administrative",
          reason: reason || "Immediate ban from Profile Review investigation",
        }),
      ).unwrap();
      if (res) {
        toast.success("User banned successfully");
        setLocalIsBanned(true);
        onStatusChange?.();
      }
    } catch (error) {
      toast.error(error || "Failed to ban user");
      throw error;
    }
  };

  const handleUnsuspendClick = (category, reason) => {
    setUnsuspendData({ category, reason });
    setIsUnsuspendDialogOpen(false);
    setIsUnsuspendFinalConfirmOpen(true);
  };

  const handleFinalUnsuspend = async () => {
    setIsUnsuspending(true);
    setUnsuspendSuccess(false);
    try {
      const res = await dispatch(
        unsuspendUserProfile({
          userId: p?.userId,
          category: unsuspendData.category || "Administrative",
          reason:
            unsuspendData.reason || "Suspension lifted from Profile Review",
        }),
      ).unwrap();
      if (res) {
        toast.success("User suspension lifted");
        setLocalIsSuspended(false);
        setUnsuspendSuccess(true);
        setIsUnsuspending(false);
        setTimeout(() => {
          setIsUnsuspendFinalConfirmOpen(false);
          setUnsuspendSuccess(false);
          onStatusChange?.();
        }, 1500);
      }
    } catch (error) {
      setIsUnsuspending(false);
      setUnsuspendSuccess(false);
      toast.error(error || "Failed to unsuspend user");
    }
  };

  const handleUnban = async (category, reason) => {
    setIsUnbanning(true);
    try {
      const res = await dispatch(
        unbanUserProfile({
          userId: p?.userId,
          category: category || "Administrative",
          reason: reason || "Unbanned from Profile Review",
        }),
      ).unwrap();
      if (res) {
        toast.success("User unbanned successfully");
        setLocalIsBanned(false);
        onStatusChange?.();
        return res;
      }
    } catch (error) {
      toast.error(error || "Failed to unban user");
      throw error;
    } finally {
      setIsUnbanning(false);
    }
  };

  return (
    <>
      <div className="space-y-4 w-full lg:h-full">
        {/* 1. User Identity Card */}
        <Card className="w-full py-4 rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden">
          <CardContent className="px-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                <Avatar className="h-[70px] w-[70px] rounded-full border-2 border-white shadow-sm">
                  <AvatarImage
                    src={userPhoto}
                    alt={nickname}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-black text-2xl">
                    {nickname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h3 className="text-lg font-bold capitalize text-foreground/80 leading-none mb-4">
                {nickname}
              </h3>

              <div
                className={cn(
                  "w-full border rounded-md px-4 py-2 flex items-center justify-center gap-2 mb-4",
                  p?.accountStatus === "banned"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : p?.accountStatus === "suspended"
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : pendingCount === 0
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-amber-50 border-amber-200 text-amber-700",
                )}
              >
                {p?.accountStatus === "banned" ? (
                  <Ban className="w-4 h-4" />
                ) : p?.accountStatus === "suspended" ? (
                  <Clock className="w-4 h-4" />
                ) : pendingCount === 0 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {p?.accountStatus === "banned"
                    ? "PERMANENTLY BANNED"
                    : p?.accountStatus === "suspended"
                      ? "ACCOUNT SUSPENDED"
                      : pendingCount === 0
                        ? "RESOLVED"
                        : "UNDER REVIEW"}
                </span>
              </div>

              {/* Status Details (If Banned/Suspended) */}
              {(p?.banDetails?.isBanned ||
                p?.suspensionDetails?.isSuspended) && (
                <div className="w-full mb-6 p-3.5 bg-slate-50 border border-slate-300/60 rounded-xl space-y-2.5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" />
                    Restriction Details
                  </h4>
                  <div className="space-y-1.5 w-full">
                    <div className="flex flex-col items-start justify-start gap-1 text-[11px] font-medium text-slate-500 w-full break-words whitespace-pre-wrap">
                      <span className="font-bold text-slate-700">Reason</span>
                      <span
                        className="text-start"
                        title={
                          p?.banDetails?.reason ||
                          p?.suspensionDetails?.reason ||
                          "No reason specified"
                        }
                      >
                        {p?.banDetails?.reason ||
                          p?.suspensionDetails?.reason ||
                          "No reason specified"}
                      </span>
                    </div>
                    {p?.suspensionDetails?.isSuspended &&
                      p?.suspensionDetails?.endsAt && (
                        <p className="text-[11px] font-bold text-orange-600 flex items-center gap-1.5 pt-1">
                          <Clock className="w-3 h-3" />
                          Ends:{" "}
                          {safeFormatDate(
                            p.suspensionDetails.endsAt,
                            "dd MMM, hh:mm aa",
                          )}
                        </p>
                      )}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-300/60 w-full mb-3" />

              <div className="w-full space-y-3 text-left">
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-muted-foreground/80">
                    Total Reports
                  </p>
                  <p className="text-xs font-semibold text-red-500">
                    {p?.reportCount || 0} reports
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-muted-foreground/80">
                    Pending
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {pendingCount} awaiting review
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-muted-foreground/80">
                    Last Activity
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {safeFormatDate(lastActivity, "dd MMM, yyyy")}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-muted-foreground/80">
                    Member Since
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {safeFormatDate(memberSince, "dd MMM, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-4">
          {/* 2. Report Breakdown */}
          <Card className="w-full rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden">
            <CardContent className="px-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                    REPORT BREAKDOWN
                  </h3>
                  <div className="border-t border-slate-300/60" />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <p className="text-[13px] font-medium text-muted-foreground/80">
                      Most Common Reason
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {mostCommonReason.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-medium text-muted-foreground/80">
                      Unique Reporters
                    </p>
                    <p className="text-xs font-semibold text-slate-900">
                      {uniqueReporters} different users
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-medium text-muted-foreground/80">
                      Risk Level
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldAlert
                        className={cn(
                          "w-4 h-4",
                          riskLevel === "High"
                            ? "text-red-500"
                            : "text-amber-500",
                        )}
                      />
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          riskLevel === "High"
                            ? "text-red-500"
                            : "text-amber-500",
                        )}
                      >
                        {riskLevel} —{" "}
                        {riskLevel === "High"
                          ? "Escalation recommended"
                          : "Standard monitoring"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Quick Actions */}
          <Card className="w-full rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden">
            <CardContent className="px-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                    QUICK ACTIONS
                  </h3>
                  <div className="border-t border-slate-300/60" />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() =>
                      navigate(
                        "/admin/management/users-management/view-profile",
                        {
                          state: {
                            userId: p?.userId,
                            from: `/admin/management/profile-reports/review/${p?.userId}`,
                          },
                        },
                      )
                    }
                    className="w-full flex items-center gap-1 p-3 py-2 rounded-lg border border-slate-300/60 bg-white hover:border-brand-blue hover:bg-app-primary5 transition-all text-left group shadow-none"
                  >
                    <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-slate-50 rounded-full transition-colors">
                      <LuUserRound className="w-4 h-4 text-slate-400 group-hover:text-brand-blue" />
                    </div>
                    <span className="text-xs font-medium text-slate-800 group-hover:text-brand-blue transition-colors">
                      View Full Profile
                    </span>
                  </Button>

                  {isBanned ? (
                    <Button
                      onClick={() => setIsUnbanConfirmOpen(true)}
                      className="w-full flex items-center gap-1 p-3 py-2 rounded-lg border border-slate-300/60 bg-white hover:border-emerald-100 hover:bg-emerald-50/50 transition-all text-left group shadow-none"
                    >
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-slate-50 rounded-full transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs font-medium text-emerald-500">
                        Unban User
                      </span>
                    </Button>
                  ) : localIsSuspended ? (
                    <Button
                      onClick={() => setIsUnsuspendDialogOpen(true)}
                      disabled={isUnsuspending}
                      className="w-full flex items-center gap-1 p-3 py-2 rounded-lg border border-slate-300/60 bg-white hover:border-emerald-100 hover:bg-emerald-50/50 transition-all text-left group shadow-none"
                    >
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-slate-50 rounded-full transition-colors">
                        {isUnsuspending ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-emerald-500">
                        Unsuspend User
                      </span>
                    </Button>
                  ) : pendingCount > 0 ? (
                    <Button
                      onClick={() => setIsConfirmBanOpen(true)}
                      className="w-full flex items-center gap-1 p-3 py-2 rounded-lg border border-slate-300/60 bg-white hover:border-red-100 hover:bg-red-50/50 transition-all text-left group shadow-none"
                    >
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-slate-50 rounded-full transition-colors">
                        <Ban className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-xs font-medium text-red-500">
                        Ban User Immediately
                      </span>
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <BanUserModal
          isOpen={isConfirmBanOpen}
          onClose={() => setIsConfirmBanOpen(false)}
          userName={nickname}
          onConfirm={(category, reason) => handleImmediateBan(reason)}
        />

        <LiftRestrictionDialog
          isOpen={isUnbanConfirmOpen}
          onOpenChange={setIsUnbanConfirmOpen}
          userName={nickname}
          type="banned"
          onConfirm={(reason) => handleUnban("Administrative", reason)}
          isLoading={isUnbanning}
        />

        <LiftRestrictionDialog
          isOpen={isUnsuspendDialogOpen}
          onOpenChange={setIsUnsuspendDialogOpen}
          userName={nickname}
          type="suspended"
          onConfirm={(reason) => handleUnsuspendClick("Administrative", reason)}
          isLoading={false}
        />

        <ConfirmModal
          isOpen={isUnsuspendFinalConfirmOpen}
          onClose={() => {
            if (isUnsuspending || unsuspendSuccess) return;
            setIsUnsuspendFinalConfirmOpen(false);
          }}
          onConfirm={handleFinalUnsuspend}
          title="Lift Account Suspension"
          message={`Are you sure you want to lift the suspension from ${nickname}? This will restore their full access.`}
          confirmText="Confirm Lift"
          type="success"
          loading={isUnsuspending}
          success={unsuspendSuccess}
        />
      </div>
    </>
  );
};
