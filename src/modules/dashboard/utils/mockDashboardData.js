import {
  differenceInDays,
  isToday,
  isYesterday,
  format,
  subDays,
  addDays
} from "date-fns";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function detectPreset(dateRange) {
  if (dateRange?.preset) return dateRange.preset;
  if (!dateRange?.from) return "last7";

  const from = new Date(dateRange.from);
  const to = dateRange.to ? new Date(dateRange.to) : new Date();
  const days = differenceInDays(to, from);

  if (days === 0 && isToday(from)) return "today";
  if (days === 0 && isYesterday(from)) return "yesterday";
  if (days >= 2 && days <= 3 && isToday(to)) return "last3";
  if (days >= 6 && days <= 7 && isToday(to)) return "last7";
  if (days >= 29 && days <= 30 && isToday(to)) return "last30";
  return "custom";
}

function getContextLabel(preset) {
  switch (preset) {
    case "today": return "vs yesterday";
    case "yesterday": return "vs day before";
    case "last3": return "vs previous 3 days";
    case "last7": return "vs previous 7 days";
    case "last30": return "vs previous 30 days";
    case "custom": default: return "vs previous period";
  }
}

function getPeriodLabel(dateRange, preset) {
  switch (preset) {
    case "today": return "Today";
    case "yesterday": return "Yesterday";
    case "last3": return "Last 3 Days";
    case "last7": return "Last 7 Days";
    case "last30": return "Last 30 Days";
    case "custom": default: {
      const from = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 7);
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      return `${format(from, "MMM dd")} – ${format(to, "dd MMM, yyyy")}`;
    }
  }
}

function randomize(base, variancePercent = 15) {
  if (base === 0) return 0;
  const variance = base * (variancePercent / 100);
  return Math.round(base + (Math.random() * 2 - 1) * variance);
}

function getTrendDates(preset, dateRange) {
  let from, to;
  if (preset === "today") {
      to = new Date();
      from = new Date();
  } else if (preset === "yesterday") {
      to = subDays(new Date(), 1);
      from = subDays(new Date(), 1);
  } else if (preset === "last30") {
      to = new Date();
      from = subDays(new Date(), 30);
  } else if (preset === "last7" || !dateRange?.from) {
      to = new Date();
      from = subDays(new Date(), 7);
  } else {
      from = new Date(dateRange.from);
      to = new Date(dateRange.to || new Date());
  }
  
  const days = Math.abs(differenceInDays(to, from)) + 1;
  const dates = [];
  const maxDays = Math.min(days, 30);
  for (let i = 0; i < maxDays; i++) {
      dates.push(format(addDays(from, i), "yyyy-MM-dd"));
  }
  return dates;
}

// ─── Builder Functions ─────────────────────────────────────────────────────────

function buildZone1(preset) {
  const multiplier = preset === "last30" ? 30 : preset === "last7" ? 7 : preset === "last3" ? 3 : 1;
  
  return {
    secondaryKpis: {
      totalRevenueAllTime: 3209.97,
      totalUsersAllTime: 736,
      newSignupsToday: randomize(6 * multiplier, 20),
      expiringSoon: randomize(2 * multiplier, 30),
      totalPrograms: 8,
      totalFitzoneSessions: randomize(15 * multiplier, 20),
      totalBlogs: 24,
      totalPublishedBlogs: 4,
      totalSubAdmins: 0, 
    },
    alerts: {
      ghostingUsers: {
        needsAttention: true,
        count: randomize(121, 10),
        thresholdDays: 60,
      },
      newSignupsZeroEngagement: {
        needsAttention: true,
        count: randomize(7, 20),
        thresholdDays: 7,
      },
    },
  };
}

function buildZone2(preset) {
  const multiplier = preset === "last30" ? 30 : preset === "last7" ? 7 : preset === "last3" ? 3 : 1;
  const signups = randomize(6 * multiplier, 20);
  const paid = Math.floor(signups * 0.4); // ~40% conversion
  
  return {
    pieCharts: {
      userGoals: [
        { label: "Unspecified", total: 395 },
        { label: "Weight Loss", total: 290 },
        { label: "Gain Muscle", total: 30 },
        { label: "Manage Hypertension", total: 13 },
        { label: "Maintain Weight", total: 11 },
        { label: "Manage Diabetes", total: 0 },
        { label: "Prevent Chronic Disease", total: 1 },
      ],
      gender: [
        { label: "Male", total: 420 },
        { label: "Female", total: 322 },
        { label: "Other", total: 4 },
      ],
      dietPreference: [
        { label: "Unspecified", total: 395 },
        { label: "Non-Vegetarian", total: 317 },
        { label: "Vegetarian", total: 24 },
      ],
    },
    funnel: {
      totalSignups: signups,
      paidUsers: paid,
      notPaidUsers: signups - paid,
      conversionRate: signups > 0 ? Math.round((paid / signups) * 100) : 0,
      dropOffRate: signups > 0 ? Math.round(((signups - paid) / signups) * 100) : 0,
    },
  };
}

function buildZone3(preset, dateRange) {
  const dates = getTrendDates(preset, dateRange);
  const multiplier = preset === "last30" ? 4 : 1;
  
  const engagementDAU = dates.map(date => ({
    date,
    active_users: randomize(150, 20)
  }));
  
  const fitzoneCompletion = dates.map(date => {
    const active = randomize(20, 30);
    return {
      date,
      Active: active,
      Completed: Math.floor(active * 0.75)
    };
  });
  
  return {
    trends: {
      engagementDAU,
      fitzoneCompletion,
      fitzoneStatuses: ["Active", "Completed"],
      popularPrograms: [
        { title: "30-Day Shred", total: randomize(120 * multiplier, 15) },
        { title: "Beginner Yoga", total: randomize(95 * multiplier, 15) },
        { title: "HIIT Blast", total: randomize(85 * multiplier, 15) },
        { title: "Core Strength", total: randomize(60 * multiplier, 15) },
        { title: "Flexibility Focus", total: randomize(45 * multiplier, 15) },
      ],
    },
    tables: {
      recentUsers: [
        { id: "101", name: "Rahul Verma", email: "rahul.v@example.com", created_at: new Date().toISOString() },
        { id: "102", name: "Simran Kaur", email: "simran.k@example.com", created_at: subDays(new Date(), 1).toISOString() },
        { id: "103", name: "Vikram Singh", email: "vikram.s@example.com", created_at: subDays(new Date(), 2).toISOString() },
        { id: "104", name: "Neha Sharma", email: "neha.s@example.com", created_at: subDays(new Date(), 2).toISOString() },
        { id: "105", name: "Arjun Patel", email: "arjun.p@example.com", created_at: subDays(new Date(), 3).toISOString() },
      ].slice(0, preset === "today" ? 2 : 5),
    },
  };
}

function buildZone4() {
  return {
    tables: {
      abandonedCheckouts: [
        { id: "chk_001", user_id: "201", name: "Sanjay bishnoi Sharma", signed_up_at: "2026-06-18T21:09:00Z", days_since_signup: 47, main_goal: "lose weight", gender: "male" },
        { id: "chk_002", user_id: "202", name: "Load Tester", signed_up_at: "2026-06-19T22:06:00Z", days_since_signup: 46, main_goal: "weight loss", gender: "male" },
        { id: "chk_003", user_id: "203", name: "raju patel", signed_up_at: "2026-06-26T17:41:00Z", days_since_signup: 38, main_goal: "lose weight", gender: "male" },
        { id: "chk_004", user_id: "204", name: "rajwev12 patel123", signed_up_at: "2026-06-27T14:15:00Z", days_since_signup: 37, main_goal: "lose weight", gender: "male" },
        { id: "chk_005", user_id: "205", name: "rajwev1234 patel12323", signed_up_at: "2026-06-27T12:08:00Z", days_since_signup: 37, main_goal: "lose weight", gender: "male" },
        { id: "chk_006", user_id: "206", name: "raju patel", signed_up_at: "2026-07-01T14:03:00Z", days_since_signup: 33, main_goal: "lose weight", gender: "male" },
        { id: "chk_007", user_id: "207", name: "raju singh", signed_up_at: "2026-07-14T19:12:00Z", days_since_signup: 19, main_goal: "maintain weight", gender: "male" },
        { id: "chk_008", user_id: "208", name: "bbb bbkb", signed_up_at: "2026-07-17T23:09:00Z", days_since_signup: 16, main_goal: "gain muscle", gender: "male" },
        { id: "chk_009", user_id: "209", name: "babab babab", signed_up_at: "2026-07-18T20:36:00Z", days_since_signup: 15, main_goal: "lose weight", gender: "male" },
      ],
    },
  };
}

// ─── Main Factory Function ─────────────────────────────────────────────────────

export function getMockDashboardData(dateRange) {
  const preset = detectPreset(dateRange);
  const contextLabel = getContextLabel(preset);
  const periodLabel = getPeriodLabel(dateRange, preset);

  return {
    success: true,
    meta: {
      dateRange,
      preset,
      periodLabel,
      contextLabel,
    },
    data: {
      zone1: buildZone1(preset),
      zone2: buildZone2(preset),
      zone3: buildZone3(preset, dateRange),
      zone4: buildZone4(),
    },
  };
}

// Fallback constant for any legacy imports expecting the static object
export const mockDashboardData = getMockDashboardData({ preset: "today" });

