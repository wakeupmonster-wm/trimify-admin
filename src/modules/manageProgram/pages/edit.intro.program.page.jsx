import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, FileText } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import {
  getProgramIntro,
  updateProgramIntro,
  addProgramIntro,
} from "../store/intro.slice";
import { toast } from "sonner";

const EditIntroProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");

  const { programIntros, loading } = useSelector((state) => state.manageIntro);

  const existingIntro = programIntros[id];

  useEffect(() => {
    if (id) {
      dispatch(getProgramIntro(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (existingIntro !== undefined) {
      setContent(existingIntro || "");
    }
  }, [existingIntro]);

  const handleUpdate = async () => {
    try {
      const payload = { program_id: id, intro: content };
      let resultAction;

      // If we got some intro previously, we update it, otherwise add it.
      if (existingIntro) {
        resultAction = await dispatch(
          updateProgramIntro({ id, data: payload }),
        );
      } else {
        resultAction = await dispatch(addProgramIntro(payload));
      }

      if (
        updateProgramIntro.fulfilled.match(resultAction) ||
        addProgramIntro.fulfilled.match(resultAction)
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
      <div className="space-y-6">
        {/* Top Header */}
        <Header>
          <PageHeader
            heading="Introduction"
            icon={<FileText className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Edit the introduction content for this program."
          />
        </Header>

        {/* Editor Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-brand-blue py-3 text-center">
            <h2 className="text-white font-semibold text-sm tracking-wide">
              Edit Introduction
            </h2>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">
            <RichTextEditor
              label="Introduction Content"
              value={content}
              onChange={setContent}
              height={400}
            />

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-10 h-10 flex items-center gap-2 font-medium shadow-sm"
              >
                <Send className="w-4 h-4" />
                Update Introduction
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditIntroProgramPage;
