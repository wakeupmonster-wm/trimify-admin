import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import dummyImg from "@/assets/web/owner.png";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdminProfileNav() {
  // Get the authenticated user data from the auth slice
  const { user } = useSelector((state) => state.auth);

  const localUserStr = localStorage.getItem("auth_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  const displayName = user?.nickname || user?.name || localUser?.nickname || localUser?.name || "Admin";
  const displayEmail = user?.email || localUser?.email || "admin@example.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            // onClick={() => navigate("/admin/accounts")}
            className="flex items-center gap-2.5 pl-2 pr-5 py-1 rounded-full border border-slate-300/60 bg-slate-50 cursor-pointer transition-all duration-200 group shadow-sm"
          >
            {/* Avatar with fallback logic */}
            <Avatar className="h-10 w-10 rounded-full border border-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              <AvatarImage
                src={dummyImg}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-app-primary2 text-white font-bold text-[13px]">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[11px] pb-1 font-medium text-slate-500 truncate max-w-[120px]">
                {displayEmail}
              </span>
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
