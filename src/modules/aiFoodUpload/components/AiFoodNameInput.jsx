import React, { useState } from "react";
import { X, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const MAX_NAMES = 50;

const AiFoodNameInput = ({ onGenerate, loading }) => {
  const [names, setNames] = useState([]);
  const [draft, setDraft] = useState("");

  const addName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (names.length >= MAX_NAMES) return;
    const exists = names.some((n) => n.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setDraft("");
      return;
    }
    setNames((prev) => [...prev, trimmed]);
    setDraft("");
  };

  const removeName = (index) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addName(draft);
    } else if (e.key === "Backspace" && !draft && names.length > 0) {
      removeName(names.length - 1);
    }
  };

  const handleSubmit = () => {
    const finalNames = [...names];
    if (draft.trim()) finalNames.push(draft.trim());
    if (finalNames.length === 0 || loading) return;
    onGenerate(finalNames.slice(0, MAX_NAMES));
    setNames([]);
    setDraft("");
  };

  const pendingCount = names.length + (draft.trim() ? 1 : 0);

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-300/60 hover:border-app-primary2/30 transition-colors p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-app-primary2/10 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-app-primary2" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-800">Food Names</label>
            <p className="text-[11px] text-slate-400">Type a name and press Enter to add it to the batch</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-400 shrink-0">
          {pendingCount}/{MAX_NAMES}
        </span>
      </div>

      <div className="min-h-[48px] flex flex-wrap items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-50/50 px-3 py-2.5 transition-all focus-within:bg-white focus-within:border-app-primary2 focus-within:ring-2 focus-within:ring-app-primary2/15">
        {names.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-app-primary2/10 border border-app-primary2/20 text-app-primary2 text-xs font-semibold pl-3 pr-2 py-1"
          >
            {name}
            <button
              type="button"
              onClick={() => removeName(index)}
              className="rounded-full hover:bg-app-primary2/25 p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            names.length === 0
              ? "Type a food name and press Enter…"
              : "Add another…"
          }
          className="flex-1 min-w-[160px] border-none outline-none text-sm bg-transparent placeholder:text-slate-400"
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] text-slate-400">Comma also works to separate names.</p>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || pendingCount === 0}
          className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all shrink-0"
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
  );
};

export default AiFoodNameInput;
