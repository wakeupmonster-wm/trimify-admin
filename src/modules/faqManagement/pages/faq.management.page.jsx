import { Container } from "@/components/common/container";
import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getFaqManagementColumns } from "@/components/columns/faq.management.columns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, HelpCircle, Plus } from "lucide-react";
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
import { useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FaqManagementPage = () => {
  const dispatch = useDispatch();
  const {
    faqs,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.faqManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchFaqList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      }),
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await dispatch(updateFaq({ id: currentFaqId, data: formData }));
    } else {
      await dispatch(addFaq(formData));
    }
    setIsDialogOpen(false);
    setFormData({ question: "", answer: "" }); // Reset form
    setEditMode(false);
    setCurrentFaqId(null);
  };

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      const newStatus = value ? "Active" : "Inactive";
      await dispatch(toggleFaqStatus({ id: row.id, status: newStatus }));
      toast.success(`FAQ marked as ${newStatus}`);
    } else if (action === "edit") {
      setFormData({ question: row.question, answer: row.answer });
      setCurrentFaqId(row.id);
      setEditMode(true);
      setIsDialogOpen(true);
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this FAQ?")) {
        await dispatch(deleteFaq(row.id));
        toast.success("FAQ deleted successfully");
      }
    }
  };

  const columns = useMemo(() => getFaqManagementColumns(handleAction), []);

  return (
    <Container>
      <div className="space-y-6">
        {/* Top Header matching standard design */}
        <Header>
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="FAQ"
              icon={<HelpCircle className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-md"
              subheading="Manage Frequently Asked Questions for the platform."
            />
          </div>

          {/* Add one button for add FAQ */}
          <Button
            onClick={() => {
              setFormData({ question: "", answer: "" });
              setEditMode(false);
              setCurrentFaqId(null);
              setIsDialogOpen(true);
            }}
            className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 font-semibold gap-2"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </Button>
        </Header>

        {/* FAQ Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-0">
            <div className="bg-brand-blue py-4 px-6 text-center">
              <DialogTitle className="text-white text-base font-semibold">
                {editMode ? "Edit FAQ" : "Add FAQ"}
              </DialogTitle>
            </div>
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-800">
                  Question
                </Label>
                <Input
                  name="question"
                  placeholder="Enter Question"
                  value={formData.question}
                  onChange={handleChange}
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-800">
                  Answer
                </Label>
                <Textarea
                  name="answer"
                  placeholder="Enter Answer"
                  value={formData.answer}
                  onChange={handleChange}
                  className="min-h-[80px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200 resize-none"
                  required
                />
              </div>
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-6 py-2 h-auto text-sm font-medium flex items-center gap-2"
                  disabled={loading}
                >
                  {editMode ? "Update FAQ" : "Add FAQ"}{" "}
                  <Send className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* DataTable */}
        <div className="bg-white rounded-md shadow-sm px-4">
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
            searchPlaceholder="Search faqs..."
            itemName="entries"
            isLoading={loading}
            manualPagination={!!serverPagination}
            manualFiltering={!!serverPagination}
          />
        </div>
      </div>
    </Container>
  );
};

export default FaqManagementPage;
