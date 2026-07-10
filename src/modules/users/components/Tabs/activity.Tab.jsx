/* eslint-disable no-unused-vars */
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { IconMessage2, IconUsers, IconChartBar } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import DashboardHead from "@/components/shared/dashboard.head";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LuUsersRound } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const ActivityTab = ({ stats = {}, recentMatches }) => {
  const navigate = useNavigate();

  const matchRate =
    (stats?.totalSwipes || 0) > 0
      ? (((stats?.totalMatches || 0) / stats?.totalSwipes) * 100).toFixed(1)
      : 0;

  const scoreColor =
    parseFloat(matchRate) >= 40
      ? "text-emerald-600"
      : parseFloat(matchRate) >= 15
        ? "text-amber-600"
        : "text-rose-600";

  const activityStats = [
    {
      label: "Total Swipes",
      val: stats?.totalSwipes || 0,
      color: "aqua",
    },
    {
      label: "Total Keen",
      val: stats?.totalLikes || 0,
      color: "amber",
    },
    {
      label: "Super Keen",
      val: stats?.totalSuperLikes || 0,
      color: "orange",
    },
    {
      label: "Total Rejections",
      val: stats?.totalRejections || 0,
      color: "red",
    },
    {
      label: "Total Matches",
      val: stats?.totalMatches || 0,
      color: "aqua",
    },
  ];

  // console.log("recentMatches: ", recentMatches);

  return (
    <TabsContent
      value="activity"
      className="mt-6 mb-4 space-y-6 focus-visible:ring-offset-0 focus-visible:ring-0"
    >
      {/* 1. TOP STATS ROW - Clean & Professional */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {activityStats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <ActivityStatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* 2. MIDDLE BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT CONNECTIONS (1/2) */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm gap-4 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Recent Connections"
                subtitle={`${recentMatches?.length ?? 0} Matches`}
                Icon={LuUsersRound}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
            </div>
          </CardHeader>
          <CardContent className="px-5 space-y-2">
            {recentMatches && recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div
                  key={match._id}
                  className="flex items-center justify-between p-4 bg-slate-100/50 rounded-lg border border-slate-200/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border border-white shadow-sm transition-transform group-hover:scale-105">
                      <AvatarImage
                        src={match?.photo}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-[10px]">
                        {match?.nickname?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-foreground/80 flex items-baseline">
                        {match?.nickname},
                        <span className="text-xs font-semibold text-muted-foreground ml-1">
                          {" "}
                          {match?.age || 24}
                        </span>
                      </p>
                      <p className="text-[10px] font-medium text-secondary-foreground">
                        {match?.email || "No email provided"}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                        Matched{" "}
                        {match.matchedAt
                          ? formatDistanceToNow(new Date(match.matchedAt)) +
                          " ago"
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`../view-profile`, {
                        state: { userId: match.ouserId },
                      })
                    }
                    className="h-8 rounded-lg text-[10px] font-bold border-slate-200 text-slate-600 hover:text-brand-aqua hover:border-brand-aqua/30 transition-all px-3"
                  >
                    View Profile
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-foreground/80">
                <IconMessage2
                  size={40}
                  stroke={1.5}
                  className="mb-2 opacity-60"
                />
                <p className="text-xs font-semibold opacity-60">
                  No recent engagement found
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ENGAGEMENT SCORE (1/3) */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm gap-4 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Engagement Score"
                subtitle="Conversion Rate"
                Icon={IconChartBar}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
            </div>
          </CardHeader>
          <CardContent className="px-5 space-y-2">
            {/* Circular Gauge Placeholder/Representation */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative h-48 w-48 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 130 130"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-200/50"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={364.4}
                    strokeDashoffset={
                      364.4 - (364.4 * parseFloat(matchRate)) / 100
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className={cn("transition-all duration-1000", scoreColor)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground">
                    {matchRate}%
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Score
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <ScoreMetricItem
                label="Funnel Success"
                value={`${matchRate}%`}
                dotColor="bg-emerald-500"
              />
              <ScoreMetricItem
                label="Super Charge Accuracy"
                value={`${(stats?.totalLikes || 0) > 0 ? (((stats?.totalMatches || 0) / stats.totalLikes) * 100).toFixed(1) : 0}%`}
                dotColor="bg-sky-500"
              />
              <ScoreMetricItem
                label="Super Charge Ratio"
                value={`${(stats?.totalLikes || 0) > 0 ? (((stats?.totalSuperLikes || 0) / stats.totalLikes) * 100).toFixed(1) : 0}%`}
                dotColor="bg-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MODERATOR TIP - Full Width Alert */}
      {/* <Card className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 flex flex-row items-start gap-2">
        <div className="p-1.5 bg-amber-100 rounded-full">
          <IconAlertTriangle className="text-amber-500" size={16} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-0.5">
            Moderator Tip
          </h4>
          <p className="text-xs font-medium text-amber-900/80 leading-snug">
            This user has a high swipe frequency. Monitor for potential bot
            behavior or automated scripts.
          </p>
        </div>
      </Card> */}
    </TabsContent>
  );
};

const ActivityStatCard = ({ val, label, color }) => {
  const colorStyles = {
    blue: { text: "text-blue-500", bg: "bg-blue-500" },
    amber: { text: "text-amber-500", bg: "bg-amber-500" },
    orange: { text: "text-orange-500", bg: "bg-orange-500" },
    indigo: { text: "text-indigo-500", bg: "bg-indigo-500" },
    red: { text: "text-red-500", bg: "bg-red-500" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500" },
    aqua: { text: "text-brand-aqua", bg: "bg-brand-aqua" },
    default: { text: "text-slate-900", bg: "bg-slate-900" },
  };

  const selectedColor = colorStyles[color] || colorStyles.default;

  return (
    <Card className="relative overflow-hidden shadow-sm rounded-2xl py-4 border border-slate-200 bg-white group transition-all duration-300">
      <CardContent className="p-2 flex flex-col items-center text-center relative z-10 cursor-pointer">
        <h2
          className={cn(
            "text-4xl font-black mb-1 transition-transform duration-300",
            selectedColor.text,
          )}
        >
          {val?.toLocaleString()}
        </h2>
        <p className="text-[13px] font-bold text-slate-600 tracking-tight">
          {label}
        </p>
      </CardContent>
      {/* Bottom Accent Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transition-all duration-300",
          selectedColor.bg,
        )}
      />
    </Card>
  );
};

const ScoreMetricItem = ({ label, value, dotColor }) => (
  <div className="flex items-center justify-between py-1.5 pb-3 border-b border-slate-200 last:border-0">
    <div className="flex items-center gap-2">
      <div className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      <span className="text-xs font-bold text-foreground/80">{label}</span>
    </div>
    <span className="text-xs font-black text-foreground/80">{value}</span>
  </div>
);
