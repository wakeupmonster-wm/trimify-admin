import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { updateFitzoneAssignmentAPI, deleteFitzoneAssignmentAPI, getAvailableFitzoneCategoriesAPI } from "../../services/user.services";

const EditFitzoneDialogForm = ({ data, userId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [status, setStatus] = useState(data?.status || "Active");
  const [categoryId, setCategoryId] = useState(data?.category_id?.toString() || "");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchLoading(true);
      try {
        const res = await getAvailableFitzoneCategoriesAPI(userId);
        if (res?.status === 'success') {
          // Include the currently assigned category in the list so it can be selected
          const available = res?.data || [];
          const current = {
            category_id: data?.category_id,
            category_title: data?.category_title,
            fitzone_title: "(Current)" // Just to distinguish, though backend doesn't give fitzone title easily here, we'll just show category title
          };
          setCategories([current, ...available]);
        } else {
          toast.error("Failed to load available fitzones");
        }
      } catch (error) {
        toast.error("Error loading fitzones");
      } finally {
        setFetchLoading(false);
      }
    };
    
    if (userId) {
      fetchCategories();
    }
  }, [userId, data]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = { status };
      if (categoryId && categoryId !== data?.category_id?.toString()) {
        payload.new_category_id = categoryId;
      }

      const res = await updateFitzoneAssignmentAPI(userId, data.category_id, payload);
      if (res?.status === 'success') {
        toast.success("Fitzone assignment updated successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to update fitzone assignment");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this fitzone assignment?")) return;
    
    try {
      setDeleteLoading(true);
      const res = await deleteFitzoneAssignmentAPI(userId, data.category_id);
      if (res?.status === 'success') {
        toast.success("Fitzone assignment deleted successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to delete fitzone assignment");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full overflow-hidden">
      <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <DialogTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Manage Fitzone Assignment
        </DialogTitle>
        <DialogDescription className="sr-only">
          Edit or update the status of the fitzone assigned to this user.
        </DialogDescription>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </DialogHeader>

      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Fitzone Category</Label>
          {fetchLoading ? (
            <div className="h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.category_id} value={cat.category_id.toString()} className="text-sm font-medium">
                    {cat.fitzone_title ? `${cat.fitzone_title} - ` : ""}{cat.category_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active" className="text-sm font-medium">Active</SelectItem>
              <SelectItem value="Inactive" className="text-sm font-medium">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between sm:justify-between">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={loading || deleteLoading}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 px-4 text-xs font-semibold gap-1.5"
        >
          {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading || deleteLoading}
            className="h-9 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading || deleteLoading || !categoryId}
            className="bg-app-primary2 hover:bg-app-primary3 text-white h-9 px-5 text-xs font-semibold shadow-sm gap-1.5 transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
};

export default EditFitzoneDialogForm;
