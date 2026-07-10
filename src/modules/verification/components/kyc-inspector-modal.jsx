import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconShieldCheck, IconX, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ZoomableImage } from "../../users/components/zoomable.image";
import DashboardHead from "@/components/shared/dashboard.head";

export function KYCInspectorModal({
  config,
  onClose,
  onApprove,
  onReject,
  isVerifying,
}) {
  if (!config.open) return null;

  const displayImages =
    config.images && config.images.length > 0
      ? config.images
      : [{ src: config.src, label: config.title }];

  const isRejected = config.status === "rejected";
  const isApproved = config.status === "approved";
  const isActionDisabled = isVerifying || isApproved;

  return (
    <Dialog open={config.open} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-5xl 3xl:max-w-[1280px] w-full flex flex-col p-0 pb-6 gap-6 bg-white overflow-hidden rounded-xl border-none shadow-sm",
        isApproved ? "h-[75vh] 3xl:h-[65vh]" : "h-[90vh] 3xl:h-[80vh]"
      )}>
        {/* --- MODAL HEADER --- */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <DashboardHead
            title="Visual Identity Inspector"
            titleSizeClass="text-[18px]"
            iconSizeClass="w-12 h-12 rounded-xl shadow-lg shadow-brand-aqua/10"
            iconInnerClass="h-6 w-6"
            subtitle={
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-400">
                  Reviewing:
                </span>
                <span className="text-xs font-semibold text-brand-aqua">
                  {config.userName || "Unknown User"}
                </span>
              </div>
            }
            Icon={IconShieldCheck}
            iconColor="text-brand-aqua"
            iconBg="bg-brand-aqua/10"
          />
          {/* <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
          >
            <IconX size={20} strokeWidth={2.5} />
          </button> */}
        </div>

        {/* --- MODAL BODY --- */}
        <div className="flex-1 overflow-y-auto px-6 bg-white">
          <div
            className={cn(
              "grid gap-6 h-full min-h-[300px]",
              displayImages.length > 1
                ? "md:grid-cols-2"
                : "grid-cols-1 max-w-2xl mx-auto",
            )}
          >
            {displayImages.map((img, idx) => (
              <ZoomableImage
                key={idx}
                src={img.src}
                label={img.label}
                alt={img.label}
                userName={config.userName}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* --- MODAL FOOTER --- */}
        {!isApproved && (
          <div className="px-8 py-6 bg-white border-t border-slate-300 flex gap-4 shrink-0">
            {!isRejected && (
              <Button
                className="flex-1 h-12 3xl:h-14 bg-alerts-error hover:bg-alerts-error_dark text-white hover:text-white font-bold uppercase tracking-[0.1em] text-[13px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed"
                onClick={() => onReject(config.userId, config.userName)}
                disabled={isActionDisabled || isRejected}
              >
                <IconX className="w-4 h-4" strokeWidth={3} />
                Reject Document
              </Button>
            )}
            <Button
              className="flex-1 h-12 3xl:h-14 bg-alerts-success hover:bg-alerts-success_dark text-white hover:text-white font-bold uppercase tracking-[0.1em] text-[13px] rounded-lg shadow-sm border-none transition-all flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed"
              onClick={() =>
                onApprove(
                  config.userId,
                  config.userName,
                  isRejected ? "re-approve" : "approve",
                )
              }
              disabled={isActionDisabled}
            >
              <IconCheck className="w-4 h-4" strokeWidth={3} />
              {isRejected ? "Re-approve Identity" : "Approve Identity"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
