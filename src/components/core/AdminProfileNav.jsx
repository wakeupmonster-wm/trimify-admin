import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import dummyImg from "@/assets/web/dummyImg.webp";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdminProfileNav() {
  const navigate = useNavigate();
  // const { account } = useSelector((state) => state.account);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => navigate("/admin/accounts")}
            className="flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full border border-slate-300/60 bg-white hover:bg-slate-50 cursor-pointer transition-all duration-200 group shadow-sm"
          >
            {/* Avatar with fallback logic */}
            <Avatar className="h-8 w-8 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              <AvatarImage
                src={dummyImg}
                alt="Admin"
                className="object-cover"
              />
              <AvatarFallback className="bg-[#00A99D] text-white font-bold text-[13px]">
                A
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[13px] font-bold text-slate-900">
                Admin
              </span>
              <span className="text-[13px] font-bold text-[#00A99D]">
                Admin
              </span>
            </div>
          </div>
        </TooltipTrigger>

        {/* Hover Card / Tooltip content */}
        <TooltipContent
          side="bottom"
          className="flex flex-col gap-1 p-3 bg-white border-slate-300/60 shadow-xl"
        >
          <p className="font-bold text-brand-blue">Admin</p>
          <p className="text-xs text-slate-500">[EMAIL_ADDRESS]</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
