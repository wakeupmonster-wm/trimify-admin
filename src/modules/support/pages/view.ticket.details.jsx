import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  fetchTicketById,
  adminReplyToTicket,
  clearSupportStatus,
} from "../store/support.slice";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Reply,
  Tag,
  AlertCircle,
  Ticket as TicketIcon,
  User,
  ShieldAlert,
  Info,
  ChevronLeft,
  X,
  FileText,
  Paperclip,
  ALargeSmall,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { SiTicktick } from "react-icons/si";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/Loader";
import { format } from "date-fns";
import dummyImg from "@/assets/web/dummyImg.webp";
import { Container } from "@/components/common/container";
import { AdminResourceNotFound } from "@/components/common/AdminResourceNotFound";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Helper for Status Styles
const STATUS_CONFIG = {
  open: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  in_progress: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  resolved: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  closed: {
    color: "bg-slate-50 text-slate-700 border-slate-300/60",
    icon: AlertCircle,
  },
};

const STATUS_BANNER_CONFIG = {
  in_progress: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    subText: "text-amber-700",
    icon: Clock,
    title: "Ticket is currently under review",
    desc: "Admin has seen it and is actively investigating. Awaiting email response to user.",
  },
  resolved: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    subText: "text-green-700",
    icon: SiTicktick,
    title: "Ticket resolved and closed",
    desc: "Email response successfully dispatched to user.",
  },
  closed: {
    bg: "bg-slate-50",
    border: "border-slate-300/60",
    text: "text-slate-800",
    subText: "text-slate-700",
    icon: AlertCircle,
    title: "Ticket finalized and archived",
    desc: "This conversation has been closed and archived. Re-open to send another reply.",
  },
};

export default function ViewTicketDetails() {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedTicket: ticket,
    loading,
    error,
    successMessage,
  } = useSelector((s) => s.support);

  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (ticketId) dispatch(fetchTicketById(ticketId));
  }, [dispatch, ticketId]);

  useEffect(() => {
    if (ticket) setStatus(ticket.status);
  }, [ticket]);

  // Revoke all object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      attachmentPreviews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, [attachmentPreviews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }
    const newPreviews = files.map((file) => ({
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      isImage: file.type.startsWith("image/"),
      name: file.name,
    }));
    setAttachments((prev) => [...prev, ...files]);
    setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeFile = (index) => {
    const preview = attachmentPreviews[index];
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const applyFormatting = (command) => {
    document.execCommand(command, false, null);
    // Trigger change manually if needed, but execCommand triggers input event
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const payload = {
      ticketId,
      reply,
      status,
      attachments,
    };

    dispatch(adminReplyToTicket(payload)).then(() => {
      setReply("");
      // Revoke all preview URLs before clearing
      attachmentPreviews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
      setAttachments([]);
      setAttachmentPreviews([]);
      setTimeout(() => dispatch(clearSupportStatus()), 3000);
    });
  };

  if (loading && !ticket)
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader width={200} height={200} />
      </div>
    );

  if (error) return <ErrorState message={error} />;
  if (!ticket) return <EmptyState />;

  const banner = STATUS_BANNER_CONFIG[ticket.status];
  const user = ticket.user || {};
  const avatar = user.avatar || dummyImg;

  return (
    <Container>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 1. PREMIUM HEADER */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/management/support"
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-300/60 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                Support Directory
              </span>
              <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden xs:inline">
                /
              </span>
              <span className="text-base md:text-xl font-normal text-foreground/30 mt-1 truncate">
                Ticket {ticket?.ticketId?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-medium text-muted-foreground bg-white px-3 py-1.5 rounded-md border border-muted-foreground/25">
              ID: {ticket?.ticketId?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 2. MAIN AREA (LEFT) */}
            <main className="lg:col-span-9 space-y-6">
              {/* Status Banner */}
              {banner && (
                <div
                  className={`flex gap-4 p-4 rounded-xl border ${banner.bg} ${banner.border} animate-in fade-in slide-in-from-top-2`}
                >
                  <div className={`p-2 rounded-lg shadow-sm ${banner.text}`}>
                    <banner.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className={`text-sm font-semibold ${banner.text}`}>
                      {banner.title}
                    </h4>
                    <p className={`text-xs font-medium ${banner.subText}`}>
                      {banner.desc}
                    </p>
                  </div>
                </div>
              )}

              {/* MERGED MAIN CONTENT CARD (Message + Reply) */}
              <div className="bg-white rounded-xl border border-slate-300/60 overflow-hidden">
                {/* User Message Section */}
                <div className="py-5">
                  <div className="flex items-center justify-between px-6 pb-4 mb-5 border-b border-slate-300/60">
                    <div>
                      <h1 className="text-lg font-bold text-foreground tracking-normal">
                        {ticket.subject || "Fraudulent Behavior Reported"}
                      </h1>
                      <p className="text-xs font-medium text-foreground/50 tracking-tight flex items-center gap-2">
                        {/* Ticket: {ticket?.ticketId?.toUpperCase()}
                          <span className="w-1 h-1 rounded-full bg-foreground/40"></span> */}
                        {ticket.category}{" "}
                        <span className="w-1 h-1 rounded-full bg-foreground/40"></span>
                        Source: {ticket.source || "In-App Report"}
                      </p>
                    </div>
                    <Badge
                      className={`${STATUS_CONFIG[ticket.status]?.color} capitalize border rounded-full px-3 py-0.5 text-[10px] font-bold`}
                    >
                      <div className="w-1 h-1 rounded-full bg-current mr-1.5" />
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="px-6 mb-5">
                    <div className="flex items-center gap-3 pb-5 border-b border-slate-300/60">
                      <div className="w-12 h-12 rounded-full border border-slate-300/60 overflow-hidden shadow-sm">
                        <img
                          src={avatar}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {user.nickname || "Unknown User"}
                        </span>
                        <span className="text-xs text-foreground/60 font-normal">
                          {user.email || "no-email@user.com"}
                        </span>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {format(new Date(ticket.createdAt), "dd MMM, yyyy")}
                        </div>
                        <div className="text-[10px] font-medium text-foreground/50 tracking-tight">
                          {format(new Date(ticket.createdAt), "eeee - p")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="min-h-32 text-xs px-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {ticket.message}
                  </div>

                  {/* Attachments */}
                  {ticket.attachments?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {ticket.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-300/60 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">
                            {file.name || "attachment"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Admin Response Section */}
                  {ticket.adminReply && (
                    <div className="mx-6 mb-6 p-5 bg-[#F0FDFB] border border-[#CCFBF1] rounded-xl animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-app-primary2 font-bold text-[11px] uppercase tracking-tight">
                          <Reply className="w-4 h-4" strokeWidth={2.5} />
                          Email Response Sent
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                          {ticket.repliedAt &&
                            format(
                              new Date(ticket.repliedAt),
                              "d MMM, yyyy 'at' p",
                            )}
                        </div>
                      </div>
                      <div
                        className="text-[13px] text-teal-700 font-medium leading-relaxed rich-text-content px-0"
                        dangerouslySetInnerHTML={{ __html: ticket.adminReply }}
                      />
                      {/* Reply attachments in history */}
                      {ticket.replyAttachments?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#CCFBF1]">
                          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2.5">
                            Attachments
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ticket.replyAttachments.map((att, idx) => {
                              const isImg =
                                att.url &&
                                /\.(jpe?g|png|gif|webp|svg)$/i.test(att.url);
                              return isImg ? (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setZoomImage(att.url)}
                                  className="group relative w-16 h-16 rounded-lg overflow-hidden border-2 border-teal-200 hover:border-app-primary2 transition-all shadow-sm hover:shadow-md"
                                  title={att.name || `attachment-${idx + 1}`}
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name || `attachment-${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </button>
                              ) : (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 bg-white border border-teal-200 rounded-lg text-[11px] font-bold text-teal-700 hover:bg-teal-50 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  {att.name || `File ${idx + 1}`}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* REPLY SUB-SECTION (Merged into same card) */}
                <div className="bg-white">
                  {ticket.status !== "closed" &&
                    ticket.status !== "resolved" && (
                      <div className="px-6 py-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-foreground/80">
                          <Reply
                            strokeWidth={1.4}
                            className="w-4 h-4 text-app-primary2"
                          />
                          Send Email Reply to User
                        </div>
                      </div>
                    )}

                  {ticket.status !== "closed" &&
                  ticket.status !== "resolved" ? (
                    <form onSubmit={handleReplySubmit}>
                      <div className="px-6 pb-2">
                        <RichTextEditor
                          value={reply}
                          onChange={setReply}
                          placeholder="Write your email response here..."
                          isExpanded={isExpanded}
                          className={`text-[14px] px-4 py-3 bg-white rounded-md border border-slate-300/60 shadow-sm focus-within:ring-1 focus-within:ring-app-primary2 transition-all duration-300`}
                        />

                        {attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 px-4 pb-2">
                            {attachments.map((file, idx) => {
                              const preview = attachmentPreviews[idx];
                              return preview?.isImage ? (
                                /* Image thumbnail card */
                                <div key={idx} className="relative group">
                                  <button
                                    type="button"
                                    onClick={() => setZoomImage(preview.url)}
                                    className="block w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-300/60 hover:border-app-primary2 transition-all shadow-sm hover:shadow-md"
                                    title={file.name}
                                  >
                                    <img
                                      src={preview.url}
                                      alt={file.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center rounded-lg">
                                      <Maximize2 className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </button>
                                  {/* Remove button */}
                                  <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                  {/* File name tooltip */}
                                  <p className="mt-1 text-[9px] font-bold text-slate-500 max-w-[64px] truncate text-center">
                                    {file.name}
                                  </p>
                                </div>
                              ) : (
                                /* Non-image file chip */
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 px-2 py-1.5 bg-slate-100 border border-slate-300/60 rounded-md group"
                                >
                                  <FileText className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="text-[10px] font-bold text-slate-600 max-w-[100px] truncate">
                                    {file.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="p-4 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-slate-400">
                          <input
                            type="file"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-200/50 rounded-lg"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Paperclip className="w-4 h-4" />{" "}
                            {/* Changed Tag to Paperclip for clarity */}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-200/50 rounded-lg"
                            onClick={() => applyFormatting("bold")}
                            title="Bold"
                          >
                            <ALargeSmall className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-200/50 rounded-lg"
                            onClick={() => setIsExpanded(!isExpanded)}
                            title={isExpanded ? "Collapse" : "Enlarge"}
                          >
                            {isExpanded ? (
                              <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <Select
                            value={status}
                            onValueChange={setStatus}
                            disabled={loading || !reply.trim()}
                          >
                            <SelectTrigger className="h-10 w-[160px] text-xs font-bold bg-white rounded-lg border-slate-300/60 disabled:opacity-95 disabled:cursor-not-allowed shadow-sm">
                              <SelectValue placeholder="Mark as..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-300/60 shadow-xl">
                              <SelectItem
                                value="open"
                                className="text-xs font-bold"
                              >
                                Open
                              </SelectItem>
                              <SelectItem
                                value="in_progress"
                                className="text-xs font-bold"
                              >
                                In Progress
                              </SelectItem>
                              <SelectItem
                                value="resolved"
                                className="text-xs font-bold"
                              >
                                Mark Resolved
                              </SelectItem>
                              {/* <SelectItem
                                value="closed"
                                className="text-xs font-bold"
                              >
                                Close Ticket
                              </SelectItem> */}
                            </SelectContent>
                          </Select>

                          <Button
                            type="submit"
                            disabled={loading || !reply.trim()}
                            className="bg-app-primary2 hover:bg-brand-hoverAqua text-white shadow-lg shadow-app-primary2 disabled:opacity-95 disabled:cursor-not-allowed rounded-lg px-8 h-10 font-bold text-xs"
                          >
                            {loading ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              "Send Email Reply"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="p-6 bg-slate-50/50 border-t border-slate-300/60">
                      <div className="bg-white border border-slate-300/60 rounded-lg p-4 min-h-[140px] flex items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-300">
                          Ticket is closed. Re-open ticket to send another
                          email...
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-3 mt-4">
                        <Select
                          value={status}
                          onValueChange={setStatus}
                          disabled={
                            loading ||
                            ticket.status === "resolved" ||
                            ticket.status === "closed"
                          }
                        >
                          <SelectTrigger className="h-10 w-[180px] text-xs font-bold bg-white rounded-lg border-slate-300/60 shadow-none outline-none focus:ring-0">
                            <SelectValue placeholder="Re-open Ticket" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-slate-300/60 shadow-xl">
                            <SelectItem
                              value="open"
                              className="text-xs font-bold"
                            >
                              Open
                            </SelectItem>
                            <SelectItem
                              value="in_progress"
                              className="text-xs font-bold"
                            >
                              In Progress
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          disabled
                          className="h-10 px-8 bg-[#A7F3D0] text-white font-bold text-xs rounded-lg opacity-100 shadow-none cursor-not-allowed"
                          onClick={() => {
                            if (status !== "resolved" && status !== "closed") {
                              dispatch(
                                adminReplyToTicket({
                                  ticketId,
                                  reply:
                                    "Re-opening ticket for further discussion.",
                                  status,
                                }),
                              );
                            }
                          }}
                        >
                          Send Email Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* 3. SIDEBAR (RIGHT) */}
            <aside className="lg:col-span-3 space-y-4">
              {/* User Profile Card */}
              <div className="bg-white rounded-xl border border-slate-300/60/80 shadow-sm p-6 text-center overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-app-primary2 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />

                <div className="border-b border-slate-300/60 pb-3.5 mb-5">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full border-2 border-white shadow-sm overflow-hidden relative">
                    <img
                      src={avatar}
                      alt={user.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-lg font-bold capitalize text-foreground/90 mb-1 flex items-center justify-center gap-2">
                    {user.nickname || "User Name"}
                    {user.age && (
                      <span className="text-slate-400 font-bold">
                        , {user.age}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Email Address
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {user.email || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Joined
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {ticket.createdAt
                        ? format(new Date(ticket.createdAt), "dd MMM, yyyy")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Details Card */}
              <div className="bg-white rounded-xl border border-slate-300/60/80 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 mb-4 border-b border-slate-300/60 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Ticket Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Category
                    </span>
                    <span className="text-xs font-black text-slate-900 capitalize">
                      {ticket.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Priority
                    </span>
                    <Badge className="bg-red-50 text-red-600 border-none text-[10px] font-black uppercase">
                      High Urgent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Report Source
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {ticket.reportSource || "In-App Chat Screen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl border border-slate-300/60/80 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 mb-4 border-b border-slate-300/60">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        "/admin/management/users-management/view-profile",
                        {
                          state: {
                            userId: ticket?.user.userId,
                            source: "support",
                            from: `/admin/management/support/view-ticket/${ticketId}`,
                            returnState: { ticketId },
                          },
                        },
                      )
                    }
                    className="w-full justify-center gap-3 h-10 text-[11px] font-bold text-slate-600 hover:bg-app-primary3 hover:text-app-primary2 hover:border-app-primary2 rounded-md transition-all group"
                  >
                    <User className="w-4 h-4 text-slate-400 group-hover:text-app-primary2 transition-colors" />
                    View User Profile
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-10 text-[11px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-500/50 rounded-md transition-all group"
                  >
                    <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                    Ban Target User
                  </Button> */}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>

      {successMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-200 shadow-xl">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-bold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-700 hover:text-red-500 rounded-full flex items-center justify-center shadow-lg border border-slate-300/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

// Sub-components
const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
  isExpanded,
}) => {
  const editorRef = useRef(null);

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  // Sync value if changed externally (e.g. on submit success)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (value === "") {
        editorRef.current.innerHTML = "";
      }
    }
  }, [value]);

  return (
    <div className="relative group">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`${className} outline-none overflow-y-auto whitespace-pre-wrap transition-all duration-300 custom-scrollbar`}
        style={{
          height: isExpanded ? "450px" : "150px",
        }}
        dangerouslySetInnerHTML={{ __html: value === "" ? "" : undefined }}
      />
      {value === "" && (
        <div className="absolute top-3 left-4 text-slate-400 pointer-events-none text-sm italic">
          {placeholder}
        </div>
      )}
    </div>
  );
};

const ErrorState = ({ message }) => (
  <AdminResourceNotFound
    title="Failed to Load"
    description={
      message || "There was an error while trying to fetch the ticket details."
    }
    icon={ShieldAlert}
    backLabel="Try Again"
  />
);

const EmptyState = () => (
  <AdminResourceNotFound
    title="Ticket Not Found"
    description="The ticket you're looking for doesn't exist or has been removed from the system."
    icon={TicketIcon}
    backLabel="Return to Inbox"
    backPath="/admin/management/support"
  />
);
