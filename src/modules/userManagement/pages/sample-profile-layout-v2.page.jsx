import React from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Lock,
  Star,
  Calendar,
  Activity,
  Droplets,
  Flame,
  Target,
  Shield,
  Mail,
  Phone,
  Ruler,
  Weight,
  Globe,
  MapPin,
  Clock,
  History,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Provided JSON Payload Mock
const USER_DATA = {
  id: 1764,
  user_id: "rPkvz",
  name: "babah babab",
  email: "patelrajeev10ssa342@gmail.com",
  mobileNo: "9876543263",
  dob: "1997-01-01",
  height: "170.00",
  weight: "69.90",
  gender: "male",
  image: null,
  water_goal: 2500,
  calories_goal: 2000,
  carbs_goal: 50,
  fat_goal: 50,
  protein_goal: 50,
  email_verified_at: null,
  status: "Active",
  created_at: "2026-07-18T10:36:46.000000Z",
  updated_at: "2026-07-18T10:36:46.000000Z",
  weight_goal: 40,
  main_goal: "Lose Weight",
  body_shape: "Hourglass",
  body_shape_goal: "Hourglass",
  ideal_weight_period: "Right now",
  fitness_level: "Intermediate",
  vegetarian: 0,
  paid: 0,
  two_factor_enabled: false,
  engagement_stats: {
    total_logins: 6,
    workouts_completed: 0,
    programs_enrolled: 1,
    blogs_read: 0,
    sessions_completed: 0,
    days_active: 5,
  },
  recent_logins: [
    {
      browser: "Chrome on Windows",
      location: "Ahmedabad, IN",
      login_at: "2026-07-18T10:36:46.000000Z",
      is_current_session: true,
    },
    {
      browser: "Safari on iPhone",
      location: "Surat, IN",
      login_at: "2026-07-15T08:12:00.000000Z",
      is_current_session: false,
    },
  ],
};

const SectionCard = ({ title, icon: Icon, children, className }) => (
  <div
    className={cn(
      "bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col gap-5",
      className,
    )}
  >
    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-brand-aqua" />} {title}
    </h3>
    {children}
  </div>
);

const StatRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />} {label}
    </span>
    <span className="text-sm font-bold text-slate-800 capitalize">
      {value || "-"}
    </span>
  </div>
);

const GoalBar = ({ label, value, unit, max, colorClass }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default function SampleProfileLayoutV2Page() {
  const navigate = useNavigate();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const calculateBMI = (height, weight) => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    return (w / (h * h)).toFixed(1);
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex min-w-0 w-full lg:w-auto">
              <PageHeader
                heading={`User Directory / ${USER_DATA.name.split(" ")[0]}`}
                icon={
                  <User className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-app-primary2"
                subheading="Sidebar profile layout — quick facts alongside detailed sections."
              />
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/users")}
              className="w-full sm:w-auto h-11 sm:h-10 text-slate-600 hover:bg-slate-50 border-slate-300 rounded-xl px-4 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Back to Users</span>
            </Button>
          </div>
        </Header>

        {/* Split Layout: Sticky sidebar + scrolling content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-w-0 pb-8">
          {/* Sidebar */}
          <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0 xl:sticky xl:top-4 xl:self-start">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
              <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm">
                <AvatarImage src={USER_DATA.image} alt={USER_DATA.name} />
                <AvatarFallback className="bg-app-primary2/10 text-app-primary2 text-3xl font-black uppercase">
                  {USER_DATA.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-slate-900 capitalize">
                  {USER_DATA.name}
                </h2>
                <span className="text-xs text-slate-400 font-semibold">
                  ID: {USER_DATA.user_id} &bull; Age {calculateAge(USER_DATA.dob)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-xl px-2.5 py-0.5 text-[10px] font-bold capitalize",
                    USER_DATA.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-amber-50 text-amber-600 border-amber-100",
                  )}
                >
                  {USER_DATA.status}
                </Badge>
                {!!USER_DATA.paid && (
                  <Badge className="rounded-xl px-2.5 py-0.5 text-[10px] font-bold bg-app-primary2/10 text-app-primary2 border-none shadow-none">
                    <Star className="w-3 h-3 mr-1" /> PRO
                  </Badge>
                )}
              </div>

              <Separator className="my-2" />

              <div className="w-full flex flex-col">
                <StatRow label="Email" value={USER_DATA.email} icon={Mail} />
                <StatRow label="Mobile" value={USER_DATA.mobileNo} icon={Phone} />
                <StatRow
                  label="Joined"
                  value={formatDate(USER_DATA.created_at)}
                  icon={Calendar}
                />
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  <Lock className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Reset
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-xs font-bold rounded-lg border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700"
                >
                  Suspend
                </Button>
              </div>
            </div>

            <SectionCard title="Engagement" icon={Activity}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-800">
                    {USER_DATA.engagement_stats.total_logins}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Total Logins
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-800">
                    {USER_DATA.engagement_stats.days_active}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Active Days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-800">
                    {USER_DATA.engagement_stats.programs_enrolled}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Programs
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-800">
                    {USER_DATA.engagement_stats.workouts_completed}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Workouts
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Content */}
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
            <SectionCard title="Demographics & Measurements" icon={User}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <StatRow label="Gender" value={USER_DATA.gender} />
                <StatRow label="DOB" value={formatDate(USER_DATA.dob)} />
                <StatRow
                  label="Vegetarian"
                  value={USER_DATA.vegetarian ? "Yes" : "No"}
                />
                <StatRow
                  label="Fitness Level"
                  value={USER_DATA.fitness_level}
                />
                <StatRow
                  label="Height"
                  value={`${USER_DATA.height} cm`}
                  icon={Ruler}
                />
                <StatRow
                  label="Weight"
                  value={`${USER_DATA.weight} kg`}
                  icon={Weight}
                />
                <StatRow
                  label="Target Weight"
                  value={`${USER_DATA.weight_goal} kg`}
                  icon={Target}
                />
                <StatRow
                  label="Est. BMI"
                  value={calculateBMI(USER_DATA.height, USER_DATA.weight)}
                />
              </div>
            </SectionCard>

            <SectionCard title="Body Goals & Fitness Aims" icon={Target}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <StatRow label="Primary Goal" value={USER_DATA.main_goal} />
                <StatRow
                  label="Goal Timeline"
                  value={USER_DATA.ideal_weight_period}
                />
                <StatRow
                  label="Current Body Shape"
                  value={USER_DATA.body_shape}
                />
                <StatRow
                  label="Target Body Shape"
                  value={USER_DATA.body_shape_goal}
                />
              </div>
            </SectionCard>

            <SectionCard title="Daily Nutrition Targets" icon={Flame}>
              <div className="flex flex-col gap-4">
                <GoalBar
                  label="Calories"
                  value={USER_DATA.calories_goal}
                  unit=" kcal"
                  max={2500}
                  colorClass="bg-orange-500"
                />
                <GoalBar
                  label="Protein"
                  value={USER_DATA.protein_goal}
                  unit="g"
                  max={100}
                  colorClass="bg-blue-500"
                />
                <GoalBar
                  label="Carbs"
                  value={USER_DATA.carbs_goal}
                  unit="g"
                  max={100}
                  colorClass="bg-emerald-500"
                />
                <GoalBar
                  label="Fat"
                  value={USER_DATA.fat_goal}
                  unit="g"
                  max={100}
                  colorClass="bg-amber-500"
                />
                <GoalBar
                  label="Water"
                  value={USER_DATA.water_goal}
                  unit="ml"
                  max={4000}
                  colorClass="bg-cyan-500"
                />
              </div>
            </SectionCard>

            <SectionCard title="Security & Access" icon={Shield}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatRow
                  label="Two Factor Auth"
                  value={USER_DATA.two_factor_enabled ? "Enabled" : "Disabled"}
                />
                <StatRow
                  label="Email Verified"
                  value={USER_DATA.email_verified_at ? "Yes" : "No"}
                />
              </div>
            </SectionCard>

            <SectionCard title="Login History" icon={MonitorSmartphone}>
              <div className="flex flex-col gap-0 divide-y divide-slate-100">
                {USER_DATA.recent_logins.map((login, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-slate-50 rounded-lg shrink-0">
                        <Globe className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-700 truncate">
                          {login.browser}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {login.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 text-right gap-1">
                      {login.is_current_session ? (
                        <Badge className="bg-brand-aqua/10 text-brand-aqua hover:bg-brand-aqua/20 border-none shadow-none text-[9px] px-1.5 py-0">
                          Current
                        </Badge>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          {formatDate(login.login_at)}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(login.login_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </Container>
  );
}
