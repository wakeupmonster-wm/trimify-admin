import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import dummyImg from "@/assets/web/owner.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdminProfileNav() {
  // Get the authenticated user data from the auth slice
  const { user } = useSelector((state) => state.auth);
  const { account } = useSelector((state) => state.account);

  const localUserStr = localStorage.getItem("auth_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  const displayName =
    account?.name ||
    user?.nickname ||
    user?.name ||
    localUser?.nickname ||
    localUser?.name ||
    "Admin";
  const displayEmail =
    account?.email || user?.email || localUser?.email || "admin@example.com";

  const role =
    user?.role !== undefined
      ? Number(user.role)
      : localUser?.role !== undefined
        ? Number(localUser.role)
        : null;

  const displayUser = {
    ...user,
    ...localUser,
    ...account,
    name: displayName,
    email: displayEmail,
    avatar: localUser?.avatar?.url || user?.avatar?.url || "",
    initial: displayName.charAt(0).toUpperCase(),
    role: role || localUser?.role || 0,
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2.5 pl-2 pr-4 py-1 rounded-full border border-slate-300/60 bg-slate-50 cursor-pointer transition-all duration-200 group shadow-sm">
            {/* Avatar with fallback logic */}
            <Avatar className="h-9 w-9 rounded-full border border-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              <AvatarImage
                src={displayUser?.avatar || dummyImg}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-app-primary2 text-white font-bold text-[13px]">
                {displayUser.initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[13px] font-bold text-slate-900">
                Admin
              </span>
              <span className="text-[13px] font-bold text-app-primary2 truncate max-w-30">
                {displayName}
              </span>
              {/* <span className="text-[11px] pb-1 font-medium text-slate-500 truncate max-w-30">
                {displayEmail}
              </span> */}
            </div>
          </div>
        </TooltipTrigger>

        {/* Hover Card / Tooltip content */}
        <TooltipContent
          side="bottom"
          className="flex flex-col gap-1 p-3 bg-slate-50 border-slate-300/60 shadow-md"
        >
          <p className="font-bold text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">{displayEmail}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
