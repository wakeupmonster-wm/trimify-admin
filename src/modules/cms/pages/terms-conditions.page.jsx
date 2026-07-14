import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  ReceiptText,
  Save,
  Eye,
  PenLine,
  Plus,
  FileText,
  Layers,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTermsAndCondition,
  updateTermsAndCondition,
} from "../store/t&c.slice";
import { PageHeader } from "@/components/common/headSubhead";
import { Container } from "@/components/common/container";
// import { termsContent } from "@/constants/term.conditions";
import {
  termsContentToSections,
  sectionsToFullHtml,
  fullHtmlToSections,
} from "../utils/termsDataConverter";
import TermsSectionCard from "../components/TermsSectionCard";
import "../styles/terms-editor.css";
import { htmlContent } from "@/constants/htmlContent";

export default function TermAndConditionsPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.termsAndcondition);
  const [isSaving, setIsSaving] = useState(false);

  // ── Page title ──
  const [pageTitle, setPageTitle] = useState("Terms & Conditions");

  // ── Section-based state ──
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());

  // ── View / Edit mode ──
  const [viewMode, setViewMode] = useState("edit"); // "view" | "edit"

  // ── Load data from API or fallback to constants ──
  useEffect(() => {
    dispatch(fetchTermsAndCondition());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setPageTitle(data.title || "Terms & Conditions");

      if (data.description) {
        // Try parsing backend HTML — only use it if it has our section markers
        const parsed = fullHtmlToSections(data.description);
        const hasStructuredSections =
          parsed.length > 1 ||
          (parsed.length === 1 && parsed[0].id !== "full-document");

        if (hasStructuredSections) {
          setSections(parsed);
          return;
        }
      }
    }

    // Fallback: convert structured JS constants to initial sections
    // const initialSections = termsContentToSections(termsContent);
    // setSections(initialSections);
  }, [data]);

  // ── Preview in New Tab ──
  const handleViewPreview = useCallback(() => {
    setViewMode("view");
    const fullHtml = sectionsToFullHtml(sections);

    // Clean HTML to prevent word-splitting issues (replace non-breaking spaces with normal spaces)
    const cleanedHtml = fullHtml.replace(/&nbsp;/g, " ");

    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      toast.error("Pop-up blocked! Please allow pop-ups to view the preview.");
      return;
    }

    const previewHtml = htmlContent({ pageTitle, cleanedHtml });

    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  }, [sections, pageTitle]);

  // ── Expand first 2 sections by default ──
  useEffect(() => {
    if (sections.length > 0 && expandedSections.size === 0) {
      setExpandedSections(
        new Set([sections[0]?.id, sections[1]?.id].filter(Boolean)),
      );
    }
  }, [sections]);

  // ── Toggle expand/collapse ──
  const toggleExpand = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // ── Expand / Collapse All ──
  const expandAll = useCallback(() => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  }, [sections]);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  // ── Update a section ──
  const handleUpdateSection = useCallback((sectionId, updatedSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? updatedSection : s)),
    );
    toast.success("Section updated");
  }, []);

  // ── Delete a section ──
  const handleDeleteSection = useCallback((sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
    toast.success("Section removed");
  }, []);

  // ── Add new section ──
  const handleAddSection = useCallback(() => {
    const newId = `section-${Date.now()}`;
    const newSection = {
      id: newId,
      title: `${sections.length + 1}. New Section`,
      iconName: "FileText",
      html: "<p>Enter section content here…</p>",
    };
    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => new Set(prev).add(newId));
    toast.success("New section added");
  }, [sections.length]);

  // ── Save All to backend ──
  const handleSaveAll = useCallback(async () => {
    if (sections.length === 0) {
      return toast.error("No sections to save");
    }

    setIsSaving(true);
    try {
      const fullHtml = sectionsToFullHtml(sections);
      await dispatch(
        updateTermsAndCondition({
          title: pageTitle,
          description: fullHtml,
        }),
      ).unwrap();
      toast.success("Terms & Conditions saved successfully");
    } catch (error) {
      toast.error(error || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [dispatch, pageTitle, sections]);

  // ── Stats ──
  const sectionCount = sections.length;
  const allExpanded =
    expandedSections.size === sectionCount && sectionCount > 0;

  return (
    <Container className="px-0">
      {/* ══════════ Sticky Header ══════════ */}
      <header className="sticky top-0 z-20 px-6 bg-white backdrop-blur-md">
        <div className="w-full mx-auto py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader
            heading="Terms & Conditions"
            icon={<ReceiptText className="w-6 h-6 text-white" />}
            color="bg-brand-aqua"
            subheading="Manage legal policies and user agreements."
          />

          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <Button
              onClick={handleViewPreview}
              className="h-9 group shadow-sm bg-white text-slate-500 border border-slate-200 transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5 hover:bg-white hover:text-slate-500"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300" />
              View
            </Button>
            {/* <button
                className={`tc-mode-toggle__btn ${viewMode === "edit" ? "tc-mode-toggle__btn--active" : ""}`}
                onClick={() => setViewMode("edit")}
              >
                <PenLine size={14} />
                Edit
              </button> */}

            <Button
              onClick={handleSaveAll}
              disabled={isSaving || loading}
              className="bg-brand-aqua hover:bg-brand-hoverAqua text-white font-semibold text-xs gap-2 h-9 px-4 shadow-sm rounded-md transition-all border-none"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1" />
              )}
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* ══════════ Toolbar Bar ══════════ */}
      <div className="px-6 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <span className="tc-stats-badge">
            <Layers size={13} />
            {sectionCount} {sectionCount === 1 ? "Section" : "Sections"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-xs font-semibold text-slate-500 hover:text-brand-aqua transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      {/* ══════════ Main Content ══════════ */}
      <main className="p-6 pt-4 bg-white">
        {/* Document Title (Edit mode only) */}
        {viewMode === "edit" && (
          <div className="mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">
              Document Title
            </label>
            <Input
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="e.g. Terms & Conditions"
              className="h-10 border-slate-200 focus-visible:ring-brand-aqua/20 focus-visible:border-slate-400 shadow-sm rounded-lg px-4 text-slate-700 font-medium"
            />
          </div>
        )}

        {/* Sections list */}
        {sections.length > 0 ? (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <TermsSectionCard
                key={section.id}
                section={section}
                index={index}
                isExpanded={expandedSections.has(section.id)}
                onToggleExpand={() => toggleExpand(section.id)}
                onUpdate={handleUpdateSection}
                onDelete={handleDeleteSection}
                totalSections={sectionCount}
              />
            ))}

            {/* Add New Section (Edit mode only) */}
            {viewMode === "edit" && (
              <button className="tc-add-section" onClick={handleAddSection}>
                <Plus size={18} />
                Add New Section
              </button>
            )}
          </div>
        ) : (
          <div className="tc-empty-state">
            <div className="tc-empty-state__icon">
              <FileText size={28} />
            </div>
            <p className="tc-empty-state__title">No sections yet</p>
            <p className="tc-empty-state__desc">
              Click "Add New Section" to start building your Terms & Conditions
              document.
            </p>
            {viewMode === "edit" && (
              <button
                className="tc-add-section mt-6"
                style={{ maxWidth: 320 }}
                onClick={handleAddSection}
              >
                <Plus size={18} />
                Add First Section
              </button>
            )}
          </div>
        )}
      </main>
    </Container>
  );
}
