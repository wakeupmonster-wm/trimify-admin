import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { IconAlertTriangle, IconBan, IconCrown } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";
import { userColumns } from "@/components/common/userColumns";
import UserDataTables from "@/components/shared/data-tables/user.data.tables";
import { cn } from "@/lib/utils";
import {
  bannedUserProfile,
  exportUsersStream,
  fetchUsers,
  suspendUserProfile,
  unbanUserProfile,
  setExportProgress,
  unsuspendUserProfile,
  sendIndividualNotificationThunk,
} from "../store/user.slice";
import { UserActionModal } from "../components/UserActionModal";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/headSubhead";
import StatsGrid from "@/components/common/stats.grid";
import { Container } from "@/components/common/container";
import { bgMap, colorMap } from "@/constants/colors";
import { Download, Loader2, X, CheckCircle2 } from "lucide-react";
import { LuUserRoundCheck, LuUsersRound } from "react-icons/lu";
import { PreLoader } from "@/app/loader/preloader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Controls the speed of the "wave" between cards
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const getInitialFilters = (locationState) => {
  let globalFilter = sessionStorage.getItem("userManagementGlobalFilter") || "";
  let accountStatus = sessionStorage.getItem("userManagementAccountStatus") || "";

  const savedPremium = sessionStorage.getItem("userManagementIsPremium");
  let isPremium = savedPremium === "true" ? true : savedPremium === "false" ? false : undefined;

  const savedLast24 = sessionStorage.getItem("userManagementLast24HR");
  let last24HR = savedLast24 === "true" ? true : savedLast24 === "false" ? false : undefined;

  let gender = sessionStorage.getItem("userManagementGender") || "";

  const savedDeactivated = sessionStorage.getItem("userManagementIsDeactivated");
  let isDeactivated = savedDeactivated === "true" ? true : savedDeactivated === "false" ? false : undefined;

  const savedDeleted = sessionStorage.getItem("userManagementIsScheduledForDeletion");
  let isScheduledForDeletion = savedDeleted === "true" ? true : savedDeleted === "false" ? false : undefined;

  const savedGhosting = sessionStorage.getItem("userManagementIsGhosting");
  let isGhosting = savedGhosting === "true" ? true : savedGhosting === "false" ? false : undefined;

  let preset = sessionStorage.getItem("userManagementPreset") || "";
  let from = sessionStorage.getItem("userManagementFrom") || "";
  let to = sessionStorage.getItem("userManagementTo") || "";

  if (locationState) {
    if (typeof locationState === "object") {
      if (locationState.search) {
        globalFilter = locationState.search;
      }
      if (locationState.id === "ghosting") {
        isGhosting = true;
        if (locationState.preset) {
          preset = locationState.preset;
        }
        if (locationState.dateRange && locationState.dateRange.from) {
          from = locationState.dateRange.from;
        }
        if (locationState.dateRange && locationState.dateRange.to) {
          to = locationState.dateRange.to;
        }
      }
      if (locationState.label) {
        if (locationState.label === "Restricted") {
          accountStatus = "banned";
        } else if (locationState.label === "Female signups") {
          gender = "women";
        } else if (locationState.label === "Active") {
          last24HR = true;
        } else if (locationState.label === "Revenue") {
          isPremium = true;
        }

        if (locationState.preset) {
          preset = locationState.preset;
        }
        if (locationState.from) {
          from = locationState.from;
        }
        if (locationState.to) {
          to = locationState.to;
        }
      }
    } else if (locationState === "Restricted") {
      accountStatus = "banned";
    } else if (locationState === "Female signups") {
      gender = "women";
    } else if (locationState === "Active") {
      last24HR = true;
    } else if (locationState === "Revenue") {
      isPremium = true;
    }
  }

  return {
    globalFilter,
    accountStatus,
    isPremium,
    last24HR,
    gender,
    isDeactivated,
    isScheduledForDeletion,
    isGhosting,
    preset,
    from,
    to,
  };
};

export default function UserManagementPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    items,
    loading,
    pagination: reduxPagination,
    kpiStats,
    exportLoading,
    exportProgress,
  } = useSelector((state) => state.users);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: "ban",
    user: null,
  });

  const [initialFilters] = useState(() => getInitialFilters(location.state));

  // Filter States
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("userManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [globalFilter, setGlobalFilter] = useState(initialFilters.globalFilter);
  const [accountStatus, setAccountStatus] = useState(initialFilters.accountStatus);
  const [isPremium, setIsPremium] = useState(initialFilters.isPremium);
  const [last24HR, setLast24HR] = useState(initialFilters.last24HR);
  const [gender, setGender] = useState(initialFilters.gender);
  const [isDeactivated, setIsDeactivated] = useState(initialFilters.isDeactivated);
  const [isScheduledForDeletion, setIsScheduledForDeletion] = useState(initialFilters.isScheduledForDeletion);
  const [isGhosting, setIsGhosting] = useState(initialFilters.isGhosting);
  const [preset, setPreset] = useState(initialFilters.preset);
  const [from, setFrom] = useState(initialFilters.from);
  const [to, setTo] = useState(initialFilters.to);

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    if (pagination && (pagination.pageIndex !== 0 || pagination.pageSize !== 10)) {
      sessionStorage.setItem("userManagementPagination", JSON.stringify(pagination));
    } else {
      sessionStorage.removeItem("userManagementPagination");
    }

    if (globalFilter) {
      sessionStorage.setItem("userManagementGlobalFilter", globalFilter);
    } else {
      sessionStorage.removeItem("userManagementGlobalFilter");
    }

    if (accountStatus) {
      sessionStorage.setItem("userManagementAccountStatus", accountStatus);
    } else {
      sessionStorage.removeItem("userManagementAccountStatus");
    }

    if (isPremium !== undefined) {
      sessionStorage.setItem("userManagementIsPremium", String(isPremium));
    } else {
      sessionStorage.removeItem("userManagementIsPremium");
    }

    if (last24HR !== undefined) {
      sessionStorage.setItem("userManagementLast24HR", String(last24HR));
    } else {
      sessionStorage.removeItem("userManagementLast24HR");
    }

    if (gender) {
      sessionStorage.setItem("userManagementGender", gender);
    } else {
      sessionStorage.removeItem("userManagementGender");
    }

    if (isDeactivated !== undefined) {
      sessionStorage.setItem("userManagementIsDeactivated", String(isDeactivated));
    } else {
      sessionStorage.removeItem("userManagementIsDeactivated");
    }

    if (isScheduledForDeletion !== undefined) {
      sessionStorage.setItem("userManagementIsScheduledForDeletion", String(isScheduledForDeletion));
    } else {
      sessionStorage.removeItem("userManagementIsScheduledForDeletion");
    }

    if (isGhosting !== undefined) {
      sessionStorage.setItem("userManagementIsGhosting", String(isGhosting));
    } else {
      sessionStorage.removeItem("userManagementIsGhosting");
    }

    if (preset) {
      sessionStorage.setItem("userManagementPreset", preset);
    } else {
      sessionStorage.removeItem("userManagementPreset");
    }

    if (from) {
      sessionStorage.setItem("userManagementFrom", from);
    } else {
      sessionStorage.removeItem("userManagementFrom");
    }

    if (to) {
      sessionStorage.setItem("userManagementTo", to);
    } else {
      sessionStorage.removeItem("userManagementTo");
    }
  }, [
    pagination,
    globalFilter,
    accountStatus,
    isPremium,
    last24HR,
    gender,
    isDeactivated,
    isScheduledForDeletion,
    isGhosting,
    preset,
    from,
    to,
  ]);

  // --- Optimized Stats Calculation ---
  const stats = useMemo(() => {
    return [
      {
        label: "Total Members",
        val: kpiStats?.totalUsers || 0,
        icon: <LuUsersRound size={22} />,
        color: "blue",
        description: "Overall Total Users",
      },
      {
        label: "Active Users",
        val: kpiStats?.activeTotal || 0,
        icon: <LuUserRoundCheck size={22} />,
        color: "emerald",
        description: "Live community",
      },
      {
        label: "Premium Members",
        val: kpiStats?.premiumTotal || 0,
        icon: <IconCrown size={22} />,
        color: "amber",
        description: "Pro tier active",
      },
      {
        label: "Banned Users",
        val: kpiStats?.bannedTotal || 0,
        icon: <IconBan size={22} />,
        color: "rose",
        description: "Safety restrictions",
      },
      {
        label: "Suspended",
        val: kpiStats?.suspendedTotal || 0,
        icon: <IconAlertTriangle size={22} />,
        color: "orange",
        description: "Under review",
      },
    ];
  }, [kpiStats]);

  const handleExport = async () => {
    try {
      const filters = {}; // Export all users ignoring UI filters

      const resultAction = await dispatch(exportUsersStream(filters));

      if (exportUsersStream.fulfilled.match(resultAction)) {
        const csvContent = resultAction.payload;

        if (!csvContent) {
          toast.error("No data received from server");
          return;
        }

        // ✅ FIX 1: BOM sahi jagah — pure string ke start me, concat se nahi
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        const encoder = new TextEncoder();
        const csvBytes = encoder.encode(csvContent);

        // Merge BOM + CSV bytes
        const combined = new Uint8Array(bom.length + csvBytes.length);
        combined.set(bom, 0);
        combined.set(csvBytes, bom.length);

        const blob = new Blob([combined], {
          type: "text/csv;charset=utf-8;",
        });

        // ✅ FIX 3: Filename me timestamp instead of Date.now() — readable format
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // "2025-01-15"
        const filename = `Keen_Users_${dateStr}.csv`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Export completed successfully");
      } else {
        const errorMessage =
          resultAction.payload ||
          resultAction.error?.message ||
          "Export failed";
        toast.error(errorMessage);
        dispatch(setExportProgress(0));
      }
    } catch (err) {
      console.error("Export Error:", err);
      toast.error("An unexpected error occurred during export");
      dispatch(setExportProgress(0));
    }
  };

  useEffect(() => {
    if (location?.state) {
      // Clear location state so that subsequent updates/re-renders don't re-trigger resets
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location?.state, location.pathname, navigate]);

  useEffect(() => {
    const promise = dispatch(
      fetchUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        accountStatus,
        isPremium,
        last24Hours: last24HR,
        gender,
        isDeactivated,
        isScheduledForDeletion,
        isGhosting,
        preset,
        from,
        to,
      }),
    );
    promise.unwrap().catch(() => {}).finally(() => {
      setIsInitialLoad(false);
    });
    return () => promise.abort();
  }, [
    dispatch, pagination, debouncedSearch, accountStatus, isPremium, last24HR, gender, isDeactivated,
    isScheduledForDeletion, isGhosting, preset, from, to
  ]);

  const handleActionConfirm = async (arg1, arg2, arg3, arg4, arg5) => {
    try {
      if (actionModal.type === "ban") {
        const reason = arg1;
        const category = arg2;
        await dispatch(
          bannedUserProfile({
            userId: actionModal.user?._id,
            category,
            reason,
          }),
        ).unwrap();
        toast.success("User has been banned");
      } else if (actionModal.type === "suspend") {
        const reason = arg1;
        const duration = arg2;
        await dispatch(
          suspendUserProfile({
            userId: actionModal.user?._id,
            reason,
            durationHours: Number(duration),
          }),
        ).unwrap();
        toast.success("User Suspended", {
          description: `Access restricted for ${duration} hours.`,
        });
      } else if (actionModal.type === "unban") {
        const reason = arg1;
        await dispatch(
          unbanUserProfile({ userId: actionModal.user?._id, reason }),
        ).unwrap();
        toast.success("User account activated");
      } else if (actionModal.type === "unsuspend") {
        const reason = arg1;
        await dispatch(
          unsuspendUserProfile({ userId: actionModal.user?._id, reason }),
        ).unwrap();
        toast.success("User suspension lifted");
      } else if (actionModal.type === "notify") {
        const title = arg1;
        const message = arg2;
        const channels = arg3;
        const ctaLabel = arg4;
        const ctaAction = arg5;
        await dispatch(
          sendIndividualNotificationThunk({
            userId: actionModal.user?._id,
            title,
            message,
            channels,
            ctaLabel,
            ctaAction,
          }),
        ).unwrap();
        toast.success("Notification sent successfully");
      }
      return true;
    } catch (error) {
      toast.error(error || "Action failed");
      return false;
    }
  };

  if (isInitialLoad && loading) {
    return <PreLoader />;
  }

  return (
    <Container>
      <div className="@container/main space-y-6">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full">
              <PageHeader
                heading="User Management"
                icon={
                  <LuUsersRound
                    strokeWidth={2}
                    className="w-8 h-8 text-white"
                  />
                }
                color="bg-brand-aqua shadow-brand-aqua/30"
                subheading="Monitor community activity and manage member accounts."
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exportLoading}
                className={cn(
                  "relative h-9 p-3 rounded-md shadow-sm text-slate-400 hover:text-white border border-slate-200 hover:bg-brand-aqua transition-all duration-300 w-full md:w-auto",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 group overflow-hidden",
                )}
              >
                <div className="relative flex items-center justify-center">
                  {exportLoading ? (
                    <Loader2 className="mr-2.5 h-4 w-4 animate-spin text-brand-aqua" />
                  ) : (
                    <Download className="mr-1.5 h-4 w-4" />
                  )}

                  <span className="tracking-wide">
                    {exportLoading ? "Preparing CSV..." : "Export CSV"}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsGrid
            stats={stats}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all relevant stats filters first
              setAccountStatus("");
              setIsPremium(undefined);
              setGender("");
              setLast24HR(undefined);
              setIsDeactivated(undefined);
              setIsScheduledForDeletion(undefined);
              setIsGhosting(undefined);
              setPreset("");
              setFrom("");
              setTo("");
              setGlobalFilter("");
              if (label === "Active Users") {
                setAccountStatus("active");
              } else if (label === "Premium Members") {
                setIsPremium(true);
              } else if (label === "Banned Users") {
                setAccountStatus("banned");
              } else if (label === "Suspended") {
                setAccountStatus("suspended");
              }
              // "Total Members" will just use the cleared filters
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <UserDataTables
          columns={userColumns}
          data={items || []}
          rowCount={reduxPagination?.total ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          filters={{
            accountStatus,
            setAccountStatus: (val) => {
              setAccountStatus(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            isPremium,
            setIsPremium: (val) => {
              setIsPremium(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            last24HR,
            setLast24HR: (val) => {
              setLast24HR(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            gender,
            setGender: (val) => {
              setGender(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            isDeactivated,
            setIsDeactivated: (val) => {
              setIsDeactivated(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            isScheduledForDeletion,
            setIsScheduledForDeletion: (val) => {
              setIsScheduledForDeletion(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            isGhosting,
            setIsGhosting: (val) => {
              setIsGhosting(val);
              if (val === undefined) {
                setPreset("");
                setFrom("");
                setTo("");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            setGlobalFilter,
            setPagination,
          }}
          isLoading={loading}
          meta={{
            onBan: (user) =>
              setActionModal({ isOpen: true, type: "ban", user }),
            onSuspend: (user) =>
              setActionModal({ isOpen: true, type: "suspend", user }),
            onUnban: (user) =>
              setActionModal({ isOpen: true, type: "unban", user }),
            onUnsuspend: (user) =>
              setActionModal({ isOpen: true, type: "unsuspend", user }),
            onNotify: (user) =>
              setActionModal({ isOpen: true, type: "notify", user }),
          }}
        />

        <AnimatePresence>
          {(exportLoading || exportProgress > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-[100]"
            >
              <style>
                {`
                  @keyframes shimmer-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                  }
                `}
              </style>
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-80 relative group">
                {/* Close Button */}
                <button
                  onClick={() => dispatch(setExportProgress(0))}
                  className="absolute -top-2 -right-1 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-all z-[101] text-slate-400 hover:text-slate-600 hover:scale-110 active:scale-95"
                >
                  <X size={14} strokeWidth={2} />
                </button>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-500",
                        exportProgress === 100
                          ? "bg-emerald-50 border-emerald-100 shadow-emerald-100/50"
                          : "bg-brand-aqua/10 border-brand-aqua/20",
                      )}
                    >
                      {exportProgress === 100 ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 12 }}
                        >
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="animate-spin h-5 w-5 text-brand-aqua" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight">
                        {exportProgress === 100
                          ? "Export Ready"
                          : "Exporting Data"}
                      </h3>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                        {exportProgress === 100
                          ? "File Downloaded"
                          : "Generating CSV"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-xl border transition-colors duration-500",
                      exportProgress === 100
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-brand-aqua/10 border-brand-aqua/20 text-brand-aqua",
                    )}
                  >
                    <span className="font-mono text-base font-bold tracking-tighter">
                      {exportProgress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 120,
                      }}
                      className={cn(
                        "h-full relative rounded-full transition-colors duration-500",
                        exportProgress === 100
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          : "bg-brand-aqua shadow-[0_0_10px_rgba(34,211,238,0.3)]",
                      )}
                    >
                      {/* Active Shimmer Effect */}
                      {exportProgress < 100 && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          style={{
                            width: "100px",
                            animation: "shimmer-progress 2s infinite linear",
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] px-1">
                    <div className="flex items-center gap-1.5">
                      {exportProgress < 100 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua animate-pulse" />
                      )}
                      <span className="text-slate-600 font-semibold tracking-tight">
                        {exportProgress === 100
                          ? "Export completed successfully"
                          : "Processing records..."}
                      </span>
                    </div>
                    {exportProgress === 100 && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-500 font-black uppercase tracking-tighter"
                      >
                        Success
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <UserActionModal
          type={actionModal.type}
          isOpen={actionModal.isOpen}
          onClose={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleActionConfirm}
          userName={actionModal.user?.profile?.nickname || "User"}
        />
      </div>
    </Container>
  );
}
