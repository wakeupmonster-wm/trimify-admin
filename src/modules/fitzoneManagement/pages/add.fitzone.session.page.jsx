import React, { useState, useRef, useEffect } from "react";
import CTAButton from "@/components/common/CTAButton";
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
  Info,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addFitzoneSession,
  updateFitzoneSession,
} from "../store/fitzone.session.slice";
import { getFitzoneCategories } from "../store/fitzone.category.slice";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";

const AddFitzoneSessionPage = () => {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.fitzoneSession);
  const { categories } = useSelector((state) => state.fitzoneCategory);

  const isEdit = Boolean(sessionId);
  const editData = location.state?.editData || null;

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDetails, setSessionDetails] = useState("");
  const [sessionCategoryId, setSessionCategoryId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getFitzoneCategories({ id, limit: 100 })); // Fetch enough categories to populate the dropdown
  }, [dispatch, id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!sessionTitle.trim())
      newErrors.sessionTitle = "Session Heading is required";
    if (!sessionDetails.trim())
      newErrors.sessionDetails = "Session Sub-Heading is required";
    if (!sessionCategoryId)
      newErrors.sessionCategoryId = "Category is required";
    if (!duration?.toString().trim())
      newErrors.duration = "Duration is required";
    if (!stepDescription?.toString().trim())
      newErrors.stepDescription = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);
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
    setIsSubmitting(false);
    setIsConfirmModalOpen(false);
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Session" : "Add Session"}
                icon={<PlayCircle className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEdit
                    ? "Edit existing workout session details and videos."
                    : "Add a new workout session with videos."
                }
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-5 pb-6 space-y-5 sm:space-y-4 w-full min-w-0"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Session Heading
              </Label>
              <Input
                type="text"
                value={sessionTitle}
                onChange={(e) => {
                  setSessionTitle(e.target.value);
                  if (errors.sessionTitle)
                    setErrors((prev) => ({ ...prev, sessionTitle: null }));
                }}
                placeholder="Enter Title Here"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.sessionTitle ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.sessionTitle && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.sessionTitle}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Session Sub-Heading (Details)
              </Label>
              <Input
                type="text"
                value={sessionDetails}
                onChange={(e) => {
                  setSessionDetails(e.target.value);
                  if (errors.sessionDetails)
                    setErrors((prev) => ({ ...prev, sessionDetails: null }));
                }}
                placeholder="Enter Details Here"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.sessionDetails ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.sessionDetails && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.sessionDetails}
                </p>
              )}
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
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Duration
              </Label>
              <Input
                type="text"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (errors.duration)
                    setErrors((prev) => ({ ...prev, duration: null }));
                }}
                placeholder="Enter Video Duration"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.duration ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.duration && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Category
              </Label>
              {(categories && categories.length > 0) ||
              (isEdit && editData?.workoutsession) ? (
                <Select
                  // dynamic key lagane se dropdown sahi se re-render hoga jab data aayega
                  key={`select-${categories?.length}-${sessionCategoryId}`}
                  value={
                    sessionCategoryId ? sessionCategoryId.toString() : undefined
                  }
                  onValueChange={(val) => {
                    setSessionCategoryId(val);
                    if (errors.sessionCategoryId)
                      setErrors((prev) => ({
                        ...prev,
                        sessionCategoryId: null,
                      }));
                  }}
                >
                  <SelectTrigger
                    className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.sessionCategoryId ? "border-red-500" : "border-slate-300/60"}`}
                  >
                    <SelectValue
                      placeholder="Select a category"
                      className="placeholder:font-normal"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.title}
                      </SelectItem>
                    ))}
                    {isEdit &&
                      editData?.workoutsession &&
                      (!categories ||
                        !categories.some(
                          (c) =>
                            c.id?.toString() ===
                            editData.workoutsession.id?.toString(),
                        )) && (
                        <SelectItem
                          key={`fallback-${editData.workoutsession.id}`}
                          value={editData.workoutsession.id.toString()}
                        >
                          {editData.workoutsession.title}
                        </SelectItem>
                      )}
                  </SelectContent>
                </Select>
              ) : (
                <Select key="disabled-select" disabled>
                  <SelectTrigger className="h-10 text-sm border-slate-300/60 font-medium opacity-50">
                    <SelectValue
                      placeholder="Loading categories..."
                      className="placeholder:font-normal"
                    />
                  </SelectTrigger>
                </Select>
              )}
              {errors.sessionCategoryId && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.sessionCategoryId}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 w-max">
                Description
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="cursor-help"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5"
                    >
                      Note: Please enter each step on a new line.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <Textarea
                  value={stepDescription}
                  onChange={(e) => {
                    setStepDescription(e.target.value);
                    if (errors.stepDescription)
                      setErrors((prev) => ({ ...prev, stepDescription: null }));
                  }}
                  placeholder="Enter description"
                  maxLength={500}
                  className={`w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium resize-none p-3 pb-8 ${errors.stepDescription ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {stepDescription.length} / 500
                </div>
              </div>
              {errors.stepDescription && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.stepDescription}
                </p>
              )}
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
                className="w-full sm:w-auto text-white rounded-md px-6 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold transition-all"
              >
                {isSubmitting || loading ? (
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title={isEdit ? "Confirm Update" : "Confirm Creation"}
        message={
          isEdit
            ? "Are you sure you want to update this session's details?"
            : "Are you sure you want to create this new session?"
        }
        confirmText={isEdit ? "Update" : "Create"}
        type="brand"
        loading={isSubmitting || loading}
      />
    </Container>
  );
};

export default AddFitzoneSessionPage;
