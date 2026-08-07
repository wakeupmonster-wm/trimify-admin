import React from "react";
import DonutStatCard from "./DonutStatCard";

const BAR_COLORS = [
  "#007FC0", // primary blue
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#0891b2", // cyan-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#0d9488", // teal-600
  "#4f46e5", // indigo-600
  "#06b6d4", // cyan-500
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
