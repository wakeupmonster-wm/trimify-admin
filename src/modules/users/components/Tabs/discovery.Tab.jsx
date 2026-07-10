import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  IconMapPin,
  IconSearch,
  IconWorld,
  IconFilter,
  IconUsers,
  IconHeart,
  IconMoodSmile,
  IconSchool,
  IconUsersGroup,
  IconBrain,
  IconMessage2,
  IconPaw,
  IconGlassFull,
  IconSmoking,
  IconBarbell,
  IconLeaf,
  IconDeviceMobile,
  IconMoon,
} from "@tabler/icons-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { LuActivity } from "react-icons/lu";
import { cn } from "@/lib/utils";

const FILTER_CONFIG = [
  { key: "zodiac", label: "Zodiac", Icon: IconMoodSmile },
  { key: "education", label: "Education", Icon: IconSchool },
  { key: "familyPlans", label: "Family Plans", Icon: IconUsersGroup },
  { key: "personalityType", label: "Personality", Icon: IconBrain },
  { key: "communicationStyle", label: "Communication", Icon: IconMessage2 },
  { key: "loveStyle", label: "Love Style", Icon: IconHeart },
  { key: "pets", label: "Pets", Icon: IconPaw },
  { key: "drinking", label: "Drinking", Icon: IconGlassFull },
  { key: "smoking", label: "Smoking", Icon: IconSmoking },
  { key: "workout", label: "Workout", Icon: IconBarbell },
  { key: "dietary", label: "Dietary", Icon: IconLeaf },
  { key: "socialMedia", label: "Social Media", Icon: IconDeviceMobile },
  { key: "sleeping", label: "Sleeping", Icon: IconMoon },
];

export const DiscoveryTab = ({ discovery, attributes }) => {
  const filters = discovery?.discoveryFilters || {};

  return (
    <TabsContent
      value="discovery"
      className="mt-6 focus-visible:ring-offset-0 focus-visible:ring-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {/* LEFT COLUMN: Main Settings (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DISCOVERY PREFERENCES */}
          <Card className="border-slate-200 gap-4 shadow-sm rounded-2xl pb-10 overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Discovery Preferences"
                  subtitle="Who they are looking for"
                  Icon={IconSearch}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-8 space-y-4">
              <DiscoveryRow
                icon={<IconHeart size={16} />}
                label="Relationship"
                value={attributes?.relationshipGoal || "Not Set"}
              />
              <DiscoveryRow
                icon={<IconUsers size={16} />}
                label="Interested In"
                value={
                  discovery?.showMeGender?.length > 0
                    ? discovery.showMeGender.join(", ")
                    : "Open"
                }
              />
            </CardContent>
          </Card>

          {/* 2. ADVANCED SEARCH FILTERS */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Advanced Search Filters"
                  subtitle="Specific attributes the user is looking for"
                  Icon={IconFilter}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
                <Badge
                  variant="outline"
                  className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
                >
                  {
                    Object.values(filters).filter(
                      (v) => Array.isArray(v) && v.length > 0,
                    ).length
                  }{" "}
                  Active Categories
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 px-4">
              {Object.values(filters).some(
                (val) => Array.isArray(val) && val.length > 0,
              ) ? (
                <div className="divide-y divide-slate-200">
                  {FILTER_CONFIG.map((item) => (
                    <FilterRow
                      key={item.key}
                      {...item}
                      values={filters[item.key]}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-foreground/80 py-20 px-10 text-center">
                  <div className="w-16 h-12 bg-slate-50 rounded-full flex items-center justify-center transition-all duration-500">
                    <IconFilter className="w-8 h-8 opacity-60" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase opacity-70">
                    No Filters Selected
                  </h4>
                  <p className="text-[11px] font-medium text-muted-foreground opacity-60 mt-1 max-w-[200px]">
                    This user hasn't selected any specific discovery attributes
                    yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Range Filters & Visibility (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* 3. AGE PREFERENCE */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white py-5 transition-all duration-300">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between pb-0">
                <DashboardHead
                  title="Age Preference"
                  titlestyle={"text-xs !text-slate-500 uppercase"}
                  // subtitle="Age preferences for discovery"
                  Icon={LuActivity}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {discovery?.ageRange?.min || 18} —{" "}
                  {discovery?.ageRange?.max || 60}
                </span>
                <span className="text-xs font-bold text-secondary-foreground uppercase">
                  years
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-brand-aqua rounded-full"
                    style={{
                      left: `${((discovery?.ageRange?.min - 18) / (60 - 18)) * 100}%`,
                      right: `${100 - ((discovery?.ageRange?.max - 18) / (60 - 18)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-secondary-foreground">
                  <span>18 yrs</span>
                  <span>60 yrs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. SEARCH DISTANCE */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white py-5 transition-all duration-300">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between">
                <DashboardHead
                  title="Search Distance"
                  titlestyle={"text-xs !text-slate-500 uppercase"}
                  // subtitle="Distance preferences for discovery"
                  Icon={IconMapPin}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>

            <div className="px-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {discovery?.distanceRange || 0}
                </span>
                <span className="text-xs font-bold text-secondary-foreground uppercase">
                  km
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-brand-aqua rounded-full"
                    style={{
                      width: `${(discovery?.distanceRange / 500) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-secondary-foreground">
                  <span>0 km</span>
                  <span>500 km</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 5. GLOBAL VISIBILITY */}
          <Card className="border-slate-200 shadow-sm py-5 rounded-2xl overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100/50 rounded-xl text-slate-600">
                    <IconWorld size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-muted-foreground/50 capitalize">
                      Global Visibility
                    </p>
                    <p className="text-sm font-bold text-foreground/70 capitalize">
                      {discovery?.globalVisibility === "private"
                        ? "Private"
                        : "Everyone (Public)"}
                    </p>
                  </div>
                </div>
                {(() => {
                  const config = {
                    everyone: {
                      label: "PUBLIC",
                      className:
                        "bg-emerald-50 text-emerald-600 border-emerald-100",
                    },
                    private: {
                      label: "PRIVATE",
                      className: "bg-rose-50 text-rose-600 border-rose-100",
                    },
                  };
                  const status =
                    config[discovery?.globalVisibility] || config.everyone;

                  return (
                    <Badge
                      className={cn(
                        "rounded-2xl text-[10px] font-bold tracking-widest px-3 py-1 shadow-none border",
                        status.className,
                      )}
                      variant="outline"
                    >
                      {status.label}
                    </Badge>
                  );
                })()}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

// --- SUB-COMPONENTS ---

const DiscoveryRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group p-4 bg-slate-100/60 rounded-xl border border-slate-100/50">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-200/50 rounded-full text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <p className="text-[15px] font-semibold text-secondary-foreground">
        {label}
      </p>
    </div>
    <p className="text-[13px] font-semibold text-foreground/70 mt-1 capitalize">
      {value}
    </p>
  </div>
);

const FilterRow = ({ Icon, label, values }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 px-2 group border-b border-slate-200/50 last:border-none hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
      <div className="p-2 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0">
        <Icon size={16} />
      </div>
      <span className="text-[14px] font-semibold text-foreground/70 whitespace-nowrap">{label}</span>
    </div>
    <div className="flex flex-wrap justify-end gap-1.5 max-w-[55%] pt-0.5">
      {Array.isArray(values) && values.length > 0 ? (
        values.map((v, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="bg-white border border-slate-200 text-slate-800 font-medium capitalize text-[12px] rounded-md px-2.5 py-1 shadow-sm"
          >
            {v}
          </Badge>
        ))
      ) : (
        <span className="text-xs text-slate-300 italic font-medium pt-1">
          Not Specified
        </span>
      )}
    </div>
  </div>
);
