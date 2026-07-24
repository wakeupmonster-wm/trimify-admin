import React from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/headSubhead";
import AiFoodImagePromptPanel from "./AiFoodImagePromptPanel";

const AiFoodCustomRegenerateModal = ({
  isOpen,
  onClose,
  foodName,
  onGenerateFromPrompt,
  onGenerateFromAudio,
  busy,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 border-none shadow-2xl overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl">
        <DialogHeader className="p-6 pb-5">
          <DialogTitle className="sr-only">Custom Image Generation</DialogTitle>
          <PageHeader
            heading="Custom Image Generation"
            icon={<Sparkles className="w-5 h-5 text-white shrink-0" />}
            variant="primary"
            subheading={
              <span className="text-slate-500 font-medium">
                Describe the perfect dish or use your voice to tell the AI how you want{" "}
                <span className="font-bold text-slate-700">{foodName}</span> to look.
              </span>
            }
          />
        </DialogHeader>

        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 relative">
          <AiFoodImagePromptPanel
            onGenerateFromPrompt={onGenerateFromPrompt}
            onGenerateFromAudio={onGenerateFromAudio}
            onCancel={onClose}
            busy={busy}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiFoodCustomRegenerateModal;
