import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, FileText, ArrowLeft } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import {
  getFitzoneIntro,
  updateFitzoneIntro,
  addFitzoneIntro,
} from "../store/fitzone.intro.slice";
import { toast } from "sonner";

const EditFitzoneIntroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [content, setContent] = useState("");

  const { intro, loading } = useSelector((state) => state.fitzoneIntro);

  useEffect(() => {
    if (id) {
      dispatch(getFitzoneIntro(id));
    }
  }, [dispatch, id]);

  console.log("intro: ", intro);

  useEffect(() => {
    if (intro) {
      setHeading(intro.heading || "");
      setSubheading(intro.subheading || "");
      setContent(intro.content || intro.intro || "");
    }
  }, [intro]);

  const handleUpdate = async () => {
    try {
      const payload = {
        fitzone_id: id,
        heading,
        sub_heading: subheading,
        content: content,
      };
      let resultAction;

      // If we got some intro previously, we update it, otherwise add it.
      if (intro && intro.id) {
        resultAction = await dispatch(
          updateFitzoneIntro({ id: intro.id, data: payload }),
        );
      } else {
        resultAction = await dispatch(addFitzoneIntro(payload));
      }

      if (
        updateFitzoneIntro.fulfilled.match(resultAction) ||
        addFitzoneIntro.fulfilled.match(resultAction)
      ) {
        toast.success("Introduction updated successfully!");
        navigate(-1);
      } else {
        toast.error(resultAction.payload || "Failed to update introduction");
      }
    } catch (error) {
      toast.error("An error occurred while saving the introduction.");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        {/* Top Header */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Introduction"
                icon={<FileText className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Edit the introduction content for this fitzone."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-2.5 h-10 flex items-center justify-center gap-1 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        {/* Editor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 pb-6 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Heading
              </Label>
              <Input
                type="text"
                placeholder="Begin Your Path to Better Health"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Subheading
              </Label>
              <Input
                type="text"
                placeholder="Embrace a healthier lifestyle with our tailored fitness programs"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Introduction Content
              </Label>
              <p className="text-[13px] text-slate-500 font-medium">
                Write a comprehensive introduction for your fitzone. This
                content will be displayed to users before they start.
              </p>
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              height={400}
            />

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-slate-100 w-full">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-md px-5 sm:px-6 h-11 sm:h-10 text-sm sm:text-xs font-semibold border-slate-300/60"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-5 sm:px-6 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <Save className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditFitzoneIntroPage;
