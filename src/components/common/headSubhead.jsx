import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PageHeader = React.forwardRef(
  (
    { className, color, heading, subheading, align = "left", icon, ...props },
    ref,
  ) => {
    // Minimalist animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1, // Smooth sequence
          delayChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 }, // Subtle slide up
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // Custom "expo" ease for premium feel
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn(
          "flex flex-col gap-2",
          align === "center" && "items-center text-center",
          align === "right" && "items-end text-right",
          className,
        )}
        {...props}
      >
        {/* <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              variants={itemVariants}
              className={cn(
                "flex p-2 size-10 items-center justify-center rounded-xl",
                color || "bg-white",
              )}
            >
              {icon}
            </motion.div>
          )}

          <motion.h1
            variants={itemVariants}
            className="text-xl font-bold text-foreground tracking-tight sm:text-2xl"
          >
            {heading}
          </motion.h1>
        </div>
        {subheading && (
          <motion.p
            variants={itemVariants}
            className="text-[13px] leading-relaxed text-muted-foreground max-w-[600px] font-medium"
          >
            {subheading}
          </motion.p>
        )} */}

        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              variants={itemVariants}
              className={cn(
                "flex p-2 size-10 items-center justify-center rounded-xl",
                color || "bg-white",
              )}
            >
              {icon}
            </motion.div>
          )}

          <div>
            <motion.h1
              variants={itemVariants}
              className="font-bold text-foreground tracking-tight text-lg sm:text-xl"
            >
              {heading}
            </motion.h1>
            {subheading && (
              <motion.div
                variants={itemVariants}
                className="text-xs leading-relaxed text-muted-foreground max-w-[600px] font-medium"
              >
                {subheading}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

PageHeader.displayName = "PageHeader";

export { PageHeader };
