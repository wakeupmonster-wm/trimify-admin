import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Users,
  User,
  MapPin,
  Calendar,
  UsersRound,
  Save,
  Loader2,
  ChevronDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GENDER_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "non-binary", label: "Non-Binary" },
  { value: "trans-man", label: "Trans Man" },
  { value: "trans-women", label: "Trans Women" },
  { value: "genderqueer", label: "Genderqueer" },
  { value: "everyone", label: "Everyone (Mixed)" },
];

export function BulkCreateModal({ isOpen, onClose, onConfirm, cities = [], onManageCitiesClick, selectedCityOverride }) {
  const [count, setCount] = useState(10);
  const [gender, setGender] = useState("women");
  const [minAge, setMinAge] = useState(22);
  const [maxAge, setMaxAge] = useState(35);
  
  // Default to first city if available
  const [city, setCity] = useState("");

  // Update city when cities prop changes, modal opens, or selectedCityOverride changes
  React.useEffect(() => {
    if (selectedCityOverride) {
      setCity(selectedCityOverride);
    } else if (isOpen && cities.length > 0 && !city) {
      setCity(cities[0].name);
    }
  }, [isOpen, cities, selectedCityOverride]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (count < 1 || count > 500) {
      toast.error("Count must be between 1 and 500");
      return;
    }

    if (Number(minAge) < 18) {
      toast.error("Minimum age must be at least 18");
      return;
    }

    if (Number(maxAge) > 60) {
      toast.error("Maximum age cannot exceed 60");
      return;
    }

    if (Number(minAge) > Number(maxAge)) {
      toast.error("Minimum age cannot be greater than maximum age");
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        count: Number(count),
        gender,
        ageRange: {
          min: Number(minAge),
          max: Number(maxAge),
        },
        city,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onOpenChange) => !loading && onClose()}
    >
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
              <UsersRound className="h-6 w-6 text-brand-aqua" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight text-left">
                Bulk Create Profiles
              </DialogTitle>
              <DialogDescription className="text-[12px] text-slate-500 font-medium text-left">
                Configure parameters for generating automated profiles.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="px-7 py-6 space-y-5 bg-white">
          {/* Row 1: Count + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Count (1–500) <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Gender <span className="text-red-400">*</span>
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-12 text-sm font-medium rounded-md border-slate-300 shadow-none focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 px-3 pl-10 relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {GENDER_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Age Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Min Age <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  min="18"
                  max="100"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Max Age <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  min="18"
                  max="100"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3: City */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Target City <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-2">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="flex-1 h-12 text-sm font-medium rounded-md border-slate-300 shadow-none focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 px-3 pl-10 relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {cities.map((c) => (
                    <SelectItem key={c._id || c.name} value={c.name} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {onManageCitiesClick && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={onManageCitiesClick}
                  className="h-12 w-12 shrink-0 border-slate-300 text-slate-500 hover:text-brand-aqua hover:border-brand-aqua hover:bg-brand-aqua/5 transition-colors"
                  title="Add new city"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-semibold text-[13px] text-slate-600 border-slate-300 h-10 px-6 rounded-md hover:bg-slate-100 shadow-none disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || count < 1 || count > 500}
            className="bg-brand-aqua hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Generate {count} Profiles
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
