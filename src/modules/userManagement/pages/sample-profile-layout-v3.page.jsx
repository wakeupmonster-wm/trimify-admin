import React from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Target,
  Flame,
  Activity,
  Shield,
  Footprints,
  Award,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
  status: "Active",
  created_at: "2026-07-18T10:36:46.000000Z",
  weight_goal: 40,
  main_goal: "Lose Weight",
  body_shape: "Hourglass",
  body_shape_goal: "Hourglass",
  fitness_level: "Intermediate",
  vegetarian: 0,
  paid: 1,
  engagement_stats: {
    total_logins: 6,
    workouts_completed: 12,
    programs_enrolled: 1,
    blogs_read: 4,
    sessions_completed: 8,
    days_active: 5,
  },
};

const HeroStat = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col items-center sm:items-start gap-0.5 px-4 sm:px-6 border-l first:border-l-0 border-white/20">
    <span className="text-xl sm:text-2xl font-black text-white leading-none">
      {value}
    </span>
    <span className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </span>
  </div>
);

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-brand-aqua" />} {title}
    </h3>
    {children}
  </div>
);

const NutrientProgress = ({ label, value, target, unit }) => {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-semibold text-slate-400">
          {value}
          {unit} / {target}
          {unit}
        </span>
      </div>
      <Progress value={pct} className="h-2 bg-slate-100" />
    </div>
  );
};

export default function SampleProfileLayoutV3Page() {
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
                subheading="Hero banner layout — stat-forward overview with progress tracking."
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

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-app-primary2 via-app-primary2 to-slate-900 shadow-sm">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_55%)]" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8">
            <div className="flex items-center gap-5 min-w-0">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/20 shadow-lg shrink-0">
                <AvatarImage src={USER_DATA.image} alt={USER_DATA.name} />
                <AvatarFallback className="bg-white/10 text-white text-3xl font-black uppercase">
                  {USER_DATA.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white capitalize truncate">
                    {USER_DATA.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className="rounded-xl px-2 py-0.5 text-[10px] font-bold capitalize bg-emerald-400/20 text-emerald-100 border-emerald-300/30"
                  >
                    {USER_DATA.status}
                  </Badge>
                  {!!USER_DATA.paid && (
                    <Badge className="rounded-xl px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-100 border-amber-300/30 border">
                      <Award className="w-3 h-3 mr-1" /> PRO
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {USER_DATA.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {USER_DATA.mobileNo}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Joined{" "}
                    {formatDate(USER_DATA.created_at)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit h-8 mt-1 text-xs font-bold rounded-lg bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <Lock className="mr-1.5 h-3.5 w-3.5" /> Reset Password
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-0 flex-wrap w-full lg:w-auto overflow-x-auto">
              <HeroStat
                label="Age"
                value={calculateAge(USER_DATA.dob)}
                icon={Calendar}
              />
              <HeroStat
                label="BMI"
                value={calculateBMI(USER_DATA.height, USER_DATA.weight)}
                icon={TrendingUp}
              />
              <HeroStat
                label="Workouts"
                value={USER_DATA.engagement_stats.workouts_completed}
                icon={Activity}
              />
              <HeroStat
                label="Active Days"
                value={USER_DATA.engagement_stats.days_active}
                icon={Footprints}
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-w-0 pb-8">
          <div className="xl:col-span-7 flex flex-col gap-4 sm:gap-6 min-w-0">
            <InfoCard title="Daily Nutrition Progress" icon={Flame}>
              <div className="flex flex-col gap-5">
                <NutrientProgress
                  label="Calories"
                  value={1180}
                  target={USER_DATA.calories_goal}
                  unit=" kcal"
                />
                <NutrientProgress
                  label="Protein"
                  value={32}
                  target={USER_DATA.protein_goal}
                  unit="g"
                />
                <NutrientProgress
                  label="Carbs"
                  value={28}
                  target={USER_DATA.carbs_goal}
                  unit="g"
                />
                <NutrientProgress
                  label="Fat"
                  value={19}
                  target={USER_DATA.fat_goal}
                  unit="g"
                />
                <NutrientProgress
                  label="Water"
                  value={1400}
                  target={USER_DATA.water_goal}
                  unit="ml"
                />
              </div>
            </InfoCard>

            <InfoCard title="Body Goals & Fitness Aims" icon={Target}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Primary Goal
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {USER_DATA.main_goal}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Fitness Level
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {USER_DATA.fitness_level}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Body Shape
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {USER_DATA.body_shape}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Target Shape
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {USER_DATA.body_shape_goal}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>

          <div className="xl:col-span-5 flex flex-col gap-4 sm:gap-6 min-w-0">
            <InfoCard title="Measurements" icon={Ruler}>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4 gap-1">
                  <Ruler className="w-4 h-4 text-brand-aqua" />
                  <span className="text-lg font-black text-slate-800">
                    {USER_DATA.height}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Height (cm)
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4 gap-1">
                  <Weight className="w-4 h-4 text-brand-aqua" />
                  <span className="text-lg font-black text-slate-800">
                    {USER_DATA.weight}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Weight (kg)
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4 gap-1">
                  <Target className="w-4 h-4 text-brand-aqua" />
                  <span className="text-lg font-black text-slate-800">
                    {USER_DATA.weight_goal}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Target (kg)
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Engagement Overview" icon={Activity}>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(USER_DATA.engagement_stats).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b border-slate-100 pb-2.5 last:border-0"
                    >
                      <span className="text-xs font-semibold text-slate-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {value}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </InfoCard>

            <InfoCard title="Security" icon={Shield}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-semibold text-slate-600">
                  Two Factor Auth
                </span>
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-500 border-none shadow-none rounded"
                >
                  Disabled
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-slate-600">
                  Email Verified
                </span>
                <Badge
                  variant="outline"
                  className="bg-rose-50 text-rose-500 border-none shadow-none rounded"
                >
                  No
                </Badge>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </Container>
  );
}
