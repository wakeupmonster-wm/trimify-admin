import React from "react";
import { Users } from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { TooltipProvider } from "@/components/ui/tooltip";
import SubscribersView from "../components/dashboard/subscribers/SubscribersView";

export default function SubscriptionSubscribersPage() {
  return (
    <TooltipProvider>
      <Container>
        <div className="space-y-8">
          <PageHeader
            heading="Subscribers"
            icon={<Users className="w-9 h-9 text-white" />}
            color="bg-app-primary2 shadow-blue-200"
            subheading="Monitor and manage all subscription subscribers."
          />

          <SubscribersView />
        </div>
      </Container>
    </TooltipProvider>
  );
}
