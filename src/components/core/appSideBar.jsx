import React, { useEffect } from "react";
import { NavMain } from "@/components/core/navigations/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavPlateform } from "./navigations/nav-plateform";
import { NavManagements } from "./navigations/nav-managements";
import { NavUser } from "./navigations/nav-user";
import navigationData from "@/app/data/navigation";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import trimifyLogo from "@/assets/web/trimifyLogo.png";
import { cn } from "@/lib/utils";
import { fetchProfile } from "@/modules/accounts/store/account.slice";

export function AppSidebar({ ...props }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const account = useSelector((state) => state.account?.account);

  const localUserStr = localStorage.getItem("auth_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  const displayName =
    account?.name ||
    user?.nickname ||
    user?.name ||
    localUser?.nickname ||
    localUser?.name ||
    "Admin";
  const displayEmail =
    account?.email || user?.email || localUser?.email || "admin@example.com";

  const role =
    user?.role !== undefined
      ? Number(user.role)
      : localUser?.role !== undefined
        ? Number(localUser.role)
        : null;

  const displayUser = {
    ...user,
    ...localUser,
    ...account,
    name: displayName,
    email: displayEmail,
    avatar: account?.avatar?.url || user?.avatar?.url || localUser?.avatar?.url || "",
    initial: displayName.charAt(0).toUpperCase(),
    role: role || localUser?.role || 0,
  };

  const { open, isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-300/60 bg-slate-50 pt-1"
      {...props}
    >
      {/* --- HEADER: Logo & Branding --- */}
      <SidebarHeader className="sticky top-0 z-20 h-[3.75rem] items-center justify-center border-b border-slate-300/60 bg-slate-50 p-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-around px-4">
            {/* 2. Agar sidebar open hai tabhi logo dikhega */}
            {open && (
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:!bg-transparent"
              >
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 pl-2"
                >
                  <div className="flex items-center justify-center rounded-lg max-w-[90px] h-10">
                    <img
                      src={trimifyLogo}
                      alt="Logo"
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
              </SidebarMenuButton>
            )}

            {/* 3. Trigger button hamesha dikhega, collapsed mode mein center */}
            <SidebarTrigger
              className={cn(
                "text-slate-500 hover:bg-slate-100",
                !open && "mx-auto", // Collapsed hone par center align karne ke liye
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- CONTENT: Navigation Sections --- */}
      <SidebarContent className="flex-1 overflow-y-auto scrollbar-thin gap-0 bg-slate-50 pt-2">
        {/* Overview Section */}
        {/* {dynamicNavigation.navMain && ( */}
        <NavMain items={navigationData.navMain} />
        {/* )} */}

        {/* Management Section */}
        {/* {dynamicNavigation.navManagement && ( */}
        <NavManagements items={navigationData.navManagement} />
        {/* )} */}

        {/* Platform Section */}
        {/* {dynamicNavigation.navPlateform && ( */}
        <NavPlateform items={navigationData.navPlateform} />
        {/* )} */}
      </SidebarContent>

      {/* Add Here Logout  */}
      <SidebarFooter className="border-t border-slate-300/60 p-3">
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
