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
        <div className="space-y-8">
          <PageHeader
            heading="Transactions"
            icon={<Receipt className="w-9 h-9 text-white" />}
            color="bg-brand-aqua shadow-brand-aqua/30"
            subheading="Revenue tracking, transaction history and export."
          />

          <TransactionsView />
        </div>
      </Container>
    </TooltipProvider>
  );
}
