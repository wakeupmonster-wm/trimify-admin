import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { CreditCard, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getSubscriptionColumns } from "@/components/columns/subscription.columns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
} from "../store/subscription.slice";
import { SubscriptionEditDialog } from "../components/config/subscription.edit.dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

const SubscriptionConfigPage = () => {
  const dispatch = useDispatch();
  const {
    plans,
    loading,
    updateLoading,
    pagination: serverPagination,
  } = useSelector((state) => state.subscriptionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(
      fetchSubscriptionPlans({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
  ]);

  const handleAction = (row, action) => {
    if (action === "edit") {
      setEditData(row);
      setDialogOpen(true);
    }
  };

  const handleDialogSubmit = async ({ id, price, features }) => {
    const result = await dispatch(
      updateSubscriptionPlan({ id, price, features }),
    );
    if (updateSubscriptionPlan.fulfilled.match(result)) {
      toast.success("Subscription plan updated successfully");
      setDialogOpen(false);
    } else {
      const payload = result.payload;
      const message = payload?.errors
        ? Object.values(payload.errors).flat().join(" ")
        : payload?.message || "Failed to update subscription plan";
      toast.error(message);
    }
  };

  const columns = useMemo(() => getSubscriptionColumns(handleAction), []);

  return (
    <TooltipProvider>
      <Container>
        <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
          <Header>
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 w-full md:w-auto">
                <PageHeader
                  heading="All Subscription"
                  icon={<CreditCard className="w-6 h-6 text-white shrink-0" />}
                  variant="primary"
                  subheading="Manage subscription plans and their details."
                />
              </div>

              <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-full sm:w-auto flex-1 md:flex-none">
                      <Button
                        disabled
                        className="w-full sm:w-auto flex-1 md:flex-none bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">
                          Add Subscription
                        </span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs max-w-[220px]"
                  >
                    Plan creation isn't supported by the API yet.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Header>

          <div className="w-full min-w-0 flex-1">
            <DataTable
              columns={columns}
              data={plans || []}
              rowCount={
                serverPagination ? serverPagination.total : plans?.length || 0
              }
              pagination={pagination}
              onPaginationChange={setPagination}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              searchPlaceholder="Search by plan title or sub-title..."
              itemName="entries"
              isLoading={loading}
              manualPagination={!!serverPagination}
              manualFiltering={!!serverPagination}
            />
          </div>
        </div>

        <SubscriptionEditDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleDialogSubmit}
          editData={editData}
          loading={updateLoading}
        />
      </Container>
    </TooltipProvider>
  );
};

export default SubscriptionConfigPage;
