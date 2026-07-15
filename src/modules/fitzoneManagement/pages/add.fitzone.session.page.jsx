import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Send, PlayCircle } from "lucide-react";
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

  // Form State
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDetails, setSessionDetails] = useState("");
  const [sessionCategoryId, setSessionCategoryId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getFitzoneCategories(id));
    }
  }, [dispatch, id, categories]);

  useEffect(() => {
    if (isEdit && editData) {
      setSessionTitle(editData.session_title || editData.title || "");
      setSessionDetails(editData.details || editData.sub_heading || "");
      setSessionCategoryId(editData.category_id || editData.fitzone_workoutcat_id || "");
      setVideoUrl(editData.video_url || "");
      setDuration(editData.duration || "");
      setDescription(editData.description || "");
    }
  }, [isEdit, editData]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
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
    formData.append("details", sessionDetails);
    formData.append("fitzone_workoutcat_id", sessionCategoryId); 
    formData.append("duration", duration);
    formData.append("description", description);
    
    if (videoUrl.trim()) {
      formData.append("video_url", videoUrl);
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    let resultAction;
    if (isEdit) {
      resultAction = await dispatch(
        updateFitzoneSession({ id: sessionId, data: formData })
      );
    } else {
      resultAction = await dispatch(addFitzoneSession(formData));
    }

    if (
      updateFitzoneSession.fulfilled.match(resultAction) ||
      addFitzoneSession.fulfilled.match(resultAction)
    ) {
      toast.success(
        `Session ${isEdit ? "updated" : "added"} successfully!`
      );
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "An error occurred");
    }
  };

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading={isEdit ? "Edit Session" : "Add Session"}
            icon={<PlayCircle className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading={isEdit ? "Edit existing workout session details and videos." : "Add a new workout session with videos."}
          />
        </Header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-auto w-full">
          <div className="bg-brand-blue px-6 py-4 flex items-center justify-center">
            <h2 className="text-white text-lg font-bold tracking-wide">
              {isEdit ? "Edit Session" : "Add Session"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Session Heading
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Enter Title Here"
                className="w-full h-11 px-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Session Sub-Heading(Details)
              </label>
              <input
                type="text"
                value={sessionDetails}
                onChange={(e) => setSessionDetails(e.target.value)}
                placeholder="Enter Details Here"
                className="w-full h-11 px-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-3">
              {isEdit && editData?.video && !videoFile && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-slate-800 font-bold">Uploaded Video :</span>
                  <a href={editData.video} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                    {editData.video}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-black hover:bg-gray-800 text-white rounded-none px-6 h-9 font-semibold text-xs"
                >
                  {isEdit ? "Upload New Video" : "Upload Video"}
                </Button>
                {videoFile && (
                  <span className="text-sm font-medium text-brand-blue">
                    {videoFile.name}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleVideoChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                {isEdit ? "New Video URL(optional)" : "Video URL"}
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter Video URL here"
                className="w-full h-11 px-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter Video Duration"
                className="w-full h-11 px-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Category
              </label>
              <select
                value={sessionCategoryId}
                onChange={(e) => setSessionCategoryId(e.target.value)}
                className="w-full h-11 px-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium bg-white"
              >
                <option value="" disabled>Select a category</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full h-32 p-3 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 font-medium resize-none"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Note: Please enter the description in list format.
              </div>
            </div>

            <div className="flex justify-center pt-6 pb-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-12 h-11 text-sm font-bold flex items-center gap-2 rounded shadow-sm"
              >
                <Send className="w-4 h-4" />
                {isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddFitzoneSessionPage;
