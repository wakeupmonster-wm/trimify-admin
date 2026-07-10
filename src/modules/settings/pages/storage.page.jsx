import React, { useState } from "react";
import z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { RenderField } from "../components/render.field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  as3Status: z.string().min(1, "AS3 Status is required"),
  as3Key: z.string().min(1, "AS3 Key is required"),
  as3Secret: z.string().min(1, "AS3 Secret is required"),
  as3Region: z.string().min(1, "AS3 Region is required"),
  as3Bucket: z.string().min(1, "AS3 Bucket is required"),
  as3Endpoint: z.string().min(1, "AS3 Endpoint is required"),
  as3CustomDomain: z.string().min(1, "AS3 Custom Domain is required"),
  as3RootPath: z.string().min(1, "AS3 Root Path is required"),
});

export default function StoragePage() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      as3Status: "On",
      as3Key: "AKIA****************",
      as3Secret: "********************************",
      as3Region: "Auto",
      as3Bucket: "hidden-for-demo",
      as3Endpoint: "hidden-for-demo",
      as3CustomDomain: "",
      as3RootPath: "hidden-for-demo",
    },
  });

  const handleSave = () => {
    setLoading(true);
    console.log("Saving Storage Config:", form.getValues());
    setTimeout(() => {
      setLoading(false);
      toast.success("Storage settings saved successfully");
    }, 2000);
  };

  return (
    <div className="w-full">
      <header className="px-2 mb-5 border-b border-slate-200 pb-4">
        <h1 className="text-lg font-bold text-foreground/90">
          Storage Settings
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Configure storage settings for your application.
        </p>
      </header>

      <Form {...form}>
        <form className="space-y-8 px-2 pb-4">
          {/* S3 Status Toggle */}
          <RenderField
            control={form.control}
            name="as3Status"
            label="AS3 Status"
            type="select"
            options={[
              { label: "On", value: "On" },
              { label: "Off", value: "Off" },
            ]}
          />

          {/* AS3 Key & Secret */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RenderField
              control={form.control}
              name="as3Key"
              label="AS3 Key"
              type="text"
              placeholder="AKIA••••••••••••••••"
            />
            <RenderField
              control={form.control}
              name="as3Secret"
              label="AS3 Secret"
              type="password"
              placeholder="••••••••••••••••"
            />
          </div>

          {/* Region & Bucket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RenderField
              control={form.control}
              name="as3Region"
              label="AS3 Region"
              type="select"
              options={[
                { label: "Auto", value: "Auto" },
                { label: "US East (N. Virginia)", value: "us-east-1" },
                { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
              ]}
            />
            <RenderField
              control={form.control}
              name="as3Bucket"
              label="AS3 Bucket"
              type="text"
              placeholder="e.g. my-app-bucket"
            />
          </div>

          {/* Endpoint & Custom Domain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RenderField
              control={form.control}
              name="as3Endpoint"
              label="AS3 Endpoint"
              type="text"
              placeholder="e.g. s3.amazonaws.com"
            />
            <RenderField
              control={form.control}
              name="as3CustomDomain"
              label="AS3 Custom Domain (Optional)"
              type="text"
              placeholder="e.g. https://cdn.mydomain.com"
            />
          </div>

          {/* Root Path */}
          <RenderField
            control={form.control}
            name="as3RootPath"
            label="AS3 Root Path (Optional)"
            type="text"
            placeholder="e.g. uploads/"
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-6 border-slate-200 text-muted-foreground/70 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-50"
              onClick={() => form.reset()}
            >
              Discard Changes
            </Button>
            <Button
              type="button"
              className="h-10 px-6 bg-brand-aqua hover:bg-brand-hoverAqua text-white font-semibold text-[13px] capitalize rounded-md shadow-sm"
              onClick={handleSave}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
