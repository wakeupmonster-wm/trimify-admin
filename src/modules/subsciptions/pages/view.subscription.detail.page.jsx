import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { getProductDisplayName } from "@/utils/productDisplay";
import {
  Mail,
  Zap,
  History,
  ShieldOff,
  Loader2,
  Plus,
  Clock,
  Gem,
  CalendarPlus,
  Smartphone,
  ChevronLeft,
  Copy,
  Hash,
  RefreshCcw,
  Check,
  Gift,
} from "lucide-react";
import {
  IconHistory,
  IconCreditCard,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { LiaUserTieSolid } from "react-icons/lia";
import { PiDevicesDuotone } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  fetchUserDetail,
  clearUserDetail,
  grantConsumables,
  revokeUserSubscription,
  extendSubscription,
  fetchConfig,
} from "../store/subscription.slice";
import { toast } from "sonner";
import dummyImg from "@/assets/web/dummyImg.webp";
import { PreLoader } from "@/app/loader/preloader";
import { Container } from "@/components/common/container";
import DashboardHead from "@/components/shared/dashboard.head";
import ConfirmModal from "@/components/common/ConfirmModal";
// Modular Dialogs
import { GrantAssetDialog } from "../components/Dialogs/GrantAssetDialog";
import { RevokeSubscriptionDialog } from "../components/Dialogs/RevokeSubscriptionDialog";
import { ExtendSubscriptionDialog } from "../components/Dialogs/ExtendSubscriptionDialog";
import { ImagePreviewDialog } from "../components/Dialogs/ImagePreviewDialog";
import { FaUserTie } from "react-icons/fa6";

export default function ViewSubscriptionDetailPage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { userDetail, userDetailLoading, actionLoading, config } = useSelector(
    (state) => state.subscription,
  );

  const [consumableType, setConsumableType] = useState("SUPER_KEEN");
  const [consumableAmount, setConsumableAmount] = useState("0");

  // Modal visibility states
  const [isSuperKeenOpen, setIsSuperKeenOpen] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isConfirmGrantOpen, setIsConfirmGrantOpen] = useState(false);
  const [grantSuccess, setGrantSuccess] = useState(false);
  const [imageModal, setImageModal] = useState({
    open: false,
    src: "",
    title: "",
  });

  const [subHistoryPage, setSubHistoryPage] = useState(0);
  const [subPageSize, setSubPageSize] = useState(5);
  const [txnHistoryPage, setTxnHistoryPage] = useState(0);
  const [txnPageSize, setTxnPageSize] = useState(5);

  // Consumable reason
  const [consumableReason, setConsumableReason] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchConfig());
    if (userId) dispatch(fetchUserDetail(userId));
    return () => dispatch(clearUserDetail());
  }, [dispatch, userId]);

  // Robust Data Extraction
  const {
    subscription: sub,
    recentTransactions = [],
    transactions = [],
    subscriptionHistory = [],
    wallet,
    user: userInfo,
  } = userDetail || {};

  // UI Logic: Consolidate Audit Logs
  const auditLogs = transactions.length > 0 ? transactions : recentTransactions;

  // Robust user fallback logic
  const user =
    userInfo ||
    sub?.user ||
    sub?.userId ||
    userDetail?.user ||
    userDetail?.userId;

  const progress = useMemo(() => {
    if (!sub?.startedAt || !sub?.expiresAt) return 0;
    const total = new Date(sub.expiresAt) - new Date(sub.startedAt);
    const current = new Date() - new Date(sub.startedAt);
    return Math.min(100, Math.max(0, (current / total) * 100));
  }, [sub]);

  const stats = useMemo(() => {
    const adminBoosts = wallet?.boostsBalance ?? 0;
    const adminSuperKeens = wallet?.superKeensBalance ?? 0;
    const details = wallet?.details;

    return {
      availableBoosts: adminBoosts === -1 ? "Unlimited" : adminBoosts,
      availableSuperKeens:
        adminSuperKeens === -1 ? "Unlimited" : adminSuperKeens,
      details,
    };
  }, [wallet]);

  const handleGrantConsumables = async (type, quantity, customReason) => {
    const finalType = type || consumableType;
    const finalQty = quantity || Number(consumableAmount);
    const finalReason = customReason || consumableReason;
    setGrantSuccess(false);
    const result = await dispatch(
      grantConsumables({
        userId,
        data: { type: finalType, quantity: finalQty, reason: finalReason },
      }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Consumables granted successfully");
      setGrantSuccess(true);
      setConsumableAmount("0");
      setConsumableReason("");
      dispatch(fetchUserDetail(userId));
      setTimeout(() => {
        setIsConfirmGrantOpen(false);
        setGrantSuccess(false);
      }, 1500);
      return true;
    } else {
      toast.error(result.payload || "Failed to grant consumables");
      return false;
    }
  };

  const handleRevoke = async () => {
    const result = await dispatch(
      revokeUserSubscription({
        userId,
        data: { subscriptionId: sub?._id },
      }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Subscription revoked");
      dispatch(fetchUserDetail(userId));
      return true;
    } else {
      toast.error(result.payload || "Failed to revoke subscription");
      return false;
    }
  };

  const handleCopy = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("User ID Copied");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (userDetailLoading && !userDetail) return <PreLoader />;

  return (
    <Container className="py-3">
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- BACK NAVIGATION --- */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/management/subscription-management/manage-subscribers"
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-300/60 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                Subscriber Details
              </span>
              <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
                /
              </span>
              <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
                {user?.nickname || "Subscriber Details"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={cn(
                "group flex items-center gap-2 bg-slate-50 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-300/60 transition-all active:scale-95 shadow-sm",
                copied
                  ? "text-app-primary2 border-app-primary2 bg-app-primary2"
                  : "text-slate-500 hover:border-app-primary2 hover:text-app-primary2 hover:bg-white",
              )}
            >
              <Hash className="w-3 h-3 opacity-50" />
              ID: {userId}
            </button>
          </div>
        </header>

        {/* --- DETAIL HEADER CARD --- */}
        <div className="bg-white p-5 rounded-xl border border-slate-300/60 shadow-sm flex flex-wrap items-center justify-between gap-6 transition-all">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar
                className="w-20 h-20 rounded-full shadow-md p-1 bg-white border border-slate-100 cursor-pointer hover:scale-105 transition-transform active:scale-95 relative z-10"
                onClick={() =>
                  setImageModal({
                    open: true,
                    src: user?.photo || user?.avatar?.url || dummyImg,
                    title: user?.nickname || "User Photo",
                  })
                }
              >
                <AvatarImage
                  className="rounded-lg object-cover"
                  src={user?.photo || user?.avatar?.url || dummyImg}
                />
                <AvatarFallback className="text-2xl font-black bg-app-primary2 text-app-primary2 rounded-lg">
                  {user?.nickname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 capitalize tracking-tight leading-none">
                  {user?.nickname || "Unknown User"}
                </h1>
                <Badge
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-none border-none",
                    sub?.status === "active" || sub?.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700",
                  )}
                >
                  {sub?.status === "active" || sub?.status === "ACTIVE"
                    ? "Active Premium"
                    : "Inactive"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400 tracking-wide">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-300" />
                  {user?.email || "No email provided"}
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5 text-slate-300" />
                  {user?.phone || "No phone provided"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button
              size="sm"
              className="h-10 px-4 gap-2 rounded-lg shadow-sm text-white font-bold text-xs bg-app-primary2 hover:bg-brand-hoverAqua transition-all active:scale-95"
              onClick={() => setIsExtendOpen(true)}
            >
              <CalendarPlus className="h-4 w-4" />
              Extend Plan
            </Button> */}
            {/* <Button
              size="sm"
              className="h-10 px-4 gap-2 rounded-lg shadow-sm text-rose-600 font-bold text-xs bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-transparent transition-all active:scale-95"
              onClick={() => setIsRevokeOpen(true)}
            >
              <ShieldOff className="h-4 w-4" />
              Revoke
            </Button> */}
          </div>
        </div>

        {/* --- TOP STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Environment"
            value="Production"
            subtext="API Gateway Context"
            color="bg-slate-400"
          />
          <KPICard
            label="Current Status"
            value={
              sub?.status === "active" || sub?.status === "ACTIVE"
                ? "Active"
                : "Inactive"
            }
            subtext="Subscription Health"
            color={
              sub?.status === "active" || sub?.status === "ACTIVE"
                ? "bg-emerald-500"
                : "bg-red-500"
            }
            hasPulse={sub?.status === "active" || sub?.status === "ACTIVE"}
          />
          <KPICard
            label="Super Keens"
            value={stats.availableSuperKeens}
            subtext={
              stats.details?.superKeens ? (
                <div className="flex items-center gap-1.5 text-[10px] tracking-normal font-medium mt-1 normal-case">
                  <span className="text-slate-400">
                    Base:{" "}
                    <span className="text-slate-600">
                      {stats.details.superKeens.baseLimit}
                    </span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">
                    Granted:{" "}
                    <span className="text-app-primary2 font-bold">
                      {stats.details.superKeens.granted}
                    </span>
                  </span>
                </div>
              ) : (
                "Total Balance"
              )
            }
            color="bg-violet-500"
            onGrant={() => setIsSuperKeenOpen(true)}
          />
          <KPICard
            label="Super Charge"
            value={stats.availableBoosts}
            subtext={
              stats.details?.boosts ? (
                <div className="flex items-center gap-1.5 text-[10px] tracking-normal font-medium mt-1 normal-case">
                  <span className="text-slate-400">
                    Base:{" "}
                    <span className="text-slate-600">
                      {stats.details.boosts.baseLimit}
                    </span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">
                    Granted:{" "}
                    <span className="text-app-primary2 font-bold">
                      {stats.details.boosts.granted}
                    </span>
                  </span>
                </div>
              ) : (
                "Total Balance"
              )
            }
            color="bg-orange-500"
            onGrant={() => setIsBoostOpen(true)}
          />
        </div>

        {/* --- MAIN CONTENT ROW: Access Cycle & Grant Side-by-Side --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Access Cycle */}
          <div className="bg-white col-span-2 rounded-xl border border-slate-300/60 shadow-sm overflow-hidden transition-all flex flex-col">
            <div className="py-4 px-6 border-b border-slate-300/60 flex items-center justify-between bg-slate-50/30">
              <DashboardHead
                title="Access Cycle"
                subtitle="Entitlement Roadmap"
                Icon={Clock}
                iconColor="text-app-primary2"
                iconBg="bg-app-primary2"
                titleSizeClass="text-[15px]"
              />
            </div>
            <div className="p-6 flex-1">
              <div className="bg-slate-50/50 border border-slate-300/60 px-6 pb-4 rounded-xl space-y-6 relative overflow-hidden group h-full">
                <div className="py-4 flex items-center justify-between border-b border-slate-300/60 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-white">
                      <Gem size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">
                        {sub?.planType
                          ? getProductDisplayName(sub.planType)
                          : "No Active Plan"}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 tracking-wide mt-0.5">
                        Billing via{" "}
                        {sub?.platform?.replace(/_/g, " ") ||
                          "Platform Unknown"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-none border-none",
                      sub?.status === "active" || sub?.status === "ACTIVE"
                        ? "bg-emerald-100/80 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {(sub?.status === "active" || sub?.status === "ACTIVE") && (
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    )}
                    {sub?.status || "N/A"}
                  </Badge>
                </div>

                <div className="space-y-2 relative mx- z-[1]">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-400">
                      Started:{" "}
                      <span className="text-slate-600 ml-1">
                        {sub?.startedAt
                          ? format(new Date(sub.startedAt), "dd MMM")
                          : "—"}
                      </span>
                    </span>
                    <span className="text-[11px] font-semibold text-app-primary2">
                      {sub?.expiresAt
                        ? `${Math.max(0, Math.ceil((new Date(sub.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)))} Days Remaining`
                        : "No expiry"}
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 border border-slate-300/60/60 rounded-full overflow-hidden shadow-inner p-[1px]">
                    <div
                      className="h-full bg-gradient-to-r from-app-primary2 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,217,214,0.3)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* DETAILS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-300/60 rounded-xl bg-white overflow-hidden relative z-10 mt-8 shadow-sm">
                  {/* BILLING CYCLE */}
                  <div className="flex items-center gap-4 px-5 py-5 border-b md:border-b-0 md:border-r border-slate-300/60">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100">
                      <Clock size={16} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                        Billing Cycle
                      </p>
                      <p className="text-[11px] font-black text-slate-700">
                        {sub?.endDate
                          ? `Renews ${format(new Date(sub.endDate), "MMM dd, yyyy")}`
                          : "Manual/Non-renewing"}
                      </p>
                    </div>
                  </div>

                  {/* AUTO RENEW */}
                  <div className="flex items-center gap-4 px-5 py-5 border-b md:border-b-0 md:border-r border-slate-300/60">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                      <RefreshCcw size={16} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                        Auto Renew
                      </p>
                      <Badge
                        className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-md border-none shadow-none uppercase",
                          sub?.autoRenew
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {sub?.autoRenew ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  {/* PRODUCT ID */}
                  <div className="flex items-center gap-4 px-5 py-5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
                      <Hash size={16} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                        Product
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-mono font-bold text-slate-500 truncate">
                          {sub?.planType
                            ? getProductDisplayName(sub.planType)
                            : "No Active Plan" || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grant Consumables Form */}
          <div className="bg-white rounded-xl border border-slate-300/60 shadow-sm overflow-hidden transition-all flex flex-col h-full">
            <div className="py-4 px-6 border-b border-slate-300/60 flex items-center justify-between bg-slate-50/30">
              <DashboardHead
                title="Grant Consumables"
                subtitle="Add Super Keens / Charge"
                Icon={Zap}
                iconColor="text-violet-500"
                iconBg="bg-violet-50"
                titleSizeClass="text-[15px]"
              />
            </div>
            <div className="p-6 flex-1">
              <div className="bg-slate-50/50 space-y-4 h-full relative overflow-hidden group">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Asset Type
                  </label>
                  <Select
                    value={consumableType}
                    onValueChange={setConsumableType}
                  >
                    <SelectTrigger className="h-10 rounded-lg border-slate-300/60 bg-white text-xs font-bold focus:ring-1 focus:ring-app-primary2 shadow-sm">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-300/60 shadow-xl">
                      <SelectItem
                        value="SUPER_KEEN"
                        className="text-xs font-bold rounded-lg"
                      >
                        Super Keens
                      </SelectItem>
                      <SelectItem
                        value="BOOST"
                        className="text-xs font-bold rounded-lg"
                      >
                        Super Charge
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={consumableAmount}
                    onChange={(e) => setConsumableAmount(e.target.value)}
                    className="h-10 rounded-lg border-slate-300/60 bg-white text-xs font-bold focus:ring-1 focus:ring-app-primary2 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Reason
                  </label>
                  <Input
                    placeholder="Admin Grant"
                    value={consumableReason}
                    onChange={(e) => setConsumableReason(e.target.value)}
                    className="h-10 rounded-lg border-slate-300/60 bg-white text-xs font-bold focus:ring-1 focus:ring-app-primary2 shadow-sm placeholder:text-slate-300"
                  />
                </div>
                <Button
                  onClick={() => setIsConfirmGrantOpen(true)}
                  disabled={
                    actionLoading ||
                    grantSuccess ||
                    !consumableAmount ||
                    Number(consumableAmount) <= 0
                  }
                  className={cn(
                    "w-full font-bold h-10 rounded-md transition-all duration-300 text-xs shadow-sm mt-2 flex items-center justify-center gap-2",
                    grantSuccess
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-none border border-emerald-800/20"
                      : "bg-app-primary2 hover:bg-brand-hoverAqua text-white",
                  )}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 text-white" />
                      <span>Granting...</span>
                    </>
                  ) : grantSuccess ? (
                    <>
                      <Check className="h-4 w-4 animate-in zoom-in duration-300 text-white" />
                      <span>Granted!</span>
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4" />
                      <span>Grant Assets</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH: History Tables */}
        <div className="space-y-5">
          {/* History Table */}
          <div className="bg-white rounded-xl border border-slate-300/60 shadow-sm overflow-hidden transition-all w-full">
            <div className="py-4 px-6 border-b border-slate-300/60 flex items-center justify-between bg-slate-50/30">
              <DashboardHead
                title="Subscription History"
                subtitle="Past entitlement logs"
                Icon={History}
                iconColor="text-app-primary2"
                iconBg="bg-app-primary2"
                titleSizeClass="text-[15px]"
              />
              <Badge className="bg-white border border-slate-300/60 rounded-lg text-slate-500 shadow-sm px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                {subscriptionHistory?.length || 0} Records
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-300/60">
                    <TableHead className="text-foreground/80 px-6 font-bold uppercase h-11 bg-transparent text-[11px] text-center tracking-wider whitespace-nowrap">
                      SR.No
                    </TableHead>
                    <TableHead className="text-foreground/80 px-6 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Plan Tier
                    </TableHead>
                    <TableHead className="text-foreground/80 px-6 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="text-foreground/80 px-6 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Started
                    </TableHead>
                    <TableHead className="text-foreground/80 px-6 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Expired
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionHistory?.length > 0 ? (
                    subscriptionHistory
                      .slice(
                        subHistoryPage * subPageSize,
                        (subHistoryPage + 1) * subPageSize,
                      )
                      .map((h, i) => (
                        <TableRow
                          key={i}
                          className="even:bg-slate-50 hover:bg-slate-100/70 transition-colors border-b border-slate-300/60 cursor-pointer"
                        >
                          <TableCell className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 whitespace-nowrap">
                            {subHistoryPage * subPageSize + i + 1}
                          </TableCell>
                          <TableCell className="px-6 py-3.5 text-left text-xs font-bold text-slate-700 uppercase tracking-tight whitespace-nowrap">
                            {h.planType || "TRIAL"}
                          </TableCell>
                          <TableCell className="px-6 py-3.5 text-left whitespace-nowrap">
                            <Badge
                              className={cn(
                                "border-none text-[9px] font-black uppercase tracking-widest rounded-md px-2 py-0.5 whitespace-nowrap",
                                h.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500",
                              )}
                            >
                              {h.status || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-3.5 text-left whitespace-nowrap">
                            <div className="flex flex-col gap-0.5 items-start">
                              <span className="text-[11px] font-bold text-slate-700">
                                {h.startedAt
                                  ? format(
                                      new Date(h.startedAt),
                                      "dd MMM, yyyy",
                                    )
                                  : "—"}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {h.startedAt
                                  ? format(new Date(h.startedAt), "hh:mm a")
                                  : ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-3.5 text-left whitespace-nowrap">
                            <div className="flex flex-col gap-0.5 items-start">
                              <span className="text-[11px] font-bold text-slate-700">
                                {h.expiresAt
                                  ? format(
                                      new Date(h.expiresAt),
                                      "dd MMM, yyyy",
                                    )
                                  : "Lifetime"}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {h.expiresAt
                                  ? format(new Date(h.expiresAt), "hh:mm a")
                                  : ""}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200">
                            <History size={24} />
                          </div>
                          <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">
                            No Subscription History Found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <LocalPagination
              currentPage={subHistoryPage}
              totalItems={subscriptionHistory?.length || 0}
              pageSize={subPageSize}
              onPageChange={setSubHistoryPage}
              onPageSizeChange={setSubPageSize}
            />
          </div>

          {/* Transaction History Table */}
          <div className="bg-white rounded-xl border border-slate-300/60 shadow-sm overflow-hidden transition-all w-full">
            <div className="py-4 px-6 border-b border-slate-300/60 flex items-center justify-between bg-slate-50/30">
              <DashboardHead
                title="Transaction History"
                subtitle="Past payment records"
                Icon={IconHistory}
                iconColor="text-violet-500"
                iconBg="bg-violet-50"
                titleSizeClass="text-[15px]"
              />
              <Badge className="bg-white border border-slate-300/60 rounded-lg text-slate-500 shadow-sm px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                {auditLogs?.length || 0} Records
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-300/60">
                    <TableHead className="text-foreground/80 px-5 font-bold uppercase h-11 bg-transparent text-[11px] text-center tracking-wider whitespace-nowrap">
                      SR.No
                    </TableHead>
                    <TableHead className="text-foreground/80 px-4 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Date
                    </TableHead>
                    <TableHead className="text-foreground/80 px-4 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-foreground/80 px-4 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Product
                    </TableHead>
                    <TableHead className="text-foreground/80 px-3 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Amount AUD
                    </TableHead>
                    <TableHead className="text-foreground/80 px-4 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Platform
                    </TableHead>
                    <TableHead className="text-foreground/80 px-4 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Reason
                    </TableHead>
                    <TableHead className="text-foreground/80 px-5 font-bold uppercase h-11 bg-transparent text-[11px] text-left tracking-wider whitespace-nowrap">
                      Event
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.length > 0 ? (
                    auditLogs
                      .slice(
                        txnHistoryPage * txnPageSize,
                        (txnHistoryPage + 1) * txnPageSize,
                      )
                      .map((txn, i) => (
                        <TableRow
                          key={txn._id || i}
                          className="even:bg-slate-50 hover:bg-slate-100/70 transition-colors border-b border-slate-300/60 cursor-pointer"
                        >
                          <TableCell className="px-4 py-3.5 text-center text-xs font-bold text-slate-600 whitespace-nowrap">
                            {txnHistoryPage * txnPageSize + i + 1}
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left whitespace-nowrap">
                            <div className="flex flex-col gap-0.5 min-w-[90px] items-start">
                              <span className="text-[11px] font-bold text-slate-700">
                                {txn?.occurredAt
                                  ? format(
                                      new Date(txn.occurredAt),
                                      "dd MMM, yyyy",
                                    )
                                  : "—"}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {txn?.occurredAt
                                  ? format(new Date(txn.occurredAt), "hh:mm a")
                                  : ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left whitespace-nowrap">
                            <div className="bg-slate-100/50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 font-mono tracking-tighter w-fit transition-colors whitespace-nowrap">
                              {txn.transactionId || "—"}
                            </div>
                          </TableCell>
                          <TableCell
                            className="px-4 py-3.5 text-left text-[11px] block truncate max-w-[160px] font-bold text-slate-700 font-mono uppercase tracking-tight whitespace-nowrap"
                            title={getProductDisplayName(txn.productId || "")}
                          >
                            {getProductDisplayName(txn.productId)}
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left text-xs font-black text-slate-700 uppercase tracking-tight whitespace-nowrap">
                            ${(txn.amount ?? 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left whitespace-nowrap">
                            {(() => {
                              const platform = txn.platform?.toLowerCase();
                              let icon = (
                                <PiDevicesDuotone className="size-4" />
                              );
                              let style =
                                "text-slate-600 border-slate-300/60 bg-slate-50";

                              if (platform === "ios") {
                                icon = <AiFillApple className="size-4" />;
                                style =
                                  "text-slate-900 border-slate-300/60 bg-slate-100";
                              } else if (platform === "android") {
                                icon = <AiFillAndroid className="size-4" />;
                                style =
                                  "text-emerald-600 border-emerald-100 bg-emerald-50";
                              } else if (
                                platform === "admin_granted" ||
                                platform === "admin"
                              ) {
                                icon = <FaUserTie className="size-3.5" />;
                                style =
                                  "text-app-primary2 border-app-primary2 bg-app-primary2";
                              }

                              return (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-black rounded-lg px-2 py-1 h-7 gap-2 shadow-none border uppercase tracking-widest inline-flex items-center whitespace-nowrap",
                                    style,
                                  )}
                                >
                                  {icon}
                                  <span>{platform}</span>
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <span
                              className="block truncate max-w-[90px]"
                              title={txn.reason || ""}
                            >
                              {txn.reason || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3.5 text-left whitespace-nowrap">
                            {(() => {
                              const event = txn.eventType?.toUpperCase();
                              let style =
                                "bg-slate-100 text-slate-500 border-slate-300/60";

                              if (
                                event?.includes("PURCHASE") ||
                                event?.includes("INITIAL")
                              ) {
                                style =
                                  "bg-emerald-50 text-emerald-600 border-emerald-100";
                              } else if (event?.includes("RENEW")) {
                                style =
                                  "bg-blue-50 text-blue-600 border-blue-100";
                              } else if (
                                event?.includes("CANCEL") ||
                                event?.includes("REVOKE") ||
                                event?.includes("FAIL")
                              ) {
                                style =
                                  "bg-rose-50 text-rose-600 border-rose-100";
                              } else if (
                                event?.includes("GRANT") ||
                                event?.includes("ADMIN")
                              ) {
                                style =
                                  "bg-violet-50 text-violet-600 border-violet-100";
                              }

                              return (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] font-black rounded-full px-2.5 py-0.5 uppercase tracking-widest shadow-none inline-flex items-center border whitespace-nowrap",
                                    style,
                                  )}
                                >
                                  {txn.eventType?.replace(/_/g, " ") || "N/A"}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <IconCreditCard
                            size={32}
                            className="text-slate-200"
                          />
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            No Transaction History Found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <LocalPagination
              currentPage={txnHistoryPage}
              totalItems={auditLogs?.length || 0}
              pageSize={txnPageSize}
              onPageChange={setTxnHistoryPage}
              onPageSizeChange={setTxnPageSize}
            />
          </div>
        </div>
      </motion.div>

      {/* --- DIALOGS --- */}
      <GrantAssetDialog
        open={isSuperKeenOpen}
        onOpenChange={setIsSuperKeenOpen}
        type="SUPER_KEEN"
        balance={wallet?.superKeensBalance}
        onGrant={handleGrantConsumables}
        loading={actionLoading}
      />

      <GrantAssetDialog
        open={isBoostOpen}
        onOpenChange={setIsBoostOpen}
        type="BOOST"
        balance={wallet?.boostsBalance}
        onGrant={handleGrantConsumables}
        loading={actionLoading}
      />

      <RevokeSubscriptionDialog
        open={isRevokeOpen}
        onOpenChange={setIsRevokeOpen}
        onRevoke={handleRevoke}
        loading={actionLoading}
      />

      <ExtendSubscriptionDialog
        open={isExtendOpen}
        onOpenChange={setIsExtendOpen}
        loading={actionLoading}
        onExtend={async (days, reason) => {
          const res = await dispatch(
            extendSubscription({
              userId,
              data: { days, reason },
            }),
          );
          if (res.meta.requestStatus === "fulfilled") {
            toast.success("Subscription extended");
            dispatch(fetchUserDetail(userId));
            return true;
          } else {
            toast.error(res.payload || "Failed to extend");
            return false;
          }
        }}
      />

      <ConfirmModal
        isOpen={isConfirmGrantOpen}
        onClose={() => setIsConfirmGrantOpen(false)}
        onConfirm={async () => {
          await handleGrantConsumables();
        }}
        title="Confirm Asset Grant"
        message={`Are you sure you want to grant ${consumableAmount} ${consumableType === "BOOST" ? "SUPER CHARGE" : consumableType.replace(/_/g, " ")} to this user? This action will be logged.`}
        confirmText="Grant Now"
        type="brand"
        loading={actionLoading}
        success={grantSuccess}
      />

      <ImagePreviewDialog
        open={imageModal.open}
        onOpenChange={(o) => setImageModal({ ...imageModal, open: o })}
        src={imageModal.src}
        title={imageModal.title}
      />
    </Container>
  );
}

const LocalPagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-300/60 bg-slate-50/30 gap-4">
      <div className="flex items-center gap-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          Showing {totalItems === 0 ? 0 : currentPage * pageSize + 1} to{" "}
          {Math.min(totalItems, (currentPage + 1) * pageSize)} of {totalItems}{" "}
          results
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Rows
            </span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
                onPageChange(0);
              }}
            >
              <SelectTrigger className="h-7 w-[60px] border-slate-300/60 rounded-md bg-white text-[10px] font-bold focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-300/60 shadow-xl">
                {[5, 10, 15, 20].map((size) => (
                  <SelectItem
                    key={size}
                    value={`${size}`}
                    className="text-[10px] font-medium rounded-lg"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <IconChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isActive = currentPage === idx;
            return (
              <Button
                key={idx}
                onClick={() => onPageChange(idx)}
                className={cn(
                  "h-8 w-8 text-xs font-bold rounded-md transition-all",
                  isActive
                    ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-app-primary2 border-none"
                    : "bg-white border border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300/60 shadow-none",
                )}
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
        >
          <IconChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, subtext, color, onGrant, hasPulse }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-300/60 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 group">
    {onGrant && (
      <button
        onClick={onGrant}
        className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-slate-50 border border-slate-300/60 flex items-center justify-center text-slate-400 transition-all hover:bg-app-primary3 hover:text-white hover:border-transparent active:scale-95 z-10 shadow-sm"
      >
        <Plus className="h-4 w-4" strokeWidth={3} />
      </button>
    )}
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 pl-0.5">
      {label}
    </p>
    <div className="flex items-center gap-2.5 mb-1.5">
      <h2
        className={cn(
          "text-2xl font-black tracking-tight",
          color === "bg-emerald-500"
            ? "text-emerald-600"
            : color === "bg-red-500"
              ? "text-rose-600"
              : color === "bg-violet-500"
                ? "text-violet-600"
                : color === "bg-orange-500"
                  ? "text-orange-600"
                  : "text-slate-900",
        )}
      >
        {value}
      </h2>
      {hasPulse && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      )}
    </div>
    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-tight pl-0.5">
      {subtext}
    </div>
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-1 transition-all group-hover:h-1.5",
        color,
      )}
    />
  </div>
);
