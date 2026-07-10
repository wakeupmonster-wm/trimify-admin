import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Package } from "lucide-react";
import { toast } from "sonner";
import PendingDeliveriesDataTables from "@/components/shared/data-tables/pending.deliveries.data.table";
import {
  fetchPendingDeliveries,
  markAsDelivered,
} from "../store/delivery.slice";
import { getDeliveryColumns } from "@/components/columns/deliveries.columns";
import DeliveryEmailDialog from "../components/Dialogs/DeliveryEmailDialog";
import { PageHeader } from "@/components/common/headSubhead";

export default function PendingDeliveriesPage() {
  const dispatch = useDispatch();

  // Selectors
  const {
    deliveries,
    pagination: reduxPagination,
    loading,
  } = useSelector((s) => s.delivery);

  // States
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("deliveriesManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("deliveriesManagementGlobalFilter") || "",
  );
  const [deliveryStatus, setDeliveryStatus] = useState(
    () => sessionStorage.getItem("deliveriesManagementDeliveryStatus") || "",
  );

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 400);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    sessionStorage.setItem(
      "deliveriesManagementPagination",
      JSON.stringify(pagination),
    );
    sessionStorage.setItem("deliveriesManagementGlobalFilter", globalFilter);
    sessionStorage.setItem("deliveriesManagementDeliveryStatus", deliveryStatus);
  }, [pagination, globalFilter, deliveryStatus]);
  const [deliveryLoading, setDeliveryLoading] = useState({});

  // Email Dialog State
  const [emailDialog, setEmailDialog] = useState({
    isOpen: false,
    delivery: null,
  });

  // Fetch instantly on filters/page changes, debounced strictly for search input
  useEffect(() => {
    dispatch(
      fetchPendingDeliveries({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        deliveryStatus,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    deliveryStatus,
  ]);

  // 2. Open Email Dialog (instead of direct mark)
  const handleMarkAsDelivered = (id) => {
    const delivery = deliveries?.find((d) => d._id === id);
    setEmailDialog({ isOpen: true, delivery: delivery || { _id: id } });
  };

  // 3. Submit delivery with email template
  const handleEmailSubmit = async (formData) => {
    const id = emailDialog.delivery?._id;
    if (!id) return;

    setDeliveryLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await dispatch(
        markAsDelivered({ id, ...formData }),
      ).unwrap();

      const emailSent = response.emailSent ?? response.res?.emailSent;
      const message = response.message || response.res?.message;

      if (emailSent === false) {
        toast.warning(
          "✅ Prize marked as delivered, but email failed! Please notify user manually.",
          { duration: 5000 },
        );
      } else {
        toast.success(message || "Prize delivered & email sent successfully");
      }

      setEmailDialog({ isOpen: false, delivery: null });

      dispatch(
        fetchPendingDeliveries({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          deliveryStatus,
        }),
      );
    } catch (err) {
      toast.error(err?.message || err || "Failed to update status");
    } finally {
      setDeliveryLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // 4. Columns Memo
  const columns = useMemo(
    () => getDeliveryColumns(handleMarkAsDelivered, deliveryLoading),
    [deliveryLoading],
  );

  return (
    <div className="relative py-4 space-y-4 sm:space-y-6 min-h-[500px]">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          heading="Delivery Management"
          icon={<Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
          color="bg-brand-aqua shadow-brand-aqua/40"
          subheading="Track and fulfill giveaway prize"
        />
      </header>

      {/* Table Container */}
      <div className="overflow-hidden">
        <PendingDeliveriesDataTables
          columns={columns}
          data={deliveries || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search user email, phone, prize title..."
          filters={{
            deliveryStatus,
            setDeliveryStatus: (val) => {
              setDeliveryStatus(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
          }}
        />
      </div>

      {/* Delivery Email Dialog */}
      <DeliveryEmailDialog
        isOpen={emailDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) setEmailDialog({ isOpen: false, delivery: null });
        }}
        onSubmit={handleEmailSubmit}
        loading={deliveryLoading[emailDialog.delivery?._id] || false}
        delivery={emailDialog.delivery}
      />
    </div>
  );
}
