import React from "react";
import { cn } from "@/lib/utils";

const Header = ({ children, className }) => {
  return (
    <header
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-6",
        className,
      )}
    >
      {children}
    </header>
  );
};

export default Header;
