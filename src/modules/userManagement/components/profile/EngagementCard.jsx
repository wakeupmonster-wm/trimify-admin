import React from "react";
import { Activity, LogIn, Dumbbell, LayoutList, BookOpen, Timer, CalendarDays } from "lucide-react";
import { SectionCard } from "./SharedComponents";

const EngagementCard = ({ userData }) => {
  return (
    <SectionCard title="Platform Engagement" subheading="User activity and usage metrics" icon={Activity}>
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <LogIn className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Logins</div>
                <div className="text-lg font-black text-slate-800">{userData?.totalLogins || 0}</div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <Dumbbell className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Workouts</div>
                <div className="text-lg font-black text-slate-800">{userData?.workouts || 0}</div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <LayoutList className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Programs</div>
                <div className="text-lg font-black text-slate-800">{userData?.programs || 0}</div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Blogs Read</div>
                <div className="text-lg font-black text-slate-800">{userData?.blogsRead || 0}</div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <Timer className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sessions</div>
                <div className="text-lg font-black text-slate-800">{userData?.sessions || 0}</div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 transition-all hover:bg-slate-100/60 hover:border-slate-300 shadow-sm hover:shadow-md">
             <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                <CalendarDays className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Days Active</div>
                <div className="text-lg font-black text-slate-800">{userData?.daysActive || 0}</div>
             </div>
          </div>
       </div>
    </SectionCard>
  );
};

export default EngagementCard;
