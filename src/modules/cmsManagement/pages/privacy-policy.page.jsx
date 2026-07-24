import React, { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Eye, ShieldCheck, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { htmlContent } from "@/constants/htmlContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCmsPages, updateCmsContent } from "../store/cms.management.slice";

export default function PrivacyAndPolicyPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.cmsManagement);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Find the page ID and initial content from Redux state
  const pageData = data?.find((page) =>
    page.page_name?.toLowerCase().includes("privacy"),
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
          page_name: pageData.page_name || "Privacy Policy",
          description: content,
        }),
      ).unwrap();

      toast.success("Privacy Policy saved successfully.");
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
      pageTitle: "Privacy Policy",
      cleanedHtml: content,
    });

    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  }, [content]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Privacy & Policy"
                icon={<ShieldCheck className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Update user data protection guidelines."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                onClick={handleViewPreview}
                className="w-full sm:w-auto flex-1 sm:flex-none h-10 px-4 group shadow-sm bg-white text-slate-500 border border-slate-300/60 transition-all duration-300 font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4 text-slate-400 transition-colors duration-300 shrink-0" />
                <span className="whitespace-nowrap">Preview</span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto flex-1 sm:flex-none bg-app-primary2 hover:bg-app-primary5 text-white font-semibold text-sm sm:text-xs gap-2 h-10 px-4 shadow-sm rounded-md transition-all border-none flex items-center justify-center"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin shrink-0" />
                ) : (
                  <Save className="w-4 h-4 mr-1 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {isSaving ? "Saving…" : "Save Changes"}
                </span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-5 sm:space-y-6 w-full min-w-0">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the Privacy Policy content here..."
              height={1200}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
