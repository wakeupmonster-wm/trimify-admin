/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, AlertTriangle, RefreshCcw, TrendingDown, DollarSign, Percent, Crown, Trophy } from "lucide-react";
import { LuUserRoundCheck } from "react-icons/lu";
import { colorMap } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchSubscriptionKPIs, setSubscriptionDateRange } from "../store/subscription.slice";
import { format } from "date-fns";
import { SubscriptionDashboardSkeleton } from "../components/SubscriptionDashboardSkeleton";
import { PageHeader } from "@/components/common/headSubhead";
import Last24HoursPieChart from "./Last24HoursPieChart";
import PlanDistributionChart from "./PlanDistributionChart";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { IconTrendingUp as TablerTrendingUp, IconTrendingDown as TablerTrendingDown, } from "@tabler/icons-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { TableLoader } from "@/app/loader/table.loader";
import { Tooltip as ShadTooltip, TooltipTrigger as ShadTooltipTrigger, TooltipContent as ShadTooltipContent, TooltipProvider as ShadTooltipProvider,} from "@/components/ui/tooltip";
import RevenueTrendChart from "./RevenueTrendChart";
import PlatformMixChart from "./PlatformMixChart";
import SubscriberGrowthChart from "./SubscriberGrowthChart";
import BestSellingProductsList from "./BestSellingProductsList";

// const COLORS = ["#46C7CD", "#818CF8", "#F472B6", "#FB923C", "#A78BFA"];
const COLORS = [
  "#007FC0", // primary2
  "#15B097", // cardGreen
  "#DC6B1B", // cardOrange
  "#EDA145", // cardYellow
  "#5AA0C1", // primary3
];

const getSubTrendExplanation = (stat) => {
  if (!stat.tooltipData) return stat.sublabel || "";

  if ("subscribers" in stat.tooltipData && "totalUsers" in stat.tooltipData) {
    return `${stat.tooltipData.subscribers?.toLocaleString()} active subscribers out of ${stat.tooltipData.totalUsers?.toLocaleString()} total users.`;
  }

  if ("cancellations" in stat.tooltipData && "activeAtStart" in stat.tooltipData) {
    return `${stat.tooltipData.cancellations?.toLocaleString()} cancellations from ${stat.tooltipData.activeAtStart?.toLocaleString()} active subscribers at the start of the period.`;
  }

  const { current, previous, isCurrency } = stat.tooltipData;
  const fmt = (v) =>
    isCurrency
      ? `$${v?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : v?.toLocaleString();
  const diff = current - previous;
  const action = diff >= 0 ? "increased" : "decreased";
  if (previous === 0 && current > 0)
    return `${stat.label} spiked to ${fmt(
      current,
    )} because there was 0 activity in the previous period.`;
  if (current === 0 && previous > 0)
    return `${stat.label} dropped to zero from ${fmt(
      previous,
    )} in the previous period.`;
  if (current === previous)
    return `${
      stat.label
    } remained exactly the same as the previous period (${fmt(current)}).`;
  const pct =
    previous !== 0
      ? Math.abs(((current - previous) / previous) * 100).toFixed(1) + "%"
      : "N/A";
  return `${stat.label} ${action} by ${pct} from ${fmt(previous)} to ${fmt(
    current,
  )}.`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // 1. staggerChildren: Ek item ke baad dusre item ke beech ka gap (0.1 se 0.3 ya 0.5 kar dein)
      staggerChildren: 0.1,

      // 2. delayChildren: Pura animation shuru hone se pehle ka wait time
      delayChildren: 0.3,

      // 3. duration: Container ke khud ke opacity change hone ki speed
      duration: 0.3,
    },
  },
};

export default function SubscriptionDashboard() {
  const dispatch = useDispatch();
  const { subscriptionStats, statsLoading, dateRange, error } = useSelector(
    (state) => state.subscription,
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    const initial = dateRange || { preset: "today" };
    return {
      from: initial.from ? new Date(initial.from) : null,
      to: initial.to ? new Date(initial.to) : null,
      preset: initial.preset,
    };
  });
  const [lastRefresh, setLastRefresh] = useState(null);

  // Chart Filters
  const [chartTimeframe, setChartTimeframe] = useState("daily"); // daily, weekly, monthly
  const [chartType, setChartType] = useState("all"); // all, subscription, consumable
  const [activeSubFilters, setActiveSubFilters] = useState([]); // holds active sub-options like 'subscription_1_month', 'consumable_super_keen'

  // Auto-select all sub-filters when main filter changes
  useEffect(() => {
    if (chartType === "subscription") {
      setActiveSubFilters(["subscription_1_month", "subscription_3_month"]);
    } else if (chartType === "consumable") {
      setActiveSubFilters(["consumable_super_keen", "consumable_boost"]);
    } else {
      setActiveSubFilters([]);
    }
  }, [chartType]);

  const [scrolled, setScrolled] = useState(false);

  // Fix: Force page to start at the top every time this dashboard is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRefresh = useCallback(() => {
    const dateObj = selectedDate || { preset: "today" };
    let params = {};
    if (dateObj.preset && dateObj.preset !== "custom") {
      params.timeFilter = dateObj.preset;
    } else {
      params.timeFilter = "custom";
      const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
      if (dateObj.from) {
        const fromDate = new Date(dateObj.from);
        if (isValidDate(fromDate)) {
          params.startDate = format(fromDate, "yyyy-MM-dd");
        }
      }
      if (dateObj.to) {
        const toDate = new Date(dateObj.to);
        if (isValidDate(toDate)) {
          params.endDate = format(toDate, "yyyy-MM-dd");
        }
      }
    }
    dispatch(fetchSubscriptionKPIs(params));
    setLastRefresh(new Date());
  }, [dispatch, selectedDate]);

  // Fetch subscription KPIs whenever the selected date range changes (and on mount)
  useEffect(() => {
    if (!selectedDate) return;

    handleRefresh();

    const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
    dispatch(
      setSubscriptionDateRange({
        from: isValidDate(selectedDate.from)
          ? selectedDate.from.toISOString()
          : null,
        to: isValidDate(selectedDate.to) ? selectedDate.to.toISOString() : null,
        preset: selectedDate.preset,
      }),
    );
  }, [selectedDate, dispatch, handleRefresh]);

  const kpis = subscriptionStats?.kpis;
  const charts = subscriptionStats?.charts;

  // Dynamic Period Label logic copied from Dashboard.jsx
  const dynamicPeriodLabel = useMemo(() => {
    if (
      selectedDate?.from &&
      (!selectedDate.preset || selectedDate.preset === "custom")
    ) {
      const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
      const fromDate = new Date(selectedDate.from);
      const toDate = selectedDate.to ? new Date(selectedDate.to) : fromDate;
      if (isValidDate(fromDate) && isValidDate(toDate)) {
        return `${format(fromDate, "MMM dd")} - ${format(toDate, "MMM dd, y")}`;
      }
      return "Custom Range";
    }
    const presets = {
      today: "Today",
      yesterday: "Yesterday",
      last7: "Last 7 Days",
      last30: "Last 30 Days",
      last90: "Last 90 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month",
    };
    return presets[selectedDate?.preset] || "Today";
  }, [selectedDate]);

  // KPI stats
  const coreStats = useMemo(() => {
    if (!kpis) return [];
    return [
      {
        label: "Today's Revenue",
        val: `$${(kpis.todayRevenue || 0).toLocaleString()}`,
        trend: "Today",
        trendClass: "text-[#9CA3AF]",
        sublabel: "Gross revenue earned today",
        icon: <TrendingUp size={20} />,
        color: "blue",
      },
      {
        label: "Consumable Revenue",
        val: `$${(kpis.consumableRevenue || 0).toLocaleString()}`,
        trend: "This month",
        trendClass: "text-[#9CA3AF]",
        sublabel: "Gross Super Keen + Super Charge sales",
        icon: <DollarSign size={20} />,
        color: "blue",
      },
      {
        label: "MRR (AUD)",
        val: `$${kpis.mrr?.amount?.toLocaleString() || 0}`,
        trend: "Recurring",
        trendClass: "text-[#16A34A]",
        sublabel: "Gross Monthly Recurring Revenue",
        icon: <Crown size={20} />,
        color: "amber",
      },
      {
        label: "Active Subscribers",
        val: kpis.activeSubscribers?.count || 0,
        trend: kpis.activeSubscribers?.change || "+0%",
        trendClass: kpis.activeSubscribers?.change?.startsWith("-")
          ? "text-[#EF4444]"
          : "text-[#16A34A]",
        sublabel: "Currently active subscriptions",
        icon: <LuUserRoundCheck size={20} />,
        color: "emerald",
        tooltipData: kpis.activeSubscribers?.tooltipData || null,
      },
      {
        label: "Conversion Rate",
        val:
          typeof kpis.conversionRate === "object"
            ? kpis.conversionRate.value
            : kpis.conversionRate || "0%",
        trend: "Free at Premium",
        trendClass: "text-[#16A34A]",
        sublabel: "Free to Premium conversion",
        icon: <Percent size={20} />,
        color: "emerald",
        tooltipData:
          typeof kpis.conversionRate === "object"
            ? kpis.conversionRate.tooltipData
            : null,
      },
      {
        label: "Churn Rate",
        val:
          typeof kpis.churnRate === "object"
            ? kpis.churnRate.value
            : kpis.churnRate || "0%",
        trend: "0% churn",
        trendClass: "text-[#EF4444]",
        sublabel: "Monthly cancellation rate",
        icon: <TrendingDown size={20} />,
        color: "rose",
        tooltipData:
          typeof kpis.churnRate === "object"
            ? kpis.churnRate.tooltipData
            : null,
      },
    ];
  }, [kpis]);

  const milestoneProgress = Math.min(
    100,
    Math.max(0, parseFloat(kpis?.milestone?.percentage) || 0),
  );

  // Chart data formatting & filtering
  const revenueTrendData = useMemo(() => {
    let rawData = charts?.revenueTrend || [];
    const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

    // 1. Determine boundaries
    let maxDate = new Date(selectedDate?.to || new Date());
    if (selectedDate?.preset === "yesterday" && !selectedDate?.to) {
      maxDate = new Date();
      maxDate.setDate(maxDate.getDate() - 1);
    }
    if (maxDate > new Date() && selectedDate?.preset !== "yesterday")
      maxDate = new Date(); // Cap to now unless preset yesterday
    maxDate.setHours(23, 59, 59, 999);

    let minDate;
    if (
      selectedDate?.from &&
      (!selectedDate.preset || selectedDate.preset === "custom")
    ) {
      minDate = new Date(selectedDate.from);
    } else {
      minDate = new Date(maxDate);
      if (selectedDate?.preset === "last90")
        minDate.setDate(minDate.getDate() - 89);
      else if (selectedDate?.preset === "last30")
        minDate.setDate(minDate.getDate() - 29);
      else if (selectedDate?.preset === "thisMonth") minDate.setDate(1);
      else if (selectedDate?.preset === "lastMonth") {
        minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 1);
        minDate.setDate(1);
        maxDate = new Date(
          minDate.getFullYear(),
          minDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
      } else if (
        selectedDate?.preset === "today" ||
        selectedDate?.preset === "yesterday" ||
        !selectedDate?.preset
      ) {
        // minDate is already maxDate, representing a single day
      } else {
        minDate.setDate(minDate.getDate() - 6);
      }
    }
    minDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 2. Auto-detect timeframe based on date range difference
    let activeTimeframe = "daily";
    if (diffDays > 62) {
      activeTimeframe = "monthly";
    } else if (diffDays > 14) {
      activeTimeframe = "weekly";
    } else {
      activeTimeframe = "daily";
    }

    // 3. Pad zero-data points / Grouping
    let groups = {};

    if (activeTimeframe === "daily") {
      let curr = new Date(minDate);

      while (curr <= maxDate) {
        const key = format(curr, "MMM dd").toLowerCase();
        groups[key] = {
          name: format(curr, "MMM dd").toLowerCase(),
          subscription: 0,
          subscription_1_month: 0,
          subscription_3_month: 0,
          consumable: 0,
          consumable_super_keen: 0,
          consumable_boost: 0,
          compareDate: curr.getTime(),
        };
        curr.setDate(curr.getDate() + 1);
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const itemDate = new Date(item.day);
        if (!isValidDate(itemDate)) return;
        const key = format(itemDate, "MMM dd").toLowerCase();
        if (groups[key]) {
          groups[key].subscription +=
            (item["1_MONTH"] || 0) +
            (item["3_MONTH"] || 0) +
            (item.subscription || 0);
          groups[key].subscription_1_month += item["1_MONTH"] || 0;
          groups[key].subscription_3_month += item["3_MONTH"] || 0;
          groups[key].consumable +=
            (item.SUPER_KEEN || 0) +
            (item.BOOST || 0) +
            (item.other || 0) +
            (item.consumable || 0);
          groups[key].consumable_super_keen += item.SUPER_KEEN || 0;
          groups[key].consumable_boost += item.BOOST || 0;
        }
      });
    } else if (activeTimeframe === "weekly") {
      let curr = new Date(minDate);
      curr.setDate(curr.getDate() - curr.getDay()); // Align to Sunday
      curr.setHours(0, 0, 0, 0);

      while (curr <= maxDate) {
        const startOfWeekDate = new Date(curr);
        const endOfWeekDate = new Date(curr);
        endOfWeekDate.setDate(endOfWeekDate.getDate() + 6);

        const key = `${format(startOfWeekDate, "dd")} - ${format(
          endOfWeekDate,
          "dd MMM",
        )}`.toLowerCase();
        groups[key] = {
          name: key,
          subscription: 0,
          subscription_1_month: 0,
          subscription_3_month: 0,
          consumable: 0,
          consumable_super_keen: 0,
          consumable_boost: 0,
          compareDate: endOfWeekDate.getTime(),
        };
        curr.setDate(curr.getDate() + 7);
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const d = new Date(item.day);
        if (!isValidDate(d)) return;
        const endOfWeekDate = new Date(d);
        endOfWeekDate.setDate(
          endOfWeekDate.getDate() + (6 - endOfWeekDate.getDay()),
        );

        const startOfWeekDate = new Date(endOfWeekDate);
        startOfWeekDate.setDate(endOfWeekDate.getDate() - 6);

        const key = `${format(startOfWeekDate, "dd")} - ${format(
          endOfWeekDate,
          "dd MMM",
        )}`.toLowerCase();
        if (groups[key]) {
          groups[key].subscription +=
            (item["1_MONTH"] || 0) +
            (item["3_MONTH"] || 0) +
            (item.subscription || 0);
          groups[key].subscription_1_month += item["1_MONTH"] || 0;
          groups[key].subscription_3_month += item["3_MONTH"] || 0;
          groups[key].consumable +=
            (item.SUPER_KEEN || 0) +
            (item.BOOST || 0) +
            (item.other || 0) +
            (item.consumable || 0);
          groups[key].consumable_super_keen += item.SUPER_KEEN || 0;
          groups[key].consumable_boost += item.BOOST || 0;
        }
      });
    } else if (activeTimeframe === "monthly") {
      let currYear = minDate.getFullYear();
      let currMonth = minDate.getMonth();
      const endYear = maxDate.getFullYear();
      const endMonth = maxDate.getMonth();

      while (
        currYear < endYear ||
        (currYear === endYear && currMonth <= endMonth)
      ) {
        const d = new Date(currYear, currMonth, 1);
        const key = format(d, "MMM yyyy");
        groups[key] = {
          name: key,
          subscription: 0,
          subscription_1_month: 0,
          subscription_3_month: 0,
          consumable: 0,
          consumable_super_keen: 0,
          consumable_boost: 0,
          compareDate: d.getTime(),
        };
        currMonth++;
        if (currMonth > 11) {
          currMonth = 0;
          currYear++;
        }
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const d = new Date(item.day);
        if (!isValidDate(d)) return;
        const key = format(d, "MMM yyyy");
        if (groups[key]) {
          groups[key].subscription +=
            (item["1_MONTH"] || 0) +
            (item["3_MONTH"] || 0) +
            (item.subscription || 0);
          groups[key].subscription_1_month += item["1_MONTH"] || 0;
          groups[key].subscription_3_month += item["3_MONTH"] || 0;
          groups[key].consumable +=
            (item.SUPER_KEEN || 0) +
            (item.BOOST || 0) +
            (item.other || 0) +
            (item.consumable || 0);
          groups[key].consumable_super_keen += item.SUPER_KEEN || 0;
          groups[key].consumable_boost += item.BOOST || 0;
        }
      });
    }

    let grouped = Object.values(groups)
      .map((item) => ({
        ...item,
        total: (item.subscription || 0) + (item.consumable || 0),
      }))
      .sort((a, b) => a.compareDate - b.compareDate);

    // 4. Apply type filtering dynamically based on activeSubFilters
    let result;
    if (chartType === "subscription") {
      result = grouped.map((item) => {
        let res = { name: item.name };
        if (activeSubFilters.includes("subscription_1_month"))
          res.subscription_1_month = item.subscription_1_month;
        if (activeSubFilters.includes("subscription_3_month"))
          res.subscription_3_month = item.subscription_3_month;
        if (activeSubFilters.length === 0) res.subscription = item.subscription;
        return res;
      });
    } else if (chartType === "consumable") {
      result = grouped.map((item) => {
        let res = { name: item.name };
        if (activeSubFilters.includes("consumable_super_keen"))
          res.consumable_super_keen = item.consumable_super_keen;
        if (activeSubFilters.includes("consumable_boost"))
          res.consumable_boost = item.consumable_boost;
        if (activeSubFilters.length === 0) res.consumable = item.consumable;
        return res;
      });
    } else {
      result = grouped;
    }

    return { data: result, timeframe: activeTimeframe };
  }, [charts, chartTimeframe, chartType, activeSubFilters, selectedDate]);

  // Extract data and auto-detected timeframe label
  const revenueTrendChartData = revenueTrendData?.data || [];
  const revenueTimeframe = revenueTrendData?.timeframe || "daily";
  const revenueTimeframeLabel =
    revenueTimeframe === "daily"
      ? "Daily view"
      : revenueTimeframe === "weekly"
        ? "Weekly view"
        : "Monthly view";

  const growthData = useMemo(() => {
    let rawData = charts?.subscriberGrowth || [];
    const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

    // 1. Determine boundaries
    let maxDate = new Date(selectedDate?.to || new Date());
    if (selectedDate?.preset === "yesterday" && !selectedDate?.to) {
      maxDate = new Date();
      maxDate.setDate(maxDate.getDate() - 1);
    }
    if (maxDate > new Date() && selectedDate?.preset !== "yesterday")
      maxDate = new Date(); // Cap to now unless preset yesterday
    maxDate.setHours(23, 59, 59, 999);

    let minDate;
    if (
      selectedDate?.from &&
      (!selectedDate.preset || selectedDate.preset === "custom")
    ) {
      minDate = new Date(selectedDate.from);
    } else {
      minDate = new Date(maxDate);
      if (selectedDate?.preset === "last90")
        minDate.setDate(minDate.getDate() - 89);
      else if (selectedDate?.preset === "last30")
        minDate.setDate(minDate.getDate() - 29);
      else if (selectedDate?.preset === "thisMonth") minDate.setDate(1);
      else if (selectedDate?.preset === "lastMonth") {
        minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 1);
        minDate.setDate(1);
        maxDate = new Date(
          minDate.getFullYear(),
          minDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
      } else if (
        selectedDate?.preset === "today" ||
        selectedDate?.preset === "yesterday" ||
        !selectedDate?.preset
      ) {
        // minDate is already maxDate, representing a single day
      } else {
        minDate.setDate(minDate.getDate() - 6);
      }
    }
    minDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 2. Auto-detect timeframe based on date range difference
    let activeTimeframe = "daily";
    if (diffDays > 62) {
      activeTimeframe = "monthly";
    } else if (diffDays > 14) {
      activeTimeframe = "weekly";
    } else {
      activeTimeframe = "daily";
    }

    let groups = {};

    if (activeTimeframe === "daily") {
      let curr = new Date(minDate);

      while (curr <= maxDate) {
        const key = format(curr, "MMM dd").toLowerCase();
        groups[key] = {
          name: format(curr, "MMM dd").toLowerCase(),
          new: 0,
          cancelled: 0,
          net: 0,
          compareDate: curr.getTime(),
        };
        curr.setDate(curr.getDate() + 1);
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const itemDate = new Date(item.day);
        if (!isValidDate(itemDate)) return;
        const key = format(itemDate, "MMM dd").toLowerCase();
        if (groups[key]) {
          groups[key].new += item.newSubscriptions ?? item.new ?? 0;
          groups[key].cancelled += item.cancellations ?? item.cancelled ?? 0;
          groups[key].net = groups[key].new - groups[key].cancelled;
        }
      });
    } else if (activeTimeframe === "weekly") {
      let curr = new Date(minDate);
      curr.setDate(curr.getDate() - curr.getDay()); // Align to Sunday
      curr.setHours(0, 0, 0, 0);

      while (curr <= maxDate) {
        const startOfWeekDate = new Date(curr);
        const endOfWeekDate = new Date(curr);
        endOfWeekDate.setDate(endOfWeekDate.getDate() + 6);

        const key = `${format(startOfWeekDate, "dd")} - ${format(
          endOfWeekDate,
          "dd MMM",
        )}`.toLowerCase();
        groups[key] = {
          name: key,
          new: 0,
          cancelled: 0,
          net: 0,
          compareDate: endOfWeekDate.getTime(),
        };
        curr.setDate(curr.getDate() + 7);
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const d = new Date(item.day);
        if (!isValidDate(d)) return;
        const endOfWeekDate = new Date(d);
        endOfWeekDate.setDate(
          endOfWeekDate.getDate() + (6 - endOfWeekDate.getDay()),
        );

        const startOfWeekDate = new Date(endOfWeekDate);
        startOfWeekDate.setDate(endOfWeekDate.getDate() - 6);

        const key = `${format(startOfWeekDate, "dd")} - ${format(
          endOfWeekDate,
          "dd MMM",
        )}`.toLowerCase();
        if (groups[key]) {
          groups[key].new += item.newSubscriptions ?? item.new ?? 0;
          groups[key].cancelled += item.cancellations ?? item.cancelled ?? 0;
          groups[key].net = groups[key].new - groups[key].cancelled;
        }
      });
    } else if (activeTimeframe === "monthly") {
      let currYear = minDate.getFullYear();
      let currMonth = minDate.getMonth();
      const endYear = maxDate.getFullYear();
      const endMonth = maxDate.getMonth();

      while (
        currYear < endYear ||
        (currYear === endYear && currMonth <= endMonth)
      ) {
        const d = new Date(currYear, currMonth, 1);
        const key = format(d, "MMM yyyy");
        groups[key] = {
          name: key,
          new: 0,
          cancelled: 0,
          net: 0,
          compareDate: d.getTime(),
        };
        currMonth++;
        if (currMonth > 11) {
          currMonth = 0;
          currYear++;
        }
      }

      rawData.forEach((item) => {
        if (!item.day) return;
        const d = new Date(item.day);
        if (!isValidDate(d)) return;
        const key = format(d, "MMM yyyy");
        if (groups[key]) {
          groups[key].new += item.newSubscriptions ?? item.new ?? 0;
          groups[key].cancelled += item.cancellations ?? item.cancelled ?? 0;
          groups[key].net = groups[key].new - groups[key].cancelled;
        }
      });
    }

    let grouped = Object.values(groups).sort(
      (a, b) => a.compareDate - b.compareDate,
    );
    return { data: grouped, timeframe: activeTimeframe };
  }, [charts, selectedDate]);

  const subscriberGrowthChartData = growthData?.data || [];
  const subscriberGrowthTimeframe = growthData?.timeframe || "daily";

  const platformData = useMemo(() => {
    return (
      charts?.platformMix?.map((item, idx) => ({
        name: item.platform?.toUpperCase(),
        value: item.revenue,
        color: COLORS[idx % COLORS.length],
      })) || []
    );
  }, [charts]);

  const planData = useMemo(() => {
    // Strict counters for the 2 allowed subscription tiers
    let oneMonthCount = 0;
    let threeMonthCount = 0;

    charts?.planDistribution?.forEach((item) => {
      const plan = item.plan?.toUpperCase() || "";
      // Capture variants of spelling just in case
      if (plan === "1_MONTH" || plan === "MONTHLY") {
        oneMonthCount += item.count || 0;
      } else if (plan === "3_MONTH" || plan === "QUARTERLY") {
        threeMonthCount += item.count || 0;
      }
    });

    return [
      {
        name: "1 Month Premium",
        subscribers: oneMonthCount,
        // fill: "hsl(var(--brand-blue))",
        fill: "#007FC0", // primary2
      },
      {
        name: "3 Months Premium",
        subscribers: threeMonthCount,
        // fill: "hsl(var(--aqua-gradient-start))",
        fill: "#5AA0C1", // primary3
      },
    ];
  }, [charts]);

  const isRevenueTrendEmpty = useMemo(() => {
    return (
      !revenueTrendChartData ||
      revenueTrendChartData.length === 0 ||
      !revenueTrendChartData.some((d) =>
        Object.entries(d).some(
          ([key, value]) =>
            key !== "name" &&
            key !== "compareDate" &&
            key !== "total" &&
            typeof value === "number" &&
            value > 0,
        ),
      )
    );
  }, [revenueTrendChartData]);

  const isSubscriberGrowthEmpty = useMemo(() => {
    return (
      !subscriberGrowthChartData ||
      subscriberGrowthChartData.length === 0 ||
      !subscriberGrowthChartData.some(
        (d) => (d.new || 0) > 0 || (d.cancelled || 0) > 0,
      )
    );
  }, [subscriberGrowthChartData]);

  const isPlatformMixEmpty = useMemo(() => {
    return (
      !platformData ||
      platformData.length === 0 ||
      platformData.every((d) => (d.value || 0) === 0)
    );
  }, [platformData]);

  const isBestSellingProductsEmpty = useMemo(() => {
    const products = charts?.bestSellingProducts || [];
    return (
      products.length === 0 ||
      products.every((p) => (p.salesCount || 0) === 0 && (p.revenue || 0) === 0)
    );
  }, [charts]);

  const bestSellingProductsTotalRevenue = useMemo(() => {
    return (
      charts?.bestSellingProducts?.reduce(
        (acc, p) => acc + (p.revenue || 0),
        0,
      ) || 0
    );
  }, [charts]);

  useEffect(() => {
    const handleScroll = (e) => {
      const target =
        e.target === document
          ? document.documentElement || document.body
          : e.target;
      const currentScrollY =
        window.scrollY || (target && target.scrollTop) || 0;

      // Update scrolled state for shadow
      setScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  if (statsLoading && !subscriptionStats)
    return <SubscriptionDashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center font-jakarta">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8"
        >
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-rose-200/40 rounded-full blur-3xl scale-110" />

          {/* Stylized Icon Container */}
          <div className="relative w-24 h-24 bg-white rounded-full shadow-sm shadow-rose-200/50 flex items-center justify-center border border-rose-50 ring-4 ring-rose-50/50">
            <AlertTriangle
              size={44}
              className="text-rose-500"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Analytics Unavailable
          </h2>
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              We encountered an unexpected issue while retrieving your revenue
              metrics. This might be a temporary connection hiccup.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                System Error: {error}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12"
        >
          <Button
            onClick={handleRefresh}
            className="group relative h-14 px-10 border hover:border-transparent bg-slate-100 hover:bg-app-primary5 text-slate-400 hover:text-white rounded-lg font-bold shadow-sm shadow-slate-200 hover:shadow-brand-blue transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
              <span className="text-base">Refresh Analytics</span>
            </span>
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </motion.div>

        {/* Support Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-tighter"
        >
          If the issue persists, please contact technical support
        </motion.p>
      </div>
    );
  }

  return (
    <ShadTooltipProvider>
      <div className="flex flex-1 flex-col font-jakarta bg-slate-50 min-h-screen max-w-[100vw] mb-10 relative">
        <AnimatePresence>
          {statsLoading && subscriptionStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60]"
            >
              <TableLoader text="Updating Results..." />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="@container/main space-y-4 relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Dashboard Header - Sticky with Blur */}
          <header
            className={cn(
              "sticky top-0 z-[50] px-3 md:px-6 py-3 transition-all duration-300 ease-in-out",
              scrolled
                ? "backdrop-blur-md bg-white/95 border-b border-slate-300/60 shadow-sm shadow-slate-300/50"
                : "bg-slate-50 backdrop-blur-none border-b border-transparent shadow-none",
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <PageHeader
                heading="Revenue Dashboard"
                icon={
                  <TrendingUp strokeWidth={2} className="w-8 h-8 text-white" />
                }
                color="bg-app-primary2 shadow-brand-blue"
                subheading={
                  <div className="flex items-center gap-1">
                    <span>Showing data for:</span>
                    <span className="text-brand-blue font-semibold">
                      {dynamicPeriodLabel}
                    </span>
                  </div>
                }
              />

              <CalendarDateRangePicker
                value={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </header>

          {/* KPI Cards */}
          {coreStats.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mx-6 pt-4"
            >
              {coreStats.map((stat, idx) => {
                const hasTrend =
                  stat.trend &&
                  stat.trend !== "Today" &&
                  stat.trend !== "This month" &&
                  stat.trend !== "Recurring" &&
                  stat.trend !== "Free at Premium" &&
                  stat.trend !== "0% churn";
                const isTrendingUp = hasTrend && !stat.trend.startsWith("-");
                const isNegative = stat.trendClass?.includes("EF4444");
                return (
                  <div
                    key={idx}
                    className="group relative bg-white border border-[#E5E7EB] rounded-[14px] p-6 shadow-sm transition-all duration-500 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-1 active:scale-[0.98] cursor-pointer min-h-[110px]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "p-3 rounded-full bg-slate-200/40 shadow-sm transition-all duration-300 group-hover:shadow-md",
                          colorMap[stat.color],
                        )}
                      >
                        {stat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold text-foreground/70 capitalize mb-1">
                            {stat.label}
                          </div>

                          {stat.tooltipData ? (
                            <ShadTooltip delayDuration={200}>
                              <ShadTooltipTrigger asChild>
                                <div
                                  className={`flex items-center gap-1 font-bold text-[10px] border rounded-full py-1 px-2 shrink-0 cursor-help transition-transform ${
                                    isNegative
                                      ? "text-rose-600 bg-rose-50 border-rose-200"
                                      : "text-brand-blue bg-app-primary2 border-brand-blue"
                                  }`}
                                >
                                  {isTrendingUp && hasTrend ? (
                                    <TablerTrendingUp size={12} stroke={3} />
                                  ) : hasTrend ? (
                                    <TablerTrendingDown size={12} stroke={3} />
                                  ) : null}
                                  <span>{stat.trend}</span>
                                </div>
                              </ShadTooltipTrigger>
                              <ShadTooltipContent
                                className="bg-slate-900 border-brand-blue text-slate-100 shadow-xl shadow-brand-blue max-w-xs text-xs space-y-1.5 p-3 rounded-xl font-medium"
                                side="bottom"
                                align="end"
                              >
                                <p className="text-slate-300 border-b border-slate-700/50 pb-1.5 mb-1.5 leading-relaxed">
                                  {getSubTrendExplanation(stat)}
                                </p>

                                {"subscribers" in stat.tooltipData ? (
                                  <div className="space-y-1 mt-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Active Subscribers:
                                      </span>
                                      <span>
                                        {stat.tooltipData.subscribers?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Total Users:
                                      </span>
                                      <span>
                                        {stat.tooltipData.totalUsers?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ) : "cancellations" in stat.tooltipData ? (
                                  <div className="space-y-1 mt-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Cancellations:
                                      </span>
                                      <span>
                                        {stat.tooltipData.cancellations?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Active at Start:
                                      </span>
                                      <span>
                                        {stat.tooltipData.activeAtStart?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1 mt-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Current Period:
                                      </span>
                                      <span>
                                        {stat.tooltipData.isCurrency ? "$" : ""}
                                        {stat.tooltipData.current?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-slate-400">
                                        Previous Period:
                                      </span>
                                      <span>
                                        {stat.tooltipData.isCurrency ? "$" : ""}
                                        {stat.tooltipData.previous?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-4 font-bold text-white pt-1 mt-1 border-t border-slate-700/50">
                                      <span>Difference:</span>
                                      <span
                                        className={
                                          isNegative
                                            ? "text-rose-400"
                                            : "text-brand-blue"
                                        }
                                      >
                                        {stat.tooltipData.current -
                                          stat.tooltipData.previous >
                                        0
                                          ? "+"
                                          : ""}
                                        {stat.tooltipData.isCurrency ? "$" : ""}
                                        {(
                                          stat.tooltipData.current -
                                          stat.tooltipData.previous
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </ShadTooltipContent>
                            </ShadTooltip>
                          ) : (
                            <span
                              className={`text-[11px] font-bold ${stat.trendClass}`}
                            >
                              {stat.trend}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold text-[#1F2937] leading-none">
                            {stat.val}
                          </div>
                        </div>
                        <p className="text-[11px] font-medium mt-1.5 text-secondary-foreground">
                          {stat.sublabel}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Milestone Program */}
          {kpis?.milestone && (
            <div className="bg-white border border-slate-300/60 rounded-xl shadow-sm mb-6 mx-6 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-300/60 flex items-center justify-between">
                <DashboardHead
                  title="Milestone Program"
                  subtitle="Free Premium Grant Progress"
                  Icon={Trophy}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
                <span className="text-[10px] font-extrabold py-1 px-3 rounded-[20px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] uppercase tracking-wide">
                  Active
                </span>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-3 items-baseline">
                  <span className="text-[13px] font-bold text-[#6B7280]">
                    Target:{" "}
                    <span className="text-[#1F2937] font-extrabold">
                      {(kpis.milestone.targetCount || 0).toLocaleString()} users
                    </span>
                  </span>
                  <span className="text-[16px] font-extrabold text-[#14B8A6]">
                    {Math.round(milestoneProgress * 100) / 100}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#E2E8F0] m-0 w-full overflow-hidden">
                  <div
                    className="h-full bg-app-primary2 rounded-full transition-all duration-500"
                    style={{ width: `${milestoneProgress}%` }}
                  ></div>
                </div>
                <div className="text-[11px] font-semibold text-[#9CA3AF] mt-3">
                  Currently at{" "}
                  {(kpis.milestone.currentCount || 0).toLocaleString()} users,{" "}
                  {(
                    (kpis.milestone.targetCount || 0) -
                    (kpis.milestone.currentCount || 0)
                  ).toLocaleString()}{" "}
                  to go
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-6">
            <RevenueTrendChart
              revenueTrendChartData={revenueTrendChartData}
              chartType={chartType}
              setChartType={setChartType}
              activeSubFilters={activeSubFilters}
              setActiveSubFilters={setActiveSubFilters}
              isRevenueTrendEmpty={isRevenueTrendEmpty}
            />

            <PlatformMixChart
              platformData={platformData}
              isPlatformMixEmpty={isPlatformMixEmpty}
            />
          </div>

          {/* Second Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-6">
            <SubscriberGrowthChart
              subscriberGrowthChartData={subscriberGrowthChartData}
              isSubscriberGrowthEmpty={isSubscriberGrowthEmpty}
            />

            {/* Plan Distribution */}
            <div className="h-[440px]">
              <PlanDistributionChart planData={planData} />
            </div>
          </div>

          {/* Third Row: Best Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mx-6">
            <BestSellingProductsList
              bestSellingProducts={charts?.bestSellingProducts}
              bestSellingProductsTotalRevenue={bestSellingProductsTotalRevenue}
              isBestSellingProductsEmpty={isBestSellingProductsEmpty}
            />

            {subscriptionStats?.last24HoursActivity && (
              <div className="h-full sm:h-[440px]">
                <Last24HoursPieChart
                  last24HoursActivity={subscriptionStats.last24HoursActivity}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </ShadTooltipProvider>
  );
}
