import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  Pencil,
  FileText,
  LayoutGrid,
  CheckCircle,
  ShieldCheck,
  Check,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const FeatureDialog = ({
  open,
  setOpen,
  editing,
  formData,
  setFormData,
  onSubmit,
  loading,
  isUploading,
  onFileUpload,
  fileInputRef,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileUpload({ target: { files: [file] } });
    }
  };

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setLocalLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLocalLoading(true);
    setSuccess(false);
    try {
      const isOk = await onSubmit();
      if (isOk) {
        setSuccess(true);
        setLocalLoading(false);
      } else {
        setLocalLoading(false);
      }
    } catch (err) {
      setLocalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-primary2 border border-app-primary2">
              <Sparkles className="h-5 w-5 text-app-primary2" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">
                {editing ? "Update Premium Perk" : "Create New Premium Perk"}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-500 font-medium">
                {editing
                  ? "Edit and update the perk details"
                  : "Define a new premium feature for the subscription plans"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="px-6 py-4 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            {/* Key */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Key <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  disabled={editing}
                  placeholder="e.g. ad_free_experience"
                  className={cn(
                    "h-10 pl-9 text-[13px] font-medium rounded-lg border-slate-300/60 shadow-none focus-visible:border-slate-500 transition-all",
                    editing &&
                      "bg-slate-50 border-slate-300/60 text-slate-400 cursor-not-allowed",
                  )}
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      key: e.target.value.toLowerCase().replace(/ /g, "_"),
                    })
                  }
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Display Name <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="e.g. Ad-Free Experience"
                  className="h-10 pl-9 text-[13px] font-medium rounded-lg border-slate-300/60 shadow-none focus-visible:border-slate-500 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Description <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
              <Textarea
                placeholder="What does this feature provide?"
                className="min-h-[80px] pl-9 text-[13px] font-medium rounded-lg border-slate-300/60 shadow-none focus-visible:border-slate-500 transition-all resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Icon Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">
              Upload Icon (SVG/PNG){" "}
              <span className="text-red-400 font-normal">*</span>
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-app-primary2 bg-blue-50"
                  : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                className="hidden"
                accept="image/svg+xml,image/png,image/jpeg"
                ref={fileInputRef}
                onChange={onFileUpload}
              />
              <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
              <p className="text-sm font-semibold text-slate-700 text-center">
                {isUploading
                  ? "Uploading..."
                  : formData.icon
                    ? "Icon selected. Click or drag to replace."
                    : "Click or drag and drop to upload"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                SVG, PNG, JPG (max. 800x400px)
              </p>
            </div>
          </div>

          {/* Settings Switches */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <CheckCircle size={14} />
                </div>
                <span className="text-[13px] font-bold text-slate-700">
                  Active
                </span>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, isActive: val })
                }
                className="data-[state=checked]:bg-app-primary2"
              />
            </div>
            {/* <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                  <ShieldCheck size={14} />
                </div>
                <span className="text-[13px] font-bold text-slate-700">
                  Premium only
                </span>
              </div>
              <Switch
                checked={formData.isPremiumOnly}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, isPremiumOnly: val })
                }
                className="data-[state=checked]:bg-amber-400"
              />
            </div> */}
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center sm:justify-end gap-2.5">
          <Button
            variant="ghost"
            className="rounded-lg font-bold text-[11px] h-9 px-4 text-slate-500 hover:bg-slate-100 transition-all"
            onClick={() => setOpen(false)}
            disabled={localLoading || success}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "rounded-lg px-5 font-bold text-[11px] h-9 gap-2 transition-all active:scale-95 flex items-center justify-center min-w-[130px]",
              success
                ? "bg-green-500 hover:bg-green-600 text-white shadow-none border border-emerald-800/20"
                : "bg-app-primary2 hover:bg-brand-hoverAqua text-white shadow-md shadow-app-primary2",
            )}
            onClick={handleSubmit}
            disabled={localLoading || success}
          >
            {localLoading ? (
              <>
                <Loader2 className="animate-spin w-3.5 h-3.5 text-white" />
                <span>Saving...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in duration-300 text-white" />
                <span>Saved!</span>
              </>
            ) : editing ? (
              "Save Changes"
            ) : (
              "Create Perk"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
