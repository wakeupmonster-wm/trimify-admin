import React from "react";
import { Activity, LogIn, Dumbbell, LayoutList, BookOpen, Timer, CalendarDays } from "lucide-react";
import { SectionCard } from "./SharedComponents";

const EngagementCard = () => {
  return (
    <SectionCard title="Platform Engagement" subheading="User activity and usage metrics" icon={Activity}>
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100/20 border border-blue-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                <LogIn className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Logins</div>
                <div className="text-lg font-black text-slate-800">6</div>
             </div>
          </div>
          <div className="p-4 bg-emerald-100/20 border border-emerald-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-emerald-50 hover:border-emerald-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                <Dumbbell className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Workouts</div>
                <div className="text-lg font-black text-slate-800">0</div>
             </div>
          </div>
          <div className="p-4 bg-indigo-100/20 border border-indigo-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-indigo-50 hover:border-indigo-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <LayoutList className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Programs</div>
                <div className="text-lg font-black text-slate-800">0</div>
             </div>
          </div>
          <div className="p-4 bg-orange-100/20 border border-orange-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-orange-50 hover:border-orange-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Blogs Read</div>
                <div className="text-lg font-black text-slate-800">0</div>
             </div>
          </div>
          <div className="p-4 bg-purple-100/20 border border-purple-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-purple-50 hover:border-purple-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                <Timer className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sessions</div>
                <div className="text-lg font-black text-slate-800">0</div>
             </div>
          </div>
          <div className="p-4 bg-rose-100/20 border border-rose-100 rounded-2xl flex items-center gap-4 transition-all hover:bg-rose-50 hover:border-rose-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                <CalendarDays className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Days Active</div>
                <div className="text-lg font-black text-slate-800">5</div>
             </div>
          </div>
       </div>
    </SectionCard>
  );
};

export default EngagementCard;
