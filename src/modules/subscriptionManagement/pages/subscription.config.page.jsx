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
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../store/subscription.slice";
import { SubscriptionEditDialog } from "../components/config/subscription.edit.dialog";
import { SubscriptionAddDialog } from "../components/config/subscription.add.dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

const SubscriptionConfigPage = () => {
  const dispatch = useDispatch();
  const {
    plans,
    loading,
    createLoading,
    updateLoading,
    pagination: serverPagination,
  } = useSelector((state) => state.subscriptionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
      setEditDialogOpen(true);
    }
  };

  // ── Add Plan ──────────────────────────────────────────────────────
  const handleAddSubmit = async (data) => {
    const result = await dispatch(createSubscriptionPlan(data));
    if (createSubscriptionPlan.fulfilled.match(result)) {
      toast.success("Subscription plan created successfully!");
      setAddDialogOpen(false);
      // Refresh to get the server-generated record
      dispatch(
        fetchSubscriptionPlans({
          page: 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
    } else {
      const payload = result.payload;
      // Show the most specific error available
      const message =
        payload?.message ||
        (payload?.errors
          ? Object.values(payload.errors).flat().join(" ")
          : null) ||
        "Failed to create subscription plan. Please try again.";
      toast.error(message);
    }
  };

  // ── Edit Plan ─────────────────────────────────────────────────────
  const handleEditSubmit = async ({ id, subtitle, price, features }) => {
    const result = await dispatch(updateSubscriptionPlan({ id, subtitle, price, features }));
    if (updateSubscriptionPlan.fulfilled.match(result)) {
      toast.success("Subscription plan updated successfully!");
      setEditDialogOpen(false);
    } else {
      const payload = result.payload;
      const message =
        payload?.message ||
        (payload?.errors
          ? Object.values(payload.errors).flat().join(" ")
          : null) ||
        "Failed to update subscription plan.";
      toast.error(message);
    }
  };

  const columns = useMemo(() => getSubscriptionColumns(handleAction), []);

  return (
    <>
      <Container>
        <div className="w-full flex flex-col space-y-6 min-w-0">
          <Header>
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 w-full md:w-auto">
                <PageHeader
                  heading="All Plans"
                  icon={<CreditCard className="w-6 h-6 text-white shrink-0" />}
                  variant="primary"
                  subheading="Manage subscription plans and their details."
                />
              </div>

              <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Add Subscription</span>
                </Button>
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
              onRowClick={(row) => handleAction(row.original, "edit")}
            />
          </div>
        </div>

        {/* Edit Dialog */}
        <SubscriptionEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditSubmit}
          editData={editData}
          loading={updateLoading}
        />

        {/* Add Dialog */}
        <SubscriptionAddDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAddSubmit}
          loading={createLoading}
        />
      </Container>
    </>
  );
};

export default SubscriptionConfigPage;
