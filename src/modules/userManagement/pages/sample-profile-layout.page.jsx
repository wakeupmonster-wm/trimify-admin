import React, { useState } from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Settings,
  History,
  Lock,
  Star,
  Calendar,
  Activity,
  Droplets,
  Flame,
  Target,
  Shield,
  Smartphone,
  Mail,
  Phone,
  Ruler,
  Weight,
  Bell,
  Globe,
  Footprints,
  MapPin,
  Clock,
  Briefcase,
  MonitorSmartphone,
  CreditCard,
  Dumbbell,
  Video,
  Layers,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";

// Provided JSON Payload Mock
const USER_DATA = {
  id: 1764,
  stripe_id: null,
  user_id: "rPkvz",
  subadmin_id: 8,
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
  admin_status: null,
  device_token:
    "cRBqXrrrRHmh175ABHO8FK:APA91bFVHY3IKbGvbwbhLhmGNAZvzIPe8thMpSzgGAekC-JP9FVbhUZqEqzj16zW_PNiqYQEVGijdbOdcOzoYD7bUGYWdW5KnO5nlUFztYg87gNa-gz0mAA",
  notification_status: 1,
  created_at: "2026-07-18T10:36:46.000000Z",
  updated_at: "2026-07-18T10:36:46.000000Z",
  timezone: null,
  fluid_restrictions: 0,
  fluid_quantity: null,
  weight_goal: 40,
  main_goal: "Lose Weight",
  body_shape: "Hourglass",
  body_shape_goal: "Hourglass",
  ideal_weight_period: "Right now",
  fitness_level: "Intermediate",
  vegetarian: 0,
  plan: null,
  plan_expiry: null,
  revoked_at: null,
  paid: 0,
  targetSteps: "6000",
  sub_admin: {
    id: 8,
    name: "Self Registration",
    email: "registration@gmail.com",
    hospital: "DESA Consulting",
    location: "Australia",
    phone: "9999999999",
    designation: "Manager",
    password: "$2y$10$sTJgCrtonhA/RnTSE23wj.N9Jd4ZlbiUy8I/FdFvXLhR127wLJVDC",
    profile_image: null,
    otp: null,
    status: "Active",
    created_at: "2025-05-23T06:20:11.000000Z",
    updated_at: "2026-07-18T11:21:30.000000Z",
    role: 0,
    profile: null,
  },
  transactions: [],
  engagement_stats: {
    programs_enrolled: 1,
    fitzone_assignments: 4,
    water_logs_count: 0,
    step_logs_count: 0,
    weight_logs_count: 0,
    food_logs_count: 0,
    days_active_last_30_days: 0,
    last_active_at: null,
  },
  programs: [
    {
      program_id: 99,
      title: "8 Week Maintenance Program",
      status: "Active",
      start_date: "2026-07-18",
      end_date: "2026-09-12",
      assigned_at: "2026-07-18 20:36:46",
    },
  ],
  fitzone_status: [
    {
      category_id: 49,
      category_title: "Cardio Exercise",
      status: "Active",
      assigned_at: "2026-07-18 20:36:46",
    },
    {
      category_id: 50,
      category_title: "Resistance Band Training",
      status: "Active",
      assigned_at: "2026-07-18 20:36:46",
    },
    {
      category_id: 51,
      category_title: "Strength and Conditioning",
      status: "Active",
      assigned_at: "2026-07-18 20:36:46",
    },
    {
      category_id: 52,
      category_title: "Stretches",
      status: "Active",
      assigned_at: "2026-07-18 20:36:46",
    },
  ],
  activity_summary: {
    water: {
      total_entries: 0,
      last_logged_at: null,
    },
    weight: {
      total_entries: 0,
      last_logged_at: null,
    },
    food: {
      total_entries: 0,
      last_logged_at: null,
    },
    steps: {
      total_entries: 0,
      last_logged_at: null,
    },
  },
  most_used_feature: {
    feature: "fitzone",
    count: 4,
  },
  recent_activities: [
    {
      type: "fitzone_assigned",
      title: "Assigned to fitzone: Resistance Band Training",
      created_at: "2026-07-18 20:36:46",
    },
    {
      type: "fitzone_assigned",
      title: "Assigned to fitzone: Stretches",
      created_at: "2026-07-18 20:36:46",
    },
    {
      type: "fitzone_assigned",
      title: "Assigned to fitzone: Cardio Exercise",
      created_at: "2026-07-18 20:36:46",
    },
    {
      type: "fitzone_assigned",
      title: "Assigned to fitzone: Strength and Conditioning",
      created_at: "2026-07-18 20:36:46",
    },
    {
      type: "program_assigned",
      title: "Assigned to program: 8 Week Maintenance Program",
      created_at: "2026-07-18 20:36:46",
    },
  ],
};

const DataItem = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </span>
    <span className="text-sm font-bold text-slate-700 capitalize">
      {value || "-"}
    </span>
  </div>
);

const KPICard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black text-slate-800 leading-none">
        {value}
      </span>
      <span className="text-xs font-semibold text-slate-500 mt-1">{label}</span>
    </div>
  </div>
);

const ProfileCardHeader = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-slate-600",
  iconBgClass = "bg-slate-100/50",
}) => (
  <CardHeader className="px-0 pb-0">
    <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-300/60">
      <DashboardHead
        title={title}
        subtitle={subtitle}
        Icon={Icon}
        iconColor={iconColorClass}
        iconBg={iconBgClass}
      />
    </div>
  </CardHeader>
);

export default function SampleProfileLayoutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
        {/* Header & Navigation */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex min-w-0 w-full lg:w-auto">
              <PageHeader
                heading={`User Directory / ${USER_DATA.name.split(" ")[0]}`}
                icon={
                  <User className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-app-primary2"
                subheading="Detailed overview of fitness, health goals, and measurements."
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white text-[10px] font-semibold text-slate-500 px-3 py-1.5 rounded-lg border-slate-200 shadow-sm flex items-center justify-between gap-2"
                onClick={() => alert(`Copied ID: ${USER_DATA.user_id}`)}
              >
                <span className="text-brand-aqua/80">ID:</span>
                <span className="truncate">{USER_DATA.user_id}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className="w-full sm:w-auto h-11 sm:h-10 text-slate-600 hover:bg-slate-50 border-slate-300 rounded-xl px-4 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back to Users</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* User Summary Card (Level 1) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 w-full transition-shadow">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
            <div className="flex flex-row items-center gap-0 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-app-primary2/10 rounded-full blur-xl opacity-50" />
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-sm relative z-10">
                  <AvatarImage src={USER_DATA.image} alt={USER_DATA.name} />
                  <AvatarFallback className="bg-slate-100 text-slate-500 text-2xl font-black uppercase">
                    {USER_DATA.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate capitalize">
                    {USER_DATA.name},{" "}
                    <span className="text-slate-400 font-medium text-base sm:text-lg">
                      {calculateAge(USER_DATA.dob)}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined:</span>
                    <span className="text-slate-700">
                      {formatDate(USER_DATA.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    <span>Updated:</span>
                    <span className="text-slate-700">
                      {formatDate(USER_DATA.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Actions */}
            <div className="flex flex-row sm:items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0">
              <Button
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              >
                <Bell className="mr-2 h-4 w-4 text-slate-400" /> Push
                Notification
              </Button>
              <Button
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              >
                <Mail className="mr-2 h-4 w-4 text-slate-400" /> Email Messaging
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Architecture */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full mb-6">
            <TabsList className="flex items-center justify-start gap-2 p-1 bg-white rounded-lg border border-slate-200 h-auto overflow-x-auto shadow-sm w-full">
              {[
                "profile",
                "health & goals",
                "programs & fitzone",
                "engagement & logs",
                "settings & billing",
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-6 py-2.5 text-sm font-semibold capitalize rounded-md data-[state=active]:bg-app-primary2 data-[state=active]:text-white text-slate-500 hover:text-slate-800 transition-all whitespace-nowrap"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-4">
            <TabsContent value="profile" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 pb-8 min-w-0">
                {/* Main Column */}
                <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                  {/* Measurements & Demographics */}
                  <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                    <ProfileCardHeader
                      title="Demographics & Measurements"
                      subtitle="User personal information"
                      icon={User}
                      iconColorClass="text-brand-aqua"
                      iconBgClass="bg-brand-aqua/10"
                    />
                    <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                        <DataItem label="Gender" value={USER_DATA.gender} />
                        <DataItem
                          label="DOB"
                          value={formatDate(USER_DATA.dob)}
                        />
                        <DataItem
                          label="Vegetarian"
                          value={USER_DATA.vegetarian ? "Yes" : "No"}
                        />
                        <DataItem
                          label="Fitness Level"
                          value={USER_DATA.fitness_level}
                        />

                        <DataItem
                          label="Height"
                          value={`${USER_DATA.height} cm`}
                          icon={Ruler}
                        />
                        <DataItem
                          label="Weight"
                          value={`${USER_DATA.weight} kg`}
                          icon={Weight}
                        />
                        <DataItem
                          label="Target Weight"
                          value={`${USER_DATA.weight_goal} kg`}
                          icon={Target}
                        />
                        <DataItem
                          label="Est. BMI"
                          value={calculateBMI(
                            USER_DATA.height,
                            USER_DATA.weight,
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0">
                  {/* Contact Info */}
                  <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                    <ProfileCardHeader
                      title="Contact Details"
                      subtitle="Communication preferences"
                      icon={Mail}
                      iconColorClass="text-brand-aqua"
                      iconBgClass="bg-brand-aqua/10"
                    />
                    <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                      <div className="flex flex-col gap-4">
                        <DataItem
                          label="Email Address"
                          value={USER_DATA.email}
                        />
                        <DataItem
                          label="Mobile Number"
                          value={USER_DATA.mobileNo}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sub Admin Assignment */}
                  {USER_DATA.sub_admin && (
                    <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-aqua/5 rounded-full blur-2xl pointer-events-none" />
                      <ProfileCardHeader
                        title="Assigned Sub-Admin"
                        subtitle="Managing representative"
                        icon={Briefcase}
                        iconColorClass="text-brand-aqua"
                        iconBgClass="bg-brand-aqua/10"
                      />
                      <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage
                              src={USER_DATA.sub_admin.profile_image}
                            />
                            <AvatarFallback className="bg-brand-aqua text-white text-lg font-bold">
                              {USER_DATA.sub_admin.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-800 truncate">
                              {USER_DATA.sub_admin.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {USER_DATA.sub_admin.designation || "Manager"} •{" "}
                              {USER_DATA.sub_admin.hospital}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DataItem
                            label="Contact Email"
                            value={USER_DATA.sub_admin.email}
                            icon={Mail}
                          />
                          <DataItem
                            label="Contact Phone"
                            value={USER_DATA.sub_admin.phone}
                            icon={Phone}
                          />
                          <DataItem
                            label="Location"
                            value={USER_DATA.sub_admin.location}
                            icon={MapPin}
                          />
                          <DataItem
                            label="Assignment Date"
                            value={formatDate(USER_DATA.sub_admin.created_at)}
                            icon={Calendar}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health & goals" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 pb-8">
                {/* Body Shape & Goals */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5 md:col-span-2">
                  <ProfileCardHeader
                    title="Body Goals & Fitness Aims"
                    subtitle="Target objectives"
                    icon={Target}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      <DataItem
                        label="Primary Goal"
                        value={USER_DATA.main_goal}
                      />
                      <DataItem
                        label="Goal Timeline"
                        value={USER_DATA.ideal_weight_period}
                      />
                      <DataItem
                        label="Current Body Shape"
                        value={USER_DATA.body_shape}
                      />
                      <DataItem
                        label="Target Body Shape"
                        value={USER_DATA.body_shape_goal}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Nutrition Goals */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5 md:col-span-2">
                  <ProfileCardHeader
                    title="Daily Nutrition Targets"
                    subtitle="Macronutrient requirements"
                    icon={Flame}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <KPICard
                        label="Calories"
                        value={USER_DATA.calories_goal}
                        icon={Flame}
                        colorClass="bg-orange-100 text-orange-600"
                      />
                      <KPICard
                        label="Protein (g)"
                        value={USER_DATA.protein_goal}
                        icon={Activity}
                        colorClass="bg-blue-100 text-blue-600"
                      />
                      <KPICard
                        label="Carbs (g)"
                        value={USER_DATA.carbs_goal}
                        icon={Activity}
                        colorClass="bg-emerald-100 text-emerald-600"
                      />
                      <KPICard
                        label="Fat (g)"
                        value={USER_DATA.fat_goal}
                        icon={Activity}
                        colorClass="bg-amber-100 text-amber-600"
                      />
                      <KPICard
                        label="Water (ml)"
                        value={USER_DATA.water_goal}
                        icon={Droplets}
                        colorClass="bg-cyan-100 text-cyan-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="Activity Goals"
                    subtitle="Daily movement targets"
                    icon={Footprints}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <KPICard
                        label="Target Steps / Day"
                        value={USER_DATA.targetSteps}
                        icon={Footprints}
                        colorClass="bg-indigo-100 text-indigo-600"
                      />
                      <KPICard
                        label="Fitness Level"
                        value={USER_DATA.fitness_level}
                        icon={Activity}
                        colorClass="bg-fuchsia-100 text-fuchsia-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="Fluid Intake & Restrictions"
                    subtitle="Hydration management"
                    icon={Droplets}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-2 gap-6">
                      <DataItem
                        label="Fluid Restrictions"
                        value={USER_DATA.fluid_restrictions ? "Yes" : "None"}
                        icon={Shield}
                      />
                      <DataItem
                        label="Fluid Quantity Limit"
                        value={USER_DATA.fluid_quantity || "No Limit Set"}
                        icon={Droplets}
                      />
                      <DataItem
                        label="Daily Water Goal"
                        value={`${USER_DATA.water_goal} ml`}
                        icon={Target}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="programs & fitzone" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 pb-8">
                {/* Programs Enrolled */}
                <Card className="shadow-sm border-slate-200 flex flex-col gap-0">
                  <ProfileCardHeader
                    title="Enrolled Programs"
                    subtitle="Active user programs"
                    icon={ListChecks}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="flex flex-col gap-4">
                      {USER_DATA.programs?.length > 0 ? (
                        USER_DATA.programs.map((prog, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-bold text-slate-800 text-sm truncate">
                                {prog.title}
                              </span>
                              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 shadow-none text-[10px] font-bold">
                                {prog.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {formatDate(prog.start_date)} -{" "}
                                  {formatDate(prog.end_date)}
                                </span>
                              </div>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 mt-2">
                              Assigned on: {formatDate(prog.assigned_at)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No programs assigned.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Fitzone Assignments */}
                <Card className="shadow-sm border-slate-200 flex flex-col gap-0">
                  <ProfileCardHeader
                    title="Fitzone Assignments"
                    subtitle="Assigned categories"
                    icon={Dumbbell}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="flex flex-col gap-3">
                      {USER_DATA.fitzone_status?.length > 0 ? (
                        USER_DATA.fitzone_status.map((fitzone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                          >
                            <span className="font-bold text-slate-700 text-sm">
                              {fitzone.category_title}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                              {formatDate(fitzone.assigned_at)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No Fitzone categories assigned.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement & logs" className="outline-none">
              <div className="flex flex-col gap-4 sm:gap-6 pb-8 min-w-0">
                {/* App Engagement */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="App Engagement Overview"
                    subtitle="Platform usage statistics"
                    icon={Smartphone}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <DataItem
                        label="Programs Enrolled"
                        value={USER_DATA.engagement_stats.programs_enrolled}
                      />
                      <DataItem
                        label="Fitzone Assigments"
                        value={USER_DATA.engagement_stats.fitzone_assignments}
                      />
                      <DataItem
                        label="Days Active (30 Days)"
                        value={
                          USER_DATA.engagement_stats.days_active_last_30_days
                        }
                      />
                      <DataItem
                        label="Most Used Feature"
                        value={USER_DATA.most_used_feature.feature}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Summary Stats */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="Tracking & Logs Summary"
                    subtitle="Total entries recorded"
                    icon={Activity}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <KPICard
                        label="Water Logs"
                        value={USER_DATA.engagement_stats.water_logs_count}
                        icon={Droplets}
                        colorClass="bg-cyan-100 text-cyan-600"
                      />
                      <KPICard
                        label="Weight Logs"
                        value={USER_DATA.engagement_stats.weight_logs_count}
                        icon={Weight}
                        colorClass="bg-purple-100 text-purple-600"
                      />
                      <KPICard
                        label="Food Logs"
                        value={USER_DATA.engagement_stats.food_logs_count}
                        icon={Flame}
                        colorClass="bg-orange-100 text-orange-600"
                      />
                      <KPICard
                        label="Steps Logs"
                        value={USER_DATA.engagement_stats.step_logs_count}
                        icon={Footprints}
                        colorClass="bg-indigo-100 text-indigo-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                  {/* Recent Activities Timeline */}
                  <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                    <ProfileCardHeader
                      title="Recent Activities"
                      subtitle="Timeline of recent actions"
                      icon={History}
                      iconColorClass="text-brand-aqua"
                      iconBgClass="bg-brand-aqua/10"
                    />
                    <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                      <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-slate-200 pl-2">
                        {USER_DATA.recent_activities?.length > 0 ? (
                          USER_DATA.recent_activities.map((activity, index) => (
                            <div
                              key={index}
                              className="relative flex gap-4 items-start z-10"
                            >
                              <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm">
                                <Activity className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="flex flex-col gap-1 pt-1.5 flex-1 min-w-0">
                                <span className="text-sm font-bold text-slate-800">
                                  {activity.title}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                                  {formatDate(activity.created_at)}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 ml-10">
                            No recent activities found.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Login History */}
                  <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                    <ProfileCardHeader
                      title="Login History"
                      subtitle="Recent sign in events"
                      icon={MonitorSmartphone}
                      iconColorClass="text-brand-aqua"
                      iconBgClass="bg-brand-aqua/10"
                    />
                    <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                      <div className="flex flex-col gap-0 divide-y divide-slate-100">
                        {USER_DATA.recent_logins?.length > 0 ? (
                          USER_DATA.recent_logins.map((login, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
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
                                    <MapPin className="w-3 h-3" />{" "}
                                    {login.location}
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
                                  {new Date(login.login_at).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">
                            No login history recorded.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings & billing" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-8 min-w-0">
                {/* Application Preferences */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="Application Preferences"
                    subtitle="System configurations"
                    icon={Settings}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-700">
                            Push Notifications
                          </span>
                          <span className="text-xs text-slate-500">
                            Receive alerts and daily reminders on device.
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded shadow-none border-none",
                            USER_DATA.notification_status
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {USER_DATA.notification_status
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-700">
                            Email Messaging
                          </span>
                          <span className="text-xs text-slate-500">
                            Receive weekly summaries and important updates via
                            email.
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded shadow-none border-none",
                            true
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-700">
                            Timezone
                          </span>
                          <span className="text-xs text-slate-500">
                            User's configured local time zone.
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {USER_DATA.timezone || "System Default"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing & Transactions */}
                <Card className="rounded-xl shadow-sm bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 flex flex-col gap-0 py-5">
                  <ProfileCardHeader
                    title="Billing & Transactions"
                    subtitle="Financial history"
                    icon={CreditCard}
                    iconColorClass="text-brand-aqua"
                    iconBgClass="bg-brand-aqua/10"
                  />
                  <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                    <div className="flex flex-col gap-4">
                      {USER_DATA.transactions?.length > 0 ? (
                        USER_DATA.transactions.map((tx, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">
                                {tx.amount} {tx.currency}
                              </span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                                {formatDate(tx.date)}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded text-[10px] font-bold"
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <span className="text-sm font-semibold text-slate-500">
                            No transactions recorded
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Container>
  );
}
