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
  const [deleteModal, setDeleteModal] = useState({ open: false, rowData: null });

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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="All Subscription"
              icon={<CreditCard className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Manage subscription plans and their details."
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
                onClick={() => {
                  setEditData(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Subscription
              </Button>
            </div>
          </div>
        </Header>

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
          searchPlaceholder="Search subscriptions..."
          itemName="entries"
          isLoading={loading}
          manualPagination={!!serverPagination}
          manualFiltering={!!serverPagination}
        />
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
