import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/common/headSubhead";
import { Badge } from "@/components/ui/badge";
import {
  fetchPendingVerifications,
  verifyUserProfile,
} from "@/modules/verification/store/verfication.slice";
import KYCVerificationDataTable from "@/components/shared/data-tables/kyc.verification.data.table";
import { getKYCColumns } from "@/components/columns/kyc-columns";
import { KYCInspectorModal } from "../components/kyc-inspector-modal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "sonner";
import ReasonDialog from "@/modules/users/components/Dialogs/RejectReasonDialog";
import StatsGrid from "@/components/common/stats.grid";
import {
  IconCircleCheck,
  IconClipboardList,
  IconLoader,
  IconX,
  IconCircleDashed,
} from "@tabler/icons-react";
import { Container } from "@/components/common/container";
import { bgMap, colorMap } from "@/constants/colors";

export default function KYCVerificationPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    pendingVerifications,
    kpiStats,
    loading,
    pagination: reduxPagination,
  } = useSelector((state) => state.verification);

  // Determine if we arrived via dashboard navigation (location.state)
  // TodayAtAGlance passes state as { label, preset, from, to } — so compare navState.label
  const navState = location?.state;
  const isFromDashboard =
    navState?.id === "kyc" ||
    navState?.badge === "Low" ||
    navState?.badge === "High" ||
    navState?.label === "KYC pending" ||
    navState === "Low" ||
    navState === "High" ||
    navState === "KYC pending";

  // console.log("navState: ", navState)

  const [statusFilter, setStatusFilter] = useState(() => {
    // Priority 1: Dashboard navigation intent → always "pending"
    if (isFromDashboard) return "pending";
    // Priority 2: Restore last used filter from sessionStorage
    return sessionStorage.getItem("kycVerificationStatusFilter") || "";
  });
  const [sortBy, setSortBy] = useState(
    () => sessionStorage.getItem("kycVerificationSortBy") || "",
  );
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("kycVerificationGlobalFilter") || "",
  );
  const [pagination, setPagination] = useState(() => {
    // Reset to page 0 when coming from dashboard
    if (isFromDashboard) return { pageIndex: 0, pageSize: 10 };
    const saved = sessionStorage.getItem("kycVerificationPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Clear location state once it has been consumed on mount
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, location.state]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    if (statusFilter) {
      sessionStorage.setItem("kycVerificationStatusFilter", statusFilter);
    } else {
      sessionStorage.removeItem("kycVerificationStatusFilter");
    }

    if (sortBy) {
      sessionStorage.setItem("kycVerificationSortBy", sortBy);
    } else {
      sessionStorage.removeItem("kycVerificationSortBy");
    }

    if (globalFilter) {
      sessionStorage.setItem("kycVerificationGlobalFilter", globalFilter);
    } else {
      sessionStorage.removeItem("kycVerificationGlobalFilter");
    }

    if (
      pagination &&
      (pagination.pageIndex !== 0 || pagination.pageSize !== 10)
    ) {
      sessionStorage.setItem(
        "kycVerificationPagination",
        JSON.stringify(pagination),
      );
    } else {
      sessionStorage.removeItem("kycVerificationPagination");
    }
  }, [statusFilter, sortBy, globalFilter, pagination]);

  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const [imageModal, setImageModal] = useState({
    open: false,
    images: [], // Changed from 'src' to 'images'
    title: "",
  });

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    userId: null,
    action: "", // 'approve' or 'reject'
    nickname: "",
  });

  // Navigation filter is now handled synchronously in useState initializers above.
  // No separate useEffect needed — eliminates the race condition entirely.

  useEffect(() => {
    dispatch(
      fetchPendingVerifications({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter,
        sortBy: sortBy,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    statusFilter,
    sortBy,
    debouncedSearch,
  ]);

  const columns = useMemo(
    () =>
      getKYCColumns(
        (userId, action, nickname) => {
          if (action === "reject" || action === "re-approve") {
            setConfirmConfig({ userId, action, nickname, isOpen: false });
            setIsReasonModalOpen(true);
          } else {
            setConfirmConfig({ isOpen: true, userId, action, nickname });
          }
        },
        (modalConfig) => setImageModal(modalConfig),
        navigate,
      ),
    [dispatch, navigate],
  );

  const handleConfirmAction = (reasonFromModal) => {
    const { userId, action } = confirmConfig;

    // Use reason if it's a rejection or re-approval
    const finalReason =
      action === "reject" || action === "re-approve" ? reasonFromModal : "";

    // Normalize action for backend (re-approve maps to approve)
    const apiAction = action === "re-approve" ? "approve" : action;

    setConfirmLoading(true);
    setConfirmSuccess(false);

    dispatch(
      verifyUserProfile({ userId, action: apiAction, reason: finalReason }),
    )
      .unwrap()
      .then(() => {
        toast.success(`User ${action.replace("-", " ")}d successfully`);
        setConfirmSuccess(true);
        setConfirmLoading(false);
        setImageModal((prev) => ({ ...prev, open: false }));
        // Refresh page data and update KPI stats live
        dispatch(
          fetchPendingVerifications({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch,
            status: statusFilter,
            sortBy: sortBy,
          }),
        );
        setTimeout(() => {
          setConfirmConfig({ ...confirmConfig, isOpen: false });
          setIsReasonModalOpen(false);
          setConfirmSuccess(false);
        }, 1500);
      })
      .catch((err) => {
        setConfirmLoading(false);
        setConfirmSuccess(false);
        toast.error(err || "Action failed");
      });
  };

  const handleInspectorApprove = (userId, nickname, action = "approve") => {
    setImageModal((prev) => ({ ...prev, open: false })); // Close inspector first to release Radix focus trap
    setConfirmConfig({
      userId,
      action,
      nickname,
      isOpen: action === "approve",
    });
    if (action === "re-approve") {
      setIsReasonModalOpen(true);
    }
  };

  const handleInspectorReject = (userId, nickname) => {
    setImageModal((prev) => ({ ...prev, open: false })); // Close inspector first
    setConfirmConfig({ userId, action: "reject", nickname, isOpen: false });
    setIsReasonModalOpen(true);
  };

  // 1. Unfiltered data for the table so pagination counts match exactly
  const filteredData = useMemo(() => {
    return pendingVerifications || [];
  }, [pendingVerifications]);

  // 2. Optimized Stats Calculation
  const statsData = useMemo(() => {
    return [
      {
        label: "Total Requests",
        val: kpiStats?.totalRequests || 0,
        icon: <IconClipboardList size={22} />,
        color: "blue",
        description: "Active KYC queue",
      },
      {
        label: "Not Started",
        val: kpiStats?.not_started || 0,
        icon: <IconCircleDashed size={22} />,
        color: "slate",
        description: "Yet to begin KYC",
      },
      {
        label: "Approved",
        val: kpiStats?.approved || 0,
        icon: <IconCircleCheck size={22} />,
        color: "emerald",
        description: "Verified users",
      },
      {
        label: "Pending",
        val: kpiStats?.pending || 0,
        icon: <IconLoader size={22} className="animate-spin-slow" />,
        color: "amber",
        description: "Waiting for review",
      },
      {
        label: "Rejected",
        val: kpiStats?.rejected || 0,
        icon: <IconX size={22} />,
        color: "rose",
        description: "Declined requests",
      },
    ];
  }, [filteredData, reduxPagination?.total, kpiStats]);

  return (
    <Container>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="KYC Verifications"
              icon={<ShieldCheck className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-blue"
              subheading="Manage user identity documents."
            />
          </div>
          <Badge
            variant="outline"
            className="cursor-pointer bg-white hover:bg-app-primary5 text-slate-400 hover:text-white border border-slate-300/60 hover:border-brand-blue transition-all duration-300 gap-2 h-10 px-4 w-full md:w-auto justify-center md:justify-start shrink-0 shadow-sm rounded-lg font-semibold text-[11px] uppercase tracking-wider"
          >
            <Users className="h-4 w-4" strokeWidth={2} />
            <span className="whitespace-nowrap">
              {reduxPagination?.total ?? 0} Total Requests
            </span>
          </Badge>
        </header>

        {/* --- STATS GRID (Staggered) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsGrid
            stats={statsData}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all filters first
              setStatusFilter("");
              setSortBy("");
              setGlobalFilter("");

              if (label === "Approved") {
                setStatusFilter("approved");
              } else if (label === "Not Started") {
                setStatusFilter("not_started");
              } else if (label === "Pending") {
                setStatusFilter("pending");
              } else if (label === "Rejected") {
                setStatusFilter("rejected");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <KYCVerificationDataTable
          columns={columns}
          data={filteredData || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by nickname, email or phone..."
          filters={{
            statusFilter,
            setStatusFilter: (val) => {
              setStatusFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            sortBy, // Pass sortBy
            setSortBy: (val) => {
              setSortBy(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            setGlobalFilter,
            setPagination,
          }}
          meta={{ setImageModal }} // Yeh add karna zaruri hai
        />
      </div>

      <KYCInspectorModal
        config={imageModal}
        onClose={() => {
          // Don't close inspector if a confirmation dialog is currently open
          if (confirmConfig.isOpen || isReasonModalOpen) return;
          setImageModal({ ...imageModal, open: false });
        }}
        onApprove={handleInspectorApprove}
        onReject={handleInspectorReject}
        isVerifying={loading}
      />

      {/* 1. Normal Confirm Modal (Sirf Approve ke liye ya general alerts) */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => {
          if (confirmLoading || confirmSuccess) return;
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onConfirm={() => handleConfirmAction()} // Approve ke liye no reason needed
        title="Approve KYC?"
        message={`Are you sure you want to approve ${confirmConfig.nickname}?`}
        confirmText="Approve User"
        type="success"
        loading={confirmLoading}
        success={confirmSuccess}
      />

      {/* 2. REASON DIALOG (Rejection & Re-approval) */}
      <ReasonDialog
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        onConfirm={(reason) => handleConfirmAction(reason)}
        userName={confirmConfig.nickname}
        mode={confirmConfig.action === "re-approve" ? "re-approve" : "reject"}
        isLoading={loading}
      />
    </Container>
  );
}
