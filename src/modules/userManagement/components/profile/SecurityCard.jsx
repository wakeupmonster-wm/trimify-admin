import React from "react";
import { Shield, Smartphone, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard, ListItem } from "./SharedComponents";

const SecurityCard = ({ userData }) => {
  return (
    <SectionCard title="Security & Access" subheading="Authentication and permissions" icon={Shield}>
       <div className="flex flex-col">
         <ListItem icon={Shield} label="Access Level" value="Standard User" badge={
             <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] rounded px-1.5 py-0">Active</Badge>
         }/>
         <ListItem icon={Smartphone} label="Device Token" value={userData.device_token ? "Linked" : "None"} />
         <ListItem icon={Key} label="Two Factor Auth" value="Disabled" badge={
            <span className="text-[10px] font-bold text-brand-blue cursor-pointer hover:underline">Enable</span>
         } />
       </div>
    </SectionCard>
  );
};

export default SecurityCard;
