import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Container } from "@/components/common/container";

export default function PlatformSettingsLayout() {
  const location = useLocation();

  // If someone lands exactly on /admin/management/settings, redirect to general
  if (
    location.pathname === "/admin/management/settings" ||
    location.pathname === "/admin/management/settings/"
  ) {
    return <Navigate to="general" replace />;
  }

  return (
    <Container>
      <main className="flex-1 pb-20 w-full font-sans">
        {/* --- COMMON HEADER: PLATFORM SETTINGS --- */}
        <header className="px-2 mb-3 pb-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-[13px] font-medium text-muted-foreground/80 mt-1">
            Manage application preferences, links, and integrations
          </p>
        </header>

        {/* --- CHILD CONTENT AREA --- */}
        <div className="bg-white rounded-xl border border-slate-300/60 shadow-sm overflow-hidden">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </Container>
  );
}
