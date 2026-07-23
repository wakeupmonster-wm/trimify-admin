import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppSidebar } from "@/components/core/appSideBar";
import { SiteHeader } from "@/components/core/siteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROLES } from "@/constants/roles";
import GlobalCampaignAlert from "@/components/common/GlobalCampaignAlert";
import { toast } from "sonner";

import { SocketProvider, useSocket } from "@/app/context/SocketContext";

function GlobalSocketHandler() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleGlobalActivity = (data) => {
      console.log("🌍 Global Activity Notification:", data);

      let formattedTime = "Just now";
      if (data.time) {
        try {
          const d = new Date(data.time);
          if (!isNaN(d.getTime())) {
            formattedTime = new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(d);
          } else {
            formattedTime = data.time; // Fallback if invalid date
          }
        } catch (e) {
          console.error("Date formatting error:", e);
          formattedTime = data.time;
        }
      }

      // console.log("🌍 formattedTime: ", formattedTime);
      toast.error(data.description, {
        description: formattedTime,
        position: "top-right",
      });
    };

    socket.on("new_live_activity", handleGlobalActivity);

    return () => {
      socket.off("new_live_activity", handleGlobalActivity);
    };
  }, [socket]);

  return null;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  // const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  // if (!isAuthenticated || user?.role !== ROLES.ADMIN) {
  //   return navigate("/");
  // }

  return (
    // <SocketProvider token={token}>
    // <GlobalSocketHandler />
    <SidebarProvider>
      {/* <GlobalCampaignAlert /> */}
      {/* 1. The Sidebar remains fixed on the left */}
      <AppSidebar />

      {/* 2. The Inset area creates the "frame" for your content */}
      <SidebarInset className="flex h-screen flex-1 flex-col min-w-0 bg-white overflow-hidden">
        <SiteHeader />

        {/* 3. The Main content area with proper max-width for readability */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-white text-foreground font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* bg-[#F8FAFC] */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
    // </SocketProvider>
  );
}
