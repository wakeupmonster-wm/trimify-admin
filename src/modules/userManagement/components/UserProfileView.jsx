import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  ShieldOff,
  Bell,
  Droplet,
  Target,
  CreditCard,
  User,
  Smartphone,
  Activity,
  Ban,
  Trash2,
  Edit,
} from "lucide-react";
import { TabOverview } from "./TabOverview";
import { TabHealth } from "./TabHealth";
import { TabPrograms } from "./TabPrograms";
import { TabActivity } from "./TabActivity";
import { TabAccount } from "./TabAccount";
import { TabSettings } from "./TabSettings";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { APP_COLORS } from "@/config/theme.config.js";
import UserProfileSkeleton from "./profile/UserProfileSkeleton";
import { LuUserRound } from "react-icons/lu";

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
const PILL_TONES = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  neutral: "bg-slate-100 text-slate-500 border-slate-300/60",
};

export function Pill({ tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        PILL_TONES[tone] || PILL_TONES.neutral,
      )}
    >
      {children}
    </span>
  );
}

export function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      {children}
    </span>
  );
}

export function Card({ title, subtitle, right, children, className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-300/60 bg-white shadow-sm transition-all duration-300 hover:border-blue-200",
        className,
      )}
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 bg-slate-50/20">
          <div>
            {title && (
              <div className="text-[13px] font-bold text-slate-900">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                {subtitle}
              </div>
            )}
          </div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function KV({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2.5 border-b border-slate-50 py-2 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400">
        {Icon && <Icon className="h-3.5 w-3.5 opacity-45" />}
        {label}
      </span>
      <span className="max-w-[60%] break-words text-right text-[11.5px] font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

export function Kpi({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200">
      <div className="text-xl font-black tracking-tight tabular-nums text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}

export function GoalTile({ label, value, pct }) {
  return (
    <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200">
      <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-base font-black tabular-nums text-slate-900">
        {value}
      </div>
      {pct !== undefined && (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: APP_COLORS[0] }}
          />
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-300 border border-slate-100">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-[11.5px] font-bold text-slate-600">{title}</div>
      {subtitle && (
        <div className="max-w-[280px] text-[10.5px] font-medium text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, variant = "outline", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-xl border px-4 text-xs font-semibold shadow-sm transition-all duration-200",
        variant === "primary" &&
          "border-[#007FC0] bg-[#007FC0] text-white hover:bg-[#006699] hover:border-[#006699]",
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
  { key: "account", label: "Account" },
  { key: "settings", label: "Settings" },
];

/* =========================================================================
   Main component
========================================================================= */
export default function UserProfileView({ user, onBack, loading }) {
  const [tab, setTab] = useState("overview");
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

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
      { label: "Carbs", v: user.carbs_goal || 0, color: APP_COLORS[2] },
      { label: "Protein", v: user.protein_goal || 0, color: APP_COLORS[0] },
      { label: "Fat", v: user.fat_goal || 0, color: APP_COLORS[5] },
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
    const parsedActivities = (user.recent_activities || []).map((a) => ({
      ...a,
      steps: parseInt(((a.title || "").match(/\d+/) || ["0"])[0], 10),
    }));
    const maxSteps = Math.max(1, ...parsedActivities.map((a) => a.steps));
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
      parsedActivities,
      maxSteps,
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="py-5 w-full max-w-full">
        <UserProfileSkeleton />
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2000);
  };

  const handleCopy = (value, label) => {
    navigator.clipboard?.writeText(String(value)).catch(() => {});
    showToast(`${label} copied`);
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
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="View User Profile"
                icon={<LuUserRound className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-md shadow-blue-200/50"
                subheading="Manage and view detailed user information."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <button
                onClick={onBack}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </button>
            </div>
          </div>
        </Header>

        {toastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold text-white shadow-xl">
            {toastMsg}
          </div>
        )}

        {/* Hero Header */}
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 ring-4 ring-white shadow-sm">
                  {initials(user.name)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-white shadow-sm">
                <Pill tone={user.status === "Active" ? "success" : "neutral"}>
                  {user.status}
                </Pill>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {user.mobile}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Pill tone="info">UID: {user.id}</Pill>
                <Pill tone="info">Age {age}</Pill>
                <Pill tone={user.gender === "Female" ? "purple" : "blue"}>
                  {user.gender}
                </Pill>
                {user.premium === "1" && <Pill tone="warning">Premium</Pill>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <ActionButton icon={CreditCard} label="Transactions" />
            <ActionButton icon={Trash2} label="Delete" variant="danger" />
            <ActionButton icon={Edit} label="Edit User" variant="primary" />
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto border-b border-slate-200 bg-transparent p-0 h-10 rounded-none flex-nowrap">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 text-sm font-semibold text-slate-500 hover:text-slate-900 data-[state=active]:border-[#007FC0] data-[state=active]:text-[#007FC0] data-[state=active]:shadow-none whitespace-nowrap"
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
          <TabsContent value="account">
            <TabAccount data={tabData} />
          </TabsContent>
          <TabsContent value="settings">
            <TabSettings data={tabData} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
