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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  device_token:
    "cRBqXrrrRHmh175ABHO8FK:APA91bFVHY3IKbGvbwbhLhmGNAZvzIPe8thMpSzgGAekC-JP9FVbhUZqEqzj16zW_PNiqYQEVGijdbOdcOzoYD7bUGYWdW5KnO5nlUFztYg87gNa-gz0mAA",
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
            <div className="flex flex-row items-center gap-5 flex-1 min-w-0">
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
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-xl px-2 py-0.5 text-[10px] font-bold capitalize",
                        USER_DATA.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100",
                      )}
                    >
                      {USER_DATA.status}
                    </Badge>
                    <span className="text-slate-400 font-bold text-[10px] pl-1 uppercase tracking-wider">
                      {USER_DATA.paid ? "PRO User" : "Free User"}
                    </span>
                  </div>
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

            {/* Administrative Actions */}
            <div className="flex flex-row sm:items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0">
              <Button
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              >
                <Lock className="mr-2 h-4 w-4 text-slate-400" /> Reset Password
              </Button>
              <Button
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 shadow-sm"
              >
                Suspend Account
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Architecture */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full mb-6">
            <TabsList className="flex items-center justify-start gap-2 p-1 bg-white rounded-lg border border-slate-200 h-auto overflow-x-auto shadow-sm w-full">
              {["profile", "health & goals", "activity", "settings"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-6 py-2.5 text-sm font-semibold capitalize rounded-md data-[state=active]:bg-app-primary2 data-[state=active]:text-white text-slate-500 hover:text-slate-800 transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </div>

          <div className="mt-4">
            <TabsContent value="profile" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 pb-8 min-w-0">
                {/* Main Column */}
                <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                  {/* Measurements & Demographics */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-aqua" /> Demographics
                      & Measurements
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      <DataItem label="Gender" value={USER_DATA.gender} />
                      <DataItem label="DOB" value={formatDate(USER_DATA.dob)} />
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
                        value={calculateBMI(USER_DATA.height, USER_DATA.weight)}
                      />
                    </div>
                  </div>

                  {/* Body Shape & Goals */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-aqua" /> Body Goals
                      & Fitness Aims
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
                  </div>

                  {/* Nutrition Goals */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-brand-aqua" /> Daily
                      Nutrition Targets
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0">
                  {/* Contact Info */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-aqua" /> Contact
                      Details
                    </h3>
                    <div className="flex flex-col gap-4">
                      <DataItem label="Email Address" value={USER_DATA.email} />
                      <DataItem
                        label="Mobile Number"
                        value={USER_DATA.mobileNo}
                      />
                    </div>
                  </div>

                  {/* Security & Access */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-aqua" /> Security &
                      Access
                    </h3>
                    <div className="flex flex-col gap-4">
                      <DataItem
                        label="Access Level"
                        value={USER_DATA.access_level}
                      />
                      <DataItem
                        label="Two Factor Auth"
                        value={
                          USER_DATA.two_factor_enabled ? "Enabled" : "Disabled"
                        }
                      />
                      <DataItem
                        label="Email Verified"
                        value={USER_DATA.email_verified_at ? "Yes" : "No"}
                      />
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Device Token
                        </span>
                        <code className="text-[10px] bg-slate-50 p-2 rounded border border-slate-100 break-all text-slate-600">
                          {USER_DATA.device_token}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health & goals" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 pb-8">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                  <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-brand-aqua" /> Activity
                    Goals
                  </h3>
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
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                  <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-brand-aqua" /> Fluid
                    Intake & Restrictions
                  </h3>
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="outline-none">
              <div className="flex flex-col gap-4 sm:gap-6 pb-8 min-w-0">
                {/* App Engagement */}
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                  <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-aqua" /> App
                    Engagement Overview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <DataItem
                      label="Total Logins"
                      value={USER_DATA.engagement_stats.total_logins}
                    />
                    <DataItem
                      label="Active Days"
                      value={USER_DATA.engagement_stats.days_active}
                    />
                    <DataItem
                      label="Programs Enrolled"
                      value={USER_DATA.engagement_stats.programs_enrolled}
                    />
                    <DataItem
                      label="Workouts Finished"
                      value={USER_DATA.engagement_stats.workouts_completed}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                  {/* Recent Activities Timeline */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-brand-aqua" /> Recent
                      Activities
                    </h3>
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
                              <span className="text-xs text-slate-500 leading-relaxed">
                                {activity.description}
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
                  </div>

                  {/* Login History */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <MonitorSmartphone className="w-4 h-4 text-brand-aqua" />{" "}
                      Login History
                    </h3>
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
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 pb-8 min-w-0">
                {/* Application Preferences */}
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                  <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-brand-aqua" /> Application
                    Preferences
                  </h3>
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
                        {USER_DATA.notification_status ? "Enabled" : "Disabled"}
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
                </div>

                {/* Sub Admin Assignment */}
                {USER_DATA.sub_admin && (
                  <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-brand-aqua/20 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-aqua/5 rounded-full blur-2xl pointer-events-none" />
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-aqua" /> Assigned
                      Sub-Admin
                    </h3>
                    <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={USER_DATA.sub_admin.profile_image} />
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
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Container>
  );
}
