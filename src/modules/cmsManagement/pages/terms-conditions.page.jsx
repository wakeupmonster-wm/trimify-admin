import React, { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Eye, ReceiptText, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { htmlContent } from "@/constants/htmlContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCmsPages, updateCmsContent } from "../store/cms.management.slice";

export default function TermAndConditionsPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.cmsManagement);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Find the page ID and initial content from Redux state
  const pageData = data?.find((page) =>
    page.page_name?.toLowerCase().includes("terms"),
  );

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchCmsPages({ page: 1 }));
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (pageData && pageData.description) {
      setContent(pageData.description);
    }
  }, [pageData]);

  const handleSave = async () => {
    if (!content.trim()) {
      return toast.error("Content cannot be empty.");
    }

    if (!pageData?.id) {
      return toast.error("Page ID not found. Cannot save.");
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateCmsContent({
          id: pageData.id,
          page_name: pageData.page_name || "Terms & Conditions",
          description: content,
        }),
      ).unwrap();

      toast.success("Terms & Conditions saved successfully.");
    } catch (error) {
      toast.error(error || "Failed to save content.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewPreview = useCallback(() => {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      toast.error("Pop-up blocked! Please allow pop-ups to view the preview.");
      return;
    }

    const previewHtml = htmlContent({
      pageTitle: "Terms & Conditions",
      cleanedHtml: content,
    });

    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  }, [content]);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Terms & Conditions"
              icon={<ReceiptText className="w-6 h-6 text-white" />}
              color="bg-brand-blue"
              subheading="Manage legal policies and user agreements."
            />

            <div className="flex items-center gap-3">
              <Button
                onClick={handleViewPreview}
                className="h-9 group shadow-sm bg-white text-slate-500 border border-slate-200 transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5 hover:bg-white hover:text-slate-500"
              >
                <Eye className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300" />
                Preview
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white font-semibold text-xs gap-2 h-9 px-4 shadow-sm rounded-md transition-all border-none"
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
        </Header>

        <div className="space-y-4">
          <div className="px-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the Terms & Conditions content here..."
              height={600}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
