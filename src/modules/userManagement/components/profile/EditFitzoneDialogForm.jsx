import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Trash2, X } from "lucide-react";

const EditFitzoneDialogForm = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState(data?.status || "Active");

  const handleUpdate = async () => {
    setLoading(true);
    // Simulate API call for now since backend endpoint is missing
    setTimeout(() => {
      toast.success("Fitzone assignment updated successfully");
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    // Simulate API call for now
    setTimeout(() => {
      toast.success("Fitzone assignment deleted successfully");
      setDeleteLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full overflow-hidden">
      <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <DialogTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Manage Fitzone Assignment
        </DialogTitle>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </DialogHeader>

      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Fitzone Category
          </Label>
          <Input
            value={data?.category_title || ""}
            disabled
            className="h-10 bg-slate-50 border-slate-200 text-slate-500 text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active" className="text-sm font-medium">
                Active
              </SelectItem>
              <SelectItem value="Inactive" className="text-sm font-medium">
                Inactive
              </SelectItem>
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
          {deleteLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
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
            disabled={loading || deleteLoading}
            className="bg-app-primary2 hover:bg-app-primary3 text-white h-9 px-5 text-xs font-semibold shadow-sm gap-1.5 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
};

export default EditFitzoneDialogForm;
