import { cn } from "@/lib/utils";
import React from "react";

export const Container = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-h-screen py-4 px-6 bg-white pb-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
