import React from "react";
import { Receipt } from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { TooltipProvider } from "@/components/ui/tooltip";
import TransactionsView from "../components/dashboard/transactions/TransactionsView";

export default function SubscriptionTransactionsPage() {
  return (
    <TooltipProvider>
      <Container>
        <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
          <div className="w-full min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Transactions"
                icon={<Receipt className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Revenue tracking, transaction history and export."
              />
            </div>
          </div>
          <div className="w-full min-w-0 flex-1">
            <TransactionsView />
          </div>
        </div>
      </Container>
    </TooltipProvider>
  );
}
