import React from "react";
import { CreditCard, Calendar, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard, ListItem } from "./SharedComponents";

const SubscriptionCard = ({ userData, formatDate }) => {
  return (
    <SectionCard title="Subscription" subheading="Current plan and billing status" icon={CreditCard}>
       <div className="flex flex-col">
         <ListItem icon={CreditCard} label="Current Plan" value={userData.plan || "Basic"} badge={
            <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[9px] rounded px-1.5 py-0">Basic</Badge>
         } />
         <ListItem icon={Calendar} label="Plan Expiry" value={formatDate(userData.plan_expiry)} />
         <ListItem icon={Activity} label="Transactions" value={userData.transactions?.length || "0"} />
       </div>
    </SectionCard>
  );
};

export default SubscriptionCard;
