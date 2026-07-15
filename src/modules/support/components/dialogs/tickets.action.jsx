import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  SendHorizontal,
  Loader2,
  X,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const TicketAction = ({
  selectedTicket,
  setSelectedTicket,
  statusUpdate,
  setStatusUpdate,
  reply,
  setReply,
  handleActionSubmit,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedTicket) {
      setSuccess(false);
      setLocalLoading(false);
    }
  }, [selectedTicket]);

  const handleSubmit = async () => {
    setLocalLoading(true);
    setSuccess(false);
    try {
      const isOk = await handleActionSubmit();
      if (isOk) {
        setSuccess(true);
        setLocalLoading(false);
        setTimeout(() => {
          setSelectedTicket(null);
        }, 1500);
      } else {
        setLocalLoading(false);
      }
    } catch (err) {
      setLocalLoading(false);
    }
  };

  return (
    <Dialog
      open={!!selectedTicket}
      onOpenChange={() => !localLoading && !success && setSelectedTicket(null)}
    >
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue border border-brand-blue">
              <MessageSquare className="h-6 w-6 text-brand-blue" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                Update Support Ticket
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                Ticket ID:{" "}
                <span className="font-bold text-slate-700">
                  {selectedTicket?.ticketId || selectedTicket?._id?.slice(-8)}
                </span>
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-7 py-2 space-y-4 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* User Context Section */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              User Inquiry Context
            </Label>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue" />
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                  "
                  {selectedTicket?.subject ||
                    selectedTicket?.message ||
                    "No subject provided"}
                  "
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Status Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ticket Status
                </Label>
                {statusUpdate === "open" && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold animate-pulse uppercase tracking-tight">
                    Awaiting Response
                  </span>
                )}
              </div>
              <Select
                value={statusUpdate}
                onValueChange={setStatusUpdate}
                disabled={localLoading || success}
              >
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                  <SelectValue placeholder="Update status..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem
                    value="open"
                    className="text-xs font-bold py-2.5 focus:bg-slate-50"
                  >
                    Open
                  </SelectItem>
                  <SelectItem
                    value="in_progress"
                    className="text-xs font-bold py-2.5 focus:bg-slate-50"
                  >
                    In Progress
                  </SelectItem>
                  <SelectItem
                    value="resolved"
                    className="text-xs font-bold py-2.5 focus:bg-slate-50 text-emerald-600"
                  >
                    Resolved
                  </SelectItem>
                  {/* <SelectItem
                    value="closed"
                    className="text-xs font-bold py-2.5 focus:bg-slate-50 text-rose-500"
                  >
                    Closed
                  </SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Official Response */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Official Response <span className="text-rose-500">*</span>
              </Label>
              <div className="relative group">
                <Textarea
                  placeholder="Type your official response here..."
                  className="min-h-[140px] text-sm font-medium border-slate-200 bg-slate-50/30 focus-visible:border-slate-500 resize-none p-4 rounded-xl transition-all"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  disabled={localLoading || success}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md border border-slate-100 shadow-sm">
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      reply?.length > 500 ? "text-rose-500" : "text-slate-400",
                    )}
                  >
                    {reply?.length ?? 0}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold">
                    / 1000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-7 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center sm:justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={() => setSelectedTicket(null)}
            disabled={localLoading || success}
            className="h-10 px-4 font-semibold text-xs text-slate-600 border-slate-200 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className={cn(
              "h-10 px-4 text-white font-black text-xs rounded-md shadow-lg disabled:cursor-not-allowed transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 min-w-[140px]",
              success
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-brand-blue hover:bg-brand-hoverAqua shadow-brand-blue",
            )}
            disabled={
              localLoading || success || !statusUpdate || !reply?.trim()
            }
          >
            {localLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in duration-300 text-white" />
                <span>Submitted!</span>
              </>
            ) : (
              <>
                <SendHorizontal className="w-4 h-4" />
                <span>Submit Response</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
