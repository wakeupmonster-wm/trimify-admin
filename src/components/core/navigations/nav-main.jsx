import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Added AnimatePresence
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({ items }) {
  const location = useLocation();

  // --- Helper to check if a path is active ---
  const isPathActive = (currentPath, targetPath) => {
    if (!targetPath) return false;
    if (currentPath === targetPath) return true;
    if (currentPath.startsWith(targetPath + "/")) return true;

    // Special Case: Handle sibling "view" or "detail" pages that should highlight a "manage" or "list" item
    const segments = targetPath.split("/");
    const lastSegment = segments[segments.length - 1];

    if (
      lastSegment === "dashboard" &&
      currentPath.includes("/view-profile") &&
      location.state?.from === "/admin/dashboard"
    )
      return true;

    if (
      lastSegment === "manage-subscribers" &&
      currentPath.includes("/view-subscription")
    )
      return true;
    if (lastSegment === "support" && currentPath.includes("/view-ticket"))
      return true;
    if (lastSegment === "giveaway" && currentPath.includes("/view-campaign"))
      return true;

    return false;
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="px-0 py-2">
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = isPathActive(location.pathname, item.url);
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={cn(
                  "relative h-11 w-full transition-all duration-300 px-4 rounded-none border-none",
                  "hover:bg-slate-100/50 active:scale-[0.98]",
                  isActive && "!bg-app-primary2 !hover:bg-app-primary5",
                )}
              >
                <Link to={item.url} className="flex items-center gap-3 w-full">
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[4px] bg-app-primary2"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <div
                    className={cn(
                      "flex size-5 items-center justify-center transition-all duration-300",
                      isActive ? "text-app-primary2" : "text-slate-400",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <span
                    className={cn(
                      "flex-1 truncate text-[13px] tracking-tight transition-colors duration-300",
                      isActive
                        ? "text-app-primary2 font-bold"
                        : "text-slate-600 font-medium hover:text-slate-900",
                    )}
                  >
                    {item.title}
                  </span>

                  {/* Badge for notifications */}
                  {item.badge && (
                    <div
                      className={cn(
                        "h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter shadow-sm",
                        isActive
                          ? "bg-app-primary2 text-white"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {item.badge}
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
