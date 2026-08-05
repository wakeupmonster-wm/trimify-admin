import React, { useEffect, useState } from "react";
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
import dummyImg from "@/assets/web/owner.png";
import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "@/modules/accounts/store/account.slice";
import { useMemo } from "react";
import trimifyLogo from "@/assets/web/trimifyLogo.png";
import { cn } from "@/lib/utils";
// import { fetchReportedProfiles } from "@/modules/profileReview/store/profile-review.slice";
// import { fetchPendingVerifications } from "@/modules/verification/store/verfication.slice";
// import { fetchMyTickets } from "@/modules/support/store/support.slice";
import { LogOut, Loader2 } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { logout } from "@/modules/authentication/store/auth.slice";

export function AppSidebar({ ...props }) {
  const dispatch = useDispatch();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Artificial delay so the loading button state is visible to the user
      await new Promise((resolve) => setTimeout(resolve, 800));
      dispatch(logout());
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setIsLoggingOut(false);
      window.location.href = "/";
    }
  };

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

  const { user } = useSelector((state) => state.auth);

  const navUser = useMemo(
    () => ({
      name: user?.nickname || user?.name || "Admin",
      email: user?.email || "admin@example.com",
      avatar: dummyImg,
    }),
    [user],
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
                  <div className="flex items-center justify-center rounded-lg max-w-22 h-10">
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

        {/* {dynamicNavigation.navSecondary && (
          <NavSecondary items={dynamicNavigation.navSecondary} />
        )} */}
      </SidebarContent>

      {/* --- FOOTER: User Profile --- */}
      {/* <SidebarFooter className="border-t border-slate-300/60 px-3 py-4">
        <NavUser user={navUser} />
      </SidebarFooter> */}

      {/* Add Here Logout  */}
      <SidebarFooter className="border-t border-slate-300/60 px-3 py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoggingOut}
              className="text-red-500 hover:text-white bg-red-100 hover:bg-red-500 w-full flex items-center gap-3 p-5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
              ) : (
                <LogOut className="h-5 w-5 ml-0.5" strokeWidth={2} />
              )}
              <span className="font-bold text-sm">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout from Trimify"
        message="Are you sure you want to log out? You will need to enter your credentials to access the admin panel again."
        confirmText="Logout"
        type="danger"
        loading={isLoggingOut}
      />
    </Sidebar>
  );
}
