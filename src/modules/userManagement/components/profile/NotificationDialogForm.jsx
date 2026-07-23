import React, { useState } from "react";
import { Mail, Bell, Send, Loader2 } from "lucide-react";
import { sendNotificationAPI } from "@/modules/notificationManage/services/notification.services";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const NotificationDialogForm = ({ type, userId, onClose }) => {
  const isEmail = type === "email";
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message content.");
      return;
    }

    if (isEmail) {
      if (!subject.trim()) {
        toast.error("Please enter an email subject.");
        return;
      }
      toast.info("Email messaging API is not available yet.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        message,
        user_id: userId,
      };

      const response = await sendNotificationAPI(payload);
      if (response && response.status === "success") {
        toast.success(response.message || "Notification sent successfully!");
        if (onClose) onClose();
      } else {
        toast.error(response?.message || "Failed to send notification.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send notification.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-slate-300/60 shadow-sm rounded-xl overflow-hidden bg-white">
      <DialogTitle className="sr-only">
        {isEmail ? "Send Email" : "Send Push Notification"}
      </DialogTitle>
      <div className="p-4 sm:p-6 border-b border-slate-300/60 flex items-center bg-slate-50/30 rounded-t-2xl pr-12">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100/60 rounded-3xl text-slate-500 flex items-center justify-center">
            {isEmail ? (
              <Mail className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm capitalize">
              {isEmail ? "Email Details" : "Push Notification Details"}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure and dispatch {isEmail ? "emails" : "push notifications"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-3 pb-5 space-y-5">
        {isEmail && (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-800">
              Email Subject
            </Label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter Subject Here..."
              className="w-full h-11 bg-[#F8FAFC]/50 border border-slate-300/60 rounded-lg px-4 text-[13px] font-medium outline-none focus:border-app-primary2"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-800">
            Message Content
          </Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isEmail
                ? "Enter Email Body Here (HTML supported)..."
                : "Enter Push Message Here..."
            }
            className="min-h-[160px] bg-[#F8FAFC]/50 border-slate-300/60 resize-none font-medium text-[13px] p-4 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onClose && onClose()}
            disabled={isLoading}
            className="flex-1 h-11 border-slate-300/60 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="flex-1 h-11 bg-app-primary2 hover:bg-app-primary5 text-white rounded-lg font-bold text-xs shadow-sm shadow-app-primary2 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {isLoading ? "Sending..." : isEmail ? "Send Email" : "Send Push"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDialogForm;
