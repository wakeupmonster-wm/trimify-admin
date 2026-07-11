import React from "react";
import { useEffect } from "react";
import { NavMain } from "@/components/core/navigations/nav-main";
import { NavUser } from "@/components/core/navigations/nav-user";
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
import navigationData from "@/app/data/navigation";
import { Link, useLocation } from "react-router-dom";
import dummyImg from "@/assets/web/dummyImg.webp";
import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "@/modules/accounts/store/account.slice";
import { useMemo } from "react";
import mustardLogo from "@/assets/web/mustardLogo2.webp";
import { cn } from "@/lib/utils";
// import { fetchReportedProfiles } from "@/modules/profileReview/store/profile-review.slice";
// import { fetchPendingVerifications } from "@/modules/verification/store/verfication.slice";
// import { fetchMyTickets } from "@/modules/support/store/support.slice";

export function AppSidebar({ ...props }) {
  const dispatch = useDispatch();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);
  // const { account } = useSelector((state) => state.account);

  // --- Dynamic Badge Stats ---
  // const { kpiStats: reportStats = {} } = useSelector((state) => state.profileReview);
  // const { kpiStats: kycStats  = {} } = useSelector((state) => state.verification);
  // const { kpiStats: supportStats  = {} } = useSelector((state) => state.support);

  useEffect(() => {
    // dispatch(fetchProfile());
    // // Fetch counts for badges
    // dispatch(fetchReportedProfiles({ limit: 1 }));
    // dispatch(fetchPendingVerifications({ limit: 1 }));
    // dispatch(fetchMyTickets({ limit: 1 }));
  }, [dispatch]);

  // const navUser = useMemo(
  //   () => ({
  //     name: account?.nickname || "Admin",
  //     email: account?.email || "admin@keenasmustard.com",
  //     avatar: account?.avatar?.url || dummyImg,
  //   }),
  //   [account],
  // );

    const navUser = useMemo(
    () => ({
      name: "Admin",
      email: "admin@keenasmustard.com",
      avatar: dummyImg,
    }),
    [],
  );

  // --- Optimized Navigation Data with Dynamic Badges ---
  // const dynamicNavigation = useMemo(() => {
  //   return {
  //     ...navigationData,
  //     navManagement: navigationData.navManagement.map((item) => {
  //       if (item.title === "Profile reports") {
  //         return { ...item, badge: reportStats?.newReports || null };
  //       }
  //       if (item.title === "KYC Verification") {
  //         return { ...item, badge: kycStats?.pending || null };
  //       }
  //       if (item.title === "Support Tickets") {
  //         return { ...item, badge: supportStats?.openTickets || null };
  //       }
  //       return item;
  //     }),
  //   };
  // }, [reportStats, kycStats, supportStats]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 bg-white pt-1"
      {...props}
    >
      {/* --- HEADER: Logo & Branding --- */}
      <SidebarHeader className="sticky top-0 z-20 h-[3.75rem] items-center justify-center border-b border-slate-200 bg-white p-0">
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
                  <div className="flex items-center justify-center rounded-lg">
                    <img
                      src={mustardLogo}
                      alt="Logo"
                      loading="lazy"
                      className="w-9 h-7"
                    />
                  </div>
                  <div className="grid flex-1 text-left leading-[14px] text-brand-aqua truncate text-sm font-bold">
                    Keen As <br /> Mustard
                  </div>
                </Link>
              </SidebarMenuButton>
            )}

            {/* 3. Trigger button hamesha dikhega, collapsed mode mein center हो jayega */}
            <SidebarTrigger
              className={cn(
                "-ml-1 mr-2 text-slate-500 hover:bg-slate-100",
                !open && "mx-auto ml-0", // Collapsed hone par center align karne ke liye
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- CONTENT: Navigation Sections --- */}
      <SidebarContent className="flex-1 overflow-y-auto scrollbar-thin pt-4 gap-0 bg-white">
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

        {/* {dynamicNavigation.navSecondary && (
          <NavSecondary items={dynamicNavigation.navSecondary} />
        )} */}
      </SidebarContent>

      {/* --- FOOTER: User Profile --- */}
      <SidebarFooter className="border-t border-slate-200 px-3 py-4">
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
