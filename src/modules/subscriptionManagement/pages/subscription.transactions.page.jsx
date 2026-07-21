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
        <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
          <div className="w-full min-w-0">
            <PageHeader
              heading="Transactions"
              icon={<Receipt className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading="Revenue tracking, transaction history and export."
            />
          </div>
          <div className="w-full min-w-0 flex-1">
            <TransactionsView />
          </div>
        </div>
      </Container>
    </TooltipProvider>
  );
}
