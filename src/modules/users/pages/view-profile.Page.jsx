import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IconSettings,
  IconHistory,
  IconLock,
  IconAlertTriangle,
  IconUserOff,
  IconTrash,
  IconStarFilled,
} from "@tabler/icons-react";
import { MdOutlineDateRange } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabData } from "@/app/data/tabs.data";
import { ProfileTab } from "../components/Tabs/profile.Tab";
import { GallleryTab } from "../components/Tabs/galllery.Tab";
import { DiscoveryTab } from "../components/Tabs/discovery.Tab";
import { ActivityTab } from "../components/Tabs/activity.Tab";
import { FinancialsTab } from "../components/Tabs/financials.Tab";
import { SettingsTab } from "../components/Tabs/settings.Tab";
import Loader from "@/components/common/Loader";
import { AdminResourceNotFound } from "@/components/common/AdminResourceNotFound";
import { AttributesTab } from "../components/Tabs/attributes.Tab";
import { ManageAccountDialog } from "../components/Dialogs/manage.account.dialog";
import { LiftRestrictionDialog } from "../components/Dialogs/lift.restriction.dialog";
import { AuditLogDialog } from "../components/Dialogs/audit.log.dialog";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  clearSelectedUser,
  fetchUserData,
  unbanUserProfile,
  unsuspendUserProfile,
  updateUserProfile,
} from "../store/user.slice";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import dummyImg from "@/assets/web/dummyImg.webp";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/common/container";

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

export default function ViewProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [copied, setCopied] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isLiftRestrictionDialogOpen, setIsLiftRestrictionDialogOpen] =
    useState(false);
  const [isAuditLogDialogOpen, setIsAuditLogDialogOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [pendingReason, setPendingReason] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [liftSuccess, setLiftSuccess] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, src: null });

  // 1. Get the userId from the navigation state
  const userId = location.state?.userId;

  // 2. Select the user from Redux
  const {
    items,
    user: reduxUser,
    userLoading,
  } = useSelector((state) => state.users);

  const user = React.useMemo(() => {
    if (reduxUser && reduxUser._id === userId) return reduxUser;
    return items?.find((u) => u._id === userId);
  }, [reduxUser, items, userId]);

  // 3. Trigger API Call & Cleanup
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData(userId));
    }

    // Cleanup: Clear the previous user so the next person's profile
    // doesn't show old data for a split second
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [userId, dispatch]);

  const handleCopy = async () => {
    if (!user?._id) return;
    try {
      await navigator.clipboard.writeText(user._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("User ID Copied");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleLiftRestriction = (reason) => {
    setPendingReason(reason);
    setIsLiftRestrictionDialogOpen(false);
    setIsConfirmModalOpen(true);
  };

  const onConfirmLift = async () => {
    setIsActionLoading(true);
    setLiftSuccess(false);
    try {
      const status = user?.account?.status;
      const userId = user._id;

      if (status === "banned") {
        await dispatch(
          unbanUserProfile({ userId, reason: pendingReason }),
        ).unwrap();
      } else if (status === "suspended") {
        await dispatch(
          unsuspendUserProfile({ userId, reason: pendingReason }),
        ).unwrap();
      } else if (status === "deactivated") {
        await dispatch(
          updateUserProfile({
            userId,
            accountStatus: "active",
            account: { status: "active" },
          }),
        ).unwrap();
      } else if (status === "deleted") {
        await dispatch(
          updateUserProfile({
            userId,
            isScheduledForDeletion: false,
            accountStatus: "active",
            account: { status: "active" },
          }),
        ).unwrap();
      }

      toast.success("Restriction Lifted", {
        description: `The account is now active.`,
      });
      setLiftSuccess(true);
      setIsActionLoading(false);
      await dispatch(fetchUserData(userId));
      setTimeout(() => {
        setIsConfirmModalOpen(false);
        setLiftSuccess(false);
      }, 1500);
    } catch (error) {
      setIsActionLoading(false);
      setLiftSuccess(false);
      toast.error(error || "Action failed");
    }
  };

  // 4. Loading State
  const isProfileLoading = userLoading && (!user || user._id !== userId);
  if (isProfileLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader width={200} height={200} />
      </div>
    );
  }

  // 5. Handle "No User Found" state
  if (!user) {
    return (
      <AdminResourceNotFound
        title="User Not Found"
        description="The profile you are looking for does not exist or has been removed from our system."
        icon={IconUserOff}
        backLabel="Back to User Management"
        backPath="/admin/management/users-management"
      />
    );
  }

  // 6. NOW it is safe to destructure because we know 'user' exists
  const {
    reports,
    profile,
    account,
    security,
    attributes,
    discovery,
    location: userLoc,
    photos,
    verification,
    stats,
    recentMatches,
    transactions,
    subscription,
    auditLogs,
    lastProfileUpdate,
  } = user;

  return (
    <>
      <Container>
        <motion.div
          className="space-y-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Navigation Bar */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <Link
                to={location.state?.from || "/admin/management/users-management"}
                state={location.state?.returnState}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
                <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                  User Directory
                </span>
                <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
                  /
                </span>
                <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
                  {profile?.nickname || "Profile View"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={handleCopy}
                className="group flex items-center gap-2 bg-white text-[10px] font-semibold text-muted-foreground px-3 py-1.5 rounded-md border border-slate-200 transition-all active:scale-95 shadow-sm hover:border-brand-aqua/30 max-w-[130px] sm:max-w-none"
              >
                <span className="text-brand-aqua/60 shrink-0">ID:</span>
                <span className="truncate">{user._id}</span>
              </button>
            </div>
          </header>

          <div className="w-full py-5 mx-auto space-y-6 animate-in fade-in duration-500">
            {/* User Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-shadow">
              <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
                {/* Avatar & Info Row */}
                <div className="flex flex-row items-center gap-5 sm:gap-6 flex-1 w-full">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-brand-aqua/10 rounded-full blur-xl opacity-50" />
                    <Avatar
                      className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-sm relative z-10 cursor-pointer hover:ring-4 hover:ring-brand-aqua/30 transition-all duration-200"
                      onClick={() => {
                        const imgSrc = photos?.[0]?.url || null;
                        if (imgSrc) {
                          setImageModal({ open: true, src: imgSrc });
                        }
                      }}
                    >
                      <AvatarImage
                        src={photos?.[0]?.url || dummyImg}
                        alt={profile?.nickname}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-slate-50 text-slate-400 text-2xl sm:text-3xl font-black">
                        {profile?.nickname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl capitalize font-bold text-slate-900 truncate">
                        {profile?.nickname || "Unknown"},{" "}
                        <span className="text-foreground/60 font-medium text-base sm:text-lg">
                          {profile?.age ? profile?.age : "-"}
                        </span>
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-xl px-2 py-0.5 text-[9px] sm:text-[10px] font-bold capitalize",
                            account?.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : account?.status === "suspended"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : account?.status === "banned"
                                  ? "bg-rose-50 text-rose-600 border-rose-100"
                                  : "bg-slate-50 text-slate-600 border-slate-100",
                          )}
                        >
                          {account?.status}
                        </Badge>
                        {account?.isPremium || subscription?.isCurrentlyActive ? (
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
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-xs text-slate-600">
                      {/* Joined Date */}
                      <div className="flex items-center gap-1 text-secondary-foreground/70 font-medium">
                        <MdOutlineDateRange className="h-3.5 w-3.5" />
                        <span>Joined:</span>
                        <span className="text-secondary-foreground">
                          {account?.createdAt
                            ? format(
                              new Date(account?.createdAt),
                              "dd MMM, yyyy",
                            )
                            : "-"}
                        </span>
                      </div>

                      {/* Last Update Date */}
                      <div className="flex items-center gap-1 font-medium text-secondary-foreground/70">
                        <IconHistory className="h-3.5 w-3.5" />
                        <span>Updated:</span>
                        <span className="text-secondary-foreground">
                          {lastProfileUpdate
                            ? format(
                              new Date(lastProfileUpdate),
                              "dd MMM, yyyy",
                            )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons - Bottom on Tablet, Right on Laptop */}
                <div className="flex flex-row sm:items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsAuditLogDialogOpen(true)}
                    className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
                  >
                    <IconHistory className="mr-2 h-4 w-4 text-slate-400" />
                    Audit Log
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsManageDialogOpen(true)}
                    className="flex-1 lg:flex-none h-10 px-4 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
                  >
                    <IconSettings className="mr-2 h-4 w-4 text-slate-400" />
                    Manage Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Notice - Bento Style */}
            {(account?.status === "banned" ||
              account?.status === "suspended" ||
              account?.status === "deactivated" ||
              account?.status === "deleted") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-2 rounded-2xl border p-4 sm:p-6 flex flex-col gap-4 transition-all shadow-sm",
                    account?.status === "banned" &&
                    "bg-rose-50/50 border-rose-200",
                    account?.status === "suspended" &&
                    "bg-amber-50/50 border-amber-200",
                    account?.status === "deactivated" &&
                    "bg-slate-50/50 border-slate-200",
                    account?.status === "deleted" &&
                    "bg-zinc-50/50 border-zinc-200",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Icon & Text */}
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="bg-white border border-slate-200 shadow-sm p-3 rounded-2xl shrink-0 h-fit">
                        {account?.status === "banned" && (
                          <IconLock
                            className="w-6 h-6 text-rose-500"
                            stroke={2.5}
                          />
                        )}
                        {account?.status === "suspended" && (
                          <IconAlertTriangle
                            className="w-6 h-6 text-amber-500"
                            stroke={2.5}
                          />
                        )}
                        {account?.status === "deactivated" && (
                          <IconUserOff
                            className="w-6 h-6 text-slate-500"
                            stroke={2.5}
                          />
                        )}
                        {account?.status === "deleted" && (
                          <IconTrash
                            className="w-6 h-6 text-rose-500"
                            stroke={2.5}
                          />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 leading-none">
                          {account?.status === "banned" &&
                            "Account Banned Permanently"}
                          {account?.status === "suspended" &&
                            "Account Suspended Temporarily"}
                          {account?.status === "deactivated" &&
                            "Account Deactivated"}
                          {account?.status === "deleted" &&
                            "Account Scheduled for Deletion"}
                        </h3>
                        <p className="text-sm italic text-slate-500 max-w-4xl break-words whitespace-pre-wrap">
                          "
                          {account?.status === "banned" &&
                            (account?.banDetails?.reason ||
                              "Violations of community guidelines.")}
                          {account?.status === "suspended" &&
                            (account?.suspensionDetails?.reason ||
                              "Suspicious login attempts detected.")}
                          {account?.status === "deactivated" &&
                            (account?.deactivationDetails?.reason ||
                              "User requested deactivation.")}
                          {account?.status === "deleted" &&
                            (account?.deletionDetails?.reason ||
                              "Account marked for permanent deletion.")}
                          "
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:self-center shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setIsLiftRestrictionDialogOpen(true)}
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold h-11 px-6 rounded-xl shadow-sm border-slate-200 text-xs transition-all active:scale-95"
                      >
                        {account?.status === "banned" && "Revoke Ban"}
                        {account?.status === "suspended" && "Lift Suspension"}
                        {account?.status === "deactivated" &&
                          "Reactivate Account"}
                        {account?.status === "deleted" && "Cancel Deletion"}
                      </Button>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "h-px w-full",
                      account?.status === "banned" && "bg-rose-200/50",
                      account?.status === "suspended" && "bg-amber-200/50",
                      account?.status === "deactivated" && "bg-slate-200/50",
                      account?.status === "deleted" && "bg-zinc-200/50",
                    )}
                  />

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px]">
                    {/* Common Metadata for Banned/Suspended */}
                    {(account?.status === "banned" ||
                      account?.status === "suspended") && (
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Restricted By:{" "}
                          <span className="font-bold text-slate-700">
                            {account?.status === "banned"
                              ? account?.banDetails?.bannedByName || "System Auth"
                              : account?.suspensionDetails?.suspendedByName ||
                              "System Auth"}
                          </span>
                        </div>
                      )}

                    {account?.status === "banned" && (
                      <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                        Banned On:{" "}
                        <span className="font-bold text-slate-700">
                          {account?.banDetails?.bannedAt
                            ? format(
                              new Date(account.banDetails.bannedAt),
                              "dd MMM, yyyy",
                            )
                            : "-"}
                        </span>
                      </div>
                    )}

                    {account?.status === "suspended" && (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Suspended On:{" "}
                          <span className="font-bold text-slate-700">
                            {account?.suspensionDetails?.suspendedAt
                              ? format(
                                new Date(account.suspensionDetails.suspendedAt),
                                "dd MMM, yyyy",
                              )
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Expires On:{" "}
                          <span className="font-bold text-amber-600">
                            {account?.suspensionDetails?.suspendUntil
                              ? format(
                                new Date(
                                  account.suspensionDetails.suspendUntil,
                                ),
                                "dd MMM, yyyy",
                              )
                              : "-"}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Deactivated Metadata */}
                    {account?.status === "deactivated" && (
                      <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                        Deactivated At:{" "}
                        <span className="font-bold text-slate-700">
                          {account?.deactivationDetails?.deactivatedAt
                            ? format(
                              new Date(
                                account.deactivationDetails.deactivatedAt,
                              ),
                              "dd MMM, yyyy",
                            )
                            : "-"}
                        </span>
                      </div>
                    )}

                    {/* Deleted Metadata */}
                    {account?.status === "deleted" && (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Scheduled At:{" "}
                          <span className="font-bold text-slate-700">
                            {account?.deletionDetails?.scheduledAt
                              ? format(
                                new Date(account.deletionDetails.scheduledAt),
                                "dd MMM, yyyy",
                              )
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Deletion Date:{" "}
                          <span className="font-bold text-rose-600">
                            {account?.deletionDetails?.deletionDate
                              ? format(
                                new Date(account.deletionDetails.deletionDate),
                                "dd MMM, yyyy",
                              )
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
                          Remaining:{" "}
                          <span className="font-bold text-rose-600">
                            {account?.deletionDetails?.daysRemaining !== null
                              ? `${account.deletionDetails.daysRemaining} Days`
                              : "-"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
          </div>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="w-full mb-8">
              {/* Desktop/Laptop Tab List */}
              <TabsList className="hidden lg:flex items-center justify-between gap-1 p-1 bg-white backdrop-blur-md rounded-lg w-full border border-slate-200 h-auto overflow-x-auto flex-nowrap shadow-sm">
                {TabData.map((t) => {
                  const isActive = activeTab === t.value;
                  return (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className={cn(
                        "relative flex items-center gap-2 px-11 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg border-none shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-brand-aqua text-slate-500 hover:text-slate-700",
                      )}
                    >
                      <t.icon
                        className={cn(
                          "w-4 h-4 relative z-10",
                          isActive ? "text-white" : "text-foreground/70",
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span
                        className={`hidden sm:inline relative z-10 ${isActive ? "text-white" : "text-foreground/70"}`}
                      >
                        {t.label}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeTabProfile"
                          className="absolute inset-0 bg-brand-aqua rounded-lg"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tablet/Mobile Select Dropdown */}
              <div className="lg:hidden w-full">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full h-10 bg-white border border-slate-200 rounded-md px-4 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    {TabData.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="py-3 px-4 text-sm font-semibold text-slate-600 focus:bg-brand-aqua/5 focus:text-brand-aqua rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <t.icon className="w-4 h-4" />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <TabsContent value="profile">
                <ProfileTab
                  reports={reports}
                  security={security}
                  stats={stats}
                  userData={user}
                  photos={photos}
                  profile={profile}
                  userLoc={userLoc}
                  account={account}
                  discovery={discovery}
                  attributes={attributes}
                  verification={verification}
                />
              </TabsContent>

              <TabsContent value="gallery">
                <GallleryTab photos={photos} userId={user._id} />
              </TabsContent>

              <TabsContent value="attributes">
                <AttributesTab userData={user} attributes={attributes} />
              </TabsContent>

              <TabsContent value="discovery">
                <DiscoveryTab discovery={discovery} attributes={attributes} />
              </TabsContent>

              <TabsContent value="activity">
                <ActivityTab stats={stats} recentMatches={recentMatches} />
              </TabsContent>

              <TabsContent value="financials">
                <FinancialsTab
                  userData={user}
                  account={account}
                  transactions={transactions}
                  subscription={subscription}
                />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab userData={user} account={account} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </Container>

      <ManageAccountDialog
        isOpen={isManageDialogOpen}
        onOpenChange={setIsManageDialogOpen}
        userData={user}
      />

      <LiftRestrictionDialog
        isOpen={isLiftRestrictionDialogOpen}
        onOpenChange={setIsLiftRestrictionDialogOpen}
        onConfirm={handleLiftRestriction}
        userName={profile?.nickname || "User"}
        type={account?.status}
      />

      <AuditLogDialog
        isOpen={isAuditLogDialogOpen}
        onOpenChange={setIsAuditLogDialogOpen}
        logs={auditLogs || []}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          if (isActionLoading || liftSuccess) return;
          setIsConfirmModalOpen(false);
        }}
        onConfirm={onConfirmLift}
        loading={isActionLoading}
        success={liftSuccess}
        title="Confirm Lift Restriction"
        message={`Are you sure you want to lift the ${user?.account?.status} from ${profile?.nickname || "this user"}? This will restore their full access.`}
        confirmText="Yes, Lift Restriction"
        type="brand"
      />
      <Dialog
        open={imageModal.open}
        onOpenChange={(open) => setImageModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center">
          <DialogHeader className="sr-only">
            <DialogTitle>Profile Photo Preview</DialogTitle>
          </DialogHeader>
          <img
            src={imageModal.src || dummyImg}
            className="max-w-full max-h-[90vh] object-contain"
            alt={`${profile?.nickname}'s Profile Photo`}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
