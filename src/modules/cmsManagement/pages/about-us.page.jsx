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
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";

const AboutUsPage = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.cmsManagement);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const handleSave = () => {
    if (!content.trim()) {
      return toast.error("Content cannot be empty.");
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
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
      console.error(error);
      toast.error(error?.message || "Failed to save content.");
    } finally {
      setIsSaving(false);
      setIsConfirmModalOpen(false);
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
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="About Us"
                icon={<Info className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Edit the About Us page content here."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={Eye}
                label="Preview"
                onClick={handleViewPreview}
              />

              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="outline"
                className="w-full sm:w-auto flex-1 sm:flex-none bg-app-primary2 hover:bg-app-primary3 text-white hover:text-white font-semibold text-sm sm:text-xs gap-2 h-10 px-4 shadow-sm rounded-md transition-all border-none flex items-center justify-center"
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
          <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-6 w-full min-w-0">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the story about Trimify Fitness App here..."
              height={1200}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save the changes to the About Us page?"
        confirmText="Save Changes"
        type="brand"
        loading={isSaving}
      />
    </Container>
  );
};

export default AboutUsPage;
