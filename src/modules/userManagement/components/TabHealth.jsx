import React from "react";
import { Droplet, Target, Flame, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, GoalTile, KV, EmptyState, Tag } from "./UserProfileShared";

export function TabHealth({ data }) {
  const {
    user, waterGoal, caloriesGoal, targetSteps, height, weight, bmi, bmiCat, bmiPct, macroTotal,
    macros, fitnessProfileSet, fitnessProfileMissing, fitnessProfileFields,
  } = data;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <Card
            title="Body Measurements"
            subtitle="Latest recorded height & weight"
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div className="flex items-center justify-between border-b border-slate-50 py-1.5">
                <span className="text-xs font-medium text-slate-500">
                  Height
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {height || "—"} cm
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 py-1.5">
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

          <Card title="Daily Targets" subtitle="Nutrition, hydration & step goals">
            <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <GoalTile
                icon={Droplet}
                label="Water Goal"
                value={`${waterGoal.toLocaleString()} ml`}
                pct={Math.min(100, (waterGoal / 4000) * 100)}
                colorClass="bg-sky-500"
                textClass="text-sky-500"
                bgLightClass="bg-sky-50"
              />
              <GoalTile
                icon={Flame}
                label="Calories Goal"
                value={`${caloriesGoal.toLocaleString()} kcal`}
                pct={Math.min(100, (caloriesGoal / 3500) * 100)}
                colorClass="bg-orange-500"
                textClass="text-orange-500"
                bgLightClass="bg-orange-50"
              />
              <GoalTile
                icon={Footprints}
                label="Step Target"
                value={targetSteps.toLocaleString()}
                pct={Math.min(100, (targetSteps / 12000) * 100)}
                colorClass="bg-emerald-500"
                textClass="text-emerald-500"
                bgLightClass="bg-emerald-50"
              />
            </div>

            <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
              Macro split (per meal)
            </div>
            <div className="mb-2.5 flex h-2 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
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
            <div className="flex flex-wrap gap-3.5">
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
            <div className="mt-3.5 pb-3">
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
          <Card
            title="Fitness Profile"
            subtitle="Goal & body-shape preferences"
          >
            {fitnessProfileSet.map(([l, v]) => (
              <KV key={l} label={l} value={v} noBorder={true} />
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
        </div>
      </div>
    </>
  );
}
