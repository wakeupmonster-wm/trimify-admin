/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminEditDialog from "../components/AdminEditDialog";
import { fetchProfile, resetPasswordStatus } from "../store/account.slice";
import {
  Calendar,
  Clock,
  Edit3,
  Globe,
  Hash,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import { PreLoader } from "@/app/loader/preloader";
import SecurityCredentials from "../components/security.credentials";
import { cn } from "@/lib/utils";
import accountBg from "@/assets/web/accountbg.webp";
import { logout } from "@/modules/authentication/store/auth.slice";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import DashboardHead from "@/components/shared/dashboard.head";
import { LuUserRound } from "react-icons/lu";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function AccountsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, loading, passwordSuccess } = useSelector(
    (state) => state.account,
  );
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (passwordSuccess) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => dispatch(resetPasswordStatus()), 5000);
    }
  }, [passwordSuccess, dispatch]);

  const formatDateSafe = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "Invalid Date"
      : format(date, "dd MMM, yyyy - h:mm a");
  };

  const initials = account?.nickname
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading && !account?.id) {
    return <PreLoader />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
    toast.success("Logout successful.");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen pb-12 font-jakarta animate-fade-in relative">
        <div className="w-full p-4 space-y-4">
          {/* HERO SECTION */}
          <div className="relative bg-white rounded-lg shadow-sm shadow-gray-200 overflow-hidden border border-gray-200">
            {/* Cover Banner */}
            <div className="h-48 md:h-60 w-full bg-gradient-to-r from-brand-aqua/35 via-brand-aqua/50 to-brand-aqua/10 relative overflow-hidden">
              {/* Decorative patterns */}
              <img
                src={accountBg}
                alt="accountbg.webp"
                className="w-full h-full"
              />
            </div>

            <div className="px-6 sm:px-10 pb-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end -mt-16 md:-mt-[75px] relative z-10 w-full">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-brand-aqua/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Avatar className="relative h-40 w-40 md:h-44 md:w-44 ring-4 ring-white bg-white shadow-lg rounded-full overflow-hidden">
                    <AvatarImage
                      src={account?.avatar?.url}
                      alt={account?.nickname}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-brand-aqua to-brand-aqua/20 text-white text-5xl font-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status indicator ping */}
                  {/* <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-md">
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  </div> */}
                </div>

                {/* Identity Info */}
                <div className="flex-1 text-center md:text-left space-y-1 mb-3 w-full">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground/90 tracking-tight">
                      {account?.nickname}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8 text-xs font-semibold text-foreground/50">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3. text-brand-aqua" />
                      Joined {formatDateSafe(account?.memberSince)}
                    </span>
                    <span className="flex flex-row items-center gap-2">
                      {/* <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:block" /> */}
                      <Clock className="w-3.5 h-3.5 text-brand-aqua" />
                      Last login {formatDateSafe(account.lastLoginAt)}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="mb-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <AdminEditDialog currentData={account}>
                    <Button className="h-10 w-full md:w-auto px-4 text-xs rounded-lg border border-slate-300 bg-white hover:bg-brand-aqua hover:border-brand-aqua font-medium hover:font-semibold gap-2 text-slate-500 hover:text-white transition-all duration-300">
                      <Edit3 className="w-3.5 h-3.5" strokeWidth={2} />
                      Configure Profile
                    </Button>
                  </AdminEditDialog>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN LAYOUT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT COLUMN: Sidebar Info (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Contact Details Card */}
              <Card className="rounded-lg gap-2 border-gray-200 hover:border-brand-aqua/50 shadow-sm overflow-hidden pt-4 transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="pb-2 px-5 border-b border-slate-300/50">
                    <DashboardHead
                      title="Contact Details"
                      // subtitle="Keep your admin account safe with a strong password."
                      Icon={LuUserRound}
                      iconColor="text-slate-600"
                      iconBg="bg-slate-100/50"
                    />
                  </div>
                </CardHeader>

                <CardContent className="px-5">
                  <InfoItem
                    icon={
                      <Mail
                        className="w-4 h-4 text-brand-aqua"
                        strokeWidth={2.5}
                      />
                    }
                    bg="bg-brand-aqua/10"
                    label="Email Address"
                    value={account?.email}
                    verified={account?.verified?.email}
                  />
                  <InfoItem
                    icon={
                      <Phone
                        className="w-4 h-4 text-brand-aqua"
                        strokeWidth={2.5}
                      />
                    }
                    bg="bg-brand-aqua/10"
                    label="Phone Number"
                    value={account?.phone}
                    verified={account?.verified?.phone}
                  />
                  {/* <InfoItem
                    icon={
                      <MapPin
                        className="w-4 h-4 text-purple-600"
                        strokeWidth={2.5}
                      />
                    }
                    bg="bg-purple-50"
                    label="Location"
                    value={
                      account?.location?.coordinates
                        ? `${account?.location?.coordinates[0]}, ${account?.location?.coordinates[1]}`
                        : "Not Set"
                    }
                  /> */}
                </CardContent>
              </Card>

              {/* Meta Data Card */}
              <Card className="rounded-lg gap-2 border-gray-200 hover:border-brand-aqua/50 shadow-sm overflow-hidden pt-4 transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="pb-2 px-5 border-b border-slate-300/50">
                    <DashboardHead
                      title="Account Metadata"
                      Icon={Globe}
                      iconColor="text-slate-600"
                      iconBg="bg-slate-100/50"
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-5">
                  <InfoItem
                    icon={
                      <Calendar
                        className="w-4 h-4 text-brand-aqua"
                        strokeWidth={2.5}
                      />
                    }
                    bg="bg-brand-aqua/10"
                    label="Member Since"
                    value={formatDateSafe(account?.memberSince)}
                  />
                  <InfoItem
                    icon={
                      <Clock
                        className="w-4 h-4 text-brand-aqua"
                        strokeWidth={2.5}
                      />
                    }
                    bg="bg-brand-aqua/10"
                    label="Last Login"
                    value={formatDateSafe(account?.lastLoginAt)}
                  />

                  <div className="flex items-center gap-5 p-2 px-4 rounded-lg bg-slate-50 group hover:bg-slate-100/50 transition-colors">
                    <div className="p-1 rounded-md bg-slate-50 shadow-sm text-slate-700 group-hover:scale-110 transition-transform">
                      <Hash className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-0.5">
                        Unique Account ID
                      </p>
                      <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 truncate break-all">
                        {account?.id || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Stats & Security (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Quick Stats Grid */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  {
                    label: "Privilege",
                    value: account?.role,
                    icon: ShieldCheck,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                    ring: "ring-indigo-100",
                  },
                  {
                    label: "Account Status",
                    value: account?.status,
                    icon: CheckCircle2,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    ring: "ring-emerald-100",
                  },
                  {
                    label: "Email Secured",
                    value: account?.verified?.email ? "Verified" : "Pending",
                    icon: Mail,
                    color: "text-brand-aqua",
                    bg: "bg-brand-aqua/10",
                    ring: "ring-brand-aqua/20",
                  },
                  {
                    label: "Phone Secured",
                    value: account?.verified?.phone ? "Verified" : "Pending",
                    icon: Phone,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    ring: "ring-amber-100",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-[2rem] p-6 shadow-sm shadow-gray-200 border border-gray-200 hover:border-brand-aqua/50 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={cn(
                        "p-4 rounded-full mb-4 ring-4 transition-transform duration-500 group-hover:scale-110",
                        stat.bg,
                        stat.color,
                        stat.ring,
                      )}
                    >
                      <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <p className="text-lg md:text-xl font-black text-slate-800 capitalize leading-tight mb-1">
                      {stat?.value || "-"}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest line-clamp-1 break-all">
                      {stat?.label}
                    </p>
                  </div>
                ))}
              </div> */}

              {/* Security Component wrapper to give it matching styles */}
              <div className="rounded-lg shadow-sm border border-gray-200 hover:border-brand-aqua/50 overflow-hidden">
                <SecurityCredentials
                  account={account}
                  loading={loading}
                  passwordSuccess={passwordSuccess}
                />
              </div>

              {/* Logout button */}
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                className="h-12 w-full rounded-lg shadow-sm border border-slate-200 bg-white hover:bg-alerts-error hover:border-alerts-error font-medium hover:font-bold gap-2 text-slate-500 hover:text-white transition-all duration-300"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your admin session?"
        confirmText="Log Out"
        type="warning"
      />
    </>
  );
}

function InfoItem({ icon, bg, label, value, verified }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all group overflow-hidden">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={cn(
            "p-2.5 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110",
            bg,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 pr-2">
          <p className="text-[10px] capitalize font-bold text-foreground/60 tracking-wide">
            {label}
          </p>
          <p className="text-[11px] font-semibold text-foreground truncate">
            {value || "-"}
          </p>
        </div>
      </div>
      {/* {verified !== undefined && (
        <Badge
          className={cn(
            "px-2.5 py-0.5 text-[9px] sm:text-[10px] shrink-0 font-bold uppercase tracking-widest rounded-lg border-0 shadow-sm",
            verified
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700",
          )}
        >
          {verified ? "Verified" : "Pending"}
        </Badge>
      )} */}
    </div>
  );
}
