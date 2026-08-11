import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { getAvailableFitzoneCategoriesAPI, addFitzoneAssignmentAPI } from "../../services/user.services";

const AddFitzoneDialogForm = ({ userId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAvailableFitzoneCategoriesAPI(userId);
        if (res?.status === 'success') {
          setCategories(res?.data || []);
        } else {
          toast.error("Failed to load available fitzones");
        }
      } catch (error) {
        toast.error("Error loading fitzones");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [userId]);

  const handleAdd = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a fitzone category");
      return;
    }
    
    try {
      setSubmitting(true);
      const res = await addFitzoneAssignmentAPI(userId, { category_id: selectedCategoryId });
      if (res?.status === 'success') {
        toast.success("Fitzone assigned successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to assign fitzone");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full overflow-hidden">
      <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <DialogTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Add Fitzone Assignment
        </DialogTitle>
        <DialogDescription className="sr-only">
          Assign a new fitzone category to this user.
        </DialogDescription>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </DialogHeader>

      <div className="p-6 space-y-5 min-h-[150px]">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Fitzone Category</Label>
          {loading ? (
            <div className="h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
                <SelectValue placeholder="Select a Fitzone Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">No new fitzones available</div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id.toString()} className="text-sm font-medium">
                      {cat.fitzone_title} - {cat.category_title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-row justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading || submitting}
          className="h-9 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={loading || submitting || !selectedCategoryId}
          className="bg-app-primary2 hover:bg-app-primary3 text-white h-9 px-5 text-xs font-semibold shadow-sm gap-1.5 transition-colors"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Assign
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddFitzoneDialogForm;
