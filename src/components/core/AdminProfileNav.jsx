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
  const { account } = useSelector((state) => state.account);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2.5 pl-2 pr-4 py-1 rounded-full border border-slate-300/60 bg-slate-50 cursor-pointer transition-all duration-200 group shadow-sm">
            {/* Avatar with fallback logic */}
            <Avatar className="h-9 w-9 rounded-full border border-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              <AvatarImage
                src={account?.avatar?.url || dummyImg}
                alt={account?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-app-primary2 text-white font-bold text-[13px]">
                {account?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[13px] font-bold text-slate-900">
                Admin
              </span>
              <span className="text-[13px] font-bold text-app-primary2 truncate max-w-30">
                {account?.name}
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
          <p className="font-bold text-slate-900">{account?.name}</p>
          <p className="text-xs text-slate-500">{account?.email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
