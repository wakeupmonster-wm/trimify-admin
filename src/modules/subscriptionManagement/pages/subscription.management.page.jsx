import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { CreditCard, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getSubscriptionColumns } from "@/components/columns/subscription.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionPlans } from "../store/subscription.slice";
import { SubscriptionDialog } from "../components/subscription.dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../../../hooks/useDebounce";

const mockData = [
  {
    id: 1,
    planTitle: "Premium",
    duration: "Quarterly",
    price: "$50.00",
    subTitle: "Package details here",
    features: "Unlimited Projects, Priority Support, Advanced A...",
  },
  {
    id: 2,
    planTitle: "Basic",
    duration: "Monthly",
    price: "$10.00",
    subTitle: "Package details here",
    features: "Priority Support, Advanced Analytics",
  },
];

const SubscriptionManagementPage = () => {
  const dispatch = useDispatch();
  const {
    subscriptions,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.subscriptionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });

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
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    console.log("Delete subscription plan:", deleteModal.rowData);
    // Add dispatch for delete action here when API is ready
    setDeleteModal({ open: false, rowData: null });
  };

  const handleDialogSubmit = (data) => {
    if (editData) {
      console.log("Update subscription:", data);
    } else {
      console.log("Add subscription:", data);
    }
  };

  const columns = useMemo(() => getSubscriptionColumns(handleAction), []);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="All Subscription"
                icon={<CreditCard className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage subscription plans and their details."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 md:flex-none bg-slate-50 hover:bg-app-primary2 text-secondary-foreground hover:text-white border border-slate-300/60 shadow-sm rounded-md px-4 sm:px-5 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold transition-all"
                onClick={() => {
                  setEditData(null);
                  setDialogOpen(true);
                }}
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
            data={subscriptions || []}
            rowCount={
              serverPagination
                ? serverPagination.total
                : subscriptions?.length || 0
            }
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by plan name or user name..."
            itemName="entries"
            isLoading={loading}
            manualPagination={!!serverPagination}
            manualFiltering={!!serverPagination}
          />
        </div>
      </div>

      {/* Add/Edit Subscription Dialog */}
      <SubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        editData={editData}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this subscription plan? This action cannot be undone."
      />
    </Container>
  );
};

export default SubscriptionManagementPage;
