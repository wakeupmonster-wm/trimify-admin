import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  sendPushCampaign,
  sendEmailCampaign,
} from "@/modules/notificationManage/store/campaigns.slice";
import { Card } from "./UserProfileView";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TabSettings({ data }) {
  const dispatch = useDispatch();
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("data: ", data);

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error(
        channel === "push"
          ? "Please enter a notification title"
          : "Please enter an email subject",
      );
      return;
    }
    if (!body.trim()) {
      toast.error("Please enter a message body");
      return;
    }

    setIsLoading(true);

    try {
      const userName = data?.first_name ? ` - ${data.first_name}` : "";

      if (channel === "push") {
        const payload = {
          campaign_name: `${subject}${userName}`,
          title: subject,
          message: body,
          target: "specific",
          user_ids: [data?.user?.id],
        };
        const resultAction = await dispatch(sendPushCampaign(payload));
        if (sendPushCampaign.fulfilled.match(resultAction)) {
          toast.success("Push notification sent successfully");
          setSubject("");
          setBody("");
        } else {
          toast.error(
            resultAction.payload || "Failed to send push notification",
          );
        }
      } else {
        const payload = {
          campaign_name: `${subject}${userName}`,
          subject: subject,
          body: body,
          target: "specific",
          user_ids: [data?.user?.id],
        };
        const resultAction = await dispatch(sendEmailCampaign(payload));
        if (sendEmailCampaign.fulfilled.match(resultAction)) {
          toast.success("Email notification sent successfully");
          setSubject("");
          setBody("");
        } else {
          toast.error(
            resultAction.payload || "Failed to send email notification",
          );
        }
      }
    } catch (error) {
      toast.error("An error occurred while sending");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1fr]">
      <div className="flex flex-col gap-3.5">
        <Card
          title="Direct Administrative Messaging"
          subtitle="Dispatch warning letters, policy updates, or direct notifications"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Select Channel
                </Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="h-9 w-full rounded-lg border-slate-200 bg-white px-3 text-[12.5px] font-semibold text-slate-700 focus:border-[#007FC0] focus:ring-1 focus:ring-[#007FC0]">
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {channel === "push" ? "Notification Title" : "Email Subject"}
                </Label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Important account update"
                  className="h-9 w-full rounded-lg border-slate-200 bg-white px-3 text-[12.5px] font-medium text-slate-700 placeholder:text-slate-500 focus-visible:border-[#007FC0] focus-visible:ring-1 focus-visible:ring-[#007FC0]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Message Body
              </Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  channel === "push"
                    ? "Write your push notification message here..."
                    : "Write your email content here (HTML supported)..."
                }
                className="min-h-[140px] w-full resize-y rounded-lg border-slate-200 bg-white p-3 text-[12.5px] font-medium text-slate-700 placeholder:text-slate-500 focus-visible:border-[#007FC0] focus-visible:ring-1 focus-visible:ring-[#007FC0]"
              />
            </div>

            <div className="mt-1">
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="h-9 w-max rounded-md bg-app-primary2 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:border-[#006699] hover:bg-[#006699]"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-3.5 w-3.5 shrink-0" />
                )}
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
