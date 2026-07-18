import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div className="bg-white rounded-md shadow-sm border border-slate-300/60 p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">
          Food Names
        </label>
        <div className="min-h-[44px] flex flex-wrap items-center gap-2 rounded-md border border-slate-300/60 px-3 py-2 focus-within:ring-1 focus-within:ring-brand-blue">
          {names.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-app-primary2/10 text-brand-blue text-xs font-medium pl-3 pr-2 py-1"
            >
              {name}
              <button
                type="button"
                onClick={() => removeName(index)}
                className="rounded-full hover:bg-app-primary2/20 p-0.5"
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
            className="flex-1 min-w-[160px] border-none outline-none text-sm bg-transparent"
            disabled={loading}
          />
        </div>
        <p className="text-[10px] text-slate-500">
          Press Enter or comma to add a name. Up to {MAX_NAMES} at once (
          {pendingCount}/{MAX_NAMES}).
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || pendingCount === 0}
          className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 font-semibold shadow-sm transition-all"
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
