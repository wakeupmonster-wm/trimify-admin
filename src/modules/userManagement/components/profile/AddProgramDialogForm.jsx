import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { getAvailableProgramsAPI, addProgramAssignmentAPI } from "../../services/user.services";

const AddProgramDialogForm = ({ userId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await getAvailableProgramsAPI(userId);
        if (res?.status === "success") {
          setPrograms(res?.data || []);
        } else {
          toast.error("Failed to load available programs");
        }
      } catch (error) {
        toast.error("Error loading programs");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPrograms();
    }
  }, [userId]);

  const handleAdd = async () => {
    if (!selectedProgramId) {
      toast.error("Please select a program");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        program_id: Number(selectedProgramId),
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };

      const res = await addProgramAssignmentAPI(userId, payload);
      if (res?.status === "success") {
        toast.success("Program assigned successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to assign program");
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
          Assign Program
        </DialogTitle>
        <DialogDescription className="sr-only">
          Assign a program to this user.
        </DialogDescription>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </DialogHeader>

      <div className="p-6 space-y-4 min-h-[160px]">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Program</Label>
          {loading ? (
            <div className="h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
                <SelectValue placeholder="Select a Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">
                    No available programs to assign
                  </div>
                ) : (
                  programs.map((prog) => (
                    <SelectItem
                      key={prog.id}
                      value={prog.id.toString()}
                      className="text-sm font-medium"
                    >
                      {prog.title} {prog.duration ? `(${prog.duration})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Start Date</Label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-app-primary2/20 focus:border-app-primary2"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              End Date
            </Label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-app-primary2/20 focus:border-app-primary2"
            />
          </div>
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
          disabled={loading || submitting || !selectedProgramId}
          className="bg-app-primary2 hover:bg-app-primary3 text-white h-9 px-5 text-xs font-semibold shadow-sm gap-1.5 transition-colors"
        >
          {submitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Assign
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddProgramDialogForm;
