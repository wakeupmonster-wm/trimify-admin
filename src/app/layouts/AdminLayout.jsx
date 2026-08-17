import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppSidebar } from "@/components/core/appSideBar";
import { SiteHeader } from "@/components/core/siteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROLES } from "@/constants/roles";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  if (!isAuthenticated || user?.role !== ROLES.ADMIN) {
    return navigate("/");
  }

  return (
    <SidebarProvider>
      {/* 1. The Sidebar remains fixed on the left */}
      <AppSidebar />
      {/* 2. The Inset area creates the "frame" for your content */}
      <SidebarInset className="flex h-dvh flex-1 flex-col min-w-0 bg-white overflow-hidden">
        <SiteHeader />
        {/* 3. The Main content area with proper max-width for readability */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-white text-foreground font-['Plus_Jakarta_Sans',sans-serif]"
        >
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
