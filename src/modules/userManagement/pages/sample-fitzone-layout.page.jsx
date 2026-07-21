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
  Dumbbell,
  Calendar,
  MonitorPlay,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock Data
const FITZONE_DATA = {
  id: "FZ-9002",
  name: "Cardio Kickboxing Studio",
  status: "Active",
  created_at: "2026-06-05T09:12:00.000000Z",
  updated_at: "2026-07-10T14:22:00.000000Z",
  total_sessions: 24,
  total_categories: 3,
  visibility: true,
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

export default function SampleFitzoneLayoutPage() {
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
                heading={`Fitzone / ${FITZONE_DATA.name}`}
                icon={<Activity className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-app-primary2"
                subheading="Manage fitzone categories, sessions, and intro content."
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white text-[10px] font-semibold text-slate-500 px-3 py-1.5 rounded-lg border-slate-200 shadow-sm flex items-center justify-between gap-2"
                onClick={() => alert(`Copied ID: ${FITZONE_DATA.id}`)}
              >
                <span className="text-brand-aqua/80">ID:</span>
                <span className="truncate">{FITZONE_DATA.id}</span>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 w-full relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start lg:items-center mt-2">
            <div className="flex flex-row items-center gap-5 flex-1 min-w-0 w-full">
              {/* Square Icon Container */}
              <div className="relative shrink-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-indigo-500" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 truncate capitalize">
                    {FITZONE_DATA.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize",
                      FITZONE_DATA.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100",
                    )}
                  >
                    {FITZONE_DATA.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Created: <strong className="text-slate-700">{formatDate(FITZONE_DATA.created_at)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" />
                    <span>Updated: <strong className="text-slate-700">{formatDate(FITZONE_DATA.updated_at)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="flex flex-row sm:items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <Button
                variant="outline"
                className="flex-1 lg:flex-none h-10 px-5 text-sm font-bold rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm transition-all"
              >
                <Settings className="mr-2 h-4 w-4" /> Manage Fitzone
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Architecture - Underline Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full mb-6 border-b border-slate-200">
            <TabsList className="flex items-center justify-start gap-6 bg-transparent h-auto overflow-x-auto w-full rounded-none p-0">
              {["overview", "categories", "sessions", "settings"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-1 py-3 text-sm font-bold capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none text-slate-500 hover:text-slate-800 transition-all"
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
                      <Layers className="w-4 h-4 text-brand-aqua" /> Fitzone Modules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <KPICard
                        label="Manage workout categories"
                        value="Categories"
                        icon={Layers}
                        colorClass="bg-purple-100 text-purple-600"
                      />
                      <KPICard
                        label="Manage individual video sessions"
                        value="Sessions"
                        icon={MonitorPlay}
                        colorClass="bg-blue-100 text-blue-600"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-brand-aqua" /> Fitzone Content Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <DataItem label="Total Categories" value={FITZONE_DATA.total_categories} icon={Layers} />
                      <DataItem label="Total Sessions" value={FITZONE_DATA.total_sessions} icon={MonitorPlay} />
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
                          <span className="text-sm font-bold text-slate-700">App Visibility</span>
                          <span className="text-xs text-slate-500">Show fitzone to mobile users.</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded shadow-none border-none",
                            FITZONE_DATA.visibility ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {FITZONE_DATA.visibility ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Fitzone Categories table would render here.</span>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Fitzone Sessions table would render here.</span>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="outline-none">
              <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <span className="text-slate-500 font-semibold">Fitzone Settings interface would render here.</span>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Container>
  );
}
