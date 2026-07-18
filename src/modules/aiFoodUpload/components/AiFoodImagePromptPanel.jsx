import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Wand2,
  Mic,
  Square,
  Play,
  Trash2,
  UploadCloud,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { audioBlobToWav } from "../utils/audioToWav";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const AiFoodImagePromptPanel = ({ onGenerateFromPrompt, onGenerateFromAudio, onCancel, busy }) => {
  const [prompt, setPrompt] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioSource, setAudioSource] = useState(null); // "recorded" | "uploaded"

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioSource(null);
    setElapsed(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        const rawBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });

        setIsConverting(true);
        try {
          // Normalize to WAV — browsers' recorded webm/opus audio is
          // sometimes sniffed server-side as "video/webm" (shared
          // container), which a strict audio-only mimetype check rejects.
          // A plain PCM WAV always sniffs correctly.
          const wavBlob = await audioBlobToWav(rawBlob);
          resetAudio();
          setAudioBlob(wavBlob);
          setAudioUrl(URL.createObjectURL(wavBlob));
          setAudioSource("recorded");
        } catch {
          toast.error("Couldn't process that recording. Please try recording again.");
        } finally {
          setIsConverting(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(
        () => setElapsed((prev) => prev + 1),
        1000,
      );
    } catch {
      toast.error(
        "Couldn't access the microphone. Check your browser's permission for this site.",
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const retakeRecording = () => {
    resetAudio();
    startRecording();
  };

  const downloadRecording = () => {
    if (!audioBlob) return;
    const ext = audioBlob.type.includes("wav") ? "wav" : "webm";
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `image-prompt-audio.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    resetAudio();
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setAudioSource("uploaded");
    e.target.value = "";
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    onGenerateFromPrompt(prompt.trim());
  };

  const handleAudioSubmit = () => {
    if (!audioBlob) return;
    onGenerateFromAudio(audioBlob);
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-300/60 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-brand-blue" />
        <h3 className="text-sm font-bold text-slate-800">
          Guided Image Generation
        </h3>
      </div>

      <Tabs defaultValue="prompt">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="prompt">Text Prompt</TabsTrigger>
          <TabsTrigger value="audio">Voice / Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-3 pt-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe exactly how the image should look — e.g. “top-down shot on a dark slate plate, garnished with mint, natural light”"
            rows={3}
            disabled={busy}
            className="text-sm resize-y border-slate-300"
          />
          <div className="flex justify-end gap-2">
            {busy && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handlePromptSubmit}
              disabled={busy || !prompt.trim()}
              className="bg-app-primary2 hover:bg-app-primary5 text-white flex items-center gap-2"
            >
              {busy ? <Spinner className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {busy ? "Generating…" : "Generate Image"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-3 pt-3">
          {!audioUrl ? (
            <div className="flex flex-col items-center justify-center gap-3 py-6 border border-dashed border-slate-300 rounded-md">
              {isConverting ? (
                <>
                  <Spinner className="w-6 h-6 text-brand-blue" />
                  <p className="text-xs font-medium text-slate-500">Processing recording…</p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow transition-colors ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700 animate-pulse"
                        : "bg-brand-blue hover:bg-brand-hoverBlue"
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-5 h-5 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <p className="text-xs font-medium text-slate-500">
                    {isRecording ? `Recording… ${formatTime(elapsed)}` : "Tap to record a voice description"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-px w-8 bg-slate-200" />
                    or
                    <span className="h-px w-8 bg-slate-200" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload an audio file
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-300/60 rounded-md p-3">
                <div className="w-9 h-9 rounded-full bg-app-primary2/10 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 text-brand-blue" />
                </div>
                <audio controls src={audioUrl} className="flex-1 h-9" />
              </div>
              <p className="text-[11px] text-slate-400">
                {audioSource === "recorded"
                  ? "Recorded just now"
                  : "Uploaded file"}{" "}
                — ready to send.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={retakeRecording}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={downloadRecording}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload Instead
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={resetAudio}
                  className="flex items-center gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="ml-auto flex items-center gap-2">
                  {busy && (
                    <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleAudioSubmit}
                    disabled={busy}
                    className="bg-brand-blue hover:bg-brand-hoverBlue text-white flex items-center gap-2"
                  >
                    {busy ? <Spinner className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {busy ? "Generating…" : "Generate Image from Audio"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-start gap-2 bg-blue-50/60 border border-blue-100 rounded-md px-3 py-2">
        <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          Only updates this item's photo — food name and nutrition stay untouched. Each regenerate
          uses a real (paid) AI image call, so use it deliberately rather than repeatedly. "Cancel"
          only stops waiting on this screen — a generation already in progress still finishes in the
          background and the photo updates automatically once it's ready.
        </p>
      </div>
    </div>
  );
};

export default AiFoodImagePromptPanel;
