import React, { useState } from "react";
import { History, Activity, Edit3, Settings, LogIn, CreditCard, ClipboardList } from "lucide-react";
import { SectionCard } from "./SharedComponents";

const RecentActivityTimelineCard = ({ userData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activities = userData?.activities || [];

  const visibleActivities = isExpanded ? activities : activities.slice(0, 3);

  return (
    <SectionCard
      title="Activity Timeline"
      subheading="Recent actions and system events"
      icon={History}
      headerAction={
        <span 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-app-primary2 px-2.5 py-1.5 bg-blue-50 rounded-full cursor-pointer hover:underline hover:bg-blue-100 transition-all select-none"
        >
          {isExpanded ? "Show Less" : "View All"}
        </span>
      }
    >
      <div className="relative pl-1">
         {/* Vertical Line */}
         <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-slate-300 z-0 transition-all duration-300"></div>
         
         {activities.length === 0 ? (
           <div className="text-center text-xs text-slate-500 py-4 relative z-10">No recent activity found.</div>
         ) : (
           <div className="flex flex-col gap-6 relative z-10 transition-all duration-500 ease-in-out">
             {visibleActivities.map((item) => {
                const IconComponent = item.icon || Activity;
                return (
                 <div key={item.id} className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-4 ring-slate-50 ${item.bg || 'bg-slate-100'} ${item.color || 'text-slate-600'}`}>
                       <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                       <div className="flex justify-between items-start gap-2">
                         <div className="text-[13px] font-bold text-slate-800">{item.title}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">{item.time}</div>
                       </div>
                       <div className="text-[12px] font-medium text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                 </div>
                );
             })}
           </div>
         )}
      </div>
    </SectionCard>
  );
};

export default RecentActivityTimelineCard;
