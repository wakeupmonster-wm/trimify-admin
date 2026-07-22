import React, { useState } from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  History,
  Activity,
  Droplets,
  Flame,
  Target,
  Dumbbell,
  Calendar,
  Apple,
  ListVideo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock Data
const PROGRAM_DATA = {
  id: "PROG-8821",
  name: "Advanced Weight Loss",
  status: "Active",
  difficulty: "Intermediate",
  created_at: "2026-07-10T10:36:46.000000Z",
  updated_at: "2026-07-15T10:36:46.000000Z",
  duration: "12 Weeks",
  total_users: 1450,
  food_visibility: true,
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
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
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

export default function SampleProgramLayoutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex min-w-0 w-full lg:w-auto">
              <PageHeader
                heading={`Program / ${PROGRAM_DATA.name}`}
                icon={<Dumbbell className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-app-primary2"
                subheading="Manage program details, diet plans, and modules."
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white text-[10px] font-semibold text-slate-500 px-3 py-1.5 rounded-lg border-slate-200 shadow-sm flex items-center justify-between gap-2"
                onClick={() => alert(`Copied ID: ${PROGRAM_DATA.id}`)}
              >
                <span className="text-brand-aqua/80">ID:</span>
                <span className="truncate">{PROGRAM_DATA.id}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto h-11 sm:h-10 text-slate-600 hover:bg-slate-50 border-slate-300 rounded-xl px-4 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* Level 1 Summary Card - Distinct from User Profile */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 w-full transition-shadow relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0 w-full">
              {/* Rounded Rectangle Icon instead of Avatar */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white/10 border border-white/20 shadow-inner flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-10 h-10 text-brand-aqua drop-shadow-md" />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white truncate capitalize tracking-tight">
                    {PROGRAM_DATA.name}
                  </h2>
                  <Badge
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[10px] font-bold capitalize tracking-widest border-0",
                      PROGRAM_DATA.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300",
                    )}
                  >
                    {PROGRAM_DATA.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300 font-medium mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-aqua/80" />
                    <span>Created: <strong className="text-white ml-1">{formatDate(PROGRAM_DATA.created_at)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-brand-aqua/80" />
                    <span>Updated: <strong className="text-white ml-1">{formatDate(PROGRAM_DATA.updated_at)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="flex flex-row sm:items-center gap-3 w-full lg:w-auto pt-5 lg:pt-0 border-t lg:border-t-0 border-white/10 mt-2 lg:mt-0">
              <Button
                className="flex-1 lg:flex-none h-11 px-5 text-sm font-bold rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all"
              >
                <Settings className="mr-2 h-4 w-4 text-slate-700" /> Edit Program
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Architecture - Pill Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full mb-6 flex justify-center sm:justify-start">
            <TabsList className="flex items-center justify-start gap-1 sm:gap-2 p-1.5 bg-slate-100 rounded-full h-auto overflow-x-auto w-max">
              {["overview", "diet plan", "approved foods", "settings"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-5 py-2 text-sm font-bold capitalize rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-aqua data-[state=active]:shadow-sm text-slate-500 hover:text-slate-700 transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </div>

          <div className="mt-4">
            <TabsContent value="overview" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 pb-8 min-w-0">
                {/* Main Column */}
                <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-aqua" /> Program Specifications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                      <DataItem label="Difficulty" value={PROGRAM_DATA.difficulty} icon={Flame} />
                      <DataItem label="Duration" value={PROGRAM_DATA.duration} icon={Calendar} />
                      <DataItem label="Enrolled Users" value={PROGRAM_DATA.total_users} icon={Activity} />
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ListVideo className="w-4 h-4 text-brand-aqua" /> Program Modules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <KPICard
                        label="Manage daily nutrition requirements"
                        value="Diet Plan"
                        icon={Apple}
                        colorClass="bg-emerald-100 text-emerald-600"
                      />
                      <KPICard
                        label="Manage restricted ingredients"
                        value="Foods"
                        icon={Droplets}
                        colorClass="bg-rose-100 text-rose-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0">
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-brand-aqua" /> Quick Settings
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-700">Food Visibility</span>
                          <span className="text-xs text-slate-500">Show food section to users.</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded shadow-none border-none",
                            PROGRAM_DATA.food_visibility ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {PROGRAM_DATA.food_visibility ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diet plan" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Diet Plan management interface would render here.</span>
              </div>
            </TabsContent>

            <TabsContent value="approved foods" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Approved Foods table would render here.</span>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Program Settings interface would render here.</span>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Container>
  );
}
