import React, { useMemo, useRef, useState, useEffect } from "react";
import { ArrowLeft, Trash2, Loader2, Calendar, History } from "lucide-react";
import {
  Pill,
  Tag,
  Card,
  KV,
  Kpi,
  GoalTile,
  EmptyState,
} from "./UserProfileShared";
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
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LuUserRound } from "react-icons/lu";
import ConfirmModal from "@/components/common/ConfirmModal";

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

function ActionButton({ icon: Icon, label, variant = "outline", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md border px-4 text-xs font-semibold shadow-sm transition-all duration-200",
        variant === "primary" &&
        "border-app-primary2 bg-app-primary2 text-white hover:bg-app-primary5 hover:border-app-primary5",
        variant === "danger" &&
        "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700",
        variant === "outline" &&
        "border-slate-300/60 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "health", label: "Health & Goals" },
  { key: "programs", label: "Programs & Fitzone" },
  { key: "activity", label: "Activity" },
  // { key: "account", label: "Account" },
  { key: "transactions", label: "Transactions" },
  { key: "settings", label: "Settings" },
];

/* =========================================================================
   Main component
========================================================================= */
export default function UserProfileView({ user, onBack, loading }) {
  const [tab, setTab] = useState("overview");
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      { label: "Carbs", v: user.carbs_goal || 0, color: "#f59e0b" }, // amber-500
      { label: "Protein", v: user.protein_goal || 0, color: "#3b82f6" }, // blue-500
      { label: "Fat", v: user.fat_goal || 0, color: "#10b981" }, // emerald-500
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
    if (tab === "transactions" && !txState.loaded && !txState.loading && user?.id) {
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
    navigator.clipboard?.writeText(String(value)).catch(() => { });
    toast.success(`${label} copied`);
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteUserThunk(user.id)).unwrap();
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
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="View User Profile"
                icon={<LuUserRound className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="View detailed user information and history."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <button
                onClick={onBack}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-3 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </button>
            </div>
          </div>
        </Header>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span
                className="hover:text-app-primary2 cursor-pointer transition-colors"
                onClick={onBack}
              >
                User Directory
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-app-primary2">Profile View</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Hero Header */}
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-5 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover ring-[6px] ring-slate-50"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-app-primary2 ring-[6px] ring-slate-50">
                    {initials(user.name)}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 text-center sm:text-left sm:ml-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {user.name}
                    <span className="text-slate-500 text-xl font-medium">
                      , {age}
                    </span>
                  </h1>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {user.status || "Active"}
                    </span>
                    {/* <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {user.premium === "1" ? "PREMIUM" : "FREE"}
                  </span> */}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-[13px] font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-400">Joined:</span>{" "}
                    <span className="text-slate-700">
                      {fmtDate(user.createdAt || user.created_at)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <History className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-400">Updated:</span>{" "}
                    <span className="text-slate-700">
                      {fmtDate(user.updatedAt || user.updated_at)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end shrink-0">
              <ActionButton
                icon={isDeleting ? Loader2 : Trash2}
                label={isDeleting ? "Deleting..." : "Delete User"}
                variant="danger"
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
            <TabsList className="mb-6 flex overflow-x-auto h-12 p-1 bg-slate-100/80 backdrop-blur-md border border-slate-300/80 rounded-xl w-full lg:max-w-max no-scrollbar">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="h-10 rounded-lg px-5 text-sm font-semibold text-slate-500 hover:text-slate-900 data-[state=active]:bg-app-primary2 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 ease-in-out whitespace-nowrap"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

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
      </div>
    </Container>
  );
}
