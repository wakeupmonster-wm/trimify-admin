import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavPlateform({ items }) {
  const location = useLocation();

  // --- Helper to check if a path is active ---
  const isPathActive = (currentPath, targetPath, isSubItem = false) => {
    if (!targetPath) return false;
    if (currentPath === targetPath) return true;

    // For sub-items, we don't want prefix matching (like /admin matching everything)
    // but for top-level items, we do want to highlight the parent section.
    if (!isSubItem && currentPath.startsWith(targetPath + "/")) return true;

    // Special Case: Handle sibling "view" or "detail" pages that should highlight a "manage" or "list" item
    const segments = targetPath.split("/");
    const lastSegment = segments[segments.length - 1];

    if (
      lastSegment === "manage-subscribers" &&
      currentPath.includes("/view-subscription")
    )
      return true;
    if (
      lastSegment === "users-management" &&
      currentPath.includes("/view-profile")
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
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="px-6 h-6 text-[9.5px] mb-0.5 font-bold uppercase tracking-widest text-slate-400">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="group-data-[collapsible=icon]:!items-start gap-0.5">
        {items.map((item) => {
          const isActive = isPathActive(location.pathname, item.url);
          const Icon = item.icon;
          const hasChildren = item.items && item.items.length > 0;
          const hasActiveChild =
            hasChildren &&
            item.items.some((subItem) =>
              isPathActive(location.pathname, subItem.url, true),
            );

          const content = (
            <SidebarMenuItem key={item.title}>
              {hasChildren ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "relative h-11 w-full transition-all duration-300 px-6 rounded-none border-none",
                      "hover:bg-slate-100/50 active:scale-[0.98]",
                      "group-data-[collapsible=icon]:!w-16 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0",
                      (isActive || hasActiveChild) &&
                        "bg-blue-100/50 hover:bg-blue-100/90",
                    )}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      {(isActive || hasActiveChild) && (
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-app-primary2" />
                      )}

                      <div
                        className={cn(
                          "flex size-5 items-center justify-center transition-all duration-300 group-data-[collapsible=icon]:ml-4",
                          isActive || hasActiveChild
                            ? "text-app-primary2"
                            : "text-slate-400 hover:text-foreground/80",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>

                      <span
                        className={cn(
                          "flex-1 truncate text-[13px] tracking-tight transition-colors duration-300",
                          isActive || hasActiveChild
                            ? "text-app-primary2 font-bold"
                            : "text-slate-600 font-medium hover:text-foreground/80",
                        )}
                      >
                        {item.title}
                      </span>

                      {item.badge && (
                        <div
                          className={cn(
                            "h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter shadow-sm group-data-[collapsible=icon]:hidden",
                            isActive
                              ? "bg-app-primary2 text-white"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {item.badge}
                        </div>
                      )}

                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform duration-200 text-slate-400",
                          "group-data-[state=open]/collapsible:rotate-90",
                        )}
                      />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "relative h-11 w-full transition-all duration-300 px-6 rounded-none border-none",
                    "hover:bg-slate-100/50 active:scale-[0.98]",
                    "group-data-[collapsible=icon]:!w-16 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0",
                    isActive && "!bg-blue-100/50 !hover:bg-blue-100/90",
                  )}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-app-primary2" />
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
                        "flex-1 truncate text-[13px] tracking-tight transition-colors duration-300 group-data-[collapsible=icon]:hidden",
                        isActive
                          ? "text-app-primary2 font-bold"
                          : "text-slate-600 font-medium hover:text-slate-900",
                      )}
                    >
                      {item.title}
                    </span>

                    {item.badge && (
                      <div
                        className={cn(
                          "h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter shadow-sm group-data-[collapsible=icon]:hidden",
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
              )}

              {hasChildren && (
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-8 flex flex-col gap-0 border-l border-slate-300/60/60 pl-0">
                    {item.items?.map((subItem) => {
                      const isSubActive = isPathActive(
                        location.pathname,
                        subItem.url,
                        true,
                      );
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                              "group relative h-9 w-full transition-all duration-200 px-4 rounded-none",
                              isSubActive
                                ? "!text-app-primary2 font-semibold !bg-app-primary2"
                                : "text-muted-foreground font-medium hover:text-foreground hover:bg-slate-50",
                            )}
                          >
                            <Link
                              to={subItem.url}
                              className="flex items-center gap-3 w-full"
                            >
                              {/* Left bar indicator for active sub-tab */}
                              {isSubActive && (
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-app-primary2" />
                              )}
                              <span className="text-[12.5px] tracking-tight">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          );

          return hasChildren ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={hasActiveChild}
              className="group/collapsible"
            >
              {content}
            </Collapsible>
          ) : (
            <div key={item.title}>{content}</div>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
