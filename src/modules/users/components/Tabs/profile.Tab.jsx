import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconDeviceMobile,
  IconHeart,
  IconHistory,
  IconMail,
  IconMapPin,
  IconSparkles,
  IconUser,
  IconUsers,
  IconAlertCircle,
  IconBrandApple,
  IconBrandAndroid,
  IconWorld,
} from "@tabler/icons-react";
import { FiActivity, FiLink } from "react-icons/fi";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconArrowsMaximize } from "@tabler/icons-react";
// Fix for default marker icons in Leaflet when using Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, verifyUserProfile } from "../../store/user.slice";
import { toast } from "sonner";
import VerificationCard from "../verification.card";
import { PreLoader } from "@/app/loader/preloader";
import { useNavigate } from "react-router";
import DashboardHead from "@/components/shared/dashboard.head";
import { IoCheckmark } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { LuUserRound } from "react-icons/lu";
import { RiFileUserLine } from "react-icons/ri";

// Helper to fix Leaflet map size issues in Dialogs/Tabs
const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    // Delay slightly to ensure Dialog animation has progressed
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

export const ProfileTab = ({ userData: initialUserData, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, loading } = useSelector((state) => state.users);
  const userData = user || initialUserData;

  // Robust data extraction with fallbacks
  const profile = props?.profile || userData?.profile || {};
  const attributes = props?.attributes || userData?.attributes || {};
  const discovery = props?.discovery || userData?.discovery || {};
  const account = props?.account || userData?.account || {};
  const userLoc =
    props?.userLoc || userData?.location || profile?.location || {};

  const userLatitude =
    userLoc?.latitude ||
    userLoc?.lat ||
    userLoc?.coordinates?.[1] ||
    userLoc?.location?.coordinates?.[1];

  const userLongitude =
    userLoc?.longitude ||
    userLoc?.lng ||
    userLoc?.lon ||
    userLoc?.coordinates?.[0] ||
    userLoc?.location?.coordinates?.[0];

  const connectivityItems = [
    {
      label: "Email",
      val: props?.account?.email,
      icon: <IconMail />,
      color: "blue",
      verified: userData.isEmailVerified,
    },
    {
      label: "Phone",
      val: props?.account?.phone,
      icon: <IconDeviceMobile />,
      color: "green",
      verified: userData.isPhoneVerified,
    },
  ];

  // Dynamic Core Attributes configuration
  const coreAttributes = [
    {
      label: "User About",
      val: profile?.about || "-",
      icon: <RiFileUserLine size={20} strokeWidth={0.5} />,
      bg: "bg-blue-50 text-blue-500",
      fullWidth: true,
      className: "md:col-span-2",
    },
    {
      label: "Zodiac",
      val: attributes?.zodiac || "-",
      icon: <IconSparkles size={20} strokeWidth={2} />,
      bg: "bg-violet-50 text-violet-500",
      fullWidth: true,
      isZodiac: true,
      className: "md:col-span-2",
    },
    {
      label: "Nickname",
      val: profile?.nickname || "-",
      icon: <IconUser size={20} strokeWidth={2} />,
      bg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Gender",
      val: profile?.gender || "-",
      icon: <FiActivity size={20} strokeWidth={2} />,
      bg: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Age",
      val: profile?.age ? `${profile.age} Yrs` : "-",
      icon: <IconCalendar size={20} strokeWidth={2} />,
      bg: "bg-amber-50 text-amber-500",
    },
    {
      label: "DOB",
      val: profile?.dob ? format(new Date(profile.dob), "MMM dd, yyyy") : "-",
      icon: <IconCalendar size={20} strokeWidth={2} />,
      bg: "bg-indigo-50 text-indigo-500",
    },
    {
      label: "Job Title",
      val: profile?.jobTitle || "-",
      icon: <IconBriefcase size={20} strokeWidth={2} />,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Company",
      val: profile?.company || "-",
      icon: <IconBuilding size={20} strokeWidth={2} />,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "School",
      val: profile?.school || "-",
      icon: <IconBuilding size={20} strokeWidth={2} />,
      bg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Seeking",
      val: attributes?.relationshipGoal || "-",
      icon: <IconHeart size={20} strokeWidth={2} />,
      bg: "bg-rose-50 text-rose-600",
    },
    {
      label: "Interested In",
      val:
        discovery?.showMeGender?.length > 0
          ? discovery.showMeGender.join(", ")
          : "Open",
      icon: <IconUsers size={20} strokeWidth={2} />,
      bg: "bg-orange-50 text-orange-600",
    },
    // {
    //   label: "Joined Date",
    //   val: account?.createdAt
    //     ? format(new Date(account.createdAt), "dd MMMM, yyyy")
    //     : "-",
    //   icon: <IconCalendar size={20} strokeWidth={2.5} />,
    //   bg: "bg-emerald-50 text-emerald-600",
    // },
    {
      label: "Location",
      val:
        userLoc?.city || userLoc?.state
          ? `${userLoc?.city || "-"}${userLoc?.city && userLoc?.state ? ", " : ""}${userLoc?.state || ""}`
          : "-",
      icon: <IconMapPin size={20} strokeWidth={2} />,
      bg: "bg-emerald-50 text-emerald-600",
    },
  ];

  const handleApprove = async (status) => {
    setIsVerifying(true);
    try {
      await dispatch(
        verifyUserProfile({
          userId: userData._id,
          action: status === "approved" ? "approve" : "reject",
        }),
      ).unwrap();
      // 2. AUTOMATICALLY RE-FETCH the fresh data from the server
      await dispatch(fetchUserData(userData._id));
      toast.success(`Identity ${status} successfully`);
    } catch (err) {
      toast.error(err || "Failed to update verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async (reason, status) => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    await dispatch(
      verifyUserProfile({
        userId: userData._id,
        action: status === "approved" ? "approve" : "reject",
        reason: status === "rejected" ? reason : undefined,
      }),
    ).unwrap();

    // 2. AUTOMATICALLY RE-FETCH the fresh data from the server
    await dispatch(fetchUserData(userData._id));
    toast.success(`Identity ${status} successfully`);
    setIsVerifying(false);
  };

  // Quality description based on completion %
  const completionPercent = props?.profile?.totalCompletion || 0;
  const qualityLabel =
    completionPercent >= 90
      ? "Excellent"
      : completionPercent >= 70
        ? "Good"
        : completionPercent >= 40
          ? "Fair"
          : "Needs Work";
  const qualityColor =
    completionPercent >= 90
      ? "text-emerald-600"
      : completionPercent >= 70
        ? "text-blue-600"
        : completionPercent >= 40
          ? "text-amber-600"
          : "text-rose-600";

  return (
    <>
      <TabsContent
        value="profile"
        className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500 focus-visible:ring-offset-0 focus-visible:ring-0"
      >
        <div className="grid grid-cols-12 gap-6">
          {/* ══════════════════ LEFT COLUMN: PRIMARY PROFILE DATA (col-span-8) ══════════════════ */}
          <div className="col-span-12 xl:col-span-8 space-y-6">
            {/* PROFILE QUALITY CARD */}
            <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-5 px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Profile Quality"
                    subtitle="Overall profile completion score"
                    Icon={FiActivity}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                </div>
              </CardHeader>
              <CardContent className="px-8 flex flex-col md:flex-row items-center gap-4">
                <div className="relative size-24 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90 transform">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={263.8}
                      strokeDashoffset={263.8 * (1 - completionPercent / 100)}
                      strokeLinecap="round"
                      className={qualityColor}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-black text-slate-900 leading-none">
                      {completionPercent}%
                    </span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {qualityLabel}
                  </h4>
                  <p className="text-xs leading-relaxed text-secondary-foreground font-medium max-w-max">
                    {completionPercent < 70
                      ? "Encourage user to complete missing attributes like Zodiac, Job Title, and About section to improve visibility."
                      : "User has a well-maintained profile with most attributes completed. High visibility across the platform."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CORE ATTRIBUTES SECTION (MODERN REDESIGN) */}
            <Card className="overflow-hidden pb-0 border-slate-200/80 gap-3 shadow-sm bg-white rounded-xl">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-5 px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Core Attributes"
                    subtitle="Essential profile information"
                    Icon={LuUserRound}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                  {/* <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                    <TfiMenuAlt className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {coreAttributes.length} Fields
                    </span>
                  </div> */}
                </div>
              </CardHeader>

              <CardContent className="p-0 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mx-6 mb-6 rounded-lg overflow-hidden border-l border-t border-slate-200/60">
                  {coreAttributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-4 p-5 border-r border-b border-slate-200/60 transition-all hover:bg-slate-50/50 group",
                        attr.className,
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform",
                          attr.bg,
                        )}
                      >
                        {attr.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                          {attr.label}
                        </p>
                        {attr.isZodiac ? (
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2 capitalize">
                            {attr.val}
                            {attr.val !== "-" && (
                              <IconSparkles
                                size={14}
                                className="text-violet-400"
                              />
                            )}
                          </p>
                        ) : attr.fullWidth && attr.label === "User About" ? (
                          <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
                            {attr.val}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-slate-900 truncate capitalize">
                            {attr.val}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* IDENTITY VERIFICATION CARD */}
            <VerificationCard
              verification={userData?.verification}
              isVerifying={isVerifying}
              onApprove={handleApprove}
              onReject={handleReject}
              userName={userData?.profile?.nickname}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: SECONDARY DATA (col-span-4)              */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* ACCOUNT CONNECTIVITY */}
            <Card className="border-slate-200/80 gap-1 bg-white shadow-sm overflow-hidden py-5">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-[22px] px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Account Connectivity"
                    // subtitle="Linked verification methods"
                    Icon={FiLink}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                </div>
              </CardHeader>
              <CardContent className="px-5 space-y-2">
                {connectivityItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-100/50"
                  >
                    <div className="p-2 bg-slate-100/50 rounded-full">
                      {React.cloneElement(item.icon, {
                        size: 18,
                        className: "text-slate-600",
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs font-bold text-foreground/80 truncate">
                        {item.val || "Not Linked"}
                      </p>
                    </div>
                    {item.verified && (
                      <Badge className="bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 text-[8px] font-black tracking-widest px-1.5">
                        VERIFIED
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* LOCATION CARD */}
            <Card className="border-slate-200/80 gap-1 bg-white shadow-sm overflow-hidden py-6">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Location"
                    // subtitle="User geographic context"
                    Icon={IconMapPin}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                </div>
              </CardHeader>
              <CardContent className="px-5 space-y-6">
                <div className="space-y-1 px-1">
                  <p className="text-xs font-bold text-slate-900 capitalize">
                    {userLoc?.city
                      ? `${userLoc.city}, ${userLoc.country || ""}`
                      : "Location Not Set"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal tabular-nums tracking-tight">
                    {userLatitude
                      ? `${userLatitude.toFixed(2)}° N, ${userLongitude.toFixed(2)}° E`
                      : "0.00° N, 0.00° E"}
                  </p>
                </div>
                {userLatitude && userLongitude ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="aspect-[16/9] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative group cursor-pointer">
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 z-[10] bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-transform duration-300">
                            <IconArrowsMaximize className="text-white w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            View Full Map
                          </span>
                        </div>

                        <MapContainer
                          center={[userLatitude, userLongitude]}
                          zoom={13}
                          scrollWheelZoom={false}
                          dragging={false}
                          style={{ height: "100%", width: "100%", zIndex: 1 }}
                          zoomControl={false}
                          attributionControl={false}
                        >
                          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                          <Marker position={[userLatitude, userLongitude]} />
                        </MapContainer>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden rounded-2xl border-none">
                      <DialogHeader className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl max-w-xs">
                        <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center">
                            <IconMapPin className="w-3.5 h-3.5 text-brand-aqua" />
                          </div>
                          Location Inspector
                        </DialogTitle>
                        <div className="mt-2 space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-700">
                            {userLoc?.city
                              ? `${userLoc.city}, ${userLoc.country || ""}`
                              : "Location Details"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {userLatitude.toFixed(6)}° N,{" "}
                            {userLongitude.toFixed(6)}° E
                          </p>
                        </div>
                      </DialogHeader>

                      <div className="w-full h-full relative">
                        <MapContainer
                          center={[userLatitude, userLongitude]}
                          zoom={12}
                          scrollWheelZoom={true}
                          style={{ height: "100%", width: "100%", zIndex: 1 }}
                          zoomControl={false}
                          attributionControl={false}
                        >
                          <ZoomControl position="bottomright" />
                          <MapResizeFix />
                          {/* Using Voyager tiles for better labels/city visibility in inspector */}
                          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                          {/* Hybrid Labels Layer (Cities, Streets, Boundaries) */}
                          <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                            opacity={2}
                          />
                          <Marker position={[userLatitude, userLongitude]} />
                        </MapContainer>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="aspect-[16/9] bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      No Map Data
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RECENT LOGIN HISTORY */}
            <Card className="border-slate-200/80 gap-1 bg-white shadow-sm overflow-hidden py-6">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Recent Login"
                    // subtitle="Last 3 access sessions"
                    Icon={IconHistory}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                </div>
              </CardHeader>
              <CardContent className="px-5">
                <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {props?.security?.history?.length > 0 ? (
                    props?.security?.history?.map((login, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-4 px-3 rounded-xl bg-slate-200/30 border border-slate-200/50 transition-colors hover:bg-slate-200/50"
                      >
                        <div className="p-2 bg-white/80 rounded-full shadow-sm border border-slate-100">
                          {(() => {
                            const device = (login.device || "").toLowerCase();
                            const platform = (
                              login.platform || ""
                            ).toLowerCase();

                            if (
                              platform === "ios" ||
                              device.includes("iphone") ||
                              device.includes("ipad") ||
                              device.includes("ios")
                            ) {
                              return (
                                <IconBrandApple
                                  size={18}
                                  className="text-slate-900"
                                />
                              );
                            }
                            if (
                              platform === "android" ||
                              device.includes("android")
                            ) {
                              return (
                                <IconBrandAndroid
                                  size={18}
                                  className="text-emerald-600"
                                />
                              );
                            }
                            if (
                              platform === "web" ||
                              device.includes("chrome") ||
                              device.includes("safari") ||
                              device.includes("firefox") ||
                              device.includes("edge")
                            ) {
                              return (
                                <IconWorld
                                  size={18}
                                  className="text-blue-500"
                                />
                              );
                            }
                            return (
                              <IconDeviceMobile
                                size={18}
                                className="text-slate-600"
                              />
                            );
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {login.device || "Unknown Device"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {login.ip}
                          </p>
                        </div>

                        <div className="flex flex-col items-end min-w-0">
                          <p className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                            {format(new Date(login.timestamp), "dd MMM, yyyy")}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {format(new Date(login.timestamp), "hh:mm a")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        No Recent Logins Found
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ACCOUNT REPORTS HISTORY */}
            <Card className="border-slate-200/80 gap-2 bg-white shadow-sm overflow-hidden py-5">
              <CardHeader className="p-0">
                <div className="w-full flex items-center justify-between gap-2 pb-3 px-5 border-b border-slate-200">
                  <DashboardHead
                    title="Reports"
                    subtitle={`Total: ${props?.stats?.totalReports || 0} Records`}
                    Icon={IconAlertCircle}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />

                  {/* VIEW ALL REPORTS BUTTON */}
                  {props?.reports?.length > 0 && (
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/management/profile-reports/review/${initialUserData?._id}`,
                        )
                      }
                      className="text-[10px] font-bold text-brand-aqua hover:underline flex items-center gap-1 transition-all"
                    >
                      Investigate <FiLink size={10} />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-5 space-y-4">
                {props?.reports?.length > 0 ? (
                  <div className="space-y-3">
                    {props.reports.slice(0, 3).map((report, i) => {
                      // Helper to determine status style
                      const getStatusStyle = (status) => {
                        const s = status?.toLowerCase();
                        if (s === "resolved" || s === "closed")
                          return "bg-emerald-50 text-emerald-600 border-emerald-200";
                        if (s === "pending" || s === "in_progress")
                          return "bg-amber-50 text-amber-600 border-amber-200";
                        return "bg-rose-50 text-rose-600 border-rose-200"; // default for new/open
                      };

                      return (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/admin/management/profile-reports/review/${initialUserData?._id}`,
                            )
                          }
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2">
                              <span className="text-xs capitalize font-bold text-slate-900 line-clamp-1">
                                {report.reason}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "border-none text-[10px] font-bold uppercase px-2 h-4",
                                    getStatusStyle(report.status),
                                  )}
                                >
                                  {report.status || "NEW"}
                                </Badge>
                                <span className="text-[11px] font-semibold capitalize text-slate-400">
                                  {report.severity}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-400 font-semibold">
                              {format(
                                new Date(report.createdAt),
                                "dd MMM, yyyy",
                              )}
                            </span>
                          </div>
                          {(report.description || report.message) && (
                            <p className="text-[11px] text-slate-500 mb-2 line-clamp-2 italic leading-relaxed">
                              "{report.description || report.message}"
                            </p>
                          )}
                          <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-200/50">
                            <span>By {report.reporterNickname || "Unkown user" }</span>
                            <span className="text-brand-aqua opacity-0 group-hover:opacity-100 transition-all">
                              Review Case →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-green-50 flex items-center gap-4">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center">
                      <IoCheckmark className="text-green-500" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-600">
                        Clean Record
                      </p>
                      <p className="text-[10px] text-green-400 font-normal">
                        No reports filed against this user
                      </p>
                    </div>
                  </div>
                )}

                {/* FULL VIEW REPORT BUTTON */}
                {props?.reports?.length > 0 && (
                  <div className="">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/management/profile-reports/review/${initialUserData?._id}`,
                        )
                      }
                      className="w-full py-2.5 bg-brand-aqua/5 hover:bg-brand-aqua rounded-md shadow-sm text-slate-400 hover:text-white border border-slate-200 text-[11px] font-semibold capitalize tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-1"
                    >
                      View Full Report Profile
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </>
  );
};
