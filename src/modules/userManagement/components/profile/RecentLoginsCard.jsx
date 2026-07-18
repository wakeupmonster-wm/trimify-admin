import React, { useState } from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./SharedComponents";

const RecentLoginsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const logins = [
    { date: "Jul 13, 2026", time: "10:24 AM", browser: "Chrome (Windows)", loc: "Sydney", current: true },
    { date: "Jul 10, 2026", time: "06:32 PM", browser: "Mobile App (Android)", loc: "Sydney", current: false },
    { date: "Jul 08, 2026", time: "09:15 AM", browser: "Safari (Mac)", loc: "Melbourne", current: false },
    { date: "Jul 05, 2026", time: "02:45 PM", browser: "Mobile App (iOS)", loc: "Sydney", current: false },
  ];

  const visibleLogins = isExpanded ? logins : logins.slice(0, 2);

  return (
    <SectionCard 
       title="Recent Logins" 
       subheading="Active sessions and device history"
       icon={Monitor}
       headerAction={
         <span 
           onClick={() => setIsExpanded(!isExpanded)}
           className="text-xs font-bold text-brand-blue px-2.5 py-1.5 bg-blue-50 rounded-full cursor-pointer hover:underline hover:bg-blue-100 transition-all select-none"
         >
           {isExpanded ? "Show Less" : "View All"}
         </span>
       }
    >
       <div className="flex flex-col gap-4 transition-all duration-500 ease-in-out">
          {visibleLogins.map((item, idx) => (
             <div key={idx} className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border ${item.current ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                   {item.browser.includes("Mobile") ? <Smartphone className="w-4 h-4" /> : item.browser.includes("Safari") ? <Globe className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-[12px] font-bold text-slate-800 flex justify-between items-center">
                      <span className="truncate">{item.browser}</span>
                      {item.current && <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] px-1.5 py-0 rounded">Current</Badge>}
                   </div>
                   <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                      {item.date}, {item.time} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {item.loc}
                   </div>
                </div>
             </div>
          ))}
       </div>
    </SectionCard>
  );
};

export default RecentLoginsCard;
