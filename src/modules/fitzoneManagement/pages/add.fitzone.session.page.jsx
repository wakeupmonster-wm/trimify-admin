import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import {
  Save,
  Loader2,
  PlayCircle,
  UploadCloud,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addFitzoneSession,
  updateFitzoneSession,
} from "../store/fitzone.session.slice";
import { getFitzoneCategories } from "../store/fitzone.category.slice";
import { toast } from "sonner";

const AddFitzoneSessionPage = () => {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.fitzoneSession);
  const { categories } = useSelector((state) => state.fitzoneCategory);

  const isEdit = Boolean(sessionId);
  const editData = location.state?.editData || null;
  console.log("editData: ", editData);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDetails, setSessionDetails] = useState("");
  const [sessionCategoryId, setSessionCategoryId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getFitzoneCategories(id));
    }
  }, [dispatch, id, categories]);

  useEffect(() => {
    if (isEdit && editData) {
      setSessionTitle(editData.title || editData.session_title || "");
      setSessionDetails(
        editData.description || editData.details || editData.sub_heading || "",
      );
      setSessionCategoryId(
        editData.workoutcat_id?.toString() ||
          editData.category_id?.toString() ||
          editData.fitzone_workoutcat_id?.toString() ||
          "",
      );
      setVideoUrl(editData.video_url || "");
      setDuration(editData.duration || "");

      if (editData.step_description) {
        try {
          const parsed = JSON.parse(editData.step_description);
          if (Array.isArray(parsed)) {
            setStepDescription(parsed.join("\n"));
          } else {
            setStepDescription(editData.step_description);
          }
        } catch (e) {
          setStepDescription(editData.step_description);
        }
      } else {
        setStepDescription(editData.description || "");
      }
    }
  }, [isEdit, editData]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionTitle.trim()) {
      toast.error("Session Heading is required");
      return;
    }
    if (!sessionCategoryId) {
      toast.error("Category is required");
      return;
    }

    const formData = new FormData();
    formData.append("fitzone_id", id);
    formData.append("title", sessionTitle);
    formData.append("description", sessionDetails);
    formData.append("workoutcat_id", sessionCategoryId);
    formData.append("duration", duration);

    // Parse step description into a JSON string array
    const stepsArray = stepDescription
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    formData.append("step_description", JSON.stringify(stepsArray));

    if (videoUrl.trim()) {
      formData.append("video_url", videoUrl);
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    let resultAction;
    if (isEdit) {
      resultAction = await dispatch(
        updateFitzoneSession({ id: sessionId, data: formData }),
      );
    } else {
      resultAction = await dispatch(addFitzoneSession(formData));
    }

    if (
      updateFitzoneSession.fulfilled.match(resultAction) ||
      addFitzoneSession.fulfilled.match(resultAction)
    ) {
      toast.success(`Session ${isEdit ? "updated" : "added"} successfully!`);
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "An error occurred");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Session" : "Add Session"}
                icon={<PlayCircle className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading={
                  isEdit
                    ? "Edit existing workout session details and videos."
                    : "Add a new workout session with videos."
                }
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-5 sm:space-y-6 w-full min-w-0"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Session Heading
              </Label>
              <Input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Enter Title Here"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Session Sub-Heading (Details)
              </Label>
              <Input
                type="text"
                value={sessionDetails}
                onChange={(e) => setSessionDetails(e.target.value)}
                placeholder="Enter Details Here"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
              />
            </div>

            {isEdit && editData?.video && !videoFile && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Current Uploaded Video
                </Label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <a
                    href={editData.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {editData.video}
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEdit ? "Upload New Video (optional)" : "Upload Video"}
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-app-primary2 bg-blue-50"
                    : "border-slate-300/60 hover:border-app-primary2/50 bg-slate-50 hover:bg-slate-50/80"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleVideoChange}
                />
                <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {videoFile
                    ? videoFile.name
                    : "Click or drag and drop to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  MP4, WEBM or OGG (max. 50MB)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEdit ? "New Video URL (optional)" : "Video URL"}
              </Label>
              <Input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter Video URL here"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Duration
              </Label>
              <Input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter Video Duration"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category
              </Label>
              <Select
                value={
                  sessionCategoryId ? sessionCategoryId.toString() : undefined
                }
                onValueChange={(val) => setSessionCategoryId(val)}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Description
              </Label>
              <Textarea
                value={stepDescription}
                onChange={(e) => setStepDescription(e.target.value)}
                placeholder="Enter description"
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60 resize-none p-3"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Note: Please enter each step on a new line.
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto rounded-md px-6 h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-6 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Update" : "Save"}
                    <Save className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddFitzoneSessionPage;
