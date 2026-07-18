import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { format } from "date-fns";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25, // Start lower for a more pronounced "wave" up
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15, // Lower damping = more "wave" bounce
      mass: 1,
    },
  },
};

const StatsGrid = ({ stats, colorMap, bgMap, onCardClick }) => {
  // console.log("stats: ", stats);
  return (
    <>
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          onClick={() => {
            if (stat.onClick) stat.onClick();
            if (onCardClick) onCardClick(stat.label);
          }}
          className={cn(
            "group relative p-6 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-500 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-1 active:scale-[0.98]",
            stat.isSelected &&
              "ring-[0.2px] ring-brand-blue border-brand-blue bg-app-primary2",
          )}
        >
          {/* Stat content remains the same */}
          <div className="flex items-start justify-center gap-4">
            <div
              className={cn(
                "p-3 rounded-full bg-slate-200/40 shadow-sm",
                colorMap[stat.color],
              )}
            >
              {stat.icon}
            </div>
            <div className="flex-1 space-y-1.5 w-max">
              <p className="text-xs capitalize font-semibold text-foreground/70 transition-colors">
                {stat.label}
              </p>
              <h4 className="text-[26px] font-extrabold text-slate-900 leading-none">
                {stat.val.toLocaleString()}
              </h4>
              <p className="text-[11px] font-medium mt-1 max-w-[150px] truncate text-secondary-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default StatsGrid;
