import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { apiConnector } from "@/services/axios/axios.connector";
import { BASE_URL } from "@/services/api-endpoints/base.url";
import AiRobotImg from "@/assets/web/ai-robot.png";

const MAX_NAMES = 50;

const AiFoodNameInput = ({ onGenerate, loading }) => {
  const [names, setNames] = useState([]);
  const [draft, setDraft] = useState("");
  const [debouncedDraft, setDebouncedDraft] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [creativeMode, setCreativeMode] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDraft(draft), 400);
    return () => clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      const q = debouncedDraft.trim();
      if (!q) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const res = await apiConnector(
          "GET",
          `${BASE_URL}/admin/ai-food/search-suggestions?q=${encodeURIComponent(q)}&creative=${creativeMode ? 1 : 0}`,
          null,
          null,
          null
        );
        if (controller.signal.aborted) return;

        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && typeof res === 'object') {
          list = res.suggestions || res.data?.suggestions || res.data?.data?.suggestions || [];
          if (!Array.isArray(list)) {
            list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
          }
        }

        if (!controller.signal.aborted && Array.isArray(list)) {
          setSuggestions(list);
          setShowSuggestions(list.length > 0);
        }
      } catch (e) {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [debouncedDraft, creativeMode]);

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
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addName(draft);
    } else if (e.key === "Backspace" && !draft && names.length > 0) {
      removeName(names.length - 1);
    }
  };

  const handleSubmit = () => {
    const parsedDraftNames = draft
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set([...names, ...parsedDraftNames])];
    if (uniqueNames.length === 0 || loading) return;
    onGenerate(uniqueNames.slice(0, MAX_NAMES));
    setNames([]);
    setDraft("");
  };

  const pendingCount =
    names.length +
    draft
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter(Boolean).length;

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-300/60 hover:border-app-primary2/30 transition-all px-4 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 overflow-hidden">

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

        <div className="relative" ref={wrapperRef}>
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
              onChange={(e) => {
                setDraft(e.target.value);
                if (!e.target.value.trim()) setShowSuggestions(false);
              }}
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

          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300/60 rounded-md shadow-lg max-h-60 overflow-auto">
              {loadingSuggestions ? (
                <div className="p-3 text-sm text-slate-500 text-center">
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((s, i) => {
                    const suggestionText = typeof s === "string" ? s : s.name || s.title || s.Food_Name;
                    if (!suggestionText) return null;
                    return (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                        onClick={() => {
                          addName(suggestionText);
                          setShowSuggestions(false);
                        }}
                      >
                        <span>{suggestionText}</span>
                        {creativeMode && (
                          <span className="text-[10px] font-medium text-app-primary2 bg-app-primary2/10 px-1.5 py-0.5 rounded">AI</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-3 text-sm text-slate-500 text-center">
                  No suggestions found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400 font-medium">
            * Comma also works to separate names.
          </p>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || pendingCount === 0}
            className="bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 h-10 flex items-center justify-center gap-2 font-semibold shadow-md shadow-app-primary2/20 transition-all shrink-0 w-full sm:w-auto"
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
      <div className="hidden md:flex shrink-0 w-56 lg:w-64 items-center justify-center z-10">
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
