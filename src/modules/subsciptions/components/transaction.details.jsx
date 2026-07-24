/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  IconDownload,
  IconReceipt,
  IconBox,
  IconUserCircle,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { ChevronLeft } from "lucide-react";
import { PLATFORM_MAP, EVENT_TYPE_MAP } from "@/constants/transection.config";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGeneralSettings } from "@/modules/settings/store/general.slice";
import DashboardHead from "@/components/shared/dashboard.head.jsx";
import { toast } from "sonner";
import { getProductDisplayName } from "@/utils/productDisplay";
import html2pdf from "html2pdf.js";

export default function TransactionDetails({ transaction, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSelfieOpen, setIsSelfieOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Fetch general settings for logo
  const generalSettings = useSelector((state) => state.generalSettings);
  const logoUrl = generalSettings?.list?.value?.logo || null;

  useEffect(() => {
    dispatch(fetchGeneralSettings());
  }, [dispatch]);

  if (!transaction) return null;

  const eventConfig = EVENT_TYPE_MAP[transaction.eventType] || {
    label: transaction.eventType,
    color: "bg-slate-100 text-slate-600",
  };

  const status =
    transaction.status ||
    (transaction.eventType === "REFUND"
      ? "REFUNDED"
      : transaction.eventType === "CANCEL"
        ? "FAILED"
        : "SUCCESS");

  const isSuccess =
    status === "SUCCESS" || status === "COMPLETED" || status === "GRANTED";
  const isFailed = status === "FAILED" || status === "CANCELLED";
  const isRefunded = status === "REFUNDED";

  const statusBadgeColor = isSuccess
    ? "bg-emerald-500 text-white shadow-[0_2px_4px_rgba(16,185,129,0.2)]"
    : isFailed
      ? "bg-rose-500 text-white shadow-[0_2px_4px_rgba(244,63,63,0.2)]"
      : isRefunded
        ? "bg-amber-500 text-white shadow-[0_2px_4px_rgba(245,158,11,0.2)]"
        : "bg-slate-500 text-white";

  const dateStr = transaction.date || transaction.occurredAt;
  const formattedDate = dateStr
    ? format(new Date(dateStr), "dd MMM, yyyy")
    : "—";
  const formattedTime = dateStr ? format(new Date(dateStr), "hh:mm a") : "—";

  const platformLabel =
    PLATFORM_MAP[transaction.platform] || transaction.platform || "—";
  const amount = (transaction.grossAmount || 0).toFixed(2);
  const commission = (transaction.commission || 0).toFixed(2);
  const netAmount = (transaction.netAmount || 0).toFixed(2);

  // Fake timeline based on transaction info since backend might not send timeline array
  const timeline = [
    { title: "Initiated", time: dateStr },
    { title: "Processed", time: dateStr },
    { title: status, time: dateStr },
  ];

  const handleDownloadReceipt = () => {
    if (hasDownloaded) return;

    setIsDownloading(true);

    try {
      const userName =
        transaction.user?.nickname || transaction.user?.email || "User";
      const dateObj = new Date();
      const fileDateStr = format(dateObj, "yyyy-MM-dd");
      const filename =
        `Receipt_${userName}_${fileDateStr}`.replace(/[^a-zA-Z0-9_-]/g, "_") +
        ".pdf";

      // Clone dedicated invoice template for printing
      const printArea = document.getElementById("invoice-template");
      if (!printArea) throw new Error("Print area not found");

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";

      const clone = printArea.cloneNode(true);
      clone.classList.remove("hidden");
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      const opt = {
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .from(clone)
        .set(opt)
        .save()
        .then(() => {
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
          setIsDownloading(false);
          setHasDownloaded(true);
          toast.success("Receipt downloaded successfully!", {
            id: "download-receipt",
          });
        })
        .catch((err) => {
          console.error("PDF download error:", err);
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
          setIsDownloading(false);
          toast.error("Failed to download receipt.", {
            id: "download-receipt",
          });
        });
    } catch (error) {
      console.error("Prepare PDF error:", error);
      setIsDownloading(false);
      toast.error("Failed to prepare receipt.", { id: "download-receipt" });
    }
  };

  return (
    <motion.div
      id="printable-transaction"
      className="pb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
           @page { margin: 0.8cm; size: A4; }
           
           /* Isolate print container to fix pagination cutoff completely */
           body > *:not(.print-only-container) {
             display: none !important;
           }
           
           .print-only-container {
             display: block !important;
             width: 100% !important;
             background: white !important;
           }

           .print-only-container #invoice-template {
             padding: 1.5cm 1.8cm !important;
             max-width: 100% !important;
           }

           html, body {
             height: auto !important;
             min-height: auto !important;
             background: white !important;
             overflow: visible !important;
             margin: 0 !important;
             padding: 0 !important;
           }

           .no-print { display: none !important; }
           /* Force main grid to single column for print */
           .main-print-grid {
             display: block !important;
           }
           .bg-white, .bg-slate-100, .bg-slate-50, .bg-app-primary2\\/10, .bg-emerald-100, .bg-amber-100 {
             print-color-adjust: exact !important;
             -webkit-print-color-adjust: exact !important;
           }
           .rounded-xl { border-radius: 8px !important; }
           .shadow-sm, .shadow-lg { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
           .break-inside-avoid { break-inside: avoid !important; margin-bottom: 12px !important; }
         }
      `,
        }}
      />

      {/* Navigation Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-300/60 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95 no-print"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
              Transactions
            </span>
            <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
              /
            </span>
            <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
              Details
            </span>
            <div className="ml-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                  statusBadgeColor,
                )}
              >
                {isSuccess && <IconCheck size={12} stroke={4} />}
                {isFailed && <IconX size={12} stroke={4} />}
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto no-print">
          <Button
            onClick={handleDownloadReceipt}
            disabled={hasDownloaded || isDownloading}
            variant="outline"
            className="h-10 px-4 gap-2.5 font-bold rounded-lg border-slate-300/60 hover:bg-slate-50 text-slate-700 shadow-sm transition-all text-xs group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconDownload
              size={16}
              className={cn(
                "transition-colors",
                hasDownloaded
                  ? "text-slate-400"
                  : "text-slate-400 group-hover:text-app-primary2",
              )}
            />
            {hasDownloaded ? "Downloaded" : "Download Receipt"}
          </Button>
        </div>
      </header>

      {/* Main Content Area: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-4 main-print-grid">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Payment Information */}
          <div className="bg-white rounded-xl border border-slate-300/60 p-5 shadow-sm transition-shadow break-inside-avoid">
            <div className="pb-4 border-b border-slate-300/60 mb-5">
              <DashboardHead
                title="Payment Details"
                subtitle="Transaction amount and payment gateway info"
                Icon={IconReceipt}
                iconColor="text-app-primary2"
                iconBg="bg-app-primary2"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 p-4 rounded-xl border bg-slate-100 border-slate-300/60 flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Transaction ID
                </div>
                <div className="text-xs font-bold text-slate-600 font-mono break-all tracking-tight">
                  {transaction.transactionId ||
                    transaction.orderId ||
                    transaction._id ||
                    "—"}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Amount Paid
                </div>
                <div className="text-xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                  ${amount}{" "}
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    AUD
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Date & Time
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    {formattedDate}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {formattedTime}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Payment Platform
                </div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  {platformLabel}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Gateway Txn ID
                </div>
                <div className="text-xs font-bold text-slate-500 break-all font-mono tracking-tight">
                  {transaction.gatewayTransactionId ||
                    transaction.transactionId ||
                    transaction.originalTransactionId ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl border border-slate-300/60 p-5 shadow-sm transition-shadow break-inside-avoid">
            <div className="pb-4 border-b border-slate-300/60 mb-5">
              <DashboardHead
                title="Product Details"
                subtitle="Purchased plan or consumable item information"
                Icon={IconBox}
                iconColor="text-app-primary2"
                iconBg="bg-app-primary2"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Product Name
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {getProductDisplayName(transaction.productId)}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Type
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-bold px-2 py-1.5 rounded-lg border-none shadow-none",
                      eventConfig.color,
                    )}
                  >
                    {eventConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300/60 bg-slate-100/60 transition-all flex flex-col justify-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quantity
                </div>
                <div className="text-sm font-bold text-slate-800">1 unit</div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-6 print-page-break">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-slate-300/60 p-5 shadow-sm transition-shadow break-inside-avoid">
            <div className="pb-4 border-b border-slate-300/60 mb-5">
              <DashboardHead
                title="Customer Info"
                subtitle="User identification and account status"
                Icon={IconUserCircle}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-100/60 rounded-xl border border-slate-300/60 mb-4 shadow-sm">
              <div
                className={cn(
                  "w-11 h-11 rounded-full text-app-primary2 flex items-center justify-center text-lg font-black shrink-0 shadow-sm border-2 border-white overflow-hidden",
                  transaction.user?.selfieUrl
                    ? "cursor-pointer"
                    : "bg-app-primary2",
                )}
                onClick={() =>
                  transaction.user?.selfieUrl && setIsSelfieOpen(true)
                }
              >
                {transaction.user?.selfieUrl ? (
                  <img
                    src={transaction.user.selfieUrl}
                    alt="User selfie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (transaction.user?.nickname || transaction.user?.email || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {transaction.user?.nickname ||
                    transaction.user?.email ||
                    "Unknown User"}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                  {transaction.user?.email ||
                    transaction.user?.phone ||
                    "No contact info"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-300/60 bg-slate-100/60 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Account Status
                </span>
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  ACTIVE
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-300/60 bg-slate-100/60 flex flex-col justify-center shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  User ID
                </div>
                <div className="text-xs font-mono font-medium text-slate-700 break-all tracking-tight">
                  {transaction.user?._id || "—"}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                navigate("/admin/management/users-management/view-profile", {
                  state: {
                    userId: transaction.user?._id,
                    source: "transactions",
                    from: location.pathname,
                    returnState: { transaction },
                  },
                })
              }
              className="group w-full text-center gap-3 h-10 text-[11px] font-bold text-slate-600 hover:bg-app-primary3 hover:text-white rounded-lg border-slate-300/60 hover:border-transparent transition-all duration-300 ease-in-out mt-6 shadow-sm"
            >
              <IconUserCircle className="w-4 h-4 text-slate-400 group-hover:text-white transition-all duration-300 ease-in-out" />
              View Full Profile
            </Button>
          </div>

          {/* Transaction Context & Insights */}
          <div className="bg-white rounded-xl border border-slate-300/60 p-5 shadow-sm transition-shadow break-inside-avoid">
            <div className="pb-4 border-b border-slate-300/60 mb-5">
              <DashboardHead
                title="Timeline"
                subtitle="Step-by-step transaction processing history"
                Icon={IconClock}
                iconColor="text-app-primary2"
                iconBg="bg-app-primary2"
              />
            </div>

            <div className="space-y-4">
              {/* Environment Tag */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/60 border border-slate-300/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Environment
                </span>
                {(() => {
                  const isSandbox =
                    transaction.isSandbox ||
                    transaction.environment?.toLowerCase() === "sandbox" ||
                    transaction.environment?.toLowerCase() === "test" ||
                    transaction.store?.toLowerCase() === "sandbox";

                  return (
                    <Badge
                      className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-lg border-none shadow-none uppercase tracking-wide",
                        isSandbox
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700",
                      )}
                    >
                      {isSandbox ? "SANDBOX / TEST" : "PRODUCTION / REAL"}
                    </Badge>
                  );
                })()}
              </div>

              {/* Revenue Breakdown */}
              <div className="p-5 rounded-xl border border-slate-300/60 bg-slate-100/60 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Revenue Split (Actual)
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">
                      Gross Amount
                    </span>
                    <span className="text-slate-900 font-bold">${amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">
                      Platform Commission
                    </span>
                    <span className="text-rose-500 font-bold">
                      -${commission}
                    </span>
                  </div>
                  <div className="h-px bg-slate-300/80 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">
                      Net Revenue
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      ${netAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-300/60 bg-slate-100/60">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Store Type
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {transaction.platform?.toLowerCase() === "ios"
                      ? "Apple App Store"
                      : transaction.platform?.toLowerCase() === "android"
                        ? "Google Play Store"
                        : transaction.platform?.toLowerCase() === "admin" ||
                            transaction.platform?.toLowerCase() ===
                              "admin_granted"
                          ? "Admin Console"
                          : transaction.platform || "Unknown"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-300/60 bg-slate-100/60">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Purchase Type
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {transaction.isAutoRenewal ? "Auto-Renewal" : "One-Time"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSelfieOpen} onOpenChange={setIsSelfieOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          {transaction.user?.selfieUrl && (
            <img
              src={transaction.user.selfieUrl}
              alt="User selfie fullscreen"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dedicated Clean Invoice/Receipt Template for Export */}
      <div
        id="invoice-template"
        className="hidden bg-white w-full h-auto p-4 text-slate-800 relative mx-auto max-w-5xl"
      >
        {/* ── Logo + Payment Receipt Heading ── */}
        <div className="text-center pb-6 mb-6 border-b border-slate-300/60">
          {logoUrl ? (
            <img
              src="https://res.cloudinary.com/dew7qscdq/image/upload/v1780388090/mustardLogo2_qanbxz.webp"
              alt="App Logo"
              className="w-16 h-16 object-contain mx-auto mb-3 rounded-xl"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-app-primary2 flex items-center justify-center mx-auto mb-3">
              <IconReceipt size={28} className="text-app-primary2" />
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment Receipt
          </h1>
        </div>

        {/* ── Generated On ── */}
        <div className="flex justify-end mb-6">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Generated On
            </div>
            <div className="text-sm font-bold text-slate-800">
              {format(new Date(), "MM-dd-yyyy")}
              <span className="text-xs font-semibold text-slate-400 ml-1.5">
                {format(new Date(), "hh:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Customer Info ── */}
        <div className="mb-6 p-4 rounded-xl border border-slate-300/60 bg-slate-50/50">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Customer Information
          </div>
          <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
            <div className="text-slate-400 font-medium">Name:</div>
            <div className="font-bold text-slate-800">
              {transaction.user?.nickname || transaction.user?.email || "—"}
            </div>

            <div className="text-slate-400 font-medium">User ID:</div>
            <div className="font-mono text-xs font-medium text-slate-600 break-all">
              {transaction.user?._id || "—"}
            </div>

            <div className="text-slate-400 font-medium">Email:</div>
            <div className="font-medium text-slate-700">
              {transaction.user?.email || "—"}
            </div>
          </div>
        </div>

        {/* ── Subscription Details ── */}
        <div className="mb-6">
          <div className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-300/60">
            Subscription Details
          </div>
          <div className="grid grid-cols-[130px_1fr] gap-y-2 text-sm px-1">
            <div className="text-slate-400 font-medium">Plan:</div>
            <div className="font-bold text-slate-800">
              {getProductDisplayName(transaction.productId)}
            </div>

            <div className="text-slate-400 font-medium">Purchased:</div>
            <div className="font-bold text-slate-800">
              {dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—"}
            </div>

            <div className="text-slate-400 font-medium">Active Until:</div>
            <div className="font-bold text-slate-800">
              {(() => {
                const expiryStr =
                  transaction.expiresAt ||
                  transaction.endDate ||
                  transaction.subscription?.expiresAt ||
                  transaction.subscription?.endDate ||
                  transaction.user?.expiresAt;

                return expiryStr
                  ? format(new Date(expiryStr), "dd MMM yyyy")
                  : "—";
              })()}
            </div>

            <div className="text-slate-400 font-medium">Status:</div>
            <div
              className={cn(
                "font-bold",
                isSuccess
                  ? "text-emerald-600"
                  : isFailed
                    ? "text-rose-600"
                    : isRefunded
                      ? "text-amber-600"
                      : "text-slate-600",
              )}
            >
              {isSuccess ? "Active" : status}
            </div>
          </div>
        </div>

        {/* ── Transaction Details ── */}
        <div className="mb-8">
          <div className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-300/60">
            Transaction Details
          </div>
          <div className="grid grid-cols-[130px_1fr] gap-y-2 text-sm px-1">
            <div className="text-slate-400 font-medium">Transaction ID:</div>
            <div className="font-mono text-xs font-bold text-slate-700 break-all">
              {transaction.transactionId ||
                transaction.orderId ||
                transaction._id ||
                "—"}
            </div>

            <div className="text-slate-400 font-medium">Payment Method:</div>
            <div className="font-bold text-slate-800 capitalize">
              {platformLabel}
            </div>

            <div className="text-slate-400 font-medium">Gateway Ref:</div>
            <div className="font-mono text-xs font-medium text-slate-600 break-all">
              {transaction.gatewayTransactionId ||
                transaction.originalTransactionId ||
                "—"}
            </div>

            <div className="text-slate-400 font-medium">Status:</div>
            <div
              className={cn(
                "font-bold",
                isSuccess
                  ? "text-emerald-600"
                  : isFailed
                    ? "text-rose-600"
                    : isRefunded
                      ? "text-amber-600"
                      : "text-slate-600",
              )}
            >
              {isSuccess ? "Successful" : status}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pt-6 border-t border-slate-300/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
