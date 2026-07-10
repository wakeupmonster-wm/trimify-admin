import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  LayoutDashboard,
  Calendar,
  Gift,
  Award,
  Users,
  Power,
  PowerOff,
  Trash,
  Eye,
  Tag,
  Download,
  MapPin,
  Loader2,
  ChevronLeft,
  Box,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PreLoader } from "@/app/loader/preloader";
import {
  fetchCampaigns,
  disableCampaign,
  activateCampaign,
  deleteCampaign,
  participantsCampaign,
} from "../store/campaign.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/common/container";
import { AdminResourceNotFound } from "@/components/common/AdminResourceNotFound";
import DashboardHead from "@/components/shared/dashboard.head";
import {
  IconUser,
  IconChevronLeft,
  IconChevronRight,
  IconLoader,
} from "@tabler/icons-react";
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
import { LuUserRound, LuUsersRound } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Reusable helper function to calculate age dynamically based on age and dob
const calculateAge = (age, dob) => {
  let displayAge = age;
  if ((!displayAge || displayAge === 0 || displayAge === "0") && dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    displayAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      displayAge--;
    }
  }
  return displayAge || "24";
};

export default function ViewCampaignDetailPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get the campaignId from the navigation state or URL params as fallback
  const campaignId = location.state?.campaignId || params.campaignId;
  const { campaigns, loading } = useSelector((s) => s.campaign);
  const { partipants, pagination: partPagination } = useSelector(
    (s) => s.campaign,
  );

  // console.log("partipants: ", partipants);

  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    type: null,
  });

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [partPageIndex, setPartPageIndex] = useState(0);
  const [partPageSize, setPartPageSize] = useState(10);

  // Fetch campaign data
  useEffect(() => {
    dispatch(fetchCampaigns({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Fetch participants for this campaign
  useEffect(() => {
    if (campaignId) {
      dispatch(
        participantsCampaign({
          campaignId,
          page: partPageIndex + 1,
          limit: partPageSize,
        }),
      );
    }
  }, [dispatch, campaignId, partPageIndex, partPageSize]);

  // Find current campaign from Redux
  const campaign = useMemo(() => {
    return campaigns?.find((c) => c._id === campaignId || c.id === campaignId);
  }, [campaigns, campaignId]);

  if (loading && !campaign) return <PreLoader />;

  if (!campaign) {
    return (
      <AdminResourceNotFound
        title="Campaign Not Found"
        description="The giveaway campaign you're looking for doesn't exist or has been removed from the system."
        icon={LayoutDashboard}
        backLabel="Back to Giveaways"
        backPath="/admin/management/giveaway/campaigns"
      />
    );
  }

  const isCompleted = campaign.drawStatus === "COMPLETED";
  const displayStatus = isCompleted
    ? "COMPLETED"
    : campaign.isActive
      ? "ACTIVE"
      : "DISABLED";

  const statusStyles = {
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    DISABLED: "bg-slate-50 text-slate-500 border-slate-200",
  };

  const prize = campaign.prize;
  const winner = campaign.winner;
  const hasWinner = winner && (winner.email || winner.phone);

  // Handlers
  const handleConfirmAction = async () => {
    const { type } = confirmAction;
    try {
      setConfirmLoading(true);
      setConfirmSuccess(false);
      if (type === "DELETE") {
        await dispatch(deleteCampaign(campaignId)).unwrap();
        toast.success("Campaign deleted");
        setConfirmSuccess(true);
        setConfirmLoading(false);
        setTimeout(() => {
          setConfirmAction({ isOpen: false, type: null });
          setConfirmSuccess(false);
          navigate(-1);
        }, 1500);
      } else if (type === "DISABLE") {
        await dispatch(disableCampaign(campaignId)).unwrap();
        toast.success("Campaign disabled");
        setConfirmSuccess(true);
        setConfirmLoading(false);
        dispatch(fetchCampaigns({ page: 1, limit: 100 }));
        setTimeout(() => {
          setConfirmAction({ isOpen: false, type: null });
          setConfirmSuccess(false);
        }, 1500);
      } else if (type === "ACTIVATE") {
        await dispatch(activateCampaign(campaignId)).unwrap();
        toast.success("Campaign activated");
        setConfirmSuccess(true);
        setConfirmLoading(false);
        dispatch(fetchCampaigns({ page: 1, limit: 100 }));
        setTimeout(() => {
          setConfirmAction({ isOpen: false, type: null });
          setConfirmSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setConfirmLoading(false);
      setConfirmSuccess(false);
      toast.error(err || `Failed to ${type?.toLowerCase()} campaign`);
      setConfirmAction({ isOpen: false, type: null });
    }
  };

  // ─── Info Card Component ───
  const InfoCard = ({
    icon: Icon,
    label,
    value,
    iconColor = "text-brand-aqua",
  }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 transition-all group">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover:text-slate-500 transition-colors">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-bold text-foreground/80 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  // ─── CSV Download Handler ───
  const handleDownloadCSV = async () => {
    if (!partipants || partipants.length === 0) {
      toast.error("No participants to download");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      const headers = [
        "S.No",
        "Username/Nickname",
        "Email",
        "Phone",
        "Gender",
        "Age",
        "Location",
        "Is Winner",
      ];

      const escapeCSV = (value) => {
        if (value === undefined || value === null || value === "") return "—";
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = [headers.join(",")];
      partipants.forEach((p, idx) => {
        const displayAge = calculateAge(p.age, p.dob);
        const locationStr = p.city
          ? `${p.city}${p.country ? `, ${p.country}` : ""}`
          : p.location?.city
            ? `${p.location.city}${p.location.country ? `, ${p.location.country}` : ""}`
            : "";

        const row = [
          idx + 1,
          escapeCSV(p.nickname),
          escapeCSV(p.email),
          escapeCSV(`'${p.phone}`),
          escapeCSV(p.gender),
          escapeCSV(displayAge || "—"),
          escapeCSV(locationStr),
          escapeCSV(p.isWinner ? "YES" : "NO"),
        ];
        csvRows.push(row.join(","));
      });

      setExportProgress(95);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const csvStr = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const safeTitle = (campaign.title || "Campaign")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `participants_${safeTitle}_${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        toast.success("Participants data exported successfully");
      }, 600);
    } catch (error) {
      clearInterval(interval);
      console.error("Export Error:", error);
      toast.error("Failed to export CSV");
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopy = async () => {
    if (!campaign?._id) return;
    try {
      await navigator.clipboard.writeText(campaign._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Campaign ID Copied");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Container>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Navigation Bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/management/giveaway"
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                View Campaign
              </span>
              <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
                /
              </span>
              <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
                {campaign.title || "Campaign View"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="group flex items-center gap-2 bg-white text-[10px] font-medium text-muted-foreground px-3 py-1.5 rounded-md border border-muted-foreground/25 transition-all active:scale-95 shadow-sm"
            >
              ID: {campaign._id}
            </button>
          </div>
        </header>

        {/* ─── HERO HEADER ─── */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="h-16 w-16 rounded-2xl bg-brand-aqua flex items-center justify-center text-white shadow-md shadow-brand-aqua/40 shrink-0">
              <LayoutDashboard size={32} strokeWidth={2.5} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                  {prize?.title || "Campaign"}
                </h1>
                <Badge
                  className={cn(
                    "h-6 px-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 shadow-none",
                    statusStyles[displayStatus],
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      displayStatus === "ACTIVE"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-400",
                    )}
                  />
                  {displayStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Created{" "}
                  {campaign.createdAt
                    ? formatDistanceToNow(new Date(campaign.createdAt), {
                      addSuffix: true,
                    })
                    : "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Box className="h-3 w-3" />
                  {prize?.type || "Standard"} Prize
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isCompleted && campaign.isActive && (
              <Button
                onClick={() => {
                  setConfirmLoading(false);
                  setConfirmSuccess(false);
                  setConfirmAction({ isOpen: true, type: "DISABLE" });
                }}
                className="flex-1 md:flex-none h-10 px-6 bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] uppercase tracking-widest rounded-lg gap-2 shadow-sm transition-all duration-300 active:scale-95"
              >
                <PowerOff className="h-3.5 w-3.5" /> Disable
              </Button>
            )}
            {!isCompleted && !campaign.isActive && (
              <Button
                onClick={() => {
                  setConfirmLoading(false);
                  setConfirmSuccess(false);
                  setConfirmAction({ isOpen: true, type: "ACTIVATE" });
                }}
                className="flex-1 md:flex-none h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest rounded-lg gap-2 shadow-sm transition-all duration-300 active:scale-95"
              >
                <Power className="h-3.5 w-3.5" /> Activate
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setConfirmLoading(false);
                setConfirmSuccess(false);
                setConfirmAction({ isOpen: true, type: "DELETE" });
              }}
              disabled={hasWinner}
              className="flex-1 md:flex-none h-10 px-6 border-red-200 hover:border-transparent text-red-500 hover:text-white hover:bg-red-600 font-black text-[11px] uppercase tracking-widest rounded-lg gap-2 transition-all duration-300"
            >
              <Trash className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* ─── INFORMATION GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Information */}
          <div className="bg-white py-4 px-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col gap-4">
            <div className="w-full flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <DashboardHead
                title="Campaign Information"
                caseType={true}
                Icon={Calendar}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Campaign Name" value={campaign.title} />
              <InfoCard
                label="Created On"
                value={
                  campaign.createdAt
                    ? format(
                      new Date(campaign.createdAt),
                      "EEEE, dd MMMM, yyyy",
                    )
                    : null
                }
              />
              <InfoCard
                label="Draw Date"
                value={
                  campaign?.date
                    ? format(
                      new Date(
                        campaign.date +
                        (String(campaign.date).includes("T")
                          ? ""
                          : "T12:00:00"),
                      ),
                      "dd MMMM, yyyy",
                    )
                    : "—"
                }
              />
              <InfoCard label="Draw Status" value={campaign.drawStatus} />
            </div>
          </div>

          {/* Prize Details */}
          <div className="bg-white py-4 px-5 pb-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col gap-4">
            <div className="w-full flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <DashboardHead
                title="Prize Details"
                caseType={true}
                Icon={Gift}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Prize Name" value={prize?.title} />
                <InfoCard label="Prize Type" value={prize?.type} />
                <InfoCard label="Value" value={`$${prize?.value || "0.00"}`} />
                <InfoCard label="Winner Label" value={prize?.spinWheelLabel} />
                {/* <InfoCard
                  label="Winner Index"
                  value={campaign?.winnerIndex ?? "—"}
                /> */}
              </div>

              {/* Supportive Items */}
              {prize?.supportiveItems?.length > 0 && (
                <div className="px-2 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    Supportive Items
                  </p>
                  <div className="flex flex-wrap gap-2 mx-2">
                    {prize.supportiveItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-md bg-brand-aqua/10 text-brand-aqua text-[11px] font-black tracking-wide border border-brand-aqua/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── WINNER INFORMATION ─── */}
        <div className="bg-white py-4 px-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="w-full flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <DashboardHead
              title="Winner Information"
              caseType={true}
              Icon={Award}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
          </div>
          <div className="px-2 pt-4 flex items-center min-h-[100px]">
            {!hasWinner ? (
              <div className="w-full flex items-center gap-3 border-dashed border-2 border-slate-200 rounded-xl p-5 animate-in fade-in duration-500">
                <div className="h-10 w-10 rounded-lg bg-slate-200/50 flex items-center justify-center text-slate-400 mb-1">
                  <Users size={20} strokeWidth={1.5} />
                </div>

                <div className="flex flex-col">
                  <h4 className="text-[13px] font-black text-slate-600 capitalize tracking-wide">
                    Winner Pending
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold max-w-max">
                    The draw has not been completed for this campaign yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <Crown
                      size={24}
                      className="absolute -top-3 -left-3 -rotate-[44deg] text-amber-400 drop-shadow-md z-50"
                      style={{ animationDuration: "3s" }}
                      fill="#fbbf24"
                    />
                    <Avatar className="h-16 w-16 border-2 border-amber-300 ring-4 ring-amber-50 p-0.5 bg-white shadow-md">
                      <AvatarImage
                        src={winner.photo}
                        className="rounded-full"
                      />
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-xl font-bold">
                        {winner.nickname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-aqua/80">
                      Campaign Winner
                    </p>
                    <h4 className="text-lg font-bold text-foreground tracking-tight">
                      {winner.nickname}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground/60">
                      {winner.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    navigate(
                      "/admin/management/giveaway/view-profile",
                      { state: { userId: winner._id, from: window.location.pathname } },
                    )
                  }
                  className="h-9 group shadow-sm bg-white hover:bg-brand-aqua text-slate-500 hover:text-white border border-slate-200 hover:border-brand-aqua transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5"
                >
                  <Eye size={12} /> View Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ─── PARTICIPANTS TABLE ─── */}
        <div className="bg-white pt-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full flex items-center justify-between gap-2 px-5 pb-5 border-b border-slate-200">
              <DashboardHead
                title="Participants"
                subtitle="Users who entered this giveaway campaign."
                caseType={true}
                Icon={LuUsersRound}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
              <div className="flex items-center gap-3">
                <Badge className="h-9 group shadow-sm bg-white text-slate-500 cursor-pointer border border-slate-200 transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5">
                  <LuUserRound className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300" />
                  {partPagination?.total || 0} Entries
                </Badge>
                <Button
                  onClick={handleDownloadCSV}
                  disabled={isExporting}
                  className="h-9 group shadow-sm bg-white hover:bg-brand-aqua text-slate-500 hover:text-white border border-slate-200 hover:border-brand-aqua transition-all duration-300 active:scale-95 disabled:opacity-60 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5"
                >
                  {isExporting ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-slate-400 group-hover:text-white transition-colors duration-300"
                    />
                  ) : (
                    <Download
                      size={14}
                      className="text-slate-400 group-hover:text-white transition-colors duration-300"
                    />
                  )}
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-center">
                    S. NO.
                  </TableHead>
                  <TableHead className="px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left">
                    User
                  </TableHead>
                  <TableHead className="px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left">
                    Contact Details
                  </TableHead>
                  <TableHead className="px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left">
                    Location
                  </TableHead>
                  {/* <TableHead className="px-4 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left">
                    Account
                  </TableHead> */}
                  <TableHead className="px-6 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partipants?.length ? (
                  partipants.map((p, idx) => (
                    <TableRow
                      key={p._id}
                      onClick={() =>
                        navigate(
                          "/admin/management/giveaway/view-profile",
                          { state: { userId: p._id, from: window.location.pathname } },
                        )
                      }
                      className={cn(
                        "transition-all duration-300 cursor-pointer",
                        p.isWinner
                          ? "bg-emerald-100 hover:bg-emerald-100/50"
                          : "even:bg-slate-50/30 hover:bg-slate-100/50",
                      )}
                    >
                      <TableCell
                        className={cn(
                          "py-3 px-6 text-xs text-center font-bold",
                          p.isWinner ? "text-emerald-600" : "text-slate-400",
                        )}
                      >
                        {partPageIndex * partPageSize + idx + 1}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {p.isWinner && (
                              <Crown
                                size={16}
                                className="absolute -top-2 -left-2 -rotate-[35deg] text-amber-400 drop-shadow-sm z-50"
                                fill="#fbbf24"
                              />
                            )}
                            <Avatar
                              className={cn(
                                "h-9 w-9 border shadow-sm",
                                p.isWinner
                                  ? "border-emerald-300 ring-2 ring-emerald-100"
                                  : "border-slate-200",
                              )}
                            >
                              <AvatarImage src={p.photo} />
                              <AvatarFallback
                                className={cn(
                                  "text-[11px] font-bold",
                                  p.isWinner
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-brand-aqua/5 text-brand-aqua",
                                )}
                              >
                                {p.nickname?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "text-xs font-bold truncate",
                                p.isWinner
                                  ? "text-emerald-900"
                                  : "text-slate-900",
                              )}
                            >
                              {p.nickname}
                            </p>
                            <p
                              className={cn(
                                "text-[10px] font-semibold uppercase tracking-wide",
                                p.isWinner
                                  ? "text-emerald-600/80"
                                  : "text-slate-400",
                              )}
                            >
                              {p.gender || "MALE"} •{" "}
                              {calculateAge(p.age, p.dob)} Years
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <p
                          className={cn(
                            "text-xs font-bold",
                            p.isWinner ? "text-emerald-800" : "text-slate-700",
                          )}
                        >
                          {p.email}
                        </p>
                        <p
                          className={cn(
                            "text-[10px] font-semibold mt-0.5",
                            p.isWinner
                              ? "text-emerald-600/70"
                              : "text-slate-400",
                          )}
                        >
                          {p.phone}
                        </p>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <div
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-bold",
                            p.isWinner ? "text-emerald-700" : "text-slate-600",
                          )}
                        >
                          <MapPin
                            size={12}
                            className={
                              p.isWinner ? "text-emerald-500" : "text-slate-400"
                            }
                          />
                          <span className="truncate">
                            {p.city
                              ? `${p.city}, ${p.country}`
                              : "Not specified"}
                          </span>
                        </div>
                      </TableCell>
                      {/* <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {p.isPremium ? (
                            <Badge
                              variant="premium"
                              className="flex w-max items-center gap-1 px-2.5 py-0.5 text-[10px] 3xl:text-xs font-extrabold rounded-md shadow-none border-none uppercase"
                            >
                              <IconStarFilled size={10} /> PRO
                            </Badge>
                          ) : (
                            <span className="text-foreground/60 font-bold text-[10px] 3xl:text-xs pl-1 uppercase">
                              Free
                            </span>
                          )}
                          {p.isWinner && (
                            <Badge className="w-fit bg-emerald-500 text-white border-none font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm shadow-emerald-200 flex items-center gap-1.5 animate-bounce-subtle">
                              <Gift size={10} strokeWidth={3} /> WINNER
                            </Badge>
                          )}
                        </div>
                      </TableCell> */}
                      <TableCell className="py-3 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-lg transition-all",
                              p.isWinner
                                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                                : "bg-slate-100 text-slate-500 hover:bg-brand-aqua hover:text-white",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                "/admin/management/giveaway/view-profile",
                                { state: { userId: p._id, from: window.location.pathname } },
                              )
                            }}
                          >
                            <Eye size={14} />
                          </Button>
                          {/* {p.isWinner && (
                            <Badge className="w-fit bg-emerald-500 text-white border-none font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm shadow-emerald-200 flex items-center gap-1.5 animate-bounce-subtle">
                              <Gift size={10} strokeWidth={3} /> WINNER
                            </Badge>
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-400 text-xs font-bold"
                    >
                      No participants found for this campaign.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer (Bento Style) */}
          <div className="flex flex-row items-center justify-between p-6 py-5 border-t border-slate-200 bg-white">
            {/* Left Side: Showing results count */}
            <div className="text-xs font-bold text-slate-400">
              Showing {partPageIndex * partPageSize + 1}-
              {Math.min(
                (partPageIndex + 1) * partPageSize,
                partPagination?.total || 0,
              )}{" "}
              of {partPagination?.total || 0} participants
            </div>

            {/* Right Side: Pagination Controls */}
            <div className="flex items-center gap-4">
              {/* Row Select */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Rows
                </span>
                <Select
                  value={`${partPageSize}`}
                  onValueChange={(value) => {
                    setPartPageSize(Number(value));
                    setPartPageIndex(0);
                  }}
                >
                  <SelectTrigger className="h-8 w-[65px] border-slate-200 rounded-md bg-white text-xs font-semibold focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    {[10, 20, 50].map((size) => (
                      <SelectItem
                        key={size}
                        value={`${size}`}
                        className="text-xs font-medium rounded-lg"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  onClick={() =>
                    setPartPageIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={partPageIndex === 0}
                >
                  <IconChevronLeft size={16} />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const totalPages = Math.ceil(
                      (partPagination?.total || 0) / partPageSize,
                    );
                    const currentPage = partPageIndex + 1;
                    const pages = [];

                    if (totalPages <= 5) {
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
                          totalPages,
                        );
                      } else {
                        pages.push(
                          1,
                          "...",
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                          "...",
                          totalPages,
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
                          onClick={() => setPartPageIndex(page - 1)}
                          className={cn(
                            "h-8 w-8 text-xs font-bold rounded-md transition-all",
                            isActive
                              ? "bg-brand-aqua text-white hover:bg-brand-hoverAqua shadow-md shadow-brand-aqua/20"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-none",
                          )}
                        >
                          {page}
                        </Button>
                      );
                    });
                  })()}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  onClick={() =>
                    setPartPageIndex((prev) =>
                      Math.min(
                        Math.ceil((partPagination?.total || 0) / partPageSize) -
                        1,
                        prev + 1,
                      ),
                    )
                  }
                  disabled={
                    partPageIndex >=
                    Math.ceil((partPagination?.total || 0) / partPageSize) - 1
                  }
                >
                  <IconChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={confirmAction.isOpen}
        onClose={() => {
          if (confirmLoading || confirmSuccess) return;
          setConfirmAction({ isOpen: false, type: null });
        }}
        onConfirm={handleConfirmAction}
        title={`${confirmAction.type === "DELETE" ? "Delete" : confirmAction.type === "DISABLE" ? "Disable" : "Activate"} Campaign`}
        description={`Are you sure you want to ${confirmAction.type?.toLowerCase()} this campaign? This action cannot be undone.`}
        confirmText="Confirm"
        cancelText="Cancel"
        type={confirmAction.type === "DELETE" ? "danger" : "warning"}
        loading={confirmLoading}
        success={confirmSuccess}
      />

      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 10, scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="backdrop-blur-xl bg-white/90 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 w-[320px] space-y-5 overflow-hidden relative group">
              {/* Decorative background element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-aqua/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-sm",
                      exportProgress === 100
                        ? "bg-emerald-50 border-emerald-100 shadow-emerald-100/50"
                        : "bg-brand-aqua/10 border-brand-aqua/20",
                    )}
                  >
                    {exportProgress === 100 ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <Loader2 className="animate-spin h-5 w-5 text-brand-aqua" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight">
                      {exportProgress === 100
                        ? "Export Ready"
                        : "Exporting Data"}
                    </h3>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                      {exportProgress === 100
                        ? "File Downloaded"
                        : "Generating CSV"}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-xl border transition-colors duration-500",
                    exportProgress === 100
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-brand-aqua/10 border-brand-aqua/20 text-brand-aqua",
                  )}
                >
                  <span className="font-mono text-base font-bold tracking-tighter">
                    {exportProgress}%
                  </span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 120,
                    }}
                    className={cn(
                      "h-full relative rounded-full transition-colors duration-500",
                      exportProgress === 100
                        ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        : "bg-brand-aqua shadow-[0_0_10px_rgba(34,211,238,0.3)]",
                    )}
                  >
                    {/* Active Shimmer Effect */}
                    {exportProgress < 100 && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        style={{
                          width: "100px",
                          animation: "shimmer-progress 2s infinite linear",
                        }}
                      />
                    )}
                  </motion.div>
                </div>

                <div className="flex items-center justify-between text-[11px] px-1">
                  <div className="flex items-center gap-1.5">
                    {exportProgress < 100 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua animate-pulse" />
                    )}
                    <span className="text-slate-600 font-semibold tracking-tight">
                      {exportProgress === 100
                        ? "Export completed successfully"
                        : "Processing records..."}
                    </span>
                  </div>
                  {exportProgress === 100 && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-emerald-500 font-black uppercase tracking-tighter"
                    >
                      Success
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
