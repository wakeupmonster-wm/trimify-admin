import React from "react";
import DonutStatCard from "./DonutStatCard";

import { SECTION_CHART_COLORS } from "@/config/theme.config";

const BAR_COLORS = SECTION_CHART_COLORS?.dashboard?.programSplit || [
  "#007fc0",
  "#009dee",
  "#1cb2ff",
  "#3dc1ff",
  "#49c1ff",
  "#77d1ff",
];

const ProgramEnrollmentCard = ({
  title = "Program Enrollment Split",
  subtitle,
  Icon,
  iconColor,
  iconBg,
  tooltipText,
  data = [],
}) => {
  // Sort descending and take top 5
  const sorted = [...data]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
    .slice(0, 5)
    .map((item, idx) => ({
      label: item.title || `Program ${idx + 1}`,
      value: item.total ?? 0,
      color: BAR_COLORS[idx % BAR_COLORS.length],
    }));

  return (
    <DonutStatCard
      title={title}
      subtitle={subtitle}
      Icon={Icon}
      iconColor={iconColor}
      iconBg={iconBg}
      tooltipText={tooltipText}
      data={sorted}
    />
  );
};

export default ProgramEnrollmentCard;
