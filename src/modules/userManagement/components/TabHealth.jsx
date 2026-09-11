import React from "react";
import {
  Droplet,
  Target,
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

function BodyMeasurementSummary({ height, weight, bmi, bmiCat, bmiPct }) {
  const hasBmi = Number.isFinite(Number(bmi));
  const safeBmiPct = Math.min(
    100,
    Math.max(0, Number.isFinite(Number(bmiPct)) ? Number(bmiPct) : 0),
  );

  const displayHeight =
    height !== null && height !== undefined && height !== ""
      ? `${height} cm`
      : "—";

  const displayWeight =
    weight !== null && weight !== undefined && weight !== ""
      ? `${weight} kg`
      : "—";

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-[linear-gradient(135deg,#f0f9ff_0%,#f8fafc_64%,#ffffff_100%)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start gap-3 p-3.5 sm:flex-nowrap sm:items-center sm:gap-4 sm:px-4 sm:py-4">
        {/* BMI signal */}
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[7px] border-sky-100 border-t-[#007FC0] bg-white text-[10px] font-extrabold tracking-[0.04em] text-sky-700">
          BMI
        </div>

        {/* Primary value */}
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[11px] font-semibold leading-4 text-slate-500">
            Current BMI
          </p>

          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <p className="m-0 text-[27px] font-extrabold leading-none tracking-[-0.04em] text-slate-900 tabular-nums sm:text-[28px]">
              {hasBmi ? Number(bmi).toFixed(1) : "—"}
            </p>

            {hasBmi && bmiCat?.label ? (
              <span
                className={cn(
                  "mb-0.5 rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-[10px] font-bold leading-4",
                  bmiCat?.color || "text-slate-600",
                )}
              >
                {bmiCat.label}
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-[10px] font-medium leading-[1.4] text-slate-400">
            Based on latest recorded height &amp; weight
          </p>
        </div>

        {/* Supporting measurements */}
        <div className="grid w-full grid-cols-2 gap-2 pl-0 min-[421px]:pl-[60px] sm:w-auto sm:border-l sm:border-sky-100 sm:pl-4">
          <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white/75 px-3 py-2.5 sm:min-w-[100px]">
            <p className="mb-1 text-[10px] font-bold uppercase leading-[1.2] tracking-[0.045em] text-slate-500">
              Height
            </p>
            <p className="text-[16px] font-extrabold leading-[1.1] tracking-[-0.025em] text-slate-900 tabular-nums">
              {displayHeight}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white/75 px-3 py-2.5 sm:min-w-[100px]">
            <p className="mb-1 text-[10px] font-bold uppercase leading-[1.2] tracking-[0.045em] text-slate-500">
              Weight
            </p>
            <p className="text-[16px] font-extrabold leading-[1.1] tracking-[-0.025em] text-slate-900 tabular-nums">
              {displayWeight}
            </p>
          </div>
        </div>
      </div>

      {/* BMI category range */}
      <div className="border-t border-sky-100/80 px-3.5 py-3 sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.045em] text-slate-400">
            BMI range
          </span>

          <span
            className={cn(
              "text-[10.5px] font-semibold",
              hasBmi ? bmiCat?.color || "text-slate-600" : "text-slate-400",
            )}
          >
            {hasBmi ? bmiCat?.label || "Calculated" : "No BMI data"}
          </span>
        </div>

        <div
          className="relative h-1.5 rounded-full bg-slate-200 opacity-90"
          style={{
            background: hasBmi
              ? "linear-gradient(90deg,#d97706 0%,#059669 35%,#059669 60%,#d97706 80%,#e11d48 100%)"
              : undefined,
          }}
        >
          {hasBmi ? (
            <div
              className="absolute -top-1 h-3 w-0.5 rounded-sm bg-slate-900 shadow-[0_0_0_2px_rgba(255,255,255,0.8)]"
              style={{ left: `${safeBmiPct}%` }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TabHealth({ data }) {
  const {
    user,
    height,
    weight,
    bmi,
    bmiCat,
    bmiPct,
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
            <BodyMeasurementSummary
              height={height}
              weight={weight}
              bmi={bmi}
              bmiCat={bmiCat}
              bmiPct={bmiPct}
            />
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
                  <Droplet className="w-5 h-5" />
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
        </div>
      </div>
    </>
  );
}
