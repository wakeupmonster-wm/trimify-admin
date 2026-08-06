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
      lastSegment === "cms-management" &&
      currentPath.includes("/privacy-policy")
    )
      return true;
    if (
      lastSegment === "cms-management" &&
      currentPath.includes("/terms-conditions")
    )
      return true;
    if (
      lastSegment === "cms-management" &&
      currentPath.includes("/about-us")
    )
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
      <SidebarGroupLabel className="px-6 h-8 text-[10px] mb-1 font-bold uppercase tracking-widest text-slate-500">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="group-data-[collapsible=icon]:pl-1 group-data-[collapsible=icon]:gap-2.5 group-data-[collapsible=icon]:!items-start gap-3 2xl:gap-0.5">
        {items.map((item) => {
          const isActive =
            isPathActive(location.pathname, item.url) ||
            item.items?.some((subItem) =>
              isPathActive(location.pathname, subItem.url, true),
            );
          const Icon = item.icon;
          const hasChildren = item.items && item.items.length > 0;
          const hasActiveChild =
            hasChildren &&
            item.items?.some((subItem) =>
              isPathActive(location.pathname, subItem.url, true),
            );

          const content = (
            <SidebarMenuItem key={item.url || item.title}>
              {hasChildren ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "relative w-full transition-all duration-300 h-11 px-6 rounded-none border-none",
                      "hover:bg-slate-100/50 active:scale-[0.98]",
                      "group-data-[collapsible=icon]:!w-16 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0",
                      isActive && "bg-app-primary2/10 hover:bg-app-primary2/20",
                    )}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-app-primary2" />
                      )}

                      <div
                        className={cn(
                          "flex size-5 3xl:size-6 items-center justify-center transition-all duration-300",
                          isActive
                            ? "text-app-primary2"
                            : "text-slate-400 hover:text-foreground/80",
                        )}
                      >
                        <Icon className="size-5 3xl:size-6" />
                      </div>

                      <span
                        className={cn(
                          "group-data-[collapsible=icon]:hidden flex-1 truncate text-[13px] 3xl:text-sm tracking-tight transition-colors duration-300",
                          isActive
                            ? "text-app-primary2 font-bold"
                            : "text-slate-600 font-medium hover:text-foreground/80",
                        )}
                      >
                        {item.title}
                      </span>

                      {item.badge && (
                        <div
                          className={cn(
                            "h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter shadow-sm",
                            getBadgeStyles(item.badge, isActive),
                          )}
                        >
                          {item.badge}
                        </div>
                      )}

                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform duration-300 text-slate-400 group-data-[collapsible=icon]:hidden",
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
                    "relative w-full transition-all duration-300 h-11 px-6 rounded-none border-none",
                    "hover:bg-slate-100/50 active:scale-[0.98]",
                    "group-data-[collapsible=icon]:!w-16 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0",
                    isActive && "!bg-blue-100/50 !hover:bg-blue-200/50",
                  )}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-app-primary2" />
                    )}

                    <div
                      className={cn(
                        "flex size-5 3xl:size-6 items-center justify-center transition-all duration-300",
                        isActive
                          ? "text-app-primary2"
                          : "text-slate-400 hover:text-foreground/80",
                      )}
                    >
                      <Icon className="size-5 3xl:size-6" />
                    </div>

                    <span
                      className={cn(
                        "group-data-[collapsible=icon]:hidden flex-1 truncate text-[13px] 3xl:text-sm tracking-tight transition-colors duration-300",
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
                          "group-data-[collapsible=icon]:hidden h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter shadow-sm",
                          getBadgeStyles(item.badge, isActive),
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
                        <SidebarMenuSubItem key={subItem.url || subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                              "group relative h-10 w-full transition-all duration-200 px-6 rounded-none",
                              isSubActive
                                ? "!text-app-primary2 font-semibold !bg-blue-100/50"
                                : "text-muted-foreground font-medium hover:text-foreground hover:bg-slate-50",
                            )}
                          >
                            <Link
                              to={subItem.url}
                              className="flex items-center gap-3 w-full"
                            >
                              {/* Left bar indicator for active sub-tab */}
                              {isSubActive && (
                                <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-app-primary2" />
                              )}
                              <span className="text-xs 3xl:text-[13px] tracking-tight">
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
              key={item.url || item.title}
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
