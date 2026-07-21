import React, { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Info, Eye, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { htmlContent } from "@/constants/htmlContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCmsPages, updateCmsContent } from "../store/cms.management.slice";

const AboutUsPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.cmsManagement);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Find the page ID and initial content from Redux state
  const pageData = data?.find((page) =>
    page.page_name?.toLowerCase().includes("about"),
  );

  useEffect(() => {
    // If data isn't loaded yet, fetch it
    if (!data || data.length === 0) {
      dispatch(fetchCmsPages({ page: 1 }));
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (pageData && pageData.description) {
      setContent(pageData.description);
    }
  }, [pageData]);

  // Mock Save handler since API is not provided yet
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
          page_name: pageData.page_name || "About Us",
          description: content,
        }),
      ).unwrap();

      toast.success("About Us content saved successfully.");
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

    // Wrap the raw HTML inside the standardized preview template
    const previewHtml = htmlContent({
      pageTitle: "About Us",
      cleanedHtml: content,
    });

    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  }, [content]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="About Us"
                icon={<Info className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2"
                subheading="Edit the About Us page content here."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                onClick={handleViewPreview}
                className="w-full sm:w-auto flex-1 sm:flex-none h-11 sm:h-10 group shadow-sm bg-white text-slate-500 border border-slate-300/60 transition-all duration-300 font-semibold text-xs uppercase tracking-wider rounded-xl sm:rounded-lg px-4 hover:bg-white hover:text-slate-500 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4 text-slate-400 transition-colors duration-300 shrink-0" />
                <span className="whitespace-nowrap">Preview</span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto flex-1 sm:flex-none bg-app-primary2 hover:bg-app-primary5 text-white font-semibold text-sm sm:text-xs gap-2 h-11 sm:h-10 px-6 shadow-sm rounded-xl sm:rounded-md transition-all border-none flex items-center justify-center"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin shrink-0" />
                ) : (
                  <Save className="w-4 h-4 mr-1 shrink-0" />
                )}
                <span className="whitespace-nowrap">{isSaving ? "Saving…" : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="space-y-4">
          <div className="px-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the story about Trimify Fitness App here..."
              height={1200}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutUsPage;
