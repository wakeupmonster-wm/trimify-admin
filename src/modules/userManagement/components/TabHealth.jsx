import React from "react";
import {
  Droplet,
  Target,
  Flame,
  Footprints,
  Scale,
  Dumbbell,
  Activity,
  Calendar,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, KV, EmptyState, Tag } from "./UserProfileShared";
import { LuUserRound } from "react-icons/lu";

const getFitnessIcon = (label) => {
  const l = (label || "").toLowerCase();
  if (l.includes("weight goal")) return Scale;
  if (l.includes("main goal")) return Target;
  if (l.includes("current body shape") || l.includes("goal body shape"))
    return LuUserRound;
  if (l.includes("timeline")) return Calendar;
  if (l.includes("fitness level")) return Dumbbell;
  if (l.includes("diet")) return Utensils;
  return Activity;
};

function ActivityRing({
  value,
  max,
  label,
  unit,
  icon: Icon,
  colorClass,
  textClass,
  bgLightClass,
}) {
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-200">
      <div className="relative flex items-center justify-center h-24 w-24 mb-3">
        <svg
          className="h-full w-full -rotate-90 transform drop-shadow-sm"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="9"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={cn(
              "transition-all duration-1000 ease-out drop-shadow-sm",
              textClass,
            )}
            stroke="currentColor"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full m-6",
            bgLightClass,
          )}
        >
          <Icon className={cn("w-5 h-5", textClass)} />
        </div>
      </div>
      <div className="text-center w-full">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
          {label}
        </div>
        <div className="text-[13px] font-black tabular-nums text-slate-900 leading-tight">
          {value.toLocaleString()}{" "}
          <span className="text-[10px] font-bold text-slate-400">
            / {max.toLocaleString()} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TabHealth({ data }) {
  const {
    user,
    waterGoal,
    caloriesGoal,
    targetSteps,
    height,
    weight,
    bmi,
    bmiCat,
    bmiPct,
    macroTotal,
    macros,
    fitnessProfileSet,
    fitnessProfileMissing,
    fitnessProfileFields,
  } = data;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <Card
            title="Body Measurements"
            subtitle="Latest recorded height & weight"
            icon={Scale}
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs font-medium text-slate-500">
                  Height
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {height || "—"} cm
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs font-medium text-slate-500">
                  Weight
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {weight || "—"} kg
                </span>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <div className="shrink-0 text-center">
                <div className="text-lg font-bold tabular-nums text-slate-900">
                  {bmi ? bmi.toFixed(1) : "—"}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  BMI
                </div>
              </div>
              <div className="flex-1">
                <div
                  className="relative h-1.5 rounded-full opacity-90 bg-slate-200"
                  style={{
                    background: bmi
                      ? "linear-gradient(90deg,#d97706 0%,#059669 35%,#059669 60%,#d97706 80%,#e11d48 100%)"
                      : undefined,
                  }}
                >
                  {bmi && (
                    <div
                      className="absolute -top-1 h-3 w-0.5 rounded-sm bg-slate-900"
                      style={{ left: `${bmiPct}%` }}
                    />
                  )}
                </div>
                <div className="mt-1 flex justify-end">
                  <span
                    className={cn("text-[10.5px] font-semibold", bmiCat.color)}
                  >
                    {bmiCat.label}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Daily Targets"
            subtitle="Nutrition, hydration & step goals"
            icon={Target}
          >
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ActivityRing
                icon={Droplet}
                label="Water Goal"
                value={waterGoal}
                max={4000}
                unit="ml"
                textClass="text-sky-500"
                bgLightClass="bg-sky-50"
              />
              <ActivityRing
                icon={Flame}
                label="Calories Goal"
                value={caloriesGoal}
                max={3500}
                unit="kcal"
                textClass="text-orange-500"
                bgLightClass="bg-orange-50"
              />
              <ActivityRing
                icon={Footprints}
                label="Step Target"
                value={targetSteps}
                max={12000}
                unit=""
                textClass="text-emerald-500"
                bgLightClass="bg-emerald-50"
              />
            </div>

            <div className="mb-3 text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
              Macro split (per meal)
            </div>
            <div className="mb-3 flex h-2 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
              {macros.map((m) => (
                <div
                  key={m.label}
                  style={{
                    width: `${macroTotal ? ((m.v / macroTotal) * 100).toFixed(1) : 0}%`,
                    background: m.color,
                  }}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-3.5 pb-4">
              {macros.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-sm"
                    style={{ background: m.color }}
                  />
                  {m.label} · {m.v}g
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-3.5">
          <Card
            title="Fitness Profile"
            subtitle="Goal & body-shape preferences"
            icon={Dumbbell}
          >
            {fitnessProfileSet.map(([l, v]) => (
              <KV
                key={l}
                icon={getFitnessIcon(l)}
                label={l}
                value={v}
                noBorder={true}
              />
            ))}
            {fitnessProfileMissing.length === fitnessProfileFields.length ? (
              <EmptyState
                icon={Target}
                title="Fitness profile not completed"
                subtitle="This client hasn't set up their fitness goal preferences yet."
              />
            ) : fitnessProfileMissing.length ? (
              <>
                <div className="mb-2 mt-3.5 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                  Not yet set
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fitnessProfileMissing.map(([l]) => (
                    <Tag key={l}>{l}</Tag>
                  ))}
                </div>
              </>
            ) : null}
          </Card>

          <Card
            title="Medical Constraints"
            subtitle="Fluid restrictions and special requirements"
            icon={Activity}
            className={"gap-0"}
          >
            <div className="flex items-center justify-between group p-4 bg-slate-100/60 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-200/50 rounded-full text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Droplet className="w-5 h-5"/>
                </div>
                <p className="text-[15px] font-semibold text-muted-foreground">
                  Fluid Restriction
                </p>
              </div>
              <p className="text-[13px] font-semibold text-foreground/70 mt-1 capitalize">
                {user.fluid_restrictions == 1 ||
                user.fluid_restrictions === true ||
                user.fluid_restrictions === "Yes"
                  ? user.fluid_quantity
                    ? `${user.fluid_quantity} ml/day`
                    : "Restricted (quantity not set)"
                  : "None"}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
