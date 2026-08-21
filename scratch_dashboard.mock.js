import {
  differenceInDays,
  isToday,
  isYesterday,
  format,
  subDays,
} from "date-fns";

export const MOCK_USERS = [
  {
    id: 552,
    name: "Marian Asaad",
    email: "admin@acemechanical.com.au",
    plan: "Premium",
    status: "active",
    inactiveDays: 0,
    created_at: "2026-04-09T05:05:59.000000Z",
    email_verified_at: null,
    programs: { active: 8 },
    fitzone: { assigned: 4 },
    reasons: ["Unverified Email"],
    attentionIssues: [
      { type: "critical", label: "No Logs" },
      { type: "warning", label: "Water Goal" },
      { type: "warning", label: "Protein" },
      { type: "critical", label: "Inactive" },
      { type: "info", label: "Unverified Email" },
    ],
  },
  {
    id: 551,
    name: "Maged saleh",
    email: "maged@acemechanical.com.au",
    plan: "Premium",
    status: "active",
    inactiveDays: 2,
    created_at: "2026-04-09T05:01:24.000000Z",
    email_verified_at: null,
    programs: { active: 0 },
    fitzone: { assigned: 0 },
    reasons: ["High BMI", "Unverified Email"],
    attentionIssues: [
      { type: "critical", label: "High BMI" },
      { type: "warning", label: "Protein" },
      { type: "info", label: "Unverified Email" }
    ],
  },
  {
    id: 549,
    name: "Janine Buntain",
    email: "buntainjan@gmail.com",
    plan: "Premium",
    status: "active",
    inactiveDays: 0,
    created_at: "2026-04-09T02:15:04.000000Z",
    email_verified_at: null,
    programs: { active: 2 },
    fitzone: { assigned: 4 },
    reasons: ["Unverified Email"],
    attentionIssues: [
      { type: "info", label: "Unverified Email" }
    ],
  },
  {
    id: 548,
    name: "Susan Sharp",
    email: "susansharp99@gmail.com",
    plan: "Premium",
    status: "active",
    inactiveDays: "Never",
    created_at: "2026-04-09T01:54:59.000000Z",
    email_verified_at: null,
    programs: { active: 1 },
    fitzone: { assigned: 1 },
    reasons: ["High BMI", "Unverified Email"],
    attentionIssues: [
      { type: "critical", label: "High BMI" },
      { type: "info", label: "Unverified Email" }
    ],
  },
  {
    id: 547,
    name: "Hamideh Mozafari",
    email: "nozasarzeinab11@gmail.com",
    plan: "Premium",
    status: "active",
    inactiveDays: 5,
    created_at: "2026-04-08T03:22:53.000000Z",
    email_verified_at: null,
    programs: { active: 1 },
    fitzone: { assigned: 0 },
    reasons: ["High BMI", "Inactive", "Unverified Email"],
    attentionIssues: [
      { type: "critical", label: "High BMI" },
      { type: "warning", label: "Inactive" },
      { type: "info", label: "Unverified Email" }
    ],
  }
];

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

/**
 * Returns a section title prefix for the glance zone.
 */
function getGlanceTitle(preset) {
  switch (preset) {
    case "today":
      return "Today at a glance";
    case "yesterday":
      return "Yesterday at a glance";
    case "last7":
      return "Last 7 days at a glance";
    case "last30":
      return "Last 30 days at a glance";
    case "last90":
      return "Last 90 days at a glance";
    case "custom":
    default:
      return "Period at a glance";
  }
}

/**
 * Randomizes a number within a variance percentage for variety.
 */
function randomize(base, variancePercent = 15) {
  if (base === 0) return 0;
  const variance = base * (variancePercent / 100);
  return Math.round(base + (Math.random() * 2 - 1) * variance);
}

// ─── Builder Functions ─────────────────────────────────────────────────────────

function buildZone1(preset, dateRange) {
  const multiplier = preset === "last30" ? 30 : preset === "last7" ? 7 : preset === "last3" ? 3 : 1;

  const getSubtext = () => {
    if (preset === "today") return "↑ 1% vs yesterday";
    if (preset === "yesterday") return "↑ 2% vs previous day";
    if (preset === "last30" || preset === "lastMonth") return "↑ 12% vs last month";
    if (preset === "last90") return "↑ 15% vs last 90 days";
    return "↑ 6% vs last 7 days";
  };

  const t1Up = Math.random() > 0.3;
  const t2Up = Math.random() > 0.3;
  const t3Up = Math.random() > 0.3;
  const t4Down = Math.random() > 0.4;
  const t5Down = Math.random() > 0.4;
  const t6Up = Math.random() > 0.3;
  const t7Down = Math.random() > 0.4;
  const t8Up = Math.random() > 0.3;
  const t9Down = Math.random() > 0.4;
  const t10Down = Math.random() > 0.4;
  const t11Down = Math.random() > 0.4;
  const t12Down = Math.random() > 0.5;
  const t13Up = Math.random() > 0.3;
  const t14Up = Math.random() > 0.3;

  const totalAssignedVal = randomize(1250 + (multiplier * 2), 2);
  const activeUsersVal = randomize(845 + (multiplier * 5), 5);
  const newThisWeekVal = randomize(6 * multiplier, 20);
  const expiringSoonVal = randomize(2 * multiplier, 30);
  const urgentFollowUpsVal = randomize(12 + Math.floor(multiplier / 2), 20);
  const healthImprovementRateVal = randomize(66, 10);
  const dietAdherenceRateVal = randomize(40, 15);
  const stepGoalAdherenceVal = randomize(72, 10);
  const waterMissedVal = randomize(110 + (multiplier * 2), 15);
  const stepsMissedVal = randomize(95 + (multiplier * 2), 15);
  const dietMissedVal = randomize(140 + (multiplier * 2), 15);
  const abnormalBmiVal = randomize(65 + Math.floor(multiplier / 2), 10);
  const revenueVal = randomize(5500 + (multiplier * 150), 10);
  const onboardingCompletionVal = randomize(85, 10);

  const factor = multiplier / 7 || 0.5;

  return {
    title: getGlanceTitle(preset),
    kpis: {
      totalAssigned: {
        key: "totalAssigned",
        title: "Members",
        filterParam: null,
        value: totalAssignedVal,
        subtext: "Total number of members ever assigned to your supervision.",
        trend: t1Up ? "up" : "down",
        trendValue: `${t1Up ? "+" : "-"}${(Math.random() * 5 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: totalAssignedVal, previous: Math.round(totalAssignedVal * (t1Up ? 0.96 : 1.04)), isCurrency: false }
      },
      activeUsers: {
        key: "activeUsers",
        title: "Active Members",
        filterParam: "Active",
        value: activeUsersVal,
        subtext: "Members who have logged in or interacted within the past 7 days.",
        trend: t2Up ? "up" : "down",
        trendValue: `${t2Up ? "+" : "-"}${(Math.random() * 6 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: activeUsersVal, previous: Math.round(activeUsersVal * (t2Up ? 0.95 : 1.05)), isCurrency: false }
      },
      newThisWeek: {
        key: "newThisWeek",
        title: "New Users",
        filterParam: "New Today",
        value: newThisWeekVal,
        subtext: getSubtext(),
        trend: t3Up ? "up" : "down",
        trendValue: `${t3Up ? "+" : "-"}${(Math.random() * 8 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: newThisWeekVal, previous: Math.round(newThisWeekVal * (t3Up ? 0.92 : 1.08)), isCurrency: false }
      },
      expiringSoon: {
        key: "expiringSoon",
        title: "Expiring Soon",
        filterParam: "Expire Soon",
        value: expiringSoonVal,
        subtext: "Members whose subscription plans will expire within the next 7 days.",
        trend: t4Down ? "down" : "up",
        trendValue: `${t4Down ? "-" : "+"}${(Math.random() * 10 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: expiringSoonVal, previous: Math.round(expiringSoonVal * (t4Down ? 1.1 : 0.9)), isCurrency: false }
      },
      urgentFollowUps: {
        key: "urgentFollowUps",
        title: "Urgent Follow-ups",
        filterParam: "Attention Required",
        value: urgentFollowUpsVal,
        subtext: "High risk or ghosting users",
        trend: t5Down ? "down" : "up",
        trendValue: `${t5Down ? "-" : "+"}${(Math.random() * 15 * factor + 5).toFixed(1)}%`,
        tooltipData: { current: urgentFollowUpsVal, previous: Math.round(urgentFollowUpsVal * (t5Down ? 1.15 : 0.85)), isCurrency: false }
      },
      healthImprovementRate: {
        key: "healthImprovementRate",
        title: "Health Improvement Rate",
        filterParam: "Health Improvement",
        value: `${healthImprovementRateVal}%`,
        subtext: "Patients moving in goal-direction",
        trend: t6Up ? "up" : "down",
        trendValue: `${t6Up ? "+" : "-"}${(Math.random() * 5 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: healthImprovementRateVal, previous: Math.round(healthImprovementRateVal * (t6Up ? 0.95 : 1.05)), isCurrency: false }
      },
      dietAdherenceRate: {
        key: "dietAdherenceRate",
        title: "Diet Adherence Rate",
        filterParam: "Diet Adherence",
        value: `${dietAdherenceRateVal}%`,
        subtext: "Days calorie goals were met",
        trend: t7Down ? "down" : "up",
        trendValue: `${t7Down ? "-" : "+"}${(Math.random() * 8 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: dietAdherenceRateVal, previous: Math.round(dietAdherenceRateVal * (t7Down ? 1.08 : 0.92)), isCurrency: false }
      },
      stepGoalAdherence: {
        key: "stepGoalAdherence",
        title: "Step Goal Adherence",
        filterParam: "Step Goal Reached",
        value: `${stepGoalAdherenceVal}%`,
        subtext: "Members hitting daily target steps",
        trend: t8Up ? "up" : "down",
        trendValue: `${t8Up ? "+" : "-"}${(Math.random() * 6 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: stepGoalAdherenceVal, previous: Math.round(stepGoalAdherenceVal * (t8Up ? 0.94 : 1.06)), isCurrency: false }
      },
      waterMissed: {
        key: "waterMissed",
        title: "Water Missed",
        filterParam: "Water Missed",
        value: waterMissedVal,
        subtext: "Users who missed water goal",
        trend: t9Down ? "down" : "up",
        trendValue: `${t9Down ? "-" : "+"}${(Math.random() * 8 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: waterMissedVal, previous: Math.round(waterMissedVal * (t9Down ? 1.08 : 0.92)), isCurrency: false }
      },
      stepsMissed: {
        key: "stepsMissed",
        title: "Steps Missed",
        filterParam: "Steps Missed",
        value: stepsMissedVal,
        subtext: "Users who missed step goal",
        trend: t10Down ? "down" : "up",
        trendValue: `${t10Down ? "-" : "+"}${(Math.random() * 8 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: stepsMissedVal, previous: Math.round(stepsMissedVal * (t10Down ? 1.08 : 0.92)), isCurrency: false }
      },
      dietMissed: {
        key: "dietMissed",
        title: "Diet Missed",
        filterParam: "Diet Missed",
        value: dietMissedVal,
        subtext: "Users who missed calorie goal",
        trend: t11Down ? "down" : "up",
        trendValue: `${t11Down ? "-" : "+"}${(Math.random() * 8 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: dietMissedVal, previous: Math.round(dietMissedVal * (t11Down ? 1.08 : 0.92)), isCurrency: false }
      },
      abnormalBmi: {
        key: "abnormalBmi",
        title: "Abnormal BMI",
        filterParam: "Abnormal BMI",
        value: abnormalBmiVal,
        subtext: "Users with BMI outside normal range",
        trend: t12Down ? "down" : "up",
        trendValue: `${t12Down ? "-" : "+"}${(Math.random() * 5 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: abnormalBmiVal, previous: Math.round(abnormalBmiVal * (t12Down ? 1.05 : 0.95)), isCurrency: false }
      },
      revenue: {
        key: "revenue",
        title: "Revenue Collected",
        filterParam: null,
        value: revenueVal,
        subtext: "Total collected from plans",
        trend: t13Up ? "up" : "down",
        trendValue: `${t13Up ? "+" : "-"}${(Math.random() * 10 * factor + 2).toFixed(1)}%`,
        tooltipData: { current: revenueVal, previous: Math.round(revenueVal * (t13Up ? 0.9 : 1.1)), isCurrency: true }
      },
      onboardingCompletion: {
        key: "onboardingCompletion",
        title: "Onboarding Completion",
        filterParam: "Onboarding Complete",
        value: `${onboardingCompletionVal}%`,
        subtext: "Profiles completed (last 30d)",
        trend: t14Up ? "up" : "down",
        trendValue: `${t14Up ? "+" : "-"}${(Math.random() * 6 * factor + 1).toFixed(1)}%`,
        tooltipData: { current: onboardingCompletionVal, previous: Math.round(onboardingCompletionVal * (t14Up ? 0.94 : 1.06)), isCurrency: false }
      }
    },
    coordinatorScore: {
      score: randomize(88, 5),
      trend: "up",
      trendValue: randomize(4, 20),
      percentile: randomize(15, 10),
      components: [
        { label: "Health", value: randomize(85, 5) },
        { label: "Diet", value: randomize(72, 10) },
        { label: "Programs", value: randomize(90, 5) },
        { label: "Engagement", value: randomize(82, 5) }
      ]
    },
    assignmentLoad: {
      current: randomize(185, 10),
      capacity: 200,
      newThisWeek: randomize(2 * multiplier, 30)
    }
  };
}

function buildZone2(preset, dateRange) {
  const multiplier = preset === "last30" ? 4 : preset === "last7" ? 1 : preset === "last3" ? 0.5 : 0.2;

  return {
    alerts: [
      {
        id: "needs_attention",
        severity: "warning",
        label: "Needs Attention",
        description: "364 members (96.6%) are falling behind their health goals.",
        cta: "Review",
        route: "/users",
        filterState: { attentionFilter: "Attention Required" }
      },
      {
        id: "inactive",
        severity: "info",
        label: "Inactive Members",
        description: "377 members haven't logged activity.",
        cta: "Engage",
        route: "/users",
        filterState: { filterId: "Inactive" }
      },
      {
        id: "expiry_soon",
        severity: "danger",
        label: "Expiry Soon",
        description: "128 members have plans expiring within 15 days.",
        cta: "View Users",
        route: "/users",
        filterState: { filterId: "Expire Soon" }
      },
    ],
    priorityFollowUps: [
      { id: 552, name: "Marian Asaad", initials: "MA", riskType: "warning", tag: "Ghosting: 7 Days", lastActive: "7 days ago" },
      { id: 551, name: "Maged saleh", initials: "MS", riskType: "critical", tag: "Weight Spike: +2.5kg", lastActive: "2 days ago" },
      { id: 547, name: "Hamideh Mozafari", initials: "HM", riskType: "critical", tag: "Diet Goal Breached x3 Days", lastActive: "5 days ago" },
      { id: 548, name: "Susan Sharp", initials: "SS", riskType: "critical", tag: "High BMI", lastActive: "Never" },
      { id: 549, name: "Janine Buntain", initials: "JB", riskType: "info", tag: "Unverified Email", lastActive: "Today" },
    ].slice(0, 5),
    subscriptionHealth: {
      healthy: randomize(1250 * (multiplier || 1), 10),
      expiring: randomize(45 * (multiplier || 1), 15),
      expired: randomize(12 * (multiplier || 1), 20),
    },
    healthAttentionCenter: {
      matrix: [
        { metric: "Weight Goal", onTrack: randomize(850, 10), needsAttention: randomize(320, 15), noData: randomize(80, 20) },
        { metric: "BMI", onTrack: randomize(640, 10), needsAttention: randomize(610, 10), noData: 0 },
        { metric: "Water Goal", onTrack: randomize(780, 10), needsAttention: randomize(370, 15), noData: randomize(100, 20) },
        { metric: "Step Goal", onTrack: randomize(600, 10), needsAttention: randomize(440, 15), noData: randomize(210, 20) },
        { metric: "Calories Goal", onTrack: randomize(880, 10), needsAttention: randomize(300, 15), noData: randomize(70, 20) },
      ],
      attentionNeeded: [
        { priority: "high", title: "High BMI", description: "Members exceeding BMI > 30", count: randomize(610, 10), iconType: "bmi" },
        { priority: "medium", title: "Weight Increasing", description: "Steady weight gain over 2 weeks", count: randomize(320, 15), iconType: "weight" },
        { priority: "low", title: "Water Goal Missed", description: "Missed goal for 3 consecutive days", count: randomize(370, 15), iconType: "water" },
        { priority: "medium", title: "No Step Activity (7 days)", description: "No steps logged in the past week", count: randomize(440, 15), iconType: "steps" },
        { priority: "neutral", title: "Missing Health Profile", description: "Incomplete onboarding setup", count: randomize(70, 20), iconType: "profile" }
      ],
      compliance: [
        { metric: "Weight Goal", onTrack: randomize(850, 10), total: 1250 },
        { metric: "BMI (Healthy Range)", onTrack: randomize(640, 10), total: 1250 },
        { metric: "Water Goal", onTrack: randomize(780, 10), total: 1250 },
        { metric: "Step Goal", onTrack: randomize(600, 10), total: 1250 },
        { metric: "Calories Goal", onTrack: randomize(880, 10), total: 1250 }
      ]
    },
    reengagement: {
      value: `${randomize(20, 20)}%`,
      subtext: "Closed-loop from 'Inactive' alerts",
      trend: "up",
      inactive30DaysAgo: randomize(150, 20),
      reactivated14Days: randomize(30, 20),
    },
    healthImprovement: {
      improving: randomize(245, 10),
      stable: randomize(102, 10),
      declining: randomize(48, 10),
      trend: "up",
      trendValue: randomize(2.4, 10),
      history: [
        { month: "Apr", rate: randomize(58, 10) },
        { month: "May", rate: randomize(60, 10) },
        { month: "Jun", rate: randomize(62, 10) },
        { month: "Jul", rate: randomize(66, 10) }
      ]
    }
  };
}

function buildZone3(preset, dateRange) {
  const m = preset === "last30" ? 1.5 : preset === "last7" ? 1 : 0.8;

  return {
    pieCharts: {
      bmiDistribution: [
        { label: "Underweight", value: randomize(40 * m, 10) },
        { label: "Normal", value: randomize(600 * m, 5) },
        { label: "Overweight", value: randomize(450 * m, 5) },
        { label: "Obese", value: randomize(160 * m, 10) },
      ],
      gender: [
        { label: "Male", value: randomize(750 * m, 5) },
        { label: "Female", value: randomize(470 * m, 5) },
        { label: "Other/Unspecified", value: randomize(30 * m, 10) },
      ],
      dietPreference: [
        { label: "Vegetarian", value: randomize(480 * m, 5) },
        { label: "Non-Vegetarian", value: randomize(650 * m, 5) },
        { label: "Unspecified", value: randomize(40 * m, 10) },
      ],
      subscriptionPlans: [
        { label: "Basic Plan", value: randomize(165 * m, 10) },
        { label: "Premium Plan", value: randomize(680 * m, 5) },
      ],
    },
    goalDistribution: [
      { label: "Weight Loss", value: randomize(700 * m, 5) },
      { label: "Muscle Gain", value: randomize(250 * m, 10) },
      { label: "Maintain Weight", value: randomize(150 * m, 10) },
      { label: "Improve Health", value: randomize(80 * m, 15) },
      { label: "Prevent Disease", value: randomize(45 * m, 15) },
      { label: "Manage Diabetes", value: randomize(25 * m, 20) },
    ],
    funnel: {
      stages: [
        { label: "Total Members", value: randomize(1250 * m, 5), dropOff: 0 },
        { label: "Premium Plan", value: randomize(680 * m, 5), dropOff: -45.6 },
        { label: "Basic Plan", value: randomize(165 * m, 10), dropOff: -75.7 },
      ],
      notPaidUsers: randomize(165 * m, 10),
      conversionRate: randomize(54.4, 5),
      dropOffRate: randomize(45.6, 5),
    },
    subscriptionHealth: {
      healthy: randomize(560 * m, 5),
      expiring: randomize(42 * m, 15),
      expired: randomize(18 * m, 20),
    },
    ageDistribution: [
      { range: "18-24", count: randomize(250 * m, 10), percentage: 20.0 },
      { range: "25-34", count: randomize(500 * m, 5), percentage: 40.0 },
      { range: "35-44", count: randomize(350 * m, 10), percentage: 28.0 },
      { range: "45-54", count: randomize(100 * m, 15), percentage: 8.0 },
      { range: "55+", count: randomize(50 * m, 20), percentage: 4.0 },
    ]
  };
}

function buildZone4(preset, dateRange) {
  const getEngagementDAU = () => {
    if (preset === "last30" || preset === "thisMonth" || preset === "lastMonth") {
      return [
        { date: "Week 1", active_users: randomize(550, 10), inactive_users: randomize(700, 10) },
        { date: "Week 2", active_users: randomize(620, 10), inactive_users: randomize(630, 10) },
        { date: "Week 3", active_users: randomize(750, 10), inactive_users: randomize(500, 10) },
        { date: "Week 4", active_users: randomize(845, 10), inactive_users: randomize(405, 10) },
        { date: "Week 5", active_users: randomize(890, 10), inactive_users: randomize(350, 10) },
      ];
    }

    if (preset === "last90") {
      return [
        { date: "Month 1", active_users: randomize(400, 10), inactive_users: randomize(850, 10) },
        { date: "Month 2", active_users: randomize(600, 10), inactive_users: randomize(650, 10) },
        { date: "Month 3", active_users: randomize(845, 10), inactive_users: randomize(405, 10) },
      ];
    }

    if (preset === "today") {
      return [
        { date: "Today", active_users: randomize(845, 5), inactive_users: randomize(405, 5) },
      ];
    }

    return [
      { date: "2026-08-13T00:00:00Z", active_users: randomize(650, 5), inactive_users: randomize(600, 5) },
      { date: "2026-08-14T00:00:00Z", active_users: randomize(680, 5), inactive_users: randomize(570, 5) },
      { date: "2026-08-15T00:00:00Z", active_users: randomize(710, 5), inactive_users: randomize(540, 5) },
      { date: "2026-08-16T00:00:00Z", active_users: randomize(705, 5), inactive_users: randomize(545, 5) },
      { date: "2026-08-17T00:00:00Z", active_users: randomize(720, 5), inactive_users: randomize(530, 5) },
      { date: "2026-08-18T00:00:00Z", active_users: randomize(810, 5), inactive_users: randomize(440, 5) },
      { date: "2026-08-19T00:00:00Z", active_users: randomize(845, 5), inactive_users: randomize(405, 5) },
    ];
  };

  const m = preset === "last30" ? 4 : 1;

  return {
    trends: {
      engagementDAU: getEngagementDAU(),
      weeklySignups: [
        { week: "W1 Jul", new_users: randomize(35 * m, 20) },
        { week: "W2 Jul", new_users: randomize(40 * m, 20) },
        { week: "W3 Jul", new_users: randomize(28 * m, 20) },
        { week: "W4 Jul", new_users: randomize(42 * m, 20) },
      ],
    },
    dietAdherence: {
      rate: randomize(76, 5),
      trend: "up",
      daysFollowed: randomize(22, 10),
      daysMissed: randomize(8, 20),
      history: [
        { day: "Mon", rate: randomize(60, 10) },
        { day: "Tue", rate: randomize(75, 10) },
        { day: "Wed", rate: randomize(80, 10) },
        { day: "Thu", rate: randomize(70, 10) },
        { day: "Fri", rate: randomize(85, 10) },
        { day: "Sat", rate: randomize(90, 10) },
        { day: "Sun", rate: randomize(76, 10) },
      ]
    },
    programCompletion: {
      completed: randomize(310 * m, 5),
      active: randomize(450 * m, 5),
      dropped: randomize(85 * m, 10)
    },
    engagementDepth: {
      full: randomize(280 * m, 5),
      partial: randomize(410 * m, 5),
      low: randomize(155 * m, 10),
      history: [
        { name: "Full", value: randomize(280 * m, 5) },
        { name: "Partial", value: randomize(410 * m, 5) },
        { name: "Low", value: randomize(155 * m, 10) },
      ]
    },
    healthStats: {
      avgWeight: randomize(76.5, 2),
      avgHeight: 172.4, // Keep height static
      avgBMI: randomize(25.8, 2),
      avgWaterGoal: randomize(2800, 5),
      avgStepGoal: randomize(8500, 10),
    },
    nutritionStats: {
      macroRadar: [
        { metric: "Protein", value: randomize(88, 5) },
        { metric: "Carbs", value: randomize(95, 5) },
        { metric: "Fat", value: randomize(76, 5) },
        { metric: "Fiber", value: randomize(65, 5) },
      ],
      avgCalories: randomize(2150, 5),
      avgProtein: randomize(135, 5),
      avgCarbs: randomize(240, 5),
      avgFat: randomize(72, 5),
    }
  };
}

function buildZone5(preset, dateRange) {
  const usersCount = preset === "today" ? 3 : preset === "yesterday" ? 4 : 5;

  // Single table object representing all user activity
  return {
    tables: {
      usersList: [...MOCK_USERS].slice(0, usersCount),
    }
  };
}

// ─── Main Factory Function ─────────────────────────────────────────────────────

export const generateSubAdminDashboardMock = (dateRange = {}) => {
  const preset = detectPreset(dateRange);
  const contextLabel = getContextLabel(preset);
  const periodLabel = getPeriodLabel(dateRange, preset);

  return {
    success: true,
    message: "Dashboard data fetched successfully",
    meta: {
      dateRange,
      preset,
      periodLabel,
      contextLabel,
    },
    data: {
      zone1: buildZone1(preset, dateRange),
      zone2: buildZone2(preset, dateRange),
      zone3: buildZone3(preset, dateRange),
      zone4: buildZone4(preset, dateRange),
      zone5: buildZone5(preset, dateRange),
    }
  };
};

export const mockDashboardData = generateSubAdminDashboardMock({ preset: "today" });