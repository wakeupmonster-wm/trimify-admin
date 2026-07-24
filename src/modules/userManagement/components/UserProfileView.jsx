import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
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
  AlertTriangle,
  Ban,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Container } from "@/components/common/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { APP_COLORS } from "@/config/theme.config.js";
import UserProfileSkeleton from "./profile/UserProfileSkeleton";

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
  !s ? "" : s.length <= head + tail + 3 ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;

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

function Pill({ tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        PILL_TONES[tone] || PILL_TONES.neutral
      )}
    >
      {children}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      {children}
    </span>
  );
}

function Card({ title, subtitle, right, children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-300/60 bg-white shadow-sm transition-all duration-300 hover:border-blue-200", className)}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/20">
          <div>
            {title && <div className="text-[13px] font-bold text-slate-900">{title}</div>}
            {subtitle && <div className="mt-0.5 text-[10.5px] font-medium text-slate-400">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function KV({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2.5 border-b border-slate-50 py-2 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400">
        {Icon && <Icon className="h-3.5 w-3.5 opacity-45" />}
        {label}
      </span>
      <span className="max-w-[60%] break-words text-right text-[11.5px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-300/60 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200">
      <div className="text-xl font-black tracking-tight tabular-nums text-slate-900">{value}</div>
      <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function GoalTile({ label, value, pct }) {
  return (
    <div className="rounded-2xl border border-slate-300/60 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200">
      <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-base font-black tabular-nums text-slate-900">{value}</div>
      {pct !== undefined && (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: APP_COLORS[0] }} />
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-300 border border-slate-100">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-[11.5px] font-bold text-slate-600">{title}</div>
      {subtitle && <div className="max-w-[280px] text-[10.5px] font-medium text-slate-400">{subtitle}</div>}
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
        variant === "primary" && "border-[#007FC0] bg-[#007FC0] text-white hover:bg-[#006699] hover:border-[#006699]",
        variant === "danger" && "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700",
        variant === "outline" && "border-slate-300/60 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
    const bmiPct = bmi ? Math.min(100, Math.max(0, ((bmi - 15) / (35 - 15)) * 100)) : 0;
    const age = ageFromDob(user.dob);
    const macroTotal = (user.carbs_goal || 0) + (user.fat_goal || 0) + (user.protein_goal || 0);
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
      ["Diet Preference", user.vegetarian === null ? null : user.vegetarian ? "Vegetarian" : "Non-Vegetarian"],
    ];
    const fitnessProfileSet = fitnessProfileFields.filter(([, v]) => v);
    const fitnessProfileMissing = fitnessProfileFields.filter(([, v]) => !v);
    const parsedActivities = (user.recent_activities || [])
      .filter((a) => a.type !== "program_assigned" && a.type !== "fitzone_assigned");
    return { height, weight, bmi, bmiCat, bmiPct, age, macroTotal, macros, fitnessProfileSet, fitnessProfileMissing, fitnessProfileFields, parsedActivities };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full mx-auto max-w-[1180px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#007FC0]" />
        <p className="text-sm text-slate-500 mt-4 font-medium animate-pulse">Loading user profile...</p>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2000);
  };

  const handleCopy = (value, label) => {
    navigator.clipboard?.writeText(String(value)).catch(() => { });
    showToast(`${label} copied`);
  };

  const { height, weight, bmi, bmiCat, bmiPct, age, macroTotal, macros, fitnessProfileSet, fitnessProfileMissing, fitnessProfileFields, parsedActivities } = derived;

  const es = user.engagement_stats || {};
  const as = user.activity_summary || {};
  const waterGoal = user.water_goal || 0;
  const caloriesGoal = user.calories_goal || 0;
  const targetSteps = parseInt(user.targetSteps || "0", 10);
  const programs = user.programs || [];
  const fitzoneStatus = user.fitzone_status || [];

  return (
    <Container title="User Profile" subtitle="Manage and view detailed user information">
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
              <img src={user.avatar} alt="Avatar" className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 ring-4 ring-white shadow-sm">
                {initials(user.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-white shadow-sm">
              <Pill tone={user.revoked_at ? "danger" : (user.status === "Active" ? "success" : "neutral")}>
                {user.revoked_at ? "Revoked" : user.status}
              </Pill>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.mobile}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Pill tone="info">UID: {user.id}</Pill>
              <Pill tone="info">Age {age}</Pill>
              <Pill tone={user.gender === "Female" ? "purple" : "blue"}>{user.gender}</Pill>
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
          <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Kpi label="Programs Enrolled" value={es.programs_enrolled || 0} />
                <Kpi label="Fitzone Assignments" value={es.fitzone_assignments || 0} />
                <Kpi label="Step Logs" value={es.step_logs_count || 0} />
                <Kpi label="Days Active (30d)" value={es.days_active_last_30_days || 0} />
              </div>

              <Card title="Daily Targets" subtitle="Nutrition & step goals">
                <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <GoalTile label="Water Goal" value={`${waterGoal.toLocaleString()} ml`} pct={Math.min(100, (waterGoal / 4000) * 100)} />
                  <GoalTile label="Calories Goal" value={`${caloriesGoal.toLocaleString()} kcal`} pct={Math.min(100, (caloriesGoal / 3500) * 100)} />
                  <GoalTile label="Step Target" value={targetSteps.toLocaleString()} pct={Math.min(100, (targetSteps / 12000) * 100)} />
                </div>
                <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Macro split</div>
                <div className="mb-2.5 flex h-2 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
                  {macros.map((m) => (
                    <div key={m.label} style={{ width: `${macroTotal ? ((m.v / macroTotal) * 100).toFixed(1) : 0}%`, background: m.color }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3.5">
                  {macros.map((m) => (
                    <div key={m.label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-sm" style={{ background: m.color }} />
                      {m.label} · {m.v}g
                    </div>
                  ))}
                </div>
              </Card>

              {user.most_used_feature && (
                <Card title="Most Used Feature" subtitle="Highest logged activity in this account">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[12.5px] font-bold text-slate-900">{cap(user.most_used_feature?.feature)}</div>
                        <div className="text-[10.5px] font-medium text-slate-400">Last logged {timeAgo(es.last_active_at)}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold tabular-nums text-slate-900">{user.most_used_feature?.count}</div>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex flex-col gap-3.5">
              <Card
                title="Managed By"
                right={<Pill tone={user.sub_admin?.status === "Active" || user.sub_admin?.status === "1" ? "success" : "neutral"}>{user.sub_admin?.status === "1" ? "Active" : user.sub_admin?.status === "0" ? "Inactive" : user.sub_admin?.status}</Pill>}
              >
                {user.sub_admin ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-500">
                        {initials(user.sub_admin?.name)}
                      </div>
                      <div>
                        <div className="text-[12.5px] font-bold text-slate-900">{user.sub_admin?.name}</div>
                        <div className="text-[10.5px] font-medium text-slate-400">{user.sub_admin?.designation} · {user.sub_admin?.hospital}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <KV icon={Mail} label="Email" value={user.sub_admin?.email} />
                      <KV icon={Phone} label="Phone" value={user.sub_admin?.phone} />
                      <KV icon={Globe} label="Location" value={user.sub_admin?.location} />
                    </div>
                  </>
                ) : (
                  <EmptyState icon={User} title="No Sub-Admin Assigned" subtitle="This user is not managed by a specific sub-admin." />
                )}
              </Card>

              <Card title="Account">
                <KV icon={CreditCard} label="Payment" value={user.paid ? "Paid" : "Unpaid"} />
                <KV icon={ShieldCheck} label="Plan" value={user.plan ? cap(user.plan) : "No active plan"} />
                <KV icon={Bell} label="Notifications" value={user.notification_status ? "Enabled" : "Disabled"} />
                <KV icon={Calendar} label="Updated" value={fmtDate(user.updated_at)} />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Health & Goals ───────────────────────────────── */}
        <TabsContent value="health">
          <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-3.5">
              <Card title="Body Measurements" subtitle="Latest recorded height & weight">
                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                  <div className="flex items-center justify-between border-b border-slate-50 py-1.5">
                    <span className="text-[11px] font-medium text-slate-400">Height</span>
                    <span className="text-[11.5px] font-semibold text-slate-900">{height || "—"} cm</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 py-1.5">
                    <span className="text-[11px] font-medium text-slate-400">Weight</span>
                    <span className="text-[11.5px] font-semibold text-slate-900">{weight || "—"} kg</span>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
                  <div className="shrink-0 text-center">
                    <div className="text-lg font-bold tabular-nums text-slate-900">{bmi ? bmi.toFixed(1) : "—"}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">BMI</div>
                  </div>
                  <div className="flex-1">
                    <div
                      className="relative h-1.5 rounded-full opacity-90 bg-slate-200"
                      style={{ background: bmi ? "linear-gradient(90deg,#d97706 0%,#059669 35%,#059669 60%,#d97706 80%,#e11d48 100%)" : undefined }}
                    >
                      {bmi && <div className="absolute -top-1 h-3 w-0.5 rounded-sm bg-slate-900" style={{ left: `${bmiPct}%` }} />}
                    </div>
                    <div className="mt-1 flex justify-end">
                      <span className={cn("text-[10.5px] font-semibold", bmiCat.color)}>{bmiCat.label}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Daily Targets" subtitle="Nutrition & hydration">
                <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <GoalTile label="Water Goal" value={`${waterGoal.toLocaleString()} ml`} />
                  <GoalTile label="Calories Goal" value={`${caloriesGoal.toLocaleString()} kcal`} />
                  <GoalTile label="Step Target" value={targetSteps.toLocaleString()} />
                </div>
                <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Macro split (per meal)</div>
                <div className="mb-2.5 flex h-2 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
                  {macros.map((m) => (
                    <div key={m.label} style={{ width: `${macroTotal ? ((m.v / macroTotal) * 100).toFixed(1) : 0}%`, background: m.color }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3.5">
                  {macros.map((m) => (
                    <div key={m.label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-sm" style={{ background: m.color }} />
                      {m.label} · {m.v}g
                    </div>
                  ))}
                </div>
                <div className="mt-3.5">
                  <KV
                    icon={Droplet}
                    label="Fluid Restriction"
                    value={
                      user.fluid_restrictions
                        ? user.fluid_quantity
                          ? `${user.fluid_quantity} ml/day`
                          : "Restricted (quantity not set)"
                        : "None"
                    }
                  />
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-3.5">
              <Card title="Fitness Profile" subtitle="Goal & body-shape preferences">
                {fitnessProfileSet.map(([l, v]) => (
                  <KV key={l} label={l} value={v} />
                ))}
                {fitnessProfileMissing.length === fitnessProfileFields.length ? (
                  <EmptyState
                    icon={Target}
                    title="Fitness profile not completed"
                    subtitle="This client hasn't set up their fitness goal preferences yet."
                  />
                ) : fitnessProfileMissing.length ? (
                  <>
                    <div className="mb-2 mt-3.5 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Not yet set</div>
                    <div className="flex flex-wrap gap-1.5">
                      {fitnessProfileMissing.map(([l]) => (
                        <Tag key={l}>{l}</Tag>
                      ))}
                    </div>
                  </>
                ) : null}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Programs & Fitzone ───────────────────────────── */}
        <TabsContent value="programs">
          <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
            <Card title="Enrolled Programs" right={<span className="text-[10.5px] font-semibold text-slate-400">{programs.length}</span>}>
              {programs.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Program</th>
                      <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Duration</th>
                      <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map((p) => (
                      <tr key={p.program_id} className="border-b border-slate-50 last:border-b-0">
                        <td className="py-2.5 align-top">
                          <div className="text-[11.5px] font-semibold text-slate-900">{p.title}</div>
                          <div className="mt-0.5 text-[10.5px] text-slate-400">Assigned {fmtDate(p.assigned_at)}</div>
                        </td>
                        <td className="py-2.5 align-top text-[11.5px]">
                          {p.start_date ? `${fmtDate(p.start_date)} – ${fmtDate(p.end_date)}` : <span className="text-slate-400">Not scheduled</span>}
                        </td>
                        <td className="py-2.5 align-top">
                          <Pill tone={p.status === "Active" ? "success" : "neutral"}>{p.status}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState icon={Target} title="No Enrolled Programs" subtitle="This user is not enrolled in any programs." />
              )}
            </Card>

            <Card title="Fitzone Assignments" right={<span className="text-[10.5px] font-semibold text-slate-400">{fitzoneStatus.length}</span>}>
              {fitzoneStatus.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {fitzoneStatus.map((f) => (
                    <div key={f.category_id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2.5">
                      <div>
                        <div className="text-[11.5px] font-semibold text-slate-900">{f.category_title}</div>
                        <div className="mt-0.5 text-[10px] text-slate-400">Since {fmtDate(f.assigned_at)}</div>
                      </div>
                      <Pill tone={f.status === "Active" ? "success" : "neutral"}>{f.status}</Pill>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Activity} title="No Fitzone Assignments" subtitle="This user has no Fitzone assignments." />
              )}
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab: Activity ─────────────────────────────────────── */}
        <TabsContent value="activity">
          <>
            <div className="mb-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { l: "Steps", d: as.steps || {} },
                { l: "Water", d: as.water || {} },
                { l: "Food", d: as.food || {} },
                { l: "Weight", d: as.weight || {} },
              ].map((c) => (
                <div key={c.l} className="rounded-xl border border-slate-200 p-3.5 bg-white">
                  <div className="text-[10.5px] font-medium text-slate-400">{c.l}</div>
                  <div className="mt-1 text-[15px] font-bold tabular-nums text-slate-900">
                    {c.d.total_entries || 0} <span className="text-[10.5px] font-medium text-slate-400">entries</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {c.d.last_logged_at ? `Last: ${fmtDate(c.d.last_logged_at)}` : "No entries yet"}
                  </div>
                </div>
              ))}
            </div>

            <Card
              title="Recent Activity History"
              subtitle="All recent logs and events, newest first"
              right={<span className="text-[10.5px] font-semibold text-slate-400">{parsedActivities.length} records</span>}
            >
              <div className={cn("flex flex-col gap-3", parsedActivities.length > 0 ? "mt-2" : "")}>
                {parsedActivities.length > 0 ? (
                  parsedActivities.map((a, i) => {
                    const isWater = a.type === "water_log";
                    const isProgram = a.type === "program_assigned" || a.type === "fitzone_assigned";
                    const Icon = isWater ? Droplet : isProgram ? Target : Activity;
                    const gradient = isWater 
                      ? "from-blue-400 to-blue-600" 
                      : isProgram 
                        ? "from-purple-500 to-purple-600" 
                        : "from-emerald-400 to-emerald-600";
                    return (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <div className="text-[14px] font-bold text-slate-900 tracking-tight">
                              {a.title}
                            </div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                              {fmtDate(a.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState icon={Activity} title="No Activity Logs" subtitle="User hasn't recorded any recent activities." />
                )}
              </div>
            </Card>
          </>
        </TabsContent>

        {/* ── Tab: Account ──────────────────────────────────────── */}
        <TabsContent value="account">
          <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-3.5">
              <Card title="Account Status">
                <KV icon={ShieldCheck} label="Status" value={<Pill tone={user.revoked_at ? "danger" : (user.status === "Active" || user.status === "1" ? "success" : "neutral")}>{user.revoked_at ? "Revoked" : (user.status === "1" ? "Active" : user.status === "0" ? "Inactive" : user.status)}</Pill>} />
                <KV icon={ShieldOff} label="Admin Status" value={user.admin_status || "—"} />
                <KV icon={Mail} label="Email Verified" value={user.email_verified_at ? fmtDate(user.email_verified_at) : "No"} />
                <KV icon={Ban} label="Revoked" value={user.revoked_at ? fmtDate(user.revoked_at) : "No"} />
                <KV icon={Calendar} label="Created" value={fmtDate(user.created_at)} />
                <KV icon={Calendar} label="Updated" value={fmtDate(user.updated_at)} />
              </Card>

              <Card title="Billing">
                <KV icon={CreditCard} label="Payment Status" value={user.paid ? "Paid" : "Unpaid"} />
                <KV icon={ShieldCheck} label="Plan" value={user.plan ? user.plan.title : "No active plan"} />
                <KV icon={Calendar} label="Plan Expiry" value={user.plan_expiry ? fmtDate(user.plan_expiry) : "—"} />
                <KV icon={CreditCard} label="Stripe ID" value={user.stripe_id || "Not linked"} />
                {(!user.transactions || user.transactions.length === 0) && (
                  <EmptyState icon={CreditCard} title="No transactions yet" />
                )}
              </Card>
            </div>

            <div className="flex flex-col gap-3.5">
              <Card title="Device & Notifications">
                <KV icon={Bell} label="Notifications" value={user.notification_status ? "Enabled" : "Disabled"} />
                <KV icon={Globe} label="Timezone" value={user.timezone || "Not set"} />
                <div className="flex items-center justify-between gap-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400">
                    <Smartphone className="h-3 w-3 opacity-45" />
                    Device Token
                  </span>
                  <button
                    type="button"
                    title={user.device_token}
                    onClick={() => handleCopy(user.device_token, "Device token")}
                    className="font-mono text-[10.5px] font-semibold text-slate-900 transition-colors hover:text-[#007fc0]"
                  >
                    {truncMid(user.device_token, 10, 6)}
                  </button>
                </div>
              </Card>

              <Card
                title="Managed By"
                right={<Pill tone={user.sub_admin?.status === "Active" || user.sub_admin?.status === "1" ? "success" : "neutral"}>{user.sub_admin?.status === "1" ? "Active" : user.sub_admin?.status === "0" ? "Inactive" : user.sub_admin?.status}</Pill>}
              >
                {user.sub_admin ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-500">
                        {initials(user.sub_admin?.name)}
                      </div>
                      <div>
                        <div className="text-[12.5px] font-bold text-slate-900">{user.sub_admin?.name}</div>
                        <div className="text-[10.5px] font-medium text-slate-400">{user.sub_admin?.designation} · {user.sub_admin?.hospital}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <KV icon={Mail} label="Email" value={user.sub_admin?.email} />
                      <KV icon={Phone} label="Phone" value={user.sub_admin?.phone} />
                      <KV icon={Globe} label="Location" value={user.sub_admin?.location} />
                    </div>
                  </>
                ) : (
                  <EmptyState icon={User} title="No Sub-Admin Assigned" subtitle="This user is not managed by a specific sub-admin." />
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </Container>
  );
}
