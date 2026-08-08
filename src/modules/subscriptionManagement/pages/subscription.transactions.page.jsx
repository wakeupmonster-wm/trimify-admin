import React, { useRef, useState } from "react";
import { Receipt, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { TooltipProvider } from "@/components/ui/tooltip";
import TransactionsView from "../components/dashboard/transactions/TransactionsView";

export default function SubscriptionTransactionsPage() {
  const [exportLoading, setExportLoading] = useState(false);
  const handleExportRef = useRef(null);

  const onExportClick = () => {
    if (handleExportRef.current) {
      handleExportRef.current();
    }
  };

  return (
    <TooltipProvider>
      <Container>
        <div className="w-full flex flex-col space-y-6 min-w-0">
          <div className="w-full min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Transactions"
                icon={<Receipt className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Revenue tracking, transaction history and export."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                variant="outline"
                onClick={onExportClick}
                disabled={exportLoading}
                className="h-10 hover:border-none rounded-md bg-slate-50 hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white text-xs font-medium transition-all active:scale-95"
              >
                {exportLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                Export CSV
              </Button>
            </div>
          </div>
          <div className="w-full min-w-0 flex-1">
            <TransactionsView
              exportRef={handleExportRef}
              onExportLoadingChange={setExportLoading}
            />
          </div>
        </div>
      </Container>
    </TooltipProvider>
  );
}
