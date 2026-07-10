import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, Gift } from "lucide-react";
import { toast } from "sonner";
import { getPrizeColumns } from "@/components/columns/prizes.columns";
import PrizesDataTable from "@/components/shared/data-tables/prizes.data.table";
import { PrizeDialog } from "../components/Dialogs/PrizeDialog";
import {
  createPrize,
  deletePrize,
  fetchPrizes,
  updatePrize,
} from "../store/prizes.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { PageHeader } from "@/components/common/headSubhead";

export default function PrizePage() {
  const dispatch = useDispatch();
  const {
    prizes,
    pagination: reduxPagination,
    loading,
  } = useSelector((s) => s.prize);

  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("prizesManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("prizesManagementGlobalFilter") || "",
  );
  const [prizeType, setPrizeType] = useState(
    () => sessionStorage.getItem("prizesManagementPrizeType") || "",
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
      "prizesManagementPagination",
      JSON.stringify(pagination),
    );
    sessionStorage.setItem("prizesManagementGlobalFilter", globalFilter);
    sessionStorage.setItem("prizesManagementPrizeType", prizeType);
  }, [pagination, globalFilter, prizeType]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    type: "GIFT_CARD",
    value: "",
    planType: "",
    durationInDays: "",
    spinWheelLabel: "",
    description: "",
    supportiveItems: [],
  });
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    prizeId: null,
    title: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch instantly on filters/page changes, debounced strictly for search input
  useEffect(() => {
    dispatch(
      fetchPrizes({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        type: prizeType,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    prizeType,
  ]);

  const resetForm = () => {
    setForm({
      title: "",
      type: "GIFT_CARD",
      value: "",
      planType: "",
      durationInDays: "",
      spinWheelLabel: "",
      description: "",
      supportiveItems: [],
    });
    setEditingId(null);
  };

  const handleEdit = (prize) => {
    setForm({
      title: prize.title || "",
      type: prize.type || "",
      value:
        prize.value !== undefined && prize.value !== null
          ? prize.value.toString()
          : "",
      planType: prize.planType || "",
      durationInDays:
        prize.durationInDays !== undefined && prize.durationInDays !== null
          ? prize.durationInDays.toString()
          : "",
      spinWheelLabel: prize.spinWheelLabel || "",
      description: prize.description || "",
      supportiveItems: Array.isArray(prize.supportiveItems)
        ? [...prize.supportiveItems]
        : [],
    });
    setEditingId(prize._id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (loading) return;
    const payload = { ...form };
    const supportiveItems = Array.isArray(payload.supportiveItems)
      ? payload.supportiveItems.map((i) => i.trim()).filter((i) => i !== "")
      : [];

    let data = {
      title: payload.title,
      type: payload.type || "GIFT_CARD",
      spinWheelLabel: payload.spinWheelLabel,
      supportiveItems,
    };

    // if (payload.type === "FREE_PREMIUM") {
    //   data.planType = payload.planType;
    //   data.durationInDays = parseInt(payload.durationInDays, 10);
    // } else {
    data.value = parseFloat(payload.value);
    // }

    // New GIFT_CARD fields
    if (payload.description?.trim()) {
      data.description = payload.description.trim();
    }

    try {
      if (editingId) {
        const res = await dispatch(
          updatePrize({ id: editingId, data }),
        ).unwrap();
        toast.success(res.message || "Prize updated successfully");
      } else {
        const res = await dispatch(createPrize(data)).unwrap();
        toast.success(res.message || "Prize created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const columns = useMemo(() => getPrizeColumns(handleEdit, (id, title) => {
    setDeleteLoading(false);
    setDeleteSuccess(false);
    setConfirmConfig({
      isOpen: true,
      prizeId: id,
      title: title,
    });
  }),
    [prizes],
  );

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteSuccess(false);
      const res = await dispatch(deletePrize(confirmConfig.prizeId)).unwrap();

      toast.success(res.message || "Prize deleted successfully");
      setDeleteSuccess(true);
      setDeleteLoading(false);
      setTimeout(() => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        setDeleteSuccess(false);
      }, 1500);
    } catch (err) {
      setDeleteLoading(false);
      setDeleteSuccess(false);
      toast.error(err || "Failed to delete prize");
    }
  };

  return (
    <div className="relative py-4 space-y-6 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          heading="Prizes"
          icon={<Gift className="text-white h-5 w-5" strokeWidth={2.5} />}
          color="bg-brand-aqua shadow-brand-aqua/40"
          subheading="Manage your giveaway pool"
        />
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-slate-50 hover:bg-brand-aqua border hover:border-none text-xs text-slate-500 hover:text-white font-semibold gap-2 h-10 px-2 shadow-sm transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> Create New Prize
        </Button>
      </div>

      <div className="overflow-hidden">
        <PrizesDataTable
          columns={columns}
          data={prizes || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by title..."
          filters={{
            prizeType,
            setPrizeType: (val) => {
              setPrizeType(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
          }}
        />
      </div>

      <PrizeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isEditing={!!editingId}
        loading={loading}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => {
          if (deleteLoading || deleteSuccess) return;
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Prize?"
        message={`Are you sure you want to delete "${confirmConfig.title}"? This will permanently remove it from the giveaway pool.`}
        confirmText="Delete Permanently"
        type="danger"
        loading={deleteLoading}
        success={deleteSuccess}
      />
    </div>
  );
}
