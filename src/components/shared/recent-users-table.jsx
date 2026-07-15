import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   bannedUserProfile,
//   fetchUsers,
//   suspendUserProfile,
//   unbanUserProfile,
//   unsuspendUserProfile,
// } from "@/modules/users/store/user.slice";
// import { fetchDashboardData, fetchDashboardKPIs } from "@/modules/dashboard/store/dashboard.slice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosArrowForward } from "react-icons/io";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dummyImg from "@/assets/web/dummyImg.webp";
import {
  Eye,
  MoreHorizontal,
  Ban,
  UserCheck,
  CirclePause,
  Unlock,
} from "lucide-react";
import DashboardHead from "./dashboard.head";
import { Button } from "../ui/button";
import { RiUserAddLine } from "react-icons/ri";
import { IconStarFilled } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { UserActionModal } from "@/modules/users/components/UserActionModal";

import { toast } from "sonner";

const STATUS_STYLES = {
  active: {
    bg: "bg-emerald-500/10 text-emerald-600 border-emerald-100/50",
    dot: "bg-emerald-500",
  },
  pending: {
    bg: "bg-amber-100 text-amber-700 border-amber-100/50",
    dot: "bg-amber-500",
  },
  banned: {
    bg: "bg-red-500/10 text-red-600 border-red-100/50",
    dot: "bg-red-500",
  },
  suspended: {
    bg: "bg-amber-500/10 text-amber-600 border-amber-100/50",
    dot: "bg-amber-500",
  },
  deactivated: {
    bg: "bg-slate-500/10 text-slate-600 border-slate-100/50",
    dot: "bg-slate-400",
  },
};

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-blue-500",
];

const getInitials = (nickname) => {
  return nickname?.trim().charAt(0).toUpperCase() || "?";
};

const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const formatDateSafe = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "-" : format(date, "dd MMM yyyy");
};

export function RecentUsersTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const { items, loading } = useSelector((state) => state.users);
  // const dashboardState = useSelector((state) => state.dashboard);
  const items = [];
  const loading = false;

  const refreshDashboard = () => {
    // if (!dashboardState) return;
    const dateObj = { preset: "today" };
    const preset = dateObj?.preset || "today";
    const apiParams = {
      preset,
      from: dateObj?.from ? format(new Date(dateObj.from), "yyyy-MM-dd") : null,
      to: dateObj?.to ? format(new Date(dateObj.to), "yyyy-MM-dd") : null,
    };
    const serializableDate = {
      ...dateObj,
      from: dateObj?.from ? new Date(dateObj.from).toISOString() : null,
      to: dateObj?.to ? new Date(dateObj.to).toISOString() : null,
    };
    dispatch(fetchDashboardData(serializableDate));
    dispatch(fetchDashboardKPIs(apiParams));
  };

  // Consolidated Modal State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: "ban",
    user: null,
  });

  // Image preview modal state
  const [imageModal, setImageModal] = useState({
    open: false,
    src: null,
    title: "Profile Photo",
    userName: "",
  });

  useEffect(() => {
    // dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleActionClick = (e, type, user) => {
    e.stopPropagation();
    setActionModal({ isOpen: true, type, user });
  };

  const handleActionConfirm = async (arg1, arg2) => {
    try {
      if (actionModal.type === "ban") {
        const reason = arg1;
        const category = arg2 || "Administrative";
        // await dispatch(
        //   bannedUserProfile({
        //     userId: actionModal.user?._id,
        //     category,
        //     reason,
        //   }),
        // ).unwrap();
        toast.success("User has been banned");
      } else if (actionModal.type === "suspend") {
        const reason = arg1;
        const duration = arg2;
        // await dispatch(
        //   suspendUserProfile({
        //     userId: actionModal.user?._id,
        //     reason,
        //     durationHours: Number(duration),
        //   }),
        // ).unwrap();
        toast.success("User Suspended", {
          description: `Access restricted for ${duration} hours.`,
        });
      } else if (actionModal.type === "unban") {
        const reason = arg1;
        // await dispatch(
        //   unbanUserProfile({
        //     userId: actionModal.user?._id,
        //     category: "Administrative",
        //     reason,
        //   }),
        // ).unwrap();
        toast.success("User account activated");
      } else if (actionModal.type === "unsuspend") {
        const reason = arg1;
        // await dispatch(
        //   unsuspendUserProfile({
        //     userId: actionModal.user?._id,
        //     category: "Administrative",
        //     reason,
        //   }),
        // ).unwrap();
        toast.success("User suspension lifted");
      }
      refreshDashboard();
      setActionModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error(error || "Action failed");
    }
  };

  const recentUsers = useMemo(() => {
    return [...(items || [])]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
        const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
        return timeB - timeA;
      })
      .slice(0, 10);
  }, [items]);

  return (
    <>
      <Card className="rounded-xl shadow-sm gap-4 pb-2 bg-white border border-slate-200 hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col h-full">
        <CardHeader className="px-5">
          <div className="flex items-center justify-between">
            <DashboardHead
              title="Recent Joined Users"
              subtitle="Monitor the latest member registrations"
              Icon={RiUserAddLine}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/management/users-management")}
              className={cn(
                "relative h-9 p-3 rounded-md shadow-sm text-slate-400 hover:text-white border border-slate-200 hover:bg-brand-hoverBlue transition-all duration-300 group overflow-hidden",
              )}
            >
              <div className="relative flex items-center justify-center">
                <span className="text-[11px] font-semibold">View all</span>
                <IoIosArrowForward size={16} className="ml-1 h-4 w-4" />
              </div>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="block bg-white overflow-hidden border-t border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="hover:bg-transparent border-slate-200">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-4">
                    Sr.No
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-4">
                    User
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-2">
                    Phone
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-2">
                    Email
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-5">
                    Age
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-1.5">
                    Gender
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-1">
                    Completion
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-5">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-6">
                    Plan
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-1">
                    Location
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-4 whitespace-nowrap text-center">
                    Joined Date
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 h-10 px-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(12)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-slate-50">
                      <TableCell className="py-2.5 px-6">
                        <div className="h-3 w-4 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full animate-pulse shrink-0" />
                          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2 text-center">
                        <div className="h-3 w-6 bg-slate-100 rounded animate-pulse mx-auto" />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex flex-col gap-1.5 min-w-[80px]">
                          <div className="h-3 w-8 bg-slate-100 rounded animate-pulse" />
                          <div className="h-1.5 w-full bg-slate-100/50 rounded-full animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell className="p-2 px-5">
                        <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2 px-5 text-center">
                        <div className="h-5 w-12 bg-slate-100 rounded-full animate-pulse mx-auto" />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-2 text-center">
                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse mx-auto" />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentUsers.length > 0 ? (
                  recentUsers.map((user, idx) => {
                    const status = user.account?.status;
                    const completion = user.profile?.totalCompletion ?? 0;
                    const nickname = user.profile?.nickname || "unknown";

                    return (
                      <TableRow
                        key={user._id}
                        onClick={() =>
                          navigate(
                            "/admin/management/users-management/view-profile",
                            {
                              state: {
                                userId: user._id,
                                from: location.pathname || "/admin/dashboard",
                              },
                            },
                          )
                        }
                        className="even:bg-slate-50/30 hover:bg-slate-50/80 transition-colors cursor-pointer group border-slate-200 last:border-0"
                      >
                        <TableCell className="py-2.5 px-6 text-xs font-semibold text-slate-500">
                          {idx + 1}
                        </TableCell>
                        {/* User */}
                        <TableCell className="p-2">
                          <div
                            className="flex items-center gap-3 w-36"
                            title={nickname}
                          >
                            <Avatar
                              className="h-8 w-8 border border-slate-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-blue transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                const photoUrl = Array.isArray(user?.photos)
                                  ? user.photos[0]?.url || user?.photos
                                  : user?.photos;
                                const imgSrc =
                                  photoUrl ||
                                  user.avatar?.url ||
                                  user.avatar ||
                                  null;
                                if (imgSrc) {
                                  setImageModal({
                                    open: true,
                                    src: imgSrc,
                                    title: `${nickname}'s Profile Photo`,
                                    userName: nickname,
                                  });
                                }
                              }}
                            >
                              <AvatarImage
                                src={
                                  Array.isArray(user.photos)
                                    ? user.photos[0]?.url || user.photos[0]
                                    : user.photos ||
                                      user.avatar?.url ||
                                      user.avatar ||
                                      dummyImg
                                }
                                className="object-cover"
                              />
                              <AvatarFallback
                                className={cn(
                                  "text-white text-xs font-bold",
                                  getAvatarColor(idx),
                                )}
                              >
                                {getInitials(nickname)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] font-semibold text-slate-700 truncate">
                              {nickname}
                            </span>
                          </div>
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="p-2">
                          <span className="text-[11px] text-slate-600">
                            {user.account?.phone || user.phone || "-"}
                          </span>
                        </TableCell>

                        {/* Mail */}
                        <TableCell
                          className="p-2 max-w-[150px]"
                          title={user.account?.email || user.email}
                        >
                          <span className="text-[11px] text-slate-600 max-w-[100px] truncate block">
                            {user.account?.email || user.email || "-"}
                          </span>
                        </TableCell>

                        {/* Age */}
                        <TableCell className="p-2 text-center">
                          <span className="text-[11px] text-slate-600">
                            {user.profile?.age || "-"}
                          </span>
                        </TableCell>

                        {/* Gender */}
                        <TableCell className="p-2 w-max text-[11px] text-slate-600 capitalize">
                          {user.profile?.gender || "-"}
                        </TableCell>

                        {/* Completion */}
                        <TableCell className="p-2">
                          <div className="flex flex-col gap-1.5 min-w-[80px]">
                            <span className="text-xs font-semibold text-foreground/70">
                              {completion}%
                            </span>
                            <div className="h-1.5 w-full bg-slate-300/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-blue rounded-full transition-all duration-500"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="p-2 px-5">
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border-none shadow-none flex items-center gap-1.5 w-fit uppercase whitespace-nowrap",
                              STATUS_STYLES[status]?.bg,
                            )}
                          >
                            <div
                              className={cn(
                                "w-1 h-1 rounded-full",
                                STATUS_STYLES[status]?.dot,
                              )}
                            />
                            {status}
                          </Badge>
                        </TableCell>

                        {/* Plan */}
                        <TableCell className="p-2 pl-4 text-left">
                          {user.account?.isPremium ? (
                            <Badge
                              variant="premium"
                              className="flex w-max items-left gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-md shadow-none border-none uppercase"
                            >
                              <IconStarFilled size={10} /> PRO
                            </Badge>
                          ) : (
                            <span className="text-foreground/60 font-bold pl-2 text-[10px] uppercase">
                              Free
                            </span>
                          )}
                        </TableCell>

                        {/* Location */}
                        <TableCell className="p-2 text-center">
                          {/* <span className="text-xs text-slate-600">
                          {user.location?.city + ", " + user.location?.state ||
                            "-"}
                        </span> */}

                          <span className="w-24 flex capitalize text-[11px] truncate">
                            {user.location?.city || ""}{" "}
                            {user.location?.city && user.location?.country
                              ? ", "
                              : ""}{" "}
                            {user.location?.country || ""}
                          </span>
                        </TableCell>

                        {/* Joined Date */}
                        <TableCell className="p-2 text-center">
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                            {formatDateSafe(user.createdAt)}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-2 text-center transition-all">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all border border-transparent hover:border-slate-200 shadow-none bg-transparent"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 p-2 rounded-2xl shadow-lg border-slate-200"
                            >
                              <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">
                                Actions
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    "/admin/management/users-management/view-profile",
                                    {
                                      state: {
                                        userId: user._id,
                                        from:
                                          location.pathname ||
                                          "/admin/dashboard",
                                      },
                                    },
                                  );
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-brand-hoverBlue transition-colors group"
                              >
                                <Eye
                                  size={14}
                                  strokeWidth={2.5}
                                  className="text-slate-500 group-hover:text-brand-blue"
                                />
                                <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-blue">
                                  View Profile
                                </span>
                              </DropdownMenuItem>

                              {/* CONDITIONAL ACTIONS */}
                              {user?.account?.status === "banned" ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "unban", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors group"
                                  >
                                    <UserCheck
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-emerald-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600">
                                      Unban User
                                    </span>
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "suspend", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors group"
                                  >
                                    <CirclePause
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-amber-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-600">
                                      Suspend Account
                                    </span>
                                  </DropdownMenuItem> */}
                                </>
                              ) : user?.account?.status === "suspended" ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "unsuspend", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors group"
                                  >
                                    <Unlock
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-emerald-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600">
                                      Unsuspend User
                                    </span>
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "ban", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-rose-50 transition-colors group"
                                  >
                                    <Ban
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-rose-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">
                                      Ban Account
                                    </span>
                                  </DropdownMenuItem> */}
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "ban", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-rose-50 transition-colors group"
                                  >
                                    <Ban
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-rose-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">
                                      Ban Account
                                    </span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleActionClick(e, "suspend", user)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors group"
                                  >
                                    <CirclePause
                                      size={14}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover:text-amber-600"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-600">
                                      Suspend Account
                                    </span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="py-20 text-center text-slate-400 text-sm italic"
                    >
                      No new users found in this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* 
      <UserActionModal
        type={actionModal.type}
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleActionConfirm}
        userName={actionModal.user?.profile?.nickname || "User"}
      /> */}

      <Dialog
        open={imageModal.open}
        onOpenChange={(open) => setImageModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <img
            src={imageModal.src || dummyImg}
            className="max-w-full max-h-[90vh] object-cover"
            alt={imageModal.title || "Preview"}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
