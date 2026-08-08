import React, { useMemo, useState } from "react";
import FloatingActionBar from "@/components/common/FloatingActionBar";
import CTAButton from "@/components/common/CTAButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowLeft,
  Save,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/components/shared/datatable";
import { getAiFoodColumns } from "@/components/columns/ai.food.columns";
import AiFoodNameInput from "../components/AiFoodNameInput";
import {
  generateAiFood,
  saveAiFoodItems,
  deleteAiFoodItem,
} from "../store/ai.food.slice";
import { useAiFoodPolling } from "../hooks/useAiFoodPolling";
import ConfirmModal from "@/components/common/ConfirmModal";

const OUTCOME_META = {
  saved: { label: "Saved", icon: CheckCircle2, className: "text-emerald-600" },
  already_saved: {
    label: "Already saved",
    icon: CheckCircle2,
    className: "text-emerald-600",
  },
  duplicate: { label: "Duplicate", icon: XCircle, className: "text-amber-600" },
  invalid: { label: "Invalid", icon: XCircle, className: "text-red-600" },
  not_ready: { label: "Not ready", icon: XCircle, className: "text-red-600" },
  not_found: { label: "Not found", icon: XCircle, className: "text-red-600" },
};

const AiFoodUploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useAiFoodPolling();

  const { items, generateLoading, saveLoading, saveResults } = useSelector(
    (state) => state.aiFood,
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const visibleItems = useMemo(
    () =>
      [...items]
        .filter((item) => item.status !== "approved")
        .sort((a, b) => b.id - a.id),
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return visibleItems;
    return visibleItems.filter((item) =>
      item.food_name?.toLowerCase().includes(q),
    );
  }, [visibleItems, globalFilter]);

  const pagedItems = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredItems.slice(start, start + pagination.pageSize);
  }, [filteredItems, pagination]);

  const handleGenerate = (foodNames) => {
    dispatch(generateAiFood(foodNames))
      .unwrap()
      .then(() => {
        toast.success("Generation started. Items will appear below shortly.");
      })
      .catch((error) => {
        toast.error(error || "Failed to start generation.");
      });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleView = (id) => {
    navigate(`/admin/data-management/ai-food-upload/${id}`);
  };

  const handleConfirmSave = () => {
    setConfirmOpen(false);
    dispatch(saveAiFoodItems(selectedIds))
      .unwrap()
      .then(() => {
        setResultsOpen(true);
        setSelectedIds([]);
      })
      .catch((error) => toast.error(error || "Failed to save items."));
  };

  const handleRemoveItemClick = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    dispatch(deleteAiFoodItem(itemToDelete))
      .unwrap()
      .then(() => {
        toast.success("Item removed.");
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
      })
      .catch((error) => {
        toast.error(error || "Failed to remove item.");
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleConfirmBulkDelete = () => {
    setIsBulkDeleting(true);
    const promises = selectedIds.map((id) =>
      dispatch(deleteAiFoodItem(id)).unwrap(),
    );

    Promise.allSettled(promises)
      .then((results) => {
        const failedCount = results.filter(
          (r) => r.status === "rejected",
        ).length;
        if (failedCount === 0) {
          toast.success("Selected items removed.");
        } else {
          toast.error(`${failedCount} item(s) failed to remove.`);
        }
        setBulkDeleteConfirmOpen(false);
        setSelectedIds([]);
      })
      .finally(() => setIsBulkDeleting(false));
  };

  const columns = useMemo(
    () =>
      getAiFoodColumns({
        selectedIds,
        onToggleSelect: handleToggleSelect,
        onView: handleView,
        onDelete: handleRemoveItemClick,
      }),
    [selectedIds],
  );

  const pendingReviewCount = visibleItems.filter(
    (item) => item.status === "pending_review",
  ).length;

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0 relative">
        {/* <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pt-4 pb-2 -mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8"> */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="AI Food Upload"
                icon={<Sparkles className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Generate nutrition data & images with AI, review, then save to the catalog."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() =>
                  navigate("/admin/data-management/nutrition-food")
                }
              />
            </div>
          </div>
        </Header>
        {/* </div> */}

        <AiFoodNameInput
          onGenerate={handleGenerate}
          loading={generateLoading}
        />

        {visibleItems.length > 0 && (
          <p className="text-xs font-medium text-slate-500 px-1">
            {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""}{" "}
            awaiting review
            {pendingReviewCount > 0 &&
              ` · ${pendingReviewCount} ready for review`}
          </p>
        )}

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={pagedItems}
            rowCount={filteredItems.length}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by food name..."
            itemName="items"
            onRowClick={(row) => handleView(row.original.id)}
            manualPagination={true}
            manualFiltering={true}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message={`Are you sure you want to add ${selectedIds.length} item${selectedIds.length !== 1 ? "s" : ""} to the food catalog? These items will become visible in the live app immediately after saving.`}
        confirmText="Confirm & Save"
        type="brand"
        loading={saveLoading}
      />

      <Dialog open={resultsOpen} onOpenChange={setResultsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Results</DialogTitle>
            <DialogDescription>
              Here's what happened to each item you tried to save.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(saveResults || []).map((result) => {
              const meta = OUTCOME_META[result.outcome] || OUTCOME_META.invalid;
              const Icon = meta.icon;
              const item = items.find((i) => i.id === result.id);
              return (
                <div
                  key={result.id}
                  className="flex items-start gap-2 text-sm border border-slate-300/60 rounded-md px-3 py-2"
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${meta.className}`}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-700 truncate">
                      {item?.food_name || `Item #${result.id}`}
                    </p>
                    <p className={`text-xs ${meta.className}`}>
                      {meta.label}
                      {result.reason && ` — ${result.reason}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setResultsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Generated Item"
        message="Are you sure you want to remove this generated item? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={bulkDeleteConfirmOpen}
        onClose={() => setBulkDeleteConfirmOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Items"
        message={`Are you sure you want to remove ${selectedIds.length} generated item${selectedIds.length !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText="Delete Selected"
        type="danger"
        loading={isBulkDeleting}
      />

      {/* Floating Action Bar */}
      <FloatingActionBar selectedCount={selectedIds.length}>
        <Button
          onClick={() => setBulkDeleteConfirmOpen(true)}
          disabled={isBulkDeleting || saveLoading}
          className="h-9 px-4 rounded-lg gap-2 text-xs font-bold shadow-sm bg-[#E54848] hover:bg-[#E54848]/90 text-white border-none"
        >
          {isBulkDeleting ? (
            <Spinner className="w-4 h-4 shrink-0" />
          ) : (
            <Trash2 className="w-4 h-4 shrink-0" />
          )}
          Delete
        </Button>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={saveLoading || isBulkDeleting}
          className="h-9 px-4 rounded-lg bg-app-primary2 hover:bg-app-primary3 text-white gap-2 text-xs font-bold shadow-sm"
        >
          {saveLoading ? (
            <Spinner className="w-4 h-4 shrink-0" />
          ) : (
            <Save className="w-4 h-4 shrink-0" />
          )}
          Save
        </Button>
      </FloatingActionBar>
    </Container>
  );
};

export default AiFoodUploadPage;
