import React, { useEffect } from "react";
import z from "zod";
import { Loader2, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RenderField } from "../components/render.field";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEmailSettingsStatus,
  fetchEmailSettings,
  updateEmailSettingsAction,
} from "../store/email.slice";
import { toast } from "sonner";

// 1. Validation Schema
const formSchema = z.object({
  provider: z.string().min(1, "Required"),
  host: z.string().min(2, "Host is too short"),
  port: z.string().regex(/^\d+$/, "Must be a number"),
  secure: z.string().min(1, "Required"),
  authUser: z.string().email("Invalid email"),
  authPass: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Invalid email"),
  fromName: z.string().min(1, "From name is required"),
});

export default function EmailPage() {
  const dispatch = useDispatch();
  const {
    data: settings,
    successMessage,
    error,
    loading,
  } = useSelector((state) => state.emailSettings);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      host: "",
      port: "",
      secure: "false",
      authUser: "",
      authPass: "",
      fromEmail: "",
      fromName: "",
    },
  });

  // 1. Fetch data on Mount
  useEffect(() => {
    dispatch(fetchEmailSettings());
  }, [dispatch]);

  // 2. Toast notifications for success/error
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(fetchEmailSettings());
      dispatch(clearEmailSettingsStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearEmailSettingsStatus());
    }
  }, [successMessage, error, dispatch]);

  // 3. Data aane par Form reset karein
  useEffect(() => {
    if (settings?.smtp) {
      const smtp = settings.smtp;
      form.reset({
        provider: smtp.provider || "",
        host: smtp.host || "",
        port: String(smtp.port || ""),
        secure: String(smtp.secure ?? "false"),
        authUser: smtp.auth?.user || "",
        authPass: smtp.auth?.pass || "",
        fromEmail: smtp.fromEmail || "",
        fromName: smtp.fromName || "",
      });
    }
  }, [settings, form]);

  // 4. Submit handler — builds the PUT body exactly as the API expects
  const onSubmit = async (values) => {
    const payload = {
      smtp: {
        provider: values.provider,
        host: values.host,
        port: Number(values.port),
        secure: values.secure === "true",
        auth: {
          user: values.authUser,
          pass: values.authPass,
        },
        fromEmail: values.fromEmail,
        fromName: values.fromName,
      },
    };

    dispatch(updateEmailSettingsAction(payload));
  };

  return (
    <div className="w-full">
      <header className="px-2 mb-4 border-b border-slate-200 pb-4">
        <h1 className="text-lg font-bold text-foreground/90">Email Settings</h1>
        <p className="text-xs font-medium text-slate-500">
          Configure email delivery settings for your application.
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-2 pb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Provider */}
            <RenderField
              control={form.control}
              name="provider"
              label="Email Provider"
              type="select"
              options={[
                { label: "Gmail", value: "GMAIL" },
                { label: "SendGrid", value: "SENDGRID" },
                { label: "Amazon SES", value: "AWS_SES" },
                { label: "Custom SMTP", value: "CUSTOM" },
              ]}
            />

            {/* SMTP Host */}
            <RenderField
              control={form.control}
              name="host"
              label="SMTP Host"
              type="text"
              placeholder="e.g. smtp.gmail.com"
            />

            {/* SMTP Port */}
            <RenderField
              control={form.control}
              name="port"
              label="SMTP Port"
              type="text"
              placeholder="e.g. 587"
            />

            {/* Secure */}
            <RenderField
              control={form.control}
              name="secure"
              label="Secure (SSL/TLS)"
              type="select"
              options={[
                { label: "No (STARTTLS)", value: "false" },
                { label: "Yes (SSL)", value: "true" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Auth User */}
            <RenderField
              control={form.control}
              name="authUser"
              label="SMTP Username"
              type="text"
              placeholder="e.g. user@gmail.com"
            />

            {/* Auth Pass */}
            <RenderField
              control={form.control}
              name="authPass"
              label="SMTP Password / App Password"
              type="password"
              placeholder="Enter app password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* From Email */}
            <RenderField
              control={form.control}
              name="fromEmail"
              label="From Email"
              type="text"
              placeholder="e.g. noreply@yourdomain.com"
            />

            {/* From Name */}
            <RenderField
              control={form.control}
              name="fromName"
              label="From Name"
              type="text"
              placeholder="e.g. My App Admin"
            />
          </div>

          {/* Footer Actions matching GeneralPage */}
          <div className="flex items-center justify-end gap-3 pt-5">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-6 border-slate-200 text-muted-foreground/70 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-50"
              onClick={() => form.reset()}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-6 bg-brand-blue hover:bg-brand-hoverAqua text-white font-semibold text-[13px] capitalize rounded-md shadow-sm"
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
