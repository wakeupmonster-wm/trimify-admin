import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CampaignHistory from "../components/campaign.history";
import {
  Bell,
  Send,
  Users,
  Mail,
  Monitor,
  MousePointer2,
  Eye,
  Type,
  Link2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  broadcastNotification,
  sendNotificationToPremiumUsers,
  createPremiumExpiryCampaign,
  clearNotificationStatus,
  sendEmailCampaign,
  notificationHistory,
} from "../store/notification-management.slice";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Loader from "@/components/common/Loader";
import { LuUsersRound } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function NotificationManagementPages() {
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);

  // Clear timeout to prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  const {
    loading: reduxLoading,
    pagination: pagination,
    successMessage,
    error,
    history,
  } = useSelector((s) => s.notificationManagement);

  const [form, setForm] = useState({
    notificationType: "broadcast",
    channel: "email",
    target: "premium",
    campaignName: "",
    subject: "",
    message: "",
    ctaLabel: "",
    ctaAction: "OPEN_APP",
    daysBeforeExpiry: "7", // Default to 7 days for expiry
  });

  const [activeTab, setActiveTab] = useState("new");
  const [previewType, setPreviewType] = useState("email");
  const [localLoading, setLocalLoading] = useState(false);
  const [dripDays, setDripDays] = useState([7]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isLoading = reduxLoading || localLoading;

  useEffect(() => {
    if (activeTab === "history") {
      dispatch(
        notificationHistory({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          channel: channelFilter === "all" ? undefined : channelFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
        })
      );
    }
  }, [dispatch, activeTab, paginationState, channelFilter, statusFilter]);

  const handleChannelFilterChange = (val) => {
    setChannelFilter(val);
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const buildCta = () => {
    if (!form.ctaAction) return undefined;
    return { action: form.ctaAction };
  };

  const handleLaunchClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.campaignName || !form.subject || !form.message) {
      toast.error(
        "Please fill in all required fields (Name, Title/Subject, Message)"
      );
      return;
    }

    // Removed validation for ctaLabel

    setConfirmLoading(false);
    setConfirmSuccess(false);
    setIsConfirmOpen(true);
  };

  const executeLaunch = async () => {
    const cta = buildCta();
    const isEmail = form.channel === "email";

    // Common fields for all actions
    const payload = {
      campaignName: form.campaignName,
      target: form.target,
      ...(cta && { cta }),
    };

    // Channel specific content fields
    if (isEmail) {
      payload.subject = form.subject;
      payload.body = form.message;
    } else {
      payload.title = form.subject; // form.subject holds the 'title' for push
      payload.message = form.message;
    }

    const actions = {
      broadcast: () => broadcastNotification(payload),
      premium: () =>
        sendNotificationToPremiumUsers({
          ...payload,
          sendNow: true,
        }),
      expiry: () => {
        const dripStages = dripDays.map((d) => ({ days: d }));
        return createPremiumExpiryCampaign({
          ...payload,
          daysBeforeExpiry: dripDays[0] || 7,
          dripStages,
          auto: true,
        });
      },
      email: () => sendEmailCampaign(payload),
    };

    const activeAction =
      form.channel === "email" ? "email" : form.notificationType;

    try {
      setConfirmLoading(true);
      setConfirmSuccess(false);
      const res = await dispatch(actions[activeAction]()).unwrap();
      toast.success(res?.message || "Campaign launched successfully!");
      setConfirmSuccess(true);
      setConfirmLoading(false);
      setForm((p) => ({
        ...p,
        campaignName: "",
        subject: "",
        message: "",
        ctaLabel: "",
      }));
      setTimeout(() => {
        setIsConfirmOpen(false);
        setConfirmSuccess(false);
      }, 1500);
    } catch (err) {
      setConfirmLoading(false);
      setConfirmSuccess(false);
      setIsConfirmOpen(false);
      const errorMessage =
        typeof err === "string"
          ? err
          : Array.isArray(err)
            ? err[0]
            : err?.message || "Failed to launch campaign";
      toast.error(errorMessage);
    } finally {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => dispatch(clearNotificationStatus()),
        4000
      );
    }
  };

  return (
    <Container>
      {isLoading && activeTab !== "history" && !isConfirmOpen && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
          <Loader width={200} height={200} />
        </div>
      )}

      <motion.div
        className="@container/main space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex md:items-center justify-between gap-3">
            <PageHeader
              heading="Campaign Manager"
              icon={<Bell strokeWidth={2} className="w-9 h-9 text-white" />}
              color="bg-brand-aqua"
              subheading="Design and deploy multi-channel engagement."
            />
          </div>
        </motion.header>

        <div className="mx-auto">
          {/* TABS */}
          <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab("new")}
              className={cn(
                "pb-4 text-[13px] font-semibold transition-all px-2 relative",
                activeTab === "new"
                  ? "text-brand-aqua"
                  : "text-slate-500 hover:text-slate-600"
              )}
            >
              New Campaign
              {activeTab === "new" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0  right-0 h-[2px] bg-brand-aqua"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "pb-4 text-[13px] font-semibold transition-all px-2 relative",
                activeTab === "history"
                  ? "text-brand-aqua"
                  : "text-slate-500 hover:text-slate-600"
              )}
            >
              Campaign History
              {activeTab === "history" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-aqua"
                />
              )}
            </button>
          </div>

          {activeTab === "new" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: CAMPAIGN DETAILS */}
              <div className="lg:col-span-7">
                <Card className="border border-slate-200 pt-2 shadow-sm rounded-xl overflow-hidden bg-white">
                  <div className="px-4 sm:px-6 py-2 md:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Campaign Details
                    </h2>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                      Configure and dispatch engagement notifications
                    </span>
                  </div>

                  <div className="px-4 sm:px-6 space-y-8">
                    {/* Channel Type */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-aqua">
                        <Monitor size={18} />
                        <span className="text-[13px] font-bold">
                          Channel Type
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setForm((p) => ({
                              ...p,
                              channel: "email",
                              target:
                                p.target === "expiring" ? "premium" : p.target,
                              notificationType: "broadcast",
                            }));
                            setPreviewType("email");
                          }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                            form.channel === "email"
                              ? "border-brand-aqua bg-brand-aqua/5"
                              : "border-slate-100 bg-white hover:border-slate-200"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                              form.channel === "email"
                                ? "bg-brand-aqua text-white"
                                : "bg-slate-50 text-slate-400"
                            )}
                          >
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900">
                              Email Campaign
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              Rich HTML newsletters & offers
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setForm((p) => ({
                              ...p, channel: "push",
                              notificationType: p.target === "expiring" ? "expiry" : "broadcast"
                            }));
                            setPreviewType("push");
                          }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                            form.channel === "push"
                              ? "border-brand-aqua bg-brand-aqua/5"
                              : "border-slate-100 bg-white hover:border-slate-200"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                              form.channel === "push" ? "bg-brand-aqua text-white" : "bg-slate-50 text-slate-400"
                            )}
                          >
                            <Bell size={20} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900">
                              Push Notification
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              Direct mobile device alerts
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-aqua">
                        <LuUsersRound size={18} />
                        <span className="text-[13px] font-bold">
                          Target Audience
                        </span>
                      </div>
                      <Select
                        value={form.target}
                        onValueChange={(v) => {
                          setForm((p) => ({
                            ...p,
                            target: v,
                            notificationType:
                              v === "expiring"
                                ? "expiry"
                                : v === "premium"
                                  ? "premium"
                                  : "broadcast",
                          }));
                        }}
                      >
                        <SelectTrigger className="h-12 border-slate-200 rounded-lg text-[13px] font-medium bg-white">
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All App Users
                          </SelectItem>
                          <SelectItem value="premium">
                            Premium Tier Only (Subscription Updates)
                          </SelectItem>
                          <SelectItem value="free">Free Tier Only</SelectItem>
                          {form.channel === "push" && (
                            <SelectItem value="expiring">
                              Expiring Subscriptions
                            </SelectItem>
                          )}
                          <SelectItem value="ghosted">
                            Ghosted Users (30+ Days Inactive)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Expiry Reminder Schedule (Drip Sequence) */}
                    {form.target === "expiring" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-aqua">
                          <Clock size={18} />
                          <span className="text-[13px] font-bold">
                            Reminder Schedule (Drip Sequence)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {[7, 3, 1].map((day) => (
                            <label
                              key={day}
                              className={cn(
                                "flex items-center gap-2 cursor-pointer border px-4 py-2.5 rounded-lg transition-all",
                                dripDays.includes(day)
                                  ? "bg-brand-aqua/10 border-brand-aqua"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                              )}
                            >
                              <Checkbox
                                className="w-4 h-4 border-slate-300 data-[state=checked]:bg-brand-aqua data-[state=checked]:border-brand-aqua data-[state=checked]:text-white rounded-[4px]"
                                checked={dripDays.includes(day)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setDripDays(
                                      [...dripDays, day].sort((a, b) => b - a)
                                    );
                                  } else {
                                    setDripDays(
                                      dripDays.filter((d) => d !== day)
                                    );
                                  }
                                }}
                              />
                              <span
                                className={cn(
                                  "text-[13px] font-bold",
                                  dripDays.includes(day)
                                    ? "text-brand-aqua"
                                    : "text-slate-600"
                                )}
                              >
                                {day} Days Before
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Select multiple days to send automated follow-up
                          reminders. Deselect to skip.
                        </p>
                      </div>
                    )}

                    {/* Internal Reference */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-aqua">
                        <Link2 size={18} />
                        <span className="text-[13px] font-bold">
                          Internal Reference
                        </span>
                      </div>
                      <Input
                        placeholder="Internal Campaign Name (e.g., Valentines_2026)"
                        className="h-12 border-slate-200 rounded-lg text-[13px] font-medium bg-[#F8FAFC]/50"
                        value={form.campaignName}
                        onChange={(e) =>
                          handleChange("campaignName", e.target.value)
                        }
                      />
                    </div>

                    {/* Creative Content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-aqua">
                        <Type size={18} />
                        <span className="text-[13px] font-bold">
                          {
                            form.channel === "email"
                              ? "Email Subject"
                              : "Notification Title"
                          }
                        </span>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder={
                            form.channel === "email"
                              ? "Email Subject Line"
                              : "Notification Title"
                          }
                          className="h-12 border-slate-200 rounded-lg text-[13px] font-medium bg-[#F8FAFC]/50"
                          value={form.subject}
                          onChange={(e) =>
                            handleChange("subject", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder={
                            form.channel === "email"
                              ? "Write your email body (HTML supported)..."
                              : "Write your notification body..."
                          }
                          className="min-h-[120px] border-slate-200 rounded-lg text-[13px] font-medium bg-[#F8FAFC]/50 p-4 resize-none"
                          value={form.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Call To Action */}
                    {form.channel === "push" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-aqua">
                          <MousePointer2 size={18} />
                          <span className="text-[13px] font-bold">
                            Call To Action (CTA)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <Select
                            value={form.ctaAction}
                            onValueChange={(v) => handleChange("ctaAction", v)}
                          >
                            <SelectTrigger className="h-12 border-slate-200 rounded-lg text-[13px] font-medium bg-white">
                              <SelectValue placeholder="Select landing page" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN_APP">Open App</SelectItem>
                              <SelectItem value="BUY_PREMIUM">
                                Premium Subscription Page
                              </SelectItem>
                              <SelectItem value="OPEN_CHAT">
                                Chat Hub
                              </SelectItem>

                              {/* <SelectItem value="DISCOVERY">
                                User Discovery
                              </SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Launch Button */}
                    <Button
                      type="button"
                      onClick={handleLaunchClick}
                      disabled={isLoading}
                      className="w-full h-10 bg-brand-aqua hover:bg-brand-hoverAqua text-white rounded-lg font-bold text-xs shadow-md shadow-brand-aqua/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <Send size={18} />
                      {isLoading ? "Launching..." : "Launch Campaign"}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* RIGHT: LIVE PREVIEW (Sticky) */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                  {/* Header */}
                  <div className="flex items-center justify-between py-[22px] px-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Eye size={18} strokeWidth={2.5} />
                      <span className="text-[15px] font-bold">
                        Live Preview
                      </span>
                    </div>

                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-bold",
                        previewType === "email"
                          ? "bg-[#E0E7FF] text-[#4338CA]"
                          : "bg-brand-aqua/10 text-brand-aqua"
                      )}
                    >
                      {previewType === "email" ? "Email" : "Mobile Push"}
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="flex-1 bg-white px-2 py-6 flex justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {previewType === "push" ? (
                        <motion.div
                          key="push-preview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="w-full flex justify-center"
                        >
                          {/* Phone Mockup */}
                          <div className="relative w-[280px] h-[580px] bg-[#0F172A] rounded-[40px] p-1.5 shadow-2xl border-4 border-[#334155]/20">
                            {/* Screen */}
                            <div className="w-full h-full rounded-[30px] overflow-hidden relative bg-slate-900">
                              {/* Notch */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-[#0F172A] rounded-b-[12px] z-20"></div>

                              {/* Wallpaper (Abstract CSS Gradient to mimic image) */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#C084FC] to-[#0EA5E9] opacity-90">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                                <div className="absolute -bottom-20 -left-20 w-[150%] h-[150%] bg-gradient-to-t from-[#0EA5E9]/80 via-transparent to-transparent rounded-[100%] transform -rotate-12 blur-2xl"></div>
                              </div>

                              {/* Notification Banner */}
                              <div className="absolute top-10 left-3 right-3 z-30">
                                <motion.div
                                  initial={{ y: -20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="bg-white/95 backdrop-blur-md shadow-lg rounded-[16px] p-3 border border-white/20"
                                >
                                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-slate-500">
                                    <div className="w-[18px] h-[18px] bg-brand-aqua rounded flex items-center justify-center">
                                      <Bell
                                        className="text-white w-2.5 h-2.5"
                                        strokeWidth={3}
                                      />
                                    </div>
                                    <span className="font-medium text-slate-700">
                                      Trimify Admin
                                    </span>
                                    <span>•</span>
                                    <span>now</span>
                                  </div>
                                  <h4 className="text-[13px] font-bold text-slate-900 mb-0.5 leading-tight">
                                    {form.subject || "Notification Title"}
                                  </h4>
                                  <p className="text-[12px] text-slate-600 line-clamp-2 leading-snug">
                                    {form.message ||
                                      "Notification content will appear here..."}
                                  </p>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="email-preview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="w-full flex justify-center items-start"
                        >
                          {/* Email Mockup */}
                          <div className="w-full max-w-[450px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Window Topbar */}
                            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                            </div>

                            {/* Email Header Info */}
                            <div className="p-5 border-b border-slate-100">
                              <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-slate-900 mb-3">
                                {form.subject || "(No Subject)"}
                              </h3>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-aqua to-brand-aqua/80 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  K
                                </div>
                                <div className="leading-tight">
                                  <p className="text-[13px] font-semibold text-slate-900">
                                    Trimify Admin
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    support@keenasmustard.com
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Email Body */}
                            <div className="p-5 min-h-[200px]">
                              {form.message ? (
                                <div className="text-[14px] text-[#334155] leading-[1.6] whitespace-pre-wrap">
                                  {form.message}
                                </div>
                              ) : (
                                <span className="text-[14px] text-slate-400 italic">
                                  Email content will appear here...
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CampaignHistory
              history={history}
              pagination={pagination}
              paginationState={paginationState}
              onPaginationChange={setPaginationState}
              channelFilter={channelFilter}
              setChannelFilter={handleChannelFilterChange}
              statusFilter={statusFilter}
              setStatusFilter={handleStatusFilterChange}
            />
          )}
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          if (confirmLoading || confirmSuccess) return;
          setIsConfirmOpen(false);
        }}
        onConfirm={executeLaunch}
        title="Confirm Campaign Launch"
        type="brand"
        confirmText="Yes, Launch Now"
        loading={confirmLoading}
        success={confirmSuccess}
        message={
          <>
            Are you sure you want to launch the{" "}
            <strong className="text-brand-aqua font-bold">
              {form.campaignName || "Draft"}
            </strong>{" "}
            campaign? This will be dispatched to the{" "}
            <strong className="text-slate-700 font-bold">
              {form.target === "premium"
                ? "Premium"
                : form.target === "free"
                  ? "Free"
                  : form.target === "all"
                    ? "All App"
                    : "Expiring"}
            </strong>{" "}
            audience via{" "}
            <strong className="text-slate-700 font-bold">
              {form.channel === "email" ? "Email" : "Push Notification"}
            </strong>
            .
          </>
        }
      />
    </Container>
  );
}
