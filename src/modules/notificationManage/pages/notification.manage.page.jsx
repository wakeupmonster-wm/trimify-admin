import React, { useState, useMemo } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bell } from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import { getNotificationColumns } from "@/components/columns/notification.columns";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationList } from "../store/notification.slice";
import { useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

const mockData = [
  {
    id: 1,
    createDate: "2026-04-12T00:00:00Z",
    message: "Your daily workout is waiting for you...",
  },
  { id: 2, createDate: "2026-04-12T00:00:00Z", message: "Happy Sunday..." },
  { id: 3, createDate: "2026-04-12T00:00:00Z", message: "Fitness Check..." },
  { id: 4, createDate: "2026-04-12T00:00:00Z", message: "Stay active..." },
  {
    id: 5,
    createDate: "2026-04-12T00:00:00Z",
    message: "Stay active today—your body will thank you!...",
  },
  {
    id: 6,
    createDate: "2026-04-12T00:00:00Z",
    message: "Stay active today—your body will thank you!...",
  },
  {
    id: 7,
    createDate: "2026-04-11T00:00:00Z",
    message:
      "Your daily workout is waiting for you! 🏋️‍♀️ Don't miss out on your progress—hit the Fitzone and le...",
  },
  {
    id: 8,
    createDate: "2026-04-11T00:00:00Z",
    message:
      "Your daily workout is waiting for you! 🏋️‍♀️ Don't miss out on your progress—hit the Fitzone and le...",
  },
];

const NotificationManagePage = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.notificationManage);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  const [activeTab, setActiveTab] = useState("push");
  const [messageText, setMessageText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  useEffect(() => {
    if (activeTab === "history") {
      dispatch(
        fetchNotificationList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm,
        }),
      );
    }
  }, [
    dispatch,
    activeTab,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
  ]);

  const columns = useMemo(() => getNotificationColumns(), []);

  return (
    <Container>
      <div className="space-y-8">
        {/* Header Title */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Notification"
              icon={<Bell className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Create and manage notifications sent to users."
            />
          </div>
        </Header>

        <div className="mx-auto">
          {/* TABS */}
          <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab("push")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "push"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Push Notification
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "email"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Email Messaging
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 text-[13px] font-semibold transition-all px-2 relative ${
                activeTab === "history"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              Message History
            </button>
          </div>

          {(activeTab === "push" || activeTab === "email") ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: MESSAGE DETAILS */}
              <div className="lg:col-span-7">
                <div className="border border-slate-200 pt-2 shadow-sm rounded-xl overflow-hidden bg-white">
                  <div className="px-4 sm:px-6 py-2 md:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {activeTab === "email" ? "Email Details" : "Push Notification Details"}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                      Configure and dispatch {activeTab === "email" ? "emails" : "push notifications"}
                    </span>
                  </div>

                  <div className="px-4 sm:px-6 py-6 space-y-6">
                    {activeTab === "email" && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800">
                          Email Subject
                        </Label>
                        <input
                          type="text"
                          placeholder="Enter Subject Here..."
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full h-11 bg-[#F8FAFC]/50 border border-slate-200 rounded-lg px-4 text-[13px] font-medium outline-none focus:border-brand-blue"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-800">
                        Message Content
                      </Label>
                      <Textarea
                        placeholder={activeTab === "email" ? "Enter Email Body Here (HTML supported)..." : "Enter Push Message Here..."}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="min-h-[160px] bg-[#F8FAFC]/50 border-slate-200 resize-none font-medium text-[13px] p-4 rounded-lg"
                      />
                    </div>

                    <Button className="w-full h-11 bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-lg font-bold text-xs shadow-sm shadow-brand-blue flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                      <Send size={18} />
                      {activeTab === "email" ? "Send Email" : "Send Push Notification"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT: LIVE PREVIEW */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  {/* Header */}
                  <div className="flex items-center justify-between py-[22px] px-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Bell size={18} strokeWidth={2.5} />
                      <span className="text-[15px] font-bold">
                        Live Preview
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-blue text-white">
                      {activeTab === "email" ? "Email" : "Mobile Push"}
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="flex-1 bg-[#F8FAFC] px-2 py-6 flex justify-center items-center overflow-hidden">
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
                                  <div className="w-[18px] h-[18px] bg-brand-blue rounded flex items-center justify-center">
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
                        <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden h-max">
                          {/* Window Topbar */}
                          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-1.5">
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
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-hoverBlue flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                T
                              </div>
                              <div className="leading-tight">
                                <p className="text-[13px] font-semibold text-slate-900">
                                  Trimify Admin
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  noreply@trimify.com
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
            <div className="pt-2">
              <DataTable
                columns={columns}
                data={notifications || []}
                rowCount={
                  serverPagination
                    ? serverPagination.total
                    : notifications?.length || 0
                }
                pagination={pagination}
                onPaginationChange={setPagination}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                searchPlaceholder="Search notifications..."
                itemName="entries"
                isLoading={loading}
                manualPagination={!!serverPagination}
                manualFiltering={!!serverPagination}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotificationManagePage;
