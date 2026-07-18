import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProfileForReview,
  fetchReportedProfiles,
  performUpdateProfileStatus,
  resetSelectedProfile,
} from "../store/profile-review.slice";
import { Header } from "../components/header";
import { ReportsSection } from "../components/reportsSection";
// import { DecisionCenter, ReviewSidebar } from "../components/actionPanel";
import { AdminResourceNotFound } from "@/components/common/AdminResourceNotFound";
import { IconUserOff } from "@tabler/icons-react";
import { toast } from "sonner";
import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import { DecisionCenter } from "../components/DecisionCenter";
import { ReviewSidebar } from "../components/ReviewSidebar";

export default function ProfileReviewPage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { selected: p, loading } = useSelector((s) => s.profileReview || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");

  const [formData, setFormData] = useState({
    action: "",
    reason: "",
    suspendDuration: "",
    replyMessage: "",
    selectedReportId: "",
    isBulkMode: false,
    bulkReplies: {}, // { reportId: message }
  });

  useEffect(() => {
    if (userId) {
      dispatch(resetSelectedProfile());
      dispatch(fetchProfileForReview(userId));
    }
  }, [userId, dispatch]);

  if (loading && !p) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader width={200} height={200} />
      </div>
    );
  }

  if (!p) {
    return (
      <AdminResourceNotFound
        title="Profile Not Found"
        description="The profile you are looking for does not exist or has already been reviewed."
        icon={IconUserOff}
        backLabel="Back to Review Queue"
        backPath="/admin/moderation/profile-review"
      />
    );
  }

  const onSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (!formData.action) {
      toast.warning("Please select an action");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId,
      action: formData.action,
      reason: (formData.reason || "").trim() || undefined,
      replyMessage:
        formData.action === "reply"
          ? (formData.replyMessage || "").trim()
          : undefined,
      reportId:
        formData.action === "reply" ? formData.selectedReportId : undefined,
      suspendDuration:
        formData.action === "suspend"
          ? Number(formData.suspendDuration)
          : undefined,
    };

    try {
      if (formData.action === "reply" && formData.isBulkMode) {
        // Bulk Submission Logic: Send a single API call with all report IDs
        const pendingReports =
          p?.reports?.filter((r) => r.status !== "resolved") || [];
        const reportIds = pendingReports.map((r) => r._id || r.id);

        if (reportIds.length === 0) {
          toast.warning("No pending reports to reply to.");
          setIsSubmitting(false);
          return;
        }

        // Single API call instead of N individual calls
        await dispatch(
          performUpdateProfileStatus({
            userId,
            action: "bulk-reply",
            reportIds,
            replyMessage: (formData.replyMessage || "").trim(),
          }),
        ).unwrap();
      } else {
        // Standard Single Submission Logic
        await dispatch(performUpdateProfileStatus(payload)).unwrap();
      }

      // Re-fetch data BEFORE success message for smoothness
      await Promise.all([
        dispatch(fetchProfileForReview(userId)),
        dispatch(fetchReportedProfiles({ page: 1, limit: 20 })),
      ]);

      const pendingCount =
        p?.reports?.filter((r) => r.status !== "resolved").length || 0;

      toast.success(
        formData.action === "reply" && formData.isBulkMode
          ? `Successfully responded to ${pendingCount} reports.`
          : "Moderation action executed successfully.",
      );

      setIsSuccess(true);

      setTimeout(() => {
        setIsConfirmOpen(false);
        setIsSuccess(false);
        setFormData({
          action: "",
          reason: "",
          suspendDuration: "",
          replyMessage: "",
          selectedReportId: "",
          isBulkMode: false,
          bulkReplies: {},
        });
      }, 1500);
    } catch (err) {
      toast.error(err?.message || "Failed to execute action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingReports =
    p?.reports?.filter((r) => r.status !== "resolved") || [];

  const resolvedReports =
    p?.reports?.filter((r) => r.status === "resolved") || [];

  const tabs = [
    {
      key: "reports",
      label: "Active Reports",
      count: pendingReports.length,
    },
    {
      key: "history",
      label: "Report History",
      count: resolvedReports.length,
    },
  ];

  return (
    <Container className={"space-y-6"}>
      {/* Page Header (Navigation Only) */}
      <Header p={p} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 8/12 */}
        <div className="lg:col-span-9 space-y-5 mt-1.5">
          {/* 1. Warning Card */}
          {/* <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-50 border border-amber-200 rounded-xl px-5 py-2.5 flex items-center gap-3"
          >
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-[0.05em]">
              UNDER REVIEW — INVESTIGATING {p?.reportCount || 0} FLAGGED
              INCIDENTS
            </p>
          </motion.div> */}

          {/* 2. Tab Bar */}
          <div className="flex items-center gap-8 border-b border-slate-300/60 px-1">
            {tabs.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "pb-4 px-4 text-xs font-semibold capitalize tracking-wide transition-all relative",
                    isActive
                      ? "text-brand-blue"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {t.label}
                    {t.count !== null && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-md font-bold",
                          isActive
                            ? "bg-app-primary2 text-brand-blue"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {t.count}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabReview"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-primary2 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Tab Content (Reports / History / Details) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "reports" && (
                <ReportsSection
                  reports={p?.reports}
                  activeTab="reports"
                  isLoading={loading}
                />
              )}
              {activeTab === "history" && (
                <ReportsSection
                  reports={p?.reports}
                  activeTab="history"
                  isLoading={loading}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 4. Decision Center - Always visible at bottom of left column if not on details tab */}
          {activeTab !== "details" && (
            <DecisionCenter
              p={p}
              formData={formData}
              onUpdate={(f, v) => setFormData((prev) => ({ ...prev, [f]: v }))}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              success={isSuccess}
              isConfirmOpen={isConfirmOpen}
              setIsConfirmOpen={setIsConfirmOpen}
            />
          )}
        </div>

        {/* RIGHT COLUMN: 4/12 */}
        <div className="lg:col-span-3">
          <ReviewSidebar
            p={p}
            onStatusChange={() => dispatch(fetchProfileForReview(userId))}
          />
        </div>
      </div>
    </Container>
  );
}
