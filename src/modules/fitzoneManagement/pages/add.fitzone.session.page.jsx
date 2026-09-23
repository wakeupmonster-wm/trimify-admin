import React, { useState, useRef, useEffect, useMemo } from "react";
import CTAButton from "@/components/common/CTAButton";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  Loader2,
  PlayCircle,
  UploadCloud,
  ArrowLeft,
  Info,
  Eye,
  Pencil,
  Trash2,
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
  toggleFitzoneSessionStatus,
} from "../store/fitzone.session.slice";
import { getFitzoneCategories } from "../store/fitzone.category.slice";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";
import { IMAGE_BASE_URL } from "@/services/api-endpoints/base.url";

const AddFitzoneSessionPage = () => {
  const resolveSessionVideoUrl = (value) => {
    const video = String(value || "").trim();
    if (!video || /^(?:javascript|data):/i.test(video)) return null;
    if (/^https?:\/\//i.test(video)) return video;

    return `${IMAGE_BASE_URL.replace(/\/+$/, "")}/${video.replace(/^\/+/, "")}`;
  };

  const formatVideoDuration = (seconds) => {
    const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.fitzoneSession);
  const { categories } = useSelector((state) => state.fitzoneCategory);

  const isEdit = Boolean(sessionId);
  const editData = location.state?.editData || null;
  const existingVideoUrl = resolveSessionVideoUrl(
    editData?.video_url || editData?.video,
  );

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDetails, setSessionDetails] = useState("");
  const [sessionCategoryId, setSessionCategoryId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [sessionStatus, setSessionStatus] = useState("Active");
  const [initialSessionStatus, setInitialSessionStatus] = useState("Active");
  const [stepDescription, setStepDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedExistingVideo, setRemovedExistingVideo] = useState(false);
  const [videoMeta, setVideoMeta] = useState(null);

  const fileInputRef = useRef(null);
  const localVideoPreviewUrl = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : null),
    [videoFile],
  );
  const previewVideoUrl =
    localVideoPreviewUrl || videoUrl.trim() || existingVideoUrl || editData?.video;

  useEffect(
    () => () => {
      if (localVideoPreviewUrl) URL.revokeObjectURL(localVideoPreviewUrl);
    },
    [localVideoPreviewUrl],
  );

  const setSelectedVideo = (file) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["mp4", "mov", "avi", "wmv"];
    // PHP accepts a 40 MB request body. Leave room for multipart fields so
    // Laravel receives the request and can return a useful JSON response.
    const maxFileSize = 35 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      setVideoFile(null);
      setVideoMeta(null);
      setDuration("");
      setErrors((prev) => ({
        ...prev,
        video: "Please upload a MP4, MOV, AVI, or WMV video file.",
      }));
      return;
    }

    if (file.size > maxFileSize) {
      setVideoFile(null);
      setVideoMeta(null);
      setDuration("");
      setErrors((prev) => ({
        ...prev,
        video: "Video size must not exceed 35 MB.",
      }));
      return;
    }

    setVideoFile(file);
    setVideoMeta(null);
    setDuration("");
    setErrors((prev) => ({ ...prev, video: null }));
  };

  useEffect(() => {
    dispatch(getFitzoneCategories({ id, limit: 100 })); // Fetch enough categories to populate the dropdown
  }, [dispatch, id]);

  useEffect(() => {
    if (isEdit && editData) {
      // This form intentionally hydrates editable local fields when the
      // route-provided session changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      const loadedStatus =
        editData.status === "Inactive" || editData.status === 0 || editData.is_active === false
          ? "Inactive"
          : "Active";
      setSessionStatus(loadedStatus);
      setInitialSessionStatus(loadedStatus);

      if (editData.step_description) {
        try {
          const parsed = JSON.parse(editData.step_description);
          if (Array.isArray(parsed)) {
            setStepDescription(parsed.join("\n"));
          } else {
            setStepDescription(editData.step_description);
          }
        } catch {
          setStepDescription(editData.step_description);
        }
      } else {
        setStepDescription(editData.description || "");
      }
    }
  }, [isEdit, editData]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setSelectedVideo(file);
    e.target.value = "";
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
    setSelectedVideo(file);
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
    if (!stepDescription?.toString().trim())
      newErrors.stepDescription = "Description is required";
    if (!isEdit && !videoFile && !videoUrl.trim())
      newErrors.video = "Upload a session video or provide a valid video URL.";
    if (!duration?.toString().trim())
      newErrors.video = "Video duration could not be detected. Please use a playable MP4/MOV video with metadata.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the highlighted fields before saving.");
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
      if (isEdit && sessionStatus !== initialSessionStatus) {
        const statusResult = await dispatch(
          toggleFitzoneSessionStatus({ id: sessionId, status: sessionStatus }),
        );
        if (!toggleFitzoneSessionStatus.fulfilled.match(statusResult)) {
          toast.error("Session details were saved, but its status could not be updated.");
          setIsSubmitting(false);
          return;
        }
      }
      toast.success(`Session ${isEdit ? "updated" : "added"} successfully!`);
      navigate(-1);
    } else {
      const errorPayload = resultAction.payload;
      const fieldErrors = errorPayload?.fieldErrors || {};
      const errorFieldMap = {
        title: "sessionTitle",
        description: "sessionDetails",
        workoutcat_id: "sessionCategoryId",
        duration: "duration",
        step_description: "stepDescription",
        video: "video",
        video_url: "video",
      };

      const mappedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, message]) => [
          errorFieldMap[field] || field,
          message,
        ]),
      );

      if (Object.keys(mappedErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...mappedErrors }));
      }

      toast.error(errorPayload?.message || "An error occurred");
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
                placeholder="e.g. 10-Minute Morning Stretch"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60"
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
                placeholder="e.g. A gentle full-body routine for mobility and flexibility"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60"
              />
              {errors.sessionDetails && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.sessionDetails}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800">
                  {isEdit ? "Session Video" : "Upload Session Video"}
                </Label>
                <span className="text-[10px] font-medium text-slate-400">
                  16:9 Landscape
                </span>
              </div>
              <input
                type="file"
                accept=".mp4,.mov,.avi,.wmv,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleVideoChange}
              />
              {(previewVideoUrl && !removedExistingVideo) ? (
                <div className="relative w-full max-w-sm rounded-lg border border-slate-200 overflow-hidden bg-slate-950 shadow-sm">
                  <div className="relative w-full">
                    <video
                      key={previewVideoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      src={previewVideoUrl}
                      className="w-full max-h-64 bg-slate-950 object-contain block"
                      onLoadedMetadata={(e) => {
                        const w = e.currentTarget.videoWidth;
                        const h = e.currentTarget.videoHeight;
                        const detectedDuration = e.currentTarget.duration;
                        if (Number.isFinite(detectedDuration) && detectedDuration > 0) {
                          setDuration(String(Math.round(detectedDuration)));
                          setErrors((prev) => ({ ...prev, video: null }));
                        }
                        if (w && h) {
                          const is16by9 = Math.abs(w / h - 16 / 9) < 0.08;
                          setVideoMeta({
                            width: w,
                            height: h,
                            aspectRatio: is16by9 ? "16:9" : `${(w / h).toFixed(2)}:1`,
                          });
                        }
                      }}
                    >
                      Your browser does not support in-panel video playback.
                    </video>
                    {/* Top-right floating action buttons so native video controls (play, pause, seek, volume) are never blocked */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        aria-label="Replace video"
                        title="Replace video"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="bg-white/90 hover:bg-white text-app-primary2 rounded-full p-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove video"
                        title="Remove video"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoFile(null);
                          setVideoMeta(null);
                          setDuration("");
                          setErrors((prev) => ({ ...prev, video: null }));
                          if (isEdit) setRemovedExistingVideo(true);
                        }}
                        className="bg-white/90 hover:bg-white text-red-500 rounded-full p-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-600 flex-1">
                      {videoFile ? videoFile.name : videoUrl.trim() || editData?.video || editData?.video_url}
                    </p>
                    {videoMeta && (
                      <span className="shrink-0 text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                        {videoMeta.width}×{videoMeta.height} • {videoMeta.aspectRatio}
                      </span>
                    )}
                    {duration && (
                      <span className="shrink-0 text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                        {formatVideoDuration(duration)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
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
                  <UploadCloud className="w-10 h-10 text-app-primary2 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 text-center">
                    Click or drag and drop to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1 text-center max-w-sm">
                    Recommended: 16:9 Aspect Ratio, 720p or 1080p MP4 (H.264). Max 35 MB.
                  </p>
                </div>
              )}
              {errors.video && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.video}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                {isEdit ? "New Video URL (optional)" : "Video URL"}
              </Label>
              <Input
                type="text"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  if (errors.video) setErrors((prev) => ({ ...prev, video: null }));
                }}
                placeholder="Enter Video URL here"
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium border-slate-300/60"
              />
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
                    className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
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
                  className="w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium resize-none p-3 pb-8 border-slate-300/60"
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

            {/* Session Status Toggle in Edit Flow */}
            {isEdit && (
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Session Status
                  </Label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Toggle whether this workout session is active and visible to users.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-bold ${
                      sessionStatus === "Active"
                        ? "text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"
                        : "text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full"
                    }`}
                  >
                    {sessionStatus}
                  </span>
                  <Switch
                    checked={sessionStatus === "Active"}
                    onCheckedChange={(checked) =>
                      setSessionStatus(checked ? "Active" : "Inactive")
                    }
                    className="data-[state=checked]:bg-app-cardGreen"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 w-full">
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
