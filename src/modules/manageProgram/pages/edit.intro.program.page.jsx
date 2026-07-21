import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, FileText } from "lucide-react";
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
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 w-full">
              <PageHeader
                heading="Introduction"
                icon={<FileText className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Edit the introduction content for this program."
              />
            </div>
          </div>
        </Header>

        {/* Editor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden">
          <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-6">
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
                className="w-full sm:w-auto rounded-md px-8 py-2.5 h-auto text-sm font-semibold"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
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

export default EditIntroProgramPage;
