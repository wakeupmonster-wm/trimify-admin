import React, { useState, useMemo } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Send, Bell, Loader2 } from "lucide-react";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useDispatch, useSelector } from "react-redux";
import CampaignHistory from "../components/campaign.history";
import {
  fetchCampaignHistory,
  sendPushCampaign,
  sendEmailCampaign,
} from "../store/campaigns.slice";
import { useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "sonner";

const NotificationManagePage = () => {
  const dispatch = useDispatch();
  const { campaignHistory, campaignPagination, isSending } = useSelector(
    (state) => state.campaigns,
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [activeTab, setActiveTab] = useState("push");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageText, setMessageText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [pushTitle, setPushTitle] = useState("");
  const [target, setTarget] = useState("all");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // `campaignPagination.total` is scoped to whatever channel/status/search
  // filters are currently applied (it's the matching row count, not a
  // grand total), so using it directly for "Total Campaigns" makes that
  // number shift every time the Email/Push KPI is clicked. This is set
  // below only when no filters/search are applied, and stays frozen at
  // that value while a filter is active.
  const [pinnedTotalCampaigns, setPinnedTotalCampaigns] = useState(null);

  useEffect(() => {
    if (activeTab === "history") {
      const noFiltersApplied =
        channelFilter === "all" && statusFilter === "all" && !debouncedSearchTerm;
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      };
      if (channelFilter !== "all") params.channel = channelFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      dispatch(fetchCampaignHistory(params)).then((result) => {
        const total = result?.payload?.pagination?.total;
        if (noFiltersApplied && total != null) {
          setPinnedTotalCampaigns(total);
        }
      });
    }
  }, [
    dispatch,
    activeTab,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    channelFilter,
    statusFilter,
  ]);

  const handlePreCheck = () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name.");
      return;
    }
    if (!messageText.trim()) {
      toast.error("Please enter a message content.");
      return;
    }
    if (activeTab === "email" && !emailSubject.trim()) {
      toast.error("Please enter an email subject.");
      return;
    }
    if (activeTab === "push" && !pushTitle.trim()) {
      toast.error("Please enter a push notification title.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleSendNotification = async () => {
    setIsConfirmOpen(false);

    if (activeTab === "email") {
      const payload = {
        campaign_name: campaignName,
        subject: emailSubject,
        body: messageText,
        target: target,
      };

      const resultAction = await dispatch(sendEmailCampaign(payload));
      if (sendEmailCampaign.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message ||
            "Email campaign queued successfully!",
        );
        setCampaignName("");
        setEmailSubject("");
        setMessageText("");
        setTarget("all");
      } else {
        toast.error(resultAction.payload || "Failed to send email campaign.");
      }
      return;
    }

    // Push notification
    const payload = {
      campaign_name: campaignName,
      title: pushTitle,
      message: messageText,
      target: target,
    };

    const resultAction = await dispatch(sendPushCampaign(payload));
    if (sendPushCampaign.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload?.message || "Push campaign queued successfully!",
      );
      setCampaignName("");
      setPushTitle("");
      setMessageText("");
      setTarget("all");
    } else {
      toast.error(resultAction.payload || "Failed to send push campaign.");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        {/* Header Title */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Notification"
                icon={<Bell className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Create and manage notifications sent to users."
              />
            </div>
          </div>
        </Header>

        <div className="max-w-full">
          {/* TABS */}
          <div className="w-max flex flex-wrap items-center gap-6 border-b border-slate-300/60 mb-6">
            <button
              onClick={() => setActiveTab("push")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "push"
                  ? "text-app-primary2 border-b-2 border-app-primary2"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Push Notification
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "email"
                  ? "text-app-primary2 border-b-2 border-app-primary2"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Email Messaging
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "history"
                  ? "text-app-primary2 border-b-2 border-app-primary2"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Message History
            </button>
          </div>

          {activeTab === "push" || activeTab === "email" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: MESSAGE DETAILS */}
              <div className="lg:col-span-7">
                <div className="border border-slate-300/60 pt-2 shadow-sm rounded-xl overflow-hidden bg-white">
                  <div className="px-4 sm:px-6 py-2 md:py-4 border-b border-slate-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {activeTab === "email"
                        ? "Email Details"
                        : "Push Notification Details"}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                      Configure and dispatch{" "}
                      {activeTab === "email" ? "emails" : "push notifications"}
                    </span>
                  </div>

                  <div className="px-4 sm:px-6 py-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-800">
                        Campaign Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g., Reminder - Riya"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="w-full h-11 bg-[#F8FAFC]/50 border-slate-300/60 rounded-lg px-4 text-[13px] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800">
                          Target Audience
                        </Label>
                        <Select value={target} onValueChange={setTarget}>
                          <SelectTrigger className="w-full h-11 bg-[#F8FAFC]/50 border-slate-300/60 rounded-lg px-4 text-[13px] font-medium">
                            <SelectValue placeholder="Select Target Audience" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem
                              value="all"
                              className="text-xs rounded-lg"
                            >
                              All Users
                            </SelectItem>
                            <SelectItem
                              value="active"
                              className="text-xs rounded-lg"
                            >
                              Active Subscribers
                            </SelectItem>
                            <SelectItem
                              value="expired"
                              className="text-xs rounded-lg"
                            >
                              Expired Plan Users
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {activeTab === "push" && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800">
                          Push Title
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Push Title Here..."
                          value={pushTitle}
                          onChange={(e) => setPushTitle(e.target.value)}
                          className="w-full h-11 bg-[#F8FAFC]/50 border-slate-300/60 rounded-lg px-4 text-[13px] font-medium"
                        />
                      </div>
                    )}

                    {activeTab === "email" && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800">
                          Email Subject
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Subject Here..."
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full h-11 bg-[#F8FAFC]/50 border-slate-300/60 rounded-lg px-4 text-[13px] font-medium"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-800">
                        Message Content
                      </Label>
                      <Textarea
                        placeholder={
                          activeTab === "email"
                            ? "Enter Email Body Here (HTML supported)..."
                            : "Enter Push Message Here..."
                        }
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="min-h-[160px] bg-[#F8FAFC]/50 border-slate-300/60 resize-none font-medium text-[13px] p-4 rounded-lg"
                      />
                    </div>

                    <Button
                      onClick={handlePreCheck}
                      disabled={isSending}
                      className="w-full h-11 bg-app-primary2 hover:bg-app-primary3 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      {isSending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      {isSending
                        ? "Sending..."
                        : activeTab === "email"
                          ? "Send Email"
                          : "Send Push Notification"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT: LIVE PREVIEW */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
                <div className="bg-white border border-slate-300/60 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  {/* Header */}
                  <div className="flex items-center justify-between py-[22px] px-5 border-b border-slate-300/60 bg-white">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Bell size={18} strokeWidth={2.5} />
                      <span className="text-[15px] font-bold">
                        Live Preview
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-app-primary2 text-white">
                      {activeTab === "email" ? "Email" : "Mobile Push"}
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="flex-1 bg-white px-2 py-6 flex justify-center items-center overflow-hidden">
                    {activeTab === "push" ? (
                      <div className="w-full flex justify-center">
                        {/* Phone Mockup */}
                        <div className="relative w-[280px] h-[550px] bg-[#0F172A] rounded-[40px] p-1.5 shadow-2xl border-4 border-[#334155]/20">
                          {/* Screen */}
                          <div className="w-full h-full rounded-[30px] overflow-hidden relative bg-slate-900">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-[#0F172A] rounded-b-[12px] z-20"></div>

                            {/* Wallpaper */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#C084FC] to-[#0EA5E9] opacity-90">
                              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                              <div className="absolute -bottom-20 -left-20 w-[150%] h-[150%] bg-gradient-to-t from-[#0EA5E9]/80 via-transparent to-transparent rounded-[100%] transform -rotate-12 blur-2xl"></div>
                            </div>

                            {/* Notification Banner */}
                            <div className="absolute top-10 left-3 right-3 z-30 transition-all duration-300">
                              <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-[16px] p-3 border border-white/20">
                                <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-slate-500">
                                  <div className="w-[18px] h-[18px] bg-app-primary2 rounded flex items-center justify-center">
                                    <Bell
                                      className="text-white w-2.5 h-2.5"
                                      strokeWidth={3}
                                    />
                                  </div>
                                  <span className="font-medium text-slate-700">
                                    Trimify Admin
                                  </span>
                                  <span>•</span>
                                  <span>now</span>
                                </div>
                                <p className="text-[12px] text-slate-800 line-clamp-3 leading-snug font-medium mt-1 whitespace-pre-wrap">
                                  {pushTitle && (
                                    <strong className="block mb-0.5">
                                      {pushTitle}
                                    </strong>
                                  )}
                                  {messageText ||
                                    "Notification content will appear here..."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center items-start px-2 h-full">
                        {/* Email Mockup */}
                        <div className="w-full max-w-[420px] bg-white border border-slate-300/60 rounded-xl shadow-lg overflow-hidden h-max">
                          {/* Window Topbar */}
                          <div className="bg-slate-100 px-4 py-3 border-b border-slate-300/60 flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                          </div>

                          {/* Email Header Info */}
                          <div className="p-5 border-b border-slate-100">
                            <h3 className="text-[16px] font-bold text-slate-900 mb-3 break-words">
                              {emailSubject || "(No Subject)"}
                            </h3>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-app-primary2 to-app-primary4 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                T
                              </div>
                              <div className="leading-tight">
                                <p className="text-[13px] font-semibold text-slate-900">
                                  Trimify Admin
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  info@trimify.com.au
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Email Body */}
                          <div className="p-5 min-h-[200px] max-h-[300px] overflow-y-auto">
                            {messageText ? (
                              <div className="text-[13px] text-[#334155] leading-[1.6] whitespace-pre-wrap break-words">
                                {messageText}
                              </div>
                            ) : (
                              <span className="text-[13px] text-slate-400 italic">
                                Email content will appear here...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CampaignHistory
              history={campaignHistory || []}
              pagination={campaignPagination || {}}
              paginationState={pagination}
              onPaginationChange={setPagination}
              channelFilter={channelFilter}
              setChannelFilter={setChannelFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={globalFilter}
              setSearchTerm={setGlobalFilter}
              pinnedTotalCampaigns={pinnedTotalCampaigns}
            />
          )}
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSendNotification}
        title="Confirm Campaign"
        type="brand"
        loading={isSending}
        confirmText="Yes, Send Now"
        message={
          <div className="space-y-3 mt-2 text-left">
            <p>
              Are you sure you want to send this{" "}
              <strong>
                {activeTab === "email" ? "Email" : "Push Notification"}
              </strong>{" "}
              campaign?
            </p>
            {/* <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <p className="flex justify-between items-center">
                <strong className="text-slate-800">Name:</strong>
                <span className="font-medium">{campaignName}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong className="text-slate-800">Target Audience:</strong>
                <span className="font-medium capitalize">{target}</span>
              </p>
            </div>
            <p className="text-red-500 font-medium text-[11.5px] pt-2">
              This action cannot be undone. Notifications will be queued
              immediately.
            </p> */}
          </div>
        }
      />
    </Container>
  );
};

export default NotificationManagePage;
