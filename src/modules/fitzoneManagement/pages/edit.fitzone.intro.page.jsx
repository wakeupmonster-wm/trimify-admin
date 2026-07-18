import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, FileText } from "lucide-react";
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
        subheading,
        intro: content, // sending as 'intro' or 'content' based on your API expectation
      };
      let resultAction;

      // If we got some intro previously, we update it, otherwise add it.
      if (intro) {
        resultAction = await dispatch(
          updateFitzoneIntro({ id: intro.id || id, data: payload }),
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
      <div className="space-y-8">
        {/* Top Header */}
        <Header>
          <PageHeader
            heading="Introduction"
            icon={<FileText className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Edit the introduction content for this fitzone."
          />
        </Header>

        {/* Editor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 md:px-8 pt-5 pb-6 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Heading
              </Label>
              <Input
                type="text"
                placeholder="Begin Your Path to Better Health"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
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
                className="w-full h-10 px-4 text-sm border border-slate-300 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
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

            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="outline"
                className="rounded-md px-6 py-2.5 h-auto text-xs font-semibold border-slate-300"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-6 py-2.5 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                <Save size={16} />
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
