import { Container } from "@/components/common/container";
import ConfirmModal from "@/components/common/ConfirmModal";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getFaqManagementColumns } from "@/components/columns/faq.management.columns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, HelpCircle, Plus, X, Loader2, MessageCircle, CheckCircle, EyeOff, RefreshCw } from "lucide-react";
import { KpiStatCard } from "@/components/shared/KpiStatCard";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFaqList,
  addFaq,
  updateFaq,
  toggleFaqStatus,
  deleteFaq,
} from "../store/faq.slice";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "../../../hooks/useDebounce";

const FaqManagementPage = () => {
  const dispatch = useDispatch();
  const {
    faqs,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.faqManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [toggleModal, setToggleModal] = useState({
    open: false,
    rowData: null,
    targetStatus: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(
      fetchFaqList({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editMode) {
        res = await dispatch(
          updateFaq({ id: currentFaqId, data: formData }),
        ).unwrap();
      } else {
        res = await dispatch(addFaq(formData)).unwrap();
      }
      toast.success(
        res?.message || `FAQ ${editMode ? "updated" : "added"} successfully`,
      );
      setIsDialogOpen(false);
      setFormData({ question: "", answer: "" }); // Reset form
      setEditMode(false);
      setCurrentFaqId(null);
    } catch (error) {
      toast.error(error?.message || error || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      setToggleModal({ open: true, rowData: row, targetStatus: value });
    } else if (action === "edit") {
      setFormData({ question: row.question, answer: row.answer });
      setCurrentFaqId(row.id);
      setEditMode(true);
      setIsDialogOpen(true);
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleModal.rowData) return;
    const newStatus = toggleModal.targetStatus ? "Active" : "Inactive";
    try {
      // Assuming unwrap() is available or handle success properly
      const res = await dispatch(toggleFaqStatus({ id: toggleModal.rowData.id, status: newStatus }));
      if (toggleFaqStatus.fulfilled.match(res)) {
         toast.success(`FAQ marked as ${newStatus}`);
      } else {
         toast.error("Failed to update FAQ status");
      }
    } catch (error) {
      toast.error(error?.message || error || "Failed to update FAQ status");
    }
    setToggleModal({ open: false, rowData: null, targetStatus: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    try {
      const res = await dispatch(deleteFaq(deleteModal.rowData.id)).unwrap();
      toast.success(res?.message || "FAQ deleted successfully");
      setDeleteModal({ open: false, rowData: null });
    } catch (error) {
      toast.error(error?.message || error || "Failed to delete FAQ");
    }
  };

  const columns = useMemo(() => getFaqManagementColumns(handleAction), []);

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const list = faqs || [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      total: serverPagination?.total || list.length,
      active: list.filter((f) => f.status === "Active").length,
      inactive: list.filter((f) => f.status !== "Active").length,
      recent: list.filter((f) => f.updated_at && new Date(f.updated_at) >= thirtyDaysAgo).length,
    };
  }, [faqs, serverPagination]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="FAQ"
                icon={<HelpCircle className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-md"
                subheading="Manage Frequently Asked Questions for the platform."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">

              {/* Add one button for add FAQ */}
              <Button
                onClick={() => {
                  setFormData({ question: "", answer: "" });
                  setEditMode(false);
                  setCurrentFaqId(null);
                  setIsDialogOpen(true);
                }}
                className="w-full sm:w-auto flex-1 xl:flex-none bg-slate-50 hover:bg-app-primary2 text-secondary-foreground hover:text-white border rounded-md px-4 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Add FAQ</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* FAQ Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-300/60 bg-slate-50/50">
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-blue" />
                {editMode ? "Edit FAQ" : "Add New FAQ"}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-1 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Question
                </Label>
                <Input
                  name="question"
                  placeholder="e.g. How does the diet plan work?"
                  value={formData.question}
                  onChange={handleChange}
                  className="h-11 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-300/60 bg-slate-50 hover:bg-white transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Answer
                </Label>
                <Textarea
                  name="answer"
                  placeholder="Provide a clear and concise answer..."
                  value={formData.answer}
                  onChange={handleChange}
                  className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue border-slate-300/60 bg-slate-50 hover:bg-white transition-colors resize-none p-3"
                  required
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-300/60 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-lg px-5 h-10 text-xs font-semibold border-slate-300/60 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-lg px-6 h-10 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      {editMode ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      {editMode ? "Update FAQ" : "Save FAQ"}
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KpiStatCard
            title="Total FAQs"
            value={kpiStats.total}
            icon={MessageCircle}
            colorClass="text-brand-blue"
            bgClass="bg-blue-50"
            description="All questions & answers"
          />
          <KpiStatCard
            title="Active FAQs"
            value={kpiStats.active}
            icon={CheckCircle}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            description="Currently visible"
          />
          <KpiStatCard
            title="Inactive FAQs"
            value={kpiStats.inactive}
            icon={EyeOff}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
            description="Hidden from users"
          />
          <KpiStatCard
            title="Recently Updated"
            value={kpiStats.recent}
            icon={RefreshCw}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-50"
            description="Modified in last 30 days"
          />
        </div>

        {/* DataTable */}
        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={faqs || []}
            rowCount={
              serverPagination ? serverPagination.total : faqs?.length || 0
            }
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by question or answer..."
            itemName="entries"
            isLoading={loading}
            manualPagination={!!serverPagination}
            manualFiltering={!!serverPagination}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() => setToggleModal({ open: false, rowData: null, targetStatus: false })}
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this FAQ to ${toggleModal.targetStatus ? "Active" : "Inactive"}?`}
        type="brand"
        confirmText="Update"
      />
    </Container>
  );
};

export default FaqManagementPage;

