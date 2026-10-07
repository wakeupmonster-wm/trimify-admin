import React, { useState, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, X, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  getAvailableProgramsAPI,
  addProgramAssignmentAPI,
} from "../../services/user.services";
import { getProgramManagementAPI } from "@/modules/manageProgram/services/program.services";
import { getProgramDurationAPI } from "@/modules/manageProgram/services/diet.services";

// Format duration for display (e.g. 4 -> "4 Weeks", "4 Weeks" -> "4 Weeks")
const formatDurationDisplay = (duration) => {
  if (duration === null || duration === undefined || duration === "") return "";
  const str = String(duration).trim();
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return `${num} Week${num === 1 ? "" : "s"}`;
  }
  return str;
};

// Auto-calculate end date based on start date (YYYY-MM-DD) and duration
export const calculateEndDate = (startDateStr, duration) => {
  if (!startDateStr || duration === null || duration === undefined || duration === "") {
    return "";
  }

  const parts = startDateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "";
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "";

  const durationStr = String(duration).trim().toLowerCase();

  // 1. Check for explicit days (e.g., "30 days", "15 day")
  const daysMatch = durationStr.match(/^(\d+)\s*day/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    date.setDate(date.getDate() + days);
    return formatDateToYYYYMMDD(date);
  }

  // 2. Check for explicit months (e.g., "1 month", "3 months")
  const monthsMatch = durationStr.match(/^(\d+)\s*month/);
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10);
    date.setMonth(date.getMonth() + months);
    return formatDateToYYYYMMDD(date);
  }

  // 3. Weeks (standard for Program Management in Trimify, e.g. 4, 6, 8, "4 Weeks")
  const numberMatch = durationStr.match(/\d+/);
  if (numberMatch) {
    const weeks = parseInt(numberMatch[0], 10);
    if (!isNaN(weeks) && weeks > 0) {
      date.setDate(date.getDate() + weeks * 7);
      return formatDateToYYYYMMDD(date);
    }
  }

  return "";
};

const formatDateToYYYYMMDD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return format(d, "dd MMM yyyy");
      }
    }
  } catch {
    // fallback
  }
  return dateStr;
};

const AddProgramDialogForm = ({
  userId,
  enrolledPrograms = [],
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingDuration, setFetchingDuration] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const [availRes, allProgsRes] = await Promise.allSettled([
          getAvailableProgramsAPI(userId),
          getProgramManagementAPI({ limit: 100 }),
        ]);

        let rawPrograms = [];
        if (
          availRes.status === "fulfilled" &&
          availRes.value?.status === "success"
        ) {
          rawPrograms = Array.isArray(availRes.value?.data)
            ? availRes.value.data
            : Array.isArray(availRes.value?.programs)
              ? availRes.value.programs
              : [];
        } else if (
          allProgsRes.status === "fulfilled" &&
          allProgsRes.value?.status === "success"
        ) {
          rawPrograms = allProgsRes.value?.programs || [];
        }

        // Map program ID -> duration from Program Management to enrich available programs if duration is missing
        const durationMap = new Map();
        if (allProgsRes.status === "fulfilled" && allProgsRes.value?.programs) {
          allProgsRes.value.programs.forEach((p) => {
            if (p?.id != null && p?.duration != null) {
              durationMap.set(String(p.id), p.duration);
            }
          });
        }

        // Exclude programs already enrolled/assigned to this user
        const enrolledIds = new Set(
          (enrolledPrograms || [])
            .map((p) => p.program_id ?? p.id)
            .filter(Boolean)
            .map((id) => String(id))
        );
        const enrolledTitles = new Set(
          (enrolledPrograms || [])
            .map((p) => (p.title || "").trim().toLowerCase())
            .filter(Boolean)
        );

        const filtered = rawPrograms
          .map((prog) => {
            const idStr = String(prog.id ?? prog.program_id ?? "");
            const duration =
              prog.duration || durationMap.get(idStr) || "";
            return { ...prog, duration };
          })
          .filter((prog) => {
            const progId = String(prog.id ?? prog.program_id ?? "");
            const progTitle = (prog.title || "").trim().toLowerCase();

            // Do not show in dropdown if already assigned to this user
            if (progId && enrolledIds.has(progId)) return false;
            if (progTitle && enrolledTitles.has(progTitle)) return false;

            return true;
          });

        setPrograms(filtered);
      } catch (err) {
        toast.error("Error loading programs");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPrograms();
    }
  }, [userId, enrolledPrograms]);

  const handleProgramChange = async (programId) => {
    setSelectedProgramId(programId);
    const prog = programs.find((p) => String(p.id) === String(programId));
    let dur = prog?.duration;

    if (!dur) {
      // If duration is not on the object, fetch it directly
      try {
        setFetchingDuration(true);
        const res = await getProgramDurationAPI(programId);
        dur =
          res?.getprogramduration?.duration ||
          res?.duration ||
          res?.data?.duration;
      } catch (e) {
        console.warn("Failed to fetch program duration", e);
      } finally {
        setFetchingDuration(false);
      }
    }

    setCurrentDuration(dur || "");

    if (dur && startDate) {
      const calculated = calculateEndDate(startDate, dur);
      setEndDate(calculated);
    } else {
      setEndDate("");
    }
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    if (currentDuration && newDate) {
      const calculated = calculateEndDate(newDate, currentDuration);
      setEndDate(calculated);
    } else {
      setEndDate("");
    }
  };

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
        {/* Program Selection Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">Program</Label>
          {loading ? (
            <div className="h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <Select
              value={selectedProgramId}
              onValueChange={handleProgramChange}
            >
              <SelectTrigger className="w-full h-10 border-slate-300 text-sm font-medium">
                <SelectValue placeholder="Select a Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">
                    No available programs to assign
                  </div>
                ) : (
                  programs.map((prog) => (
                    <SelectItem
                      key={prog.id}
                      value={prog.id.toString()}
                      className="text-sm font-medium"
                    >
                      {prog.title}{" "}
                      {prog.duration
                        ? `(${formatDurationDisplay(prog.duration)})`
                        : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Start Date & Auto-Calculated End Date */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Start Date: Admin selects */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Start Date
            </Label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="h-10 w-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-app-primary2/20 focus:border-app-primary2 transition-colors"
            />
          </div>

          {/* End Date: Automatically calculated from program duration */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                End Date
              </Label>
              {fetchingDuration ? (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" /> Calculating...
                </span>
              ) : currentDuration ? (
                <span className="text-[10px] font-semibold text-app-primary2 bg-app-primary2/10 px-1.5 py-0.5 rounded">
                  Auto ({formatDurationDisplay(currentDuration)})
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Auto
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                readOnly
                tabIndex={-1}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-100/70 px-3 py-2 text-sm text-slate-700 cursor-not-allowed select-none focus:outline-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* End Date Human-readable info preview */}
        {endDate && (
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200/80 rounded-md px-3 py-1.5 flex items-center justify-between">
            <span>
              Duration:{" "}
              <strong className="text-slate-700">
                {formatDurationDisplay(currentDuration) || "Scheduled"}
              </strong>
            </span>
            <span>
              Calculated End:{" "}
              <strong className="text-slate-800">
                {formatDisplayDate(endDate)}
              </strong>
            </span>
          </div>
        )}
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
