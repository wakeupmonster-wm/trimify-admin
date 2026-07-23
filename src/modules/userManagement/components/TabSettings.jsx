import React, { useState } from "react";
import { Send } from "lucide-react";
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
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-3.5">
        <Card
          title="Direct Administrative Messaging"
          subtitle="Dispatch warning letters, policy updates, or direct notifications"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
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
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Email Subject
                </Label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Important account update"
                  className="h-9 w-full rounded-lg border-slate-200 bg-white px-3 text-[12.5px] font-medium text-slate-700 placeholder:text-slate-400 focus-visible:border-[#007FC0] focus-visible:ring-1 focus-visible:ring-[#007FC0]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Message Body
              </Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email content here (HTML supported)..."
                className="min-h-[140px] w-full resize-y rounded-lg border-slate-200 bg-white p-3 text-[12.5px] font-medium text-slate-700 placeholder:text-slate-400 focus-visible:border-[#007FC0] focus-visible:ring-1 focus-visible:ring-[#007FC0]"
              />
            </div>

            <div className="mt-1">
              <Button className="h-9 w-max rounded-xl border border-[#007FC0] bg-[#007FC0] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:border-[#006699] hover:bg-[#006699]">
                <Send className="mr-2 h-3.5 w-3.5 shrink-0" />
                Send Message
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3.5">
        <Card
          title="Live Preview"
          subtitle="How the user will see this message"
          right={
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#007FC0]">
              {channel === "push" ? "Push" : "Email"}
            </span>
          }
        >
          {/* Mock Window */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-3 py-2">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#FF5F56]"></div>
                <div className="h-2 w-2 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-2 w-2 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="max-w-[150px] truncate text-[10px] font-medium text-slate-400">
                {subject ? `Subject: ${subject}` : "(No Subject)"}
              </div>
            </div>

            {/* Window Content */}
            <div className="bg-white p-4">
              <div className="mb-3 flex items-center gap-2.5 border-b border-slate-50 pb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#007FC0] text-xs font-bold text-white">
                  T
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[11.5px] font-bold text-slate-900">
                    Trimify Support
                  </div>
                  <div className="truncate text-[10px] text-slate-500">
                    support@trimify.com
                  </div>
                </div>
              </div>
              <div
                className="whitespace-pre-wrap text-[11.5px] leading-relaxed text-slate-600"
                style={{ minHeight: "60px" }}
              >
                {body || "Message body preview will appear here..."}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
