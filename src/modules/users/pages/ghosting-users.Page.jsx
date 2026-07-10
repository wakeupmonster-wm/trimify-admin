import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  IconBan,
  IconLoader,
  IconUsers,
  IconHeart,
  IconGhost,
} from "@tabler/icons-react";
import { useLocation } from "react-router";
import { userColumns } from "@/components/common/userColumns";
import UserDataTables from "@/components/shared/data-tables/user.data.tables";
import { cn } from "@/lib/utils";
import {
  bannedUserProfile,
  exportUsersStream,
  fetchGhostingUsers,
  suspendUserProfile,
  unbanUserProfile,
  unsuspendUserProfile,
} from "../store/user.slice";
import { UserActionModal } from "../components/UserActionModal";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/headSubhead";
import StatsGrid from "@/components/common/stats.grid";
import { Container } from "@/components/common/container";
import { bgMap, colorMap } from "@/constants/colors";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { LuUserRoundCheck, LuUsersRound } from "react-icons/lu";

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

export default function GhostingUsersPage() {
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

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: "ban",
    user: null,
  });


  // Determine if we arrived via dashboard navigation
  const navState = location?.state;
  const isFromGhostingAlert =
    navState?.id === "ghosting" ||
    navState?.badge === "Info" ||
    navState === "ghosting";

  // Filter States — initialized from location.state when coming from dashboard
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [dateRange, setDateRange] = useState(() => {
    if (navState?.dateRange?.from && navState?.dateRange?.to) {
      return { from: navState.dateRange.from, to: navState.dateRange.to };
    }
    return { from: null, to: null };
  });
  const [globalFilter, setGlobalFilter] = useState(() => {
    if (typeof navState === "object" && navState?.search) return navState.search;
    return "";
  });
  const [accountStatus, setAccountStatus] = useState(() => {
    if (navState?.badge === "Restricted" || navState === "Restricted") return "banned";
    return "";
  });
  const [isPremium, setIsPremium] = useState(() => {
    if (navState?.badge === "Revenue" || navState === "Revenue") return true;
    return undefined;
  });
  const [last24HR, setLast24HR] = useState(() => {
    if (
      navState?.badge === "Active" || navState === "Active" ||
      navState?.badge === "Female signups" || navState === "Female signups"
    ) return true;
    return undefined;
  });
  const [gender, setGender] = useState(() => {
    if (navState?.badge === "Female signups" || navState === "Female signups") return "women";
    return "";
  });
  const [isDeactivated, setIsDeactivated] = useState(undefined);
  const [isScheduledForDeletion, setIsScheduledForDeletion] =
    useState(undefined);
  const [selectedView, setSelectedView] = useState(() => {
    if (isFromGhostingAlert) return "ghosted_matches";
    return "ghosted";
  });

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // --- Optimized Stats Calculation ---
  const stats = useMemo(() => {
    return [
      {
        id: "ghosted",
        label: "Ghosted Users",
        val: kpiStats?.totalUsers || 0,
        icon: <LuUsersRound size={22} />,
        color: "blue",
        description: "Users with no responses",
        isSelected: selectedView === "ghosted",
        onClick: () => {
          setSelectedView("ghosted");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
      },
      {
        id: "active",
        label: "Active Chats",
        val: kpiStats?.activeMatches || 0,
        icon: <LuUserRoundCheck size={22} />,
        color: "emerald",
        description: "Started 1-to-1 chats",
        isSelected: selectedView === "active",
        onClick: () => {
          setSelectedView("active");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
      },
      {
        id: "blocked",
        label: "Blocks Reported",
        val: kpiStats?.totalBlocks || 0,
        icon: <IconBan size={22} />,
        color: "rose",
        description: "Blocks after chatting",
        isSelected: selectedView === "blocked",
        onClick: () => {
          setSelectedView("blocked");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
      },
      {
        id: "matches",
        label: "Total Matches",
        val: kpiStats?.totalMatches || 0,
        icon: <IconHeart size={22} />,
        color: "rose",
        description: "Matches in this period",
        isSelected: selectedView === "matches",
        onClick: () => {
          setSelectedView("matches");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
      },
      {
        id: "ghosted_matches",
        label: "Ghosted Matches",
        val: kpiStats?.ghostedMatches || 0,
        icon: <IconGhost size={22} />,
        color: "orange",
        description: "Zero message matches",
        isSelected: selectedView === "ghosted_matches",
        onClick: () => {
          setSelectedView("ghosted_matches");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
      },
    ];
  }, [kpiStats, selectedView]);

  const handleExport = async () => {
    try {
      const filters = {
        search: globalFilter,
        accountStatus: accountStatus, // Added these to match your current table state
        isPremium: isPremium,
      };

      // 1. You MUST await the dispatch
      const resultAction = await dispatch(exportUsersStream(filters));

      // 2. Check the result after the promise settles
      if (exportUsersStream.fulfilled.match(resultAction)) {
        const csvContent = resultAction.payload;

        // Safety check: ensure csvContent exists
        if (!csvContent) {
          toast.error("No data received from server");
          return;
        }

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `Keen_Users_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Export completed successfully");
      } else {
        // Handle the rejection
        const errorMessage =
          resultAction.payload ||
          resultAction.error?.message ||
          "Export failed";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Export Error:", err);
      toast.error("An unexpected error occurred during export");
    }
  };

  // Navigation filter is now handled synchronously in useState initializers above.
  // No separate useEffect needed — eliminates the race condition entirely.

  useEffect(() => {
    dispatch(
      fetchGhostingUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        from: dateRange.from,
        to: dateRange.to,
        view: selectedView,
        isPremium,
        gender,
      }),
    );
  }, [
    dispatch,
    pagination,
    debouncedSearch,
    isPremium,
    gender,
    dateRange,
    selectedView,
  ]);

  const handleActionConfirm = async (arg1, arg2) => {
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
      }
      return true;
    } catch (error) {
      toast.error(error || "Action failed");
      return false;
    }
  };

  return (
    <Container>
      <motion.div
        className="@container/main space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <header className="flex flex-col gap-4">
          <div className="flex md:items-center justify-between gap-4">
            <PageHeader
              heading="Ghosting Analysis"
              icon={
                <LuUsersRound
                  strokeWidth={2}
                  className="w-8 h-8 text-white animate-pulse"
                />
              }
              color="bg-brand-aqua shadow-brand-aqua/30"
              subheading="Analyze and manage users contributing to high ghosting rates."
            />
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exportLoading}
                className={cn(
                  "relative h-9 p-4 rounded-md shadow-sm bg-white hover:bg-brand-aqua text-sm font-normal hover:font-medium text-slate-500 hover:text-white border hover:border-brand-aqua transition-all duration-300",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 group overflow-hidden",
                )}
              >
                <div className="relative flex items-center justify-center">
                  {exportLoading ? (
                    <Loader2 className="mr-2.5 h-4 w-4 animate-spin text-brand-aqua" />
                  ) : (
                    <Download className="mr-1.5 h-4 w-4" />
                  )}

                  <span className="tracking-tight">
                    {exportLoading ? "Preparing CSV..." : "Export CSV"}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </header>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <StatsGrid
            stats={stats}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all relevant filters first
              setAccountStatus("");
              setIsPremium(undefined);
              setLast24HR(undefined);
              setGender("");
              setIsDeactivated(undefined);
              setIsScheduledForDeletion(undefined);
              setGlobalFilter("");

              if (label === "Ghosted Users") {
                setSelectedView("ghosted");
              } else if (label === "Active Chats") {
                setSelectedView("active");
              } else if (label === "Blocks Reported") {
                setSelectedView("blocked");
              } else if (label === "Total Matches") {
                setSelectedView("matches");
              } else if (label === "Ghosted Matches") {
                setSelectedView("ghosted_matches");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </motion.div>

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
            isPremium,
            setIsPremium: (val) => {
              setIsPremium(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            gender,
            setGender: (val) => {
              setGender(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
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
          }}
        />

        <AnimatePresence>
          {(exportLoading || exportProgress > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, x: 10, scale: 0.98 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
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
              <div className="backdrop-blur-xl bg-white/90 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 w-[320px] space-y-5 overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-aqua/5 rounded-full blur-2xl" />

                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-sm",
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

                <div className="space-y-4 relative z-10">
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
      </motion.div>
    </Container>
  );
}
