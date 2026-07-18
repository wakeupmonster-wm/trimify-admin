import { Container } from '@/components/common/container'
import { PageHeader } from '@/components/common/headSubhead'
import { CreditCard, Plus } from 'lucide-react'
import Header from '@/components/common/header'
import React, { useState, useMemo, useEffect } from 'react'
import { DataTable } from '@/components/shared/datatable'
import { getSubscriptionColumns } from '@/components/columns/subscription.columns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubscriptionPlans, updateSubscriptionPlan } from '../store/subscription.slice'
import { SubscriptionEditDialog } from '../components/config/subscription.edit.dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { toast } from 'sonner'

const SubscriptionConfigPage = () => {
    const dispatch = useDispatch();
    const { plans, loading, updateLoading, pagination: serverPagination } = useSelector((state) => state.subscriptionManagement);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
      dispatch(
        fetchSubscriptionPlans({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
        })
      );
    }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleAction = (row, action) => {
      if (action === "edit") {
        setEditData(row);
        setDialogOpen(true);
      }
    };

    const handleDialogSubmit = async ({ id, price, features }) => {
      const result = await dispatch(updateSubscriptionPlan({ id, price, features }));
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
          <div className='space-y-8'>
            <Header>
              <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                  heading="All Subscription"
                  icon={<CreditCard className="w-9 h-9 text-white" />}
                  color="bg-brand-blue shadow-blue-200"
                  subheading="Manage subscription plans and their details."
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          disabled
                          className="bg-brand-blue/50 text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          Add Subscription
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs max-w-[220px]">
                      Plan creation isn't supported by the API yet.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Header>

            <DataTable
              columns={columns}
              data={plans || []}
              rowCount={serverPagination ? serverPagination.total : (plans?.length || 0)}
              pagination={pagination}
              onPaginationChange={setPagination}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              searchPlaceholder="Search subscriptions..."
              itemName="entries"
              isLoading={loading}
              manualPagination={!!serverPagination}
              manualFiltering={!!serverPagination}
            />
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
    )
}

export default SubscriptionConfigPage;
