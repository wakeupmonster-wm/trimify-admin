import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Loader2,
  ChevronLeft,
  LayoutDashboard,
  HeartPulse,
  Dumbbell,
  Activity,
  CreditCard,
  Settings,
} from "lucide-react";
import { TabOverview } from "./TabOverview";
import { TabHealth } from "./TabHealth";
import { TabPrograms } from "./TabPrograms";
import { TabActivity } from "./TabActivity";
import { TabSettings } from "./TabSettings";
import { TabTransactions } from "./TabTransactions";
import { getUserTransactionsAPI } from "../services/user.services";
import { useDispatch } from "react-redux";
import { deleteUserThunk } from "../store/user.slice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Container } from "@/components/common/container";
import ConfirmModal from "@/components/common/ConfirmModal";
import CTAButton from "@/components/common/CTAButton";
import dummyImg from "@/assets/web/dummyImg.webp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineDateRange } from "react-icons/md";
import { IconHistory } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* =========================================================================
   Helpers
 ========================================================================= */
const cap = (s) =>
  s === null || s === undefined || s === ""
    ? null
    : String(s)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const fmtDate = (v) => {
  if (!v) return "—";
  try {
    return format(new Date(v), "dd MMM yyyy");
  } catch (err) {
    return "—";
  }
};

const fmtDateTime = (v) => {
  if (!v) return "—";
  try {
    return format(new Date(v), "dd MMM yyyy, hh:mm a");
  } catch (err) {
    return "—";
  }
};

function timeAgo(v) {
  if (!v) return "—";
  try {
    return formatDistanceToNow(new Date(v), { addSuffix: true });
  } catch (err) {
    return "—";
  }
}

function ageFromDob(dob) {
  const d = new Date(dob);
  const now = new Date();
  if (isNaN(d.getTime())) return null;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  // Guard against bad/placeholder birth dates from legacy data
  if (age < 0 || age > 120) return null;
  return age;
}

const initials = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const truncMid = (s, head = 10, tail = 6) =>
  !s
    ? ""
    : s.length <= head + tail + 3
      ? s
      : `${s.slice(0, head)}…${s.slice(-tail)}`;

function bmiCategory(bmi) {
  if (!bmi) return { label: "—", color: "text-slate-400" };
  if (bmi < 18.5) return { label: "Underweight", color: "text-amber-600" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-600" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600" };
  return { label: "Obese", color: "text-rose-600" };
}

/* =========================================================================
   Small UI primitives
========================================================================= */
const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "health", label: "Health & Goals", icon: HeartPulse },
  { key: "programs", label: "Programs & Fitzone", icon: Dumbbell },
  { key: "activity", label: "Activity", icon: Activity },
  // { key: "account", label: "Account", icon: User },
  { key: "transactions", label: "Transactions", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

/* =========================================================================
   Main component
========================================================================= */
export default function UserProfileView({ user, onBack, loading }) {
  const [tab, setTab] = useState("overview");
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, src: null });

  const derived = useMemo(() => {
    if (!user) return {};
    const height = parseFloat(user.height);
    const weight = parseFloat(user.weight);
    const bmi = height && weight ? weight / Math.pow(height / 100, 2) : null;
    const bmiCat = bmiCategory(bmi);
    const bmiPct = bmi
      ? Math.min(100, Math.max(0, ((bmi - 15) / (35 - 15)) * 100))
      : 0;
    const age = ageFromDob(user.dob);
    const macroTotal =
      (user.carbs_goal || 0) + (user.fat_goal || 0) + (user.protein_goal || 0);
    const macros = [
      { label: "Carbs", v: user.carbs_goal || 0, color: "#f43f5e" }, // Rose-500
      { label: "Protein", v: user.protein_goal || 0, color: "#0ea5e9" }, // Sky-500
      { label: "Fat", v: user.fat_goal || 0, color: "#8b5cf6" }, // Violet-500
    ];
    const fitnessProfileFields = [
      ["Weight Goal", user.weight_goal ? `${user.weight_goal} kg` : null],
      ["Main Goal", cap(user.main_goal)],
      ["Current Body Shape", cap(user.body_shape)],
      ["Goal Body Shape", cap(user.body_shape_goal)],
      ["Ideal Weight Timeline", cap(user.ideal_weight_period)],
      ["Fitness Level", cap(user.fitness_level)],
      [
        "Diet Preference",
        user.vegetarian === null
          ? null
          : user.vegetarian
            ? "Vegetarian"
            : "Non-Vegetarian",
      ],
    ];
    const fitnessProfileSet = fitnessProfileFields.filter(([, v]) => v);
    const fitnessProfileMissing = fitnessProfileFields.filter(([, v]) => !v);
    const LOG_TYPES = ["step_log", "water_log", "food_log", "weight_log"];
    const logActivities = (user.recent_activities || [])
      .filter((a) => LOG_TYPES.includes(a.type))
      .map((a) => ({
        ...a,
        steps:
          a.type === "step_log"
            ? parseInt(((a.title || "").match(/\d+/) || ["0"])[0], 10)
            : 0,
      }));
    const maxSteps = Math.max(
      1,
      ...logActivities.filter((a) => a.type === "step_log").map((a) => a.steps),
    );
    const activeProgram =
      (user.programs || []).find((p) => p.status === "Active") ||
      (user.programs || [])[0] ||
      null;
    return {
      height,
      weight,
      bmi,
      bmiCat,
      bmiPct,
      age,
      macroTotal,
      macros,
      fitnessProfileSet,
      fitnessProfileMissing,
      fitnessProfileFields,
      logActivities,
      maxSteps,
      activeProgram,
    };
  }, [user]);

  const [txState, setTxState] = useState({
    loaded: false,
    loading: false,
    transactions: [],
    summary: {},
    page: 1,
    totalPages: 1,
    status: "all",
  });

  const loadTransactions = async (page, status) => {
    if (!user?.id) return;
    setTxState((s) => ({ ...s, loading: true }));
    try {
      const params = { page };
      if (status !== "all") params.status = status;
      const response = await getUserTransactionsAPI(user.id, params);
      if (response?.success) {
        setTxState({
          loaded: true,
          loading: false,
          transactions: response.data?.transactions || [],
          summary: response.data?.summary || {},
          page,
          totalPages: response.data?.pagination?.last_page || 1,
          status,
        });
      } else {
        setTxState((s) => ({ ...s, loading: false }));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTxState((s) => ({ ...s, loading: false }));
    }
  };

  const handleTabChange = (value) => {
    setTab(value);
    if (value === "transactions" && !txState.loaded && !txState.loading) {
      loadTransactions(1, "all");
    }
  };

  useEffect(() => {
    if (
      tab === "transactions" &&
      !txState.loaded &&
      !txState.loading &&
      user?.id
    ) {
      loadTransactions(1, "all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user?.id]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full mx-auto max-w-[1180px]">
        <Loader2 className="w-10 h-10 animate-spin text-app-primary2" />
        <p className="text-sm text-slate-500 mt-4 font-medium animate-pulse">
          Loading user profile...
        </p>
        {/* <div className="py-5 w-full max-w-full">
        <UserProfileSkeleton /> */}
      </div>
    );
  }

  const handleCopy = (value, label) => {
    navigator.clipboard?.writeText(String(value)).catch(() => {});
    toast.success(`${label} copied`);
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteUserThunk(user.id)).unwrap();
      setIsDeleteModalOpen(false);
      toast.success("User deleted successfully.");
      setTimeout(() => onBack(), 1000);
    } catch (error) {
      toast.error(error || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const { age } = derived;

  const es = user.engagement_stats || {};
  const as = user.activity_summary || {};
  const waterGoal = user.water_goal || 0;
  const caloriesGoal = user.calories_goal || 0;
  const targetSteps = parseInt(user.targetSteps || "0", 10);
  const programs = user.programs || [];
  const fitzoneStatus = user.fitzone_status || [];

  const tabData = {
    user,
    es,
    as,
    waterGoal,
    caloriesGoal,
    targetSteps,
    programs,
    fitzoneStatus,
    ...derived,
    handleCopy,
    cap,
    initials,
    fmtDate,
    truncMid,
    timeAgo,
    transactionsState: txState,
    onTransactionsPageChange: (page) => loadTransactions(page, txState.status),
    onTransactionsStatusChange: (status) => loadTransactions(1, status),
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        {/* Navigation Bar */}
        <header className="flex md:items-center justify-between gap-4 pt-2">
          <div className="flex flex-row items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-1.5 gap-y-0 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
                  User Directory
                </span>
                <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden sm:inline">
                  /
                </span>
              </div>
              <span className="text-sm sm:text-base md:text-xl font-normal text-foreground/40 sm:mt-1 truncate">
                {user.name || "Profile View"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => handleCopy(user.id, "ID")}
              className="group flex md:flex-none items-center justify-center md:justify-start gap-1 bg-white text-xs sm:text-[10px] font-semibold text-muted-foreground px-2 py-1.5 sm:py-1 rounded-md border border-slate-200 transition-all active:scale-95 shadow-sm hover:border-app-primary2/30"
            >
              <span className="text-app-primary2/60 shrink-0">ID:</span>
              <span className="truncate max-w-[200px] md:max-w-none">
                {user.id}
              </span>
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {/* Hero Header */}
          <div className="mb-2 sm:mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-row items-center w-full gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-app-primary2/10 rounded-full blur-xl opacity-50" />
                <Avatar
                  className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white shadow-sm relative z-10 cursor-pointer transition-all duration-200"
                  onClick={() => {
                    const imgSrc = user.avatar || null;
                    if (imgSrc) {
                      setImageModal({ open: true, src: imgSrc });
                    }
                  }}
                >
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={user?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl sm:text-3xl font-black">
                    {initials(user?.name).substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-start text-left flex-1 min-w-0 gap-1.5 sm:gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl capitalize font-bold text-slate-900 truncate">
                    {user.name},{" "}
                    {age && (
                      <span className="text-foreground/60 font-medium text-base sm:text-lg">
                        {age}
                      </span>
                    )}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                      {user.status || "Active"}
                    </span>
                  </div>
                </div>

                {/* <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                    <span className="text-slate-400">Joined:</span>{" "}
                    <span className="text-slate-700">
                      {fmtDate(user.createdAt || user.created_at)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                    <span className="text-slate-400">Updated:</span>{" "}
                    <span className="text-slate-700">
                      {fmtDate(user.updatedAt || user.updated_at)}
                    </span>
                  </span>
                </div> */}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-xs text-slate-600">
                  {/* Joined Date */}
                  <div className="flex items-center gap-1 text-secondary-foreground/70 font-medium">
                    <MdOutlineDateRange className="h-3.5 w-3.5" />
                    <span>Joined:</span>
                    <span className="text-secondary-foreground">
                      {fmtDate(user.createdAt || user.created_at)}
                    </span>
                  </div>

                  {/* Last Update Date */}
                  <div className="flex items-center gap-1 font-medium text-secondary-foreground/70">
                    <IconHistory className="h-3.5 w-3.5" />
                    <span>Updated:</span>
                    <span className="text-secondary-foreground">
                      {fmtDate(user.updatedAt || user.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end shrink-0 w-full lg:w-auto mt-0 pt-4 lg:pt-0 border-t border-slate-100 lg:border-t-0">
              <CTAButton
                icon={isDeleting ? Loader2 : Trash2}
                label={isDeleting ? "Deleting..." : "Delete User"}
                variant="danger"
                className="w-full sm:w-auto justify-center"
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </div>
          </div>

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            title="Confirm User Deletion"
            message="Are you sure you want to delete this user? This action can be reversed by an admin."
            confirmText="Delete User"
            loading={isDeleting}
          />

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <div className="relative w-full overflow-hidden mb-6">
              {/* <TabsList className="hidden lg:flex overflow-x-auto h-12 p-1 bg-slate-100/80 backdrop-blur-md border border-slate-300/80 rounded-xl w-full lg:max-w-max justify-start shadow-sm"> */}
              <TabsList className="hidden lg:flex items-center justify-between gap-1 p-1 bg-white backdrop-blur-md rounded-lg w-full border border-slate-200 h-auto overflow-x-auto flex-nowrap shadow-sm">
                {TABS.map((t) => {
                  const isActive = tab === t.key;
                  return (
                    <TabsTrigger
                      key={t.key}
                      value={t.key}
                      className={cn(
                        "relative h-10 rounded-lg px-11 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 border-none shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-slate-900 snap-start shrink-0 whitespace-nowrap flex items-center gap-2",
                        isActive
                          ? "text-white hover:text-white"
                          : "text-slate-500",
                      )}
                    >
                      {t.icon && (
                        <t.icon
                          className={`w-4 h-4 relative z-10 font-semibold ${
                            isActive ? "text-white" : "text-slate-500"
                          }`}
                        />
                      )}
                      <span
                        className={`hidden sm:inline relative z-10 ${isActive ? "text-white" : "text-foreground/70"}`}
                      >
                        {t.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabProfileTrimify"
                          className="absolute inset-0 bg-app-primary2 rounded-lg shadow-sm"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tablet/Mobile Select Dropdown */}
              <div className="lg:hidden w-full">
                <Select value={tab} onValueChange={handleTabChange}>
                  <SelectTrigger className="w-full h-10 bg-white border border-slate-200 rounded-md px-4 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    {TABS.map((t) => (
                      <SelectItem
                        key={t.key}
                        value={t.key}
                        className="py-3 px-4 text-sm font-semibold text-slate-600 focus:bg-app-primary2/10 focus:text-app-primary2 rounded-lg cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {t.icon && <t.icon className="w-4 h-4 opacity-70" />}
                          <span>{t.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="overview">
              <TabOverview data={tabData} />
            </TabsContent>
            <TabsContent value="health">
              <TabHealth data={tabData} />
            </TabsContent>
            <TabsContent value="programs">
              <TabPrograms data={tabData} />
            </TabsContent>
            <TabsContent value="activity">
              <TabActivity data={tabData} />
            </TabsContent>
            {/* <TabsContent value="account">
              <TabAccount data={tabData} />
            </TabsContent> */}
            <TabsContent value="transactions">
              <TabTransactions data={tabData} />
            </TabsContent>
            <TabsContent value="settings">
              <TabSettings data={tabData} />
            </TabsContent>
          </Tabs>
        </div>

        {imageModal.open && (
          <Dialog
            open={imageModal.open}
            onOpenChange={(open) =>
              setImageModal((prev) => ({ ...prev, open }))
            }
          >
            <DialogContent className="max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center">
              <DialogHeader className="sr-only">
                <DialogTitle>Profile Photo Preview</DialogTitle>
              </DialogHeader>
              <div className="w-full h-full">
                <img
                  src={imageModal.src || dummyImg}
                  alt={`${user?.name}'s Profile Photo`}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Container>
  );
}
