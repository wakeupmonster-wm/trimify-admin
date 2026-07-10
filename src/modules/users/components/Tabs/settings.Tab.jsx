import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHead from "@/components/shared/dashboard.head";
import {
  IconShieldLock,
  IconEye,
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  Search,
  Bell,
  Shield,
  Mail,
  Heart,
  MessageSquare,
  Smartphone,
  Activity,
  MapPin,
  Globe,
  CheckCircle2,
  Star,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fetchUserData, updateNotification } from "../../store/user.slice";
import { sendSingleUserNotification } from "@/modules/notificationManagement/store/notification-management.slice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { LiaUserShieldSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/common/ConfirmModal";
import { LuUserRound } from "react-icons/lu";

export const SettingsTab = ({ userData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile = {}, account = {}, settings = {}, discovery = {}, subscription = {} } = userData || {};

  // Local state for optimistic updates
  const [localNotifications, setLocalNotifications] = useState(
    settings?.notifications || {},
  );
  const [togglingKey, setTogglingKey] = useState(null);

  // Direct Messaging Form State
  const [directForm, setDirectForm] = useState({
    channel: "email",
    subject: "",
    message: "",
  });
  const [directConfirmOpen, setDirectConfirmOpen] = useState(false);
  const [directLoading, setDirectLoading] = useState(false);
  const [directSuccess, setDirectSuccess] = useState(false);

  const handleSendDirectClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!directForm.subject || !directForm.message) {
      toast.error("Please fill in all required fields (Subject and Message)");
      return;
    }

    if (directForm.channel === "email") {
      if (!account.email) {
        toast.error("User does not have a registered email address.");
        return;
      }
    }

    setDirectConfirmOpen(true);
  };

  const executeSendDirect = async () => {
    setDirectLoading(true);
    setDirectSuccess(false);

    try {
      const payload = {
        userId: userData._id,
        channel: directForm.channel,
        subject: directForm.subject,
        message: directForm.message,
      };

      const result = await dispatch(sendSingleUserNotification(payload)).unwrap();
      toast.success(result.message || "Message dispatched successfully!");
      setDirectSuccess(true);
      setDirectForm({
        channel: "email",
        subject: "",
        message: "",
      });
      setTimeout(() => {
        setDirectConfirmOpen(false);
        setDirectSuccess(false);
        setDirectLoading(false);
      }, 1500);
    } catch (err) {
      setDirectSuccess(false);
      setDirectConfirmOpen(false);
      setDirectLoading(false);
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to dispatch message";
      toast.error(errMsg);
    }
  };

  // Pagination state
  const [blockedUsersPage, setBlockedUsersPage] = useState(1);
  const [blockedContactsPage, setBlockedContactsPage] = useState(1);
  const itemsPerPage = 5;

  const totalBlockedUsersPages = Math.ceil(
    (settings?.blockedUsers?.length || 0) / itemsPerPage,
  );
  const paginatedBlockedUsers = useMemo(() => {
    const start = (blockedUsersPage - 1) * itemsPerPage;
    return (settings?.blockedUsers || []).slice(start, start + itemsPerPage);
  }, [settings?.blockedUsers, blockedUsersPage]);

  const totalBlockedContactsPages = Math.ceil(
    (settings?.blockedContacts?.length || 0) / itemsPerPage,
  );
  const paginatedBlockedContacts = useMemo(() => {
    const start = (blockedContactsPage - 1) * itemsPerPage;
    return (settings?.blockedContacts || []).slice(start, start + itemsPerPage);
  }, [settings?.blockedContacts, blockedContactsPage]);

  // Sync local state when userData changes (e.g., after a successful fetch)
  useEffect(() => {
    if (settings?.notifications) {
      setLocalNotifications(settings.notifications);
    }
  }, [settings?.notifications]);

  const handleToggleNotification = async (key, currentValue) => {
    if (togglingKey) return; // Prevent concurrent toggles

    setTogglingKey(key);
    // Optimistic Update
    setLocalNotifications((prev) => ({
      ...prev,
      [key]: !currentValue,
    }));

    try {
      const payload = {
        [key]: !currentValue,
      };

      await dispatch(
        updateNotification({
          userId: userData._id,
          payload,
        }),
      ).unwrap();

      toast.success(
        `${key.charAt(0).toUpperCase() + key.slice(1)} preference updated`,
      );
    } catch (error) {
      // Revert optimistic update on error
      setLocalNotifications((prev) => ({
        ...prev,
        [key]: currentValue,
      }));
      toast.error("Failed to update preferences");
    } finally {
      setTogglingKey(null);
    }
  };

  const notifIcons = {
    push: Smartphone,
    email: Mail,
    likes: Heart,
    messages: MessageSquare,
    matches: Bell,
  };

  const notifDescriptions = {
    push: "Get real-time alerts on your mobile device",
    email: "Summary of your matches sent to your inbox",
    likes: "Receive like notifications and updates",
    messages: "Receive message notifications and updates",
    matches: "Receive match notifications and updates",
  };

  return (
    <TabsContent
      value="settings"
      className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:ring-0"
    >
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 1. Account Management */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white h-fit">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Account Management"
                  subtitle="Administrative permissions and status"
                  Icon={LuUserRound}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-5 space-y-0.5">
              <SettingRow
                icon={<LiaUserShieldSolid size={16} />}
                label="Account Status"
                value={account.status}
                valueClass={
                  account.status === "active"
                    ? "text-brand-aqua"
                    : "text-rose-500"
                }
              />
              <SettingRow
                icon={<Star size={16} />}
                label="Membership Level"
                value={
                  subscription?.isCurrentlyActive ? (
                    <Badge
                      variant="premium"
                      className="flex w-max items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-md shadow-none border-none uppercase"
                    >
                      <IconStarFilled size={10} /> PRO
                    </Badge>
                  ) : (
                    <span className="text-foreground/60 font-bold text-[10px] pl-1 uppercase">
                      Free
                    </span>
                  )
                }
              />
              {typeof userData?.isMilestoneUser !== "undefined" && (
                <SettingRow
                  icon={<Sparkles size={16} />}
                  label="Milestone Program"
                  value={userData?.isMilestoneUser ? (userData?.milestoneDisplayStatus || "Active") : "Not Enrolled"}
                  valueClass={userData?.isMilestoneUser ? "text-brand-aqua" : "text-slate-500"}
                />
              )}

              {/* <div className="flex items-center gap-4 py-2.5 group">
                <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Shield size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[12px] font-bold text-slate-600">
                    Infrastructure Identity
                  </p>
                  <code className="text-[12px] font-sans text-slate-400 truncate">
                    {userData._id}
                  </code>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* 3. Communication Preferences */}
          <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden lg:row-span-2 bg-white h-fit">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Communication Preferences"
                  subtitle="Notification channels and alerts"
                  Icon={Bell}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-5 space-y-3">
              {Object.entries(localNotifications).map(([key, isEnabled]) => (
                <NotificationToggle
                  key={key}
                  icon={notifIcons[key] || Bell}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  desc={notifDescriptions[key] || `Receive ${key} updates`}
                  checked={isEnabled}
                  disabled={!!togglingKey}
                  onChange={() => handleToggleNotification(key, isEnabled)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* 2. Discovery Parameters */}
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white h-fit">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="Discovery Parameters"
                  subtitle="Search and visibility settings"
                  Icon={Search}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-5 space-y-2.5">
              <DiscoveryItem
                icon={<Activity size={16} />}
                label="Age Range"
                value={`${discovery?.ageRange?.min} - ${discovery?.ageRange?.max} years`}
              />
              <DiscoveryItem
                icon={<MapPin size={16} />}
                label="Radius"
                value={`${discovery?.distanceRange} km`}
              />
              <DiscoveryItem
                icon={<Globe size={16} />}
                label="Global Visibility"
                value={
                  discovery?.globalVisibility === "private"
                    ? "Private"
                    : "Everyone (Public)"
                }
              />
            </CardContent>
          </Card>

          {/* 4. Access & Trust */}
          <Card className="border-slate-200 shadow-sm rounded-2xl pb-[7.5rem] overflow-hidden bg-white">
            <CardHeader className="px-5 border-b border-slate-200">
              <div className="flex items-center justify-between pb-4">
                <DashboardHead
                  title="User Contact Information"
                  subtitle="Verified contact details"
                  Icon={Shield}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                />
              </div>
            </CardHeader>
            <CardContent className="px-8 space-y-5">
              <VerificationBox
                icon={<Mail size={16} />}
                type="Primary email"
                value={account.email || "N/A"}
                isVerified={userData.isEmailVerified}
              />
              <VerificationBox
                icon={<Smartphone size={16} />}
                type="Phone connection"
                value={account.phone || "Not linked"}
                isVerified={userData.isPhoneVerified}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Direct Administrative Messaging */}
      <Card className="border border-slate-200 pb-2 gap-0 shadow-sm rounded-2xl overflow-hidden bg-white mb-6">
        <CardHeader className="px-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <DashboardHead
              title="Direct Administrative Messaging"
              subtitle="Dispatch warning letters, policy updates, or direct notifications to this user"
              Icon={Send}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />

            {/* Status Tags */}
            {/* <div className="flex flex-wrap items-center gap-2">
              {account.email ? (
                localNotifications.email !== false ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Email: Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Email: Opted Out
                  </span>
                )
              ) : (
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  Email: No Address
                </span>
              )}

              {localNotifications.push !== false ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Push: Active
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Push: Opted Out
                </span>
              )}
            </div> */}
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Channel Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Channel
                  </label>
                  <Select
                    value={directForm.channel}
                    onValueChange={(val) => setDirectForm((prev) => ({ ...prev, channel: val }))}
                  >
                    <SelectTrigger className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="email" className="py-2.5 px-4 text-xs font-medium text-slate-700 focus:bg-brand-aqua/5 focus:text-brand-aqua rounded-lg cursor-pointer">
                        Email Only
                      </SelectItem>
                      <SelectItem value="push" className="py-2.5 px-4 text-xs font-medium text-slate-700 focus:bg-brand-aqua/5 focus:text-brand-aqua rounded-lg cursor-pointer">
                        Push Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title / Subject Input */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {directForm.channel === "email" ? "Email Subject" : "Notification Title"}
                  </label>
                  <Input
                    placeholder={
                      directForm.channel === "email"
                        ? "e.g., Important account update"
                        : directForm.channel === "push"
                          ? "e.g., Account status update"
                          : "e.g., Urgent notification"
                    }
                    className="h-10 border border-slate-200 rounded-lg text-xs font-medium bg-[#F8FAFC]/50 px-3 focus:bg-white transition-all focus-visible:ring-brand-aqua shadow-none"
                    value={directForm.subject}
                    onChange={(e) => setDirectForm((prev) => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Message Body
                </label>
                <Textarea
                  placeholder={
                    directForm.channel === "email"
                      ? "Write your email content here (HTML supported)..."
                      : "Write your push notification alert here..."
                  }
                  className="min-h-[120px] border border-slate-200 rounded-lg text-xs font-medium bg-[#F8FAFC]/50 p-4 resize-none focus:bg-white transition-all focus-visible:ring-brand-aqua shadow-none"
                  value={directForm.message}
                  onChange={(e) => setDirectForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-start pt-2">
                <Button
                  type="button"
                  onClick={handleSendDirectClick}
                  disabled={directLoading || !directForm.channel || !directForm.subject || !directForm.message}
                  className="h-10 px-5 bg-brand-aqua hover:bg-brand-hoverAqua text-white rounded-lg font-bold text-xs disabled:opacity-95 disabled:cursor-not-allowed shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {directLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Alert</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Live Preview Panel */}
            <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-start min-h-[250px]">
              <div className="w-full mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <span className="text-[10px] font-bold text-brand-aqua bg-brand-aqua/10 px-2 py-0.5 rounded-full capitalize">
                  {directForm.channel === "email" ? "Email" : "Push"}
                </span>
              </div>

              <div className="w-full flex flex-col gap-4 items-center justify-center">
                {/* Mobile Preview */}
                {directForm.channel === "push" && (
                  <div className="w-full max-w-[320px] bg-slate-900 text-white rounded-2xl p-3.5 shadow-lg border border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1.5">
                      <div className="w-4 h-4 bg-brand-aqua rounded flex items-center justify-center text-white font-black text-[8px]">M</div>
                      <span className="font-bold">MAFS Support</span>
                      <span>•</span>
                      <span>now</span>
                    </div>
                    <h4 className="text-[12px] font-bold leading-tight truncate">
                      {directForm.subject || "Notification Title"}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                      {directForm.message || "Notification body text goes here..."}
                    </p>
                  </div>
                )}

                {/* Email Preview */}
                {directForm.channel === "email" && (
                  <div className="w-full max-w-[320px] bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden text-slate-800">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                      <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span className="text-[9px] font-bold text-slate-400 ml-auto truncate max-w-[150px]">
                        Subject: {directForm.subject || "(No Subject)"}
                      </span>
                    </div>
                    <div className="p-3.5 min-h-[100px] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[11px] border-b border-slate-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-brand-aqua flex items-center justify-center text-white font-black text-[9px]">M</div>
                        <div>
                          <p className="font-bold text-[10px] leading-tight">Keen as mustard Support</p>
                          <p className="text-[9px] text-slate-400">support@keenasmustard.com.au</p>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed font-normal">
                        {directForm.message || "Email body content goes here..."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Messaging Confirmation Modal */}
      <ConfirmModal
        isOpen={directConfirmOpen}
        onClose={() => {
          if (directLoading || directSuccess) return;
          setDirectConfirmOpen(false);
        }}
        onConfirm={executeSendDirect}
        title="Confirm Direct Message Dispatch"
        type="brand"
        confirmText="Yes, Dispatch Now"
        loading={directLoading}
        success={directSuccess}
        message={
          <>
            Are you sure you want to dispatch this administrative message directly to{" "}
            <strong className="text-brand-aqua font-bold">
              {profile?.nickname || "User"}
            </strong>{" "}
            via{" "}
            <strong className="text-slate-700 font-bold">
              {directForm.channel === "email"
                ? "Email Only"
                : "Push Notification Only"}
            </strong>?
          </>
        }
      />

      {/* 6. PRIVACY & RESTRICTIONS */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl pb-3 gap-4 overflow-hidden lg:col-span-2 bg-white">
        <CardHeader className="px-5 border-b border-slate-200">
          <div className="flex items-center justify-between pb-3">
            <DashboardHead
              title="Restricted Access"
              subtitle="Users and contacts blocked from discovery"
              Icon={IconShieldLock}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Blocked Profiles Table */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Blocked Profiles
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-slate-100/50 rounded-xl border border-slate-200 text-slate-800 text-[8px] font-semibold"
                >
                  {settings.blockedUsers?.length || 0} Users
                </Badge>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="">
                  <Table className="border-separate border-spacing-0">
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="w-[15%] text-[10px] pr-0 font-bold uppercase py-2.5 h-auto text-center border-b border-slate-200">
                          SR.No
                        </TableHead>
                        <TableHead className="w-[32%] text-[10px] font-bold uppercase py-2.5 text-start h-auto border-b border-slate-200">
                          User
                        </TableHead>
                        <TableHead className="w-[32%] text-[10px] font-bold uppercase py-2.5 h-auto border-b border-slate-200">
                          Phone
                        </TableHead>
                        <TableHead className="w-[20%] text-[10px] font-bold uppercase py-2.5 h-auto text-center border-b border-slate-200">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBlockedUsers?.length > 0 ? (
                        paginatedBlockedUsers.map((user, index) => (
                          <TableRow
                            key={user._id}
                            className="border-slate-100 even:bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/admin/management/users-management/view-profile`,
                                { state: { userId: user._id } },
                              )
                            }
                          >
                            <TableCell className="py-2.5 text-center">
                              {(blockedUsersPage - 1) * itemsPerPage +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="py-2.5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-white shrink-0">
                                  {user.photo ? (
                                    <img
                                      src={user.photo}
                                      alt={user.nickname}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                      {user.nickname?.charAt(0) || "?"}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-bold text-slate-700 leading-tight">
                                    {user.nickname || "Anonymous"}
                                  </span>
                                  <span className="text-[9px] font-medium text-slate-400">
                                    {user.email || "No Email"}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-2.5">
                              <span className="text-[10px] font-medium text-slate-500">
                                {user.phone || "No Phone"}
                              </span>
                            </TableCell>
                            <TableCell className="py-2.5 text-center">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/management/users-management/view-profile`,
                                    { state: { userId: user._id } },
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white hover:bg-brand-aqua/5 text-foreground/60 hover:text-brand-aqua border hover:border-brand-aqua/50 transition-all group"
                              >
                                <IconEye size={12} strokeWidth={1.5} />
                                <span className="text-[9px] font-medium capitalize tracking-wider">
                                  View
                                </span>
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <p className="text-xs text-slate-400 italic font-medium">
                              No blocked profiles
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* PAGINATION FOR BLOCKED PROFILES */}
              {totalBlockedUsersPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Showing{" "}
                    {(blockedUsersPage - 1) * itemsPerPage +
                      (paginatedBlockedUsers.length > 0 ? 1 : 0)}
                    -
                    {Math.min(
                      blockedUsersPage * itemsPerPage,
                      settings.blockedUsers?.length || 0,
                    )}{" "}
                    of {settings.blockedUsers?.length || 0} results
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-none"
                      onClick={() =>
                        setBlockedUsersPage((p) => Math.max(1, p - 1))
                      }
                      disabled={blockedUsersPage === 1}
                    >
                      <IconChevronLeft size={14} />
                    </Button>
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const pages = [];
                        if (totalBlockedUsersPages <= 7) {
                          for (let i = 1; i <= totalBlockedUsersPages; i++)
                            pages.push(i);
                        } else {
                          if (blockedUsersPage <= 3)
                            pages.push(
                              1,
                              2,
                              3,
                              4,
                              "...",
                              totalBlockedUsersPages,
                            );
                          else if (
                            blockedUsersPage >=
                            totalBlockedUsersPages - 2
                          )
                            pages.push(
                              1,
                              "...",
                              totalBlockedUsersPages - 3,
                              totalBlockedUsersPages - 2,
                              totalBlockedUsersPages - 1,
                              totalBlockedUsersPages,
                            );
                          else
                            pages.push(
                              1,
                              "...",
                              blockedUsersPage - 1,
                              blockedUsersPage,
                              blockedUsersPage + 1,
                              "...",
                              totalBlockedUsersPages,
                            );
                        }
                        return pages.map((page, idx) => {
                          if (page === "...")
                            return (
                              <span
                                key={`dots-${idx}`}
                                className="px-1 text-slate-400 text-xs font-bold"
                              >
                                ...
                              </span>
                            );
                          const isActive = blockedUsersPage === page;
                          return (
                            <Button
                              key={page}
                              onClick={() => setBlockedUsersPage(page)}
                              className={cn(
                                "h-7 w-7 text-[10px] font-bold rounded-lg transition-all",
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-none"
                      onClick={() =>
                        setBlockedUsersPage((p) =>
                          Math.min(totalBlockedUsersPages, p + 1),
                        )
                      }
                      disabled={
                        blockedUsersPage === totalBlockedUsersPages ||
                        totalBlockedUsersPages === 0
                      }
                    >
                      <IconChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Blocked Contacts Table */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Blocked Contacts
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-slate-100/50 rounded-xl border border-slate-200 text-slate-800 text-[8px] font-semibold"
                >
                  {settings.blockedContacts?.length || 0} Contacts
                </Badge>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="">
                  <Table className="border-separate border-spacing-0">
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="w-[15%] text-[10px] pr-0 font-bold uppercase py-2.5 h-auto text-center border-b border-slate-200">
                          SR.No
                        </TableHead>
                        <TableHead className="w-[32%] text-[10px] font-bold uppercase py-2.5 h-auto text-start border-b border-slate-200">
                          Name
                        </TableHead>
                        <TableHead className="w-[32%] text-[10px] font-bold uppercase py-2.5 h-auto text-start border-b border-slate-200">
                          Phone
                        </TableHead>
                        <TableHead className="w-[20%] text-[10px] font-bold uppercase py-2.5 h-auto text-start border-b border-slate-200">
                          Source
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBlockedContacts?.length > 0 ? (
                        paginatedBlockedContacts.map((contact, idx) => (
                          <TableRow
                            key={idx}
                            className="border-slate-100 even:bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer"
                          >
                            <TableCell className="py-3 text-center w-[15%]">
                              {(blockedContactsPage - 1) * itemsPerPage +
                                idx +
                                1}
                            </TableCell>
                            <TableCell className="py-3 w-[30%]">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-brand-aqua" />
                                <span className="text-[11px] font-bold text-slate-700 truncate">
                                  {contact.blockedName || "-"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 w-[30%]">
                              <span className="text-[10px] text-slate-400 font-medium">
                                {contact.blockedPhone || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 w-[30%]">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold capitalize text-green-700 bg-green-100 border border-green-200">
                                {contact.source || "-"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <p className="text-xs text-slate-400 italic font-medium">
                              No contacts blocked
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* PAGINATION FOR BLOCKED CONTACTS */}
              {totalBlockedContactsPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Showing{" "}
                    {(blockedContactsPage - 1) * itemsPerPage +
                      (paginatedBlockedContacts.length > 0 ? 1 : 0)}
                    -
                    {Math.min(
                      blockedContactsPage * itemsPerPage,
                      settings.blockedContacts?.length || 0,
                    )}{" "}
                    of {settings.blockedContacts?.length || 0} results
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-none"
                      onClick={() =>
                        setBlockedContactsPage((p) => Math.max(1, p - 1))
                      }
                      disabled={blockedContactsPage === 1}
                    >
                      <IconChevronLeft size={14} />
                    </Button>
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const pages = [];
                        if (totalBlockedContactsPages <= 7) {
                          for (let i = 1; i <= totalBlockedContactsPages; i++)
                            pages.push(i);
                        } else {
                          if (blockedContactsPage <= 3)
                            pages.push(
                              1,
                              2,
                              3,
                              4,
                              "...",
                              totalBlockedContactsPages,
                            );
                          else if (
                            blockedContactsPage >=
                            totalBlockedContactsPages - 2
                          )
                            pages.push(
                              1,
                              "...",
                              totalBlockedContactsPages - 3,
                              totalBlockedContactsPages - 2,
                              totalBlockedContactsPages - 1,
                              totalBlockedContactsPages,
                            );
                          else
                            pages.push(
                              1,
                              "...",
                              blockedContactsPage - 1,
                              blockedContactsPage,
                              blockedContactsPage + 1,
                              "...",
                              totalBlockedContactsPages,
                            );
                        }
                        return pages.map((page, idx) => {
                          if (page === "...")
                            return (
                              <span
                                key={`dots-${idx}`}
                                className="px-1 text-slate-400 text-xs font-bold"
                              >
                                ...
                              </span>
                            );
                          const isActive = blockedContactsPage === page;
                          return (
                            <Button
                              key={page}
                              onClick={() => setBlockedContactsPage(page)}
                              className={cn(
                                "h-7 w-7 text-[10px] font-bold rounded-lg transition-all",
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-none"
                      onClick={() =>
                        setBlockedContactsPage((p) =>
                          Math.min(totalBlockedContactsPages, p + 1),
                        )
                      }
                      disabled={
                        blockedContactsPage === totalBlockedContactsPages ||
                        totalBlockedContactsPages === 0
                      }
                    >
                      <IconChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

const SettingRow = ({ icon, label, value, valueClass }) => (
  <div className="flex items-center justify-between py-2.5 group">
    <div className="flex items-center gap-4">
      <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
    </div>
    <div
      className={cn(
        "text-[13px] font-bold capitalize",
        valueClass || "text-slate-600",
      )}
    >
      {value}
    </div>
  </div>
);

const DiscoveryItem = ({ icon, label, value, capitalize }) => (
  <div className="group flex items-center justify-between p-4 bg-slate-100/50 rounded-xl border border-slate-100/50">
    <div className="flex items-center gap-4">
      <div className="p-1.5 bg-slate-100/50 rounded-full text-slate-500 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <p className="text-[13px] font-bold text-slate-400">{label}</p>
    </div>
    <p
      className={cn(
        "text-sm font-semibold capitalize",
        capitalize && "capitalize",
      )}
    >
      {value}
    </p>
  </div>
);

const NotificationToggle = ({
  icon: Icon,
  label,
  desc,
  checked,
  disabled,
  onChange,
}) => (
  <div className="flex items-center justify-between py-2 group transition-colors">
    <div className="flex items-center gap-4">
      <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-slate-600">{label}</p>
        <p className="text-[12px] text-secondary-foreground font-medium">
          {desc}
        </p>
      </div>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className="data-[state=checked]:bg-brand-aqua scale-90"
    />
  </div>
);

const VerificationBox = ({ icon, type, value, isVerified }) => (
  <div className="group flex items-center justify-between py-2">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-200/50 rounded-full text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-[12px] uppercase font-medium text-slate-400">
          {type}
        </p>
        <p className="text-[13px] text-foreground/80 font-bold">{value}</p>
      </div>
    </div>
    <div
      className={`group flex items-center border gap-1.5 px-3 py-1 rounded-xl cursor-pointer ${isVerified
        ? "border-emerald-200 group-hover:border-emerald-400"
        : "border-rose-200 group-hover:border-rose-400"
        }`}
    >
      <CheckCircle2
        size={12}
        className={isVerified ? "text-green-600" : "text-rose-500 "}
      />
      <span
        className={cn(
          "text-[10px] font-bold tracking-wider",
          isVerified
            ? "text-green-600 group-hover:text-green-600"
            : "text-rose-500 group-hover:text-rose-600",
        )}
      >
        {isVerified ? "VERIFIED" : "PENDING"}
      </span>
    </div>
  </div>
);
