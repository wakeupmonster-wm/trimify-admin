import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, Save, CheckCircle2, XCircle } from "lucide-react";
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
import { generateAiFood, saveAiFoodItems } from "../store/ai.food.slice";
import { useAiFoodPolling } from "../hooks/useAiFoodPolling";

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const visibleItems = useMemo(
    () => items.filter((item) => item.status !== "approved"),
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

  const columns = useMemo(
    () =>
      getAiFoodColumns({
        selectedIds,
        onToggleSelect: handleToggleSelect,
        onView: handleView,
      }),
    [selectedIds],
  );

  const pendingReviewCount = visibleItems.filter((item) => item.status === "pending_review").length;

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="AI Food Upload"
                icon={<Sparkles className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-brand-blue"
                subheading="Generate nutrition data & images with AI, review, then save to the catalog."
              />
            </div>

            <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() =>
                  navigate("/admin/data-management/nutrition-food")
                }
                className="w-full sm:w-auto flex-1 md:flex-none rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Back to List</span>
              </Button>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={selectedIds.length === 0 || saveLoading}
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                {saveLoading ? (
                  <Spinner className="w-4 h-4 shrink-0" />
                ) : (
                  <Save className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                )}
                <span className="whitespace-nowrap">Save Selected ({selectedIds.length})</span>
              </Button>
            </div>
          </div>
        </Header>

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
            searchPlaceholder="Search generated food…"
            itemName="items"
            onRowClick={(row) => handleView(row.original.id)}
            manualPagination={true}
            manualFiltering={true}
          />
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}{" "}
              to the food catalog?
            </DialogTitle>
            <DialogDescription>
              These items will become visible in the live app immediately after
              saving.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-app-primary2 hover:bg-app-primary5 text-white"
            >
              Confirm & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </Container>
  );
};

export default AiFoodUploadPage;
