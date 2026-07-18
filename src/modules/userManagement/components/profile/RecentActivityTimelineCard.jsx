import React, { useState } from "react";
import { History, Activity, Edit3, Settings, LogIn, CreditCard, ClipboardList } from "lucide-react";
import { SectionCard } from "./SharedComponents";

const RecentActivityTimelineCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activities = [
    {
      id: 1,
      title: "Profile Updated",
      desc: "User updated their weight goal to 65kg.",
      time: "2 hours ago",
      icon: Edit3,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 2,
      title: "Password Changed",
      desc: "User successfully changed their password via email link.",
      time: "Yesterday, 14:32",
      icon: Settings,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 3,
      title: "Completed Workout",
      desc: "Finished 'Full Body HIIT' session. Burned 350 calories.",
      time: "Jul 12, 09:15 AM",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      id: 4,
      title: "Logged In",
      desc: "New session started from Chrome (Windows) in Sydney.",
      time: "Jul 10, 10:24 AM",
      icon: LogIn,
      color: "text-slate-600",
      bg: "bg-slate-200",
    },
    {
      id: 5,
      title: "Subscription Renewed",
      desc: "Premium Plan successfully renewed for 1 month.",
      time: "Jul 05, 08:00 AM",
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 6,
      title: "New Program Assigned",
      desc: "User enrolled in the 'Fat Loss Starter' program.",
      time: "Jul 01, 11:30 AM",
      icon: ClipboardList,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    }
  ];

  const visibleActivities = isExpanded ? activities : activities.slice(0, 3);

  return (
    <SectionCard
      title="Activity Timeline"
      subheading="Recent actions and system events"
      icon={History}
      headerAction={
        <span 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-brand-blue px-2.5 py-1.5 bg-blue-50 rounded-full cursor-pointer hover:underline hover:bg-blue-100 transition-all select-none"
        >
          {isExpanded ? "Show Less" : "View All"}
        </span>
      }
    >
      <div className="relative pl-1">
         {/* Vertical Line */}
         <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-slate-300 z-0 transition-all duration-300"></div>
         
         <div className="flex flex-col gap-6 relative z-10 transition-all duration-500 ease-in-out">
           {visibleActivities.map((item) => (
             <div key={item.id} className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-4 ring-slate-50 ${item.bg} ${item.color}`}>
                   <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                   <div className="flex justify-between items-start gap-2">
                     <div className="text-[13px] font-bold text-slate-800">{item.title}</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">{item.time}</div>
                   </div>
                   <div className="text-[12px] font-medium text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                </div>
             </div>
           ))}
         </div>
      </div>
    </SectionCard>
  );
};

export default RecentActivityTimelineCard;
