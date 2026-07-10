import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Megaphone, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/headSubhead";
import { AdSection } from "../components/AdSection";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchAdsConfig, updateAdsConfig } from "../store/ads.slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ADSMobPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [originalData, setOriginalData] = useState({ android: {}, ios: {} });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [updateMsg, setUpdateMsg] = useState("");

  const form = useForm({
    defaultValues: {
      android: {
        native: "",
        nativeEveryN: "",
        nativeStatus: "Off",
      },
      ios: {
        native: "",
        nativeEveryN: "",
        nativeStatus: "Off",
      },
    },
  });

  const fromApi = (apiData) => ({
    native: apiData?.native?.id || "",
    nativeEveryN: apiData?.native?.n_item?.toString() || "",
    nativeStatus: apiData?.native?.active ? "On" : "Off",
  });

  const fetchAdsSettings = async () => {
    try {
      setFetching(true);
      const result = await dispatch(fetchAdsConfig()).unwrap();
      console.log("Ads API Data Received:", result);
      const adsData = result;

      if (adsData) {
        const androidMapped = fromApi(adsData.android);
        const iosMapped = fromApi(adsData.ios);

        setOriginalData({ android: androidMapped, ios: iosMapped });
        form.reset({
          android: androidMapped || form.getValues().android,
          ios: iosMapped || form.getValues().ios,
        });
      }
    } catch (error) {
      console.error("Error fetching ads settings:", error);
      toast.error("Failed to fetch ads settings");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAdsSettings();
  }, []);

  const { isDirty, dirtyFields } = form.formState;

  const onConfirmOpen = (data) => {
    let msg = "the selected platforms.";
    if (dirtyFields.android && dirtyFields.ios) {
      msg = "both Android and iOS.";
    } else if (dirtyFields.android) {
      msg = "Android.";
    } else if (dirtyFields.ios) {
      msg = "iOS.";
    }
    setUpdateMsg(msg);
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const confirmSave = () => {
    setIsConfirmOpen(false);
    if (pendingData) {
      handleSave(pendingData);
    }
  };

  const toApi = (platform, formData) => ({
    platform: platform,
    native: {
      id: formData.native,
      active: formData.nativeStatus === "On",
      n_item: Number(formData.nativeEveryN),
    },
  });

  const handleSave = async (data) => {
    try {
      setLoading(true);
      const promises = [];
      
      if (dirtyFields.android) {
        promises.push(dispatch(updateAdsConfig(toApi("android", data.android))).unwrap());
      }
      if (dirtyFields.ios) {
        promises.push(dispatch(updateAdsConfig(toApi("ios", data.ios))).unwrap());
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success("Ads settings updated successfully");
        form.reset(data); // Reset form state to current data
      }
    } catch (error) {
      console.error("Error updating ads settings:", error);
      toast.error("Failed to update ads settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="p-0 min-h-fit h-auto !pb-6">
      <main className="flex-1 w-full">
        <header className="px-2 mb-5 border-b border-slate-200 pb-4">
          <h1 className="text-lg font-bold text-foreground/90">Ads Settings</h1>
          <p className="text-xs font-medium text-slate-500">
            Configure advertisement settings for Android and iOS applications.
          </p>
        </header>

        <Form {...form}>
          <form className="space-y-6 px-2" onSubmit={form.handleSubmit(onConfirmOpen)}>
            {/* Android Section */}
            <AdSection
              title="Android Ads Settings"
              platform="Android"
              icon={<AiFillAndroid size={24} className="text-green-500" />}
              control={form.control}
              placeholders={originalData.android}
            />

            {/* iOS Section */}
            <AdSection
              title="IOS Ads Settings"
              platform="IOS"
              icon={<AiFillApple size={24} className="text-gray-800" />}
              control={form.control}
              placeholders={originalData.ios}
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 px-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-6 border-slate-200 text-muted-foreground/70 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-50"
                onClick={() => form.reset()}
                disabled={loading || fetching || !isDirty}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 bg-brand-aqua hover:bg-brand-hoverAqua text-white font-semibold text-[13px] capitalize rounded-md shadow-sm"
                disabled={loading || fetching || !isDirty}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md bg-white border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800">Confirm Changes</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-2">
                Are you sure you want to save these advertisement settings? This will update the ads configuration for {updateMsg}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 px-6 border-slate-200 text-slate-600 font-semibold rounded-md hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmSave}
                className="h-10 px-6 bg-brand-aqua hover:bg-brand-hoverAqua text-white font-semibold rounded-md shadow-sm"
              >
                Yes, Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Container>
  );
}
