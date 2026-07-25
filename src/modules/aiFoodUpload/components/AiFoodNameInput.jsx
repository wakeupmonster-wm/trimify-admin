import React, { useState } from "react";
import { X, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import AiRobotImg from "@/assets/web/ai-robot.png";

const MAX_NAMES = 50;

const AiFoodNameInput = ({ onGenerate, loading }) => {
  const [draft, setDraft] = useState("");

  const handleSubmit = () => {
    const parsedNames = draft
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set(parsedNames)];
    if (uniqueNames.length === 0 || loading) return;
    onGenerate(uniqueNames.slice(0, MAX_NAMES));
    setDraft("");
  };

  const pendingCount = draft
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean).length;

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-300/60 hover:border-app-primary2/30 transition-all px-6 py-5 flex flex-col md:flex-row items-stretch gap-8 overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-app-primary2/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left Section: Inputs */}
      <div className="flex-1 w-full flex flex-col justify-center space-y-5 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-app-primary2/10 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-app-primary2" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-800">
                Food Names
              </label>
              <p className="text-[11px] text-slate-400">
                Type a name and press Enter to add it to the batch
              </p>
            </div>
          </div>
          {/* <span className="text-[11px] font-bold text-slate-400 shrink-0">
            {pendingCount}/{MAX_NAMES}
          </span> */}
        </div>

        <div className="relative">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type or paste food names here...&#10;Example:&#10;Apple&#10;Banana&#10;Grilled Chicken"
            disabled={loading}
            className="w-full min-h-[160px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-none p-4 pb-8 border-slate-300/60 bg-slate-50/50 focus:bg-white transition-all shadow-inner"
          />
          <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
            {pendingCount}/{MAX_NAMES} items
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400 font-medium">
            * Comma also works to separate names.
          </p>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || pendingCount === 0}
            className="bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 h-10 flex items-center justify-center gap-2 font-semibold shadow-md shadow-app-primary2/20 transition-all shrink-0"
          >
            {loading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate
          </Button>
        </div>
      </div>

      {/* Right Section: AI Robot Image */}
      <div className="hidden md:flex shrink-0 w-56 lg:w-80 items-center justify-center z-10">
        <img
          src={AiRobotImg}
          alt="AI Assistant"
          className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
};

export default AiFoodNameInput;
