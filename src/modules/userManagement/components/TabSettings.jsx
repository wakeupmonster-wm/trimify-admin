import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  sendPushCampaign,
  sendEmailCampaign,
} from "@/modules/notificationManage/store/campaigns.slice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, Pill, KV, EmptyState } from "./UserProfileShared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  Bell,
  CreditCard,
  User,
  Smartphone,
  Ban,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LuUserRound } from "react-icons/lu";

export function TabSettings({ data }) {
  const { user, handleCopy, initials, fmtDate, truncMid } = data;
  const dispatch = useDispatch();
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const userName = data?.user?.name ? ` - ${data.user.name}` : "";

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-4">
        <Card
          className="p-0 overflow-hidden pb-0.5"
          title="Account Status"
          subtitle="Current status and security details"
          icon={ShieldCheck}
        >
          <KV
            icon={ShieldCheck}
            label="Status"
            value={
              <Pill
                tone={
                  user.status === "Active" || user.status === "1"
                    ? "success"
                    : "neutral"
                }
              >
                {user.status === "1"
                  ? "Active"
                  : user.status === "0"
                    ? "Inactive"
                    : user.status}
              </Pill>
            }
          />
          {/* <KV
            icon={ShieldOff}
            label="Admin Status"
            value={user.admin_status || "—"}
          /> */}
          <KV
            icon={Mail}
            label="Email Verified"
            value={
              user.email_verified_at ? fmtDate(user.email_verified_at) : "No"
            }
          />
          <KV
            icon={Ban}
            label="Revoked"
            value={user.revoked_at ? fmtDate(user.revoked_at) : "No"}
          />
        </Card>

        <Card
          title="Billing & Plan"
          subtitle="Payment methods and history"
          icon={CreditCard}
        >
          <KV
            icon={CreditCard}
            label="Payment Status"
            value={user.paid ? "Paid" : "Unpaid"}
          />
          <KV
            icon={ShieldCheck}
            label="Plan"
            value={
              user.plan ? (
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
                      !user.paid
                        ? "bg-slate-100 text-slate-600"
                        : String(user.plan.title || user.plan)
                              .toLowerCase()
                              .includes("premium")
                          ? "bg-amber-100/50 text-amber-600"
                          : "bg-blue-50 text-app-primary2",
                    )}
                  >
                    {user.paid && <Star className="h-2.5 w-2.5 fill-current" />}
                    {String(user.plan.title || user.plan).toUpperCase()}
                  </div>
                </div>
              ) : (
                "No active plan"
              )
            }
          />
          <KV
            icon={Calendar}
            label="Plan Expiry"
            value={user.plan_expiry ? fmtDate(user.plan_expiry) : "—"}
          />
          <KV
            icon={CreditCard}
            label="Stripe ID"
            value={user.stripe_id || "Not linked"}
          />
          {/* {(!user.transactions || user.transactions.length === 0) && (
            <div className="pt-2">
              <EmptyState icon={CreditCard} title="No transactions yet" />
            </div>
          )} */}
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card
          title="Device & Notifications"
          subtitle="App settings and preferences"
          icon={Smartphone}
        >
          <KV
            icon={Bell}
            label="Notifications"
            value={user.notification_status ? "Enabled" : "Disabled"}
          />
          <KV
            icon={Globe}
            label="Timezone"
            value={user.timezone || "Not set"}
          />

          <KV
            icon={Smartphone}
            label="Device Token"
            value={
              <button
                type="button"
                title={user.device_token}
                onClick={() => handleCopy(user.device_token, "Device token")}
                className="font-mono font-bold transition-colors hover:text-app-primary2"
              >
                {truncMid(user.device_token, 10, 6)}
              </button>
            }
          />
        </Card>

        <Card
          title="Managed By"
          subtitle="Assigned sub-admin details"
          icon={LuUserRound}
        >
          {user.sub_admin ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-500">
                  {initials(user.sub_admin?.name)}
                </div>
                <div>
                  <div className="text-[12.5px] font-bold text-slate-900">
                    {user.sub_admin?.name}
                  </div>
                  <div className="text-[10.5px] font-medium text-slate-500">
                    {user.sub_admin?.designation} · {user.sub_admin?.hospital}
                  </div>
                </div>
              </div>

              <div className="mt-3 px-1">
                <KV icon={Mail} label="Email" value={user.sub_admin?.email} />
                <KV icon={Phone} label="Phone" value={user.sub_admin?.phone} />
                <KV
                  icon={Globe}
                  label="Location"
                  value={user.sub_admin?.location}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={User}
              title="No Sub-Admin Assigned"
              subtitle="This user is not managed by a specific sub-admin."
            />
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-3.5 lg:col-span-2">
        <Card
          title="Direct Administrative Messaging"
          subtitle="Dispatch warning letters, policy updates, or direct notifications"
          icon={Send}
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Select Channel
                </Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="h-11 w-full rounded-lg border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white px-4 text-[13px] font-medium text-slate-900 focus:border-app-primary2 focus:ring-4 focus:ring-app-primary2/10 transition-all">
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {channel === "push" ? "Notification Title" : "Email Subject"}
                </Label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Important account update"
                  className="h-11 w-full rounded-lg border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white px-4 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:border-app-primary2 focus-visible:ring-4 focus-visible:ring-app-primary2/10 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <Label className="text-xs font-semibold text-slate-700">
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
                className="min-h-[160px] w-full resize-y rounded-lg border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white p-4 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:border-app-primary2 focus-visible:ring-4 focus-visible:ring-app-primary2/10 transition-all"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="h-10 rounded-lg bg-app-primary2 px-4 text-xs font-semibold text-white shadow-md shadow-app-primary2/20 transition-all hover:bg-app-primary5 hover:shadow-lg hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="mr-1 h-3.5 w-3.5 shrink-0" />
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
