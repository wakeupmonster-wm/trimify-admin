import React, { useEffect, useState } from "react";
import z from "zod";
import { Save, Loader2 } from "lucide-react";
import LogoUpload from "../components/LogoUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { RenderField } from "../components/render.field";
import { useDispatch, useSelector } from "react-redux";
import {
  clearGeneralSettingsStatus,
  fetchGeneralSettings,
  updateGeneralSettingsAction,
} from "../store/general.slice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  siteName: z.string().min(1, "App name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  termsUrl: z.string().url("Invalid URL").optional(),
  privacyUrl: z.string().url("Invalid URL").optional(),
  playStore: z.string().url("Invalid URL").optional(),
  appStore: z.string().url("Invalid URL").optional(),
});

export default function GeneralPage() {
  const dispatch = useDispatch();
  const {
    list: settings,
    successMessage,
    error,
    loading,
  } = useSelector((state) => state.generalSettings);
  const [selectedFile, setSelectedFile] = useState(null); // Logo file ke liye

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      timezone: "Asia/Sydney",
      termsUrl: "",
      privacyUrl: "",
      playStore: "",
      appStore: "",
    },
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(fetchGeneralSettings());
      dispatch(clearGeneralSettingsStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearGeneralSettingsStatus());
    }
  }, [successMessage, error, dispatch]);

  // 2. Data aane par Form reset karein
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      form.reset({
        siteName: settings?.value?.appName || "",
        timezone: settings?.value?.timezone || "Asia/Sydney",
        termsUrl: settings?.value?.termsUrl || "",
        privacyUrl: settings?.value?.privacyUrl || "",
        playStore: settings?.value?.playStoreUrl || "",
        appStore: settings?.value?.appStoreUrl || "",
      });
    }
  }, [settings, form]);

  // Unified submit handler
  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("appName", values.siteName);
    formData.append("timezone", values.timezone);
    formData.append("termsUrl", values.termsUrl || "");
    formData.append("privacyUrl", values.privacyUrl || "");
    formData.append("playStoreUrl", values.playStore || "");
    formData.append("appStoreUrl", values.appStore || "");

    // Logic for logo
    formData.append("logoUrl", settings?.value?.logo || "");
    if (selectedFile) {
      formData.append("logo", selectedFile);
    }

    // Now dispatch actually works!
    dispatch(updateGeneralSettingsAction(formData));
  };

  // 1. Fetch data on Mount
  useEffect(() => {
    dispatch(fetchGeneralSettings());
  }, [dispatch]);

  return (
    <div className="w-full">
      <header className="px-2 mb-4 border-b border-slate-300/60 pb-4">
        <h1 className="text-lg font-bold text-foreground/90">
          General Settings
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Update your application's basic information and legal links.
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-2 pb-4"
        >
          {/* 1. Logo Section */}
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              <LogoUpload
                currentLogo={settings?.value?.logo}
                onFileSelect={(file) => setSelectedFile(file)}
              />
            </div>
            <div className="flex flex-col justify-center pt-2">
              <h4 className="text-[15px] font-bold text-slate-800">App Logo</h4>
              <p className="text-xs text-slate-400 mt-1">
                Recommended size: 512x512px (PNG or SVG)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 h-9 px-4 border-slate-300/60 text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50"
                onClick={() =>
                  document.getElementById("logo-upload-input")?.click()
                }
              >
                Change Logo
              </Button>
            </div>
          </div>

          {/* 2. Application Name */}
          <div className="space-y-2">
            <RenderField
              control={form.control}
              name="siteName"
              label="Application Name"
              type="text"
              placeholder="Enter application name"
            />
          </div>

          {/* 3. Legal URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <RenderField
              control={form.control}
              name="termsUrl"
              label="Terms & Conditions URL"
              type="text"
              placeholder="https://keenasmustard.com/terms"
            />
            <RenderField
              control={form.control}
              name="privacyUrl"
              label="Privacy Policy URL"
              type="text"
              placeholder="https://keenasmustard.com/privacy"
            />
          </div>

          {/* 4. Store URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <RenderField
              control={form.control}
              name="appStore"
              label="App Store URL (iOS)"
              type="text"
              placeholder="https://apps.apple.com/..."
            />
            <RenderField
              control={form.control}
              name="playStore"
              label="Play Store URL (Android)"
              type="text"
              placeholder="https://play.google.com/..."
            />
          </div>

          {/* 5. Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-6 border-slate-300/60 text-muted-foreground/70 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-50"
              onClick={() => form.reset()}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-6 bg-app-primary2 hover:bg-brand-hoverAqua text-white font-semibold text-[13px] capitalize rounded-md shadow-sm"
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
