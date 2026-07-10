import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  IconStar,
  IconRocket,
  IconCreditCard,
  IconHistory,
  IconCrown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa6";
import { PiDevicesDuotone } from "react-icons/pi";
import { PLATFORM_MAP, EVENT_TYPE_MAP } from "@/constants/transection.config";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getProductDisplayName } from "@/utils/productDisplay";
import { ShieldCheck, Loader2, Sparkles, Gem, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  grantSubscription,
  grantConsumables,
} from "@/modules/subsciptions/store/subscription.slice";
import { fetchUserData } from "@/modules/users/store/user.slice";
import DashboardHead from "@/components/shared/dashboard.head";
import ConfirmModal from "@/components/common/ConfirmModal";
import { RiShieldStarLine } from "react-icons/ri";
import { FiCalendar } from "react-icons/fi";
import { GrUpdate } from "react-icons/gr";
import { fetchConfig } from "@/modules/subsciptions/store/subscription.slice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Controls the speed of the "wave" between cards
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const FinancialsTab = ({
  userData,
  account,
  transactions,
  subscription,
}) => {
  const dispatch = useDispatch();

  // Separate loading states for each action
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetSuccess, setAssetSuccess] = useState(false);

  const config = useSelector((state) => state.subscription.config);

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  // Grant Subscription States
  const [grantPlan, setGrantPlan] = useState("MONTHLY");
  const [grantDuration, setGrantDuration] = useState("30");
  const [grantReason, setGrantReason] = useState("Admin Manual Grant");

  const [consumableType, setConsumableType] = useState("SUPER_KEEN");
  const [consumableAmount, setConsumableAmount] = useState("0");
  const [consumableReason, setConsumableReason] = useState("");
  const [isConfirmSubOpen, setIsConfirmSubOpen] = useState(false);
  const [isConfirmAssetOpen, setIsConfirmAssetOpen] = useState(false);
  // const [isExtendOpen, setIsExtendOpen] = useState(false);

  // Pagination state for transactions
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((transactions?.length || 0) / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (transactions || []).slice(start, start + itemsPerPage);
  }, [transactions, currentPage]);

  // Helper to format plan names
  const getPlanName = () => {
    if (!subscription?.planType) return "Free Plan";
    return getProductDisplayName(subscription.planType);
  };

  const handleGrantSubscription = async () => {
    if (subLoading) return;
    try {
      if (!grantDuration || Number(grantDuration) <= 0) {
        return toast.error("Please provide a valid duration");
      }
      setSubLoading(true);
      setSubSuccess(false);
      const data = {
        planType: grantPlan,
        durationDays: Number(grantDuration),
        reason: grantReason || "Admin Manual Grant",
      };
      await dispatch(
        grantSubscription({ userId: userData._id, data })
      ).unwrap();
      toast.success("Subscription granted successfully!", {
        icon: <Sparkles className="w-4 h-4 text-brand-aqua" />,
        description: `${grantPlan} plan assigned for ${grantDuration} days.`,
      });
      setSubSuccess(true);
      setSubLoading(false);
      // Re-fetch user data to reflect changes live
      dispatch(fetchUserData(userData._id));
      setTimeout(() => {
        setIsConfirmSubOpen(false);
        setSubSuccess(false);
      }, 1500);
    } catch (error) {
      setSubLoading(false);
      setSubSuccess(false);
      toast.error(error || "Failed to grant subscription");
    }
  };

  const handleGrantConsumables = async () => {
    if (assetLoading) return;
    try {
      if (!consumableAmount || Number(consumableAmount) <= 0) {
        return toast.error("Please provide a valid amount");
      }
      setAssetLoading(true);
      setAssetSuccess(false);
      const data = {
        type: consumableType,
        quantity: Number(consumableAmount),
        reason: consumableReason || "Admin Manual Grant",
      };
      await dispatch(grantConsumables({ userId: userData._id, data })).unwrap();
      toast.success("Assets granted successfully!", {
        icon: <Gem className="w-4 h-4 text-brand-aqua" />,
        description: `Added ${consumableAmount} ${consumableType === "SUPER_KEEN" ? "Super Keens" : "Super charge"
          }.`,
      });
      setAssetSuccess(true);
      setAssetLoading(false);
      setConsumableAmount("0");
      setConsumableReason("");
      // Re-fetch user data to reflect changes live
      dispatch(fetchUserData(userData._id));
      setTimeout(() => {
        setIsConfirmAssetOpen(false);
        setAssetSuccess(false);
      }, 1500);
    } catch (error) {
      setAssetLoading(false);
      setAssetSuccess(false);
      toast.error(error || "Failed to grant assets");
    }
  };

  // --- Optimized Stats Calculation ---
  const stats = useMemo(() => {
    // Priority: Subscription fields as per user feedback
    const subObj = Array.isArray(subscription) ? subscription[0] : subscription;

    const adminBoosts = subObj?.availableBoosts ?? 0;
    const adminSuperKeens = subObj?.availableSuperKeens ?? 0;
    const details = subObj?.details;

    return [
      {
        label: "Available Super charge",
        val: adminBoosts === -1 ? "Unlimited" : adminBoosts,
        icon: <IconRocket size={22} />,
        color: "orange",
        description: details?.boosts ? (
          <div className="flex items-center justify-center gap-1.5 text-[10px] mt-1 font-medium">
            <span className="text-slate-400">Base: <span className="text-slate-600">{details.boosts.baseLimit}</span></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Granted: <span className="text-orange-500 font-bold">{details.boosts.granted}</span></span>
          </div>
        ) : "Remaining Super charge",
      },
      {
        label: "Available Super Keen",
        val: adminSuperKeens === -1 ? "Unlimited" : adminSuperKeens,
        icon: <IconStar size={22} />,
        color: "indigo",
        description: details?.superKeens ? (
          <div className="flex items-center justify-center gap-1.5 text-[10px] mt-1 font-medium">
            <span className="text-slate-400">Base: <span className="text-slate-600">{details.superKeens.baseLimit}</span></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Granted: <span className="text-indigo-500 font-bold">{details.superKeens.granted}</span></span>
          </div>
        ) : "Remaining super keens",
      },
    ];
  }, [subscription]);

  const subObj = useMemo(
    () => (Array.isArray(subscription) ? subscription[0] : subscription),
    [subscription]
  );

  const isPremiumActive =
    subObj?.status === "ACTIVE" || userData?.account?.isPremium;

  // const hasSubscriptionRecord = !!subscription?._id;

  return (
    <TabsContent
      value="financials"
      className="grid gap-4 focus-visible:ring-offset-0 focus-visible:ring-0"
    >
      {/* --- PREMIUM STATS CARDS --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <FinancialStatCard key={index} {...stat} />
        ))}
      </motion.div>

      {/* --- MAIN BENTO GRID --- */}
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10">
        {/* LEFT COLUMN: Membership & Payments (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* 1. MEMBERSHIP STATUS */}
          <Card className="border-slate-200 shadow-sm gap-2 pb-0 rounded-2xl overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Membership Status"
                  subtitle="Current subscription details"
                  Icon={IconCreditCard}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl bg-white flex items-center justify-center text-brand-aqua shrink-0",
                        isPremiumActive ? "bg-brand-aqua/10" : "bg-slate-100/50"
                      )}
                    >
                      {isPremiumActive ? (
                        <IconCrown size={26} strokeWidth={1.5} />
                      ) : (
                        <IconStar size={26} strokeWidth={1.5} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground/90 tracking-tight leading-tight">
                        {getPlanName()}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-400">
                        {isPremiumActive
                          ? `Active billing via ${subscription?.platform?.toLowerCase() || "System"
                          }`
                          : "Limited access to premium features"}
                      </p>
                    </div>
                  </div>

                  {isPremiumActive && subscription?.expiresAt && (
                    <div className="flex items-center gap-2 self-start sm:self-center px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/50 shadow-sm transition-all hover:shadow-md">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FiCalendar className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider leading-none">
                          Valid Until
                        </span>
                        <span className="text-[11px] font-black text-amber-700 tabular-nums">
                          {format(
                            new Date(subscription.expiresAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* <div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold",
                      isPremiumActive
                        ? "bg-emerald-200/50 text-emerald-600"
                        : "bg-slate-200/50 text-slate-600",
                    )}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isPremiumActive ? "bg-emerald-500" : "bg-slate-500",
                      )}
                    />
                    {isPremiumActive ? "Active" : "Inactive"}
                  </div> */}
                </div>

                {/* DETAILS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-2xl bg-slate-50/30 overflow-hidden">
                  {[
                    {
                      label: "MEMBER SINCE",
                      val: account?.createdAt
                        ? format(new Date(account.createdAt), "dd MMM, yyyy")
                        : "N/A",
                      icon: <FiCalendar size={20} strokeWidth={1.5} />,
                      bg: "bg-emerald-50",
                      text: "text-emerald-500",
                    },
                    {
                      label: "PLAN TIER",
                      val: subObj?.planType ? getProductDisplayName(subObj.planType) : "BASIC",
                      icon: <RiShieldStarLine size={20} />,
                      bg: "bg-violet-50",
                      text: "text-violet-500",
                    },
                    {
                      label: "AUTO RENEW",
                      val: (
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                            (subObj?.autoRenew ?? subObj?.isAutoRenew) !==
                              undefined
                              ? subObj?.autoRenew ?? subObj?.isAutoRenew
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                              : "bg-slate-50 text-slate-300"
                          )}
                        >
                          {(subObj?.autoRenew ?? subObj?.isAutoRenew) !==
                            undefined
                            ? subObj?.autoRenew ?? subObj?.isAutoRenew
                              ? "ENABLED"
                              : "DISABLED"
                            : "N/A"}
                        </Badge>
                      ),
                      icon:
                        subObj?.autoRenew ?? subObj?.isAutoRenew ? (
                          <RefreshCcw size={18} />
                        ) : (
                          <GrUpdate size={18} />
                        ),
                      bg:
                        subObj?.autoRenew ?? subObj?.isAutoRenew
                          ? "bg-emerald-50"
                          : "bg-amber-50",
                      text:
                        subObj?.autoRenew ?? subObj?.isAutoRenew
                          ? "text-emerald-500"
                          : "text-amber-500",
                      status: subObj?.autoRenew ?? subObj?.isAutoRenew,
                    },
                  ].map((detail, idx) => (
                    <div
                      key={detail.label}
                      className={cn(
                        "flex items-center gap-4 px-4 my-4",
                        idx !== 2 &&
                        "border-b md:border-b-0 md:border-r border-slate-200"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          detail.bg,
                          detail.text
                        )}
                      >
                        {detail.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                          {detail.label}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-bold uppercase",
                            detail.label === "AUTO RENEW"
                              ? detail.status
                                ? "text-emerald-600"
                                : "text-slate-800"
                              : "text-slate-800"
                          )}
                        >
                          {detail.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. PAYMENT RECORDS */}
          <Card className="border-slate-200 shadow-sm gap-0 pb-4 rounded-2xl overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-100">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Payment Records"
                  subtitle="Transaction history"
                  Icon={IconHistory}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
                <Badge
                  variant="outline"
                  className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
                >
                  {transactions?.length ?? 0} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t border-slate-200 bg-white">
                <Table className="border-separate border-spacing-0">
                  <TableHeader className="">
                    <TableRow className="hover:bg-transparent border-none bg-slate-50">
                      <TableHead className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        SR.NO.
                      </TableHead>
                      <TableHead className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Date
                      </TableHead>
                      <TableHead className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Transaction ID
                      </TableHead>
                      <TableHead className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Amount (AUD)
                      </TableHead>
                      <TableHead className="text-foreground/80 px-4 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Platform
                      </TableHead>
                      <TableHead className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Product
                      </TableHead>
                      <TableHead className="text-foreground/80 px-5 font-bold uppercase h-10 bg-slate-50 text-[10px] text-left border-b border-slate-200">
                        Event
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((txn, index) => (
                        <TableRow
                          key={txn._id}
                          className="even:bg-slate-50 hover:bg-slate-100/70 transition-colors border-b border-slate-100/60 group"
                        >
                          <TableCell className="px-3.5 py-2">
                            <p className="text-xs font-semibold text-center text-slate-700">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </p>
                          </TableCell>
                          <TableCell className="px-3.5 py-4">
                            <div className="flex flex-col">
                              <p className="text-[11px] font-bold text-slate-900">
                                {txn?.occurredAt
                                  ? format(
                                    new Date(txn.occurredAt),
                                    "dd MMM, yyyy"
                                  )
                                  : "—"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {txn?.occurredAt
                                  ? format(new Date(txn.occurredAt), "hh:mm a")
                                  : ""}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className="text-[11px] text-muted-foreground">
                              {txn.transactionId || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 font-black text-muted-foreground text-[11px]">
                            ${(txn.amount ?? 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="px-3.5 py-4">
                            {(() => {
                              const platform = txn.platform?.toLowerCase();
                              let icon = (
                                <PiDevicesDuotone className="size-4" />
                              );
                              let style =
                                "text-slate-600 border-slate-200 bg-slate-50";

                              if (platform === "ios") {
                                icon = <AiFillApple className="size-3.5" />;
                                style =
                                  "text-slate-900 border-slate-200 bg-slate-100";
                              } else if (platform === "android") {
                                icon = <AiFillAndroid className="size-3.5" />;
                                style =
                                  "text-emerald-600 border-emerald-100 bg-emerald-50";
                              } else if (
                                platform === "admin_granted" ||
                                platform === "admin"
                              ) {
                                icon = <FaUserTie className="size-3.5" />;
                                style =
                                  "text-brand-aqua border-brand-aqua/20 bg-brand-aqua/5";
                              }

                              return (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-black rounded-lg px-2 py-1 h-7 gap-2 shadow-none border uppercase tracking-widest inline-flex items-center",
                                    style
                                  )}
                                >
                                  {icon}
                                  <span>
                                    {PLATFORM_MAP[platform] || platform || "—"}
                                  </span>
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="px-3.5 py-4">
                            <span
                              className="text-[11px] font-bold text-slate-500 font-mono"
                            >
                              {getProductDisplayName(txn.productId)}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            {(() => {
                              const eventType =
                                txn.eventType?.toLowerCase() || "";
                              const eventConfig =
                                EVENT_TYPE_MAP[eventType] ||
                                EVENT_TYPE_MAP.PURCHASE;

                              return (
                                <Badge
                                  className={cn(
                                    "text-[10px] font-black uppercase border-none shadow-none rounded-lg px-2.5 py-0.5",
                                    eventConfig.color
                                  )}
                                >
                                  {eventConfig.label}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center">
                          <div className="flex flex-col items-center gap-3 text-foreground/80">
                            <IconCreditCard size={48} className="opacity-60" />
                            <p className="font-semibold opacity-70">
                              No transaction history found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION SECTION (MATCHING CAMPAIGN HISTORY DESIGN) */}
              {totalPages > 1 && (
                <div className="flex flex-row items-center justify-between p-6 pb-2 border-t border-slate-200 bg-white">
                  {/* Left Side: Showing results count */}
                  <div className="text-xs font-medium text-slate-400">
                    Showing{" "}
                    {(currentPage - 1) * itemsPerPage +
                      (paginatedTransactions.length > 0 ? 1 : 0)}
                    -
                    {Math.min(
                      currentPage * itemsPerPage,
                      transactions?.length || 0
                    )}{" "}
                    of {transactions?.length || 0} results
                  </div>

                  {/* Right Side: Navigation Controls */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <IconChevronLeft size={16} />
                    </Button>

                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const pages = [];
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          if (currentPage <= 3) {
                            pages.push(1, 2, 3, 4, "...", totalPages);
                          } else if (currentPage >= totalPages - 2) {
                            pages.push(
                              1,
                              "...",
                              totalPages - 3,
                              totalPages - 2,
                              totalPages - 1,
                              totalPages
                            );
                          } else {
                            pages.push(
                              1,
                              "...",
                              currentPage - 1,
                              currentPage,
                              currentPage + 1,
                              "...",
                              totalPages
                            );
                          }
                        }

                        return pages.map((page, idx) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`dots-${idx}`}
                                className="px-1 text-slate-400 text-xs font-bold"
                              >
                                ...
                              </span>
                            );
                          }
                          const isActive = currentPage === page;
                          return (
                            <Button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                "h-8 w-8 text-xs font-bold rounded-md transition-all",
                                isActive
                                  ? "bg-brand-aqua text-white hover:bg-brand-hoverAqua shadow-md shadow-brand-aqua/20"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-none"
                              )}
                            >
                              {page}
                            </Button>
                          );
                        });
                      })()}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <IconChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Grant Sections (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          {/* 3. GRANT SUBSCRIPTION */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-5 overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Grant Subscription"
                  subtitle="Assign premium access manually"
                  Icon={ShieldCheck}
                  iconColor="text-[#14B8A6]"
                  iconBg="bg-[#14B8A6]/10"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6">
              {isPremiumActive ? (
                <div className="bg-gray-50 border border-gray-300/80 rounded-xl px-7 py-8 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <IconCrown size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      Active Premium Subscription
                    </p>
                    <p className="text-[11px] font-medium text-gray-600/80 mt-1 max-w-xs mx-auto leading-relaxed">
                      This user already has an active premium subscription. Use
                      the "Extend" option if you want to add more time.
                    </p>
                  </div>
                </div>
              ) : (
                // hasSubscriptionRecord ? (
                //   <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3">
                //     <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                //       <History size={24} strokeWidth={1.5} />
                //     </div>
                //     <div>
                //       <p className="text-sm font-bold text-amber-700">
                //         Previous Subscription Found
                //       </p>
                //       <p className="text-[11px] font-medium text-amber-600/80 mt-1 max-w-xs mx-auto leading-relaxed">
                //         A record already exists for this user. To avoid duplicate
                //         entries, please **Extend** or **Reactivate** the existing
                //         plan.
                //       </p>
                //       {/* <Button
                //         variant="outline"
                //         size="sm"
                //         className="mt-4 border-amber-200 text-amber-600 hover:bg-amber-100 font-bold"
                //         onClick={() => setIsExtendOpen(true)}
                //       >
                //         <CalendarPlus className="mr-2 h-4 w-4" />
                //         Extend / Reactivate Plan
                //       </Button> */}
                //     </div>
                //   </div>
                // ) :
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                      Subscription Tier
                    </Label>
                    <Select
                      value={grantPlan}
                      onValueChange={(val) => {
                        setGrantPlan(val);
                        if (val === "MONTHLY") setGrantDuration("30");
                        if (val === "QUARTERLY") setGrantDuration("90");
                      }}
                    >
                      <SelectTrigger className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-md border-none shadow-xl">
                        <SelectItem
                          value="MONTHLY"
                          className="text-xs font-semibold text-slate-600 py-2.5 rounded-lg"
                        >
                          Monthly (30 Days)
                        </SelectItem>
                        <SelectItem
                          value="QUARTERLY"
                          className="text-xs font-semibold text-slate-600 py-2.5 rounded-lg"
                        >
                          Quarterly (90 Days)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                      Duration (Days)
                    </Label>
                    <Input
                      type="number"
                      className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs focus-visible:border-slate-500 transition-all shadow-sm"
                      value={grantDuration}
                      onChange={(e) => setGrantDuration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                      Reason
                    </Label>
                    <Input
                      placeholder="Admin Manual Grant"
                      className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs placeholder:text-slate-300 focus-visible:border-slate-500 transition-all shadow-sm"
                      value={grantReason}
                      onChange={(e) => setGrantReason(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full bg-brand-aqua hover:bg-brand-hoverAqua text-white font-bold h-10 rounded-md hover:brightness-110 transition-all duration-300 text-xs shadow-sm mt-2"
                    onClick={() => {
                      if (!grantDuration || Number(grantDuration) <= 0) {
                        return toast.error("Please provide a valid duration");
                      }
                      setIsConfirmSubOpen(true);
                    }}
                    disabled={subLoading}
                  >
                    {subLoading ? (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    ) : (
                      "Execute Access Grant"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirm Grant Subscription Modal */}
          <ConfirmModal
            isOpen={isConfirmSubOpen}
            onClose={() => {
              if (subLoading || subSuccess) return;
              setIsConfirmSubOpen(false);
            }}
            onConfirm={handleGrantSubscription}
            title="Grant Subscription"
            message={`Are you sure you want to grant a ${grantPlan} subscription for ${grantDuration} days? Reason: "${grantReason || "Admin Manual Grant"
              }"`}
            confirmText="Confirm Grant"
            type="brand"
            loading={subLoading}
            success={subSuccess}
          />

          {/* 4. GRANT CONSUMABLES */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-4 overflow-hidden bg-white transition-all duration-300">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-3">
                <DashboardHead
                  title="Grant Consumables"
                  subtitle="Add Super Keens or Super charge"
                  Icon={IconStar}
                  iconColor="text-[#8B5CF6]"
                  iconBg="bg-[#8B5CF6]/10"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Asset Type
                  </Label>
                  <Select
                    value={consumableType}
                    onValueChange={setConsumableType}
                  >
                    <SelectTrigger className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-none shadow-xl">
                      <SelectItem
                        value="SUPER_KEEN"
                        className="text-xs font-semibold text-slate-600 py-2.5 rounded-lg"
                      >
                        Super Keens
                      </SelectItem>
                      <SelectItem
                        value="BOOST"
                        className="text-xs font-semibold text-slate-600 py-2.5 rounded-lg"
                      >
                        Super Charge
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs focus-visible:border-slate-500 transition-all shadow-sm"
                    value={consumableAmount}
                    onChange={(e) => setConsumableAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Reason
                  </Label>
                  <Input
                    placeholder="Admin Manual Grant"
                    className="h-10 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-xs placeholder:text-slate-300 focus-visible:border-slate-500 transition-all shadow-sm"
                    value={consumableReason}
                    onChange={(e) => setConsumableReason(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-brand-aqua hover:bg-brand-hoverAqua text-white font-bold h-10 rounded-md hover:brightness-110 transition-all duration-300 text-xs shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsConfirmAssetOpen(true)}
                  disabled={assetLoading || !consumableAmount || Number(consumableAmount) <= 0}
                >
                  {assetLoading ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    "Grant Assets"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog for Granting Consumables */}
      <ConfirmModal
        isOpen={isConfirmAssetOpen}
        onClose={() => {
          if (assetLoading || assetSuccess) return;
          setIsConfirmAssetOpen(false);
        }}
        onConfirm={handleGrantConsumables}
        title="Confirm Asset Grant"
        message={`Are you sure you want to grant ${consumableAmount} ${consumableType === "SUPER_KEEN" ? "Super Keens" : "Super charge"
          } to this user?`}
        confirmText="Confirm Grant"
        type="brand"
        loading={assetLoading}
        success={assetSuccess}
      />

      {/* <ExtendSubscriptionDialog
        open={isExtendOpen}
        onOpenChange={setIsExtendOpen}
        loading={subLoading}
        onExtend={handleExtendSubscription}
      /> */}
    </TabsContent>
  );
};

const FinancialStatCard = ({ val, label, description, color }) => (
  <Card className="relative overflow-hidden shadow-sm rounded-2xl py-4 border border-slate-200 bg-white group transition-all duration-300">
    <CardContent className="p-2 flex flex-col items-center text-center">
      <h2
        className={cn(
          "text-4xl font-black mb-1 transition-transform duration-300",
          color === "orange" ? "text-orange-500" : "text-indigo-500"
        )}
      >
        {val}
      </h2>
      <p className="text-[13px] font-bold text-slate-600 tracking-tight">
        {label}
      </p>
      {description && <div className="mt-0.5">{description}</div>}
    </CardContent>
    {/* Bottom Accent Bar */}
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-1",
        color === "orange" ? "bg-orange-500" : "bg-indigo-500"
      )}
    />
  </Card>
);