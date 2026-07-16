import React, { useEffect, useMemo, useState } from "react";
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
import AiFoodNameInput from "../components/AiFoodNameInput";
import AiFoodReviewCard from "../components/AiFoodReviewCard";
import {
  generateAiFood,
  pollAiFoodBatch,
  updateAiFoodItem,
  retryAiFoodItem,
  regenerateAiFoodImage,
  deleteAiFoodItem,
  saveAiFoodItems,
  resetAiFoodBatch,
} from "../store/ai.food.slice";

const POLL_INTERVAL_MS = 2500;

const OUTCOME_META = {
  saved: { label: "Saved", icon: CheckCircle2, className: "text-emerald-600" },
  already_saved: { label: "Already saved", icon: CheckCircle2, className: "text-emerald-600" },
  duplicate: { label: "Duplicate", icon: XCircle, className: "text-amber-600" },
  invalid: { label: "Invalid", icon: XCircle, className: "text-red-600" },
  not_ready: { label: "Not ready", icon: XCircle, className: "text-red-600" },
  not_found: { label: "Not found", icon: XCircle, className: "text-red-600" },
};

const AiFoodUploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    batchId,
    items,
    generateLoading,
    saveLoading,
    itemActionIds,
    saveResults,
  } = useSelector((state) => state.aiFood);

  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

  const visibleItems = useMemo(
    () => items.filter((item) => item.status !== "approved"),
    [items],
  );

  const hasInFlightItems = useMemo(
    () => items.some((item) => item.status === "draft" || item.status === "processing"),
    [items],
  );

  useEffect(() => {
    if (!batchId || !hasInFlightItems) return;
    const interval = setInterval(() => {
      dispatch(pollAiFoodBatch(batchId));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, batchId, hasInFlightItems]);

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

  const handleFieldSave = (id, data) => {
    dispatch(updateAiFoodItem({ id, data }))
      .unwrap()
      .catch((error) => toast.error(error || "Failed to save change."));
  };

  const handleRetry = (id) => {
    dispatch(retryAiFoodItem(id))
      .unwrap()
      .catch((error) => toast.error(error || "Failed to retry item."));
  };

  const handleRegenerateImage = (id) => {
    dispatch(regenerateAiFoodImage(id))
      .unwrap()
      .then(() => toast.success("Regenerating image…"))
      .catch((error) => toast.error(error || "Failed to regenerate image."));
  };

  const handleRemove = (id) => {
    dispatch(deleteAiFoodItem(id))
      .unwrap()
      .then(() => {
        setSelectedIds((prev) => prev.filter((i) => i !== id));
      })
      .catch((error) => toast.error(error || "Failed to remove item."));
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

  const pendingReviewCount = visibleItems.filter(
    (item) => item.status === "pending_review",
  ).length;

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="AI Food Upload"
              icon={<Sparkles className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Generate nutrition data & images with AI, review, then save to the catalog."
            />

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/data-management/nutrition-food")}
                className="w-full xs:w-auto flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </Button>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={selectedIds.length === 0 || saveLoading}
                className="w-full xs:w-auto bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all"
              >
                {saveLoading ? <Spinner className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                Save Selected ({selectedIds.length})
              </Button>
            </div>
          </div>
        </Header>

        <AiFoodNameInput onGenerate={handleGenerate} loading={generateLoading} />

        {visibleItems.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500">
              {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""} in this session
              {pendingReviewCount > 0 && ` · ${pendingReviewCount} ready for review`}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch(resetAiFoodBatch());
                setSelectedIds([]);
              }}
              className="text-xs text-slate-400 hover:text-red-600"
            >
              Clear session
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <AiFoodReviewCard
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              onToggleSelect={handleToggleSelect}
              onFieldSave={handleFieldSave}
              onRetry={handleRetry}
              onRegenerateImage={handleRegenerateImage}
              onRemove={handleRemove}
              isBusy={itemActionIds.includes(item.id)}
            />
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">
              Type food names above and hit Generate to get started.
            </p>
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""} to the food catalog?</DialogTitle>
            <DialogDescription>
              These items will become visible in the live app immediately after saving.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white"
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
                  className="flex items-start gap-2 text-sm border border-slate-200 rounded-md px-3 py-2"
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${meta.className}`} />
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
