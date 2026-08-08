import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import {
  getProgramIntro,
  updateProgramIntro,
  addProgramIntro,
} from "../store/intro.slice";
import { toast } from "sonner";
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";

const EditIntroProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const handleUpdate = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      const payload = { program_id: id, content: content };
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
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Introduction"
                icon={<FileText className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Edit the introduction content for this program."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Header>

        {/* Editor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 pb-6 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-800">
                Introduction Content
              </Label>
              <p className="text-[13px] text-slate-500 font-medium">
                Write a comprehensive introduction for your program. This
                content will be displayed to users before they start.
              </p>
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              height={400}
            />
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-md px-6 h-10 text-xs font-semibold"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full sm:w-auto text-white rounded-md px-4 h-10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update
                    <Save className="w-4 h-4 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to update this introduction?"
        confirmText="Update"
        type="brand"
        loading={loading}
      />
    </Container>
  );
};

export default EditIntroProgramPage;
