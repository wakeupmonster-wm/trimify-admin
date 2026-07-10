import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PreLoader } from "@/app/loader/preloader";
import ErrorState from "./ErrorState";
import DashboardHead from "./dashboard.head";
import { PiDeviceTabletCameraLight } from "react-icons/pi";
import { fetchDashboardKPIs } from "@/modules/dashboard/store/dashboard.slice";
import { format } from "date-fns";
import { VisitorTopCounters, VisitorBottomLegends } from "./VisitorCounters";
import { VisitorChart } from "./VisitorChart";

export const description = "Real-time visitor analytics";

const getSubtitle = (selectedDate) => {
  if (!selectedDate) return "App sessions by platform";
  const preset = selectedDate.preset;
  if (preset && preset !== "custom") {
    switch (preset) {
      case "today":
        return "App sessions for Today";
      case "yesterday":
        return "App sessions for Yesterday";
      case "last7":
        return "App sessions for Last 7 Days";
      case "last30":
        return "App sessions for Last 30 Days";
      case "last90":
        return "App sessions for Last 90 Days";
      default:
        return "App sessions by platform";
    }
  }
  if (selectedDate.from) {
    return "App sessions for custom range";
  }
  return "App sessions by platform";
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
};

export function ChartAreaInteractive({ kpiData, loading, error, selectedDate }) {
  const [activeChart, setActiveChart] = useState("both");
  const dispatch = useDispatch();

  const handleRetry = () => {
    if (!selectedDate) return;
    const preset = selectedDate.preset || "today";
    const apiParams = {
      preset,
      from: selectedDate.from ? format(new Date(selectedDate.from), "yyyy-MM-dd") : null,
      to: selectedDate.to ? format(new Date(selectedDate.to), "yyyy-MM-dd") : null,
    };
    dispatch(fetchDashboardKPIs(apiParams));
  };

  const chartData = useMemo(() => {
    const rawData = kpiData?.visitorHistory || [];
    const len = rawData.length;
    if (len === 0) return [];

    const preset = selectedDate?.preset || "last7";
    const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Helper to calculate duration in days
    const getRangeDays = () => {
      if (preset !== "custom") {
        switch (preset) {
          case "today": return 1;
          case "yesterday": return 1;
          case "last7": return 7;
          case "last30": return 30;
          case "last90": return 90;
          default: return 7;
        }
      }
      if (selectedDate?.from && selectedDate?.to) {
        const fromDate = new Date(selectedDate.from);
        const toDate = new Date(selectedDate.to);
        const diffTime = Math.abs(toDate - fromDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
      return 7;
    };

    const rangeDays = getRangeDays();

    if (rangeDays <= 1) {
      // Single day view (today/yesterday or 1-day custom) distributed into 4-hour blocks
      let targetDateStr = null;
      if (preset === "today") {
        targetDateStr = format(new Date(), "yyyy-MM-dd");
      } else if (preset === "yesterday") {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        targetDateStr = format(y, "yyyy-MM-dd");
      } else if (selectedDate?.from) {
        targetDateStr = format(new Date(selectedDate.from), "yyyy-MM-dd");
      }

      const matchRecord = (targetDateStr ? rawData.find(d => d.date === targetDateStr) : null) || rawData[rawData.length - 1];
      if (matchRecord) {
        const N = matchRecord.android || 0;
        const M = matchRecord.ios || 0;

        const ratios = [0.10, 0.05, 0.20, 0.25, 0.25, 0.15];
        const labels = ["12 AM - 4 AM", "4 AM - 8 AM", "8 AM - 12 PM", "12 PM - 4 PM", "4 PM - 8 PM", "8 PM - 12 AM"];

        const distributed = [];
        let accumulatedAndroid = 0;
        let accumulatedIos = 0;

        for (let i = 0; i < 6; i++) {
          let andVal = 0;
          let iosVal = 0;
          if (i === 5) {
            andVal = N - accumulatedAndroid;
            iosVal = M - accumulatedIos;
          } else {
            andVal = Math.round(N * ratios[i]);
            iosVal = Math.round(M * ratios[i]);
            accumulatedAndroid += andVal;
            accumulatedIos += iosVal;
          }
          distributed.push({
            date: labels[i],
            android: andVal,
            ios: iosVal,
          });
        }
        return distributed;
      }
      return [];
    }

    if (preset === "last90" || rangeDays > 31) {
      // Group by month
      const months = {};
      rawData.forEach((item) => {
        if (!item.date) return;
        const d = parseLocalDate(item.date);
        if (isNaN(d.getTime())) return;
        const monthLabel = d.toLocaleString("default", { month: "short" });
        if (!months[monthLabel]) {
          months[monthLabel] = { date: monthLabel, android: 0, ios: 0, rawTimestamp: d.getTime() };
        }
        months[monthLabel].android += item.android || 0;
        months[monthLabel].ios += item.ios || 0;
      });
      return Object.values(months).sort((a, b) => a.rawTimestamp - b.rawTimestamp);
    } else if (preset === "last30" || (rangeDays > 7 && rangeDays <= 31)) {
      // Group into 4 weeks
      const processed = [];
      const chunkSize = Math.ceil(len / 4);
      for (let i = 0; i < 4; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, len);
        const chunk = rawData.slice(start, end);
        if (chunk.length === 0) break;

        const android = chunk.reduce((sum, d) => sum + (d.android || 0), 0);
        const ios = chunk.reduce((sum, d) => sum + (d.ios || 0), 0);
        processed.push({
          date: `Week ${i + 1}`,
          android,
          ios,
        });
      }
      return processed;
    } else {
      // Daily view: rangeDays between 2 and 7 (e.g. last7, preset === "last7", or len <= 7)
      const dailyRaw = (preset === "last7" || rangeDays === 7) ? rawData.slice(-7) : rawData;
      const processed = dailyRaw.map((item) => {
        if (!item.date) return { ...item, dayLabel: "Unknown" };
        const d = parseLocalDate(item.date);
        if (isNaN(d.getTime())) return { ...item, dayLabel: "Unknown" };
        const dayLabel = dayNamesShort[d.getDay()];
        return {
          ...item,
          date: dayLabel, // display label for XAxis
          dayLabel,
          dayIndex: (d.getDay() + 6) % 7, // Monday-start sorting index
        };
      });

      // Sort by Monday to Sunday if it represents a 7-day range
      if (preset === "last7" || rangeDays === 7 || processed.length === 7) {
        processed.sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0));
      }
      return processed;
    }
  }, [kpiData, selectedDate]);

  const filteredData = chartData;

  const handleToggleChart = (platform) => {
    if (activeChart === "both") {
      setActiveChart(platform);
    } else if (activeChart === platform) {
      setActiveChart("both");
    } else {
      setActiveChart(platform);
    }
  };

  const { currentAndroid, currentIos } = useMemo(() => {
    const rawData = kpiData?.visitorHistory || [];
    const preset = selectedDate?.preset || "last7";

    if (rawData.length === 0) {
      const totalActive = kpiData?.activeUsers24h?.value ?? 0;
      const android = Math.round(totalActive * 0.64);
      const ios = totalActive - android;
      return { currentAndroid: android, currentIos: ios };
    }

    if (preset === "today" || preset === "yesterday") {
      let targetDateStr = null;
      if (preset === "today") {
        targetDateStr = format(new Date(), "yyyy-MM-dd");
      } else {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        targetDateStr = format(y, "yyyy-MM-dd");
      }

      const matchRecord = (targetDateStr ? rawData.find(d => d.date === targetDateStr) : null) || rawData[rawData.length - 1];
      const android = matchRecord?.android || 0;
      const ios = matchRecord?.ios || 0;
      return { currentAndroid: android, currentIos: ios };
    }

    // Check range duration for custom preset
    const getRangeDays = () => {
      if (preset !== "custom") {
        switch (preset) {
          case "today": return 1;
          case "yesterday": return 1;
          case "last7": return 7;
          case "last30": return 30;
          case "last90": return 90;
          default: return 7;
        }
      }
      if (selectedDate?.from && selectedDate?.to) {
        const fromDate = new Date(selectedDate.from);
        const toDate = new Date(selectedDate.to);
        const diffTime = Math.abs(toDate - fromDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
      return 7;
    };

    const rangeDays = getRangeDays();

    if (rangeDays <= 1) {
      let targetDateStr = selectedDate?.from ? format(new Date(selectedDate.from), "yyyy-MM-dd") : null;
      const matchRecord = (targetDateStr ? rawData.find(d => d.date === targetDateStr) : null) || rawData[rawData.length - 1];
      const android = matchRecord?.android || 0;
      const ios = matchRecord?.ios || 0;
      return { currentAndroid: android, currentIos: ios };
    }

    // Otherwise, sum the data in the history
    const sumRaw = (preset === "last7" || rangeDays === 7) ? rawData.slice(-7) : rawData;
    let sumAndroid = 0;
    let sumIos = 0;
    sumRaw.forEach(item => {
      sumAndroid += item.android || 0;
      sumIos += item.ios || 0;
    });

    return { currentAndroid: sumAndroid, currentIos: sumIos };
  }, [kpiData, selectedDate]);

  if (!loading && (!kpiData || Object.keys(kpiData).length === 0)) {
    return <div className="text-slate-500 text-sm">No data available</div>;
  }

  if (loading) {
    return (
      <Card className="rounded-[24px] shadow-sm bg-white border border-slate-200 flex-1">
        <CardContent className="h-[400px] flex items-center justify-center">
          <PreLoader />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState error={error} fetchVisitorData={handleRetry} />;
  }

  return (
    <Card className="rounded-xl border border-slate-200 hover:border-brand-aqua/50 transition-all duration-300 shadow-sm py-5 bg-white overflow-hidden flex flex-col h-full gap-0">
      <CardHeader className="flex flex-col items-end justify-between px-0 tracking-tight shrink-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-200">
          <DashboardHead
            title="Platform Visitors"
            subtitle={getSubtitle(selectedDate)}
            Icon={PiDeviceTabletCameraLight}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>

        <VisitorTopCounters
          currentAndroid={currentAndroid}
          currentIos={currentIos}
          activeChart={activeChart}
          onToggleChart={handleToggleChart}
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end px-4 pb-2 mt-4 relative">
        {filteredData.length === 0 ? (
          <div className="h-[220px] w-full flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <PiDeviceTabletCameraLight className="w-10 h-10" />
            <p className="text-[11px] font-medium capitalize tracking-wide">
              No data available for selected filter
            </p>
          </div>
        ) : (
          <VisitorChart
            filteredData={filteredData}
            activeChart={activeChart}
          />
        )}

        <VisitorBottomLegends
          activeChart={activeChart}
          onToggleChart={handleToggleChart}
        />
      </CardContent>
    </Card>
  );
}
