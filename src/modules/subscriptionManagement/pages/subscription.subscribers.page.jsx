import React from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { TooltipProvider } from "@/components/ui/tooltip";
import SubscribersView from "../components/dashboard/subscribers/SubscribersView";
import { LuUsersRound } from "react-icons/lu";

export default function SubscriptionSubscribersPage() {
  return (
    <TooltipProvider>
      <Container>
        <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
          <div className="w-full min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Subscribers"
                icon={<LuUsersRound className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Monitor and manage all subscription subscribers."
              />
            </div>
          </div>

          <div className="w-full min-w-0 flex-1">
            <SubscribersView />
          </div>
        </div>
      </Container>
    </TooltipProvider>
  );
}
