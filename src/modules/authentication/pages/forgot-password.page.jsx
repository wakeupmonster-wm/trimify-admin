import React from "react";
import loginImg from "@/assets/web/LoginImg.webp";
import { Outlet } from "react-router";

export default function ForgotPasswordPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen h-screen max-h-screen bg-white overflow-hidden">
      {/* Left Side: Premium Hero Section (As per Reference) */}
      <div className="hidden lg:flex flex-col p-2 h-full">
        <div className="relative flex-1 overflow-hidden rounded-2xl shadow-2xl shadow-slate-200/50">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url(${loginImg})`,
            }}
          />

          {/* High-Fidelity Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Main Content Overlay */}
          <div className="absolute bottom-8 xl:bottom-16 left-6 xl:left-12 right-6 xl:right-10 z-20 space-y-2 xl:space-y-4">
            <div className="space-y-2 max-w-96">
              <h1 className="text-white text-3xl xl:text-5xl font-normal leading-[1.2] xl:leading-[1.4] tracking-tight">
                Welcome to <br />
                Trimify Admin{" "}
                <span className="inline-block animate-wave origin-bottom text-3xl xl:text-5xl">
                  👋
                </span>
              </h1>
              <p className="text-gray-200/90 text-xs xl:text-sm font-medium leading-relaxed max-w-xs">
                Your space to manage, monitor, and grow the platform. Everything
                you need. All in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto h-full">
        <div className="w-full max-w-md xl:max-w-lg border rounded-2xl bg-white p-5 sm:p-7 md:p-9 shadow-sm my-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
